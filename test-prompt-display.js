// Test script to show the exact AI prompt being generated
const fs = require("fs");

// Mock the template system to show what prompt would be generated
const mockTemplate = {
  contractType: "Software Development Agreement",
  keyReviewPoints: [
    {
      category: "Payment Terms",
      description: "Payment schedule, amounts, and conditions for payment",
      mustHave: [
        "Clear payment schedule",
        "Defined milestones",
        "Late payment penalties",
      ],
      shouldAvoid: [
        "Undefined payment terms",
        "Extended payment periods",
        "Subjective completion criteria",
      ],
    },
    {
      category: "Intellectual Property",
      description: "Ownership and licensing of created work products",
      mustHave: [
        "Clear IP ownership",
        "Work-for-hire provisions",
        "License grants",
      ],
      shouldAvoid: [
        "Ambiguous IP ownership",
        "Broad IP assignments",
        "Unlimited license scope",
      ],
    },
  ],
  redFlags: [
    {
      pattern: "NET 90|completion to.*satisfaction",
      severity: "high",
      explanation: "Extended payment terms create cash flow risk",
      affectedParty: "Developer",
      riskScenario:
        "Payment delayed 90+ days after completion, creating severe cash flow pressure for service provider",
      industryContext:
        "Industry standard is NET 30, this triples working capital requirements",
      typicalImpactRange:
        "$10K-$100K+ in cash flow pressure, potential business failure for small agencies",
      whyAsymmetric:
        "Client gets immediate value while provider waits months for payment",
    },
    {
      pattern: "unlimited.*liability|unlimited.*damages",
      severity: "high",
      explanation: "Unlimited liability exposure",
      affectedParty: "Developer",
      riskScenario:
        "Single error could result in bankruptcy-level damages far exceeding contract value",
      industryContext:
        "Software liability typically capped at contract value or 12 months fees",
      typicalImpactRange:
        "Potential losses of $1M+ on $100K project, business-ending exposure",
      whyAsymmetric:
        "Developer bears all risk while client pays fixed fee regardless of complexity",
    },
  ],
  partySpecificConcerns: {
    Client: [
      "Code ownership and delivery",
      "Performance guarantees",
      "Timeline adherence",
      "Support obligations",
    ],
  },
  criticalClauses: [
    "Payment Terms",
    "Intellectual Property Rights",
    "Warranties and Support",
    "Liability and Indemnification",
  ],
};

function buildTemplateGuidance(template, partyRole, extractedParties) {
  let guidance = `\n=== ${template.contractType.toUpperCase()} ANALYSIS FRAMEWORK ===\n`;

  // Key Review Points
  guidance += `\nKEY REVIEW AREAS:\n`;
  template.keyReviewPoints.forEach((point, index) => {
    guidance += `${index + 1}. ${point.category}\n`;
    guidance += `   Description: ${point.description}\n`;
    guidance += `   Must Have: ${point.mustHave.slice(0, 3).join(", ")}${point.mustHave.length > 3 ? "..." : ""}\n`;
    guidance += `   Should Avoid: ${point.shouldAvoid.slice(0, 3).join(", ")}${point.shouldAvoid.length > 3 ? "..." : ""}\n\n`;
  });

  // Red Flags to Watch For
  guidance += `RED FLAGS TO DETECT:\n`;
  template.redFlags.forEach((flag, index) => {
    guidance += `${index + 1}. [${flag.severity.toUpperCase()}] ${flag.pattern}\n`;
    guidance += `   Risk: ${flag.explanation}\n`;
    guidance += `   Affects: ${flag.affectedParty}\n`;
    if (flag.riskScenario) {
      guidance += `   Scenario: ${flag.riskScenario}\n`;
    }
    if (flag.industryContext) {
      guidance += `   Industry Context: ${flag.industryContext}\n`;
    }
    if (flag.typicalImpactRange) {
      guidance += `   Typical Impact: ${flag.typicalImpactRange}\n`;
    }
    if (flag.whyAsymmetric) {
      guidance += `   Why Asymmetric: ${flag.whyAsymmetric}\n`;
    }
    guidance += `\n`;
  });

  // Party-Specific Concerns
  if (template.partySpecificConcerns[partyRole]) {
    guidance += `SPECIFIC CONCERNS FOR ${partyRole.toUpperCase()}:\n`;
    template.partySpecificConcerns[partyRole].forEach((concern, index) => {
      guidance += `${index + 1}. ${concern}\n`;
    });
    guidance += `\n`;
  }

  // Critical Clauses
  guidance += `CRITICAL CLAUSES TO EXAMINE:\n`;
  template.criticalClauses.forEach((clause, index) => {
    guidance += `${index + 1}. ${clause}\n`;
  });

  return guidance;
}

