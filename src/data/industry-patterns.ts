import { IndustryRiskPattern } from '@/types/industry';

export const INDUSTRY_RISK_PATTERNS: Record<string, IndustryRiskPattern> = {
  // Technology & Software
  'tech-software': {
    identification: {
      industryId: 'tech-software',
      industryName: 'Technology & Software',
      aliases: ['Software Development', 'SaaS', 'Technology Services', 'Software as a Service'],
      keywords: ['software', 'saas', 'platform', 'api', 'cloud', 'application', 'system', 'technology', 'digital', 'code'],
      contractTypes: ['Software License', 'SaaS Agreement', 'Technology Services', 'Development Agreement'],
      companyIndicators: ['Inc.', 'Corp.', 'LLC', 'Technologies', 'Systems', 'Software'],
      regulatoryFrameworks: ['GDPR', 'CCPA', 'SOC 2', 'ISO 27001', 'HIPAA']
    },
    riskCategories: {
      'Data Security': { weight: 0.25, description: 'Data protection and cybersecurity risks', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Intellectual Property': { weight: 0.20, description: 'IP ownership and licensing risks', commonIndustry: true, regulatoryDriven: false, businessCritical: true },
      'Service Availability': { weight: 0.15, description: 'Uptime and performance guarantees', commonIndustry: true, regulatoryDriven: false, businessCritical: true },
      'Compliance': { weight: 0.15, description: 'Regulatory compliance obligations', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Liability': { weight: 0.25, description: 'Software defects and damages', commonIndustry: true, regulatoryDriven: false, businessCritical: true }
    },
    specificRisks: [
      {
        id: 'tech-001',
        title: 'Unlimited Software Liability',
        description: 'Software provider may be exposed to unlimited liability for software defects, bugs, or system failures',
        category: 'Liability',
        severity: 'high',
        likelihood: 'medium',
        businessImpact: 'critical',
        triggers: ['unlimited liability', 'no liability cap', 'consequential damages', 'software defects'],
        contextualFactors: ['mission-critical software', 'large user base', 'financial systems'],
        mitigationStrategies: ['Liability caps', 'Exclusion of consequential damages', 'Mutual liability limitations'],
        regulatoryImplications: ['Consumer protection laws', 'Software liability standards'],
        industrySpecificNotes: 'Software companies typically negotiate liability caps due to the unpredictable nature of software defects'
      },
      {
        id: 'tech-002',
        title: 'Data Breach Exposure',
        description: 'Inadequate data protection measures may expose customer data to breaches and regulatory penalties',
        category: 'Data Security',
        severity: 'high',
        likelihood: 'medium',
        businessImpact: 'critical',
        triggers: ['data processing', 'personal information', 'customer data', 'breach notification'],
        contextualFactors: ['GDPR compliance', 'CCPA requirements', 'sensitive data types'],
        mitigationStrategies: ['Data encryption', 'Access controls', 'Breach response procedures', 'Regular security audits'],
        regulatoryImplications: ['GDPR fines', 'CCPA penalties', 'State data protection laws']
      },
      {
        id: 'tech-003',
        title: 'IP Ownership Ambiguity',
        description: 'Unclear intellectual property ownership rights over developed software, customizations, or derivative works',
        category: 'Intellectual Property',
        severity: 'high',
        likelihood: 'high',
        businessImpact: 'significant',
        triggers: ['custom development', 'modifications', 'derivative works', 'unclear IP ownership'],
        contextualFactors: ['joint development', 'client-specific features', 'open source components'],
        mitigationStrategies: ['Clear IP assignment clauses', 'Work-for-hire provisions', 'License grants']
      }
    ],
    criticalProtections: [
      {
        protectionType: 'Liability Limitation',
        description: 'Cap liability for software defects and indirect damages',
        priority: 'essential',
        contractClauses: ['Liability caps', 'Consequential damage exclusions', 'Mutual liability limitations'],
        industryStandards: ['12-month fee cap', 'Direct damages only']
      },
      {
        protectionType: 'Data Protection',
        description: 'Comprehensive data security and privacy protections',
        priority: 'essential',
        contractClauses: ['Data processing agreements', 'Security standards', 'Breach notification procedures'],
        legalRequirements: ['GDPR compliance', 'CCPA compliance']
      }
    ],
    complianceRequirements: {
      federal: ['Computer Fraud and Abuse Act', 'Electronic Communications Privacy Act'],
      state: ['California Consumer Privacy Act', 'New York SHIELD Act'],
      international: ['GDPR', 'Canadian PIPEDA'],
      industrySpecific: ['SOC 2 Type II', 'ISO 27001', 'PCI DSS'],
      certifications: ['SOC 2', 'ISO 27001', 'FedRAMP'],
      auditRequirements: ['Annual security audits', 'Penetration testing', 'Compliance assessments']
    },
    analysisConfig: {
      riskDetectionThreshold: 0.7,
      categoryWeights: {
        'Data Security': 0.25,
        'Intellectual Property': 0.20,
        'Service Availability': 0.15,
        'Compliance': 0.15,
        'Liability': 0.25
      },
      contextualFactorWeights: {
        'mission-critical': 1.5,
        'financial-systems': 1.4,
        'healthcare-data': 1.6,
        'large-scale': 1.3
      },
      complianceWeight: 0.2,
      businessImpactMultipliers: { critical: 1.5, significant: 1.2, moderate: 1.0, low: 0.8 },
      industrySpecificKeywords: ['software', 'saas', 'api', 'cloud', 'platform', 'application'],
      exclusionPatterns: ['hardware', 'manufacturing', 'physical goods']
    }
  },

  // Healthcare
  'healthcare': {
    identification: {
      industryId: 'healthcare',
      industryName: 'Healthcare',
      aliases: ['Medical', 'Health Services', 'Hospital', 'Clinical', 'Pharmaceutical'],
      keywords: ['healthcare', 'medical', 'patient', 'clinical', 'hospital', 'physician', 'treatment', 'diagnosis', 'pharmaceutical'],
      contractTypes: ['Medical Services Agreement', 'Provider Agreement', 'HIPAA Business Associate Agreement'],
      companyIndicators: ['Hospital', 'Medical Center', 'Health System', 'Clinic', 'Medical'],
      regulatoryFrameworks: ['HIPAA', 'FDA', 'DEA', 'Joint Commission', 'CMS']
    },
    riskCategories: {
      'Patient Privacy': { weight: 0.30, description: 'HIPAA and patient data protection', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Medical Malpractice': { weight: 0.25, description: 'Clinical care and treatment risks', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Regulatory Compliance': { weight: 0.20, description: 'Healthcare regulations and standards', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Emergency Care': { weight: 0.15, description: 'Emergency and critical care obligations', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Liability': { weight: 0.10, description: 'General healthcare liability', commonIndustry: true, regulatoryDriven: false, businessCritical: true }
    },
    specificRisks: [
      {
        id: 'health-001',
        title: 'HIPAA Violation Exposure',
        description: 'Inadequate protection of protected health information (PHI) may result in HIPAA violations and penalties',
        category: 'Patient Privacy',
        severity: 'high',
        likelihood: 'medium',
        businessImpact: 'critical',
        triggers: ['protected health information', 'PHI', 'patient data', 'medical records'],
        contextualFactors: ['electronic health records', 'cloud storage', 'third-party vendors'],
        mitigationStrategies: ['HIPAA compliance training', 'Business Associate Agreements', 'Encryption protocols'],
        regulatoryImplications: ['HHS fines', 'State regulatory actions', 'Criminal penalties']
      },
      {
        id: 'health-002',
        title: 'Medical Malpractice Liability',
        description: 'Healthcare providers may face unlimited liability for medical errors, misdiagnosis, or treatment complications',
        category: 'Medical Malpractice',
        severity: 'high',
        likelihood: 'high',
        businessImpact: 'critical',
        triggers: ['medical treatment', 'clinical decisions', 'patient care', 'diagnosis'],
        contextualFactors: ['high-risk procedures', 'emergency care', 'complex cases'],
        mitigationStrategies: ['Professional liability insurance', 'Clinical protocols', 'Peer review processes']
      }
    ],
    criticalProtections: [
      {
        protectionType: 'HIPAA Compliance',
        description: 'Comprehensive protection of patient health information',
        priority: 'essential',
        contractClauses: ['Business Associate Agreements', 'Data encryption requirements', 'Breach notification procedures'],
        legalRequirements: ['HIPAA Privacy Rule', 'HIPAA Security Rule']
      },
      {
        protectionType: 'Professional Liability',
        description: 'Medical malpractice and professional liability coverage',
        priority: 'essential',
        contractClauses: ['Professional liability insurance requirements', 'Standard of care definitions'],
        industryStandards: ['AMA guidelines', 'Joint Commission standards']
      }
    ],
    complianceRequirements: {
      federal: ['HIPAA', 'Stark Law', 'Anti-Kickback Statute', 'EMTALA'],
      state: ['Medical licensing requirements', 'State privacy laws'],
      international: ['Cross-border data transfer restrictions'],
      industrySpecific: ['Joint Commission standards', 'CMS requirements'],
      certifications: ['AAAHC accreditation', 'NCQA certification'],
      auditRequirements: ['HIPAA risk assessments', 'Clinical quality audits']
    },
    analysisConfig: {
      riskDetectionThreshold: 0.8,
      categoryWeights: {
        'Patient Privacy': 0.30,
        'Medical Malpractice': 0.25,
        'Regulatory Compliance': 0.20,
        'Emergency Care': 0.15,
        'Liability': 0.10
      },
      contextualFactorWeights: {
        'emergency-care': 1.6,
        'high-risk-procedures': 1.5,
        'patient-data': 1.4
      },
      complianceWeight: 0.3,
      businessImpactMultipliers: { critical: 1.6, significant: 1.3, moderate: 1.0, low: 0.7 },
      industrySpecificKeywords: ['patient', 'medical', 'clinical', 'healthcare', 'treatment'],
      exclusionPatterns: ['non-medical', 'administrative only']
    }
  },

  // Financial Services
  'financial-services': {
    identification: {
      industryId: 'financial-services',
      industryName: 'Financial Services',
      aliases: ['Banking', 'Insurance', 'Investment', 'Fintech', 'Financial Technology'],
      keywords: ['financial', 'banking', 'investment', 'insurance', 'loan', 'credit', 'payment', 'fintech', 'trading'],
      contractTypes: ['Banking Agreement', 'Investment Services', 'Insurance Policy', 'Payment Processing'],
      companyIndicators: ['Bank', 'Financial', 'Investment', 'Insurance', 'Capital', 'Fund'],
      regulatoryFrameworks: ['SOX', 'GLBA', 'PCI DSS', 'FFIEC', 'SEC', 'FINRA']
    },
    riskCategories: {
      'Financial Compliance': { weight: 0.30, description: 'Banking and financial regulations', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Data Security': { weight: 0.25, description: 'Financial data protection', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Fiduciary Duty': { weight: 0.20, description: 'Investment and advisory obligations', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Anti-Money Laundering': { weight: 0.15, description: 'AML and KYC compliance', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Liability': { weight: 0.10, description: 'Financial service liability', commonIndustry: true, regulatoryDriven: false, businessCritical: true }
    },
    specificRisks: [
      {
        id: 'fin-001',
        title: 'Regulatory Compliance Violations',
        description: 'Non-compliance with financial regulations may result in regulatory penalties, sanctions, or license revocation',
        category: 'Financial Compliance',
        severity: 'high',
        likelihood: 'medium',
        businessImpact: 'critical',
        triggers: ['financial services', 'banking activities', 'investment advice', 'payment processing'],
        contextualFactors: ['cross-border transactions', 'retail customers', 'institutional clients'],
        mitigationStrategies: ['Compliance monitoring', 'Regular audits', 'Staff training'],
        regulatoryImplications: ['SEC enforcement', 'FINRA sanctions', 'Banking regulator actions']
      }
    ],
    criticalProtections: [
      {
        protectionType: 'Regulatory Compliance',
        description: 'Comprehensive financial services compliance framework',
        priority: 'essential',
        contractClauses: ['Regulatory compliance warranties', 'Audit rights', 'Compliance monitoring'],
        legalRequirements: ['SOX compliance', 'GLBA requirements', 'SEC regulations']
      }
    ],
    complianceRequirements: {
      federal: ['Sarbanes-Oxley Act', 'Gramm-Leach-Bliley Act', 'Bank Secrecy Act', 'Dodd-Frank Act'],
      state: ['State banking laws', 'Insurance regulations'],
      international: ['Basel III', 'GDPR for financial data'],
      industrySpecific: ['PCI DSS', 'FFIEC guidelines', 'FINRA rules'],
      certifications: ['SOC 1 Type II', 'ISO 27001'],
      auditRequirements: ['Annual SOX audits', 'Regulatory examinations']
    },
    analysisConfig: {
      riskDetectionThreshold: 0.8,
      categoryWeights: {
        'Financial Compliance': 0.30,
        'Data Security': 0.25,
        'Fiduciary Duty': 0.20,
        'Anti-Money Laundering': 0.15,
        'Liability': 0.10
      },
      contextualFactorWeights: {
        'cross-border': 1.5,
        'retail-customers': 1.3,
        'payment-processing': 1.4
      },
      complianceWeight: 0.35,
      businessImpactMultipliers: { critical: 1.6, significant: 1.3, moderate: 1.0, low: 0.7 },
      industrySpecificKeywords: ['financial', 'banking', 'investment', 'payment', 'credit'],
      exclusionPatterns: ['non-financial', 'general business']
    }
  },

  // Manufacturing
  'manufacturing': {
    identification: {
      industryId: 'manufacturing',
      industryName: 'Manufacturing',
      aliases: ['Production', 'Industrial', 'Assembly', 'Factory Operations'],
      keywords: ['manufacturing', 'production', 'assembly', 'factory', 'industrial', 'supply chain', 'procurement', 'quality control'],
      contractTypes: ['Supply Agreement', 'Manufacturing Agreement', 'Distribution Agreement', 'OEM Agreement'],
      companyIndicators: ['Manufacturing', 'Industries', 'Corp.', 'Production', 'Assembly'],
      regulatoryFrameworks: ['OSHA', 'EPA', 'FDA', 'ISO 9001', 'ISO 14001']
    },
    riskCategories: {
      'Product Liability': { weight: 0.25, description: 'Defective product and safety risks', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Supply Chain': { weight: 0.20, description: 'Supplier and procurement risks', commonIndustry: true, regulatoryDriven: false, businessCritical: true },
      'Environmental': { weight: 0.20, description: 'Environmental compliance and impact', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Safety': { weight: 0.20, description: 'Workplace and operational safety', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Quality Control': { weight: 0.15, description: 'Product quality and standards', commonIndustry: true, regulatoryDriven: true, businessCritical: true }
    },
    specificRisks: [
      {
        id: 'mfg-001',
        title: 'Product Liability Exposure',
        description: 'Defective products may cause injury or damage, resulting in unlimited liability exposure',
        category: 'Product Liability',
        severity: 'high',
        likelihood: 'medium',
        businessImpact: 'critical',
        triggers: ['product defects', 'safety issues', 'manufacturing flaws', 'design defects'],
        contextualFactors: ['consumer products', 'safety-critical components', 'large-scale distribution'],
        mitigationStrategies: ['Product liability insurance', 'Quality control systems', 'Recall procedures'],
        regulatoryImplications: ['CPSC regulations', 'FDA requirements', 'Industry safety standards']
      }
    ],
    criticalProtections: [
      {
        protectionType: 'Product Liability Insurance',
        description: 'Comprehensive coverage for product-related claims',
        priority: 'essential',
        contractClauses: ['Product liability caps', 'Insurance requirements', 'Indemnification'],
        industryStandards: ['ISO 9001 quality management', 'Industry safety standards']
      }
    ],
    complianceRequirements: {
      federal: ['OSHA regulations', 'EPA environmental standards', 'CPSC safety requirements'],
      state: ['State environmental regulations', 'Worker safety laws'],
      international: ['CE marking', 'ISO standards', 'RoHS compliance'],
      industrySpecific: ['Industry safety standards', 'Quality management systems'],
      certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
      auditRequirements: ['Quality audits', 'Environmental assessments', 'Safety inspections']
    },
    analysisConfig: {
      riskDetectionThreshold: 0.75,
      categoryWeights: {
        'Product Liability': 0.25,
        'Supply Chain': 0.20,
        'Environmental': 0.20,
        'Safety': 0.20,
        'Quality Control': 0.15
      },
      contextualFactorWeights: {
        'consumer-products': 1.5,
        'safety-critical': 1.6,
        'large-scale': 1.3
      },
      complianceWeight: 0.25,
      businessImpactMultipliers: { critical: 1.5, significant: 1.2, moderate: 1.0, low: 0.8 },
      industrySpecificKeywords: ['manufacturing', 'production', 'assembly', 'quality', 'supply chain'],
      exclusionPatterns: ['software only', 'service only', 'consulting']
    }
  },

  // Real Estate
  'real-estate': {
    identification: {
      industryId: 'real-estate',
      industryName: 'Real Estate',
      aliases: ['Property Management', 'Real Estate Development', 'Property Investment'],
      keywords: ['real estate', 'property', 'lease', 'rental', 'development', 'construction', 'zoning', 'mortgage'],
      contractTypes: ['Lease Agreement', 'Purchase Agreement', 'Property Management Agreement', 'Development Agreement'],
      companyIndicators: ['Realty', 'Properties', 'Development', 'Real Estate', 'Property Management'],
      regulatoryFrameworks: ['Fair Housing Act', 'Americans with Disabilities Act', 'Environmental regulations']
    },
    riskCategories: {
      'Property Liability': { weight: 0.25, description: 'Property-related injury and damage risks', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Environmental': { weight: 0.20, description: 'Environmental contamination and compliance', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Fair Housing': { weight: 0.20, description: 'Discrimination and fair housing compliance', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Construction': { weight: 0.20, description: 'Construction and development risks', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
      'Tenant Relations': { weight: 0.15, description: 'Landlord-tenant disputes and obligations', commonIndustry: true, regulatoryDriven: true, businessCritical: true }
    },
    specificRisks: [
      {
        id: 're-001',
        title: 'Fair Housing Violations',
        description: 'Discriminatory practices in housing may violate fair housing laws and result in penalties',
        category: 'Fair Housing',
        severity: 'high',
        likelihood: 'medium',
        businessImpact: 'significant',
        triggers: ['housing discrimination', 'tenant screening', 'rental practices', 'accessibility'],
        contextualFactors: ['protected classes', 'disability accommodations', 'familial status'],
        mitigationStrategies: ['Fair housing training', 'Consistent screening criteria', 'Accessibility compliance'],
        regulatoryImplications: ['HUD enforcement', 'State civil rights violations', 'Private lawsuits']
      }
    ],
    criticalProtections: [
      {
        protectionType: 'General Liability Insurance',
        description: 'Property-related injury and damage coverage',
        priority: 'essential',
        contractClauses: ['Liability insurance requirements', 'Property maintenance obligations'],
        legalRequirements: ['Fair Housing Act compliance', 'ADA compliance']
      }
    ],
    complianceRequirements: {
      federal: ['Fair Housing Act', 'Americans with Disabilities Act', 'Environmental regulations'],
      state: ['State fair housing laws', 'Landlord-tenant laws', 'Building codes'],
      international: [],
      industrySpecific: ['Local zoning ordinances', 'Building safety codes'],
      certifications: ['Property management certifications'],
      auditRequirements: ['Fair housing compliance audits', 'Property inspections']
    },
    analysisConfig: {
      riskDetectionThreshold: 0.7,
      categoryWeights: {
        'Property Liability': 0.25,
        'Environmental': 0.20,
        'Fair Housing': 0.20,
        'Construction': 0.20,
        'Tenant Relations': 0.15
      },
      contextualFactorWeights: {
        'multi-family': 1.4,
        'commercial-property': 1.3,
        'development-project': 1.5
      },
      complianceWeight: 0.25,
      businessImpactMultipliers: { critical: 1.5, significant: 1.2, moderate: 1.0, low: 0.8 },
      industrySpecificKeywords: ['property', 'lease', 'rental', 'real estate', 'development'],
      exclusionPatterns: ['personal use', 'non-commercial']
    }
  }
};

export const FALLBACK_INDUSTRY_PATTERN: IndustryRiskPattern = {
  identification: {
    industryId: 'general-business',
    industryName: 'General Business',
    aliases: ['General Commercial', 'Business Services'],
    keywords: [],
    contractTypes: [],
    companyIndicators: [],
    regulatoryFrameworks: []
  },
  riskCategories: {
    'Liability': { weight: 0.25, description: 'General business liability', commonIndustry: true, regulatoryDriven: false, businessCritical: true },
    'Contract Terms': { weight: 0.25, description: 'Contract performance and termination', commonIndustry: true, regulatoryDriven: false, businessCritical: true },
    'Intellectual Property': { weight: 0.20, description: 'IP ownership and licensing', commonIndustry: true, regulatoryDriven: false, businessCritical: true },
    'Compliance': { weight: 0.15, description: 'General regulatory compliance', commonIndustry: true, regulatoryDriven: true, businessCritical: true },
    'Financial': { weight: 0.15, description: 'Payment and financial obligations', commonIndustry: true, regulatoryDriven: false, businessCritical: true }
  },
  specificRisks: [
    {
      id: 'gen-001',
      title: 'Unlimited Liability Exposure',
      description: 'Contract may expose party to unlimited financial liability for damages or losses',
      category: 'Liability',
      severity: 'high',
      likelihood: 'medium',
      businessImpact: 'significant',
      triggers: ['unlimited liability', 'no liability cap', 'consequential damages'],
      contextualFactors: ['high-value contract', 'critical operations', 'multiple parties'],
      mitigationStrategies: ['Liability caps', 'Insurance requirements', 'Limitation of damages']
    }
  ],
  criticalProtections: [
    {
      protectionType: 'Liability Limitation',
      description: 'Standard liability limitations and caps',
      priority: 'recommended',
      contractClauses: ['Liability caps', 'Mutual limitations', 'Insurance requirements']
    }
  ],
  complianceRequirements: {
    federal: ['General business regulations'],
    state: ['State business laws'],
    international: [],
    industrySpecific: [],
    certifications: [],
    auditRequirements: []
  },
  analysisConfig: {
    riskDetectionThreshold: 0.6,
    categoryWeights: {
      'Liability': 0.25,
      'Contract Terms': 0.25,
      'Intellectual Property': 0.20,
      'Compliance': 0.15,
      'Financial': 0.15
    },
    contextualFactorWeights: {
      'high-value': 1.3,
      'critical-operations': 1.4,
      'multiple-parties': 1.2
    },
    complianceWeight: 0.15,
    businessImpactMultipliers: { critical: 1.4, significant: 1.2, moderate: 1.0, low: 0.9 },
    industrySpecificKeywords: [],
    exclusionPatterns: []
  }
};