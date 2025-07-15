import Anthropic from "@anthropic-ai/sdk";
import {
  getTemplatePromptAdditions,
  getContractTemplate,
  getPartySpecificRedFlags,
  CONTRACT_TEMPLATES,
  ContractTemplate,
} from "./contract-templates";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Build comprehensive template guidance for AI analysis
function buildTemplateGuidance(
  template: ContractTemplate,
  partyRole: string,
  extractedParties: { [role: string]: string },
): string {
  let guidance = `\n=== ${template.contractType.toUpperCase()} ANALYSIS FRAMEWORK ===\n`;

  // Key Review Points
  guidance += `\nKEY REVIEW AREAS:\n`;
  template.keyReviewPoints.forEach((point, index) => {
    guidance += `${index + 1}. ${point.category}\n`;
    guidance += `   Description: ${point.description}\n`;
    guidance += `   Must Have: ${point.mustHave.join(", ")}\n`;
    guidance += `   Should Avoid: ${point.shouldAvoid.join(", ")}\n\n`;
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

  // Essential Clauses (if available)
  if (template.essentialClauses && template.essentialClauses.length > 0) {
    guidance += `\nESSENTIAL CLAUSES REQUIRED:\n`;
    template.essentialClauses.forEach((clause, index) => {
      guidance += `${index + 1}. ${clause}`;
      if (template.clauseGuidance && template.clauseGuidance[clause]) {
        guidance += ` - ${template.clauseGuidance[clause]}`;
      }
      guidance += `\n`;
    });
  }

  // Advanced Compliance Notes (if available)
  if (template.advancedComplianceNotes) {
    guidance += `\nADVANCED COMPLIANCE CONSIDERATIONS:\n`;

    if (
      template.advancedComplianceNotes.multiJurisdictionalConsiderations
        ?.length > 0
    ) {
      guidance += `Multi-Jurisdictional: ${template.advancedComplianceNotes.multiJurisdictionalConsiderations.join("; ")}\n`;
    }

    if (template.advancedComplianceNotes.federalRegulatoryOverlay?.length > 0) {
      guidance += `Federal Regulatory: ${template.advancedComplianceNotes.federalRegulatoryOverlay.join("; ")}\n`;
    }

    if (
      template.advancedComplianceNotes.industrySpecificRequirements?.length > 0
    ) {
      guidance += `Industry Requirements: ${template.advancedComplianceNotes.industrySpecificRequirements.join("; ")}\n`;
    }
  }

  // Party context if available
  if (Object.keys(extractedParties).length > 0) {
    guidance += `\nCONTRACT PARTY CONTEXT:\n`;
    Object.entries(extractedParties).forEach(([role, name]) => {
      guidance += `${role}: ${name}\n`;
    });
  }

  return guidance;
}

// Build focused template guidance for clause analysis
function buildClauseAnalysisGuidance(
  template: ContractTemplate,
  partyRole: string,
): string {
  let guidance = `\n=== CLAUSE ANALYSIS FRAMEWORK FOR ${template.contractType.toUpperCase()} ===\n`;

  // Critical clauses to prioritize
  guidance += `\nCRITICAL CLAUSES TO EXAMINE:\n`;
  template.criticalClauses.forEach((clause, index) => {
    guidance += `${index + 1}. ${clause}\n`;
  });

  // Key categories from review points
  guidance += `\nKEY REVIEW CATEGORIES:\n`;
  template.keyReviewPoints.forEach((point, index) => {
    guidance += `${index + 1}. ${point.category}\n`;
    guidance += `   Focus: ${point.description.substring(0, 100)}...\n`;
  });

  // Red flags patterns to watch for in clauses
  guidance += `\nRED FLAG PATTERNS IN CLAUSES:\n`;
  template.redFlags.forEach((flag, index) => {
    guidance += `${index + 1}. ${flag.pattern} (${flag.severity})\n`;
  });

  // Party-specific clause concerns
  if (template.partySpecificConcerns[partyRole]) {
    guidance += `\nCLAUSE CONCERNS FOR ${partyRole.toUpperCase()}:\n`;
    template.partySpecificConcerns[partyRole].forEach((concern, index) => {
      guidance += `${index + 1}. ${concern}\n`;
    });
  }

  return guidance;
}

export interface Risk {
  id: number;
  category: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
  mitigation?: {
    action: "add" | "modify" | "remove";
    targetClause: string;
    suggestedText: string;
    explanation: string;
  };
  clauseLocation?: string;
  relatedText?: string;
  source?: "template" | "ai_insight" | "hybrid";
  templateReference?: string;
}

export interface Clause {
  id: number;
  section: string;
  title: string;
  text: string;
  risks: Risk[];
  analysis: string;
}

export interface TemplateAnalysis {
  coveredReviewPoints: string[];
  identifiedRedFlags: string[];
  missingClauses: string[];
}

export interface AnalysisResult {
  summary: {
    totalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    overallRiskLevel: string;
  };
  risks: Risk[];
  clauses?: Clause[];
  contractType: string;
  partyRole: string;
  templateAnalysis?: TemplateAnalysis;
  extractedParties?: { [role: string]: string };
}

// Helper function to generate clause-specific mitigation text
function getClauseMitigationText(
  clauseName: string,
  contractType: string,
): { suggestedText: string; explanation: string } {
  const mitigationMap: {
    [key: string]: { suggestedText: string; explanation: string };
  } = {
    "Limitation of Liability": {
      suggestedText:
        "Neither party's total cumulative liability arising out of or related to this agreement shall exceed the total amounts paid or payable by Client to Service Provider in the twelve (12) months immediately preceding the event giving rise to liability. Neither party shall be liable for indirect, incidental, special, consequential, or punitive damages, lost profits, or lost business opportunities.",
      explanation:
        "This mutual cap protects both parties while maintaining accountability for direct damages",
    },
    "Termination Rights": {
      suggestedText:
        "Either party may terminate this agreement: (a) for material breach upon thirty (30) days written notice if such breach is not cured within the notice period, or (b) for convenience upon ninety (90) days written notice. Upon termination, all payment obligations accrued prior to termination shall survive.",
      explanation:
        "Provides balanced termination rights with adequate notice periods and cure opportunities",
    },
    "Intellectual Property Rights": {
      suggestedText:
        "Client retains all rights, title, and interest in and to its pre-existing intellectual property and data. Service Provider grants Client a non-exclusive license to use any work product developed under this agreement. Each party retains ownership of its respective background intellectual property.",
      explanation:
        "Clarifies IP ownership and prevents disputes over work product and existing assets",
    },
    Confidentiality: {
      suggestedText:
        "Each party acknowledges that it may receive confidential information from the other party. Confidential information shall be kept strictly confidential and used solely for the purposes of this agreement. This obligation shall survive termination for a period of three (3) years.",
      explanation:
        "Protects sensitive business information with mutual confidentiality obligations",
    },
    "Governing Law": {
      suggestedText:
        "This agreement shall be governed by and construed in accordance with the laws of [State/Country], without regard to its conflict of laws principles. The parties consent to the exclusive jurisdiction of the courts located in [City, State] for any disputes arising hereunder.",
      explanation:
        "Establishes clear legal framework and venue for dispute resolution",
    },
    "Force Majeure": {
      suggestedText:
        "Neither party shall be liable for any delay or failure to perform due to causes beyond its reasonable control, including acts of God, natural disasters, war, terrorism, labor disputes, or government actions. The affected party must provide prompt written notice and use reasonable efforts to mitigate the impact.",
      explanation:
        "Protects both parties from liability for unforeseeable events beyond their control",
    },
    "Data Protection": {
      suggestedText:
        "Service Provider shall implement and maintain appropriate technical and organizational security measures to protect Client data, including encryption at rest and in transit. Service Provider shall comply with applicable data protection laws and notify Client of any data breaches within 24 hours of discovery.",
      explanation:
        "Ensures adequate data security and regulatory compliance for sensitive information",
    },
    "Payment Terms": {
      suggestedText:
        "Client shall pay all undisputed invoices within thirty (30) days of receipt. Late payments shall accrue interest at the rate of 1.5% per month. Service Provider may suspend services after ninety (90) days of non-payment following written notice.",
      explanation:
        "Establishes clear payment expectations with reasonable terms for both parties",
    },
    Warranties: {
      suggestedText:
        "Each party represents and warrants that: (a) it has full authority to enter into this agreement, (b) its performance will not violate any third-party rights, and (c) it will perform its obligations in a professional and workmanlike manner consistent with industry standards.",
      explanation:
        "Provides essential assurances about capacity and performance standards",
    },
    // Additional common clauses
    Indemnification: {
      suggestedText:
        "Each party shall indemnify, defend, and hold harmless the other party from and against any claims, damages, losses, and expenses arising from: (a) breach of this agreement, (b) negligent or wrongful acts, or (c) violation of applicable laws. This obligation shall survive termination of this agreement.",
      explanation:
        "Provides mutual protection against third-party claims and legal liability",
    },
    Assignment: {
      suggestedText:
        "Neither party may assign this agreement without the prior written consent of the other party, except that either party may assign this agreement to an affiliate or in connection with a merger, acquisition, or sale of all or substantially all of its assets.",
      explanation:
        "Controls transfer of contractual rights and obligations while allowing business transactions",
    },
    "Dispute Resolution": {
      suggestedText:
        "Any disputes arising under this agreement shall first be addressed through good faith negotiations. If unresolved within thirty (30) days, disputes shall be resolved through binding arbitration under the rules of [Arbitration Organization] in [Location]. Each party shall bear its own costs and fees.",
      explanation:
        "Establishes clear process for resolving disagreements outside of expensive litigation",
    },
    "Entire Agreement": {
      suggestedText:
        "This agreement constitutes the entire agreement between the parties and supersedes all prior or contemporaneous agreements, representations, or understandings, whether written or oral, relating to the subject matter hereof.",
      explanation:
        "Prevents disputes over prior negotiations and ensures contract completeness",
    },
    Amendment: {
      suggestedText:
        "This agreement may only be amended or modified by a written instrument signed by authorized representatives of both parties. No waiver of any provision shall be effective unless in writing and signed by the waiving party.",
      explanation:
        "Requires formal process for changes and prevents inadvertent modifications",
    },
    Severability: {
      suggestedText:
        "If any provision of this agreement is held to be invalid, illegal, or unenforceable, the remaining provisions shall remain in full force and effect, and the invalid provision shall be modified to the minimum extent necessary to make it enforceable.",
      explanation:
        "Preserves contract validity even if individual provisions are found unenforceable",
    },
    Notices: {
      suggestedText:
        "All notices required under this agreement shall be in writing and delivered by certified mail, overnight delivery, or email (with confirmation of receipt) to the addresses set forth below. Notices shall be deemed received when actually received or three (3) days after mailing.",
      explanation:
        "Establishes reliable communication methods for formal notices",
    },
    // Contract-specific clauses
    "Service Level Agreement": {
      suggestedText:
        "Service Provider shall maintain system availability of at least 99.5% uptime per month, measured excluding scheduled maintenance windows announced with 48 hours notice. For each hour of downtime beyond this threshold, Client shall receive service credits equal to 5% of monthly fees for that service.",
      explanation:
        "Sets measurable performance standards with financial incentives for reliable service",
    },
    "Data Ownership": {
      suggestedText:
        "Client retains all rights, title, and interest in and to its data and content. Service Provider is granted a limited license to use Client data solely for providing the services. Service Provider shall not use Client data for any other purpose without express written consent.",
      explanation:
        "Protects client data ownership while allowing necessary service operations",
    },
    "Subscription Terms": {
      suggestedText:
        "This agreement shall commence on the Effective Date and continue for an initial term of [X] months, automatically renewing for successive [X]-month periods unless either party provides [30] days written notice of non-renewal. Fees may be adjusted upon renewal with [60] days notice.",
      explanation:
        "Establishes clear subscription lifecycle with appropriate notice periods",
    },
    // Additional clause types
    "Acceptance Testing": {
      suggestedText:
        "Client shall have thirty (30) days from delivery to test and evaluate deliverables against the acceptance criteria set forth in the project specifications. Acceptance shall not be unreasonably withheld. If Client fails to provide written notice of rejection within the testing period, deliverables shall be deemed accepted.",
      explanation:
        "Establishes clear testing procedures and timeframes to prevent indefinite approval delays",
    },
    "Change Management": {
      suggestedText:
        "Any changes to the scope of work must be documented in a written change order signed by both parties before implementation. Change orders shall specify the additional work, timeline impact, and cost adjustments. No work outside the original scope shall commence without an executed change order.",
      explanation:
        "Prevents scope creep and ensures proper authorization for additional work",
    },
    "Professional Standards": {
      suggestedText:
        "Service Provider shall perform all services in a professional and workmanlike manner in accordance with industry standards and best practices. All work shall be performed by qualified personnel with appropriate skills and experience.",
      explanation:
        "Establishes minimum quality expectations and professional conduct requirements",
    },
    "Record Keeping": {
      suggestedText:
        "Each party shall maintain complete and accurate records related to this agreement for a period of [3] years following termination. Upon reasonable notice, either party may inspect relevant records during normal business hours for compliance verification purposes.",
      explanation:
        "Ensures proper documentation for audit, compliance, and dispute resolution purposes",
    },
  };

  // Return clause-specific mitigation or generic fallback
  return (
    mitigationMap[clauseName] || {
      suggestedText: `[Insert appropriate ${clauseName.toLowerCase()} language based on contract type and party needs]`,
      explanation: `This clause protects both parties by establishing clear terms for ${clauseName.toLowerCase()}`,
    }
  );
}

// Function to check for missing essential clauses and generate risks
function checkMissingEssentialClauses(
  contractText: string,
  template: ContractTemplate,
  contractType: string,
  partyRole: string,
): Risk[] {
  if (!template.essentialClauses || template.essentialClauses.length === 0) {
    return [];
  }

  console.log(
    `Checking ${template.essentialClauses.length} essential clauses for ${contractType}`,
  );

  // Use smart clause detection to identify missing clauses
  const missingClauses = detectMissingClauses(
    contractText,
    template.essentialClauses,
  );

  console.log(
    `Found ${missingClauses.length} missing essential clauses:`,
    missingClauses,
  );

  const missingClauseRisks: Risk[] = missingClauses.map(
    (essentialClause, index) => {
      const mitigation = getClauseMitigationText(essentialClause, contractType);

      return {
        id: index + 1000, // High ID to avoid conflicts
        title: `Missing ${essentialClause}`,
        severity: "high",
        category: "Missing Essential Clause",
        description: `The contract lacks any ${essentialClause.toLowerCase()} provision, which is a standard requirement for ${contractType.toLowerCase()} agreements. This creates significant legal and business risks as there are no defined terms governing ${getClauseRiskDescription(essentialClause)}. Industry standard contracts include this clause to establish clear expectations and protect both parties' interests. Without this provision, disputes may arise over fundamental aspects of the relationship, and ${partyRole.toLowerCase()} may face unexpected legal exposure or operational challenges.`,
        recommendation: `Add a comprehensive ${essentialClause.toLowerCase()} clause to establish clear terms and protect both parties' interests`,
        mitigation: {
          action: "add",
          targetClause: `New Section - ${essentialClause}`,
          suggestedText: mitigation.suggestedText,
          explanation: mitigation.explanation,
        },
        source: "template",
        templateReference: `Essential Clause: ${essentialClause}`,
      };
    },
  );

  return missingClauseRisks;
}

// Smart clause detection patterns using regex for better accuracy
const clauseDetectionPatterns: { [key: string]: RegExp[] } = {
  "Limitation of Liability": [
    /limitation\s+of\s+liability/i,
    /liability\s+(?:is\s+)?(?:limited|capped)/i,
    /maximum\s+liability/i,
    /aggregate\s+liability/i,
    /total\s+liability.*(?:shall\s+not\s+exceed|limited\s+to)/i,
    /damages.*(?:excluded|disclaimed|limited)/i,
    /consequential\s+damages.*(?:excluded|disclaimed)/i,
  ],
  "Termination Rights": [
    /termination/i,
    /terminate\s+(?:this\s+)?agreement/i,
    /end\s+(?:this\s+)?agreement/i,
    /expir(?:e|ation)/i,
    /dissolution/i,
    /cancel(?:lation)?/i,
  ],
  "Intellectual Property Rights": [
    /intellectual\s+property/i,
    /IP\s+rights/i,
    /proprietary\s+rights/i,
    /copyright/i,
    /trademark/i,
    /patent/i,
    /trade\s+secret/i,
    /ownership.*(?:inventions|work\s+product|developments)/i,
  ],
  Confidentiality: [
    /confidential(?:ity)?/i,
    /non-disclosure/i,
    /proprietary\s+information/i,
    /trade\s+secrets/i,
    /confidential\s+information/i,
    /disclosure.*prohibited/i,
  ],
  "Governing Law": [
    /governing\s+law/i,
    /applicable\s+law/i,
    /jurisdiction/i,
    /venue/i,
    /governed\s+by.*law/i,
    /laws\s+of\s+(?:the\s+)?state/i,
  ],
  "Force Majeure": [
    /force\s+majeure/i,
    /acts?\s+of\s+god/i,
    /unforeseeable/i,
    /beyond.*reasonable\s+control/i,
    /natural\s+disaster/i,
    /war.*terrorism/i,
    /government\s+action/i,
  ],
  "Data Protection": [
    /data\s+protection/i,
    /data\s+security/i,
    /privacy/i,
    /GDPR/i,
    /personal\s+data/i,
    /data\s+processing/i,
    /data\s+breach/i,
    /encryption/i,
    /CCPA/i,
    /HIPAA/i,
  ],
  "Payment Terms": [
    /payment/i,
    /invoice/i,
    /billing/i,
    /fees?/i,
    /compensation/i,
    /remuneration/i,
    /due.*(?:days|receipt)/i,
    /late\s+(?:fees?|charges?)/i,
  ],
  "Service Level Agreement": [
    /service\s+level/i,
    /SLA/,
    /uptime/i,
    /availability/i,
    /performance\s+standards/i,
    /response\s+time/i,
    /service\s+credits/i,
    /downtime/i,
  ],
  Warranties: [
    /warrant(?:y|ies|s)/i,
    /represent(?:ation)?s?\b/i,
    /guarantee/i,
    /fitness\s+for.*purpose/i,
    /merchantability/i,
    /disclaim.*warrant/i,
  ],
  Indemnification: [
    /indemnif(?:y|ication)/i,
    /hold\s+harmless/i,
    /defend.*against/i,
    /reimburse.*(?:losses|damages|costs)/i,
  ],
  Assignment: [
    /assign(?:ment)?/i,
    /transfer/i,
    /delegate/i,
    /successor/i,
    /not\s+(?:be\s+)?assign/i,
  ],
  "Dispute Resolution": [
    /dispute\s+resolution/i,
    /arbitration/i,
    /mediation/i,
    /litigation/i,
    /courts?\s+of/i,
    /binding\s+arbitration/i,
    /alternative\s+dispute/i,
  ],
  "Entire Agreement": [
    /entire\s+agreement/i,
    /complete\s+agreement/i,
    /supersede/i,
    /integration\s+clause/i,
    /merger\s+clause/i,
    /prior.*(?:agreements|understandings)/i,
  ],
  Amendment: [
    /amendment/i,
    /modify(?:ing|ication)?/i,
    /change.*agreement/i,
    /written.*(?:consent|agreement)/i,
    /alter(?:ation)?/i,
  ],
  Severability: [
    /severabilit/i,
    /severable/i,
    /unenforceable/i,
    /invalid.*provision/i,
    /blue\s+pencil/i,
    /remainder.*(?:valid|enforceable)/i,
  ],
  Notices: [
    /notice/i,
    /notification/i,
    /written\s+notice/i,
    /certified\s+mail/i,
    /email.*notice/i,
    /delivered?\s+(?:by|to)/i,
  ],
  Compliance: [
    /compliance/i,
    /regulatory/i,
    /applicable\s+laws/i,
    /regulations?/i,
    /legal\s+requirements/i,
  ],
  // Contract-specific clauses
  "Data Ownership": [
    /data\s+ownership/i,
    /customer\s+data/i,
    /data\s+rights/i,
    /own.*data/i,
    /retain.*(?:title|ownership)/i,
  ],
  "Data Security": [
    /data\s+security/i,
    /encryption/i,
    /security\s+measures/i,
    /cyber\s+security/i,
    /security\s+standards/i,
    /access\s+controls/i,
  ],
  "Subscription Terms": [
    /subscription/i,
    /recurring/i,
    /auto-?renewal/i,
    /monthly.*fees?/i,
    /annual.*fees?/i,
    /billing\s+cycle/i,
  ],
  "At-Will Employment": [
    /at-?will/i,
    /employment\s+at\s+will/i,
    /terminated\s+at\s+any\s+time/i,
    /without\s+cause/i,
  ],
  "Compensation and Benefits": [
    /salary/i,
    /wages?/i,
    /benefits?/i,
    /compensation/i,
    /remuneration/i,
    /pay(?:roll|ment)/i,
  ],
  "Independent Contractor": [
    /independent\s+contractor/i,
    /contractor\s+relationship/i,
    /not.*employee/i,
    /1099/i,
    /self-?employed/i,
  ],
  "Scope of Work": [
    /scope\s+of\s+work/i,
    /deliverables?/i,
    /statement\s+of\s+work/i,
    /SOW/,
    /work\s+product/i,
    /services?\s+(?:to\s+be\s+)?(?:provided|performed)/i,
  ],
  Term: [
    /term\s+of.*agreement/i,
    /duration/i,
    /effective\s+period/i,
    /commence.*(?:expire|end)/i,
    /initial\s+term/i,
  ],
  Renewal: [
    /renewal/i,
    /renew/i,
    /extend(?:ing|ed)?/i,
    /automatic.*(?:renewal|extension)/i,
    /successive\s+(?:terms|periods)/i,
  ],
  "Performance Standards": [
    /performance\s+standards/i,
    /quality\s+standards/i,
    /specifications/i,
    /acceptance\s+criteria/i,
    /professional.*manner/i,
  ],
  "Risk Allocation": [
    /risk\s+allocation/i,
    /assumption\s+of\s+risk/i,
    /responsibility/i,
    /bear.*risk/i,
  ],
  Insurance: [
    /insurance/i,
    /coverage/i,
    /policy/i,
    /liability\s+insurance/i,
    /errors?\s+(?:and\s+)?omissions/i,
  ],
  "Background Check": [
    /background\s+check/i,
    /screening/i,
    /verification/i,
    /criminal\s+history/i,
    /reference\s+check/i,
  ],
  // Additional contract-specific patterns
  "Acceptance Testing": [
    /acceptance\s+test/i,
    /UAT/i,
    /user\s+acceptance/i,
    /testing\s+criteria/i,
    /acceptance\s+criteria/i,
    /sign-?off/i,
  ],
  "Change Management": [
    /change\s+(?:management|control|order)/i,
    /modification.*procedure/i,
    /scope\s+change/i,
    /written\s+authorization/i,
    /change\s+request/i,
  ],
  "Delivery and Acceptance": [
    /delivery/i,
    /acceptance/i,
    /milestone/i,
    /deliverable/i,
    /completion/i,
    /handover/i,
  ],
  "Professional Standards": [
    /professional\s+standards/i,
    /industry\s+standards/i,
    /best\s+practices/i,
    /workmanlike\s+manner/i,
    /good\s+faith/i,
    /reasonable\s+care/i,
  ],
  "Record Keeping": [
    /record\s+keeping/i,
    /documentation/i,
    /records?\s+retention/i,
    /audit\s+trail/i,
    /books?\s+and\s+records/i,
  ],
  "Publicity and Marketing": [
    /publicity/i,
    /marketing/i,
    /press\s+release/i,
    /announcement/i,
    /promotional/i,
    /reference\s+customer/i,
    /case\s+study/i,
  ],
};

// Smart clause detection function with improved accuracy
function detectMissingClauses(
  contractText: string,
  essentialClauses: string[],
): string[] {
  const missing: string[] = [];
  const textLower = contractText.toLowerCase();

  for (const clause of essentialClauses) {
    const patterns = clauseDetectionPatterns[clause];
    if (!patterns || patterns.length === 0) {
      // Fallback to simple keyword search if no patterns defined
      const keywords = getClauseKeywordsLegacy(clause);
      const found = keywords.some((keyword) =>
        textLower.includes(keyword.toLowerCase()),
      );
      if (!found) {
        missing.push(clause);
      }
      continue;
    }

    // Use regex patterns for more accurate detection
    const found = patterns.some((pattern) => pattern.test(contractText));
    if (!found) {
      missing.push(clause);
    }
  }

  return missing;
}

// Legacy keyword function for fallback (renamed to avoid confusion)
function getClauseKeywordsLegacy(clauseName: string): string[] {
  const keywordMap: { [key: string]: string[] } = {
    "Limitation of Liability": ["liability", "liable", "damages", "limitation"],
    "Termination Rights": ["termination", "terminate", "end agreement"],
    "Intellectual Property Rights": [
      "intellectual property",
      "ip rights",
      "ownership",
    ],
    Confidentiality: ["confidential", "confidentiality", "non-disclosure"],
    "Governing Law": ["governing law", "applicable law", "jurisdiction"],
    "Force Majeure": ["force majeure", "acts of god", "beyond control"],
    "Data Protection": ["data protection", "data security", "privacy"],
    "Payment Terms": ["payment", "invoice", "billing", "fees"],
    "Service Level Agreement": ["service level", "sla", "uptime"],
    Warranties: ["warrant", "warranty", "represent"],
    Indemnification: ["indemnify", "indemnification", "hold harmless"],
    Assignment: ["assign", "assignment", "transfer"],
    "Dispute Resolution": ["dispute", "arbitration", "mediation"],
    "Entire Agreement": ["entire agreement", "complete agreement", "supersede"],
    Amendment: ["amendment", "modify", "modification"],
    Severability: ["severability", "severable", "unenforceable"],
    Notices: ["notice", "notification", "written notice"],
    Compliance: ["compliance", "regulatory", "laws"],
  };

  return keywordMap[clauseName] || [clauseName.toLowerCase()];
}

// Helper function to get risk description for each clause type
function getClauseRiskDescription(clauseName: string): string {
  const riskMap: { [key: string]: string } = {
    "Limitation of Liability":
      "liability exposure, damage calculations, and financial risk allocation",
    "Termination Rights":
      "contract termination procedures, notice requirements, and end-of-relationship obligations",
    "Intellectual Property Rights":
      "ownership of work products, licensing rights, and proprietary information protection",
    Confidentiality:
      "protection of sensitive business information and trade secrets",
    "Governing Law":
      "legal jurisdiction, applicable laws, and dispute resolution venue",
    "Force Majeure":
      "performance excuses during unforeseeable circumstances and natural disasters",
    "Data Protection":
      "data security measures, privacy compliance, and breach notification procedures",
    "Payment Terms":
      "payment obligations, billing procedures, and collection rights",
    "Service Level Agreement":
      "performance standards, availability requirements, and service quality metrics",
    Warranties:
      "performance guarantees, quality assurances, and mutual representations",
  };

  return (
    riskMap[clauseName] ||
    "fundamental contractual obligations and risk allocation"
  );
}

// Hybrid analysis combining template-specific and general legal analysis
export async function performHybridAnalysis(
  contractText: string,
  contractType: string,
  partyRole: string,
  template: ContractTemplate | null,
  extractedParties: { [role: string]: string } = {},
): Promise<AnalysisResult> {
  console.log(
    `Starting hybrid analysis for ${contractType} from ${partyRole} perspective`,
  );

  let templateRisks: Risk[] = [];
  let generalRisks: Risk[] = [];
  let templateAnalysis: TemplateAnalysis | undefined;

  // Step 1: Template-specific analysis (if template exists)
  if (template) {
    console.log("Performing template-specific analysis...");
    const templateResult = await performTemplateSpecificAnalysis(
      contractText,
      contractType,
      partyRole,
      template,
      extractedParties,
    );
    templateRisks = templateResult.risks;
    templateAnalysis = templateResult.templateAnalysis;

    // Step 1.5: Check for missing essential clauses
    console.log("Checking for missing essential clauses...");
    const missingClauseRisks = checkMissingEssentialClauses(
      contractText,
      template,
      contractType,
      partyRole,
    );

    if (missingClauseRisks.length > 0) {
      console.log(
        `Found ${missingClauseRisks.length} missing essential clauses`,
      );
      templateRisks = [...templateRisks, ...missingClauseRisks];

      // Update template analysis to include missing clauses
      if (templateAnalysis) {
        templateAnalysis.missingClauses = [
          ...templateAnalysis.missingClauses,
          ...missingClauseRisks.map((risk) =>
            risk.title.replace("Missing ", ""),
          ),
        ];
      }
    }
  }

  // Step 2: General legal analysis to catch additional risks
  console.log("Performing general legal analysis...");
  generalRisks = await performGeneralLegalAnalysis(
    contractText,
    contractType,
    partyRole,
    extractedParties,
    templateRisks, // Pass template risks to avoid duplication
  );

  // Step 3: Merge and deduplicate findings
  console.log("Merging and deduplicating findings...");
  const mergedRisks = mergeAndDeduplicateRisks(
    templateRisks,
    generalRisks,
    template,
  );

  // Calculate summary
  const summary = {
    totalRisks: mergedRisks.length,
    highRisks: mergedRisks.filter((r) => r.severity === "high").length,
    mediumRisks: mergedRisks.filter((r) => r.severity === "medium").length,
    lowRisks: mergedRisks.filter((r) => r.severity === "low").length,
    overallRiskLevel: mergedRisks.some((r) => r.severity === "high")
      ? "high"
      : mergedRisks.some((r) => r.severity === "medium")
        ? "medium"
        : "low",
  };

  console.log(
    `Hybrid analysis complete: ${mergedRisks.length} total risks (${templateRisks.length} template + ${generalRisks.length} general)`,
  );

  return {
    summary,
    risks: mergedRisks,
    contractType,
    partyRole,
    templateAnalysis,
    extractedParties,
  };
}

// Enhanced function with template-aware prompting
export async function analyzeContractWithAI(
  contractText: string,
  contractType: string,
  partyRole: string,
  includeClauseBreakdown: boolean = false,
  extractedParties: { [role: string]: string } = {},
  template?: ContractTemplate | null,
): Promise<AnalysisResult> {
  try {
    // Get contract-specific template if not provided
    if (template === undefined) {
      template = getContractTemplate(contractType);
    }

    // Use enhanced analysis approach with template-aware prompting
    return await performEnhancedAnalysis(
      contractText,
      contractType,
      partyRole,
      template || null,
      extractedParties,
    );
  } catch (error) {
    console.error("AI Analysis Error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (
        error.message.includes("401") ||
        error.message.includes("authentication")
      ) {
        throw new Error(
          "Invalid API key. Please check your Anthropic API key in .env.local",
        );
      } else if (
        error.message.includes("404") ||
        error.message.includes("not_found")
      ) {
        throw new Error(
          "Model not found. The AI service may be updating. Using fallback analysis.",
        );
      } else if (
        error.message.includes("429") ||
        error.message.includes("rate_limit")
      ) {
        throw new Error(
          "Rate limit exceeded. Please try again in a few moments.",
        );
      } else if (error.message.includes("insufficient_quota")) {
        throw new Error(
          "API quota exceeded. Please check your Anthropic account credits.",
        );
      }
    }

    // Generic error
    throw new Error(
      "Failed to analyze contract. Please try again or check your API key.",
    );
  }
}

// Enhanced analysis with template-aware prompting
async function performEnhancedAnalysis(
  contractText: string,
  contractType: string,
  partyRole: string,
  template: ContractTemplate | null,
  extractedParties: { [role: string]: string },
): Promise<AnalysisResult> {
  console.log("=== RISK ANALYSIS FLOW ===");
  console.log("Template found:", !!template);
  console.log("Contract type:", contractType);
  console.log("Party role:", partyRole);
  console.log("Extracted parties:", Object.keys(extractedParties));

  let templateRisks: Risk[] = [];
  let generalRisks: Risk[] = [];
  let templateAnalysis: TemplateAnalysis | undefined;

  if (template) {
    const shouldRunTemplate = true;
    const shouldRunGeneral = true;

    console.log("Running template analysis:", shouldRunTemplate);
    console.log("Running general analysis:", shouldRunGeneral);

    // Run both template-specific and general analysis
    console.log("=== STARTING TEMPLATE-SPECIFIC ANALYSIS ===");
    const templateResult = await performTemplateSpecificAnalysis(
      contractText,
      contractType,
      partyRole,
      template,
      extractedParties,
    );
    templateRisks = templateResult.risks;
    templateAnalysis = templateResult.templateAnalysis;
    console.log("Template risks found:", templateRisks?.length);
    console.log("Template analysis:", templateAnalysis);

    console.log("=== STARTING GENERAL ANALYSIS ===");
    generalRisks = await performGeneralLegalAnalysis(
      contractText,
      contractType,
      partyRole,
      extractedParties,
      templateRisks,
    );
    console.log("General risks found:", generalRisks?.length);

    // Merge and deduplicate findings
    console.log("=== MERGING RESULTS ===");
    const mergedRisks = mergeAndDeduplicateRisks(
      templateRisks,
      generalRisks,
      template,
    );
    console.log("Combined total risks:", mergedRisks.length);

    // Log risk breakdown by severity
    const highRisks = mergedRisks.filter((r) => r.severity === "high").length;
    const mediumRisks = mergedRisks.filter(
      (r) => r.severity === "medium",
    ).length;
    const lowRisks = mergedRisks.filter((r) => r.severity === "low").length;

    console.log("Risk breakdown:", {
      high: highRisks,
      medium: mediumRisks,
      low: lowRisks,
    });

    // Log risk sources
    const templateSourceRisks = mergedRisks.filter(
      (r) => r.source === "template" || r.id <= templateRisks.length,
    ).length;
    const generalSourceRisks = mergedRisks.filter(
      (r) => r.source === "ai_insight" || r.id > templateRisks.length,
    ).length;
    const hybridSourceRisks = mergedRisks.filter(
      (r) => r.source === "hybrid",
    ).length;

    console.log("Risk sources:", {
      template: templateSourceRisks,
      general: generalSourceRisks,
      hybrid: hybridSourceRisks,
    });

    // Calculate summary
    const summary = {
      totalRisks: mergedRisks.length,
      highRisks,
      mediumRisks,
      lowRisks,
      overallRiskLevel: mergedRisks.some((r) => r.severity === "high")
        ? "high"
        : mergedRisks.some((r) => r.severity === "medium")
          ? "medium"
          : "low",
    };

    console.log("=== ENHANCED ANALYSIS COMPLETE ===");
    console.log(
      `Final result: ${mergedRisks.length} total risks (${templateRisks.length} template + ${generalRisks.length} general)`,
    );

    return {
      summary,
      risks: mergedRisks,
      contractType,
      partyRole,
      templateAnalysis,
      extractedParties,
    };
  } else {
    console.log("Running template analysis:", false);
    console.log("Running general analysis:", true);

    // General comprehensive analysis only
    console.log("=== STARTING GENERAL COMPREHENSIVE ANALYSIS ===");
    const risks = await performGeneralComprehensiveAnalysis(
      contractText,
      contractType,
      partyRole,
      extractedParties,
    );

    console.log("General risks found:", risks?.length);

    // Calculate summary
    const summary = {
      totalRisks: risks.length,
      highRisks: risks.filter((r) => r.severity === "high").length,
      mediumRisks: risks.filter((r) => r.severity === "medium").length,
      lowRisks: risks.filter((r) => r.severity === "low").length,
      overallRiskLevel: risks.some((r) => r.severity === "high")
        ? "high"
        : risks.some((r) => r.severity === "medium")
          ? "medium"
          : "low",
    };

    console.log("=== ENHANCED ANALYSIS COMPLETE ===");
    console.log(`Final result: ${risks.length} total risks identified`);

    return {
      summary,
      risks,
      contractType,
      partyRole,
      templateAnalysis,
      extractedParties,
    };
  }
}

// General comprehensive analysis for contracts without templates
async function performGeneralComprehensiveAnalysis(
  contractText: string,
  contractType: string,
  partyRole: string,
  extractedParties: { [role: string]: string },
): Promise<Risk[]> {
  const prompt = `ROLE: You are a senior corporate attorney with 20+ years of experience reviewing all types of contracts.

Provide objective analysis based on standard contract principles and market practices. Do not reference specific cases, statistics, or claim personal experience. For each risk, include specific mitigation suggestions with concrete contract language to add, modify, or remove.

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

Identify ALL significant risks, including:
- Missing provisions that should be present
- Ambiguous language that could be interpreted against ${partyRole}
- Unusual terms that deviate from market standards
- Hidden risks in seemingly standard clauses
- Cumulative effect of multiple provisions
- Enforceability concerns
- Practical business risks beyond pure legal issues

For each risk, provide the detailed 50-150 word description as specified.

Do not limit the number of risks. Include every significant issue that could impact the ${partyRole}. A thorough analysis might identify 10-20 risks depending on the contract complexity.

For each significant risk, provide:
- Clear, specific title that reflects standard legal analysis
- Appropriate risk category based on standard practice
- Severity level based on potential impact
- Detailed description of 50-150 words that objectively explains:
  1. Explains exactly what the contract says or fails to say
  2. Analyzes why this specific provision could harm the ${partyRole} based on standard contract principles
  3. Describes realistic scenarios of how such terms could cause business problems
  4. Identifies potential consequences
  5. Provides relevant context based on standard market practices
  
  Do not include recommendations in the description. Focus on thoroughly explaining the risk objectively.
- Separate recommendation field with specific actionable advice
- For each risk, provide specific mitigation:
  Action: whether to add new language, modify existing, or remove
  Target clause: which section/clause to change
  Suggested text: exact contract language to use
  Brief explanation of why this mitigates the risk
- Specific contract language if applicable

You MUST respond with ONLY a valid JSON object, no other text.
Start your response with { and end with }

EXAMPLE FORMAT:
{
  "risks": [
    {
      "title": "Missing Force Majeure Protection",
      "category": "Legal Compliance",
      "severity": "medium",
      "description": "The contract lacks force majeure provisions that would protect the Service Provider from liability during unforeseeable circumstances...",
      "recommendation": "Add comprehensive force majeure clause covering pandemics, natural disasters, and government actions",
      "mitigation": {
        "action": "add",
        "targetClause": "Force Majeure",
        "suggestedText": "Neither party shall be liable for delay or failure to perform due to force majeure events including acts of God, government actions, pandemics, or other circumstances beyond reasonable control.",
        "explanation": "Protects both parties from liability during unforeseeable events"
      },
      "clauseLocation": "Not present",
      "relatedText": "No force majeure provisions found",
      "source": "ai_insight"
    }
  ]
}

Return findings in this exact JSON format. Do not include any explanatory text before or after the JSON.

Identify ALL significant risks that could impact the ${partyRole}. Prioritize risks with substantial financial, legal, or operational consequences, but include all important medium and low risks as well. Do not limit the number of risks - comprehensive analysis is critical.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3500,
      temperature: 0.1,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Invalid response type");
    }

    console.log("General analysis raw response length:", content.text.length);

    // Try multiple JSON extraction methods
    let analysisData;

    try {
      // Method 1: Try direct parsing if response is clean JSON
      const trimmed = content.text.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        console.log("Attempting direct JSON parsing...");
        analysisData = JSON.parse(trimmed);
      } else {
        // Method 2: Extract JSON with regex
        console.log("Attempting regex JSON extraction...");
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error("No JSON found in general analysis response");
          console.error("Raw response:", content.text);
          throw new Error("No JSON found in general analysis response");
        }
        analysisData = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("JSON parsing failed for general analysis");
      console.error("Raw response:", content.text);
      console.error("Parse error:", parseError);

      // Fallback: Return empty results
      console.log("Using fallback empty results for general analysis");
      return [];
    }

    // Validate the parsed data structure
    if (!analysisData || typeof analysisData !== "object") {
      console.error("Invalid analysis data structure:", analysisData);
      return [];
    }

    const risks: Risk[] = (analysisData.risks || []).map(
      (risk: any, index: number) => ({
        id: index + 1,
        category: risk.category || "General",
        severity: risk.severity || "medium",
        title: risk.title || "Risk",
        description: risk.description || "",
        recommendation: risk.recommendation || "",
        mitigation:
          risk.mitigation && typeof risk.mitigation === "object"
            ? risk.mitigation
            : undefined,
        clauseLocation: risk.clauseLocation,
        relatedText: risk.relatedText,
        source: "ai_insight",
      }),
    );

    console.log(`General comprehensive analysis found ${risks.length} risks`);
    return risks;
  } catch (error) {
    console.error("General analysis failed:", error);
    return [];
  }
}

// Template-specific analysis using contract templates
async function performTemplateSpecificAnalysis(
  contractText: string,
  contractType: string,
  partyRole: string,
  template: ContractTemplate,
  extractedParties: { [role: string]: string },
): Promise<{ risks: Risk[]; templateAnalysis: TemplateAnalysis }> {
  const templateGuidance = buildTemplateGuidance(
    template,
    partyRole,
    extractedParties,
  );

  const prompt = `ROLE: You are a senior corporate attorney with 20+ years of experience reviewing all types of contracts.

Provide objective analysis based on standard contract principles and market practices. Do not reference specific cases, statistics, or claim personal experience. For each risk, include specific mitigation suggestions with concrete contract language to add, modify, or remove.

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
Systematically check this agreement against the template framework above using standard contract principles and market practices:

1. Check each KEY REVIEW AREA for compliance and risks based on standard market practices
2. Scan for all RED FLAG PATTERNS and assess enforceability based on standard contract principles
3. Use the provided risk scenarios to create comprehensive business-focused risk descriptions
4. Verify presence/absence of CRITICAL CLAUSES and note standard negotiation points
5. Check for presence/absence of ESSENTIAL CLAUSES REQUIRED - these are fundamental provisions that should be present in all contracts of this type
6. Apply PARTY-SPECIFIC CONCERNS for the ${partyRole} based on standard arrangements
7. Consider the provided impact ranges within this specific contract's context

Pay special attention to the ESSENTIAL CLAUSES REQUIRED section - any missing essential clauses represent significant gaps that should be flagged as high-severity risks.

For each template-based risk found, provide:
- Clear business-focused title (avoid legal jargon)
- Category from the template framework
- Severity based on business impact to ${partyRole}
- Detailed description of 50-150 words that objectively explains:
  1. Explains exactly what the contract says or fails to say
  2. Analyzes why this specific provision could harm the ${partyRole} based on standard contract principles
  3. Describes realistic scenarios of how such terms could cause business problems
  4. Identifies potential consequences
  5. Provides relevant context based on standard market practices
  
  Do not include recommendations in the description. Focus on thoroughly explaining the risk objectively.
- Separate recommendation field with specific business actions
- For each risk, provide specific mitigation:
  Action: whether to add new language, modify existing, or remove
  Target clause: which section/clause to change
  Suggested text: exact contract language to use
  Brief explanation of why this mitigates the risk

You MUST respond with ONLY a valid JSON object, no other text.
Start your response with { and end with }

EXAMPLE FORMAT:
{
  "risks": [
    {
      "title": "Unlimited Liability Exposure",
      "category": "Liability",
      "severity": "high",
      "description": "The contract contains unlimited liability provisions that expose the Service Provider to catastrophic financial risk...",
      "recommendation": "Negotiate liability caps proportional to contract value",
      "mitigation": {
        "action": "modify",
        "targetClause": "Limitation of Liability",
        "suggestedText": "Provider's total liability shall not exceed the fees paid in the 12 months preceding the claim",
        "explanation": "Caps exposure to annual contract value"
      },
      "clauseLocation": "Section 8.1",
      "relatedText": "Provider shall be liable for all damages...",
      "templateSource": "Red Flag: Unlimited liability pattern"
    }
  ],
  "templateAnalysis": {
    "coveredReviewPoints": ["Payment Terms", "Liability Allocation"],
    "identifiedRedFlags": ["Unlimited liability", "Scope creep risk"],
    "missingClauses": ["Force majeure", "Intellectual property"]
  }
}

Return ONLY template-specific findings in this exact JSON format. Do not include any explanatory text before or after the JSON.

Be thorough but only report risks specifically defined in the template framework.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3500,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Invalid response type");
    }

    console.log("Template analysis raw response length:", content.text.length);

    // Try multiple JSON extraction methods
    let analysisData;

    try {
      // Method 1: Try direct parsing if response is clean JSON
      const trimmed = content.text.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        console.log("Attempting direct JSON parsing...");
        analysisData = JSON.parse(trimmed);
      } else {
        // Method 2: Extract JSON with regex
        console.log("Attempting regex JSON extraction...");
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error("No JSON found in template analysis response");
          console.error("Raw response:", content.text);
          throw new Error("No JSON found in template analysis response");
        }
        analysisData = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("JSON parsing failed for template analysis");
      console.error("Raw response:", content.text);
      console.error("Parse error:", parseError);

      // Fallback: Return empty results
      console.log("Using fallback empty results for template analysis");
      return {
        risks: [],
        templateAnalysis: {
          coveredReviewPoints: [],
          identifiedRedFlags: [],
          missingClauses: [],
        },
      };
    }

    // Validate the parsed data structure
    if (!analysisData || typeof analysisData !== "object") {
      console.error("Invalid analysis data structure:", analysisData);
      return {
        risks: [],
        templateAnalysis: {
          coveredReviewPoints: [],
          identifiedRedFlags: [],
          missingClauses: [],
        },
      };
    }

    const risks: Risk[] = (analysisData.risks || []).map(
      (risk: any, index: number) => ({
        id: index + 1,
        category: risk.category || "Template",
        severity: risk.severity || "medium",
        title: risk.title || "Template Risk",
        description: risk.description || "",
        recommendation: risk.recommendation || "",
        mitigation:
          risk.mitigation && typeof risk.mitigation === "object"
            ? risk.mitigation
            : undefined,
        clauseLocation: risk.clauseLocation,
        relatedText: risk.relatedText,
      }),
    );

    const templateAnalysis: TemplateAnalysis = {
      coveredReviewPoints:
        analysisData.templateAnalysis?.coveredReviewPoints || [],
      identifiedRedFlags:
        analysisData.templateAnalysis?.identifiedRedFlags || [],
      missingClauses: analysisData.templateAnalysis?.missingClauses || [],
    };

    console.log(
      `Template analysis found ${risks.length} template-specific risks`,
    );
    return { risks, templateAnalysis };
  } catch (error) {
    console.error("Template analysis failed:", error);
    return {
      risks: [],
      templateAnalysis: {
        coveredReviewPoints: [],
        identifiedRedFlags: [],
        missingClauses: [],
      },
    };
  }
}

