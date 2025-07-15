"use client";

import { useState } from "react";

interface EmailGeneratorProps {
  contractType: string;
  partyRole: string;
  risks: Array<{
    title: string;
    severity: string;
    recommendation: string;
  }>;
}

export default function EmailGenerator({
  contractType,
  partyRole,
  risks,
}: EmailGeneratorProps) {
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  const highRisks = risks.filter((r) => r.severity === "high");
  const mediumRisks = risks.filter((r) => r.severity === "medium");

  const generateEmail = () => {
    const counterparty = getCounterparty(contractType, partyRole);

    return `Subject: Proposed Amendments to ${contractType}

Dear ${counterparty},

Thank you for sending the draft ${contractType}. I've had a chance to review it and would like to discuss a few points that need clarification or amendment.

${
  highRisks.length > 0
    ? `Priority Items Requiring Amendment:
${highRisks
  .map(
    (risk, index) => `
${index + 1}. ${risk.title}
   Proposed Change: ${risk.recommendation}`,
  )
  .join("\n")}
`
    : ""
}
${
  mediumRisks.length > 0
    ? `Additional Points for Discussion:
${mediumRisks
  .map(
    (risk, index) => `
${index + 1}. ${risk.title}
   Suggestion: ${risk.recommendation}`,
  )
  .join("\n")}
`
    : ""
}
I believe these changes will create a more balanced agreement that protects both parties' interests. I'm happy to discuss these points in more detail at your convenience.

Could we schedule a call this week to go through these items? I'm available [insert your availability].

Looking forward to finalizing an agreement that works well for both of us.

Best regards,
[Your Name]`;
  };

  const getCounterparty = (contractType: string, partyRole: string) => {
    const relationships: Record<string, Record<string, string>> = {
      "Employment Agreement": {
        Employee: "Hiring Manager",
        Employer: "Candidate",
      },
      "Service Agreement": {
        "Service Provider": "Client",
        Client: "Service Provider",
      },
      "Sales/Purchase Agreement": { Buyer: "Seller", Seller: "Buyer" },
      "Lease Agreement": { Tenant: "Landlord", Landlord: "Tenant" },
    };

    return relationships[contractType]?.[partyRole] || "Counterparty";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmail());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 border-t pt-6">
      <button
        onClick={() => setShowEmail(!showEmail)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        {showEmail ? "Hide" : "Generate"} Negotiation Email
      </button>

      {showEmail && (
        <div className="mt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-900">Email Template</h4>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                  copied
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-white p-4 rounded border border-gray-200 max-h-96 overflow-y-auto">
              {generateEmail()}
            </pre>
            <p className="text-xs text-gray-500 mt-3">
              Remember to personalize this template with your specific details
              and availability.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
