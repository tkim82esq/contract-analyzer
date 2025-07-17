"use client";

import React, { useState } from 'react';
import { RiskNote, RiskNoteGenerationInput } from '@/types/risk-note';
import { RiskNoteGenerator } from '@/lib/risk-note-generator';
import RiskNoteDisplay from './RiskNoteDisplay';
import RiskNoteExport from './RiskNoteExport';
import { 
  DocumentTextIcon, 
  SparklesIcon, 
  ArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface RiskNoteGeneratorProps {
  analysisData: {
    risks: Array<{
      id: number;
      category: string;
      severity: "high" | "medium" | "low";
      title: string;
      description: string;
      recommendation: string;
      mitigation?: {
        action: "add" | "modify" | "remove";
        targetClause: string;
        suggestedText: string;
        explanation: string;
      };
      clauseLocation?: string;
      relatedText?: string;
    }>;
    contractType: string;
    partyRole: string;
    extractedParties: { [role: string]: string };
    contractName: string;
    analysisMetadata: {
      processingTime: number;
      templateAnalysis: any;
    };
  };
}

export default function RiskNoteGeneratorComponent({ analysisData }: RiskNoteGeneratorProps) {
  const [riskNote, setRiskNote] = useState<RiskNote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRiskNote = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const input: RiskNoteGenerationInput = {
        risks: analysisData.risks,
        contractType: analysisData.contractType,
        partyRole: analysisData.partyRole,
        extractedParties: analysisData.extractedParties,
        contractName: analysisData.contractName,
        analysisMetadata: analysisData.analysisMetadata
      };
      
      const generatedNote = RiskNoteGenerator.generateRiskNote(input);
      setRiskNote(generatedNote);
    } catch (err) {
      setError('Failed to generate risk note. Please try again.');
      console.error('Risk note generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: 'PDF' | 'EMAIL' | 'PRINT' | 'CLIPBOARD') => {
    setShowExport(true);
    // The RiskNoteExport component will handle the actual export
  };

  const getRiskLevelColor = (count: number) => {
    if (count >= 3) return 'text-red-600';
    if (count >= 1) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOverallRiskIndicator = () => {
    const highRisks = analysisData.risks.filter(r => r.severity === 'high').length;
    const mediumRisks = analysisData.risks.filter(r => r.severity === 'medium').length;
    
    if (highRisks >= 3) return { level: 'HIGH', color: 'text-red-600', icon: ExclamationTriangleIcon };
    if (highRisks >= 1 || mediumRisks >= 3) return { level: 'MEDIUM', color: 'text-yellow-600', icon: ExclamationTriangleIcon };
    return { level: 'LOW', color: 'text-green-600', icon: CheckCircleIcon };
  };

  if (riskNote) {
    return (
      <div className="space-y-6">
        <RiskNoteDisplay 
          riskNote={riskNote} 
          onExport={handleExport}
        />
        
        {showExport && (
          <RiskNoteExport 
            riskNote={riskNote}
            onClose={() => setShowExport(false)}
          />
        )}
      </div>
    );
  }

  const overallRisk = getOverallRiskIndicator();
  const IconComponent = overallRisk.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Risk Note Generator Card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Generate Professional Risk Note</h2>
              <p className="text-blue-100 mt-1">Transform your analysis into a business-ready document</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Analysis Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Contract Details</div>
                <div className="font-medium text-gray-800">{analysisData.contractType}</div>
                <div className="text-sm text-gray-600">{analysisData.contractName}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Your Role</div>
                <div className="font-medium text-gray-800">{analysisData.partyRole}</div>
                <div className="text-sm text-gray-600">
                  {analysisData.extractedParties[analysisData.partyRole] || 'Your Organization'}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Total Risks</div>
                  <div className="text-2xl font-bold text-gray-800">{analysisData.risks.length}</div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-red-700">High Risk</div>
                  <div className={`text-2xl font-bold ${getRiskLevelColor(analysisData.risks.filter(r => r.severity === 'high').length)}`}>
                    {analysisData.risks.filter(r => r.severity === 'high').length}
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-yellow-700">Medium Risk</div>
                  <div className={`text-2xl font-bold ${getRiskLevelColor(analysisData.risks.filter(r => r.severity === 'medium').length)}`}>
                    {analysisData.risks.filter(r => r.severity === 'medium').length}
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-700">Low Risk</div>
                  <div className={`text-2xl font-bold ${getRiskLevelColor(analysisData.risks.filter(r => r.severity === 'low').length)}`}>
                    {analysisData.risks.filter(r => r.severity === 'low').length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Risk Assessment */}
          <div className="mb-6">
            <div className={`p-4 rounded-lg border-2 ${
              overallRisk.level === 'HIGH' ? 'bg-red-50 border-red-200' :
              overallRisk.level === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center">
                <IconComponent className={`h-6 w-6 mr-3 ${overallRisk.color}`} />
                <div>
                  <div className={`font-semibold ${overallRisk.color}`}>
                    Overall Risk Level: {overallRisk.level}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Based on {analysisData.risks.length} identified risk{analysisData.risks.length !== 1 ? 's' : ''} in your contract analysis
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What You'll Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Executive Summary</div>
                    <div className="text-sm text-gray-600">High-level overview with key recommendations</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Business Impact Analysis</div>
                    <div className="text-sm text-gray-600">Risks translated into business language</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Missing Protections</div>
                    <div className="text-sm text-gray-600">Critical clauses to negotiate</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Negotiation Priorities</div>
                    <div className="text-sm text-gray-600">Must-have vs nice-to-have items</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Action Plan</div>
                    <div className="text-sm text-gray-600">Timeline-based next steps</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Export Options</div>
                    <div className="text-sm text-gray-600">PDF, email, and print formats</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <div className="text-red-700">{error}</div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateRiskNote}
              disabled={isGenerating}
              className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
                isGenerating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating Professional Risk Note...
                </>
              ) : (
                <>
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Generate Professional Risk Note
                </>
              )}
            </button>
            
            {!isGenerating && (
              <div className="mt-2 text-sm text-gray-600">
                This will create a comprehensive business document suitable for stakeholder review
              </div>
            )}
          </div>

          {/* Processing Info */}
          {isGenerating && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <div>
                  <div className="font-medium text-blue-800">Processing Your Analysis</div>
                  <div className="text-sm text-blue-600 mt-1">
                    Converting technical analysis to business language and generating actionable recommendations...
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}