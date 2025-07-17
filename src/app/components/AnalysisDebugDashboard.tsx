"use client";

import React, { useState } from 'react';
import { Risk } from '@/types/debug';

interface DuplicationDetection {
  generalRisk: Risk;
  templateRisk: Risk | null;
  similarityScore: number;
  isDuplicate: boolean;
  reason: string;
  comparisonDetails: {
    titleSimilarity: number;
    descriptionSimilarity: number;
    categorySimilarity: number;
    overallSimilarity: number;
    templateRiskTitle: string;
    aiRiskTitle: string;
  };
  addedToFinal?: boolean;
}

interface MergingProcessDebug {
  beforeMerging: {
    templateRisks: Risk[];
    generalRisks: Risk[];
    totalCount: number;
  };
  duplicationDetection: DuplicationDetection[];
  afterMerging: {
    finalRisks: Risk[];
    removedRisks: Risk[];
    addedRisks: Risk[];
    totalCount: number;
  };
  configuration: {
    similarityThreshold: number;
    titleWeight: number;
    descriptionWeight: number;
    categoryWeight: number;
  };
}

interface AnalysisDebugData {
  mergingProcess: MergingProcessDebug;
  summary: {
    totalOriginal: number;
    finalCount: number;
    filteredCount: number;
    duplicateRate: string;
  };
}

interface AnalysisDebugDashboardProps {
  debugData: AnalysisDebugData;
  onRestoreRisk?: (riskId: number) => void;
}