// Generate the exact prompt that would be sent to Claude
function generatePrompt() {
  const contractText = fs.readFileSync("./test-contract.txt", "utf8");
  const contractType = "Software Development Agreement";
  const partyRole = "Client";
  const extractedParties = {};

  const templateGuidance = buildTemplateGuidance(
    mockTemplate,
    partyRole,
    extractedParties,
  );

  const prompt = `You are a legal expert conducting template-enhanced analysis for a ${contractType}.

CONTEXT:
- Contract Type: ${contractType}
- Analysis Perspective: ${partyRole}
${
  Object.keys(extractedParties).length > 0
    ? `- Contract Parties: ${Object.entries(extractedParties)
        .map(([role, name]) => `${role}: ${name}`)
        .join(", ")}`
    : ""
}

CONTRACT TEXT:
${contractText}

TEMPLATE FRAMEWORK:
${templateGuidance}

INSTRUCTIONS:
You must systematically check this contract against the template framework above. The framework now includes detailed risk scenarios, industry context, and quantified impact ranges for each red flag. Focus ONLY on template-defined concerns:

1. Check each KEY REVIEW AREA for compliance and risks
2. Scan for all RED FLAG PATTERNS mentioned in the framework  
3. Use the provided risk scenarios, industry context, and impact ranges to create comprehensive business-focused risk descriptions
4. Verify presence/absence of CRITICAL CLAUSES
5. Apply PARTY-SPECIFIC CONCERNS for the ${partyRole}
6. Adapt the provided impact ranges to this specific contract's context and dollar amounts

For each template-based risk found, provide:
- Clear business-focused title (avoid legal jargon)
- Category from the template framework
- Severity based on business impact to ${partyRole}
- Detailed description of 50-150 words that:
  1. Explains exactly what the contract says or fails to say
  2. Analyzes why this specific provision harms the ${partyRole}
  3. Describes realistic scenarios of how this could negatively impact their business
  4. Quantifies potential consequences where possible
  5. Provides industry context for why this is problematic
  
  Do not include recommendations in the description. Focus on thoroughly explaining the risk itself.
- Separate recommendation field with specific business actions to take

Return ONLY template-specific findings in this JSON format:
{
  "risks": [
    {
      "title": "Template-based risk title",
      "category": "Template framework category",
      "severity": "high|medium|low",
      "description": "Detailed risk analysis (50-150 words) explaining what the contract says/fails to say, why it harms this party, realistic negative scenarios, quantified consequences, and industry context. Do not include recommendations.",
      "recommendation": "Specific actionable steps to mitigate this risk",
      "clauseLocation": "Section reference if found",
      "relatedText": "Relevant contract text",
      "templateSource": "Which template element triggered this risk"
    }
  ],
  "templateAnalysis": {
    "coveredReviewPoints": ["template review points found in contract"],
    "identifiedRedFlags": ["template red flags detected"],
    "missingClauses": ["critical template clauses missing from contract"]
  }
}

Be thorough but only report risks specifically defined in the template framework.`;

  return prompt;
}

// Display the prompt
console.log("=== EXACT AI PROMPT BEING SENT TO CLAUDE ===\n");
console.log(generatePrompt());
console.log("\n=== END OF PROMPT ===");

// Show character count
const prompt = generatePrompt();
console.log(`\nPrompt Length: ${prompt.length} characters`);
console.log(`Estimated Tokens: ~${Math.ceil(prompt.length / 4)} tokens`);
