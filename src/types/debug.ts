export interface ProcessingStep {
  step: string;
  input: any;
  output: any;
  timestamp: string;
}

export interface ComparisonDetails {
  titleSimilarity: number;
  descriptionSimilarity: number;
  categorySimilarity: number;
  overallSimilarity: number;
}

export interface DuplicationDetection {
  generalRisk: Risk;
  templateRisk: Risk | null;
  similarityScore: number;
  isDuplicate: boolean;
  reason: string;
  comparisonDetails: ComparisonDetails;
}

export interface TemplateAnalysisDebug {
  rawResponse: string;
  parsedResults: {
    coveredReviewPoints: string[];
    identifiedRedFlags: string[];
    missingClauses: string[];
    generatedRisks: Risk[];
  };
  processingSteps: ProcessingStep[];
  processingTime: number;
}

export interface GeneralAnalysisDebug {
  rawResponse: string;
  parsedResults: {
    risks: Risk[];
    additionalFindings: any;
  };
  processingSteps: ProcessingStep[];
  processingTime: number;
}

export interface MergingProcessDebug {
  beforeMerging: {
    templateRisks: Risk[];
    generalRisks: Risk[];
    totalCount: number;
  };
  duplicationDetection: DuplicationDetection[];
  afterMerging: {
    finalRisks: Risk[];
    removedRisks: Risk[];
    addedRisks: Risk[];
    totalCount: number;
  };
  configuration: {
    similarityThreshold: number;
    titleWeight: number;
    descriptionWeight: number;
    categoryWeight: number;
  };
}

export interface AnalysisDebugData {
  templateAnalysis: TemplateAnalysisDebug;
  generalAnalysis: GeneralAnalysisDebug;
  mergingProcess: MergingProcessDebug;
  missingClauses: {
    templateMissing: string[];
    generalMissing: string[];
    combinedMissing: string[];
  };
  redFlags: {
    templateFlags: string[];
    generalFlags: string[];
    combinedFlags: string[];
  };
  metadata: {
    analysisDate: string;
    contractType: string;
    partyRole: string;
    totalProcessingTime: number;
  };
}

export interface DuplicationConfig {
  similarityThreshold: number; // 0.0 to 1.0
  titleWeight: number;
  descriptionWeight: number;
  categoryWeight: number;
  enableManualOverrides: boolean;
}

export interface Risk {
  id: number;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  source?: 'template' | 'ai_insight' | 'hybrid';
  confidence?: number;
  originalText?: string; // Raw text from AI response
  processingNotes?: string[]; // Debug notes during processing
  recommendation: string;
  templateReference?: string;
}