// Contract-specific analysis templates with key review points and red flags

export interface ContractTemplate {
  contractType: string;
  keyReviewPoints: ReviewPoint[];
  redFlags: RedFlag[];
  partySpecificConcerns: {
    [partyRole: string]: string[];
  };
  criticalClauses: string[];
  advancedComplianceNotes?: {
    multiJurisdictionalConsiderations: string[];
    federalRegulatoryOverlay: string[];
    industrySpecificRequirements: string[];
  };
}

export interface ReviewPoint {
  category: string;
  description: string;
  mustHave: string[];
  shouldAvoid: string[];
}

export interface RedFlag {
  pattern: string;
  severity: 'high' | 'medium' | 'low';
  explanation: string;
  affectedParty: string | 'both';
}

export const CONTRACT_TEMPLATES: { [key: string]: ContractTemplate } = {
  'Employment Agreement': {
    contractType: 'Employment Agreement',
    keyReviewPoints: [
      {
        category: 'At-Will Employment Status & Termination Rights',
        description: 'Framework governing employment relationship continuity, termination procedures, and jurisdictional variations on at-will doctrine',
        mustHave: [
          'Clear at-will employment statement (where applicable)',
          'Specific termination notice requirements (typically 30-90 days)',
          'Severance pay formulas tied to tenure/position',
          'Good reason/constructive discharge definitions',
          'Cause termination enumerated grounds',
          'Garden leave provisions during notice period',
          'Accrued benefits payment upon termination',
          'WARN Act compliance language',
          'State-specific final paycheck timing',
          'Post-termination cooperation obligations'
        ],
        shouldAvoid: [
          'Waiver of statutory termination rights',
          'Unlimited post-termination obligations',
          'Forfeiture of earned compensation',
          'Retroactive cause determinations',
          'Employer sole discretion on "cause"',
          'No cure periods for performance issues',
          'Automatic forfeiture of vested benefits',
          'Indefinite non-disparagement obligations',
          'Waiver of unemployment benefits',
          'Personal liability for business losses'
        ]
      },
      {
        category: 'Compensation Architecture & Benefits Structure',
        description: 'Total rewards framework including base salary, incentives, equity, benefits, and statutory compliance',
        mustHave: [
          'Base salary amount and payment frequency',
          'Bonus structure with objective metrics',
          'Commission plans with calculation methods',
          'Equity grant details (vesting, acceleration)',
          'Benefits eligibility and waiting periods',
          'PTO accrual rates and carryover policies',
          'Expense reimbursement procedures',
          'Salary review timeline commitments',
          'FLSA classification confirmation',
          'State wage and hour compliance'
        ],
        shouldAvoid: [
          'Discretionary compensation without guidelines',
          'Below minimum wage structures',
          'Illegal deductions from pay',
          'Forfeiture of earned bonuses',
          'Retroactive compensation changes',
          'No payment during disability',
          'Unlimited clawback provisions',
          'Benefits inferior to company policy',
          'No overtime for non-exempt roles',
          'Currency risk on employee'
        ]
      },
      {
        category: 'Intellectual Property Assignment & Innovation Rights',
        description: 'Comprehensive framework for ownership of work product, inventions, and pre-existing intellectual property',
        mustHave: [
          'Present assignment of employment inventions',
          'Specific definition of company IP',
          'Prior invention disclosure schedule',
          'Moral rights waiver (where applicable)',
          'Trade secret acknowledgment',
          'Third-party IP warranty',
          'Invention disclosure obligations',
          'Patent/copyright cooperation duties',
          'Exclusion for personal time inventions',
          'State labor code compliance (e.g., Cal. Labor Code 2870)'
        ],
        shouldAvoid: [
          'Assignment of pre-employment inventions',
          'No carve-out for personal projects',
          'Perpetual assignment obligations',
          'Assignment of ideas/concepts broadly',
          'No compensation for patents',
          'Retroactive assignments',
          'Assignment of non-job-related work',
          'Waiver of inventor remuneration rights',
          'Unlimited derivative works claims',
          'Personal social media content claims'
        ]
      },
      {
        category: 'Restrictive Covenants & Post-Employment Obligations',
        description: 'Non-competition, non-solicitation, and confidentiality restrictions with jurisdictional enforceability analysis',
        mustHave: [
          'Geographic scope limitations',
          'Temporal restrictions (6-24 months typical)',
          'Narrow competitive activity definition',
          'Customer non-solicitation parameters',
          'Employee non-solicitation carve-outs',
          'Confidentiality survival terms',
          'Public information exceptions',
          'Garden leave or compensation during restrictions',
          'Choice of law for enforceability',
          'Blue pencil/reformation provisions'
        ],
        shouldAvoid: [
          'Nationwide/global restrictions',
          'Indefinite time periods',
          'Industry-wide prohibitions',
          'No compensation during non-compete',
          'Restrictions on non-competitive roles',
          'No geographic limitations',
          'Broad "competition" definitions',
          'Family member restrictions',
          'Vendor/supplier prohibitions',
          'Prior knowledge restrictions'
        ]
      },
      {
        category: 'Dispute Resolution & Claims Procedures',
        description: 'Framework for resolving employment disputes including arbitration, jury waivers, and class action provisions',
        mustHave: [
          'Step-wise dispute escalation process',
          'Arbitration provisions (if applicable)',
          'Arbitrator selection procedures',
          'Cost-sharing arrangements',
          'Venue selection rationale',
          'Carve-outs for injunctive relief',
          'EEOC/agency charge rights preserved',
          'Statute of limitations provisions',
          'Attorney fee shifting provisions',
          'Survival of dispute resolution terms'
        ],
        shouldAvoid: [
          'Waiver of statutory claims',
          'Employee pays all arbitration costs',
          'Employer sole arbitrator selection',
          'No discovery rights',
          'Prohibition on agency charges',
          'Shortened limitations periods',
          'No appeal rights',
          'Confidential arbitration outcomes',
          'Waiver of whistleblower rights',
          'Personal liability for legal costs'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'for any reason.*sole discretion|without cause.*forfeiture|discretionary.*bonus',
        severity: 'high',
        explanation: 'Unlimited employer discretion undermines compensation security and may violate wage payment laws',
        affectedParty: 'Employee'
      },
      {
        pattern: 'worldwide.*non-compete|indefinite.*period|any.*competitive.*business',
        severity: 'high',
        explanation: 'Overbroad restrictive covenants likely unenforceable and may invalidate entire provision',
        affectedParty: 'Employee'
      },
      {
        pattern: 'waive.*all claims|release.*unknown claims|covenant not to sue',
        severity: 'high',
        explanation: 'Prospective releases generally unenforceable; violates public policy and statutory rights',
        affectedParty: 'Employee'
      },
      {
        pattern: 'personal.*guarantee|individually.*liable|personal.*responsibility',
        severity: 'high',
        explanation: 'Pierces corporate veil; creates inappropriate personal liability for business obligations',
        affectedParty: 'Employee'
      },
      {
        pattern: 'no overtime.*exempt employee|salary.*covers all hours|FLSA.*waiver',
        severity: 'high',
        explanation: 'Cannot waive FLSA rights; misclassification creates significant liability',
        affectedParty: 'both'
      },
      {
        pattern: 'assign.*all inventions|including.*prior inventions|retroactive.*assignment',
        severity: 'high',
        explanation: 'Overreaching IP assignment may violate state labor codes and prior obligations',
        affectedParty: 'Employee'
      },
      {
        pattern: 'prohibited.*from working|cannot.*accept employment|industry.*ban',
        severity: 'medium',
        explanation: 'May constitute unlawful restraint on employment; unenforceable in many jurisdictions',
        affectedParty: 'Employee'
      },
      {
        pattern: 'forfeit.*earned compensation|clawback.*salary|retroactive.*reduction',
        severity: 'high',
        explanation: 'Violates wage payment laws; earned wages cannot be forfeited',
        affectedParty: 'Employee'
      }
    ],
    partySpecificConcerns: {
      'Employee': [
        'Compensation Security: Protection against arbitrary reduction or forfeiture of earned wages',
        'Career Mobility: Reasonable post-employment restrictions that don\'t prevent career advancement',
        'Benefits Portability: COBRA rights, 401(k) vesting, equity acceleration triggers',
        'Job Security: Clear performance standards, progressive discipline, cure periods',
        'Work-Life Balance: Defined work hours, overtime compensation, leave policies',
        'Professional Development: Training opportunities, skill development, industry participation',
        'Dispute Resolution Costs: Fair allocation of legal fees and arbitration expenses',
        'Reputational Protection: Mutual non-disparagement, reference policies, departure messaging',
        'Immigration Support: Visa sponsorship commitments, green card processing timelines',
        'Change in Control: Severance triggers, equity acceleration, good reason definitions'
      ],
      'Employer': [
        'Workforce Stability: Reasonable notice periods, transition assistance, knowledge transfer',
        'IP Protection: Comprehensive assignment, invention disclosure, trade secret protection',
        'Competitive Advantage: Enforceable non-compete/non-solicit within jurisdiction limits',
        'Confidentiality Safeguards: Clear definitions, return of materials, forensic compliance',
        'Performance Management: Right to terminate for cause, performance improvement processes',
        'Regulatory Compliance: Proper classification, wage/hour compliance, discrimination prevention',
        'Business Flexibility: Ability to modify duties, reporting, location within reason',
        'Cost Control: Defined compensation limits, benefit cost-sharing, bonus pool discretion',
        'Risk Mitigation: Indemnification from employee acts, insurance requirements',
        'Cultural Fit: Probationary periods, values alignment, code of conduct compliance'
      ]
    },
    criticalClauses: [
      'At-Will Employment Statement',
      'Compensation and Benefits',
      'Intellectual Property Assignment',
      'Confidentiality and Trade Secrets',
      'Restrictive Covenants',
      'Termination Provisions',
      'Dispute Resolution/Arbitration',
      'Code of Conduct/Policies Integration',
      'Representations and Warranties',
      'Choice of Law and Venue'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'California: Prohibits most non-competes; specific invention assignment rules',
        'New York: Salary threshold for exempt employees; pay frequency requirements',
        'Massachusetts: Garden leave requirements; specific NDA limitations',
        'Washington: Salary thresholds for non-competes; specific disclosure requirements',
        'Illinois: Advance notice for non-competes; specific consideration requirements'
      ],
      federalRegulatoryOverlay: [
        'NLRB: Restrictions on confidentiality/non-disparagement affecting Section 7 rights',
        'FTC: Proposed non-compete ban considerations',
        'DOL: Independent contractor classification tests',
        'EEOC: Release requirements and protected characteristics',
        'SEC: Whistleblower protection requirements'
      ],
      industrySpecificRequirements: [
        'Healthcare: State licensing, Medicare/Medicaid exclusions',
        'Financial Services: FINRA registration, U4/U5 considerations',
        'Technology: Export control, open source policies',
        'Government Contractors: Security clearances, compliance requirements'
      ]
    }
  },

  'Service Agreement': {
    contractType: 'Service Agreement',
    keyReviewPoints: [
      {
        category: 'Service Level Agreements (SLAs)',
        description: 'Performance standards and metrics',
        mustHave: [
          'Specific uptime/availability targets',
          'Response time requirements',
          'Performance metrics and measurement',
          'Remedies for SLA breaches'
        ],
        shouldAvoid: [
          'Vague "best efforts" standards',
          'No consequences for failures',
          'Unrealistic performance targets',
          'One-sided penalty clauses'
        ]
      },
      {
        category: 'Payment Terms',
        description: 'Pricing, invoicing, and payment conditions',
        mustHave: [
          'Clear pricing structure',
          'Payment schedule and terms',
          'Expense reimbursement policy',
          'Late payment penalties'
        ],
        shouldAvoid: [
          'Unlimited price increases',
          'Hidden fees or charges',
          'Unreasonable payment delays',
          'No dispute resolution process'
        ]
      },
      {
        category: 'Data Security & Privacy',
        description: 'Data handling and protection requirements',
        mustHave: [
          'Data security standards',
          'Privacy compliance requirements',
          'Breach notification procedures',
          'Data ownership clarity'
        ],
        shouldAvoid: [
          'Weak security commitments',
          'Unclear data ownership',
          'No breach liability',
          'Broad data usage rights'
        ]
      },
      {
        category: 'Liability & Indemnification',
        description: 'Risk allocation and protection',
        mustHave: [
          'Reasonable liability caps',
          'Mutual indemnification',
          'Insurance requirements',
          'Exclusion of consequential damages'
        ],
        shouldAvoid: [
          'Unlimited liability',
          'One-sided indemnification',
          'No liability caps',
          'Broad warranty disclaimers'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'unlimited liability',
        severity: 'high',
        explanation: 'Exposes party to catastrophic financial risk',
        affectedParty: 'Service Provider'
      },
      {
        pattern: 'no warranty.*any kind',
        severity: 'high',
        explanation: 'Complete disclaimer of service quality',
        affectedParty: 'Client'
      },
      {
        pattern: 'automatic renewal',
        severity: 'medium',
        explanation: 'Difficult to exit contract',
        affectedParty: 'both'
      },
      {
        pattern: 'exclusive.*perpetual',
        severity: 'high',
        explanation: 'Prevents working with others indefinitely',
        affectedParty: 'Service Provider'
      }
    ],
    partySpecificConcerns: {
      'Service Provider': [
        'Payment certainty and timing',
        'Scope creep prevention',
        'Liability limitations',
        'IP ownership of deliverables'
      ],
      'Client': [
        'Service quality guarantees',
        'Data security and privacy',
        'Flexibility to change providers',
        'Cost predictability'
      ]
    },
    criticalClauses: [
      'Scope of Services',
      'Service Level Agreements',
      'Payment Terms',
      'Liability and Indemnification',
      'Data Security',
      'Termination Rights'
    ]
  },

  'Consulting Agreement': {
    contractType: 'Consulting Agreement',
    keyReviewPoints: [
      {
        category: 'Independent Contractor Classification Compliance',
        description: 'Multi-factor analysis ensuring legitimate contractor status under federal and state classification tests',
        mustHave: [
          'Right to control analysis documentation',
          'Multiple client acknowledgment',
          'Business entity operation confirmation',
          'Contractor\'s tools and equipment usage',
          'No integration into client operations',
          'Project-based scope definition',
          'Freedom to accept/reject projects',
          'No mandatory work hours/location',
          'Subcontracting rights preserved',
          'Economic independence indicators'
        ],
        shouldAvoid: [
          'Behavioral control by client',
          'Exclusive service requirements',
          'Regular employment benefits',
          'Performance evaluations like employees',
          'Required training attendance',
          'Client approval for time off',
          'Integration with employee teams',
          'Indefinite ongoing services',
          'Daily supervision/direction',
          'Employment-like termination procedures'
        ]
      },
      {
        category: 'Scope Management & Deliverable Framework',
        description: 'Clear project boundaries, change management processes, and acceptance criteria',
        mustHave: [
          'Detailed statement of work',
          'Specific deliverable descriptions',
          'Acceptance criteria and timelines',
          'Change order procedures',
          'Scope creep prevention language',
          'Project assumptions documented',
          'Dependencies on client actions',
          'Milestone completion definitions',
          'Out-of-scope work protocols',
          'Resource requirement specifications'
        ],
        shouldAvoid: [
          'Unlimited revisions included',
          'Vague success criteria',
          'Open-ended service obligations',
          'No change order compensation',
          'Subjective acceptance standards',
          'Perpetual warranty on work',
          'Undefined "reasonable" requests',
          'No deadline for acceptance',
          'Retroactive scope expansion',
          'Success fee only compensation'
        ]
      },
      {
        category: 'Fee Structure & Payment Security',
        description: 'Compensation framework supporting contractor independence with payment protection',
        mustHave: [
          'Fixed project or hourly fees stated',
          'Payment milestone schedule',
          'Invoice requirements specified',
          'Net payment terms (30/45 days)',
          'Late payment interest rates',
          'Expense reimbursement procedures',
          'Currency and payment methods',
          'Partial payment for termination',
          'No pay contingencies beyond control',
          'Dispute escrow procedures'
        ],
        shouldAvoid: [
          'Success-only compensation',
          'Client discretionary payments',
          'No payment for completed phases',
          'Excessive retainage amounts',
          'Payment after total completion',
          'No interest on late payments',
          'Offset rights too broad',
          'Contingent fee arrangements',
          'Below-market rate structures',
          'Personal payment guarantees'
        ]
      },
      {
        category: 'Intellectual Property Architecture',
        description: 'Sophisticated IP framework balancing client ownership needs with consultant\'s portfolio rights',
        mustHave: [
          'Work product specific definition',
          'Present assignment language',
          'Background IP identification',
          'Residual knowledge rights',
          'Consultant tools/methods exclusion',
          'Third-party IP warranties',
          'Open source compliance',
          'Feedback loop ownership',
          'Portfolio/reference rights',
          'Joint IP development protocols'
        ],
        shouldAvoid: [
          'Pre-existing IP assignment',
          'Methods/processes assignment',
          'Perpetual improvements capture',
          'No portfolio use rights',
          'Broad derivative works claims',
          'Moral rights issues ignored',
          'Trade secret claims on methods',
          'Future invention assignments',
          'Competitor restriction via IP',
          'Social media content claims'
        ]
      },
      {
        category: 'Risk Allocation & Professional Liability',
        description: 'Balanced indemnification and liability framework appropriate to engagement scale',
        mustHave: [
          'Mutual indemnification structure',
          'Liability caps tied to fees',
          'Professional liability insurance',
          'General liability requirements',
          'Cyber coverage for data work',
          'Notice and defense procedures',
          'Consequential damage waivers',
          'Gross negligence exceptions',
          'Third-party claim procedures',
          'Reasonable mitigation duties'
        ],
        shouldAvoid: [
          'Unlimited liability exposure',
          'Strict liability indemnities',
          'First dollar defense costs',
          'No liability limitations',
          'Personal asset exposure',
          'Indemnity for client changes',
          'Warranty of results',
          'No insurance requirements',
          'Perpetual indemnity survival',
          'Punitive damages coverage'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'exclusive.*consultant|full-time.*availability|dedicated.*resources',
        severity: 'high',
        explanation: 'Exclusivity destroys contractor independence; creates employment relationship risk',
        affectedParty: 'both'
      },
      {
        pattern: 'employee.*handbook|company.*policies apply|must follow.*procedures',
        severity: 'high',
        explanation: 'Policy integration indicates employment; behavioral control fatal to contractor status',
        affectedParty: 'both'
      },
      {
        pattern: 'unlimited revisions|changes at no cost|Client satisfaction',
        severity: 'high',
        explanation: 'Open-ended obligations destroy project economics; enables scope exploitation',
        affectedParty: 'Consultant'
      },
      {
        pattern: 'all intellectual property|including.*pre-existing|background.*IP',
        severity: 'high',
        explanation: 'Overreaching assignment threatens consultant\'s entire business portfolio',
        affectedParty: 'Consultant'
      },
      {
        pattern: 'personally liable|individual.*guarantee|personal.*indemnity',
        severity: 'high',
        explanation: 'Pierces business entity protection; creates catastrophic personal exposure',
        affectedParty: 'Consultant'
      },
      {
        pattern: 'payment upon completion|contingent.*on success|Client.*discretion',
        severity: 'medium',
        explanation: 'Payment uncertainty undermines contractor independence; may violate prompt pay laws',
        affectedParty: 'Consultant'
      },
      {
        pattern: 'perpetual.*warranty|lifetime.*support|ongoing.*maintenance',
        severity: 'medium',
        explanation: 'Indefinite obligations without compensation destroy project economics',
        affectedParty: 'Consultant'
      },
      {
        pattern: 'no competing.*services|exclusive.*industry|non-compete.*during',
        severity: 'high',
        explanation: 'Restraints during term indicate employment; may violate antitrust laws',
        affectedParty: 'Consultant'
      }
    ],
    partySpecificConcerns: {
      'Consultant': [
        'Classification Risk: Personal liability exposure if recharacterized as employment',
        'Payment Security: Collection rights, prompt payment, mechanic\'s liens availability',
        'Scope Management: Protection against unlimited revisions and scope creep',
        'Business Independence: Freedom to serve multiple clients and build practice',
        'IP Portfolio: Protecting tools, methodologies, and background technology',
        'Professional Reputation: Portfolio rights, references, public recognition',
        'Liability Limits: Proportional risk allocation to project size and fees',
        'Exit Strategy: Clean disengagement without ongoing obligations',
        'Market Access: No restraints on industry participation',
        'Economic Viability: Profitable engagement structure with clear boundaries'
      ],
      'Client': [
        'Deliverable Quality: Clear acceptance criteria and warranty provisions',
        'Budget Certainty: Fixed fees or clear hourly caps with change control',
        'IP Ownership: Clean chain of title for all work product',
        'Confidentiality: Protection of trade secrets and competitive information',
        'Regulatory Compliance: Avoiding joint employer or misclassification liability',
        'Business Continuity: Knowledge transfer and documentation requirements',
        'Performance Remedies: Recourse for defective or late deliverables',
        'Strategic Alignment: Consultant understanding of business objectives',
        'Risk Transfer: Appropriate insurance and indemnification',
        'Competitive Protection: Reasonable restrictions on competitor engagement'
      ]
    },
    criticalClauses: [
      'Independent Contractor Relationship',
      'Statement of Work/Scope of Services',
      'Compensation and Payment Terms',
      'Intellectual Property Rights',
      'Confidentiality Obligations',
      'Warranties and Representations',
      'Indemnification and Liability Limits',
      'Term and Termination',
      'Dispute Resolution',
      'Compliance with Laws'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'California: Prohibits most non-competes; specific invention assignment rules',
        'New York: Salary threshold for exempt employees; pay frequency requirements',
        'Massachusetts: Garden leave requirements; specific NDA limitations',
        'Washington: Salary thresholds for non-competes; specific disclosure requirements',
        'Illinois: Advance notice for non-competes; specific consideration requirements'
      ],
      federalRegulatoryOverlay: [
        'NLRB: Restrictions on confidentiality/non-disparagement affecting Section 7 rights',
        'FTC: Proposed non-compete ban considerations',
        'DOL: Independent contractor classification tests',
        'EEOC: Release requirements and protected characteristics',
        'SEC: Whistleblower protection requirements'
      ],
      industrySpecificRequirements: [
        'Healthcare: State licensing, Medicare/Medicaid exclusions',
        'Financial Services: FINRA registration, U4/U5 considerations',
        'Technology: Export control, open source policies',
        'Government Contractors: Security clearances, compliance requirements'
      ]
    }
  },

  'SaaS Agreement': {
    contractType: 'SaaS Agreement',
    keyReviewPoints: [
      {
        category: 'Service Availability',
        description: 'Uptime guarantees and maintenance windows',
        mustHave: [
          '99.9% uptime SLA minimum',
          'Defined maintenance windows',
          'Service credit remedies',
          'Disaster recovery provisions'
        ],
        shouldAvoid: [
          'No uptime commitments',
          'Unlimited maintenance rights',
          'No compensation for downtime',
          'Vague availability promises'
        ]
      },
      {
        category: 'Data Rights & Portability',
        description: 'Customer data ownership and export',
        mustHave: [
          'Clear customer data ownership',
          'Data export capabilities',
          'Standard format exports',
          'Data deletion rights'
        ],
        shouldAvoid: [
          'Vendor data ownership claims',
          'No data portability',
          'Proprietary format lock-in',
          'No deletion guarantees'
        ]
      },
      {
        category: 'Security & Compliance',
        description: 'Security measures and regulatory compliance',
        mustHave: [
          'Industry-standard encryption',
          'Regular security audits',
          'Compliance certifications',
          'Incident response procedures'
        ],
        shouldAvoid: [
          'Weak security commitments',
          'No audit rights',
          'Compliance disclaimers',
          'Limited breach liability'
        ]
      },
      {
        category: 'Pricing & Limits',
        description: 'Cost structure and usage restrictions',
        mustHave: [
          'Transparent pricing model',
          'Clear usage limits',
          'Overage handling process',
          'Price protection period'
        ],
        shouldAvoid: [
          'Hidden fees',
          'Arbitrary usage limits',
          'Punitive overage charges',
          'Unlimited price increases'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'change.*pricing.*any time',
        severity: 'high',
        explanation: 'No budget predictability',
        affectedParty: 'Client'
      },
      {
        pattern: 'no backup.*disaster',
        severity: 'high',
        explanation: 'Risk of permanent data loss',
        affectedParty: 'Client'
      },
      {
        pattern: 'vendor.*owns.*data',
        severity: 'high',
        explanation: 'Loss of critical business data control',
        affectedParty: 'Client'
      },
      {
        pattern: 'terminate.*immediately.*convenience',
        severity: 'medium',
        explanation: 'Service can disappear without warning',
        affectedParty: 'Client'
      }
    ],
    partySpecificConcerns: {
      'Client': [
        'Data ownership and portability',
        'Service reliability and SLAs',
        'Cost predictability',
        'Vendor lock-in prevention'
      ],
      'Vendor': [
        'Acceptable use enforcement',
        'Payment collection',
        'Liability limitations',
        'IP protection'
      ]
    },
    criticalClauses: [
      'Service Level Agreement',
      'Data Ownership and Portability',
      'Security and Privacy',
      'Pricing and Payment',
      'Acceptable Use Policy',
      'Termination and Transition'
    ]
  },

  'NDA': {
    contractType: 'NDA',
    keyReviewPoints: [
      {
        category: 'Definition of Confidential Information',
        description: 'What information is protected',
        mustHave: [
          'Clear definition of confidential info',
          'Marking requirements if any',
          'Oral disclosure procedures',
          'Specific examples included'
        ],
        shouldAvoid: [
          'Overly broad definitions',
          'Public information included',
          'No written confirmation process',
          'Retroactive coverage'
        ]
      },
      {
        category: 'Permitted Use and Disclosure',
        description: 'How information can be used',
        mustHave: [
          'Limited to specific purpose',
          'Need-to-know basis sharing',
          'Required disclosure exceptions',
          'Return/destruction obligations'
        ],
        shouldAvoid: [
          'Unlimited use rights',
          'No purpose limitations',
          'Broad sharing permissions',
          'No return requirements'
        ]
      },
      {
        category: 'Duration and Termination',
        description: 'How long obligations last',
        mustHave: [
          'Reasonable time period',
          'Clear start and end dates',
          'Survival of obligations',
          'Termination procedures'
        ],
        shouldAvoid: [
          'Perpetual obligations',
          'Unclear start dates',
          'No termination rights',
          'Indefinite extensions'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'perpetual.*confidential',
        severity: 'high',
        explanation: 'Indefinite confidentiality obligations',
        affectedParty: 'Receiving Party'
      },
      {
        pattern: 'liquidated damages',
        severity: 'medium',
        explanation: 'Pre-set damages may be punitive',
        affectedParty: 'Receiving Party'
      },
      {
        pattern: 'one-way.*only',
        severity: 'medium',
        explanation: 'Unbalanced information exchange',
        affectedParty: 'Disclosing Party'
      }
    ],
    partySpecificConcerns: {
      'Disclosing Party': [
        'Adequate protection scope',
        'Enforcement mechanisms',
        'Return of information',
        'Remedies for breach'
      ],
      'Receiving Party': [
        'Reasonable obligations',
        'Clear boundaries',
        'Standard exceptions',
        'Limited liability'
      ]
    },
    criticalClauses: [
      'Definition of Confidential Information',
      'Obligations of Receiving Party',
      'Standard Exceptions',
      'Term and Termination',
      'Return of Information',
      'Remedies'
    ]
  },

  'Independent Contractor Agreement': {
    contractType: 'Independent Contractor Agreement',
    keyReviewPoints: [
      {
        category: 'Independent Contractor Status & Classification Compliance',
        description: 'Multi-factor analysis ensuring legitimate contractor relationship under IRS, DOL, and state law tests',
        mustHave: [
          'Behavioral control independence (methods, training, evaluation)',
          'Financial control indicators (investment, expenses, profit/loss opportunity)',
          'Relationship factors (project-based, no benefits, written agreement)',
          'State-specific ABC test compliance language',
          'Multiple concurrent client acknowledgment',
          'Right to delegate/subcontract with notice'
        ],
        shouldAvoid: [
          'Integration into client\'s business operations',
          'Mandatory attendance at meetings/training',
          'Performance evaluations beyond deliverable acceptance',
          'Restrictions on working hours/location',
          'Client approval for time off',
          'Non-compete during engagement'
        ]
      },
      {
        category: 'Payment Architecture & Economic Reality',
        description: 'Compensation structure supporting economic independence and business risk',
        mustHave: [
          'Fixed project fee or market-rate hourly compensation',
          'Detailed milestone/deliverable payment triggers',
          'Net payment terms (30/45/60 days)',
          'Interest on late payments (state maximum rate)',
          'Contractor invoice requirements',
          'Currency and payment method specifications',
          'Retainage/holdback limitations',
          'Dispute resolution before payment withholding'
        ],
        shouldAvoid: [
          'Regular salary-like payments',
          'Client control over contractor\'s rates to others',
          'Reimbursement for basic business expenses',
          'Payment tied to time rather than output',
          'Withholding beyond statutory requirements',
          'Penalties that resemble employee discipline'
        ]
      },
      {
        category: 'Intellectual Property & Work Product Architecture',
        description: 'Sophisticated IP framework balancing ownership transfer with contractor\'s business needs',
        mustHave: [
          'Specific definition of "Work Product"',
          'Present assignment language ("hereby assigns")',
          'Moral rights waiver where applicable',
          'Contractor\'s residual knowledge rights',
          'Pre-existing IP identification process',
          'Background IP license to client',
          'Feedback/improvements ownership',
          'Third-party IP representations matrix',
          'Open source disclosure requirements',
          'Patent cooperation obligations'
        ],
        shouldAvoid: [
          'Assignment of contractor\'s general knowledge',
          'Retroactive IP assignments',
          'Unlimited derivative works rights',
          'No carve-out for contractor\'s tools',
          'Missing joint IP protocols',
          'Perpetual confidentiality on general concepts'
        ]
      },
      {
        category: 'Risk Allocation & Insurance Matrix',
        description: 'Comprehensive liability framework with appropriate risk shifting',
        mustHave: [
          'Mutual negligence-based indemnification',
          'Liability caps tied to fees/insurance',
          'Professional liability insurance requirements',
          'General liability coverage minimums',
          'Cyber liability for data projects',
          'Notice and defense procedures',
          'Survival periods for indemnities',
          'Exclusions for consequential damages'
        ],
        shouldAvoid: [
          'Strict liability indemnification',
          'Indemnity for client\'s modifications',
          'Unlimited liability for any breach',
          'Personal liability of contractor',
          'Insufficient cure periods',
          'No mitigation obligations'
        ]
      },
      {
        category: 'Termination Rights & Transition Protocols',
        description: 'Balanced exit rights protecting both parties\' investments',
        mustHave: [
          'Termination for convenience with notice (30+ days)',
          'Immediate termination for material breach triggers',
          'Payment for work completed to termination',
          'Orderly transition assistance terms',
          'Return of materials procedures',
          'Post-termination license for client use',
          'Survival clause specifications'
        ],
        shouldAvoid: [
          'Termination without compensation for WIP',
          'Excessive free transition services',
          'Perpetual warranty obligations',
          'No dispute resolution before termination',
          'Automatic contract extensions',
          'Unclear post-term restrictions'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'exclusive.*services|full.*time.*availability|dedicated.*solely',
        severity: 'high',
        explanation: 'IRS/DOL will view as employment factor; destroys contractor\'s business independence',
        affectedParty: 'both'
      },
      {
        pattern: 'must.*follow.*company.*procedures|subject.*to.*policies|employee.*handbook',
        severity: 'high',
        explanation: 'Behavioral control is strongest indicator of employment under common law test',
        affectedParty: 'both'
      },
      {
        pattern: 'unlimited.*liability|fully.*liable|all.*damages.*whatsoever',
        severity: 'high',
        explanation: 'Catastrophic risk exposure inconsistent with limited project engagement',
        affectedParty: 'Contractor'
      },
      {
        pattern: 'all.*work.*product.*including.*pre-existing|any.*intellectual.*property.*developed',
        severity: 'high',
        explanation: 'Overreaching IP grab threatens contractor\'s entire business',
        affectedParty: 'Contractor'
      },
      {
        pattern: 'may.*not.*work.*for.*competitors|similar.*services.*prohibited',
        severity: 'high',
        explanation: 'Non-competes during term indicate employment; may be unenforceable',
        affectedParty: 'Contractor'
      },
      {
        pattern: 'automatic.*renewal|continues.*until.*terminated|evergreen',
        severity: 'medium',
        explanation: 'Creates indefinite relationship resembling employment',
        affectedParty: 'both'
      },
      {
        pattern: 'withhold.*payment.*for.*any.*reason|sole.*discretion.*payment',
        severity: 'medium',
        explanation: 'Payment control suggests employment; violates contractor independence',
        affectedParty: 'Contractor'
      },
      {
        pattern: 'training.*required|must.*attend.*meetings|performance.*reviews',
        severity: 'medium',
        explanation: 'Training and evaluation indicate behavioral control',
        affectedParty: 'both'
      }
    ],
    partySpecificConcerns: {
      'Contractor': [
        'Classification Risk: Personal liability for employment taxes if recharacterized',
        'Economic Independence: Ability to profit from efficiency and business decisions',
        'Client Diversification: Freedom to build sustainable business with multiple revenue streams',
        'IP Portfolio Protection: Retaining tools, methodologies, and pre-existing work',
        'Payment Security: Collection rights, mechanics liens, prompt payment remedies',
        'Professional Reputation: Right to reasonable references and portfolio use',
        'Exit Strategy: Orderly disengagement without stranded investments',
        'Liability Exposure: Proportional risk to project size and fee'
      ],
      'Client': [
        'Misclassification Liability: Back taxes, penalties, benefits, wage claims',
        'Work Product Ownership: Clear chain of title for all deliverables',
        'Confidentiality Protection: Trade secrets and competitive information',
        'Performance Accountability: Remedies for defective or late delivery',
        'Regulatory Compliance: Avoiding joint employer status',
        'Business Continuity: Knowledge transfer and documentation',
        'Third Party Claims: Protection from contractor\'s other engagements',
        'Budget Certainty: Fixed costs without employment overhead'
      ]
    },
    criticalClauses: [
      'Independent Contractor Relationship',
      'Scope of Services/Statement of Work',
      'Payment Terms',
      'Intellectual Property Assignment',
      'Confidentiality and Non-Disclosure',
      'Representations and Warranties',
      'Indemnification and Limitation of Liability',
      'Term and Termination',
      'Insurance Requirements',
      'Dispute Resolution',
      'Subcontracting Rights',
      'Compliance with Laws',
      'Notice and Communication',
      'Survival Provisions',
      'Entire Agreement/Amendment'
    ]
  },

  'Non-Compete Agreement': {
    contractType: 'Non-Compete Agreement',
    keyReviewPoints: [
      {
        category: 'Geographic Scope & Market Definition',
        description: 'Reasonable territorial limitations tied to legitimate business interests and actual operations',
        mustHave: [
          'Specific geographic boundaries',
          'Actual business operation areas',
          'Customer location considerations',
          'Territory expansion provisions',
          'Remote work accommodations',
          'Multi-state analysis included',
          'Legitimate interest connection',
          'Blue pencil provisions',
          'Choice of law analysis',
          'Venue selection rationale'
        ],
        shouldAvoid: [
          'Nationwide/global restrictions',
          'Areas without business presence',
          'Future territory speculation',
          'No geographic limits',
          'Vague region definitions',
          'No business justification',
          'Extraterritorial application',
          'No modification ability',
          'Conflicting law choices',
          'Industry-wide bans'
        ]
      },
      {
        category: 'Temporal Restrictions & Duration Analysis',
        description: 'Time limitations balancing protection needs with employee mobility rights',
        mustHave: [
          'Specific duration (6-24 months)',
          'Start date clarity',
          'Tolling provisions defined',
          'Garden leave options',
          'Paid restriction periods',
          'Buyout procedures',
          'Early release mechanisms',
          'Breach extension limits',
          'Survival clarity',
          'Modification procedures'
        ],
        shouldAvoid: [
          'Indefinite duration',
          'Excessive time periods',
          'Automatic renewals',
          'No compensation provided',
          'Retroactive extensions',
          'Unlimited tolling',
          'No release options',
          'Disguised permanent bans',
          'Rolling restrictions',
          'Vague commencement'
        ]
      },
      {
        category: 'Competitive Activity Definition & Scope',
        description: 'Precise delineation of prohibited activities tied to actual competition',
        mustHave: [
          'Specific competitor list/definition',
          'Role-based restrictions',
          'Direct competition focus',
          'Product/service specificity',
          'Customer segment clarity',
          'Ownership percentage limits',
          'Board service restrictions',
          'Consulting prohibitions',
          'Investment exceptions',
          'Passive investment carve-outs'
        ],
        shouldAvoid: [
          'Any employment prohibited',
          'Vague competition concepts',
          'Industry-wide restrictions',
          'Vendor/supplier bans',
          'Customer contact prohibited',
          'All investment banned',
          'Social contact restrictions',
          'Family member restrictions',
          'Future business speculation',
          'Preparation activities banned'
        ]
      },
      {
        category: 'Consideration & Compensation Framework',
        description: 'Adequate consideration supporting enforceability including continued compensation options',
        mustHave: [
          'Initial consideration specified',
          'Continued employment terms',
          'Garden leave pay provisions',
          'Severance enhancement',
          'Benefits continuation',
          'Equity vesting acceleration',
          'Pro-rated bonus payments',
          'Outplacement services',
          'Healthcare continuity',
          'Dispute resolution funding'
        ],
        shouldAvoid: [
          'Past consideration only',
          'Illusory promises',
          'At-will employment only',
          'No additional benefits',
          'Forfeiture provisions',
          'Clawback triggers',
          'Penalty structures',
          'Liquidated damages',
          'No salary continuation',
          'Retroactive application'
        ]
      },
      {
        category: 'Enforcement & Remedies Architecture',
        description: 'Balanced enforcement framework with appropriate remedies and defenses preserved',
        mustHave: [
          'Injunctive relief standards',
          'Actual damage requirements',
          'Burden of proof allocation',
          'Defenses preserved',
          'Reformation rights',
          'Arbitration procedures',
          'Fee shifting provisions',
          'Bond requirements',
          'Notice/cure periods',
          'Mitigation obligations'
        ],
        shouldAvoid: [
          'Automatic injunctions',
          'Liquidated damages',
          'Strict liability',
          'No defenses allowed',
          'Confession of judgment',
          'Criminal penalties',
          'Worldwide enforcement',
          'No modification possible',
          'Immediate relief',
          'No notice required'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'any.*capacity|all.*employment|entire.*industry',
        severity: 'high',
        explanation: 'Overbroad scope prevents any gainful employment; violates public policy',
        affectedParty: 'Employee/Contractor'
      },
      {
        pattern: 'worldwide|global|without.*geographic limit',
        severity: 'high',
        explanation: 'Unlimited geographic scope presumptively unreasonable and unenforceable',
        affectedParty: 'Employee/Contractor'
      },
      {
        pattern: 'perpetual|lifetime|permanent.*restriction',
        severity: 'high',
        explanation: 'Indefinite restrictions constitute unreasonable restraint on trade',
        affectedParty: 'Employee/Contractor'
      },
      {
        pattern: 'no compensation|at-will.*consideration|past.*employment only',
        severity: 'high',
        explanation: 'Inadequate consideration renders non-compete unenforceable in many states',
        affectedParty: 'Employee/Contractor'
      },
      {
        pattern: 'family members|spouse.*restricted|household.*prohibition',
        severity: 'high',
        explanation: 'Third-party restrictions violate public policy and individual rights',
        affectedParty: 'Employee/Contractor'
      },
      {
        pattern: 'liquidated damages|penalty.*per day|automatic.*forfeiture',
        severity: 'high',
        explanation: 'Penalty provisions unenforceable; must prove actual damages',
        affectedParty: 'Employee/Contractor'
      },
      {
        pattern: 'cannot.*prepare to compete|prohibition.*on planning|no.*discussion',
        severity: 'medium',
        explanation: 'Preparation to compete is legally protected activity',
        affectedParty: 'Employee/Contractor'
      },
      {
        pattern: 'sole discretion|Company.*determines|subjective.*judgment',
        severity: 'medium',
        explanation: 'Unilateral interpretation rights create uncertainty and overreach potential',
        affectedParty: 'Employee/Contractor'
      }
    ],
    partySpecificConcerns: {
      'Employee/Contractor': [
        'Career Mobility: Ability to pursue livelihood in chosen field',
        'Geographic Freedom: Reasonable ability to work where desired',
        'Income Security: Compensation during restriction period',
        'Industry Access: Not excluded from entire industry/profession',
        'Investment Rights: Ability to make passive investments',
        'Clear Boundaries: Understanding exactly what is prohibited',
        'State Law Protection: Application of most favorable law',
        'Modification Rights: Ability to negotiate release/modification',
        'Defense Preservation: Right to challenge overreaching',
        'Family Impact: No restrictions on family members'
      ],
      'Company': [
        'Customer Protection: Preventing unfair solicitation of clients',
        'Trade Secret Safety: Protecting confidential business methods',
        'Investment Return: Protecting training/development investments',
        'Competitive Position: Maintaining market advantages',
        'Team Stability: Preventing mass departures',
        'Enforcement Ability: Practical ability to obtain relief',
        'Multi-State Issues: Consistency across operations',
        'Acquisition Value: Protecting goodwill in M&A context',
        'Partner Relations: Maintaining strategic relationships',
        'Innovation Protection: Safeguarding R&D investments'
      ]
    },
    criticalClauses: [
      'Restricted Period Definition',
      'Geographic Territory',
      'Competitive Activity Definition',
      'Consideration/Garden Leave',
      'Non-Solicitation Provisions',
      'Confidentiality Integration',
      'Enforcement Procedures',
      'Choice of Law/Blue Pencil',
      'Tolling and Extension',
      'Release and Waiver Procedures'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'California: Prohibits most non-competes; specific invention assignment rules',
        'New York: Salary threshold for exempt employees; pay frequency requirements',
        'Massachusetts: Garden leave requirements; specific NDA limitations',
        'Washington: Salary thresholds for non-competes; specific disclosure requirements',
        'Illinois: Advance notice for non-competes; specific consideration requirements'
      ],
      federalRegulatoryOverlay: [
        'NLRB: Restrictions on confidentiality/non-disparagement affecting Section 7 rights',
        'FTC: Proposed non-compete ban considerations',
        'DOL: Independent contractor classification tests',
        'EEOC: Release requirements and protected characteristics',
        'SEC: Whistleblower protection requirements'
      ],
      industrySpecificRequirements: [
        'Healthcare: State licensing, Medicare/Medicaid exclusions',
        'Financial Services: FINRA registration, U4/U5 considerations',
        'Technology: Export control, open source policies',
        'Government Contractors: Security clearances, compliance requirements'
      ]
    }
  },

  'Severance Agreement': {
    contractType: 'Severance Agreement',
    keyReviewPoints: [
      {
        category: 'Release Scope & Claim Waiver Framework',
        description: 'Comprehensive release architecture with required exceptions and statutory compliance',
        mustHave: [
          'Known and unknown claims language',
          'Specific statutory claims listed',
          'ADEA compliance (21/45 days)',
          'OWBPA requirements met',
          '7-day revocation right',
          'Workers comp exceptions',
          'Unemployment benefits preserved',
          'Vested benefits excluded',
          'ERISA rights protected',
          'Whistleblower exceptions'
        ],
        shouldAvoid: [
          'Future claims releases',
          'Non-waivable rights included',
          'Criminal cooperation waiver',
          'Benefit plan participation waiver',
          'Prospective releases',
          'Government agency restrictions',
          'False Claims Act waiver',
          'Pension benefit waivers',
          'Healthcare continuation waiver',
          'Indemnity defense waivers'
        ]
      },
      {
        category: 'Severance Compensation & Benefits Package',
        description: 'Total separation compensation including salary continuation, benefits, and perquisites',
        mustHave: [
          'Base severance calculation',
          'Accrued PTO payout',
          'Pro-rated bonus formula',
          'Benefits continuation period',
          'COBRA premium coverage',
          'Outplacement services value',
          'Equity vesting acceleration',
          'Deferred comp treatment',
          'Tax gross-up provisions',
          'Payment timing schedule'
        ],
        shouldAvoid: [
          'Contingent payment terms',
          'Offset against earnings',
          'Forfeiture triggers broad',
          'Below-policy amounts',
          'No healthcare bridge',
          'Clawback provisions',
          'Retroactive reductions',
          'Discretionary adjustments',
          'Integration with UI',
          'Personal guarantee required'
        ]
      },
      {
        category: 'Post-Employment Restrictive Covenants',
        description: 'Continuing obligations regarding competition, solicitation, confidentiality, and cooperation',
        mustHave: [
          'Non-compete modifications',
          'Geographic/temporal limits',
          'Non-solicitation scope',
          'Confidentiality survival',
          'Non-disparagement terms',
          'Cooperation obligations',
          'Garden leave provisions',
          'Litigation cooperation',
          'Document return duties',
          'Reference statement agreed'
        ],
        shouldAvoid: [
          'New restrictions added',
          'Unlimited cooperation',
          'Personal expense bearing',
          'Perpetual obligations',
          'Criminal matter cooperation',
          'Media contact prohibited',
          'Social media censorship',
          'Industry participation bans',
          'Volunteer work restricted',
          'Academic freedom limited'
        ]
      },
      {
        category: 'Legal Compliance & Regulatory Requirements',
        description: 'Satisfaction of all statutory requirements for enforceable releases',
        mustHave: [
          'ADEA specific language',
          'State law requirements',
          'Consideration period notice',
          'Revocation rights clear',
          'Attorney consultation advised',
          'Group termination disclosures',
          'Protected activity rights',
          'Agency charge rights',
          'Cooperation exceptions',
          'Effective date mechanics'
        ],
        shouldAvoid: [
          'Shortened review periods',
          'Waiver of revocation',
          'No attorney advice mention',
          'Hidden effective dates',
          'Retroactive releases',
          'Agency cooperation bans',
          'Protected rights waived',
          'Mandatory arbitration added',
          'Class action waivers new',
          'Statute limitation changes'
        ]
      },
      {
        category: 'Transition Services & Practical Considerations',
        description: 'Logistical framework for smooth separation including property return and benefit transitions',
        mustHave: [
          'Company property return',
          'Personal property retrieval',
          'IT access termination',
          'Email/phone forwarding',
          'Business expense reimbursement',
          'Benefits conversion info',
          '401(k) rollover assistance',
          'Stock option exercise periods',
          'Reference protocols',
          'Departure messaging'
        ],
        shouldAvoid: [
          'Immediate access cutoff',
          'No transition period',
          'Personal device surrender',
          'No expense reimbursement',
          'Benefits immediate termination',
          'No rollover time',
          'Options immediate expiry',
          'No reference agreed',
          'Public disparagement',
          'No personal item return'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'release.*future claims|prospective.*waiver|claims.*arising after',
        severity: 'high',
        explanation: 'Cannot release claims that haven\'t occurred yet; violates public policy',
        affectedParty: 'Employee'
      },
      {
        pattern: 'no unemployment|waive.*benefits|forfeit.*if file',
        severity: 'high',
        explanation: 'Cannot waive unemployment insurance rights; violates state law',
        affectedParty: 'Employee'
      },
      {
        pattern: 'immediately effective|no revocation|waive.*consideration period',
        severity: 'high',
        explanation: 'Violates ADEA/OWBPA requirements; makes release unenforceable',
        affectedParty: 'Employer'
      },
      {
        pattern: 'unlimited cooperation|at employee expense|indefinite.*obligation',
        severity: 'high',
        explanation: 'Unreasonable ongoing burden without compensation',
        affectedParty: 'Employee'
      },
      {
        pattern: 'admit.*wrongdoing|confession.*liability|acknowledgment.*cause',
        severity: 'medium',
        explanation: 'Forced admissions problematic; may affect other rights',
        affectedParty: 'Employee'
      },
      {
        pattern: 'new.*restrictive covenant|additional.*non-compete|expanded.*restrictions',
        severity: 'high',
        explanation: 'New restrictions require separate consideration; likely unenforceable',
        affectedParty: 'Employee'
      },
      {
        pattern: 'forfeit.*vested benefits|lose.*pension rights|401k.*forfeiture',
        severity: 'high',
        explanation: 'Cannot forfeit vested ERISA benefits; violates federal law',
        affectedParty: 'Employee'
      },
      {
        pattern: 'no.*government agency|prohibited.*EEOC|cannot.*file charge',
        severity: 'high',
        explanation: 'Cannot waive right to file agency charges; violates public policy',
        affectedParty: 'Employee'
      }
    ],
    partySpecificConcerns: {
      'Employee': [
        'Financial Security: Adequate severance for transition period',
        'Benefits Bridge: Healthcare coverage until new employment',
        'Release Scope: Understanding exactly what\'s being waived',
        'Reference Protection: Agreed neutral reference statement',
        'Reputation Management: Non-disparagement protections',
        'Legal Compliance: Proper time for attorney review',
        'Future Employment: Reasonable restrictive covenants',
        'Benefit Preservation: Vested benefits protected',
        'Tax Optimization: Understanding tax implications',
        'Emotional Closure: Dignified departure process'
      ],
      'Employer': [
        'Litigation Prevention: Comprehensive enforceable release',
        'Trade Secret Protection: Confidentiality obligations reinforced',
        'Customer Retention: Non-solicitation compliance',
        'Team Stability: Preventing domino departures',
        'Regulatory Compliance: WARN Act, ADEA requirements',
        'Reputation Protection: Mutual non-disparagement',
        'Knowledge Transfer: Cooperation for transitions',
        'Document Recovery: Return of all company property',
        'Cost Control: Reasonable severance within budget',
        'Precedent Setting: Consistency with policies'
      ]
    },
    criticalClauses: [
      'Release of Claims',
      'Severance Benefits',
      'ADEA Compliance',
      'Restrictive Covenants',
      'Non-Disparagement',
      'Cooperation Obligations',
      'Benefits Continuation',
      'Reference Statement',
      'Confidentiality',
      'Governing Law and Dispute Resolution'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'California: Prohibits most non-competes; specific invention assignment rules',
        'New York: Salary threshold for exempt employees; pay frequency requirements',
        'Massachusetts: Garden leave requirements; specific NDA limitations',
        'Washington: Salary thresholds for non-competes; specific disclosure requirements',
        'Illinois: Advance notice for non-competes; specific consideration requirements'
      ],
      federalRegulatoryOverlay: [
        'NLRB: Restrictions on confidentiality/non-disparagement affecting Section 7 rights',
        'FTC: Proposed non-compete ban considerations',
        'DOL: Independent contractor classification tests',
        'EEOC: Release requirements and protected characteristics',
        'SEC: Whistleblower protection requirements'
      ],
      industrySpecificRequirements: [
        'Healthcare: State licensing, Medicare/Medicaid exclusions',
        'Financial Services: FINRA registration, U4/U5 considerations',
        'Technology: Export control, open source policies',
        'Government Contractors: Security clearances, compliance requirements'
      ]
    }
  },

  'Offer Letter': {
    contractType: 'Offer Letter',
    keyReviewPoints: [
      {
        category: 'Position Framework & Reporting Structure',
        description: 'Clear definition of role, responsibilities, reporting relationships, and performance expectations',
        mustHave: [
          'Specific job title',
          'Department/division placement',
          'Direct reporting relationship',
          'Primary responsibilities outline',
          'Work location designation',
          'Remote/hybrid arrangements',
          'Start date specified',
          'Full-time/part-time status',
          'Exempt/non-exempt classification',
          'Probationary period terms'
        ],
        shouldAvoid: [
          'Vague position descriptions',
          'Unlimited duty expansion',
          'No reporting structure',
          'Location change rights',
          'Forced relocation clauses',
          'No remote work clarity',
          'Ambiguous start dates',
          'Misclassification risks',
          'Perpetual probation',
          'Demotion allowances'
        ]
      },
      {
        category: 'Compensation Package Architecture',
        description: 'Comprehensive compensation structure including base, variable, equity, and benefits',
        mustHave: [
          'Base salary amount',
          'Payment frequency',
          'First paycheck date',
          'Bonus target/structure',
          'Commission plan reference',
          'Equity grant details',
          'Sign-on bonus terms',
          'Relocation assistance',
          'Benefits eligibility date',
          'PTO accrual rates'
        ],
        shouldAvoid: [
          'Below market rates',
          'Discretionary only bonus',
          'No bonus opportunity',
          'Vague equity promises',
          'Clawback provisions broad',
          'No benefits specified',
          'Delayed eligibility',
          'No PTO defined',
          'Hidden compensation cuts',
          'Currency risk shifting'
        ]
      },
      {
        category: 'Contingencies & Conditions Precedent',
        description: 'Pre-employment requirements and conditions that must be satisfied',
        mustHave: [
          'Background check scope',
          'Reference verification',
          'Drug testing requirements',
          'I-9 documentation',
          'Degree verification',
          'License confirmations',
          'Non-compete review',
          'Conflict of interest disclosure',
          'Physical exam requirements',
          'Security clearance needs'
        ],
        shouldAvoid: [
          'Unlimited investigations',
          'Credit checks unnecessary',
          'Personal life intrusions',
          'Social media surrender',
          'Polygraph testing',
          'Personality testing excessive',
          'Financial disclosure broad',
          'Family background checks',
          'Political affiliation inquiry',
          'Retroactive disqualification'
        ]
      },
      {
        category: 'At-Will Employment & Job Security',
        description: 'Employment relationship nature and any modifications to at-will status',
        mustHave: [
          'At-will statement clear',
          'Either party termination',
          'Notice period expectations',
          'No guaranteed duration',
          'Policy integration limits',
          'Handbook acknowledgment',
          'Severance policy reference',
          'Good reason triggers',
          'Cause definition preview',
          'State law compliance'
        ],
        shouldAvoid: [
          'Implied contracts',
          'Duration guarantees',
          'Termination restrictions',
          'No severance mention',
          'Cause termination only',
          'Notice waiver by company',
          'Probation guarantees',
          'Performance promises',
          'Promotion commitments',
          'Tenure implications'
        ]
      },
      {
        category: 'Integration with Other Documents',
        description: 'Relationship between offer letter and other employment documents',
        mustHave: [
          'Separate agreement references',
          'NDA requirement noted',
          'Non-compete disclosure',
          'Invention assignment mention',
          'Arbitration agreement note',
          'Employee handbook subject',
          'Code of conduct applicable',
          'Policy manual reference',
          'Benefits plan documents',
          'Equity plan incorporation'
        ],
        shouldAvoid: [
          'Conflicting terms',
          'Document hierarchy unclear',
          'Surprise agreements',
          'Retroactive applications',
          'Unilateral modifications',
          'No document access',
          'Hidden terms',
          'Post-hire surprises',
          'Deemed acceptances',
          'Oral modification bans'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'subject to.*policies|may change.*any time|Company discretion',
        severity: 'medium',
        explanation: 'Undermines offer certainty; allows unilateral changes to key terms',
        affectedParty: 'Candidate'
      },
      {
        pattern: 'contingent upon.*satisfactory|subjective.*determination|sole judgment',
        severity: 'high',
        explanation: 'Vague contingencies create uncertainty; offer may be illusory',
        affectedParty: 'Candidate'
      },
      {
        pattern: 'must sign.*all documents|required.*agreements|condition.*employment',
        severity: 'medium',
        explanation: 'Blank check for additional requirements; surprises after acceptance',
        affectedParty: 'Candidate'
      },
      {
        pattern: 'no severance|termination.*no benefits|forfeit.*upon leaving',
        severity: 'medium',
        explanation: 'No downside protection; unusual for professional positions',
        affectedParty: 'Candidate'
      },
      {
        pattern: 'below minimum|training wage|probationary rate',
        severity: 'high',
        explanation: 'May violate wage laws; suggests exploitation',
        affectedParty: 'Candidate'
      },
      {
        pattern: 'unlimited duties|other.*assigned tasks|responsibilities.*may expand',
        severity: 'medium',
        explanation: 'Role creep without compensation adjustment; burnout risk',
        affectedParty: 'Candidate'
      },
      {
        pattern: 'relocation required|transfer.*Company option|location.*may change',
        severity: 'high',
        explanation: 'Forced relocation rights create family disruption',
        affectedParty: 'Candidate'
      },
      {
        pattern: 'offer expires.*24 hours|must decide.*immediately|exploding offer',
        severity: 'medium',
        explanation: 'Pressure tactics prevent thoughtful consideration',
        affectedParty: 'Candidate'
      }
    ],
    partySpecificConcerns: {
      'Candidate': [
        'Compensation Clarity: Understanding total compensation package',
        'Role Definition: Clear understanding of position and expectations',
        'Benefits Timing: When coverage begins and what\'s included',
        'Job Security: Understanding at-will nature and protections',
        'Growth Potential: Career development opportunities',
        'Work-Life Balance: Hours, location, flexibility expectations',
        'Hidden Requirements: Additional agreements or restrictions',
        'Start Date Flexibility: Adequate transition time',
        'Contingency Risks: What could derail the offer',
        'Document Review: Time to review related agreements'
      ],
      'Company': [
        'Candidate Commitment: Ensuring acceptance and start date',
        'Competitive Intelligence: Protecting against shopping offer',
        'Background Verification: Confirming qualifications',
        'Legal Compliance: Meeting offer letter requirements',
        'Budget Management: Staying within compensation bands',
        'Team Integration: Smooth onboarding process',
        'IP Protection: Securing assignments early',
        'Culture Fit: Alignment with values/policies',
        'Retention Risk: Competitive package to retain',
        'Documentation: Clear terms preventing disputes'
      ]
    },
    criticalClauses: [
      'Position and Duties',
      'Start Date and Location',
      'Compensation Terms',
      'Benefits Summary',
      'At-Will Employment Statement',
      'Contingencies/Conditions',
      'Additional Agreements Required',
      'Offer Expiration Date',
      'Integration Clause',
      'Acceptance Mechanism'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'California: Prohibits most non-competes; specific invention assignment rules',
        'New York: Salary threshold for exempt employees; pay frequency requirements',
        'Massachusetts: Garden leave requirements; specific NDA limitations',
        'Washington: Salary thresholds for non-competes; specific disclosure requirements',
        'Illinois: Advance notice for non-competes; specific consideration requirements'
      ],
      federalRegulatoryOverlay: [
        'NLRB: Restrictions on confidentiality/non-disparagement affecting Section 7 rights',
        'FTC: Proposed non-compete ban considerations',
        'DOL: Independent contractor classification tests',
        'EEOC: Release requirements and protected characteristics',
        'SEC: Whistleblower protection requirements'
      ],
      industrySpecificRequirements: [
        'Healthcare: State licensing, Medicare/Medicaid exclusions',
        'Financial Services: FINRA registration, U4/U5 considerations',
        'Technology: Export control, open source policies',
        'Government Contractors: Security clearances, compliance requirements'
      ]
    }
  },

  'Software as a Service (SaaS) Agreement': {
    contractType: 'Software as a Service (SaaS) Agreement',
    keyReviewPoints: [
      {
        category: 'Service Levels & Performance Standards',
        description: 'Comprehensive framework for service availability, performance metrics, and remedies for failures',
        mustHave: [
          'Uptime commitment percentage (99.9% typical)',
          'Availability measurement methodology',
          'Planned maintenance windows',
          'Service credit calculations',
          'Performance metrics defined',
          'Response time guarantees',
          'Escalation procedures',
          'Real-time monitoring access',
          'Service degradation definitions',
          'Disaster recovery RTO/RPO'
        ],
        shouldAvoid: [
          'No SLA commitments',
          'Sole remedy limitations',
          'Excessive maintenance windows',
          'No performance metrics',
          'Provider sole measurement',
          'No credit automation',
          'Force majeure too broad',
          'No root cause analysis',
          'Availability below 99%',
          'No DR commitments'
        ]
      },
      {
        category: 'Data Security & Privacy Architecture',
        description: 'Multi-layered security framework addressing data protection, privacy compliance, and breach protocols',
        mustHave: [
          'Encryption at rest/transit standards',
          'SOC 2 Type II certification',
          'Access control specifications',
          'Security audit rights',
          'Breach notification timeline',
          'Data segregation protocols',
          'Backup frequency/retention',
          'GDPR/CCPA compliance',
          'Vulnerability management',
          'Incident response procedures'
        ],
        shouldAvoid: [
          'No security standards',
          'Disclaimer of breaches',
          'No audit rights',
          'Delayed breach notice',
          'Data commingling',
          'No backup guarantees',
          'Privacy law exemptions',
          'No penetration testing',
          'Security at sole discretion',
          'No cyber insurance'
        ]
      },
      {
        category: 'Data Ownership & Portability Framework',
        description: 'Clear delineation of data rights, export capabilities, and post-termination access',
        mustHave: [
          'Customer data ownership',
          'Export functionality specs',
          'API access for extraction',
          'Standard format exports',
          'Bulk download capabilities',
          'Metadata preservation',
          'Real-time replication options',
          'Post-term retrieval period',
          'Data deletion certification',
          'No vendor lock-in'
        ],
        shouldAvoid: [
          'Provider data claims',
          'No export capabilities',
          'Proprietary formats only',
          'Export fees excessive',
          'No API access',
          'Data hostage scenarios',
          'Immediate deletion',
          'No transition assistance',
          'Derived data claims',
          'Usage restrictions'
        ]
      },
      {
        category: 'Subscription Terms & Payment Structure',
        description: 'Flexible subscription model with transparent pricing and modification procedures',
        mustHave: [
          'Subscription tiers defined',
          'User/usage metrics clear',
          'Overage handling process',
          'Price protection period',
          'Renewal notice requirements',
          'Downgrade/upgrade rights',
          'Pro-ration methodology',
          'Payment terms specified',
          'Auto-renewal controls',
          'Cancellation procedures'
        ],
        shouldAvoid: [
          'Automatic price increases',
          'No downgrade options',
          'Penalty for reduction',
          'Hidden usage fees',
          'No price transparency',
          'Locked-in commitments',
          'No refund provisions',
          'Immediate termination',
          'No usage visibility',
          'Retroactive pricing'
        ]
      },
      {
        category: 'Integration & Customization Framework',
        description: 'Technical integration capabilities, API access, and customization boundaries',
        mustHave: [
          'API documentation access',
          'Integration support levels',
          'Sandbox environment',
          'Rate limiting policies',
          'Webhook capabilities',
          'SSO/SAML support',
          'Custom field allowances',
          'White-labeling options',
          'Third-party integrations',
          'Version control notices'
        ],
        shouldAvoid: [
          'No API access',
          'Integration fees hidden',
          'No test environment',
          'Arbitrary rate limits',
          'No customization allowed',
          'Forced branding',
          'No third-party connects',
          'Breaking changes anytime',
          'No backwards compatibility',
          'Integration IP claims'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'no warranties|as is|all risk assumed|no guarantees',
        severity: 'high',
        explanation: 'Complete disclaimer inappropriate for paid enterprise service',
        affectedParty: 'Customer'
      },
      {
        pattern: 'provider owns|license to customer data|derivative works from data',
        severity: 'high',
        explanation: 'Provider claiming ownership over customer data violates data sovereignty',
        affectedParty: 'Customer'
      },
      {
        pattern: 'may change prices|immediate effect|no notice required',
        severity: 'high',
        explanation: 'Unilateral price changes without protection disrupts budgeting',
        affectedParty: 'Customer'
      },
      {
        pattern: 'no export|data deletion upon termination|no retrieval period',
        severity: 'high',
        explanation: 'Data hostage scenario prevents vendor mobility',
        affectedParty: 'Customer'
      },
      {
        pattern: 'unlimited liability|consequential damages included|no damage caps',
        severity: 'high',
        explanation: 'Disproportionate risk for subscription service',
        affectedParty: 'Provider'
      },
      {
        pattern: 'suspend immediately|sole discretion|no notice|no appeal',
        severity: 'high',
        explanation: 'Arbitrary suspension rights threaten business continuity',
        affectedParty: 'Customer'
      },
      {
        pattern: 'monitor usage|access customer data|use for improvements',
        severity: 'medium',
        explanation: 'Broad data usage rights raise privacy/confidentiality concerns',
        affectedParty: 'Customer'
      },
      {
        pattern: 'exclusive venue|provider state only|mandatory arbitration',
        severity: 'medium',
        explanation: 'One-sided dispute resolution favoring provider',
        affectedParty: 'Customer'
      }
    ],
    partySpecificConcerns: {
      'Customer': [
        'Service Reliability: Consistent availability meeting business requirements',
        'Data Sovereignty: Maintaining ownership and control of business data',
        'Vendor Lock-in: Ability to migrate to alternatives without data loss',
        'Cost Predictability: Transparent pricing without surprise charges',
        'Security Assurance: Enterprise-grade protection for sensitive data',
        'Compliance Support: Meeting regulatory requirements (GDPR, HIPAA, etc.)',
        'Performance Scalability: Service grows with business needs',
        'Integration Flexibility: Works with existing technology stack',
        'Support Quality: Responsive technical assistance when needed',
        'Exit Strategy: Clean data extraction and transition support'
      ],
      'Provider': [
        'Revenue Predictability: Stable subscription base with growth potential',
        'Scope Management: Preventing feature creep without compensation',
        'Infrastructure Costs: Balancing service levels with profitability',
        'Liability Limitation: Proportional risk to subscription fees',
        'IP Protection: Safeguarding proprietary technology',
        'Customer Success: Ensuring adoption and renewal rates',
        'Competitive Position: Differentiation while maintaining margins',
        'Compliance Burden: Managing multi-jurisdictional requirements',
        'Bad Actor Prevention: Protecting platform from abuse',
        'Scalability Management: Controlled growth within capacity'
      ]
    },
    criticalClauses: [
      'Service Description and Scope (with feature specifications)',
      'Service Level Agreement (with uptime commitments)',
      'Data Security and Privacy (with compliance obligations)',
      'Data Ownership and Portability (with export rights)',
      'Subscription Terms and Fees (with modification procedures)',
      'Acceptable Use Policy (with enforcement procedures)',
      'Intellectual Property Rights (with customer data exclusions)',
      'Limitation of Liability (with appropriate carve-outs)',
      'Term and Termination (with data retrieval periods)',
      'Support and Maintenance (with response times)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  },

  'Software Licensing Agreement': {
    contractType: 'Software Licensing Agreement',
    keyReviewPoints: [
      {
        category: 'License Grant Scope & Restrictions',
        description: 'Precise definition of license rights including permitted uses, users, and deployment parameters',
        mustHave: [
          'License type (perpetual/term)',
          'Named users vs concurrent',
          'Installation parameters',
          'Geographic territories',
          'Entity/affiliate rights',
          'Development/test/production use',
          'Backup/disaster recovery rights',
          'Virtualization permissions',
          'License transferability',
          'Source code escrow triggers'
        ],
        shouldAvoid: [
          'Ambiguous scope language',
          'No affiliate coverage',
          'Single machine restrictions',
          'No backup rights',
          'Retroactive restrictions',
          'No virtualization allowed',
          'Personal use only',
          'No transferability',
          'Audit without notice',
          'Automatic termination'
        ]
      },
      {
        category: 'Maintenance & Support Framework',
        description: 'Comprehensive support structure including updates, patches, and technical assistance',
        mustHave: [
          'Support tier definitions',
          'Response time matrices',
          'Update/upgrade rights',
          'Bug fix commitments',
          'Version support duration',
          'EOL notice periods',
          'Migration assistance',
          'Documentation access',
          'Training allocations',
          'Escalation procedures'
        ],
        shouldAvoid: [
          'Support not included',
          'Discretionary updates',
          'No bug fix timeline',
          'Short version support',
          'No EOL notice',
          'Forced upgrades',
          'Additional fees hidden',
          'No documentation',
          'No escalation path',
          'Support disclaimers'
        ]
      },
      {
        category: 'Intellectual Property & Compliance Architecture',
        description: 'Framework protecting both parties IP rights while ensuring compliance monitoring',
        mustHave: [
          'IP ownership clarity',
          'License compliance tools',
          'Audit procedures/limits',
          'Indemnification scope',
          'Third-party components',
          'Open source disclosures',
          'Feedback ownership',
          'Derivative works rights',
          'Trademark usage rights',
          'Confidentiality terms'
        ],
        shouldAvoid: [
          'Unlimited audit rights',
          'No notice for audits',
          'Customer improvements owned',
          'No indemnification',
          'Hidden third-party terms',
          'Viral license exposure',
          'No trademark usage',
          'Broad derivate claims',
          'Perpetual confidentiality',
          'Reverse engineering bans'
        ]
      },
      {
        category: 'Payment Terms & True-Up Procedures',
        description: 'Transparent pricing model with clear true-up mechanisms for usage variations',
        mustHave: [
          'License fee structure',
          'Maintenance fee schedule',
          'True-up procedures',
          'Volume discount tiers',
          'Payment terms',
          'Renewal pricing',
          'Currency specifications',
          'Tax responsibilities',
          'Invoice requirements',
          'Dispute procedures'
        ],
        shouldAvoid: [
          'Hidden fee structures',
          'Retroactive true-ups',
          'No volume benefits',
          'Automatic increases',
          'Penalty interest rates',
          'No payment terms',
          'Currency risk shifts',
          'Gross-up requirements',
          'No dispute process',
          'Immediate suspension'
        ]
      },
      {
        category: 'Warranty & Remediation Framework',
        description: 'Performance warranties with clear remediation procedures for defects',
        mustHave: [
          'Functionality warranties',
          'Conformance to specs',
          'Malware-free warranty',
          'Non-infringement warranty',
          'Warranty period duration',
          'Remediation procedures',
          'Workaround obligations',
          'Replacement rights',
          'Refund conditions',
          'Third-party warranties'
        ],
        shouldAvoid: [
          'Complete disclaimers',
          'As-is licensing',
          'No malware warranty',
          'No IP warranties',
          'Short warranty periods',
          'No remediation duties',
          'Sole discretion fixes',
          'No refund options',
          'Warranty exceptions broad',
          'No third-party coverage'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'revocable license|may terminate any time|at licensor discretion',
        severity: 'high',
        explanation: 'Unstable license rights undermine business investment and operations',
        affectedParty: 'Licensee'
      },
      {
        pattern: 'no warranties|as is|with all faults|no fitness',
        severity: 'high',
        explanation: 'Complete warranty disclaimer inappropriate for commercial software',
        affectedParty: 'Licensee'
      },
      {
        pattern: 'unlimited audits|immediate access|at licensee cost',
        severity: 'high',
        explanation: 'Disruptive audit rights create operational burden and costs',
        affectedParty: 'Licensee'
      },
      {
        pattern: 'all feedback owned|improvements assigned|derivatives included',
        severity: 'high',
        explanation: 'Overreaching IP grab discourages collaborative improvement',
        affectedParty: 'Licensee'
      },
      {
        pattern: 'retroactive true-up|past usage fees|penalty calculations',
        severity: 'high',
        explanation: 'Retroactive fees create unpredictable financial exposure',
        affectedParty: 'Licensee'
      },
      {
        pattern: 'no source code escrow|no continuity plan|abandonment undefined',
        severity: 'medium',
        explanation: 'No protection against vendor failure or discontinuation',
        affectedParty: 'Licensee'
      },
      {
        pattern: 'forced upgrades|version retirement discretionary|no migration support',
        severity: 'medium',
        explanation: 'Forced obsolescence without transition support',
        affectedParty: 'Licensee'
      },
      {
        pattern: 'personal guarantees|individual liability|pierce corporate veil',
        severity: 'high',
        explanation: 'Inappropriate personal exposure for corporate license',
        affectedParty: 'Licensee'
      }
    ],
    partySpecificConcerns: {
      'Licensee': [
        'License Stability: Perpetual or long-term rights ensuring ROI',
        'Deployment Flexibility: Ability to scale and reconfigure as needed',
        'Support Continuity: Long-term maintenance and update access',
        'Compliance Burden: Reasonable audit and tracking requirements',
        'Cost Predictability: Transparent fees without surprises',
        'Business Continuity: Source code escrow or alternatives',
        'Integration Rights: Ability to connect with other systems',
        'IP Protection: No claims on customer configurations/data',
        'Vendor Lock-in: Migration paths and data portability',
        'Performance Assurance: Warranties and remediation procedures'
      ],
      'Licensor': [
        'Revenue Protection: Preventing unauthorized use and piracy',
        'IP Safeguarding: Protecting proprietary code and methods',
        'Compliance Monitoring: Ability to verify licensed usage',
        'Liability Management: Proportional risk to license fees',
        'Version Control: Managing support across multiple versions',
        'Competitive Protection: Preventing reverse engineering',
        'Distribution Control: Managing channel conflicts',
        'Quality Reputation: Ensuring proper implementation',
        'Support Efficiency: Reasonable support obligations',
        'Market Positioning: Protecting pricing and positioning'
      ]
    },
    criticalClauses: [
      'License Grant (with specific parameters and restrictions)',
      'License Fees and Payment Terms (with true-up procedures)',
      'Maintenance and Support (with service levels)',
      'Intellectual Property Rights (with feedback provisions)',
      'Warranties and Disclaimers (with remediation procedures)',
      'Indemnification (mutual with IP focus)',
      'Confidentiality (with appropriate exceptions)',
      'Audit Rights (with reasonable limitations)',
      'Term and Termination (with post-term usage)',
      'Source Code Escrow (with release conditions)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  },

  'End User License Agreement (EULA)': {
    contractType: 'End User License Agreement (EULA)',
    keyReviewPoints: [
      {
        category: 'License Grant & Usage Restrictions',
        description: 'Consumer-friendly license terms balancing protection with usability',
        mustHave: [
          'Personal/commercial use distinction',
          'Number of devices allowed',
          'Family sharing provisions',
          'Backup copy rights',
          'Transfer conditions',
          'Geographic restrictions',
          'Offline usage rights',
          'Modification permissions',
          'Educational use allowances',
          'Accessibility features'
        ],
        shouldAvoid: [
          'Single device only',
          'No backup allowed',
          'Internet required always',
          'No family sharing',
          'Surveillance features',
          'Retroactive changes',
          'Use monitoring excessive',
          'No disability access',
          'Transfer prohibited',
          'Perpetual online checks'
        ]
      },
      {
        category: 'Privacy & Data Collection Framework',
        description: 'Transparent data practices complying with consumer protection laws',
        mustHave: [
          'Data types collected',
          'Collection purposes',
          'Opt-out mechanisms',
          'Local storage only options',
          'Deletion procedures',
          'No sale of data',
          'Child protection (COPPA)',
          'GDPR/CCPA compliance',
          'Data minimization',
          'Consent requirements'
        ],
        shouldAvoid: [
          'Unlimited collection',
          'No opt-out available',
          'Behavioral tracking hidden',
          'Third-party sharing broad',
          'No deletion rights',
          'Consent buried',
          'Children data collected',
          'Cross-device tracking',
          'Biometric collection',
          'Location always on'
        ]
      },
      {
        category: 'Auto-Update & Modification Rights',
        description: 'Balanced approach to software updates protecting both stability and security',
        mustHave: [
          'Update notification options',
          'Opt-out capabilities',
          'Security-only updates',
          'Rollback procedures',
          'Feature preservation',
          'Compatibility commitments',
          'Download scheduling',
          'Bandwidth controls',
          'Change logs provided',
          'Version archives'
        ],
        shouldAvoid: [
          'Forced updates',
          'Feature removal anytime',
          'No rollback options',
          'Breaking changes',
          'No notifications',
          'Functionality reduction',
          'Paid features removed',
          'No version control',
          'Update during use',
          'No offline operation'
        ]
      },
      {
        category: 'Warranty Disclaimers & Consumer Rights',
        description: 'Legally compliant disclaimers preserving statutory consumer protections',
        mustHave: [
          'Statutory rights preserved',
          'Basic fitness warranty',
          'Non-waivable rights noted',
          'Refund policies clear',
          'Support channels specified',
          'Bug reporting procedures',
          'Security commitments',
          'False advertising remedies',
          'Dispute resolution options',
          'Class action availability'
        ],
        shouldAvoid: [
          'All warranties disclaimed',
          'Statutory rights waived',
          'No refunds ever',
          'No support provided',
          'Security disclaimed',
          'Fitness waived completely',
          'Hidden arbitration',
          'Class action waivers',
          'No remedy available',
          'As-is for consumers'
        ]
      },
      {
        category: 'Termination & Post-Term Rights',
        description: 'Fair termination procedures preserving user investments and data',
        mustHave: [
          'Termination procedures',
          'Data export rights',
          'Refund calculations',
          'Notice requirements',
          'Cure opportunities',
          'Post-term access period',
          'License survival portions',
          'Purchased content access',
          'Achievement preservation',
          'Account reactivation'
        ],
        shouldAvoid: [
          'Arbitrary termination',
          'No notice required',
          'Immediate cutoff',
          'Data deletion instant',
          'No appeals process',
          'Purchased items lost',
          'No export capability',
          'Account ban permanent',
          'IP address blocks',
          'Device blacklisting'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'monitor all activity|record keystrokes|screen capture|always listening',
        severity: 'high',
        explanation: 'Invasive surveillance features raise serious privacy concerns',
        affectedParty: 'End User'
      },
      {
        pattern: 'sell user data|share with partners|marketing purposes|behavioral advertising',
        severity: 'high',
        explanation: 'Commercial exploitation of user data without clear consent',
        affectedParty: 'End User'
      },
      {
        pattern: 'modify terms anytime|without notice|continued use accepts|retroactive changes',
        severity: 'high',
        explanation: 'Unilateral modification rights undermine consumer protection',
        affectedParty: 'End User'
      },
      {
        pattern: 'no refunds|all sales final|no trial period|no cancellation',
        severity: 'medium',
        explanation: 'May violate consumer protection laws requiring refund rights',
        affectedParty: 'End User'
      },
      {
        pattern: 'disable features|remove functionality|reduce service|end support',
        severity: 'medium',
        explanation: 'Bait-and-switch tactics removing paid features',
        affectedParty: 'End User'
      },
      {
        pattern: 'root detection|jailbreak prohibition|modification voids|warranty voided',
        severity: 'medium',
        explanation: 'Overreaching control of user devices and ownership rights',
        affectedParty: 'End User'
      },
      {
        pattern: 'class action waiver|mandatory arbitration|no jury trial|individual only',
        severity: 'high',
        explanation: 'Forced arbitration may be unconscionable for consumers',
        affectedParty: 'End User'
      },
      {
        pattern: 'perpetual license to content|user submissions owned|derivative rights unlimited',
        severity: 'high',
        explanation: 'Overreaching content rights grab from users',
        affectedParty: 'End User'
      }
    ],
    partySpecificConcerns: {
      'End User': [
        'Privacy Protection: Control over personal data collection and use',
        'Feature Stability: Purchased features remain available',
        'Fair Pricing: No hidden fees or surprise charges',
        'Device Control: Ownership rights over purchased devices',
        'Data Portability: Ability to export and migrate data',
        'Family Sharing: Reasonable household use allowances',
        'Offline Usage: Functionality without internet connection',
        'Refund Rights: Money-back guarantees for defects',
        'Account Security: Protection against arbitrary termination',
        'Legal Rights: Preservation of consumer protections'
      ],
      'Licensor': [
        'Piracy Prevention: Protecting against unauthorized distribution',
        'Revenue Protection: Ensuring proper licensing compliance',
        'Liability Limitation: Proportional risk for consumer software',
        'Brand Protection: Preventing misuse or modification',
        'Support Costs: Managing consumer support efficiently',
        'Update Distribution: Efficient patch deployment',
        'Market Segmentation: Maintaining price discrimination',
        'Feature Control: Managing feature sets across versions',
        'Compliance Burden: Meeting global consumer laws',
        'Competitive Position: Preventing reverse engineering'
      ]
    },
    criticalClauses: [
      'License Grant (with clear usage rights)',
      'Privacy and Data Collection (with opt-out procedures)',
      'Automatic Updates (with user control options)',
      'Intellectual Property (with user content provisions)',
      'Warranties and Disclaimers (preserving statutory rights)',
      'Limitation of Liability (with consumer law compliance)',
      'Termination (with data preservation rights)',
      'Dispute Resolution (with class action considerations)',
      'Governing Law (considering consumer forum)',
      'Modification Procedures (with proper notice)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  },

  'Terms of Service': {
    contractType: 'Terms of Service',
    keyReviewPoints: [
      {
        category: 'Account Creation & Identity Verification',
        description: 'User registration requirements balancing security with privacy',
        mustHave: [
          'Age requirements (13+ COPPA)',
          'Accurate information duty',
          'Account security responsibilities',
          'Password requirements',
          'Multi-factor options',
          'Identity verification levels',
          'Username restrictions',
          'Account recovery procedures',
          'Parental consent mechanisms',
          'Business account options'
        ],
        shouldAvoid: [
          'Excessive personal data',
          'Government ID required',
          'No pseudonymous use',
          'Third-party verification only',
          'No account deletion',
          'Perpetual data retention',
          'No security options',
          'Invasive verification',
          'No business accounts',
          'Age discrimination'
        ]
      },
      {
        category: 'Content Rights & User Submissions',
        description: 'Balanced framework for user-generated content protecting both parties',
        mustHave: [
          'User content ownership',
          'License grant scope',
          'Moral rights handling',
          'Content moderation rights',
          'DMCA procedures',
          'Fair use protections',
          'Backup/archive rights',
          'Attribution requirements',
          'Content export rights',
          'Termination effects'
        ],
        shouldAvoid: [
          'Content ownership transfer',
          'Unlimited license rights',
          'No attribution required',
          'Perpetual rights',
          'Derivative works unlimited',
          'No export capability',
          'Retroactive rights',
          'Moral rights waived',
          'No fair use',
          'Content hostage'
        ]
      },
      {
        category: 'Prohibited Conduct & Enforcement',
        description: 'Clear behavioral standards with proportionate enforcement mechanisms',
        mustHave: [
          'Specific prohibitions listed',
          'Harm prevention focus',
          'Graduated sanctions',
          'Appeal procedures',
          'Notice before action',
          'Account restoration paths',
          'Content preservation',
          'False positive procedures',
          'Context consideration',
          'Human review options'
        ],
        shouldAvoid: [
          'Vague conduct rules',
          'Automated bans only',
          'No appeals allowed',
          'Permanent bans default',
          'Guilt by association',
          'No context considered',
          'Content deleted immediately',
          'IP address bans',
          'Device fingerprinting',
          'Shadow banning'
        ]
      },
      {
        category: 'Service Modifications & Availability',
        description: 'Reasonable change management preserving user investments',
        mustHave: [
          'Change notification periods',
          'Material change definitions',
          'Grandfathering provisions',
          'Feature deprecation notice',
          'API stability commitments',
          'Data export windows',
          'Refund procedures',
          'Service level targets',
          'Maintenance windows',
          'Geographic availability'
        ],
        shouldAvoid: [
          'Changes without notice',
          'Retroactive modifications',
          'No grandfathering',
          'Features removed anytime',
          'No stability commitments',
          'No export before changes',
          'Service withdrawal instant',
          'No refunds ever',
          'Unlimited downtime',
          'Geographic discrimination'
        ]
      },
      {
        category: 'Liability & Indemnification Structure',
        description: 'Fair risk allocation appropriate for service type and user base',
        mustHave: [
          'Liability caps reasonable',
          'Gross negligence exceptions',
          'Consumer law preservation',
          'Indemnity proportionate',
          'Insurance requirements',
          'Safe harbors (DMCA, CDA)',
          'Force majeure defined',
          'Mitigation duties',
          'Third-party services',
          'Warranty disclaimers legal'
        ],
        shouldAvoid: [
          'Zero liability provider',
          'User unlimited liability',
          'Indemnity for provider acts',
          'No insurance required',
          'Safe harbor waivers',
          'Force majeure too broad',
          'No mitigation required',
          'Consequential damages user',
          'Personal liability',
          'Fee disproportionate risk'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'modify terms any time|without notice|sole discretion|immediately effective',
        severity: 'high',
        explanation: 'Unilateral modification without notice violates contract principles',
        affectedParty: 'User'
      },
      {
        pattern: 'own all content|perpetual license|unlimited use|no compensation',
        severity: 'high',
        explanation: 'Content rights grab exceeds platform operation needs',
        affectedParty: 'User'
      },
      {
        pattern: 'terminate any reason|no appeal|permanent ban|device blocking',
        severity: 'high',
        explanation: 'Arbitrary termination without due process or proportionality',
        affectedParty: 'User'
      },
      {
        pattern: 'monitor all activity|behavioral tracking|sell to third parties|profile users',
        severity: 'high',
        explanation: 'Privacy invasion beyond service operation needs',
        affectedParty: 'User'
      },
      {
        pattern: 'no liability whatsoever|user bears all risk|indemnify for everything',
        severity: 'high',
        explanation: 'Complete risk shift inappropriate for consumer service',
        affectedParty: 'User'
      },
      {
        pattern: 'class action waiver|mandatory arbitration|provider venue only|no jury',
        severity: 'medium',
        explanation: 'Forced arbitration may be unconscionable for consumers',
        affectedParty: 'User'
      },
      {
        pattern: 'age discrimination|no accessibility|exclude disabilities|geographic blocks',
        severity: 'high',
        explanation: 'Discriminatory terms may violate civil rights laws',
        affectedParty: 'User'
      },
      {
        pattern: 'experiment on users|A/B testing unlimited|psychological manipulation|dark patterns',
        severity: 'medium',
        explanation: 'Unethical experimentation without informed consent',
        affectedParty: 'User'
      }
    ],
    partySpecificConcerns: {
      'User': [
        'Account Security: Protection against hacking and unauthorized access',
        'Content Ownership: Maintaining rights to created content',
        'Privacy Control: Understanding and controlling data use',
        'Service Stability: Consistency in features and availability',
        'Fair Enforcement: Proportionate responses to violations',
        'Data Portability: Ability to leave and take data',
        'Cost Transparency: No hidden fees or surprise charges',
        'Legal Rights: Preservation of consumer protections',
        'Community Standards: Clear and fairly enforced rules',
        'Platform Changes: Reasonable notice and grandfathering'
      ],
      'Service Provider': [
        'Scalability: Terms that work at scale',
        'Abuse Prevention: Tools to combat bad actors',
        'Legal Compliance: Meeting regulatory requirements',
        'Content Moderation: Efficient violation handling',
        'Revenue Protection: Preventing fraud and abuse',
        'Liability Management: Proportionate risk allocation',
        'IP Protection: Safeguarding platform technology',
        'Operational Flexibility: Ability to evolve service',
        'Cost Management: Sustainable service delivery',
        'Brand Protection: Maintaining platform reputation'
      ]
    },
    criticalClauses: [
      'Account Terms (registration and security)',
      'User Content License (scope and limitations)',
      'Prohibited Uses (specific conduct rules)',
      'Privacy Policy Integration (by reference)',
      'Service Modifications (notice and procedures)',
      'Termination Rights (grounds and process)',
      'Disclaimers and Limitations (legally compliant)',
      'Indemnification (if any, proportionate)',
      'Dispute Resolution (considering user rights)',
      'Governing Law and Venue (appropriate for users)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  },

  'Privacy Policy': {
    contractType: 'Privacy Policy',
    keyReviewPoints: [
      {
        category: 'Data Collection Scope & Purposes',
        description: 'Transparent disclosure of all data collection with lawful bases and purposes',
        mustHave: [
          'Categories of data collected',
          'Collection methods specified',
          'Lawful bases (GDPR Article 6)',
          'Purpose limitation commitments',
          'Data minimization practices',
          'Collection sources identified',
          'Third-party data noted',
          'Automated collection disclosed',
          'Special categories handled',
          'Children data procedures'
        ],
        shouldAvoid: [
          'Vague data categories',
          'Hidden collection methods',
          'No lawful basis stated',
          'Unlimited purposes',
          'Excessive collection',
          'Sources undisclosed',
          'Third-party data hidden',
          'Tracking undisclosed',
          'Sensitive data casual',
          'Children targeted'
        ]
      },
      {
        category: 'Data Subject Rights Framework',
        description: 'Comprehensive rights implementation meeting global privacy law requirements',
        mustHave: [
          'Access request procedures',
          'Rectification processes',
          'Erasure/deletion rights',
          'Portability mechanisms',
          'Objection procedures',
          'Consent withdrawal',
          'Automated decision rights',
          'Complaint procedures',
          'Response timelines',
          'No fee for requests'
        ],
        shouldAvoid: [
          'Rights denied',
          'Excessive verification',
          'Fees for access',
          'No deletion offered',
          'Portability refused',
          'No opt-out mechanisms',
          'Consent not revocable',
          'No human review',
          'Delayed responses',
          'Complex procedures'
        ]
      },
      {
        category: 'Data Sharing & Third-Party Transfers',
        description: 'Clear disclosure of all data sharing with appropriate safeguards',
        mustHave: [
          'Third-party categories',
          'Sharing purposes',
          'International transfers',
          'Transfer mechanisms (SCCs)',
          'Processor agreements',
          'Sale of data disclosure',
          'Marketing partners listed',
          'Data broker registration',
          'Onward transfer limits',
          'Sharing opt-outs'
        ],
        shouldAvoid: [
          'Hidden sharing',
          'Unlimited recipients',
          'No transfer safeguards',
          'Sale without consent',
          'Marketing not disclosed',
          'Broker sales hidden',
          'No opt-out available',
          'Transfers anywhere',
          'No processor controls',
          'Third-party changes'
        ]
      },
      {
        category: 'Security & Breach Procedures',
        description: 'Appropriate security measures with clear breach notification commitments',
        mustHave: [
          'Security measures overview',
          'Encryption standards',
          'Access controls',
          'Breach notification timeline',
          'Affected party notices',
          'Regulatory notifications',
          'Breach content disclosed',
          'Mitigation measures',
          'Regular security reviews',
          'Employee training'
        ],
        shouldAvoid: [
          'No security mentioned',
          'Security disclaimed',
          'No breach notices',
          'Delayed notifications',
          'Limited disclosure',
          'No mitigation offered',
          'No security updates',
          'Blame shifting',
          'No reviews conducted',
          'Training absent'
        ]
      },
      {
        category: 'Retention & Deletion Practices',
        description: 'Clear retention periods with deletion procedures and exceptions',
        mustHave: [
          'Retention periods specified',
          'Retention criteria',
          'Deletion procedures',
          'Anonymization options',
          'Legal hold exceptions',
          'Backup deletion timelines',
          'Account closure effects',
          'Data minimization reviews',
          'Archive practices',
          'Audit trail retention'
        ],
        shouldAvoid: [
          'Indefinite retention',
          'No deletion timeline',
          'Vague criteria',
          'No anonymization',
          'Unlimited holds',
          'Backups permanent',
          'Ghost accounts',
          'No reviews conducted',
          'Archives unlimited',
          'Everything kept'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'may sell data|share with partners|marketing purposes|third party use',
        severity: 'high',
        explanation: 'Commercial exploitation of personal data without clear consent',
        affectedParty: 'Data Subject'
      },
      {
        pattern: 'no opt out|consent assumed|continued use agrees|no withdrawal',
        severity: 'high',
        explanation: 'Forced consent violates privacy law requirements',
        affectedParty: 'Data Subject'
      },
      {
        pattern: 'retain indefinitely|no deletion|permanent records|forever',
        severity: 'high',
        explanation: 'Unlimited retention violates data minimization principles',
        affectedParty: 'Data Subject'
      },
      {
        pattern: 'transfer anywhere|no safeguards|any country|third party discretion',
        severity: 'high',
        explanation: 'Unrestricted international transfers risk data protection',
        affectedParty: 'Data Subject'
      },
      {
        pattern: 'change anytime|no notice|sole discretion|retroactive',
        severity: 'high',
        explanation: 'Unilateral changes undermine privacy commitments',
        affectedParty: 'Data Subject'
      },
      {
        pattern: 'no security liability|breaches disclaimed|no notification|user risk',
        severity: 'high',
        explanation: 'Security responsibility abdication violates duty of care',
        affectedParty: 'Data Subject'
      },
      {
        pattern: 'behavioral advertising|profile building|cross-site tracking|fingerprinting',
        severity: 'medium',
        explanation: 'Invasive tracking without clear disclosure and consent',
        affectedParty: 'Data Subject'
      },
      {
        pattern: 'inferred data|derived insights|predictive analytics|psychological profiling',
        severity: 'medium',
        explanation: 'Creating sensitive inferences without transparency',
        affectedParty: 'Data Subject'
      }
    ],
    partySpecificConcerns: {
      'Data Subject': [
        'Data Control: Meaningful control over personal information',
        'Transparency: Understanding all data practices',
        'Purpose Limitation: Data used only as disclosed',
        'Security Assurance: Protection against breaches',
        'Rights Exercise: Easy access to privacy rights',
        'Consent Reality: True choice in data processing',
        'Deletion Rights: Ability to be forgotten',
        'Portability: Taking data when leaving',
        'No Surprises: No hidden data practices',
        'Legal Protection: Regulatory compliance'
      ],
      'Data Controller': [
        'Legal Compliance: Meeting all privacy laws',
        'Operational Efficiency: Workable procedures',
        'Business Flexibility: Room for innovation',
        'Security Balance: Reasonable measures',
        'Cost Management: Sustainable compliance',
        'Competitive Needs: Market-standard practices',
        'Risk Management: Liability limitation',
        'Global Operations: Multi-jurisdictional needs',
        'Consent Management: Practical mechanisms',
        'Enforcement Defense: Regulatory readiness'
      ]
    },
    criticalClauses: [
      'Information We Collect (comprehensive categories)',
      'How We Use Information (lawful bases and purposes)',
      'Information Sharing (third parties and transfers)',
      'Your Rights and Choices (data subject rights)',
      'Data Security (measures and breach procedures)',
      'Data Retention (periods and deletion)',
      'Children Privacy (COPPA/GDPR-K compliance)',
      'International Transfers (mechanisms and safeguards)',
      'Contact Information (DPO and privacy team)',
      'Changes to Policy (notification procedures)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  },

  'Data Processing Agreement (DPA)': {
    contractType: 'Data Processing Agreement (DPA)',
    keyReviewPoints: [
      {
        category: 'Processing Scope & Instructions Framework',
        description: 'Precise definition of processing activities with clear instruction mechanisms',
        mustHave: [
          'Processing purposes defined',
          'Data categories specified',
          'Subject categories listed',
          'Processing operations detailed',
          'Duration specified',
          'Written instruction procedures',
          'Instruction log maintenance',
          'Ultra vires protections',
          'Processor initiatives prohibited',
          'Change control processes'
        ],
        shouldAvoid: [
          'Vague processing scope',
          'Processor discretion',
          'Oral instructions',
          'No boundaries set',
          'Open-ended purposes',
          'Self-directed processing',
          'No instruction records',
          'Assumed authorities',
          'Scope creep allowed',
          'Unilateral changes'
        ]
      },
      {
        category: 'Sub-processor Management & Controls',
        description: 'Comprehensive framework for sub-processor engagement and oversight',
        mustHave: [
          'Prior approval requirements',
          'Sub-processor list maintained',
          'Notification procedures',
          'Objection rights',
          'Flow-down obligations',
          'Due diligence standards',
          'Audit rights extension',
          'Liability allocation',
          'Termination rights',
          'Alternative arrangements'
        ],
        shouldAvoid: [
          'Unlimited sub-processing',
          'No approval needed',
          'No notification given',
          'No objection rights',
          'Weak flow-downs',
          'No due diligence',
          'No audit extension',
          'Processor sole liability',
          'No termination trigger',
          'Forced acceptance'
        ]
      },
      {
        category: 'Security Measures & Breach Response',
        description: 'Technical and organizational measures with incident response procedures',
        mustHave: [
          'Article 32 compliance',
          'Specific measures listed',
          'Encryption requirements',
          'Access controls detailed',
          'Employee training mandated',
          'Security updates required',
          'Breach notification timeline',
          'Breach assistance duties',
          'Investigation cooperation',
          'Mitigation obligations'
        ],
        shouldAvoid: [
          'Generic security only',
          'No specifics provided',
          'Outdated measures',
          'No update duties',
          'Training optional',
          'Breach notice delayed',
          'Limited assistance',
          'No investigation duty',
          'Mitigation disclaimed',
          'Controller bears cost'
        ]
      },
      {
        category: 'Data Subject Rights Support',
        description: 'Processor assistance framework for data subject request fulfillment',
        mustHave: [
          'Technical measures available',
          'Response time commitments',
          'Access request support',
          'Deletion capabilities',
          'Portability formats',
          'Rectification tools',
          'Restriction mechanisms',
          'Cost allocation fair',
          'Automated tools provided',
          'Direct response options'
        ],
        shouldAvoid: [
          'No assistance provided',
          'Excessive delays',
          'Manual only processes',
          'No deletion capability',
          'Proprietary formats',
          'No direct tools',
          'Unreasonable costs',
          'Limited support hours',
          'No automation',
          'Processor discretion'
        ]
      },
      {
        category: 'Audit & Compliance Framework',
        description: 'Comprehensive audit rights with practical implementation procedures',
        mustHave: [
          'Audit rights clear',
          'Frequency reasonable',
          'Notice requirements',
          'Scope parameters',
          'Cost allocation',
          'Certification alternatives',
          'Third-party auditor options',
          'Confidentiality protections',
          'Remediation timelines',
          'Evidence provision'
        ],
        shouldAvoid: [
          'No audit rights',
          'Excessive restrictions',
          'Prohibitive costs',
          'No certifications',
          'Processor auditor only',
          'No confidentiality',
          'No remediation duty',
          'Evidence withheld',
          'Disruption permitted',
          'Annual limits strict'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'processor determines|own purposes|business analytics|product improvement',
        severity: 'high',
        explanation: 'Processor acting as controller violates GDPR Article 28',
        affectedParty: 'Data Controller'
      },
      {
        pattern: 'no sub-processor restrictions|unlimited delegation|no notification',
        severity: 'high',
        explanation: 'Uncontrolled sub-processing creates compliance risk',
        affectedParty: 'Data Controller'
      },
      {
        pattern: 'security commercially reasonable|no specifics|processor discretion',
        severity: 'high',
        explanation: 'Vague security undermines Article 32 compliance',
        affectedParty: 'both'
      },
      {
        pattern: 'no audit rights|certification only|processor discretion|annual limit',
        severity: 'high',
        explanation: 'Insufficient oversight prevents compliance verification',
        affectedParty: 'Data Controller'
      },
      {
        pattern: 'data retention processor decides|no deletion capability|backups forever',
        severity: 'high',
        explanation: 'Processor retention control violates controller authority',
        affectedParty: 'Data Controller'
      },
      {
        pattern: 'international transfer anywhere|no safeguards|processor discretion',
        severity: 'high',
        explanation: 'Unrestricted transfers violate Chapter V requirements',
        affectedParty: 'both'
      },
      {
        pattern: 'liability excluded|no indemnity|damages capped minimal|breach costs controller',
        severity: 'medium',
        explanation: 'Unfair risk allocation for processor failures',
        affectedParty: 'Data Controller'
      },
      {
        pattern: 'termination no deletion|data retained|no return option|format proprietary',
        severity: 'high',
        explanation: 'Data hostage scenario post-termination',
        affectedParty: 'Data Controller'
      }
    ],
    partySpecificConcerns: {
      'Data Controller': [
        'Regulatory Compliance: Meeting controller obligations through processor',
        'Control Maintenance: Retaining decision authority over processing',
        'Audit Capability: Verifying processor compliance',
        'Risk Management: Appropriate liability allocation',
        'Data Portability: Avoiding vendor lock-in',
        'Breach Response: Timely notification and assistance',
        'Sub-processor Oversight: Maintaining processing chain control',
        'Evidence Collection: Documentation for regulators',
        'Cost Predictability: Understanding compliance costs',
        'Flexibility Needs: Adapting to regulatory changes'
      ],
      'Data Processor': [
        'Instruction Clarity: Clear processing boundaries',
        'Liability Limits: Proportionate risk allocation',
        'Operational Efficiency: Workable compliance procedures',
        'Sub-processor Usage: Flexibility for service delivery',
        'Cost Recovery: Fair compensation for compliance',
        'Audit Burden: Reasonable oversight demands',
        'Competitive Information: Protecting proprietary methods',
        'Scalability: Procedures working at scale',
        'Innovation Space: Room for service improvement',
        'Multi-tenant Challenges: Balancing customer needs'
      ]
    },
    criticalClauses: [
      'Processing Details (scope, purpose, duration)',
      'Processor Obligations (Article 28 requirements)',
      'Sub-processor Provisions (approval and flow-down)',
      'Security Measures (technical and organizational)',
      'Breach Notification (timelines and procedures)',
      'Data Subject Rights (assistance framework)',
      'Audit Rights (scope and procedures)',
      'International Transfers (safeguards and restrictions)',
      'Liability and Indemnification (fair allocation)',
      'Termination and Deletion (return/deletion procedures)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  },

  'Cloud Services Agreement': {
    contractType: 'Cloud Services Agreement',
    keyReviewPoints: [
      {
        category: 'Service Architecture & Deployment Models',
        description: 'Comprehensive framework defining IaaS, PaaS, or SaaS components with deployment options',
        mustHave: [
          'Service model clarity (IaaS/PaaS/SaaS)',
          'Deployment options (public/private/hybrid)',
          'Resource specifications',
          'Scalability parameters',
          'Multi-tenancy disclosures',
          'Isolation guarantees',
          'Geographic deployment',
          'Redundancy architecture',
          'Service dependencies',
          'Technology stack disclosure'
        ],
        shouldAvoid: [
          'Vague service definitions',
          'No deployment options',
          'Unspecified resources',
          'No scalability paths',
          'Hidden multi-tenancy',
          'No isolation guarantees',
          'Single region only',
          'No redundancy',
          'Hidden dependencies',
          'Black box services'
        ]
      },
      {
        category: 'Performance & Availability Commitments',
        description: 'Measurable service levels with meaningful remedies and monitoring',
        mustHave: [
          'Availability SLA (99.9%+)',
          'Performance benchmarks',
          'Latency commitments',
          'Throughput guarantees',
          'Monitoring dashboards',
          'Real-time metrics',
          'Credit calculations',
          'Measurement methodology',
          'Maintenance windows',
          'Degradation definitions'
        ],
        shouldAvoid: [
          'No SLA provided',
          'Availability below 99%',
          'No performance metrics',
          'Provider measurement only',
          'No customer visibility',
          'Credits as sole remedy',
          'Excessive exclusions',
          'Unclear calculations',
          'Unlimited maintenance',
          'No degradation coverage'
        ]
      },
      {
        category: 'Data Governance & Sovereignty',
        description: 'Comprehensive framework for data location, movement, and control',
        mustHave: [
          'Data residency options',
          'Location transparency',
          'Movement notifications',
          'Sovereignty guarantees',
          'Government access procedures',
          'Encryption standards',
          'Key management options',
          'Data classification support',
          'Retention controls',
          'Deletion verification'
        ],
        shouldAvoid: [
          'Location opacity',
          'Unlimited movement',
          'No sovereignty options',
          'Government backdoors',
          'Weak encryption',
          'Provider key control only',
          'No classification',
          'Retention ambiguity',
          'No deletion proof',
          'Data mingling'
        ]
      },
      {
        category: 'Security Architecture & Compliance',
        description: 'Enterprise security framework with compliance certifications and shared responsibility',
        mustHave: [
          'Shared responsibility matrix',
          'Security certifications (SOC 2, ISO)',
          'Compliance attestations',
          'Penetration testing rights',
          'Vulnerability management',
          'Incident response procedures',
          'Access controls specified',
          'Network security details',
          'Physical security standards',
          'Security update procedures'
        ],
        shouldAvoid: [
          'Unclear responsibilities',
          'No certifications',
          'Compliance disclaimed',
          'No testing allowed',
          'Ad hoc patching',
          'No incident process',
          'Weak access controls',
          'Network opacity',
          'Physical access unclear',
          'No update commitments'
        ]
      },
      {
        category: 'Migration & Exit Management',
        description: 'Comprehensive framework for data portability and service transition',
        mustHave: [
          'Data export tools',
          'Standard format options',
          'API-based extraction',
          'Bandwidth allocations',
          'Migration assistance',
          'Transition periods',
          'Documentation access',
          'Configuration exports',
          'No lock-in commitments',
          'Cost transparency'
        ],
        shouldAvoid: [
          'No export tools',
          'Proprietary formats only',
          'Manual processes only',
          'Bandwidth charges high',
          'No assistance provided',
          'Immediate cutoff',
          'Documentation withheld',
          'Configurations locked',
          'Vendor lock-in',
          'Hidden exit costs'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'no liability.*data loss|excluded.*security breach|customer solely responsible',
        severity: 'high',
        explanation: 'Complete disclaimer inappropriate for enterprise cloud services',
        affectedParty: 'Customer'
      },
      {
        pattern: 'may move data.*any location|government access.*no notice|decrypt anytime',
        severity: 'high',
        explanation: 'Uncontrolled data movement and access destroys sovereignty',
        affectedParty: 'Customer'
      },
      {
        pattern: 'change services.*anytime|reduce functionality|discontinue features',
        severity: 'high',
        explanation: 'Arbitrary service changes disrupt business operations',
        affectedParty: 'Customer'
      },
      {
        pattern: 'data deletion.*provider discretion|retain indefinitely|no verification',
        severity: 'high',
        explanation: 'Lack of deletion control violates data governance',
        affectedParty: 'Customer'
      },
      {
        pattern: 'no export.*assistance|proprietary format only|bandwidth charges apply',
        severity: 'high',
        explanation: 'Data hostage scenario prevents vendor mobility',
        affectedParty: 'Customer'
      },
      {
        pattern: 'credits only remedy|no refunds|no termination.*breach|waive damages',
        severity: 'medium',
        explanation: 'Inadequate remedies for service failures',
        affectedParty: 'Customer'
      },
      {
        pattern: 'audit.*provider discretion|no penetration testing|security secret',
        severity: 'medium',
        explanation: 'Insufficient transparency for security verification',
        affectedParty: 'Customer'
      },
      {
        pattern: 'suspend immediately|no notice required|automated enforcement|no appeal',
        severity: 'medium',
        explanation: 'Arbitrary suspension threatens business continuity',
        affectedParty: 'Customer'
      }
    ],
    partySpecificConcerns: {
      'Customer': [
        'Service Reliability: Consistent availability meeting business needs',
        'Data Control: Maintaining sovereignty and governance',
        'Security Assurance: Enterprise-grade protection',
        'Compliance Support: Meeting regulatory requirements',
        'Cost Predictability: Understanding total cost of ownership',
        'Performance Consistency: Meeting application requirements',
        'Vendor Lock-in: Avoiding proprietary dependencies',
        'Disaster Recovery: Business continuity capabilities',
        'Scalability: Growing with business needs',
        'Exit Strategy: Clean migration when needed'
      ],
      'Cloud Provider': [
        'Resource Optimization: Efficient multi-tenant operations',
        'Security Boundaries: Clear shared responsibilities',
        'Compliance Scope: Reasonable attestation demands',
        'Liability Balance: Proportionate risk allocation',
        'Innovation Freedom: Service evolution capabilities',
        'Competitive Differentiation: Unique value propositions',
        'Global Operations: Cross-border service delivery',
        'Automation Needs: Efficient service management',
        'Customer Success: Adoption and satisfaction',
        'Margin Protection: Sustainable pricing models'
      ]
    },
    criticalClauses: [
      'Service Description (detailed specifications)',
      'Service Levels (availability and performance)',
      'Security and Compliance (shared responsibility)',
      'Data Protection (location and sovereignty)',
      'Service Changes (notification and grandfathering)',
      'Support Services (tiers and response times)',
      'Fees and Usage (pricing and measurements)',
      'Term and Termination (notice and transitions)',
      'Liability and Indemnification (balanced allocation)',
      'Data Portability (export and migration)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  },

  'API Usage Agreement': {
    contractType: 'API Usage Agreement',
    keyReviewPoints: [
      {
        category: 'API Access Rights & Authentication',
        description: 'Framework defining access methods, authentication requirements, and usage scopes',
        mustHave: [
          'Authentication methods (OAuth, API keys)',
          'Access scope definitions',
          'Rate limiting specifications',
          'Quota allocations',
          'Endpoint availability',
          'Version access rights',
          'Sandbox environments',
          'Production credentials',
          'IP whitelisting options',
          'Multi-tenant isolation'
        ],
        shouldAvoid: [
          'Unclear rate limits',
          'No sandbox access',
          'Arbitrary quotas',
          'Version removal anytime',
          'No testing environment',
          'IP restrictions excessive',
          'Authentication changes sudden',
          'No development keys',
          'Shared credentials',
          'No isolation guarantees'
        ]
      },
      {
        category: 'Technical Integration & Documentation',
        description: 'Comprehensive technical framework with documentation and support',
        mustHave: [
          'API documentation access',
          'SDK availability',
          'Code examples provided',
          'Integration guides',
          'Changelog maintenance',
          'Deprecation notices',
          'Breaking change policy',
          'Backward compatibility',
          'Error code definitions',
          'Webhook specifications'
        ],
        shouldAvoid: [
          'No documentation',
          'Outdated examples',
          'No SDKs provided',
          'Hidden changes',
          'No deprecation notice',
          'Breaking changes anytime',
          'No compatibility commitment',
          'Cryptic error codes',
          'Documentation paywalled',
          'No integration support'
        ]
      },
      {
        category: 'Data Usage & Privacy Compliance',
        description: 'Clear framework for data handling through API with privacy protections',
        mustHave: [
          'Data usage restrictions',
          'Privacy policy alignment',
          'User consent flow',
          'Data minimization',
          'Purpose limitations',
          'Retention limits',
          'Deletion capabilities',
          'Audit logging',
          'GDPR/CCPA compliance',
          'Cross-border transfers'
        ],
        shouldAvoid: [
          'Unlimited data use',
          'No privacy alignment',
          'Consent bypassed',
          'Excessive data pull',
          'Purpose creep allowed',
          'Indefinite retention',
          'No deletion API',
          'No audit trail',
          'Privacy laws ignored',
          'Unrestricted transfers'
        ]
      },
      {
        category: 'Commercial Terms & Monetization',
        description: 'Transparent pricing model with fair usage and monetization rights',
        mustHave: [
          'Pricing tiers clear',
          'Free tier specifications',
          'Overage handling',
          'Billing methodology',
          'Payment terms',
          'Rev-share models',
          'Monetization rights',
          'Reseller provisions',
          'Enterprise pricing',
          'Non-profit discounts'
        ],
        shouldAvoid: [
          'Hidden pricing',
          'No free tier',
          'Punitive overages',
          'Unclear billing',
          'Prepayment only',
          'No monetization allowed',
          'Anti-competitive terms',
          'No resale rights',
          'Price changes anytime',
          'Discriminatory pricing'
        ]
      },
      {
        category: 'Service Continuity & Deprecation',
        description: 'Framework ensuring predictable service evolution and migration paths',
        mustHave: [
          'Version lifecycle policy',
          'Deprecation timeline (12+ months)',
          'Migration guides provided',
          'Sunset procedures',
          'Feature stability commitments',
          'Emergency contact procedures',
          'Status page availability',
          'Incident communication',
          'Planned maintenance notice',
          'Service level targets'
        ],
        shouldAvoid: [
          'Instant deprecation',
          'No migration path',
          'Features removed suddenly',
          'No stability promise',
          'No status visibility',
          'Communication void',
          'Maintenance anytime',
          'No incident notices',
          'Short lifecycles',
          'No continuity plan'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'terminate access.*any time|revoke immediately|sole discretion|no notice',
        severity: 'high',
        explanation: 'Arbitrary termination threatens application viability',
        affectedParty: 'API User/Developer'
      },
      {
        pattern: 'change API.*without notice|remove endpoints|modify functionality|break compatibility',
        severity: 'high',
        explanation: 'Unpredictable changes break dependent applications',
        affectedParty: 'API User/Developer'
      },
      {
        pattern: 'all data.*provider property|insights from usage|derivative works owned|improvements claimed',
        severity: 'high',
        explanation: 'Overreaching data claims violate user privacy and developer rights',
        affectedParty: 'API User/Developer'
      },
      {
        pattern: 'no monetization|cannot charge|revenue share 100%|compete restriction',
        severity: 'high',
        explanation: 'Anti-competitive restrictions prevent viable business models',
        affectedParty: 'API User/Developer'
      },
      {
        pattern: 'rate limits.*may change|quotas provider discretion|no notice required',
        severity: 'medium',
        explanation: 'Unpredictable limits disrupt service planning',
        affectedParty: 'API User/Developer'
      },
      {
        pattern: 'audit code.*any time|source access required|implementation review|approve applications',
        severity: 'medium',
        explanation: 'Invasive oversight and approval requirements',
        affectedParty: 'API User/Developer'
      },
      {
        pattern: 'indemnify.*all claims|unlimited liability|personal guarantees|defend provider',
        severity: 'high',
        explanation: 'Disproportionate liability for API usage',
        affectedParty: 'API User/Developer'
      },
      {
        pattern: 'no SLA|no uptime commitment|availability not guaranteed|no support',
        severity: 'medium',
        explanation: 'No reliability commitments for production use',
        affectedParty: 'API User/Developer'
      }
    ],
    partySpecificConcerns: {
      'API User/Developer': [
        'Service Reliability: Consistent availability for production apps',
        'Version Stability: Predictable deprecation cycles',
        'Documentation Quality: Accurate, complete technical guides',
        'Fair Pricing: Transparent, reasonable usage costs',
        'Data Rights: Clear ownership and privacy compliance',
        'Monetization Freedom: Ability to build viable businesses',
        'Technical Support: Responsive assistance when needed',
        'Rate Limit Fairness: Sufficient capacity for growth',
        'Legal Clarity: Understanding all obligations',
        'Migration Paths: Smooth transitions for changes'
      ],
      'API Provider': [
        'Platform Protection: Preventing abuse and overload',
        'Revenue Model: Sustainable API economics',
        'Quality Control: Maintaining ecosystem standards',
        'Brand Protection: Controlling API usage context',
        'Security Management: Preventing malicious usage',
        'Scalability Control: Managing infrastructure costs',
        'Competitive Advantage: Protecting proprietary features',
        'Developer Success: Enabling valuable integrations',
        'Compliance Management: Meeting regulatory requirements',
        'Innovation Freedom: Evolving services over time'
      ]
    },
    criticalClauses: [
      'API Access Grant (scope and limitations)',
      'Authentication and Security (methods and requirements)',
      'Rate Limits and Quotas (specifications and enforcement)',
      'Acceptable Use Policy (prohibited activities)',
      'Data Usage Rights (privacy and ownership)',
      'Intellectual Property (licenses and restrictions)',
      'Commercial Terms (pricing and monetization)',
      'Service Levels (if any, availability targets)',
      'Deprecation Policy (timelines and procedures)',
      'Termination (grounds and effects)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  },

  'Website/Mobile App Development Agreement': {
    contractType: 'Website/Mobile App Development Agreement',
    keyReviewPoints: [
      {
        category: 'Project Scope & Deliverables Definition',
        description: 'Comprehensive specification of development deliverables with acceptance criteria',
        mustHave: [
          'Detailed functional specifications',
          'Technical requirements document',
          'Platform specifications (iOS/Android/Web)',
          'Design mockups/wireframes',
          'Features list prioritized',
          'Performance requirements',
          'Browser/device compatibility',
          'Third-party integrations',
          'Milestone definitions',
          'Acceptance test criteria'
        ],
        shouldAvoid: [
          'Vague scope statements',
          'Unlimited revisions',
          'Feature creep allowance',
          'No specifications',
          'Open-ended requirements',
          'No acceptance criteria',
          'Subjective standards',
          'Perpetual changes',
          'No platform limits',
          'Success-based only'
        ]
      },
      {
        category: 'Development Process & Methodology',
        description: 'Clear framework for development workflow, communication, and project management',
        mustHave: [
          'Development methodology (Agile/Waterfall)',
          'Sprint/iteration schedule',
          'Communication protocols',
          'Progress reporting frequency',
          'Code repository access',
          'Testing procedures',
          'Bug tracking system',
          'Change request process',
          'Approval workflows',
          'Project management tools'
        ],
        shouldAvoid: [
          'No process defined',
          'Ad hoc development',
          'No regular updates',
          'Black box development',
          'No testing phases',
          'Client excluded',
          'No change control',
          'Informal approvals',
          'No documentation',
          'Chaotic workflows'
        ]
      },
      {
        category: 'Intellectual Property & Code Ownership',
        description: 'Comprehensive framework for IP ownership, licenses, and third-party components',
        mustHave: [
          'Work product ownership transfer',
          'Source code delivery',
          'Documentation ownership',
          'Third-party license disclosure',
          'Open source components list',
          'Developer tool exclusions',
          'Background IP license',
          'Moral rights waiver',
          'Patent cooperation',
          'Trade secret handling'
        ],
        shouldAvoid: [
          'Developer retains ownership',
          'No source code access',
          'Binary delivery only',
          'Hidden third-party code',
          'Viral licenses included',
          'No IP warranties',
          'Background IP claimed',
          'Future improvements claimed',
          'No documentation transfer',
          'Competitive restrictions'
        ]
      },
      {
        category: 'Timeline, Milestones & Payment Structure',
        description: 'Realistic development timeline with payment milestones tied to deliverables',
        mustHave: [
          'Project timeline detailed',
          'Milestone deliverables',
          'Payment schedule aligned',
          'Delay remedies specified',
          'Force majeure provisions',
          'Time and materials caps',
          'Change order pricing',
          'Expense reimbursement',
          'Payment terms clear',
          'Escrow considerations'
        ],
        shouldAvoid: [
          'Unrealistic deadlines',
          'Payment before delivery',
          'No delay remedies',
          'Penalties excessive',
          'No force majeure',
          'Unlimited T&M',
          'Change orders blank',
          'Hidden expenses',
          'Net 90+ terms',
          'No partial payments'
        ]
      },
      {
        category: 'Post-Launch Support & Maintenance',
        description: 'Clear framework for warranty, support, and ongoing maintenance',
        mustHave: [
          'Warranty period defined',
          'Bug fix obligations',
          'Support response times',
          'Maintenance packages',
          'Update procedures',
          'Knowledge transfer',
          'Documentation standards',
          'Training provisions',
          'Hosting transition',
          'Code escrow options'
        ],
        shouldAvoid: [
          'No warranty provided',
          'Disclaimer of defects',
          'No support included',
          'Expensive maintenance',
          'No knowledge transfer',
          'Documentation lacking',
          'No training offered',
          'Hosting lock-in',
          'No transition help',
          'Abandon after launch'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'developer owns.*code|retain all rights|license back to client|competitive use',
        severity: 'high',
        explanation: 'Developer ownership undermines client business investment',
        affectedParty: 'Client'
      },
      {
        pattern: 'unlimited changes|revisions until satisfied|perfection standard|subjective approval',
        severity: 'high',
        explanation: 'Open-ended obligations make project economically unviable',
        affectedParty: 'Developer'
      },
      {
        pattern: 'no source code|binary only|encrypted delivery|proprietary formats',
        severity: 'high',
        explanation: 'Lack of source code creates vendor lock-in and maintenance issues',
        affectedParty: 'Client'
      },
      {
        pattern: 'payment upfront|100% advance|no milestones|pay before start',
        severity: 'high',
        explanation: 'Full prepayment creates performance risk and no leverage',
        affectedParty: 'Client'
      },
      {
        pattern: 'no warranties|as is delivery|all risk client|bug disclaimer',
        severity: 'high',
        explanation: 'No quality assurance inappropriate for custom development',
        affectedParty: 'Client'
      },
      {
        pattern: 'time estimates only|no deadlines|best efforts only|no completion date',
        severity: 'medium',
        explanation: 'Lack of timeline commitment prevents business planning',
        affectedParty: 'Client'
      },
      {
        pattern: 'oral changes ok|no writing required|informal approvals|email sufficient',
        severity: 'medium',
        explanation: 'Informal change process leads to scope disputes',
        affectedParty: 'both'
      },
      {
        pattern: 'consequential damages|lost profits included|unlimited liability|personal guarantees',
        severity: 'high',
        explanation: 'Disproportionate liability for development services',
        affectedParty: 'Developer'
      }
    ],
    partySpecificConcerns: {
      'Client': [
        'Timeline Certainty: Predictable launch date for business planning',
        'Budget Control: No surprise costs or overruns',
        'IP Ownership: Clear ownership of custom work',
        'Vendor Independence: Avoiding lock-in situations',
        'Quality Assurance: Thorough testing and bug-free delivery',
        'Knowledge Transfer: Ability to maintain independently',
        'Market Timing: Meeting competitive windows',
        'User Experience: Achieving design vision',
        'Scalability: Architecture supporting growth'
      ],
      'Developer': [
        'Scope Management: Preventing unlimited revisions',
        'Payment Security: Regular milestone payments',
        'Clear Requirements: Avoiding moving targets',
        'Reasonable Timelines: Achievable deadlines',
        'Change Control: Paid modifications process',
        'IP Protection: Retaining tool/methodology rights',
        'Liability Limits: Proportionate risk allocation',
        'Client Cooperation: Timely approvals and feedback',
        'Technical Feasibility: Realistic expectations',
        'Portfolio Rights: Ability to showcase work'
      ]
    },
    criticalClauses: [
      'Scope of Work (detailed specifications and deliverables)',
      'Development Timeline (milestones and deadlines)',
      'Payment Terms (schedule tied to milestones)',
      'Intellectual Property Assignment (upon payment)',
      'Change Management (written change orders)',
      'Testing and Acceptance (criteria and procedures)',
      'Warranties and Support (period and scope)',
      'Confidentiality (mutual obligations)',
      'Limitation of Liability (proportionate caps)',
      'Termination Rights (for cause and convenience)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  },

  'Software Maintenance and Support Agreement': {
    contractType: 'Software Maintenance and Support Agreement',
    keyReviewPoints: [
      {
        category: 'Support Service Levels & Response Framework',
        description: 'Tiered support structure with defined response times and resolution targets',
        mustHave: [
          'Severity level definitions (P1-P4)',
          'Response time matrices',
          'Resolution time targets',
          'Escalation procedures',
          '24/7 availability (for P1)',
          'Contact methods specified',
          'Named support contacts',
          'Holiday coverage',
          'On-call procedures',
          'Service credit remedies'
        ],
        shouldAvoid: [
          'Vague severity levels',
          'No response commitments',
          'Best efforts only',
          'No escalation path',
          'Business hours only',
          'Email only support',
          'No named resources',
          'Holiday exclusions',
          'No on-call for critical',
          'No meaningful remedies'
        ]
      },
      {
        category: 'Maintenance Scope & Update Framework',
        description: 'Comprehensive maintenance services including updates, patches, and enhancements',
        mustHave: [
          'Bug fix commitments',
          'Security patch timeline',
          'Version update rights',
          'Compatibility maintenance',
          'Performance optimization',
          'Documentation updates',
          'Release notes provision',
          'Testing before release',
          'Rollback procedures',
          'Update scheduling options'
        ],
        shouldAvoid: [
          'Fixes discretionary',
          'No security timeline',
          'Updates not included',
          'No compatibility promise',
          'Performance excluded',
          'Documentation static',
          'No release notes',
          'Untested patches',
          'No rollback ability',
          'Forced update times'
        ]
      },
      {
        category: 'Scope Boundaries & Additional Services',
        description: 'Clear delineation between included maintenance and chargeable services',
        mustHave: [
          'Included services list',
          'Excluded services clear',
          'Enhancement definitions',
          'Customization boundaries',
          'Integration support scope',
          'Training allocations',
          'Consultation hours',
          'Emergency support rules',
          'Root cause analysis',
          'Preventive maintenance'
        ],
        shouldAvoid: [
          'Vague inclusions',
          'Everything excluded',
          'No enhancements ever',
          'All customization extra',
          'No integration help',
          'Training not included',
          'No consultation time',
          'Emergency fees excessive',
          'No RCA provided',
          'Reactive only service'
        ]
      },
      {
        category: 'Technical Environment & Evolution',
        description: 'Framework for supporting evolving technical environments and platforms',
        mustHave: [
          'Supported platforms list',
          'Version support matrix',
          'EOL notification (12+ months)',
          'Migration assistance',
          'Backward compatibility',
          'Third-party updates',
          'Hardware requirements',
          'Virtualization support',
          'Cloud deployment support',
          'Technology roadmap sharing'
        ],
        shouldAvoid: [
          'Limited platform support',
          'Versions dropped quickly',
          'No EOL notice',
          'No migration help',
          'Breaking changes',
          'Third-party ignored',
          'Hardware mandates',
          'No virtual support',
          'On-premise only',
          'No roadmap visibility'
        ]
      },
      {
        category: 'Knowledge Management & Documentation',
        description: 'Comprehensive knowledge transfer and documentation maintenance',
        mustHave: [
          'Knowledge base access',
          'Documentation updates',
          'Known issues database',
          'FAQ maintenance',
          'Video tutorials',
          'Admin guides current',
          'API documentation',
          'Change logs detailed',
          'Best practices guides',
          'Architecture documentation'
        ],
        shouldAvoid: [
          'No knowledge base',
          'Stale documentation',
          'Issues hidden',
          'No FAQ provided',
          'No visual guides',
          'Outdated manuals',
          'API docs missing',
          'Changes undocumented',
          'No best practices',
          'Black box system'
        ]
      }
    ],
    redFlags: [
      {
        pattern: 'best efforts only|no commitments|commercially reasonable|provider discretion',
        severity: 'high',
        explanation: 'Lack of concrete obligations undermines support value',
        affectedParty: 'Customer'
      },
      {
        pattern: 'exclude critical|security not covered|data loss excluded|no emergency',
        severity: 'high',
        explanation: 'Critical issues excluded from support scope',
        affectedParty: 'Customer'
      },
      {
        pattern: 'terminate any time|no notice required|immediate cessation|no transition',
        severity: 'high',
        explanation: 'Abrupt termination threatens business continuity',
        affectedParty: 'Customer'
      },
      {
        pattern: 'unlimited price increases|adjust any time|no cap|retroactive pricing',
        severity: 'high',
        explanation: 'Unpredictable costs prevent budget planning',
        affectedParty: 'Customer'
      },
      {
        pattern: 'no warranties|as is support|no fitness|results not guaranteed',
        severity: 'medium',
        explanation: 'Complete disclaimer inappropriate for paid support',
        affectedParty: 'Customer'
      },
      {
        pattern: 'version forced|must upgrade|no legacy support|migration mandatory',
        severity: 'medium',
        explanation: 'Forced upgrades disrupt stable operations',
        affectedParty: 'Customer'
      },
      {
        pattern: 'all IP ours|improvements owned|feedback assigned|derivatives claimed',
        severity: 'medium',
        explanation: 'Overreaching IP claims on customer contributions',
        affectedParty: 'Customer'
      },
      {
        pattern: 'no SLA credits|remedy meeting only|credits sole remedy|waive damages',
        severity: 'medium',
        explanation: 'Toothless remedies provide no real recourse',
        affectedParty: 'Customer'
      }
    ],
    partySpecificConcerns: {
      'Customer': [
        'Service Reliability: Consistent quality support delivery',
        'Issue Resolution: Timely fixes for business continuity',
        'Cost Predictability: Stable pricing without surprises',
        'Knowledge Retention: Documentation and training',
        'Version Stability: Long-term support commitments',
        'Security Priority: Rapid patch deployment',
        'Vendor Dependency: Avoiding lock-in scenarios',
        'Performance Optimization: Continuous improvement',
        'Compliance Support: Meeting regulatory needs',
        'Business Alignment: Support matching criticality'
      ],
      'Service Provider': [
        'Scope Management: Clear boundaries on included services',
        'Resource Planning: Predictable support demands',
        'Version Control: Managing multiple versions',
        'Liability Limits: Proportionate risk allocation',
        'Revenue Stability: Predictable recurring revenue',
        'Technical Debt: Managing legacy obligations',
        'Customer Success: Enabling self-service',
        'Efficiency Gains: Automation opportunities',
        'Knowledge Capture: Building reusable solutions',
        'Market Competition: Differentiated service value'
      ]
    },
    criticalClauses: [
      'Service Level Agreement (response and resolution times)',
      'Scope of Services (included vs. excluded clearly)',
      'Software Updates (patches, updates, upgrades)',
      'Support Hours and Availability (including holidays)',
      'Severity Levels and Escalation (clear definitions)',
      'Fees and Payment Terms (with adjustment mechanisms)',
      'Term and Renewal (automatic renewal provisions)',
      'Termination and Transition (adequate notice and assistance)',
      'Warranties and Disclaimers (appropriate for paid service)',
      'Limitation of Liability (with SLA credit mechanics)'
    ],
    advancedComplianceNotes: {
      multiJurisdictionalConsiderations: [
        'GDPR: Data processing terms, privacy by design, DPO requirements',
        'CCPA/CPRA: Consumer rights implementation, sale definitions, opt-out mechanisms',
        'HIPAA: BAA requirements, security rule compliance, breach notifications',
        'PCI DSS: Cardholder data protection, security standards, audit requirements',
        'SOX: Financial data controls, audit trails, access management'
      ],
      federalRegulatoryOverlay: [
        'Financial Services: GLBA compliance, FFIEC guidance, open banking APIs',
        'Healthcare: HIPAA/HITECH, FDA software regulations, clinical data handling',
        'Government: FedRAMP, FISMA, ITAR/EAR export controls',
        'Education: FERPA, COPPA for K-12, accessibility requirements',
        'Retail: PCI compliance, state privacy laws, consumer protection'
      ],
      industrySpecificRequirements: [
        'Security: NIST frameworks, ISO 27001/27701, OWASP guidelines',
        'Accessibility: WCAG 2.1 AA, Section 508, ADA compliance',
        'Interoperability: REST/SOAP standards, OAuth 2.0, OpenAPI specifications',
        'Performance: Apdex scores, Core Web Vitals, mobile performance',
        'Reliability: Five 9s methodology, chaos engineering principles'
      ]
    }
  }
};

// Helper function to get template for a contract type
export function getContractTemplate(contractType: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES[contractType];
}

// Helper function to get party-specific red flags
export function getPartySpecificRedFlags(
  contractType: string, 
  partyRole: string
): RedFlag[] {
  const template = CONTRACT_TEMPLATES[contractType];
  if (!template) return [];
  
  return template.redFlags.filter(flag => 
    flag.affectedParty === partyRole || flag.affectedParty === 'both'
  );
}

// Helper function to generate template-aware prompt additions
export function getTemplatePromptAdditions(
  contractType: string,
  partyRole: string
): string {
  const template = CONTRACT_TEMPLATES[contractType];
  if (!template) return '';

  const concerns = template.partySpecificConcerns[partyRole] || [];
  const criticalClauses = template.criticalClauses.join(', ');
  const redFlags = getPartySpecificRedFlags(contractType, partyRole)
    .map(flag => `"${flag.pattern}"`)
    .join(', ');

  return `
IMPORTANT: For this ${contractType}, pay special attention to:
- Critical clauses: ${criticalClauses}
- ${partyRole} concerns: ${concerns.join(', ')}
- Red flag patterns: ${redFlags}

Review each of these key areas:
${template.keyReviewPoints.map(point => 
  `- ${point.category}: Check for ${point.mustHave.join(', ')}`
).join('\n')}
`;
}