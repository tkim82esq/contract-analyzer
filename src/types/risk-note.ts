export interface RiskNote {
  metadata: {
    contractName: string;
    contractType: string;
    yourOrganization: string;
    counterparty: string;
    yourRole: string;
    analysisDate: string;
    analyzerVersion: string;
    processingTime: number;
  };
  
  executiveSummary: {
    overallRiskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    recommendedAction: 'NEGOTIATE_CRITICAL' | 'REVIEW_CAREFULLY' | 'PROCEED_WITH_CAUTION' | 'APPROVE_AS_IS';
    keyMessage: string;
    confidenceScore: number;
  };
  
  riskOverview: {
    breakdown: {
      high: number;
      medium: number;
      low: number;
    };
    topConcerns: string[];
    riskCategories: Record<string, number>;
  };
  
  detailedRisks: Array<{
    id: string;
    title: string;
    impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    businessImpact: string;
    contractReference: string;
    recommendedAction: string;
    urgency: 'CRITICAL' | 'IMPORTANT' | 'MODERATE';
    category: string;
    financialImpact?: string;
  }>;
  
  missingProtections: Array<{
    protection: string;
    importance: 'CRITICAL' | 'IMPORTANT' | 'BENEFICIAL';
    suggestedLanguage: string;
    businessRationale: string;
  }>;
  
  negotiationPriorities: {
    mustHave: Array<{
      item: string;
      rationale: string;
      dealBreaker: boolean;
    }>;
    shouldHave: Array<{
      item: string;
      rationale: string;
      negotiatingPower: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
    niceToHave: Array<{
      item: string;
      rationale: string;
    }>;
  };
  
  nextSteps: Array<{
    action: string;
    timeline: string;
    stakeholder: string;
    priority: 'IMMEDIATE' | 'WITHIN_WEEK' | 'BEFORE_SIGNING';
    description: string;
  }>;
  
  complianceConsiderations?: {
    regulations: string[];
    requirements: string[];
    gaps: string[];
  };
  
  disclaimer: string;
}

export interface RiskNoteGenerationInput {
  risks: Array<{
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
  }>;
  contractType: string;
  partyRole: string;
  extractedParties: { [role: string]: string };
  contractName: string;
  analysisMetadata: {
    processingTime: number;
    templateAnalysis: any;
  };
}

export interface ExportOptions {
  format: 'PDF' | 'EMAIL' | 'PRINT' | 'CLIPBOARD';
  includeDetails: boolean;
  customTitle?: string;
  recipientEmail?: string;
}