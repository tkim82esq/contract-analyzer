import { RiskNote, RiskNoteGenerationInput } from '@/types/risk-note';

export class RiskNoteGenerator {
  private static readonly ANALYZER_VERSION = '1.0.0';
  
  static generateRiskNote(input: RiskNoteGenerationInput): RiskNote {
    const startTime = Date.now();
    
    // Generate metadata
    const metadata = this.generateMetadata(input);
    
    // Analyze risks and generate executive summary
    const executiveSummary = this.generateExecutiveSummary(input.risks);
    
    // Create risk overview
    const riskOverview = this.generateRiskOverview(input.risks);
    
    // Transform risks to business language
    const detailedRisks = this.transformRisksToBusinessLanguage(input.risks);
    
    // Identify missing protections
    const missingProtections = this.identifyMissingProtections(input);
    
    // Generate negotiation priorities
    const negotiationPriorities = this.generateNegotiationPriorities(input.risks, missingProtections);
    
    // Create next steps
    const nextSteps = this.generateNextSteps(input.risks, executiveSummary);
    
    // Check compliance considerations
    const complianceConsiderations = this.generateComplianceConsiderations(input);
    
    // Create disclaimer
    const disclaimer = this.generateDisclaimer();
    
    const processingTime = Date.now() - startTime;
    metadata.processingTime = processingTime;
    
    return {
      metadata,
      executiveSummary,
      riskOverview,
      detailedRisks,
      missingProtections,
      negotiationPriorities,
      nextSteps,
      complianceConsiderations,
      disclaimer
    };
  }
  
  private static generateMetadata(input: RiskNoteGenerationInput) {
    const parties = Object.entries(input.extractedParties);
    const counterparty = parties.find(([role]) => role !== input.partyRole)?.[1] || 'Unknown';
    const yourOrganization = input.extractedParties[input.partyRole] || 'Your Organization';
    
    return {
      contractName: input.contractName,
      contractType: input.contractType,
      yourOrganization,
      counterparty,
      yourRole: input.partyRole,
      analysisDate: new Date().toLocaleString(),
      analyzerVersion: this.ANALYZER_VERSION,
      processingTime: 0 // Will be updated at the end
    };
  }
  
  private static generateExecutiveSummary(risks: RiskNoteGenerationInput['risks']) {
    const highRisks = risks.filter(r => r.severity === 'high');
    const mediumRisks = risks.filter(r => r.severity === 'medium');
    const lowRisks = risks.filter(r => r.severity === 'low');
    
    // Determine overall risk level
    let overallRiskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    let recommendedAction: 'NEGOTIATE_CRITICAL' | 'REVIEW_CAREFULLY' | 'PROCEED_WITH_CAUTION' | 'APPROVE_AS_IS';
    let keyMessage: string;
    
    if (highRisks.length >= 3 || highRisks.some(r => r.category.toLowerCase().includes('liability'))) {
      overallRiskLevel = 'HIGH';
      recommendedAction = 'NEGOTIATE_CRITICAL';
      keyMessage = `This contract contains ${highRisks.length} critical risk${highRisks.length > 1 ? 's' : ''} requiring immediate attention before signing.`;
    } else if (highRisks.length >= 1 || mediumRisks.length >= 3) {
      overallRiskLevel = 'MEDIUM';
      recommendedAction = 'REVIEW_CAREFULLY';
      keyMessage = `This contract has notable risks that should be carefully reviewed and potentially negotiated.`;
    } else if (mediumRisks.length >= 1 || lowRisks.length >= 3) {
      overallRiskLevel = 'LOW';
      recommendedAction = 'PROCEED_WITH_CAUTION';
      keyMessage = `This contract has minor risks that should be monitored but may be acceptable for your business needs.`;
    } else {
      overallRiskLevel = 'LOW';
      recommendedAction = 'APPROVE_AS_IS';
      keyMessage = `This contract appears to have minimal risks and may be suitable for approval as written.`;
    }
    
    // Calculate confidence score based on risk clarity and completeness
    const confidenceScore = this.calculateConfidenceScore(risks);
    
    return {
      overallRiskLevel,
      recommendedAction,
      keyMessage,
      confidenceScore
    };
  }
  
