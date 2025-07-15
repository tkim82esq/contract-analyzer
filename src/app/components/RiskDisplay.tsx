"use client";

import { useState } from "react";
import ExportButton from "./ExportButton";
import EmailGenerator from "./EmailGenerator";
import ClauseBreakdown from "./ClauseBreakdown";

interface Risk {
  id: number;
  category: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
}

interface AnalysisResult {
  summary: {
    totalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    overallRiskLevel: string;
  };
  risks: Risk[];
  contractType: string;
  partyRole: string;
}

interface RiskDisplayProps {
  analysis: AnalysisResult;
  onStartOver: () => void;
  fileName?: string;
  contractText?: string;
}

export default function RiskDisplay({
  analysis,
  onStartOver,
  fileName = "contract",
  contractText = "",
}: RiskDisplayProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("");
  const [feedbackSeverity, setFeedbackSeverity] = useState<
    "high" | "medium" | "low"
  >("medium");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "medium":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/template-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractType: analysis.contractType,
          partyRole: analysis.partyRole,
          suggestedRisk: {
            category: feedbackCategory || "General",
            severity: feedbackSeverity,
            description: feedbackText,
          },
          existingRisksCount: analysis.risks.length,
        }),
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
        setTimeout(() => {
          setShowFeedback(false);
          setFeedbackSubmitted(false);
          setFeedbackText("");
          setFeedbackCategory("");
          setFeedbackSeverity("medium");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Risk Analysis Report
        </h2>

        {/* Contract Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Contract Type</p>
            <p className="font-semibold text-gray-900">
              {analysis.contractType}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Your Position</p>
            <p className="font-semibold text-gray-900">{analysis.partyRole}</p>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-900">
              {analysis.summary.totalRisks}
            </p>
            <p className="text-sm text-blue-700">Total Risks</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-900">
              {analysis.summary.highRisks}
            </p>
            <p className="text-sm text-red-700">High Risks</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-900">
              {analysis.summary.mediumRisks}
            </p>
            <p className="text-sm text-yellow-700">Medium Risks</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-900">
              {analysis.summary.lowRisks}
            </p>
            <p className="text-sm text-green-700">Low Risks</p>
          </div>
        </div>

        {/* Overall Risk Level */}
        <div
          className={`p-4 rounded-lg border ${
            analysis.summary.overallRiskLevel === "high"
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">
              Overall Risk Level:
            </span>
            <span
              className={`text-lg font-bold uppercase ${
                analysis.summary.overallRiskLevel === "high"
                  ? "text-red-700"
                  : "text-yellow-700"
              }`}
            >
              {analysis.summary.overallRiskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Risks */}
      <div className="space-y-6 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Identified Risks
        </h3>

        {analysis.risks.map((risk) => (
          <div
            key={risk.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div
              className={`p-6 border-l-4 ${
                risk.severity === "high"
                  ? "border-red-500"
                  : risk.severity === "medium"
                    ? "border-yellow-500"
                    : "border-green-500"
              }`}
            >
              {/* Risk Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-lg mr-3 flex-shrink-0 ${getSeverityColor(risk.severity)}`}
                  >
                    {getSeverityIcon(risk.severity)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 leading-tight">
                      {risk.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {risk.category}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full flex-shrink-0 ml-4 ${getSeverityColor(risk.severity)}`}
                >
                  {risk.severity.toUpperCase()}
                </span>
              </div>

              {/* Risk Details */}
              <div className="ml-11">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base mb-4 whitespace-pre-line">
                    {risk.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        {!showFeedback ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-700">Did we miss any important risks?</p>
            </div>
            <button
              onClick={() => setShowFeedback(true)}
              className="px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Add feedback
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbackSubmitted ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-green-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-green-700 font-medium">
                    Thank you for your feedback!
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your input helps us improve our analysis.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Suggest a missing risk
                  </h4>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="text-gray-500 hover:text-gray-700"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Category (optional)
                    </label>
                    <input
                      type="text"
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      placeholder="e.g., Payment Terms, Liability, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity
                    </label>
                    <select
                      value={feedbackSeverity}
                      onChange={(e) =>
                        setFeedbackSeverity(
                          e.target.value as "high" | "medium" | "low",
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe the risk we missed
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Please describe the risk or concern that should be included in the analysis..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleFeedbackSubmit}
                      disabled={!feedbackText.trim() || isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </button>
                    <button
                      onClick={() => {
                        setShowFeedback(false);
                        setFeedbackText("");
                        setFeedbackCategory("");
                        setFeedbackSeverity("medium");
                      }}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps</h3>
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">1.</span>
            <p className="text-gray-700">
              Review each identified risk carefully
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">2.</span>
            <p className="text-gray-700">
              Prioritize addressing high-severity risks
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">3.</span>
            <p className="text-gray-700">
              Consider consulting with a legal professional
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">4.</span>
            <p className="text-gray-700">
              Use recommendations as negotiation starting points
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <ExportButton
            contractType={analysis.contractType}
            partyRole={analysis.partyRole}
            fileName={fileName}
            analysisData={analysis}
          />
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Print Report
          </button>
          <button
            onClick={onStartOver}
            className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Analyze Another Contract
          </button>
        </div>

        <EmailGenerator
          contractType={analysis.contractType}
          partyRole={analysis.partyRole}
          risks={analysis.risks}
        />
      </div>

      {/* Clause-by-Clause Breakdown */}
      {contractText && (
        <ClauseBreakdown
          contractText={contractText}
          contractType={analysis.contractType}
          partyRole={analysis.partyRole}
          risks={analysis.risks}
        />
      )}
    </div>
  );
}
