export interface IndustryRiskPattern {
  identification: {
    industryId: string;
    industryName: string;
    aliases: string[];
    keywords: string[];
    contractTypes: string[];
    companyIndicators: string[];
    regulatoryFrameworks: string[];
  };
  
  riskCategories: {
    [category: string]: {
      weight: number;
      description: string;
      commonIndustry: boolean;
      regulatoryDriven: boolean;
      businessCritical: boolean;
    };
  };
  
  specificRisks: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    severity: 'high' | 'medium' | 'low';
    likelihood: 'high' | 'medium' | 'low';
    businessImpact: 'critical' | 'significant' | 'moderate' | 'low';
    triggers: string[];
    contextualFactors: string[];
    mitigationStrategies: string[];
    regulatoryImplications?: string[];
    industrySpecificNotes?: string;
    precedentCases?: string[];
  }>;
  
  criticalProtections: Array<{
    protectionType: string;
    description: string;
    priority: 'essential' | 'recommended' | 'optional';
    contractClauses: string[];
    legalRequirements?: string[];
    industryStandards?: string[];
  }>;
  
  complianceRequirements: {
    federal: string[];
    state: string[];
    international: string[];
    industrySpecific: string[];
    certifications: string[];
    auditRequirements: string[];
  };
  
  analysisConfig: {
    riskDetectionThreshold: number;
    categoryWeights: { [category: string]: number };
    contextualFactorWeights: { [factor: string]: number };
    complianceWeight: number;
    businessImpactMultipliers: {
      critical: number;
      significant: number;
      moderate: number;
      low: number;
    };
    industrySpecificKeywords: string[];
    exclusionPatterns: string[];
  };
}

export interface IndustryDetectionResult {
  industryId: string;
  industryName: string;
  confidence: number;
  matchedIndicators: {
    keywords: string[];
    contractTypes: string[];
    companyIndicators: string[];
    regulatoryFrameworks: string[];
  };
  secondaryIndustries?: Array<{
    industryId: string;
    confidence: number;
  }>;
}

export interface IndustryRiskAnalysisResult {
  industryDetection: IndustryDetectionResult;
  industrySpecificRisks: Array<{
    risk: IndustryRiskPattern['specificRisks'][0];
    detectionConfidence: number;
    applicabilityScore: number;
    contextualRelevance: string[];
  }>;
  complianceGaps: Array<{
    requirement: string;
    category: 'federal' | 'state' | 'international' | 'industrySpecific';
    severity: 'critical' | 'important' | 'advisory';
    description: string;
    recommendedAction: string;
  }>;
  criticalProtectionGaps: Array<{
    protection: IndustryRiskPattern['criticalProtections'][0];
    gapSeverity: 'high' | 'medium' | 'low';
    currentCoverage: 'none' | 'partial' | 'adequate';
    recommendedClauses: string[];
  }>;
  industryBenchmarking: {
    riskProfile: 'high' | 'medium' | 'low';
    complianceComplexity: 'high' | 'medium' | 'low';
    regulatoryBurden: 'heavy' | 'moderate' | 'light';
    recommendedReviewFrequency: 'quarterly' | 'biannual' | 'annual';
  };
  actionableInsights: Array<{
    priority: 'immediate' | 'short-term' | 'long-term';
    category: string;
    insight: string;
    recommendedAction: string;
    businessImpact: string;
  }>;
}

export interface IndustryAnalysisMetadata {
  analysisTimestamp: Date;
  industryPatternsVersion: string;
  detectionMethod: 'keyword-based' | 'ml-enhanced' | 'hybrid';
  confidenceThreshold: number;
  fallbackStrategy: 'general-analysis' | 'multi-industry' | 'conservative';
}

export interface ThreeTierAnalysisResult {
  contractSpecificAnalysis: {
    risks: any[];
    metadata: any;
    processingTime: number;
  };
  industryPatternAnalysis: IndustryRiskAnalysisResult | null;
  generalAIAnalysis: {
    risks: any[];
    metadata: any;
    processingTime: number;
  };
  consolidatedResult: {
    finalRisks: any[];
    riskSources: Array<{
      riskId: number;
      sources: Array<'template' | 'industry' | 'ai'>;
      consolidationStrategy: 'merged' | 'enhanced' | 'unique';
    }>;
    industryContext: string | null;
    overallConfidence: number;
  };
  debugInformation: {
    industryDetectionDetails: IndustryDetectionResult | null;
    tierProcessingTimes: {
      contractSpecific: number;
      industryPattern: number;
      generalAI: number;
      consolidation: number;
    };
    riskConsolidationDecisions: Array<{
      decision: string;
      reason: string;
      affectedRisks: number[];
    }>;
  };
}