  private static generateRiskOverview(risks: RiskNoteGenerationInput['risks']) {
    const breakdown = {
      high: risks.filter(r => r.severity === 'high').length,
      medium: risks.filter(r => r.severity === 'medium').length,
      low: risks.filter(r => r.severity === 'low').length
    };
    
    // Get top concerns (highest severity risks)
    const topConcerns = risks
      .filter(r => r.severity === 'high')
      .slice(0, 5)
      .map(r => r.title);
    
    // If not enough high risks, add medium ones
    if (topConcerns.length < 3) {
      const mediumRisks = risks
        .filter(r => r.severity === 'medium')
        .slice(0, 5 - topConcerns.length)
        .map(r => r.title);
      topConcerns.push(...mediumRisks);
    }
    
    // Group risks by category
    const riskCategories: Record<string, number> = {};
    risks.forEach(risk => {
      const category = risk.category || 'General';
      riskCategories[category] = (riskCategories[category] || 0) + 1;
    });
    
    return {
      breakdown,
      topConcerns,
      riskCategories
    };
  }
  
  private static transformRisksToBusinessLanguage(risks: RiskNoteGenerationInput['risks']) {
    return risks.map(risk => ({
      id: risk.id.toString(),
      title: risk.title,
      impactLevel: risk.severity.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
      businessImpact: this.translateToBusinessImpact(risk),
      contractReference: risk.clauseLocation || 'See contract details',
      recommendedAction: this.generateActionableRecommendation(risk),
      urgency: this.determineUrgency(risk),
      category: risk.category || 'General',
      financialImpact: this.estimateFinancialImpact(risk)
    }));
  }
  
  private static translateToBusinessImpact(risk: RiskNoteGenerationInput['risks'][0]): string {
    const impactMap: Record<string, string> = {
      'liability': 'Could expose your organization to legal claims and financial damages',
      'compliance': 'May result in regulatory violations and potential fines',
      'operational': 'Could disrupt business operations and service delivery',
      'financial': 'May impact cash flow and financial performance',
      'intellectual property': 'Could compromise your proprietary information and competitive advantage',
      'termination': 'May limit your ability to exit the agreement when needed',
      'data protection': 'Could expose sensitive data and violate privacy regulations'
    };
    
    const category = risk.category.toLowerCase();
    const baseImpact = impactMap[category] || 'Could negatively impact your business operations';
    
    // Enhance with specific context from risk description
    if (risk.description.includes('payment') || risk.description.includes('cost')) {
      return `${baseImpact}. This could result in unexpected costs or payment obligations.`;
    }
    
    if (risk.description.includes('breach') || risk.description.includes('violation')) {
      return `${baseImpact}. Failure to comply could result in contract breach and associated penalties.`;
    }
    
    return `${baseImpact}. ${risk.description.split('.')[0]}.`;
  }
  
  private static generateActionableRecommendation(risk: RiskNoteGenerationInput['risks'][0]): string {
    if (risk.mitigation) {
      const actionMap = {
        'add': 'Add the following clause',
        'modify': 'Request modification of the existing clause',
        'remove': 'Request removal of the problematic clause'
      };
      
      return `${actionMap[risk.mitigation.action]}: "${risk.mitigation.suggestedText}". ${risk.mitigation.explanation}`;
    }
    
    return risk.recommendation;
  }
  
  private static determineUrgency(risk: RiskNoteGenerationInput['risks'][0]): 'CRITICAL' | 'IMPORTANT' | 'MODERATE' {
    if (risk.severity === 'high') {
      if (risk.category.toLowerCase().includes('liability') || 
          risk.category.toLowerCase().includes('compliance') ||
          risk.description.toLowerCase().includes('breach')) {
        return 'CRITICAL';
      }
      return 'IMPORTANT';
    }
    
    if (risk.severity === 'medium') {
      return 'IMPORTANT';
    }
    
    return 'MODERATE';
  }
  
