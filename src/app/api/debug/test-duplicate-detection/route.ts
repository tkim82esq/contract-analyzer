import { NextRequest, NextResponse } from "next/server";

interface Risk {
  id: number;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  source?: 'template' | 'ai_insight' | 'hybrid';
  recommendation: string;
}

interface DuplicationConfig {
  similarityThreshold: number;
  titleWeight: number;
  descriptionWeight: number;
  categoryWeight: number;
  enableManualOverrides: boolean;
}

// Import the duplicate detection logic from ai-analyzer
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = text1
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);
  const words2 = text2
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);

  if (words1.length === 0 || words2.length === 0) return 0;

  const commonWords = words1.filter((word) => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

function detectDuplicateRiskDetailed(
  aiRisk: Risk,
  templateRisks: Risk[],
  config: DuplicationConfig
): {
  isDuplicate: boolean;
  matchedRisk: Risk | null;
  similarityScore: number;
  comparisonDetails: {
    titleSimilarity: number;
    descriptionSimilarity: number;
    categorySimilarity: number;
    overallSimilarity: number;
    templateRiskTitle: string;
    aiRiskTitle: string;
  };
  reason: string;
} {
  let bestMatch: Risk | null = null;
  let highestSimilarity = 0;
  let bestComparisonDetails = {
    titleSimilarity: 0,
    descriptionSimilarity: 0,
    categorySimilarity: 0,
    overallSimilarity: 0,
    templateRiskTitle: '',
    aiRiskTitle: aiRisk.title
  };

  for (const templateRisk of templateRisks) {
    const titleSimilarity = calculateTextSimilarity(aiRisk.title, templateRisk.title);
    const descriptionSimilarity = calculateTextSimilarity(aiRisk.description, templateRisk.description);
    const categorySimilarity = aiRisk.category.toLowerCase() === templateRisk.category.toLowerCase() ? 1.0 : 0.0;

    // Weighted similarity calculation using config
    const overallSimilarity = (
      titleSimilarity * config.titleWeight +
      descriptionSimilarity * config.descriptionWeight +
      categorySimilarity * config.categoryWeight
    );

    const comparisonDetails = {
      titleSimilarity,
      descriptionSimilarity,
      categorySimilarity,
      overallSimilarity,
      templateRiskTitle: templateRisk.title,
      aiRiskTitle: aiRisk.title
    };

    if (overallSimilarity > highestSimilarity) {
      highestSimilarity = overallSimilarity;
      bestMatch = templateRisk;
      bestComparisonDetails = comparisonDetails;
    }
  }

  const isDuplicate = highestSimilarity > config.similarityThreshold;
  
  const reason = isDuplicate 
    ? `High similarity (${(highestSimilarity * 100).toFixed(1)}% > ${(config.similarityThreshold * 100).toFixed(1)}%) with template risk "${bestMatch?.title}"`
    : `Low similarity (${(highestSimilarity * 100).toFixed(1)}% ≤ ${(config.similarityThreshold * 100).toFixed(1)}%) - keeping as unique risk`;

  return {
    isDuplicate,
    matchedRisk: bestMatch,
    similarityScore: highestSimilarity,
    comparisonDetails: bestComparisonDetails,
    reason
  };
}

export async function POST(request: NextRequest) {
  try {
    const { templateRisks, generalRisks, config } = await request.json();

    // Validate input
    if (!Array.isArray(templateRisks) || !Array.isArray(generalRisks)) {
      return NextResponse.json(
        { error: "templateRisks and generalRisks must be arrays" },
        { status: 400 }
      );
    }

    if (!config) {
      return NextResponse.json(
        { error: "config object is required" },
        { status: 400 }
      );
    }

    // Default configuration if not provided
    const defaultConfig: DuplicationConfig = {
      similarityThreshold: 0.6,
      titleWeight: 0.4,
      descriptionWeight: 0.3,
      categoryWeight: 0.3,
      enableManualOverrides: true,
      ...config
    };

    // Test duplicate detection for each general risk
    const results = generalRisks.map((generalRisk: Risk) => {
      return detectDuplicateRiskDetailed(generalRisk, templateRisks, defaultConfig);
    });

    // Calculate summary statistics
    const totalGeneral = generalRisks.length;
    const filteredAsDuplicates = results.filter(r => r.isDuplicate).length;
    const keptAsUnique = results.filter(r => !r.isDuplicate).length;
    const averageSimilarity = results.reduce((sum, r) => sum + r.similarityScore, 0) / results.length;

    // Analyze by severity
    const severityAnalysis = {
      high: {
        total: generalRisks.filter((r: Risk) => r.severity === 'high').length,
        filtered: results.filter(r => r.isDuplicate && generalRisks.find((gr: Risk) => gr.id === generalRisks.indexOf(generalRisks.find((g: Risk) => g.title === r.comparisonDetails.aiRiskTitle)))?.severity === 'high').length
      },
      medium: {
        total: generalRisks.filter((r: Risk) => r.severity === 'medium').length,
        filtered: results.filter(r => r.isDuplicate && generalRisks.find((gr: Risk) => gr.id === generalRisks.indexOf(generalRisks.find((g: Risk) => g.title === r.comparisonDetails.aiRiskTitle)))?.severity === 'medium').length
      },
      low: {
        total: generalRisks.filter((r: Risk) => r.severity === 'low').length,
        filtered: results.filter(r => r.isDuplicate && generalRisks.find((gr: Risk) => gr.id === generalRisks.indexOf(generalRisks.find((g: Risk) => g.title === r.comparisonDetails.aiRiskTitle)))?.severity === 'low').length
      }
    };

    // Category analysis
    const categories = [...new Set([...templateRisks.map((r: Risk) => r.category), ...generalRisks.map((r: Risk) => r.category)])];
    const categoryAnalysis = categories.map(category => ({
      category,
      templateCount: templateRisks.filter((r: Risk) => r.category === category).length,
      generalCount: generalRisks.filter((r: Risk) => r.category === category).length,
      filteredCount: results.filter(r => 
        r.isDuplicate && 
        generalRisks.find((gr: Risk) => gr.title === r.comparisonDetails.aiRiskTitle)?.category === category
      ).length
    }));

    // Recommendations based on analysis
    const recommendations = [];
    
    if (filteredAsDuplicates / totalGeneral > 0.5) {
      recommendations.push({
        type: 'warning',
        message: 'High duplicate filter rate detected. Consider lowering the similarity threshold.',
        suggestedThreshold: Math.max(0.3, defaultConfig.similarityThreshold - 0.2)
      });
    }
    
    if (filteredAsDuplicates === 0) {
      recommendations.push({
        type: 'info',
        message: 'No duplicates detected. Consider raising the threshold if you expect some overlap.',
        suggestedThreshold: Math.min(0.8, defaultConfig.similarityThreshold + 0.1)
      });
    }

    if (averageSimilarity < 0.3) {
      recommendations.push({
        type: 'info',
        message: 'Low average similarity suggests risks are quite different. Current threshold may be appropriate.'
      });
    }

    return NextResponse.json({
      config: defaultConfig,
      results: results.map((result, index) => ({
        ...result,
        generalRisk: generalRisks[index]
      })),
      summary: {
        totalGeneral,
        filteredAsDuplicates,
        keptAsUnique,
        duplicateRate: ((filteredAsDuplicates / totalGeneral) * 100).toFixed(1),
        averageSimilarity: (averageSimilarity * 100).toFixed(1)
      },
      severityAnalysis,
      categoryAnalysis,
      recommendations,
      metadata: {
        timestamp: new Date().toISOString(),
        configUsed: defaultConfig
      }
    });

  } catch (error) {
    console.error("Test duplicate detection error:", error);
    return NextResponse.json(
      { error: "Failed to test duplicate detection" },
      { status: 500 }
    );
  }
}

// Also provide a GET endpoint for testing with sample data
export async function GET() {
  const sampleTemplateRisks: Risk[] = [
    {
      id: 1,
      title: "Unlimited Liability Exposure",
      description: "The contract contains broad indemnification clauses that could expose the company to unlimited financial liability.",
      severity: "high",
      category: "Liability",
      source: "template",
      recommendation: "Add liability caps and carve-outs for certain types of damages."
    },
    {
      id: 2,
      title: "Weak Termination Rights",
      description: "Limited ability to terminate the contract for convenience or cause.",
      severity: "medium",
      category: "Contract Terms",
      source: "template",
      recommendation: "Negotiate stronger termination clauses with reasonable notice periods."
    }
  ];

  const sampleGeneralRisks: Risk[] = [
    {
      id: 3,
      title: "Excessive Liability Provisions",
      description: "The indemnification terms are overly broad and could result in significant financial exposure.",
      severity: "high",
      category: "Liability",
      source: "ai_insight",
      recommendation: "Negotiate more balanced liability allocation."
    },
    {
      id: 4,
      title: "Data Privacy Compliance Gap",
      description: "The contract lacks adequate provisions for data protection and privacy compliance.",
      severity: "medium",
      category: "Compliance",
      source: "ai_insight",
      recommendation: "Add comprehensive data protection clauses."
    }
  ];

  const defaultConfig: DuplicationConfig = {
    similarityThreshold: 0.6,
    titleWeight: 0.4,
    descriptionWeight: 0.3,
    categoryWeight: 0.3,
    enableManualOverrides: true
  };

  return NextResponse.json({
    message: "Sample data for testing duplicate detection",
    sampleData: {
      templateRisks: sampleTemplateRisks,
      generalRisks: sampleGeneralRisks,
      config: defaultConfig
    },
    usage: {
      endpoint: "POST /api/debug/test-duplicate-detection",
      body: {
        templateRisks: "Array of template risks",
        generalRisks: "Array of AI-generated risks",
        config: "Duplicate detection configuration object"
      }
    }
  });
}