export default function AnalysisDebugDashboard({ debugData, onRestoreRisk }: AnalysisDebugDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetailed, setShowDetailed] = useState(false);
  
  const downloadDebugData = () => {
    const dataStr = JSON.stringify(debugData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-debug-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateDebugReport = () => {
    const report = `
# Risk Analysis Debug Report
Generated: ${new Date().toLocaleString()}

## Summary
- Original Risks Found: ${debugData.summary.totalOriginal}
- Final Risks Displayed: ${debugData.summary.finalCount}
- Risks Filtered as Duplicates: ${debugData.summary.filteredCount}
- Duplicate Filter Rate: ${debugData.summary.duplicateRate}%

## Configuration
- Similarity Threshold: ${(debugData.mergingProcess.configuration.similarityThreshold * 100).toFixed(1)}%
- Title Weight: ${debugData.mergingProcess.configuration.titleWeight}
- Description Weight: ${debugData.mergingProcess.configuration.descriptionWeight}
- Category Weight: ${debugData.mergingProcess.configuration.categoryWeight}

## Filtered Risks Details
${debugData.mergingProcess.duplicationDetection
  .filter(d => d.isDuplicate)
  .map((detection, index) => `
${index + 1}. "${detection.generalRisk.title}"
   - Similarity: ${(detection.similarityScore * 100).toFixed(1)}%
   - Matched with: "${detection.templateRisk?.title}"
   - Reason: ${detection.reason}
   - Category: ${detection.generalRisk.category}
   - Severity: ${detection.generalRisk.severity}
`).join('')}
    `;
    
    const reportBlob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(reportBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `debug-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const DebugOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800">Original Risks</h3>
          <p className="text-3xl font-bold text-blue-600">{debugData.summary.totalOriginal}</p>
          <p className="text-sm text-blue-600">Template + AI Found</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800">Final Displayed</h3>
          <p className="text-3xl font-bold text-green-600">{debugData.summary.finalCount}</p>
          <p className="text-sm text-green-600">Shown to User</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800">Filtered Out</h3>
          <p className="text-3xl font-bold text-red-600">{debugData.summary.filteredCount}</p>
          <p className="text-sm text-red-600">Removed as Duplicates</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800">Filter Rate</h3>
          <p className="text-3xl font-bold text-yellow-600">{debugData.summary.duplicateRate}%</p>
          <p className="text-sm text-yellow-600">Risks Filtered</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Similarity Threshold:</span> {(debugData.mergingProcess.configuration.similarityThreshold * 100).toFixed(1)}%
          </div>
          <div>
            <span className="font-medium">Title Weight:</span> {debugData.mergingProcess.configuration.titleWeight}
          </div>
          <div>
            <span className="font-medium">Description Weight:</span> {debugData.mergingProcess.configuration.descriptionWeight}
          </div>
          <div>
            <span className="font-medium">Category Weight:</span> {debugData.mergingProcess.configuration.categoryWeight}
          </div>
        </div>
      </div>

      {debugData.summary.filteredCount > 0 && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">⚠️ Potential Issues Detected</h3>
          <p className="text-orange-700">
            {debugData.summary.filteredCount} risk(s) were filtered as duplicates. 
            This could indicate legitimate risks being incorrectly removed. 
            Review the "Risk Merging" tab to analyze each decision.
          </p>
        </div>
      )}
    </div>
  );

  const MergingProcessDebug = () => (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Merging Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded">
            <div className="font-medium text-blue-800">Template Risks</div>
            <div className="text-xl font-bold text-blue-600">{debugData.mergingProcess.beforeMerging.templateRisks.length}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="font-medium text-purple-800">AI Risks</div>
            <div className="text-xl font-bold text-purple-600">{debugData.mergingProcess.beforeMerging.generalRisks.length}</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="font-medium text-green-800">Final Count</div>
            <div className="text-xl font-bold text-green-600">{debugData.mergingProcess.afterMerging.totalCount}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Duplicate Detection Process</h3>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={showDetailed} 
              onChange={(e) => setShowDetailed(e.target.checked)}
              className="mr-2"
            />
            Show Detailed Comparisons
          </label>
        </div>
        
        <div className="space-y-4">
          {debugData.mergingProcess.duplicationDetection.map((detection, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 ${
                detection.isDuplicate 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-800">{detection.generalRisk.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded font-medium border ${getSeverityColor(detection.generalRisk.severity)}`}>
                    {detection.generalRisk.severity}
                  </span>
                  <span className="text-sm text-gray-600">{detection.generalRisk.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded ${
                    detection.isDuplicate 
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {detection.isDuplicate ? 'FILTERED AS DUPLICATE' : 'KEPT AS UNIQUE'}
                  </span>
                  <span className="text-sm font-medium">
                    {(detection.similarityScore * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-700"><strong>Reason:</strong> {detection.reason}</p>
              </div>

              {showDetailed && (
                <div className="space-y-3 border-t pt-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Title Similarity:</span> {(detection.comparisonDetails.titleSimilarity * 100).toFixed(1)}%
                    </div>
                    <div>
                      <span className="font-medium">Description:</span> {(detection.comparisonDetails.descriptionSimilarity * 100).toFixed(1)}%
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {detection.comparisonDetails.categorySimilarity > 0 ? 'Match' : 'Different'}
                    </div>
                    <div>
                      <span className="font-medium">Overall:</span> {(detection.comparisonDetails.overallSimilarity * 100).toFixed(1)}%
                    </div>
                  </div>

                  {detection.templateRisk && (
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-800 mb-2">Compared with Template Risk:</div>
                      <div className="text-sm">
                        <div className="font-medium">{detection.templateRisk.title}</div>
                        <div className="text-gray-600 mt-1">{detection.templateRisk.description}</div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-800 mb-2">AI Risk Details:</div>
                    <div className="text-sm text-gray-600">{detection.generalRisk.description}</div>
                  </div>
                </div>
              )}

              {detection.isDuplicate && onRestoreRisk && (
                <div className="mt-3 pt-3 border-t">
                  <button 
                    onClick={() => onRestoreRisk(detection.generalRisk.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Manual Override: Restore This Risk
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="debug-dashboard bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="debug-header border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">🔍 Analysis Debug Dashboard</h2>
          <div className="flex gap-2">
            <button 
              onClick={downloadDebugData}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Download Debug Data
            </button>
            <button 
              onClick={generateDebugReport}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="debug-tabs border-b border-gray-200">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'merging', label: 'Risk Merging' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="debug-content p-6">
        {activeTab === 'overview' && <DebugOverview />}
        {activeTab === 'merging' && <MergingProcessDebug />}
      </div>
    </div>
  );
}