  private static estimateFinancialImpact(risk: RiskNoteGenerationInput['risks'][0]): string | undefined {
    const description = risk.description.toLowerCase();
    
    if (description.includes('unlimited liability') || description.includes('uncapped')) {
      return 'Potentially unlimited financial exposure';
    }
    
    if (description.includes('penalty') || description.includes('fine')) {
      return 'Could result in monetary penalties';
    }
    
    if (description.includes('payment') || description.includes('cost')) {
      return 'May increase project costs';
    }
    
    if (risk.severity === 'high') {
      return 'Potentially significant financial impact';
    }
    
    return undefined;
  }
  
  private static identifyMissingProtections(input: RiskNoteGenerationInput) {
    const protections = [];
    const contractType = input.contractType.toLowerCase();
    const hasRisk = (category: string) => input.risks.some(r => r.category.toLowerCase().includes(category));
    
    // Common missing protections by contract type
    if (contractType.includes('employment')) {
      if (!hasRisk('termination')) {
        protections.push({
          protection: 'Termination Protection',
          importance: 'CRITICAL' as const,
          suggestedLanguage: 'Either party may terminate this agreement with 30 days written notice.',
          businessRationale: 'Provides flexibility to exit if circumstances change'
        });
      }
    }
    
    if (contractType.includes('service') || contractType.includes('consulting')) {
      if (!hasRisk('liability')) {
        protections.push({
          protection: 'Liability Limitation',
          importance: 'CRITICAL' as const,
          suggestedLanguage: 'Service provider\'s liability shall not exceed the total fees paid under this agreement.',
          businessRationale: 'Limits your financial exposure in case of service failures'
        });
      }
    }
    
    if (contractType.includes('data') || contractType.includes('saas')) {
      if (!hasRisk('data protection')) {
        protections.push({
          protection: 'Data Protection Clause',
          importance: 'CRITICAL' as const,
          suggestedLanguage: 'Provider shall implement appropriate technical and organizational measures to protect personal data.',
          businessRationale: 'Ensures compliance with data protection regulations'
        });
      }
    }
    
    // Always recommend IP protection if not present
    if (!hasRisk('intellectual property')) {
      protections.push({
        protection: 'Intellectual Property Rights',
        importance: 'IMPORTANT' as const,
        suggestedLanguage: 'Each party retains ownership of their pre-existing intellectual property.',
        businessRationale: 'Protects your existing IP and clarifies ownership of new developments'
      });
    }
    
    return protections;
  }
  
  private static generateNegotiationPriorities(risks: RiskNoteGenerationInput['risks'], missingProtections: any[]) {
    const highRisks = risks.filter(r => r.severity === 'high');
    const mediumRisks = risks.filter(r => r.severity === 'medium');
    const lowRisks = risks.filter(r => r.severity === 'low');
    
    const mustHave = [
      ...highRisks.map(risk => ({
        item: risk.title,
        rationale: `This ${risk.severity}-severity risk could significantly impact your business`,
        dealBreaker: risk.category.toLowerCase().includes('liability') || 
                    risk.category.toLowerCase().includes('compliance')
      })),
      ...missingProtections.filter(p => p.importance === 'CRITICAL').map(p => ({
        item: p.protection,
        rationale: p.businessRationale,
        dealBreaker: true
      }))
    ];
    
    const shouldHave = [
      ...mediumRisks.map(risk => ({
        item: risk.title,
        rationale: `Addressing this risk would strengthen your position`,
        negotiatingPower: 'MEDIUM' as const
      })),
      ...missingProtections.filter(p => p.importance === 'IMPORTANT').map(p => ({
        item: p.protection,
        rationale: p.businessRationale,
        negotiatingPower: 'HIGH' as const
      }))
    ];
    
    const niceToHave = lowRisks.map(risk => ({
      item: risk.title,
      rationale: `Minor improvement that could be beneficial if easily negotiated`
    }));
    
    return {
      mustHave,
      shouldHave,
      niceToHave
    };
  }
  
