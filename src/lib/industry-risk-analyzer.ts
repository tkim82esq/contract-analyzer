import { 
  IndustryRiskPattern, 
  IndustryRiskAnalysisResult, 
  IndustryDetectionResult,
  IndustryAnalysisMetadata 
} from '@/types/industry';

export class IndustryRiskAnalyzer {
  private pattern: IndustryRiskPattern;
  private contractText: string;
  private contractType: string;
  private partyRole: string;

  constructor(
    pattern: IndustryRiskPattern,
    contractText: string,
    contractType: string,
    partyRole: string
  ) {
    this.pattern = pattern;
    this.contractText = contractText.toLowerCase();
    this.contractType = contractType;
    this.partyRole = partyRole;
  }

  /**
   * Perform comprehensive industry-specific risk analysis
   */
  analyzeIndustryRisks(industryDetection: IndustryDetectionResult): IndustryRiskAnalysisResult {
    const startTime = Date.now();

    const industrySpecificRisks = this.analyzeSpecificRisks();
    const complianceGaps = this.analyzeComplianceGaps();
    const criticalProtectionGaps = this.analyzeCriticalProtectionGaps();
    const industryBenchmarking = this.performIndustryBenchmarking();
    const actionableInsights = this.generateActionableInsights(
      industrySpecificRisks,
      complianceGaps,
      criticalProtectionGaps
    );

    const processingTime = Date.now() - startTime;

    return {
      industryDetection,
      industrySpecificRisks,
      complianceGaps,
      criticalProtectionGaps,
      industryBenchmarking,
      actionableInsights
    };
  }

  /**
   * Analyze industry-specific risks
   */
  private analyzeSpecificRisks() {
    const results: IndustryRiskAnalysisResult['industrySpecificRisks'] = [];

    for (const risk of this.pattern.specificRisks) {
      const detectionConfidence = this.calculateRiskDetectionConfidence(risk);
      const applicabilityScore = this.calculateRiskApplicabilityScore(risk);
      const contextualRelevance = this.analyzeContextualRelevance(risk);

      // Only include risks that meet minimum thresholds
      if (detectionConfidence > 0.3 || applicabilityScore > 0.4) {
        results.push({
          risk,
          detectionConfidence,
          applicabilityScore,
          contextualRelevance
        });
      }
    }

    // Sort by combined score (detection confidence + applicability)
    results.sort((a, b) => {
      const scoreA = (a.detectionConfidence + a.applicabilityScore) / 2;
      const scoreB = (b.detectionConfidence + b.applicabilityScore) / 2;
      return scoreB - scoreA;
    });

    return results;
  }

  /**
   * Calculate how likely a specific risk is present in the contract
   */
  private calculateRiskDetectionConfidence(risk: IndustryRiskPattern['specificRisks'][0]): number {
    let score = 0;
    let maxScore = 0;

    // Check trigger keywords (40% weight)
    const triggerWeight = 0.4;
    let triggerMatches = 0;
    for (const trigger of risk.triggers) {
      if (this.contractText.includes(trigger.toLowerCase())) {
        triggerMatches++;
      }
    }
    const triggerScore = triggerMatches / Math.max(1, risk.triggers.length);
    score += triggerScore * triggerWeight;
    maxScore += triggerWeight;

    // Check contextual factors (30% weight)
    const contextWeight = 0.3;
    let contextMatches = 0;
    for (const factor of risk.contextualFactors) {
      if (this.contractText.includes(factor.toLowerCase().replace(/-/g, ' '))) {
        contextMatches++;
      }
    }
    const contextScore = contextMatches / Math.max(1, risk.contextualFactors.length);
    score += contextScore * contextWeight;
    maxScore += contextWeight;

    // Check category relevance (20% weight)
    const categoryWeight = 0.2;
    const categoryConfig = this.pattern.riskCategories[risk.category];
    if (categoryConfig) {
      // Higher weight categories are more likely to be relevant
      const categoryScore = categoryConfig.weight / Math.max(...Object.values(this.pattern.riskCategories).map(c => c.weight));
      score += categoryScore * categoryWeight;
    }
    maxScore += categoryWeight;

    // Check severity and likelihood combination (10% weight)
    const severityWeight = 0.1;
    const severityScore = this.getSeverityScore(risk.severity) * this.getLikelihoodScore(risk.likelihood);
    score += severityScore * severityWeight;
    maxScore += severityWeight;

    return maxScore > 0 ? score / maxScore : 0;
  }

