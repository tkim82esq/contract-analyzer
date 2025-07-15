import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/document-parser";
import { preprocessContract } from "@/lib/ai-analyzer";
import { CONTRACT_TEMPLATES } from "@/lib/contract-templates";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Get all available contract types from templates
const AVAILABLE_CONTRACT_TYPES = Object.keys(CONTRACT_TEMPLATES);

// Fuzzy string matching function
function fuzzyMatch(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // Exact match
  if (s1 === s2) return 1.0;

  // Contains match
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Word overlap
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter((w) => words2.includes(w));
  const wordOverlap =
    commonWords.length / Math.max(words1.length, words2.length);

  if (wordOverlap > 0.5) return wordOverlap;

  // Levenshtein distance for similarity
  const distance = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  const similarity = 1 - distance / maxLen;

  return similarity;
}

function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1, // substitution
        );
      }
    }
  }

  return dp[m][n];
}

// Get contract type descriptions
function getContractDescription(contractType: string): string {
  const descriptions: { [key: string]: string } = {
    "Employment Agreement":
      "Agreement between an employer and employee defining terms of employment",
    "Service Agreement":
      "Agreement for providing professional or business services",
    "Software as a Service (SaaS) Agreement":
      "Agreement for cloud-based software subscription services",
    NDA: "Agreement to protect confidential information between parties",
    "Sales/Purchase Agreement":
      "Agreement for buying or selling goods or assets",
    "Lease Agreement": "Agreement for renting property or equipment",
    "Loan Agreement": "Agreement for lending money with repayment terms",
    "Independent Contractor Agreement":
      "Agreement for freelance or contract work arrangements",
    "Consulting Agreement": "Agreement for professional consulting services",
    "Non-Compete Agreement":
      "Agreement restricting competition after employment",
    "Severance Agreement":
      "Agreement defining separation terms from employment",
    "Offer Letter": "Formal job offer with employment terms",
    "Software Licensing Agreement": "Agreement granting rights to use software",
    "End User License Agreement (EULA)":
      "Terms for end users of software products",
    "Terms of Service": "Rules and conditions for using a service or platform",
    "Privacy Policy":
      "Policy explaining how personal data is collected and used",
    "Data Processing Agreement (DPA)":
      "Agreement for handling personal data under privacy regulations",
    "Cloud Services Agreement": "Agreement for cloud computing services",
    "API Usage Agreement": "Terms for using application programming interfaces",
    "Website/Mobile App Development Agreement":
      "Agreement for developing digital products",
    "Software Maintenance and Support Agreement":
      "Agreement for ongoing software support",
  };

  return descriptions[contractType] || "Business agreement document";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const manualType = formData.get("manualType") as string;

    if (!file && !manualType) {
      return NextResponse.json(
        { error: "No file or manual type provided" },
        { status: 400 },
      );
    }

    // If manual type provided, find best matches
    if (manualType) {
      const matches = AVAILABLE_CONTRACT_TYPES.map((type) => ({
        type,
        score: fuzzyMatch(manualType, type),
        description: getContractDescription(type),
      }))
        .filter((m) => m.score > 0.3)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((m) => ({
          type: m.type,
          confidence: m.score,
          description: m.description,
        }));

      // If no good matches, include the manual type as is
      if (matches.length === 0) {
        matches.push({
          type: manualType,
          confidence: 1.0,
          description: "Custom contract type as specified",
        });
      }

      return NextResponse.json({
        suggestions: matches,
        analyzed: true,
        method: "fuzzy_match",
      });
    }

    // Extract text from the file
    const text = await extractTextFromFile(file);
    const processedText = preprocessContract(text);

    // Use Claude if API key is available
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const prompt = `You are a legal contract classifier. Analyze this contract and identify what type it is.

CONTRACT TEXT (first 3000 characters):
${processedText.substring(0, 3000)}

Available contract types to choose from:
${AVAILABLE_CONTRACT_TYPES.join(", ")}

Analyze the contract by looking for:
1. Key terminology and legal phrases
2. Party designations (employer/employee, landlord/tenant, etc.)
3. Core obligations and rights
4. Subject matter (employment, services, software, real estate, etc.)
5. Regulatory references (GDPR, HIPAA, etc.)

Return ONLY a JSON response in this exact format:
{
  "detectedTypes": [
    {
      "type": "exact contract type name from the list",
      "confidence": 0.95,
      "keyIndicators": ["list", "of", "key", "terms", "found"]
    }
  ]
}

Provide up to 3 contract types with confidence scores between 0 and 1.`;

        const response = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 1000,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const content = response.content[0];
        if (content.type === "text") {
          const jsonMatch = content.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);

            const suggestions = result.detectedTypes.map((detected: any) => ({
              type: detected.type,
              confidence: detected.confidence || 0.8,
              description: getContractDescription(detected.type),
              keyIndicators: detected.keyIndicators,
            }));

            return NextResponse.json({
              suggestions: suggestions.slice(0, 3),
              analyzed: true,
              method: "ai_analysis",
            });
          }
        }
      } catch (aiError) {
        console.log(
          "Claude analysis failed, falling back to keyword matching:",
          aiError,
        );
      }
    }

    // Fallback to keyword matching
    const lowerText = processedText.toLowerCase();
    const scores = AVAILABLE_CONTRACT_TYPES.map((type) => {
      let score = 0;
      const template = CONTRACT_TEMPLATES[type];

      // Check for contract type in text
      if (lowerText.includes(type.toLowerCase())) {
        score += 0.5;
      }

      // Check for key review points mentions
      if (template) {
        template.keyReviewPoints.forEach((point) => {
          if (lowerText.includes(point.category.toLowerCase())) {
            score += 0.1;
          }
        });

        // Check for critical clauses
        template.criticalClauses.forEach((clause) => {
          if (lowerText.includes(clause.toLowerCase())) {
            score += 0.15;
          }
        });
      }

      // Specific patterns for each type
      const patterns: { [key: string]: string[] } = {
        "Employment Agreement": [
          "employee",
          "employer",
          "salary",
          "benefits",
          "termination",
        ],
        "Service Agreement": [
          "services",
          "deliverables",
          "service provider",
          "service fee",
        ],
        "Software as a Service (SaaS) Agreement": [
          "saas",
          "subscription",
          "cloud",
          "uptime",
        ],
        NDA: ["confidential", "non-disclosure", "proprietary", "trade secret"],
        "Lease Agreement": ["lease", "landlord", "tenant", "rent", "premises"],
        "Loan Agreement": [
          "loan",
          "lender",
          "borrower",
          "interest",
          "repayment",
        ],
      };

      if (patterns[type]) {
        patterns[type].forEach((pattern) => {
          if (lowerText.includes(pattern)) {
            score += 0.2;
          }
        });
      }

      return {
        type,
        score: Math.min(score, 0.95),
        description: getContractDescription(type),
      };
    });

    // Get top 3 matches
    const topSuggestions = scores
      .filter((s) => s.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => ({
        type: s.type,
        confidence: s.score,
        description: s.description,
      }));

    // If no good matches, provide generic suggestions
    if (topSuggestions.length === 0) {
      topSuggestions.push({
        type: "Service Agreement",
        confidence: 0.3,
        description: "Generic agreement for services - please verify",
      });
    }

    return NextResponse.json({
      suggestions: topSuggestions,
      analyzed: true,
      method: "keyword_analysis",
    });
  } catch (error) {
    console.error("Contract type detection error:", error);
    return NextResponse.json(
      { error: "Failed to detect contract type" },
      { status: 500 },
    );
  }
}
