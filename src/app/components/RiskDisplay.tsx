'use client';

import ExportButton from './ExportButton';
import EmailGenerator from './EmailGenerator';
import ClauseBreakdown from './ClauseBreakdown';

interface Risk {
  id: number;
  category: string;
  severity: 'high' | 'medium' | 'low';
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

export default function RiskDisplay({ analysis, onStartOver, fileName = 'contract', contractText = '' }: RiskDisplayProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Risk Analysis Report
        </h2>
        
        {/* Contract Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Contract Type</p>
            <p className="font-semibold text-gray-900">{analysis.contractType}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Your Position</p>
            <p className="font-semibold text-gray-900">{analysis.partyRole}</p>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-900">{analysis.summary.totalRisks}</p>
            <p className="text-sm text-blue-700">Total Risks</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-900">{analysis.summary.highRisks}</p>
            <p className="text-sm text-red-700">High Risks</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-900">{analysis.summary.mediumRisks}</p>
            <p className="text-sm text-yellow-700">Medium Risks</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-900">{analysis.summary.lowRisks}</p>
            <p className="text-sm text-green-700">Low Risks</p>
          </div>
        </div>

        {/* Overall Risk Level */}
        <div className={`p-4 rounded-lg border ${
          analysis.summary.overallRiskLevel === 'high' 
            ? 'bg-red-50 border-red-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">Overall Risk Level:</span>
            <span className={`text-lg font-bold uppercase ${
              analysis.summary.overallRiskLevel === 'high' ? 'text-red-700' : 'text-yellow-700'
            }`}>
              {analysis.summary.overallRiskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Risks */}
      <div className="space-y-4 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Identified Risks</h3>
        
        {analysis.risks.map((risk) => (
          <div key={risk.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`p-6 border-l-4 ${
              risk.severity === 'high' ? 'border-red-500' :
              risk.severity === 'medium' ? 'border-yellow-500' : 'border-green-500'
            }`}>
              {/* Risk Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg mr-3 ${getSeverityColor(risk.severity)}`}>
                    {getSeverityIcon(risk.severity)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{risk.title}</h4>
                    <p className="text-sm text-gray-600">{risk.category}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSeverityColor(risk.severity)}`}>
                  {risk.severity.toUpperCase()}
                </span>
              </div>
              
              {/* Risk Details */}
              <div className="ml-11">
                <p className="text-gray-700 mb-3">{risk.description}</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Recommendation:</p>
                  <p className="text-sm text-blue-800">{risk.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps</h3>
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">1.</span>
            <p className="text-gray-700">Review each identified risk carefully</p>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">2.</span>
            <p className="text-gray-700">Prioritize addressing high-severity risks</p>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">3.</span>
            <p className="text-gray-700">Consider consulting with a legal professional</p>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">4.</span>
            <p className="text-gray-700">Use recommendations as negotiation starting points</p>
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