  /**
   * Calculate how applicable a risk is to the current contract context
   */
  private calculateRiskApplicabilityScore(risk: IndustryRiskPattern['specificRisks'][0]): number {
    let score = 0;

    // Business impact relevance (40%)
    const businessImpactScore = this.getBusinessImpactScore(risk.businessImpact);
    score += businessImpactScore * 0.4;

    // Party role relevance (30%)
    const roleRelevance = this.calculateRoleRelevance(risk);
    score += roleRelevance * 0.3;

    // Contract type relevance (20%)
    const contractRelevance = this.calculateContractTypeRelevance(risk);
    score += contractRelevance * 0.2;

    // Regulatory implications (10%)
    const regulatoryScore = risk.regulatoryImplications ? 
      Math.min(risk.regulatoryImplications.length * 0.2, 1.0) : 0;
    score += regulatoryScore * 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Analyze contextual relevance factors
   */
  private analyzeContextualRelevance(risk: IndustryRiskPattern['specificRisks'][0]): string[] {
    const relevantFactors: string[] = [];

    // Check for direct contextual factor matches
    for (const factor of risk.contextualFactors) {
      if (this.contractText.includes(factor.toLowerCase().replace(/-/g, ' '))) {
        relevantFactors.push(`Contract involves ${factor}`);
      }
    }

    // Check for industry-specific keywords that enhance relevance
    for (const keyword of this.pattern.analysisConfig.industrySpecificKeywords) {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
      if (regex.test(this.contractText)) {
        relevantFactors.push(`Industry context: ${keyword}`);
      }
    }

    // Check for regulatory framework mentions
    for (const framework of this.pattern.identification.regulatoryFrameworks) {
      if (this.contractText.includes(framework.toLowerCase())) {
        relevantFactors.push(`Regulatory context: ${framework}`);
      }
    }

    return relevantFactors;
  }

  /**
   * Analyze compliance gaps
   */
  private analyzeComplianceGaps(): IndustryRiskAnalysisResult['complianceGaps'] {
    const gaps: IndustryRiskAnalysisResult['complianceGaps'] = [];

    // Check federal compliance requirements
    for (const requirement of this.pattern.complianceRequirements.federal) {
      if (!this.contractText.includes(requirement.toLowerCase())) {
        gaps.push({
          requirement,
          category: 'federal',
          severity: 'critical',
          description: `Contract may not adequately address ${requirement} compliance requirements`,
          recommendedAction: `Add specific ${requirement} compliance clauses and obligations`
        });
      }
    }

    // Check industry-specific requirements
    for (const requirement of this.pattern.complianceRequirements.industrySpecific) {
      if (!this.contractText.includes(requirement.toLowerCase().replace(/\s+/g, ''))) {
        gaps.push({
          requirement,
          category: 'industrySpecific',
          severity: 'important',
          description: `Contract should address industry-specific requirement: ${requirement}`,
          recommendedAction: `Include provisions for ${requirement} compliance`
        });
      }
    }

    return gaps.slice(0, 5); // Limit to top 5 most critical gaps
  }

  /**
   * Analyze critical protection gaps
   */
  private analyzeCriticalProtectionGaps(): IndustryRiskAnalysisResult['criticalProtectionGaps'] {
    const gaps: IndustryRiskAnalysisResult['criticalProtectionGaps'] = [];

    for (const protection of this.pattern.criticalProtections) {
      const currentCoverage = this.assessProtectionCoverage(protection);
      const gapSeverity = this.calculateProtectionGapSeverity(protection, currentCoverage);

      if (currentCoverage !== 'adequate') {
        gaps.push({
          protection,
          gapSeverity,
          currentCoverage,
          recommendedClauses: protection.contractClauses.filter(clause => 
            !this.contractText.includes(clause.toLowerCase().replace(/\s+/g, ''))
          )
        });
      }
    }

    return gaps;
  }

  /**
   * Assess current coverage of a critical protection
   */
  private assessProtectionCoverage(protection: IndustryRiskPattern['criticalProtections'][0]): 'none' | 'partial' | 'adequate' {
    let coveredClauses = 0;

    for (const clause of protection.contractClauses) {
      if (this.contractText.includes(clause.toLowerCase().replace(/\s+/g, ''))) {
        coveredClauses++;
      }
    }

    const coverageRatio = coveredClauses / protection.contractClauses.length;

    if (coverageRatio === 0) return 'none';
    if (coverageRatio < 0.7) return 'partial';
    return 'adequate';
  }

  /**
   * Calculate protection gap severity
   */
  private calculateProtectionGapSeverity(
    protection: IndustryRiskPattern['criticalProtections'][0],
    currentCoverage: 'none' | 'partial' | 'adequate'
  ): 'high' | 'medium' | 'low' {
    if (protection.priority === 'essential') {
      return currentCoverage === 'none' ? 'high' : 'medium';
    }
    if (protection.priority === 'recommended') {
      return currentCoverage === 'none' ? 'medium' : 'low';
    }
    return 'low';
  }

  /**
   * Perform industry benchmarking
   */
  private performIndustryBenchmarking(): IndustryRiskAnalysisResult['industryBenchmarking'] {
    // Calculate overall risk profile based on industry pattern weights
    const highRiskCategories = Object.entries(this.pattern.riskCategories)
      .filter(([, config]) => config.weight > 0.2)
      .length;

    const riskProfile: 'high' | 'medium' | 'low' = 
      highRiskCategories >= 3 ? 'high' : 
      highRiskCategories >= 2 ? 'medium' : 'low';

    // Assess compliance complexity
    const totalCompliance = Object.values(this.pattern.complianceRequirements)
      .reduce((sum, reqs) => sum + reqs.length, 0);

    const complianceComplexity: 'high' | 'medium' | 'low' = 
      totalCompliance >= 15 ? 'high' :
      totalCompliance >= 8 ? 'medium' : 'low';

    // Assess regulatory burden
    const regulatoryBurden: 'heavy' | 'moderate' | 'light' = 
      this.pattern.identification.regulatoryFrameworks.length >= 5 ? 'heavy' :
      this.pattern.identification.regulatoryFrameworks.length >= 3 ? 'moderate' : 'light';

    // Recommend review frequency
    const recommendedReviewFrequency: 'quarterly' | 'biannual' | 'annual' = 
      riskProfile === 'high' || regulatoryBurden === 'heavy' ? 'quarterly' :
      riskProfile === 'medium' || regulatoryBurden === 'moderate' ? 'biannual' : 'annual';

    return {
      riskProfile,
      complianceComplexity,
      regulatoryBurden,
      recommendedReviewFrequency
    };
  }

  /**
   * Generate actionable insights
   */
  private generateActionableInsights(
    industryRisks: IndustryRiskAnalysisResult['industrySpecificRisks'],
    complianceGaps: IndustryRiskAnalysisResult['complianceGaps'],
    protectionGaps: IndustryRiskAnalysisResult['criticalProtectionGaps']
  ): IndustryRiskAnalysisResult['actionableInsights'] {
    const insights: IndustryRiskAnalysisResult['actionableInsights'] = [];

    // High-priority industry risks
    const highPriorityRisks = industryRisks.filter(r => 
      r.detectionConfidence > 0.7 && r.applicabilityScore > 0.6
    );

    for (const riskAnalysis of highPriorityRisks.slice(0, 3)) {
      insights.push({
        priority: 'immediate',
        category: riskAnalysis.risk.category,
        insight: `High probability of ${riskAnalysis.risk.title.toLowerCase()} in this contract`,
        recommendedAction: riskAnalysis.risk.mitigationStrategies[0] || 'Review and address this risk',
        businessImpact: `Potential ${riskAnalysis.risk.businessImpact} impact to business operations`
      });
    }

    // Critical compliance gaps
    const criticalGaps = complianceGaps.filter(g => g.severity === 'critical');
    for (const gap of criticalGaps.slice(0, 2)) {
      insights.push({
        priority: 'immediate',
        category: 'Compliance',
        insight: `Contract lacks adequate ${gap.requirement} compliance provisions`,
        recommendedAction: gap.recommendedAction,
        businessImpact: 'Non-compliance may result in regulatory penalties and legal exposure'
      });
    }

    // Essential protection gaps
    const essentialGaps = protectionGaps.filter(g => 
      g.protection.priority === 'essential' && g.gapSeverity === 'high'
    );
    for (const gap of essentialGaps.slice(0, 2)) {
      insights.push({
        priority: 'short-term',
        category: 'Risk Mitigation',
        insight: `Contract lacks essential ${gap.protection.protectionType.toLowerCase()} protections`,
        recommendedAction: `Implement ${gap.recommendedClauses.join(', ')}`,
        businessImpact: 'Inadequate protection may expose organization to significant liability'
      });
    }

    return insights;
  }

  // Helper methods
  private getSeverityScore(severity: string): number {
    switch (severity) {
      case 'high': return 1.0;
      case 'medium': return 0.6;
      case 'low': return 0.3;
      default: return 0.5;
    }
  }

  private getLikelihoodScore(likelihood: string): number {
    switch (likelihood) {
      case 'high': return 1.0;
      case 'medium': return 0.6;
      case 'low': return 0.3;
      default: return 0.5;
    }
  }

  private getBusinessImpactScore(impact: string): number {
    switch (impact) {
      case 'critical': return 1.0;
      case 'significant': return 0.8;
      case 'moderate': return 0.6;
      case 'low': return 0.4;
      default: return 0.5;
    }
  }

  private calculateRoleRelevance(risk: IndustryRiskPattern['specificRisks'][0]): number {
    // This could be expanded based on party role analysis
    // For now, return a base relevance score
    return 0.7;
  }

  private calculateContractTypeRelevance(risk: IndustryRiskPattern['specificRisks'][0]): number {
    // Check if the risk is particularly relevant to this contract type
    const relevantTerms = [
      this.contractType.toLowerCase(),
      ...this.pattern.identification.contractTypes.map(t => t.toLowerCase())
    ];

    for (const term of relevantTerms) {
      if (risk.triggers.some(trigger => trigger.toLowerCase().includes(term)) ||
          risk.contextualFactors.some(factor => factor.toLowerCase().includes(term))) {
        return 1.0;
      }
    }

    return 0.6; // Default relevance
  }
}