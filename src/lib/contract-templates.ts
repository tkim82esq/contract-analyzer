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