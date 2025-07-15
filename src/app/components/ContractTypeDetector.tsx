"use client";

import { useState, useEffect } from "react";

interface ContractSuggestion {
  type: string;
  confidence: number;
  description: string;
}

interface ContractTypeDetectorProps {
  contractFile: File;
  onTypeSelected: (contractType: string) => void;
}

export default function ContractTypeDetector({
  contractFile,
  onTypeSelected,
}: ContractTypeDetectorProps) {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<ContractSuggestion[]>([]);
  const [error, setError] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualType, setManualType] = useState("");

  useEffect(() => {
    detectContractType();
  }, [contractFile]);

  const detectContractType = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", contractFile);

      const response = await fetch("/api/detect-contract-type", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to detect contract type");
      }

      const result = await response.json();
      setSuggestions(result.suggestions);
    } catch (err) {
      setError("Failed to analyze contract type. Please select manually.");
      setShowManualInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (type: string) => {
    onTypeSelected(type);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualType.trim()) {
      onTypeSelected(manualType.trim());
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-orange-600";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High confidence";
    if (confidence >= 0.6) return "Medium confidence";
    return "Low confidence";
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Detecting Contract Type
        </h2>
        <p className="text-gray-600">
          Analyzing: <span className="font-medium">{contractFile.name}</span>
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">Analyzing contract content...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            We detected these possible contract types:
          </h3>
          <div className="space-y-3 mb-6">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.type)}
                className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-all border border-gray-200 hover:border-blue-500 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-lg group-hover:text-blue-600">
                      {suggestion.type}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <div
                      className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}
                    >
                      {Math.round(suggestion.confidence * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {getConfidenceLabel(suggestion.confidence)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowManualInput(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              None of these match? Enter manually
            </button>
          </div>
        </div>
      )}

      {showManualInput && (
        <div className="mt-6">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="manual-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter contract type manually
              </label>
              <input
                type="text"
                id="manual-type"
                value={manualType}
                onChange={(e) => setManualType(e.target.value)}
                placeholder="e.g., Distribution Agreement, Partnership Agreement"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!manualType.trim()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Continue with this type
              </button>
              {suggestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Back to suggestions
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
