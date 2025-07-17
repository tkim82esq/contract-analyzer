import { IndustryDetectionResult, IndustryRiskPattern } from '@/types/industry';
import { INDUSTRY_RISK_PATTERNS, FALLBACK_INDUSTRY_PATTERN } from '@/data/industry-patterns';

export class IndustryDetectionEngine {
  private patterns: Record<string, IndustryRiskPattern>;
  private confidenceThreshold: number;

  constructor(confidenceThreshold: number = 0.6) {
    this.patterns = INDUSTRY_RISK_PATTERNS;
    this.confidenceThreshold = confidenceThreshold;
  }

  /**
   * Detect industry from contract text and metadata
   */
  detectIndustry(
    contractText: string,
    contractType?: string,
    companyNames?: string[],
    additionalContext?: string
  ): IndustryDetectionResult | null {
    const analysisText = this.prepareAnalysisText(contractText, contractType, companyNames, additionalContext);
    const scores = this.calculateIndustryScores(analysisText, contractType, companyNames);
    
    // Find the highest scoring industry
    const sortedScores = Object.entries(scores)
      .sort(([, a], [, b]) => b.confidence - a.confidence);

    const [topIndustryId, topResult] = sortedScores[0];

    // Check if confidence meets threshold
    if (topResult.confidence < this.confidenceThreshold) {
      return null; // No confident match found
    }

    // Identify secondary industries (confidence > 0.3 but less than top)
    const secondaryIndustries = sortedScores
      .slice(1)
      .filter(([, result]) => result.confidence > 0.3)
      .slice(0, 2) // Take top 2 secondary matches
      .map(([industryId, result]) => ({
        industryId,
        confidence: result.confidence
      }));

    return {
      industryId: topIndustryId,
      industryName: this.patterns[topIndustryId].identification.industryName,
      confidence: topResult.confidence,
      matchedIndicators: topResult.matchedIndicators,
      secondaryIndustries: secondaryIndustries.length > 0 ? secondaryIndustries : undefined
    };
  }

  /**
   * Get industry pattern by ID, with fallback to general pattern
   */
  getIndustryPattern(industryId: string | null): IndustryRiskPattern {
    if (!industryId || !this.patterns[industryId]) {
      return FALLBACK_INDUSTRY_PATTERN;
    }
    return this.patterns[industryId];
  }

  /**
   * Get all available industry patterns
   */
  getAllIndustryPatterns(): Record<string, IndustryRiskPattern> {
    return this.patterns;
  }

  /**
   * Calculate confidence score for each industry
   */
  private calculateIndustryScores(
    analysisText: string,
    contractType?: string,
    companyNames?: string[]
  ): Record<string, { confidence: number; matchedIndicators: any }> {
    const scores: Record<string, { confidence: number; matchedIndicators: any }> = {};

    for (const [industryId, pattern] of Object.entries(this.patterns)) {
      const matchedIndicators = this.analyzeIndustryMatch(
        pattern,
        analysisText,
        contractType,
        companyNames
      );

      const confidence = this.calculateConfidenceScore(pattern, matchedIndicators, analysisText);

      scores[industryId] = {
        confidence,
        matchedIndicators
      };
    }

    return scores;
  }

  /**
   * Analyze how well an industry pattern matches the contract
   */
  private analyzeIndustryMatch(
    pattern: IndustryRiskPattern,
    analysisText: string,
    contractType?: string,
    companyNames?: string[]
  ) {
    const text = analysisText.toLowerCase();
    const matchedIndicators = {
      keywords: [] as string[],
      contractTypes: [] as string[],
      companyIndicators: [] as string[],
      regulatoryFrameworks: [] as string[]
    };

    // Match keywords
    for (const keyword of pattern.identification.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        matchedIndicators.keywords.push(keyword);
      }
    }

    // Match contract types
    if (contractType) {
      for (const type of pattern.identification.contractTypes) {
        if (contractType.toLowerCase().includes(type.toLowerCase()) ||
            type.toLowerCase().includes(contractType.toLowerCase())) {
          matchedIndicators.contractTypes.push(type);
        }
      }
    }

    // Match company indicators
    if (companyNames) {
      for (const companyName of companyNames) {
        for (const indicator of pattern.identification.companyIndicators) {
          if (companyName.toLowerCase().includes(indicator.toLowerCase())) {
            matchedIndicators.companyIndicators.push(indicator);
          }
        }
      }
    }

    // Match regulatory frameworks
    for (const framework of pattern.identification.regulatoryFrameworks) {
      if (text.includes(framework.toLowerCase())) {
        matchedIndicators.regulatoryFrameworks.push(framework);
      }
    }

