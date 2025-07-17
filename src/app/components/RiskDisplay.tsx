"use client";

import { useState } from "react";
import ExportButton from "./ExportButton";
import EmailGenerator from "./EmailGenerator";
import RiskCard from "./RiskCard";
import RiskNoteDisplay from "../../components/RiskNote/RiskNoteDisplay";
import { RiskNoteGenerator } from "../../lib/risk-note-generator";
import DuplicateDebugButton from "./DuplicateDebugButton";

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
  extractedParties?: { [role: string]: string };
  analysisMetadata?: {
    processingTime: number;
    templateAnalysis: object;
  };
  debugData?: {
    mergingProcess?: {
      beforeMerging: {
        templateRisks: Risk[];
        generalRisks: Risk[];
        totalCount: number;
      };
      afterMerging: {
        finalRisks: Risk[];
        removedRisks: Risk[];
        addedRisks: Risk[];
        totalCount: number;
      };
    };
  };
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
}: RiskDisplayProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("");
  const [feedbackSeverity, setFeedbackSeverity] = useState<
    "high" | "medium" | "low"
  >("medium");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskNote, setRiskNote] = useState<object | null>(null);
  const [isGeneratingRiskNote, setIsGeneratingRiskNote] = useState(false);
  const [showDuplicateDebug, setShowDuplicateDebug] = useState(false);


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

  const generateRiskNote = async () => {
    setIsGeneratingRiskNote(true);
    try {
      const input = {
        risks: analysis.risks,
        contractType: analysis.contractType,
        partyRole: analysis.partyRole,
        extractedParties: analysis.extractedParties || {},
        contractName: fileName,
        analysisMetadata: analysis.analysisMetadata || {
          processingTime: Date.now(),
          templateAnalysis: {}
        }
      };
      
      const generatedNote = RiskNoteGenerator.generateRiskNote(input);
      setRiskNote(generatedNote);
    } catch (error) {
      console.error('Failed to generate risk note:', error);
    } finally {
      setIsGeneratingRiskNote(false);
    }
  };

  const handleExportRiskNote = (format: 'PDF' | 'EMAIL' | 'PRINT' | 'CLIPBOARD') => {
    // Implementation depends on the export functionality
    console.log('Exporting risk note as:', format);
  };

  // If showing risk note, render it directly
  if (riskNote) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setRiskNote(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Analysis
          </button>
        </div>
        
        <RiskNoteDisplay 
          riskNote={riskNote} 
          onExport={handleExportRiskNote}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Contract Info Header */}
      <div className="card">
        <div className="card-content">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Contract Type</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {analysis.contractType}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Your Position</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {analysis.partyRole}
              </p>
            </div>
          </div>

          {/* Risk Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {analysis.summary.totalRisks}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Risks</p>
            </div>
            <div className="text-center p-4 rounded-lg risk-indicator high">
              <p className="text-2xl font-bold">
                {analysis.summary.highRisks}
              </p>
              <p className="text-sm">High Risks</p>
            </div>
            <div className="text-center p-4 rounded-lg risk-indicator medium">
              <p className="text-2xl font-bold">
                {analysis.summary.mediumRisks}
              </p>
              <p className="text-sm">Medium Risks</p>
            </div>
            <div className="text-center p-4 rounded-lg risk-indicator low">
              <p className="text-2xl font-bold">
                {analysis.summary.lowRisks}
              </p>
              <p className="text-sm">Low Risks</p>
            </div>
          </div>
        </div>
      </div>


      {/* Risks Found Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Risks Found
        </h2>

        <div className="space-y-4">
          {analysis.risks.map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </div>

      {/* Professional Risk Note Section */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Professional Risk Note
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Generate a comprehensive business document for stakeholders
              </p>
            </div>
            <button
              onClick={generateRiskNote}
              disabled={isGeneratingRiskNote}
              className="btn-primary px-6 py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {isGeneratingRiskNote ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="card">
        <div className="card-content">
          <div className="flex gap-4">
            <ExportButton
              contractType={analysis.contractType}
              partyRole={analysis.partyRole}
              fileName={fileName}
              analysisData={analysis}
            />
            <button
              onClick={() => window.print()}
              className="btn-secondary flex-1 py-3 px-4 rounded-lg font-medium"
            >
              Print Report
            </button>
            <button
              onClick={onStartOver}
              className="btn-primary flex-1 py-3 px-4 rounded-lg font-medium"
            >
              Analyze Another Contract
            </button>
          </div>
        </div>
      </div>

      {/* Did we miss risks - moved to bottom */}
      <div className="card">
        <div className="card-content">
          {!showFeedback ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  style={{ color: 'var(--text-muted)' }}
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
                <p style={{ color: 'var(--text-secondary)' }}>Did we miss any important risks?</p>
              </div>
              <button
                onClick={() => setShowFeedback(true)}
                className="btn-secondary px-4 py-2 text-sm font-medium rounded-lg"
              >
                Add feedback
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackSubmitted ? (
                <div className="text-center py-4">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    style={{ color: 'var(--risk-low)' }}
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
                  <p className="font-medium" style={{ color: 'var(--risk-low)' }}>
                    Thank you for your feedback!
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Your input helps us improve our analysis.
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Help us improve our analysis
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    If you identified additional risks that our analysis missed, please share them below.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                        Risk Category
                      </label>
                      <input
                        type="text"
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        placeholder="e.g., Liability, Compliance"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{ 
                          borderColor: 'var(--border-light)',
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                        Severity Level
                      </label>
                      <select
                        value={feedbackSeverity}
                        onChange={(e) =>
                          setFeedbackSeverity(
                            e.target.value as "high" | "medium" | "low",
                          )
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{ 
                          borderColor: 'var(--border-light)',
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Risk Description
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Describe the risk you identified..."
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: 'var(--border-light)',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleFeedbackSubmit}
                      disabled={!feedbackText.trim() || isSubmitting}
                      className="btn-primary px-4 py-2 font-medium rounded-lg disabled:opacity-50"
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
                      className="btn-secondary px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <EmailGenerator
        contractType={analysis.contractType}
        partyRole={analysis.partyRole}
        risks={analysis.risks}
      />

      {/* Duplicate Debug Section - Subtle button at bottom */}
      {analysis.debugData && (
        <DuplicateDebugButton
          debugData={analysis.debugData}
          isVisible={showDuplicateDebug}
          onToggle={() => setShowDuplicateDebug(!showDuplicateDebug)}
        />
      )}
    </div>
  );
}
