'use client';

import { useState, useEffect } from 'react';
import { Clause } from '@/lib/ai-analyzer';

interface ClauseBreakdownProps {
  contractText: string;
  contractType: string;
  partyRole: string;
  risks: Array<{
    id: number;
    title: string;
    severity: string;
    clauseLocation?: string;
  }>;
}

export default function ClauseBreakdown({ 
  contractText, 
  contractType, 
  partyRole,
  risks 
}: ClauseBreakdownProps) {
  const [loading, setLoading] = useState(false);
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [selectedClause, setSelectedClause] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const loadClauseAnalysis = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/analyze-clauses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractText,
          contractType,
          partyRole
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(`Failed to analyze clauses: ${response.status} ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      setClauses(data.clauses);
      setShowBreakdown(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to analyze clauses: ${errorMessage}`);
      console.error('Clause analysis error:', err);
      console.error('Contract text length:', contractText?.length || 0);
      console.error('Contract text preview:', contractText?.substring(0, 200) || 'No text');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="mt-8 border-t pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Clause-by-Clause Analysis</h3>
        {!showBreakdown && (
          <button
            onClick={loadClauseAnalysis}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing Clauses...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Analyze Each Clause
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showBreakdown && clauses.length > 0 && (
        <div className="space-y-6">
          {/* Clause Navigation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Contract Sections</h4>
            <div className="flex flex-wrap gap-2">
              {clauses.map((clause) => (
                <button
                  key={clause.id}
                  onClick={() => setSelectedClause(clause.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedClause === clause.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {clause.section}: {clause.title}
                  {clause.risks.length > 0 && (
                    <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
                      clause.risks.some(r => r.severity === 'high') ? 'bg-red-500' :
                      clause.risks.some(r => r.severity === 'medium') ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Clause Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Clause List */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Contract Clauses</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {clauses.map((clause) => (
                  <div
                    key={clause.id}
                    onClick={() => setSelectedClause(clause.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedClause === clause.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">{clause.section}</span>
                        <h5 className="font-semibold text-gray-900">{clause.title}</h5>
                      </div>
                      {clause.risks.length > 0 && (
                        <div className="flex gap-1">
                          {clause.risks.map((risk, idx) => (
                            <span
                              key={idx}
                              className={`w-2 h-2 rounded-full ${getSeverityDot(risk.severity)}`}
                              title={`${risk.severity} risk`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{clause.text}</p>
                    {clause.risks.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {clause.risks.length} risk{clause.risks.length > 1 ? 's' : ''} identified
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Selected Clause Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {selectedClause ? (
                <>
                  {clauses.filter(c => c.id === selectedClause).map((clause) => (
                    <div key={clause.id}>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500">{clause.section}</span>
                        <h4 className="text-xl font-semibold text-gray-900 mt-1">{clause.title}</h4>
                      </div>

                      {/* Clause Text */}
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-700 mb-2">Clause Text:</h5>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{clause.text}</p>
                        </div>
                      </div>

                      {/* Analysis */}
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-700 mb-2">What This Means for You:</h5>
                        <p className="text-gray-700">{clause.analysis}</p>
                      </div>

                      {/* Risks */}
                      {clause.risks.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-3">Identified Risks:</h5>
                          <div className="space-y-2">
                            {clause.risks.map((risk, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border ${getSeverityColor(risk.severity)}`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-medium uppercase`}>
                                    {risk.severity} risk
                                  </span>
                                </div>
                                <p className="text-sm">{risk.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Risks from Main Analysis */}
                      {risks.filter(r => r.clauseLocation?.includes(clause.title)).length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                          <h5 className="font-medium text-gray-700 mb-3">Related Risks from Main Analysis:</h5>
                          <div className="space-y-2">
                            {risks
                              .filter(r => r.clauseLocation?.includes(clause.title))
                              .map(risk => (
                                <div key={risk.id} className="text-sm text-gray-600">
                                  • {risk.title}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Select a clause to view details</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Clause Analysis Summary</p>
                <p className="text-2xl font-bold text-blue-900">{clauses.length} clauses analyzed</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">
                  {clauses.filter(c => c.risks.length > 0).length} clauses with risks
                </p>
                <p className="text-sm text-blue-600">
                  {clauses.reduce((sum, c) => sum + c.risks.length, 0)} total clause-specific risks
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}