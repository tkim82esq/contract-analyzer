import { NextRequest, NextResponse } from "next/server";
import { analyzeContractWithAI, preprocessContract } from "@/lib/ai-analyzer";
import { extractTextFromFile, cleanExtractedText } from "@/lib/document-parser";
import {
  getContractTemplate,
  getPartySpecificRedFlags,
  templateMatcher,
} from "@/lib/contract-templates";

// Fallback mock analysis if AI fails - now uses contract templates
async function mockAnalyze(contractType: string, partyRole: string) {
  const template = getContractTemplate(contractType);
  const redFlags = getPartySpecificRedFlags(contractType, partyRole);

  // Generate template-based mock risks
  let mockRisks = [];

  if (template) {
    // Create risks based on template review points
    mockRisks = template.keyReviewPoints.map((point, index) => ({
      id: index + 1,
      category: point.category,
      severity:
        index === 0
          ? ("high" as const)
          : index === 1
            ? ("medium" as const)
            : ("low" as const),
      title: `${point.category} Issues`,
      description: point.description,
      recommendation: `Review ${point.category.toLowerCase()} carefully and negotiate improvements.`,
    }));

    // Add red flag-based risks with detailed descriptions
    redFlags.forEach((flag) => {
      mockRisks.push({
        id: mockRisks.length + 1,
        category: "Risk Pattern",
        severity: flag.severity,
        title: `Red Flag: ${flag.pattern}`,
        description: flag.riskScenario || flag.explanation,
        recommendation: `Address this concern before signing.`,
      });
    });
  } else {
    // Fallback to original mock data if no template
    const defaultMockRisks = {
      Employee: [
        {
          id: 1,
          category: "Compensation",
          severity: "medium" as const,
          title: "Unclear Bonus Structure",
          description:
            'The bonus calculation method lacks specific criteria and timing details, creating uncertainty about your actual compensation. Without clear performance metrics and payout schedules, you could work extra hours expecting a bonus that never materializes or is calculated arbitrarily by management. This ambiguity gives your employer discretionary power over a significant portion of your income. Industry practice is to define specific, measurable bonus criteria tied to performance goals, revenue targets, or company metrics. Vague language like "at management discretion" or "based on performance" can result in reduced or eliminated bonuses even when you meet unstated expectations.',
          recommendation:
            "Request specific bonus calculation formula with measurable criteria and defined payout schedule.",
        },
        {
          id: 2,
          category: "Benefits",
          severity: "low" as const,
          title: "Limited PTO Policy",
          description:
            "The vacation time allocation appears below industry standard for your role level and could impact work-life balance and employee retention. With only 10 days annually, you have half the typical 20-day standard, making it difficult to take meaningful breaks or handle personal emergencies. This limitation forces you to work through illness or skip important family events, potentially leading to burnout and reduced productivity. Companies with restrictive PTO policies often experience higher turnover rates. If you need to take unpaid time off, it directly impacts your income and may create tension with management who view excessive unpaid leave negatively.",
          recommendation:
            "Negotiate for additional paid time off to meet industry standards for your experience level.",
        },
      ],
      Employer: [
        {
          id: 1,
          category: "Intellectual Property",
          severity: "high" as const,
          title: "Weak IP Assignment",
          description:
            "The intellectual property assignment clause contains gaps that could allow the employee to retain ownership of valuable work product or innovations. Without comprehensive language covering all work-related creations, improvements, and discoveries, you risk losing control over critical IP assets. This becomes particularly problematic if the employee develops patentable innovations, valuable trade secrets, or proprietary processes during their employment. Competitors could gain access to your IP through the employee, or the employee could start a competing business using knowledge developed on your time and resources. Industry standard IP clauses assign all work-related IP to the employer, including future improvements and derivative works.",
          recommendation:
            "Strengthen IP assignment language to cover all work-related intellectual property including improvements and derivative works.",
        },
        {
          id: 2,
          category: "Confidentiality",
          severity: "low" as const,
          title: "Broad Confidentiality Terms",
          description:
            'The confidentiality obligations are overly broad and may be difficult to enforce, potentially creating false security about information protection. Extremely broad confidentiality clauses that cover "any information learned during employment" may be struck down by courts as unreasonable restraints on future employment. This leaves you without effective legal protection for truly confidential information like customer lists, pricing strategies, or proprietary processes. Additionally, overly broad clauses may discourage qualified candidates from accepting positions if they fear legal liability for using general industry knowledge. Courts generally uphold confidentiality agreements that specifically define what constitutes confidential information and have reasonable time limits.',
          recommendation:
            "Clarify scope of confidential information to focus on truly proprietary business information with specific examples.",
        },
      ],
      Customer: [
        {
          id: 1,
          category: "Service Level Agreement",
          severity: "high" as const,
          title: "Inadequate Uptime Guarantee",
          description:
            "The service level agreement specifies only 99% uptime, which translates to over 87 hours of potential downtime per year. For mission-critical business applications, this could mean significant revenue loss, damaged customer relationships, and operational disruptions. Industry standard for enterprise cloud services is 99.9% or higher. During outages, your business operations could be completely halted with no recourse except service credits that rarely cover actual business losses. The agreement also broadly defines planned maintenance windows that don't count against uptime, potentially adding days more downtime.",
          recommendation:
            "Negotiate for 99.9% uptime guarantee with meaningful service credits and limited maintenance windows.",
        },
        {
          id: 2,
          category: "Data Portability",
          severity: "medium" as const,
          title: "Limited Data Export Rights",
          description:
            "The contract provides insufficient guarantees for data export and migration assistance, creating potential vendor lock-in scenarios. Without clear data portability rights, you could become trapped with a provider even if service quality deteriorates or costs increase dramatically. The agreement may only provide data exports in proprietary formats that are difficult to migrate to other platforms. This limits your negotiating power in future renewals and could force you to accept unfavorable terms rather than face expensive migration costs. Industry best practice includes guaranteed data export in standard formats with reasonable transition assistance periods.",
          recommendation:
            "Secure explicit data portability rights with standard format exports and migration assistance guarantees.",
        },
        {
          id: 3,
          category: "Liability Limitations",
          severity: "high" as const,
          title: "Excessive Liability Caps",
          description:
            "The provider's liability is capped at monthly service fees, which could be as low as $100-500 per month while your potential losses from service failures could reach millions. This creates a massive imbalance where the provider has little financial incentive to maintain service quality. If a data breach or extended outage causes you to lose customers, face regulatory fines, or experience business disruption, you'll bear the full cost while the provider's exposure remains minimal. Enterprise contracts typically cap liability at 12-24 months of fees or actual damages, whichever is higher.",
          recommendation:
            "Negotiate liability caps that reflect actual business risk, typically 12-24 months of annual fees minimum.",
        },
      ],
      Provider: [
        {
          id: 1,
          category: "Acceptable Use Policy",
          severity: "medium" as const,
          title: "Vague Usage Restrictions",
          description:
            'The acceptable use policy contains broad, subjective language that could be interpreted to restrict legitimate business activities. Terms like "excessive use" or "unreasonable resource consumption" lack specific metrics, giving customers wide latitude to claim their usage is acceptable. This creates potential disputes over service termination and could lead to revenue loss if customers challenge usage-based billing. Without clear quantitative thresholds, you may struggle to enforce usage limits consistently, potentially facing legal challenges from customers who claim discriminatory treatment. Industry standard is to define specific resource limits and usage thresholds.',
          recommendation:
            "Define specific, measurable usage thresholds and resource limits to avoid disputes and ensure consistent enforcement.",
        },
        {
          id: 2,
          category: "Termination Rights",
          severity: "low" as const,
          title: "Limited Termination Flexibility",
          description:
            "The contract requires 90-day notice for termination, which could prevent you from quickly ending relationships with problematic customers who abuse services or fail to pay. This extended notice period also applies to significant service changes, limiting your ability to respond to market conditions or update terms for regulatory compliance. During the notice period, you must continue providing services to customers who may have already decided to leave, creating operational inefficiencies. Most service providers maintain 30-day termination rights to maintain operational flexibility while providing customers adequate transition time.",
          recommendation:
            "Negotiate 30-day termination notice to balance operational flexibility with customer transition needs.",
        },
      ],
      "Cloud Provider": [
        {
          id: 1,
          category: "Service Level Agreement",
          severity: "medium" as const,
          title: "Unrealistic Performance Guarantees",
          description:
            "The contract commits to 99.95% uptime across all service components, which may be technically challenging to achieve consistently and could expose you to significant service credit obligations. This level of guarantee typically requires redundant infrastructure investments that may not be cost-effective for your service tier. Additionally, the agreement lacks carve-outs for factors outside your control like customer configuration errors, third-party service failures, or force majeure events. If you fail to meet these guarantees, accumulated service credits could substantially impact revenue. Most cloud providers offer 99.9% for standard services and 99.95% only for premium enterprise tiers.",
          recommendation:
            "Align SLA guarantees with actual service infrastructure capabilities and include appropriate exclusions for external factors.",
        },
        {
          id: 2,
          category: "Data Processing",
          severity: "high" as const,
          title: "Broad Data Processing Rights",
          description:
            "The contract grants extremely broad rights to process customer data for service optimization, analytics, and business improvement purposes. This language could potentially allow you to use customer data for product development, competitive analysis, or sharing with third parties in ways that customers may not expect. With increasing data privacy regulations like GDPR and CCPA, these broad rights could expose you to regulatory penalties or customer lawsuits. The agreement also lacks clear data retention limits, potentially requiring you to store customer data indefinitely. Modern data processing agreements limit usage to specific operational purposes with clear retention schedules.",
          recommendation:
            "Limit data processing rights to operational necessities and implement clear data retention and deletion policies.",
        },
      ],
      "Service Provider": [
        {
          id: 1,
          category: "Scope of Work",
          severity: "high" as const,
          title: "Unlimited Scope Creep Risk",
          description:
            'The contract contains vague language around deliverables and scope boundaries, creating risk for unlimited additional work requests without additional compensation. Phrases like "and other related tasks" or "as reasonably requested" can be interpreted broadly by clients to demand work far beyond the original agreement. This uncertainty makes it difficult to estimate project profitability and resource allocation. Without clear change order processes, you may find yourself providing hundreds of hours of additional work for the same fee. Industry practice requires detailed scope definitions with explicit change management procedures and additional compensation for out-of-scope work.',
          recommendation:
            "Define precise scope boundaries with detailed deliverables and implement formal change order processes for additional work.",
        },
        {
          id: 2,
          category: "Payment Terms",
          severity: "medium" as const,
          title: "Extended Payment Terms",
          description:
            "The contract specifies Net 60 payment terms, which could create significant cash flow challenges for service providers, especially smaller firms. With industry standard being Net 30 or faster, the 60-day delay effectively makes you an unsecured lender to your client. This extended payment period can strain your ability to pay employees, vendors, and operating expenses. Additionally, the longer payment terms increase your risk of non-payment if the client experiences financial difficulties. Many service providers require partial upfront payments or milestone-based billing to mitigate cash flow risks.",
          recommendation:
            "Negotiate shorter payment terms (Net 30) or implement milestone-based billing with partial upfront payments.",
        },
      ],
      Client: [
        {
          id: 1,
          category: "Deliverable Quality",
          severity: "high" as const,
          title: "Weak Quality Assurance",
          description:
            "The contract lacks specific quality standards and acceptance criteria, leaving you vulnerable to receiving substandard work with limited recourse. Without detailed specifications for deliverables, testing procedures, and acceptance criteria, disputes over work quality become subjective and difficult to resolve. This could result in significant delays, additional costs for corrections, or complete project failure. The provider may deliver work that technically meets loose contract language but fails to meet your business needs. Industry best practice includes detailed quality metrics, testing procedures, and clear acceptance/rejection criteria with remedy provisions.",
          recommendation:
            "Establish detailed quality standards, acceptance criteria, and testing procedures with clear remedies for defective work.",
        },
        {
          id: 2,
          category: "Intellectual Property",
          severity: "medium" as const,
          title: "Unclear IP Ownership",
          description:
            "The intellectual property provisions are ambiguous about ownership of work product, custom developments, and derivative works created during the engagement. This uncertainty could leave you without clear rights to use, modify, or maintain systems and processes developed for your business. If the provider retains ownership or licensing rights, you may face ongoing licensing fees or be unable to modify the work to meet changing business needs. The agreement may also fail to address ownership of improvements to your existing IP or data. Standard client-favorable IP clauses assign all work product to the client with appropriate licenses for the provider's underlying tools.",
          recommendation:
            "Secure clear work product ownership rights with specific provisions for custom developments and derivative works.",
        },
      ],
      Consultant: [
        {
          id: 1,
          category: "Classification Risk",
          severity: "high" as const,
          title: "Employee Misclassification Exposure",
          description:
            "The contract contains language that could trigger IRS reclassification from independent contractor to employee, exposing you to significant tax liabilities and penalties. Terms requiring you to work specific hours, use client equipment, or follow detailed procedures indicate behavioral control that suggests employment rather than consulting. Misclassification could result in back payroll taxes, penalties, and interest charges potentially worth thousands of dollars. The IRS has increased enforcement of worker classification rules, with penalties including 1.5% of wages for federal income tax, 40% of FICA taxes, and additional penalties for failure to file employment forms.",
          recommendation:
            "Remove language suggesting behavioral control and ensure contract reflects true independent contractor relationship.",
        },
        {
          id: 2,
          category: "Liability Exposure",
          severity: "medium" as const,
          title: "Unlimited Professional Liability",
          description:
            "The contract imposes unlimited liability for professional errors and omissions, creating disproportionate risk relative to project fees. For a consulting engagement worth $50,000, you could face millions in damages if your recommendations lead to business losses or regulatory violations. This unlimited exposure makes it difficult to obtain appropriate professional liability insurance, as most policies include coverage limits. The risk is particularly acute for strategic consulting where business decisions based on your recommendations could have far-reaching consequences. Industry standard consulting agreements limit liability to project fees or insurance coverage limits.",
          recommendation:
            "Negotiate liability caps proportional to project fees and ensure adequate professional liability insurance coverage.",
        },
      ],
      Contractor: [
        {
          id: 1,
          category: "Payment Security",
          severity: "high" as const,
          title: "No Payment Protection",
          description:
            "The contract lacks payment security mechanisms like performance bonds, lien rights, or escrow accounts, leaving you vulnerable to non-payment on completed work. Without these protections, you could complete thousands of dollars of work and have no recourse if the client refuses to pay or experiences financial difficulties. The contract also lacks progress payment schedules, requiring you to finance the entire project until completion. For construction or large projects, this could represent significant cash flow risk. Industry practice includes milestone payments, mechanics lien rights, and performance bonds to protect contractor interests.",
          recommendation:
            "Implement progress payment schedules, preserve lien rights, and consider requiring performance bonds for large projects.",
        },
        {
          id: 2,
          category: "Scope Management",
          severity: "medium" as const,
          title: "Change Order Disputes",
          description:
            "The contract's change order process is vague and weighted toward the client, creating potential disputes over additional work authorization and pricing. Without clear procedures for documenting, approving, and pricing changes, you may perform additional work based on verbal instructions only to have payment disputed later. The agreement may also lack provisions for time extensions related to changes, putting you at risk for delay penalties even when delays are caused by client-requested modifications. This uncertainty makes project planning and pricing difficult, potentially leading to cost overruns or disputes that damage client relationships.",
          recommendation:
            "Establish clear change order procedures with written authorization requirements and automatic time extensions for approved changes.",
        },
      ],
      "Disclosing Party": [
        {
          id: 1,
          category: "Information Protection",
          severity: "high" as const,
          title: "Weak Confidentiality Obligations",
          description:
            'The confidentiality obligations lack specific enforcement mechanisms and may be too broad to be legally enforceable. Overly broad definitions of confidential information, such as "any information disclosed," may be struck down by courts as unreasonable restraints on trade. This leaves your most valuable trade secrets and proprietary information without adequate legal protection. The agreement also fails to specify return or destruction requirements for confidential materials, allowing the receiving party to retain copies indefinitely. Without clear remedies for breach, you may face expensive litigation with uncertain outcomes if confidentiality is violated.',
          recommendation:
            "Define specific confidentiality obligations with clear enforcement mechanisms and material return requirements.",
        },
        {
          id: 2,
          category: "Breach Remedies",
          severity: "medium" as const,
          title: "Inadequate Breach Remedies",
          description:
            "The contract lacks adequate remedies for confidentiality breaches, limiting your ability to respond effectively to violations. Without provisions for injunctive relief, you may be unable to prevent ongoing disclosure while pursuing legal remedies. The agreement may also lack liquidated damages provisions, requiring you to prove actual damages which can be difficult for confidential information. Given that confidentiality breaches can cause irreparable harm to competitive advantage, monetary damages alone may be insufficient. Industry standard NDAs include specific performance remedies and the right to seek immediate injunctive relief.",
          recommendation:
            "Include provisions for injunctive relief and liquidated damages to ensure adequate remedies for confidentiality breaches.",
        },
      ],
      "Receiving Party": [
        {
          id: 1,
          category: "Scope of Restrictions",
          severity: "medium" as const,
          title: "Overly Broad Confidentiality Scope",
          description:
            'The confidentiality restrictions are extremely broad and may prevent you from using general industry knowledge or skills acquired through normal business operations. Definitions that include "any information learned" could restrict your ability to work with competitors or in the same industry, effectively creating an unofficial non-compete agreement. This overreach may make the entire confidentiality agreement unenforceable while still exposing you to legal threats. The restrictions also lack reasonable time limits, potentially creating perpetual obligations that affect your career mobility. Courts typically require confidentiality agreements to be reasonable in scope and duration.',
          recommendation:
            "Negotiate narrower confidentiality scope limited to truly proprietary information with reasonable time limits.",
        },
        {
          id: 2,
          category: "Standard Exceptions",
          severity: "low" as const,
          title: "Missing Standard Exceptions",
          description:
            "The agreement lacks standard exceptions for publicly available information, independently developed knowledge, and information received from third parties without confidentiality obligations. Without these exceptions, you could be held liable for using information that becomes publicly known or that you develop independently. This creates unreasonable risk for information that should not be subject to confidentiality restrictions. The absence of these standard exceptions suggests the agreement may be one-sided and potentially unenforceable. Industry practice includes specific carve-outs for public information, independent development, and rightful third-party disclosures.",
          recommendation:
            "Ensure standard exceptions are included for public information, independent development, and rightful third-party disclosures.",
        },
      ],
      Licensee: [
        {
          id: 1,
          category: "License Scope",
          severity: "high" as const,
          title: "Restrictive Usage Rights",
          description:
            "The license grants extremely limited usage rights that may not support your intended business applications. Restrictions on the number of users, installations, or geographic locations could force you to purchase additional licenses as your business grows, significantly increasing costs. The agreement may also prohibit reasonable business activities like creating backups, integrating with other systems, or allowing contractors to access the software. These restrictions could limit your operational flexibility and force expensive license upgrades for normal business growth. Enterprise software licenses typically include broader usage rights appropriate for business operations.",
          recommendation:
            "Negotiate broader usage rights that accommodate business growth and normal operational requirements.",
        },
        {
          id: 2,
          category: "Maintenance and Support",
          severity: "medium" as const,
          title: "Limited Support Obligations",
          description:
            "The maintenance and support provisions provide minimal service levels that may be inadequate for business-critical applications. With only business-hours support and slow response times, system failures could cause extended business disruptions. The agreement may also limit support to certain types of issues while excluding assistance with configuration, integration, or user training. Additionally, maintenance updates may be optional or require additional fees, leaving you with outdated software that becomes increasingly vulnerable to security threats. Professional software licenses typically include comprehensive support and automatic updates.",
          recommendation:
            "Secure comprehensive support coverage with appropriate response times and inclusion of security updates.",
        },
      ],
      Licensor: [
        {
          id: 1,
          category: "License Compliance",
          severity: "high" as const,
          title: "Weak License Enforcement",
          description:
            "The license agreement lacks adequate enforcement mechanisms and audit rights, making it difficult to prevent unauthorized use or piracy. Without regular audit provisions, licensees may exceed authorized usage levels, install software on unauthorized systems, or share access with unauthorized users. This revenue leakage can be substantial, especially for enterprise software with per-user or per-device licensing models. The agreement also may lack clear termination procedures for license violations, allowing non-compliant users to continue using the software while disputing penalties. Strong license agreements include audit rights, usage monitoring, and clear violation consequences.",
          recommendation:
            "Implement audit rights, usage monitoring capabilities, and clear enforcement procedures for license violations.",
        },
        {
          id: 2,
          category: "Liability Limitations",
          severity: "medium" as const,
          title: "Insufficient Liability Protection",
          description:
            "The liability limitations may be inadequate to protect against potential damages from software defects, security vulnerabilities, or performance issues. Without comprehensive exclusions and damage caps, you could face significant liability if the software causes business disruptions, data loss, or security breaches. The agreement may also lack adequate indemnification provisions, leaving you exposed to third-party claims related to intellectual property infringement or privacy violations. Given that software defects can cause widespread damage, unlimited liability exposure could threaten business viability. Industry standard software licenses include comprehensive liability limitations and mutual indemnification provisions.",
          recommendation:
            "Strengthen liability limitations and indemnification provisions to protect against software-related risks.",
        },
      ],
    };
    mockRisks =
      defaultMockRisks[partyRole as keyof typeof defaultMockRisks] ||
      defaultMockRisks["Employee"];
  }

  return {
    summary: {
      totalRisks: mockRisks.length,
      highRisks: mockRisks.filter((r) => r.severity === "high").length,
      mediumRisks: mockRisks.filter((r) => r.severity === "medium").length,
      lowRisks: mockRisks.filter((r) => r.severity === "low").length,
      overallRiskLevel: mockRisks.some((r) => r.severity === "high")
        ? "high"
        : "medium",
    },
    risks: mockRisks,
    contractType,
    partyRole,
  };
}