    return matchedIndicators;
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidenceScore(
    pattern: IndustryRiskPattern,
    matchedIndicators: any,
    analysisText: string
  ): number {
    let score = 0;
    let maxScore = 0;

    // Keyword matching (40% weight)
    const keywordWeight = 0.4;
    const keywordScore = matchedIndicators.keywords.length / Math.max(1, pattern.identification.keywords.length);
    score += keywordScore * keywordWeight;
    maxScore += keywordWeight;

    // Contract type matching (25% weight)
    const contractTypeWeight = 0.25;
    if (pattern.identification.contractTypes.length > 0) {
      const contractTypeScore = matchedIndicators.contractTypes.length / pattern.identification.contractTypes.length;
      score += contractTypeScore * contractTypeWeight;
      maxScore += contractTypeWeight;
    }

    // Company indicators (15% weight)
    const companyWeight = 0.15;
    if (pattern.identification.companyIndicators.length > 0) {
      const companyScore = matchedIndicators.companyIndicators.length / pattern.identification.companyIndicators.length;
      score += companyScore * companyWeight;
      maxScore += companyWeight;
    }

    // Regulatory frameworks (20% weight)
    const regulatoryWeight = 0.2;
    if (pattern.identification.regulatoryFrameworks.length > 0) {
      const regulatoryScore = matchedIndicators.regulatoryFrameworks.length / pattern.identification.regulatoryFrameworks.length;
      score += regulatoryScore * regulatoryWeight;
      maxScore += regulatoryWeight;
    }

    // Normalize score to 0-1 range
    const normalizedScore = maxScore > 0 ? score / maxScore : 0;

    // Apply exclusion patterns (reduce score if exclusion patterns match)
    let exclusionPenalty = 0;
    for (const exclusionPattern of pattern.analysisConfig.exclusionPatterns) {
      if (analysisText.toLowerCase().includes(exclusionPattern.toLowerCase())) {
        exclusionPenalty += 0.3; // 30% penalty per exclusion pattern match
      }
    }

    // Apply industry-specific keyword boost
    let industryBoost = 0;
    for (const keyword of pattern.analysisConfig.industrySpecificKeywords) {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
      const matches = (analysisText.match(regex) || []).length;
      industryBoost += Math.min(matches * 0.1, 0.3); // Up to 30% boost per keyword
    }

    const finalScore = Math.max(0, Math.min(1, normalizedScore + industryBoost - exclusionPenalty));

    return finalScore;
  }

  /**
   * Prepare analysis text by combining all available information
   */
  private prepareAnalysisText(
    contractText: string,
    contractType?: string,
    companyNames?: string[],
    additionalContext?: string
  ): string {
    let analysisText = contractText;

    if (contractType) {
      analysisText += ` CONTRACT_TYPE: ${contractType}`;
    }

    if (companyNames && companyNames.length > 0) {
      analysisText += ` COMPANIES: ${companyNames.join(' ')}`;
    }

    if (additionalContext) {
      analysisText += ` CONTEXT: ${additionalContext}`;
    }

    return analysisText;
  }

  /**
   * Validate industry detection result quality
   */
  validateDetectionQuality(result: IndustryDetectionResult): {
    isHighQuality: boolean;
    qualityScore: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let qualityScore = result.confidence;

    // Check for multiple types of matches
    const indicatorTypes = Object.keys(result.matchedIndicators).filter(
      key => result.matchedIndicators[key as keyof typeof result.matchedIndicators]?.length > 0
    );

    if (indicatorTypes.length < 2) {
      qualityScore *= 0.8;
      recommendations.push('Consider providing more context about the contract type or company information');
    }

    // Check confidence level
    if (result.confidence < 0.7) {
      recommendations.push('Industry detection confidence is moderate - review analysis carefully');
    }

    if (result.confidence < 0.5) {
      recommendations.push('Low confidence industry detection - consider manual industry specification');
    }

    // Check for secondary industries
    if (result.secondaryIndustries && result.secondaryIndustries.length > 0) {
      const topSecondary = result.secondaryIndustries[0];
      if (topSecondary.confidence > result.confidence * 0.8) {
        recommendations.push(`Consider reviewing ${this.patterns[topSecondary.industryId]?.identification.industryName} patterns as well`);
      }
    }

    return {
      isHighQuality: qualityScore > 0.7 && indicatorTypes.length >= 2,
      qualityScore,
      recommendations
    };
  }
}

// Export singleton instance
export const industryDetectionEngine = new IndustryDetectionEngine();