  private static generateNextSteps(risks: RiskNoteGenerationInput['risks'], executiveSummary: any) {
    const steps = [];
    
    // Immediate actions for high-risk items
    const highRisks = risks.filter(r => r.severity === 'high');
    if (highRisks.length > 0) {
      steps.push({
        action: 'Review Critical Risk Items',
        timeline: 'Within 24 hours',
        stakeholder: 'Legal Team',
        priority: 'IMMEDIATE' as const,
        description: `Conduct detailed review of ${highRisks.length} high-risk item${highRisks.length > 1 ? 's' : ''} identified in the analysis`
      });
    }
    
    // Negotiation preparation
    if (executiveSummary.recommendedAction === 'NEGOTIATE_CRITICAL') {
      steps.push({
        action: 'Prepare Negotiation Strategy',
        timeline: 'Within 2-3 days',
        stakeholder: 'Legal & Business Teams',
        priority: 'WITHIN_WEEK' as const,
        description: 'Develop negotiation priorities and alternative language for critical contract terms'
      });
    }
    
    // Stakeholder communication
    steps.push({
      action: 'Communicate Findings to Stakeholders',
      timeline: 'Within 1 week',
      stakeholder: 'Business Owner/Manager',
      priority: 'WITHIN_WEEK' as const,
      description: 'Brief relevant stakeholders on contract risks and recommended actions'
    });
    
    // Final review
    steps.push({
      action: 'Final Contract Review',
      timeline: 'Before signing',
      stakeholder: 'Legal Team',
      priority: 'BEFORE_SIGNING' as const,
      description: 'Conduct final review after any negotiated changes have been incorporated'
    });
    
    return steps;
  }
  
  private static generateComplianceConsiderations(input: RiskNoteGenerationInput) {
    const contractType = input.contractType.toLowerCase();
    const description = input.risks.map(r => r.description.toLowerCase()).join(' ');
    
    const regulations = [];
    const requirements = [];
    const gaps = [];
    
    // Data protection compliance
    if (description.includes('data') || description.includes('personal information')) {
      regulations.push('GDPR', 'CCPA');
      requirements.push('Data processing agreements', 'Privacy impact assessments');
      
      if (!input.risks.some(r => r.category.toLowerCase().includes('data protection'))) {
        gaps.push('Missing data protection safeguards');
      }
    }
    
    // Employment compliance
    if (contractType.includes('employment')) {
      regulations.push('Labor Laws', 'Employment Standards');
      requirements.push('Minimum wage compliance', 'Termination notice requirements');
    }
    
    // Financial services compliance
    if (contractType.includes('financial') || contractType.includes('loan')) {
      regulations.push('Consumer Protection Laws', 'Financial Services Regulations');
      requirements.push('Interest rate disclosures', 'Consumer rights notifications');
    }
    
    return regulations.length > 0 ? {
      regulations,
      requirements,
      gaps
    } : undefined;
  }
  
  private static generateDisclaimer(): string {
    return `This risk assessment is generated by AI-assisted analysis and should not be considered as legal advice. The analysis is based on standard contract principles and common business practices. For specific legal guidance, please consult with a qualified attorney familiar with your jurisdiction and business requirements. The recommendations provided are suggestions for consideration and may not be applicable to all situations.`;
  }
  
  private static calculateConfidenceScore(risks: RiskNoteGenerationInput['risks']): number {
    let score = 0.7; // Base confidence
    
    // Higher confidence if we have detailed risk information
    const detailedRisks = risks.filter(r => r.description.length > 50);
    score += (detailedRisks.length / risks.length) * 0.2;
    
    // Higher confidence if we have mitigation strategies
    const risksWithMitigation = risks.filter(r => r.mitigation);
    score += (risksWithMitigation.length / risks.length) * 0.1;
    
    // Cap at 0.95 to acknowledge AI limitations
    return Math.min(score, 0.95);
  }
}