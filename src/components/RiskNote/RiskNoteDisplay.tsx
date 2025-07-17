"use client";

import React, { useState } from 'react';
import { RiskNote } from '@/types/risk-note';
import { 
  DocumentTextIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface RiskNoteDisplayProps {
  riskNote: RiskNote;
  onExport: (format: 'PDF' | 'EMAIL' | 'PRINT' | 'CLIPBOARD') => void;
}

export default function RiskNoteDisplay({ riskNote, onExport }: RiskNoteDisplayProps) {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'negotiation'>('overview');

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'important': return 'text-yellow-700 bg-yellow-100';
      case 'moderate': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };


  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Risk Note Re {riskNote.metadata.contractName || 'Contract'}</h1>
            <p className="text-blue-100">Generated: {riskNote.metadata.analysisDate}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onExport('PDF')}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
            >
              Export PDF
            </button>
            <button 
              onClick={() => onExport('EMAIL')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition-colors"
            >
              Email
            </button>
            <button 
              onClick={() => onExport('PRINT')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition-colors"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <DocumentTextIcon className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Executive Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Contract</div>
            <div className="font-semibold text-gray-800">{riskNote.metadata.contractType}</div>
            <div className="text-sm text-gray-600 mt-1">{riskNote.metadata.contractName}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Your Role</div>
            <div className="font-semibold text-gray-800">{riskNote.metadata.yourRole}</div>
            <div className="text-sm text-gray-600 mt-1">{riskNote.metadata.yourOrganization}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Counterparty</div>
            <div className="font-semibold text-gray-800">{riskNote.metadata.counterparty}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg border-2 ${getRiskLevelColor(riskNote.executiveSummary.overallRiskLevel)}`}>
            <div className="flex items-center mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              <span className="font-semibold">Overall Risk Level: {riskNote.executiveSummary.overallRiskLevel}</span>
            </div>
            <div className="text-sm mb-2">
              <strong>Recommended Action:</strong> {riskNote.executiveSummary.recommendedAction.replace(/_/g, ' ')}
            </div>
            <div className="text-sm">
              <strong>Confidence Score:</strong> {Math.round(riskNote.executiveSummary.confidenceScore * 100)}%
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-800 mb-2">Key Message</div>
            <p className="text-blue-700">{riskNote.executiveSummary.keyMessage}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Risk Overview', icon: ChartBarIcon },
            { id: 'details', label: 'Detailed Analysis', icon: DocumentTextIcon },
            { id: 'negotiation', label: 'Negotiation Priorities', icon: UserGroupIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'details' | 'negotiation')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Risk Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="text-red-700 font-semibold">High Risk</div>
                    <div className="text-2xl font-bold text-red-600">{riskNote.riskOverview.breakdown.high}</div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="text-yellow-700 font-semibold">Medium Risk</div>
                    <div className="text-2xl font-bold text-yellow-600">{riskNote.riskOverview.breakdown.medium}</div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="text-green-700 font-semibold">Low Risk</div>
                    <div className="text-2xl font-bold text-green-600">{riskNote.riskOverview.breakdown.low}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Concerns */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Concerns</h3>
              <div className="space-y-2">
                {riskNote.riskOverview.topConcerns.map((concern, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div className="text-gray-800">{concern}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(riskNote.riskOverview.riskCategories).map(([category, count]) => (
                  <div key={category} className="bg-white border border-gray-200 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">{category}</div>
                    <div className="text-lg font-semibold text-gray-800">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Protections */}
            {riskNote.missingProtections.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Missing Protections</h3>
                <div className="space-y-3">
                  {riskNote.missingProtections.map((protection, index) => (
                    <div key={index} className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-orange-800">{protection.protection}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          protection.importance === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          protection.importance === 'IMPORTANT' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {protection.importance}
                        </span>
                      </div>
                      <p className="text-sm text-orange-700 mb-2">{protection.businessRationale}</p>
                      <div className="text-xs text-orange-600">
                        <strong>Suggested Language:</strong> {protection.suggestedLanguage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Risk Analysis</h3>
            {riskNote.detailedRisks.map((risk) => (
              <div key={risk.id} className="border border-gray-200 rounded-lg">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedRisk(expandedRisk === risk.id ? null : risk.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${getRiskLevelColor(risk.impactLevel)}`}>
                        {risk.impactLevel}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getUrgencyColor(risk.urgency)}`}>
                        {risk.urgency}
                      </span>
                      <h4 className="font-medium text-gray-800">{risk.title}</h4>
                    </div>
                    <ArrowRightIcon className={`h-5 w-5 text-gray-400 transition-transform ${
                      expandedRisk === risk.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
                
                {expandedRisk === risk.id && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Business Impact</h5>
                        <p className="text-sm text-gray-600">{risk.businessImpact}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Recommended Action</h5>
                        <p className="text-sm text-gray-600">{risk.recommendedAction}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Contract Reference</h5>
                        <p className="text-sm text-gray-600">{risk.contractReference}</p>
                      </div>
                      {risk.financialImpact && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Financial Impact</h5>
                          <p className="text-sm text-gray-600">{risk.financialImpact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'negotiation' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Negotiation Priorities</h3>
            
            {/* Must Have */}
            <div>
              <h4 className="font-medium text-red-700 mb-3 flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                Must Have ({riskNote.negotiationPriorities.mustHave.length})
              </h4>
              <div className="space-y-3">
                {riskNote.negotiationPriorities.mustHave.map((item, index) => (
                  <div key={index} className="border border-red-200 bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-red-800">{item.item}</h5>
                      {item.dealBreaker && (
                        <span className="px-2 py-1 text-xs bg-red-200 text-red-700 rounded">
                          Deal Breaker
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-red-700">{item.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Should Have */}
            <div>
              <h4 className="font-medium text-yellow-700 mb-3 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Should Have ({riskNote.negotiationPriorities.shouldHave.length})
              </h4>
              <div className="space-y-3">
                {riskNote.negotiationPriorities.shouldHave.map((item, index) => (
                  <div key={index} className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-yellow-800">{item.item}</h5>
                      <span className={`px-2 py-1 text-xs rounded ${
                        item.negotiatingPower === 'HIGH' ? 'bg-green-100 text-green-700' :
                        item.negotiatingPower === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.negotiatingPower} Power
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">{item.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nice to Have */}
            <div>
              <h4 className="font-medium text-green-700 mb-3 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Nice to Have ({riskNote.negotiationPriorities.niceToHave.length})
              </h4>
              <div className="space-y-3">
                {riskNote.negotiationPriorities.niceToHave.map((item, index) => (
                  <div key={index} className="border border-green-200 bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">{item.item}</h5>
                    <p className="text-sm text-green-700">{item.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Generated by Contract Analyzer v{riskNote.metadata.analyzerVersion} in {riskNote.metadata.processingTime}ms
          </div>
          <button 
            onClick={() => onExport('CLIPBOARD')}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          <strong>Disclaimer:</strong> {riskNote.disclaimer}
        </div>
      </div>
    </div>
  );
}