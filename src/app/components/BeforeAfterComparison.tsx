"use client";

import React, { useState } from 'react';
import { Risk } from '@/types/debug';

interface BeforeAfterComparisonProps {
  templateRisks: Risk[];
  generalRisks: Risk[];
  finalRisks: Risk[];
  removedRisks: Risk[];
  onRestoreRisk?: (risk: Risk) => void;
}

export default function BeforeAfterComparison({ 
  templateRisks, 
  generalRisks, 
  finalRisks, 
  removedRisks,
  onRestoreRisk 
}: BeforeAfterComparisonProps) {
  const [selectedTab, setSelectedTab] = useState<'removed' | 'final'>('removed');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const beforeTotal = templateRisks.length + generalRisks.length;
  const afterTotal = finalRisks.length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case 'template': return 'bg-blue-100 text-blue-800';
      case 'ai_insight': return 'bg-purple-100 text-purple-800';
      case 'hybrid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const RiskCard = ({ risk, isRemoved = false }: { risk: Risk; isRemoved?: boolean }) => (
    <div className={`border rounded-lg p-4 ${isRemoved ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 mb-1">{risk.title}</h4>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded font-medium border ${getSeverityColor(risk.severity)}`}>
              {risk.severity.toUpperCase()}
            </span>
            <span className="text-sm text-gray-600">{risk.category}</span>
            {risk.source && (
              <span className={`px-2 py-1 text-xs rounded font-medium ${getSourceColor(risk.source)}`}>
                {risk.source}
              </span>
            )}
          </div>
        </div>
        {isRemoved && onRestoreRisk && (
          <button 
            onClick={() => onRestoreRisk(risk)}
            className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            Restore
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3">{risk.description}</p>

      <button 
        onClick={() => setShowDetails(showDetails === `${risk.id}-${isRemoved}` ? null : `${risk.id}-${isRemoved}`)}
        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        {showDetails === `${risk.id}-${isRemoved}` ? 'Hide Details' : 'Show Details'}
      </button>

      {showDetails === `${risk.id}-${isRemoved}` && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">ID:</span> {risk.id}
            </div>
            {risk.recommendation && (
              <div>
                <span className="font-medium text-gray-700">Recommendation:</span>
                <p className="text-gray-600 mt-1">{risk.recommendation}</p>
              </div>
            )}
            {risk.templateReference && (
              <div>
                <span className="font-medium text-gray-700">Template Reference:</span> {risk.templateReference}
              </div>
            )}
            {risk.processingNotes && risk.processingNotes.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Processing Notes:</span>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  {risk.processingNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="before-after-comparison space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Before Merging</h3>
          <div className="space-y-1 text-sm">
            <div>Template Risks: <span className="font-bold">{templateRisks.length}</span></div>
            <div>AI Risks: <span className="font-bold">{generalRisks.length}</span></div>
            <div className="border-t pt-1">
              <div className="text-xl font-bold text-blue-600">Total: {beforeTotal}</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2">→</div>
            <div className="text-sm text-yellow-700">Merging Process</div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">After Merging</h3>
          <div className="space-y-1 text-sm">
            <div>Final Displayed: <span className="font-bold">{afterTotal}</span></div>
            <div>Removed: <span className="font-bold text-red-600">{removedRisks.length}</span></div>
            <div className="border-t pt-1">
              <div className="text-xl font-bold text-green-600">
                Result: {afterTotal}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loss Analysis */}
      {removedRisks.length > 0 && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">⚠️ Potential Data Loss</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Risks Lost:</span> {removedRisks.length} out of {beforeTotal} ({((removedRisks.length / beforeTotal) * 100).toFixed(1)}%)
            </div>
            <div>
              <span className="font-medium">High Severity Lost:</span> {removedRisks.filter(r => r.severity === 'high').length}
            </div>
            <div>
              <span className="font-medium">Categories Affected:</span> {[...new Set(removedRisks.map(r => r.category))].length}
            </div>
          </div>
        </div>
      )}

      {/* Detailed View Tabs */}
      <div>
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('removed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'removed'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Removed Risks ({removedRisks.length})
            </button>
            <button
              onClick={() => setSelectedTab('final')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'final'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Final Risks ({finalRisks.length})
            </button>
          </nav>
        </div>

        {selectedTab === 'removed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-red-800">
                Risks Removed as Duplicates
              </h3>
              {onRestoreRisk && (
                <p className="text-sm text-gray-600">
                  Click "Restore" to manually override the duplicate detection
                </p>
              )}
            </div>
            
            {removedRisks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No risks were removed as duplicates
              </div>
            ) : (
              <div className="space-y-4">
                {removedRisks.map((risk) => (
                  <RiskCard key={`removed-${risk.id}`} risk={risk} isRemoved={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTab === 'final' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">
              Final Risks Displayed to User
            </h3>
            
            <div className="space-y-4">
              {finalRisks.map((risk) => (
                <RiskCard key={`final-${risk.id}`} risk={risk} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Analysis */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Category Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Before Merging</h4>
            <div className="space-y-1 text-sm">
              {Object.entries([...templateRisks, ...generalRisks].reduce((acc, risk) => {
                acc[risk.category] = (acc[risk.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)).map(([category, count]) => (
                <div key={category} className="flex justify-between">
                  <span>{category}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">After Merging</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(finalRisks.reduce((acc, risk) => {
                acc[risk.category] = (acc[risk.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)).map(([category, count]) => (
                <div key={category} className="flex justify-between">
                  <span>{category}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}