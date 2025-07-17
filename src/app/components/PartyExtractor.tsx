"use client";

import { useState, useEffect } from "react";
import { CONTRACT_TEMPLATES } from "@/lib/contract-templates";

interface ExtractedParty {
  name: string;
  role: string;
  confidence: number;
}

interface PartyExtractorProps {
  contractFile: File;
  contractType: string;
  onPartiesSelected: (
    selectedParty: string,
    parties: { [role: string]: string },
  ) => void;
}

export default function PartyExtractor({
  contractFile,
  contractType,
  onPartiesSelected,
}: PartyExtractorProps) {
  const [loading, setLoading] = useState(true);
  const [extractedParties, setExtractedParties] = useState<ExtractedParty[]>(
    [],
  );
  const [partyMappings, setPartyMappings] = useState<{
    [role: string]: string;
  }>({});
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  // Get party roles for the contract type
  const getPartyRoles = () => {
    // First try CONTRACT_TEMPLATES
    const template = CONTRACT_TEMPLATES[contractType];
    if (template && template.partySpecificConcerns) {
      return Object.keys(template.partySpecificConcerns);
    }

    // Fallback to common patterns
    const rolePatterns: { [key: string]: string[] } = {
      "Employment Agreement": ["Employer", "Employee"],
      "Service Agreement": ["Service Provider", "Client"],
      "Software as a Service (SaaS) Agreement": ["Provider", "Customer"],
      NDA: ["Disclosing Party", "Receiving Party"],
      "Sales/Purchase Agreement": ["Seller", "Buyer"],
      "Lease Agreement": ["Landlord", "Tenant"],
      "Loan Agreement": ["Lender", "Borrower"],
      "Independent Contractor Agreement": ["Contractor", "Client"],
      "Consulting Agreement": ["Consultant", "Client"],
    };

    return rolePatterns[contractType] || ["Party A", "Party B"];
  };

  const partyRoles = getPartyRoles();

  useEffect(() => {
    extractParties();
  }, [contractFile, contractType]);

  const extractParties = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", contractFile);
      formData.append("contractType", contractType);

      const response = await fetch("/api/extract-parties", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract parties");
      }

      const result = await response.json();
      setExtractedParties(result.parties || []);

      // Auto-map parties if high confidence
      const autoMappings: { [role: string]: string } = {};
      result.parties.forEach((party: ExtractedParty) => {
        if (party.confidence > 0.8 && partyRoles.includes(party.role)) {
          autoMappings[party.role] = party.name;
        }
      });
      setPartyMappings(autoMappings);
    } catch (err) {
      setError("Failed to extract party names. Please enter them manually.");
      setShowManualInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePartyMapping = (role: string, partyName: string) => {
    setPartyMappings((prev) => ({
      ...prev,
      [role]: partyName,
    }));
  };

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (
      selectedRole &&
      Object.keys(partyMappings).length >= partyRoles.length
    ) {
      onPartiesSelected(selectedRole, partyMappings);
    }
  };

  const allPartiesMapped = partyRoles.every((role) => partyMappings[role]);
  const canContinue = selectedRole && allPartiesMapped;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Identify Parties in {contractType}
        </h2>
        <p className="text-gray-600">
          We'll extract the party names and you select which role you represent
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">
            Extracting party names from contract...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !showManualInput && extractedParties.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Map extracted names to party roles:
            </h3>
            <div className="space-y-4">
              {partyRoles.map((role) => (
                <div
                  key={role}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {role}
                  </label>
                  <select
                    value={partyMappings[role] || ""}
                    onChange={(e) => handlePartyMapping(role, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    <option value="">Select {role}...</option>
                    {extractedParties.map((party, idx) => (
                      <option key={idx} value={party.name}>
                        {party.name}
                        {party.confidence > 0.7 &&
                          party.role === role &&
                          " (likely match)"}
                      </option>
                    ))}
                    <option value="manual">Enter manually...</option>
                  </select>
                  {partyMappings[role] === "manual" && (
                    <input
                      type="text"
                      placeholder={`Enter ${role} name`}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                      onChange={(e) => handlePartyMapping(role, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {allPartiesMapped && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Which party do you represent?
              </h3>
              <div className="grid gap-3">
                {partyRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelection(role)}
                    className={`text-left p-4 rounded-lg border transition-all ${
                      selectedRole === role
                        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{role}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {partyMappings[role]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Continue as {selectedRole || "..."}
            </button>
            <button
              onClick={() => setShowManualInput(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Enter manually
            </button>
          </div>
        </div>
      )}

      {(showManualInput || (!loading && extractedParties.length === 0)) && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Enter party names manually:
            </h3>
            <div className="space-y-4">
              {partyRoles.map((role) => (
                <div key={role}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {role} Name
                  </label>
                  <input
                    type="text"
                    value={partyMappings[role] || ""}
                    onChange={(e) => handlePartyMapping(role, e.target.value)}
                    placeholder={`e.g., ${role === "Employer" ? "ABC Corporation" : role === "Employee" ? "John Smith" : `${role} Name`}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {allPartiesMapped && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Which party do you represent?
              </h3>
              <div className="grid gap-3">
                {partyRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelection(role)}
                    className={`text-left p-4 rounded-lg border transition-all ${
                      selectedRole === role
                        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{role}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {partyMappings[role]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {canContinue
              ? `Continue as ${selectedRole}`
              : "Please fill all party names and select your role"}
          </button>

          {extractedParties.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => setShowManualInput(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back to extracted parties
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
