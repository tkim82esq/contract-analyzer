"use client";

import { useState } from "react";

const CONTRACT_TYPES = [
  {
    name: "Employment Agreement",
    parties: ["Employer", "Employee"],
  },
  {
    name: "Service Agreement",
    parties: ["Service Provider", "Client"],
  },
  {
    name: "SaaS Agreement",
    parties: ["Client", "Vendor"],
  },
  {
    name: "NDA",
    parties: ["Disclosing Party", "Receiving Party"],
  },
  {
    name: "Sales/Purchase Agreement",
    parties: ["Buyer", "Seller"],
  },
  {
    name: "Lease Agreement",
    parties: ["Landlord", "Tenant"],
  },
  {
    name: "Loan Agreement",
    parties: ["Lender", "Borrower"],
  },
  {
    name: "Independent Contractor Agreement",
    parties: ["Contractor", "Client"],
  },
  {
    name: "Consulting Agreement",
    parties: ["Consultant", "Client"],
  },
  {
    name: "Non-Compete Agreement",
    parties: ["Employee/Contractor", "Company"],
  },
  {
    name: "Severance Agreement",
    parties: ["Employee", "Employer"],
  },
  {
    name: "Offer Letter",
    parties: ["Candidate", "Company"],
  },
  {
    name: "Software as a Service (SaaS) Agreement",
    parties: ["Customer", "Provider"],
  },
  {
    name: "Software Licensing Agreement",
    parties: ["Licensee", "Licensor"],
  },
  {
    name: "End User License Agreement (EULA)",
    parties: ["End User", "Licensor"],
  },
  {
    name: "Terms of Service",
    parties: ["User", "Service Provider"],
  },
  {
    name: "Privacy Policy",
    parties: ["Data Subject", "Data Controller"],
  },
  {
    name: "Data Processing Agreement (DPA)",
    parties: ["Data Controller", "Data Processor"],
  },
  {
    name: "Cloud Services Agreement",
    parties: ["Customer", "Cloud Provider"],
  },
  {
    name: "API Usage Agreement",
    parties: ["API User/Developer", "API Provider"],
  },
  {
    name: "Website/Mobile App Development Agreement",
    parties: ["Client", "Developer"],
  },
  {
    name: "Software Maintenance and Support Agreement",
    parties: ["Customer", "Service Provider"],
  },
];

interface PartySelectorProps {
  contractType: string;
  onSelectionComplete: (party: string) => void;
}

export default function PartySelector({
  contractType,
  onSelectionComplete,
}: PartySelectorProps) {
  const handlePartySelect = (party: string) => {
    onSelectionComplete(party);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Which party are you in this {contractType}?
      </h2>
      <p className="text-gray-600 mb-6">
        This helps us analyze risks from your perspective
      </p>

      <div className="grid gap-3">
        {CONTRACT_TYPES.find((t) => t.name === contractType)?.parties.map(
          (party) => (
            <button
              key={party}
              onClick={() => handlePartySelect(party)}
              className="text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-500"
            >
              <span className="font-medium text-gray-900 text-lg">{party}</span>
              {party ===
                CONTRACT_TYPES.find((t) => t.name === contractType)
                  ?.parties[0] && (
                <p className="text-sm text-gray-500 mt-1">
                  Typically the party offering or providing something
                </p>
              )}
              {party ===
                CONTRACT_TYPES.find((t) => t.name === contractType)
                  ?.parties[1] && (
                <p className="text-sm text-gray-500 mt-1">
                  Typically the party receiving or purchasing something
                </p>
              )}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