// Calculate confidence level of the analysis
function calculateAnalysisConfidence(
  templateUsed: boolean,
  templateMatchScore: number,
  totalRisks: number,
): "high" | "medium" | "low" {
  // High confidence: Template used with good match and reasonable number of risks
  if (templateUsed && templateMatchScore >= 0.8 && totalRisks >= 5) {
    return "high";
  }

  // Medium confidence: Template used with decent match, or no template but good AI analysis
  if (
    (templateUsed && templateMatchScore >= 0.5) ||
    (!templateUsed && totalRisks >= 8)
  ) {
    return "medium";
  }

  // Low confidence: Poor template match or few risks identified
  return "low";
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting contract analysis...");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const contractType = formData.get("contractType") as string;
    const partyRole = formData.get("partyRole") as string;
    const extractedPartiesData = formData.get("extractedParties") as string;

    // Parse extracted parties if provided
    let extractedParties: { [role: string]: string } = {};
    if (extractedPartiesData) {
      try {
        extractedParties = JSON.parse(extractedPartiesData);
        console.log("Extracted parties:", extractedParties);
      } catch (e) {
        console.warn("Failed to parse extracted parties:", e);
      }
    }

    console.log(`Processing file: ${file?.name}, type: ${file?.type}`);
    console.log(`Contract Type: ${contractType}, Party Role: ${partyRole}`);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Extract text from the file
    let text;
    try {
      text = await extractTextFromFile(file);
      text = cleanExtractedText(text);

      if (!text || text.trim().length < 100) {
        throw new Error("Document appears to be empty or too short");
      }

      console.log(`Extracted ${text.length} characters from ${file.name}`);
    } catch (extractError) {
      console.error("Text extraction failed:", extractError);
      return NextResponse.json(
        {
          error: `Failed to read document: ${extractError instanceof Error ? extractError.message : "Unknown error"}`,
        },
        { status: 400 },
      );
    }

    const processedText = preprocessContract(text);

    // Check if we have an API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn("No Anthropic API key found, using mock analysis");
      const mockResult = await mockAnalyze(contractType, partyRole);
      return NextResponse.json({
        ...mockResult,
        contractText: text,
      });
    }

    try {
      // Check if a matching template exists
      const templateMatch = templateMatcher(contractType);
      const template = templateMatch ? templateMatch.template : null;

      console.log(
        `Template match for "${contractType}": ${templateMatch ? `Found (${templateMatch.matchType}, score: ${templateMatch.score})` : "Not found"}`,
      );

      // Run enhanced AI analysis with template awareness
      const analysis = await analyzeContractWithAI(
        processedText,
        contractType,
        partyRole,
        false, // includeClauseBreakdown
        extractedParties,
        template,
      );

      // Prepare analysis metadata
      const analysisMetadata = {
        templateUsed: !!template,
        templateMatchType: templateMatch?.matchType || "none",
        templateMatchScore: templateMatch?.score || 0,
        templateName: template?.contractType || null,
        riskBreakdown: {
          templateRisks: analysis.risks.filter((r) => r.source === "template")
            .length,
          aiRisks: analysis.risks.filter((r) => r.source === "ai_insight")
            .length,
          hybridRisks: analysis.risks.filter((r) => r.source === "hybrid")
            .length,
        },
        analysisConfidence: calculateAnalysisConfidence(
          !!template,
          templateMatch?.score || 0,
          analysis.risks.length,
        ),
      };

      return NextResponse.json({
        ...analysis,
        contractText: text,
        analysisMetadata,
      });
    } catch (aiError) {
      console.error("AI analysis failed, falling back to mock:", aiError);
      // Fallback to mock analysis if AI fails
      const mockResult = await mockAnalyze(contractType, partyRole);
      return NextResponse.json({
        ...mockResult,
        contractText: text,
        warning: "AI analysis unavailable, showing sample risks",
        analysisMetadata: {
          templateUsed: false,
          templateMatchType: "none",
          templateMatchScore: 0,
          templateName: null,
          riskBreakdown: {
            templateRisks: 0,
            aiRisks: mockResult.risks.length,
            hybridRisks: 0,
          },
          analysisConfidence: "low",
        },
      });
    }
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze contract" },
      { status: 500 },
    );
  }
}