// General legal analysis to catch additional risks not in templates
async function performGeneralLegalAnalysis(
  contractText: string,
  contractType: string,
  partyRole: string,
  extractedParties: { [role: string]: string },
  templateRisks: Risk[],
): Promise<Risk[]> {
  // Build list of already-identified risk areas to avoid duplication
  const templateRiskAreas = templateRisks.map((r) => r.category.toLowerCase());

  const prompt = `ROLE: You are a senior corporate attorney with 20+ years of experience reviewing all types of contracts.

Provide objective analysis based on standard contract principles and market practices. Do not reference specific cases, statistics, or claim personal experience. For each risk, include specific mitigation suggestions with concrete contract language to add, modify, or remove.

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

ALREADY IDENTIFIED RISK AREAS (do not duplicate):
${templateRiskAreas.length > 0 ? templateRiskAreas.join(", ") : "None"}

INSTRUCTIONS:
Conduct a comprehensive legal analysis to identify ADDITIONAL risks not covered in the already-identified areas above using standard contract principles and market practices:

1. LEGAL COMPLIANCE: Regulatory, statutory, and jurisdictional risks based on standard legal principles
2. COMMERCIAL TERMS: Pricing, payment, performance obligations compared to standard market practices
3. OPERATIONAL RISKS: Practical implementation concerns based on standard business practices
4. RELATIONSHIP DYNAMICS: Power imbalances and fairness issues in standard commercial arrangements
5. FUTURE CONSIDERATIONS: Change management, dispute resolution, exit strategies based on standard practices
6. INDUSTRY-SPECIFIC RISKS: Legal or commercial concerns specific to this industry based on standard practices

Look for issues that standard commercial practices typically address:
- Unusual or one-sided terms that could be problematic
- Missing standard protections that are routinely negotiated
- Ambiguous language that could cause disputes
- Terms that could become problematic over time
- Regulatory or compliance gaps that could create unexpected liability
- Commercial risks that could affect business strategy or competitiveness

For each additional risk, provide:
- Clear, specific title that reflects business-focused analysis
- Risk category using standard legal categories
- Appropriate severity level based on potential business impacts
- Detailed description of 50-150 words that objectively explains:
  1. Explains exactly what the contract says or fails to say
  2. Analyzes why this specific provision could harm the ${partyRole} based on standard contract principles
  3. Describes realistic scenarios of how such terms could cause business problems
  4. Identifies potential consequences
  5. Provides relevant context based on standard market practices
  
  Do not include recommendations in the description. Focus on thoroughly explaining the risk objectively.
- Separate recommendation field with specific actionable advice
- For each risk, provide specific mitigation:
  Action: whether to add new language, modify existing, or remove
  Target clause: which section/clause to change
  Suggested text: exact contract language to use
  Brief explanation of why this mitigates the risk

Return findings in this JSON format:
{
  "risks": [
    {
      "title": "Additional risk title",
      "category": "Legal/Commercial/Operational/etc.",
      "severity": "high|medium|low", 
      "description": "Detailed risk analysis (50-150 words) explaining what the contract says/fails to say, why it harms this party, realistic negative scenarios, potential consequences, and relevant context. Do not include recommendations.",
      "recommendation": "Specific actionable steps to mitigate this risk",
      "mitigation": {
        "action": "modify",
        "targetClause": "Termination",
        "suggestedText": "Either party may terminate with 30 days written notice",
        "explanation": "Provides adequate notice period for orderly transition"
      },
      "clauseLocation": "Section reference if applicable",
      "relatedText": "Relevant contract text"
    }
  ]
}

Identify ALL additional risks that complement the template-based analysis, ensuring comprehensive coverage of all significant risks. Do not limit the number of risks - thoroughness is essential.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      temperature: 0.1, // Slightly higher for creative risk identification
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Invalid response type");
    }

    console.log(
      "General legal analysis raw response length:",
      content.text.length,
    );

    // Try multiple JSON extraction methods
    let analysisData;

    try {
      // Method 1: Try direct parsing if response is clean JSON
      const trimmed = content.text.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        console.log("Attempting direct JSON parsing...");
        analysisData = JSON.parse(trimmed);
      } else {
        // Method 2: Extract JSON with regex
        console.log("Attempting regex JSON extraction...");
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error("No JSON found in general legal analysis response");
          console.error("Raw response:", content.text);
          throw new Error("No JSON found in general legal analysis response");
        }
        analysisData = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("JSON parsing failed for general legal analysis");
      console.error("Raw response:", content.text);
      console.error("Parse error:", parseError);

      // Fallback: Return empty results
      console.log("Using fallback empty results for general legal analysis");
      return [];
    }

    // Validate the parsed data structure
    if (!analysisData || typeof analysisData !== "object") {
      console.error("Invalid analysis data structure:", analysisData);
      return [];
    }

    const risks: Risk[] = (analysisData.risks || []).map(
      (risk: any, index: number) => ({
        id: templateRisks.length + index + 1,
        category: risk.category || "General",
        severity: risk.severity || "medium",
        title: risk.title || "Additional Risk",
        description: risk.description || "",
        recommendation: risk.recommendation || "",
        mitigation:
          risk.mitigation && typeof risk.mitigation === "object"
            ? risk.mitigation
            : undefined,
        clauseLocation: risk.clauseLocation,
        relatedText: risk.relatedText,
      }),
    );

    console.log(`General analysis found ${risks.length} additional risks`);
    return risks;
  } catch (error) {
    console.error("General analysis failed:", error);
    return [];
  }
}

// Intelligent merging and deduplication of risks
function mergeAndDeduplicateRisks(
  templateRisks: Risk[],
  generalRisks: Risk[],
  _template: ContractTemplate | null,
): Risk[] {
  const mergedRisks: Risk[] = [...templateRisks];

  // Add general risks that don't duplicate template risks
  for (const generalRisk of generalRisks) {
    const isDuplicate = templateRisks.some((templateRisk) =>
      areSimilarRisks(templateRisk, generalRisk),
    );

    if (!isDuplicate) {
      mergedRisks.push(generalRisk);
    } else {
      console.log(`Filtered duplicate risk: ${generalRisk.title}`);
    }
  }

  // Sort by priority: template risks first, then by severity
  const sortedRisks = mergedRisks.sort((a, b) => {
    // Template risks get priority
    const aIsTemplate = a.id <= templateRisks.length;
    const bIsTemplate = b.id <= templateRisks.length;

    if (aIsTemplate && !bIsTemplate) return -1;
    if (!aIsTemplate && bIsTemplate) return 1;

    // Then sort by severity
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  // Reassign IDs after sorting
  sortedRisks.forEach((risk, index) => {
    risk.id = index + 1;
  });

  console.log(
    `Merged risks: ${templateRisks.length} template + ${generalRisks.length} general = ${sortedRisks.length} final`,
  );
  return sortedRisks;
}

// Check if two risks are similar enough to be considered duplicates
function areSimilarRisks(risk1: Risk, risk2: Risk): boolean {
  // Check title similarity
  const title1 = risk1.title.toLowerCase();
  const title2 = risk2.title.toLowerCase();

  // Direct match
  if (title1 === title2) return true;

  // Category match with significant title overlap
  if (risk1.category.toLowerCase() === risk2.category.toLowerCase()) {
    const words1 = title1.split(/\s+/);
    const words2 = title2.split(/\s+/);
    const commonWords = words1.filter((word) => words2.includes(word));

    if (commonWords.length >= Math.min(words1.length, words2.length) * 0.6) {
      return true;
    }
  }

  // Check description similarity for subtle duplicates
  const desc1 = risk1.description.toLowerCase();
  const desc2 = risk2.description.toLowerCase();

  // Look for key phrase matches
  const keyPhrases1: string[] = desc1.match(/\b\w{4,}\b/g) || [];
  const keyPhrases2: string[] = desc2.match(/\b\w{4,}\b/g) || [];
  const commonPhrases = keyPhrases1.filter((phrase: string) =>
    keyPhrases2.includes(phrase),
  );

  if (commonPhrases.length >= 3) {
    return true;
  }

  return false;
}

// Helper function to extract key information from contract
export function preprocessContract(text: string): string {
  // Limit contract length to avoid token limits
  const maxLength = 15000; // About 3750 tokens

  if (text.length > maxLength) {
    // Try to intelligently truncate
    // First, try to find a good breaking point
    const breakPoint = text.lastIndexOf("\n\n", maxLength);
    if (breakPoint > maxLength * 0.8) {
      return (
        text.substring(0, breakPoint) + "\n\n[Contract truncated for analysis]"
      );
    }
    return (
      text.substring(0, maxLength) + "... [Contract truncated for analysis]"
    );
  }

  return text;
}

// Enhanced function for clause-by-clause analysis with template guidance
export async function analyzeContractClauses(
  contractText: string,
  contractType: string,
  partyRole: string,
  extractedParties: { [role: string]: string } = {},
): Promise<Clause[]> {
  try {
    // Get contract-specific template
    const template = getContractTemplate(contractType);

    if (!template) {
      throw new Error(`No template found for contract type: ${contractType}`);
    }

    // Build focused template guidance for clause analysis
    const templateGuidance = buildClauseAnalysisGuidance(template, partyRole);

    const prompt = `ROLE: You are a senior corporate attorney with 20+ years of experience reviewing all types of contracts.

Provide objective analysis based on standard contract principles and market practices. Do not reference specific cases, statistics, or claim personal experience. Break down this contract into its main clauses and analyze each one objectively.

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

CLAUSE ANALYSIS FRAMEWORK:
${templateGuidance}

INSTRUCTIONS:
Break down this contract into its main clauses and analyze each one from the ${partyRole} perspective using standard contract principles and market practices:

For each major clause or section:
1. Extract the actual clause text
2. Identify the section/clause title
3. Analyze specific risks for the ${partyRole} based on standard contract principles
4. Provide analysis of what this clause means in practice based on standard interpretations
5. Reference template review points where applicable

Prioritize these critical clauses: ${template.criticalClauses.join(", ")}

Respond in this exact JSON format:
{
  "clauses": [
    {
      "section": "Section number or identifier",
      "title": "Clause title matching template framework",
      "text": "The actual text of the clause",
      "risks": [
        {
          "severity": "high|medium|low",
          "description": "Specific risk in this clause for the ${partyRole}",
          "recommendation": "Specific actionable advice",
          "mitigation": {
            "action": "modify",
            "targetClause": "Section name",
            "suggestedText": "Exact contract language to use",
            "explanation": "Brief explanation of why this mitigates the risk"
          },
          "templateReference": "Related template review point if applicable"
        }
      ],
      "analysis": "Brief explanation of what this clause means for the ${partyRole}",
      "templateAlignment": "How this clause aligns with template expectations"
    }
  ]
}

Analyze ALL important clauses and provisions. Ensure coverage of all critical template clauses and other significant contractual provisions. Do not limit the number of clauses - comprehensive clause analysis is essential.`;

    const modelOptions = [
      "claude-3-5-sonnet-20241022",
      "claude-3-sonnet-20240229",
      "claude-3-opus-20240229",
      "claude-3-haiku-20240307",
    ];

    let response;
    for (const model of modelOptions) {
      try {
        response = await anthropic.messages.create({
          model,
          max_tokens: 3000,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });
        break;
      } catch (error) {
        continue;
      }
    }

    if (!response) {
      throw new Error("Failed to analyze clauses");
    }

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse the response
    let clauseData;
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        clauseData = JSON.parse(jsonMatch[0]);
      } else {
        clauseData = JSON.parse(content.text.trim());
      }
    } catch (parseError) {
      console.error("Failed to parse clause analysis:", content.text);
      throw new Error("Failed to parse clause analysis");
    }

    // Process clauses
    const clauses: Clause[] = clauseData.clauses.map(
      (clause: any, index: number) => ({
        id: index + 1,
        section: clause.section || `Section ${index + 1}`,
        title: clause.title || "Untitled Clause",
        text: clause.text || "",
        risks: (clause.risks || []).map((risk: any, riskIndex: number) => ({
          id: riskIndex + 1,
          category: clause.title || "General",
          severity: risk.severity || "medium",
          title: `Risk in ${clause.title}`,
          description: risk.description || "",
          recommendation: risk.recommendation || "",
          mitigation:
            risk.mitigation && typeof risk.mitigation === "object"
              ? risk.mitigation
              : undefined,
          relatedText: clause.text,
        })),
        analysis: clause.analysis || "",
      }),
    );

    return clauses;
  } catch (error) {
    console.error("Clause analysis error:", error);
    throw error;
  }
}

// Intelligent merging of template-based and AI-discovered risks
export function mergeAnalysisResults(
  templateRisks: Risk[],
  aiRisks: Risk[],
): Risk[] {
  console.log(
    `Merging ${templateRisks.length} template risks with ${aiRisks.length} AI risks`,
  );

  // Create a merged array starting with template risks
  const mergedRisks: Risk[] = [...templateRisks];
  let nextId = Math.max(...templateRisks.map((r) => r.id), 0) + 1;

  // Process each AI risk for potential overlap
  for (const aiRisk of aiRisks) {
    const overlappingRisk = findOverlappingRisk(aiRisk, mergedRisks);

    if (overlappingRisk) {
      // Merge with existing risk
      const mergedRisk = intelligentMerge(overlappingRisk, aiRisk);

      // Replace the overlapping risk with the merged version
      const index = mergedRisks.findIndex((r) => r.id === overlappingRisk.id);
      if (index !== -1) {
        mergedRisks[index] = mergedRisk;
      }

      console.log(
        `Merged AI risk "${aiRisk.title}" with template risk "${overlappingRisk.title}"`,
      );
    } else {
      // Add as new risk
      mergedRisks.push({
        ...aiRisk,
        id: nextId++,
        source: "ai_insight",
      });
    }
  }

  // Sort by severity first, then by source (template before AI)
  const sortedRisks = sortRisksBySeverityAndSource(mergedRisks);

  // Add metadata to each risk
  return addRiskMetadata(sortedRisks);
}

// Find overlapping risks using similarity analysis
function findOverlappingRisk(
  targetRisk: Risk,
  existingRisks: Risk[],
): Risk | null {
  const threshold = 0.6; // Similarity threshold for overlap detection

  for (const existingRisk of existingRisks) {
    const similarity = calculateRiskSimilarity(targetRisk, existingRisk);

    if (similarity > threshold) {
      return existingRisk;
    }
  }

  return null;
}

// Calculate similarity between two risks
function calculateRiskSimilarity(risk1: Risk, risk2: Risk): number {
  // Check category similarity
  const categoryMatch =
    risk1.category.toLowerCase() === risk2.category.toLowerCase() ? 0.3 : 0;

  // Check title similarity using word overlap
  const titleSimilarity =
    calculateTextSimilarity(risk1.title, risk2.title) * 0.4;

  // Check description similarity
  const descriptionSimilarity =
    calculateTextSimilarity(risk1.description, risk2.description) * 0.3;

  return categoryMatch + titleSimilarity + descriptionSimilarity;
}

// Calculate text similarity using word overlap
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

  const intersection = words1.filter((word) => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];

  return intersection.length / union.length;
}

// Intelligently merge two overlapping risks
function intelligentMerge(templateRisk: Risk, aiRisk: Risk): Risk {
  // Use higher severity
  const severityOrder = { high: 3, medium: 2, low: 1 };
  const severity =
    severityOrder[templateRisk.severity] >= severityOrder[aiRisk.severity]
      ? templateRisk.severity
      : aiRisk.severity;

  // Keep the more detailed description
  const description =
    templateRisk.description.length >= aiRisk.description.length
      ? templateRisk.description
      : aiRisk.description;

  // Combine recommendations intelligently
  const combinedRecommendation = combineRecommendations(
    templateRisk.recommendation,
    aiRisk.recommendation,
  );

  // Use the more detailed mitigation (prefer structured mitigation from AI if available)
  const mitigation =
    aiRisk.mitigation && typeof aiRisk.mitigation === "object"
      ? aiRisk.mitigation
      : templateRisk.mitigation;

  // Use template risk as base, enhance with AI insights
  return {
    ...templateRisk,
    severity,
    description,
    recommendation: combinedRecommendation,
    mitigation,
    source: "hybrid" as const,
    templateReference: templateRisk.templateReference,
    // Keep both clause locations if different
    clauseLocation: templateRisk.clauseLocation || aiRisk.clauseLocation,
    // Combine related text if different
    relatedText:
      templateRisk.relatedText !== aiRisk.relatedText && aiRisk.relatedText
        ? `${templateRisk.relatedText || ""} | ${aiRisk.relatedText}`.trim()
        : templateRisk.relatedText || aiRisk.relatedText,
  };
}

// Combine recommendations from template and AI risks
function combineRecommendations(templateRec: string, aiRec: string): string {
  if (!templateRec && !aiRec) return "";
  if (!templateRec) return aiRec;
  if (!aiRec) return templateRec;

  // Check if recommendations are similar
  const similarity = calculateTextSimilarity(templateRec, aiRec);

  if (similarity > 0.7) {
    // Use the longer, more detailed recommendation
    return templateRec.length >= aiRec.length ? templateRec : aiRec;
  } else {
    // Combine different recommendations
    return `${templateRec} Additionally, ${aiRec.toLowerCase()}`;
  }
}

// Sort risks by severity and source priority
function sortRisksBySeverityAndSource(risks: Risk[]): Risk[] {
  const severityOrder = { high: 3, medium: 2, low: 1 };
  const sourceOrder = { template: 3, hybrid: 2, ai_insight: 1 };

  return risks.sort((a, b) => {
    // Primary sort: severity (high to low)
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;

    // Secondary sort: source priority (template > hybrid > ai_insight)
    const sourceDiff =
      sourceOrder[b.source || "ai_insight"] -
      sourceOrder[a.source || "ai_insight"];
    if (sourceDiff !== 0) return sourceDiff;

    // Tertiary sort: alphabetical by title
    return a.title.localeCompare(b.title);
  });
}

// Add metadata to risks indicating their source and merge status
function addRiskMetadata(risks: Risk[]): Risk[] {
  return risks.map((risk, index) => ({
    ...risk,
    id: index + 1, // Reassign IDs sequentially
    // Add merge metadata in the description if it's a hybrid risk
    description:
      risk.source === "hybrid"
        ? `${risk.description} [Combined from template analysis and AI insights]`
        : risk.description,
  }));
}
