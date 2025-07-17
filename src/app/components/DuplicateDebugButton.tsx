"use client";

import React, { useState } from 'react';

interface AnalysisDebugData {
  mergingProcess?: {
    beforeMerging: {
      templateRisks: any[];
      generalRisks: any[];
      totalCount: number;
    };
    duplicationDetection: any[];
    afterMerging: {
      finalRisks: any[];
      removedRisks: any[];
      addedRisks: any[];
      totalCount: number;
    };
    configuration: {
      similarityThreshold: number;
      titleWeight: number;
      descriptionWeight: number;
      categoryWeight: number;
    };
  };
  summary?: {
    totalOriginal: number;
    finalCount: number;
    filteredCount: number;
    duplicateRate: string;
  };
  templateAnalysis?: {
    parsedResults?: {
      generatedRisks?: any[];
    };
  };
  generalAnalysis?: {
    parsedResults?: {
      risks?: any[];
    };
  };
}

interface DuplicateDebugProps {
  debugData: AnalysisDebugData;
  isVisible: boolean;
  onToggle: () => void;
}

const DebugOverview = ({ data }: { data: AnalysisDebugData }) => (
  <div className="debug-overview">
    <div className="stats-grid">
      <div className="stat-item">
        <span className="stat-label">Template Risks Found</span>
        <span className="stat-value">{data.templateAnalysis?.parsedResults?.generatedRisks?.length || 0}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">General Risks Found</span>
        <span className="stat-value">{data.generalAnalysis?.parsedResults?.risks?.length || 0}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Final Risks Displayed</span>
        <span className="stat-value">{data.mergingProcess?.afterMerging?.finalRisks?.length || 0}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Risks Filtered as Duplicates</span>
        <span className="stat-value">{data.mergingProcess?.afterMerging?.removedRisks?.length || 0}</span>
      </div>
    </div>
    
    {data.mergingProcess?.afterMerging?.removedRisks && data.mergingProcess.afterMerging.removedRisks.length > 0 && (
      <div className="warning-notice">
        <span className="warning-icon">⚠️</span>
        <span>{data.mergingProcess.afterMerging.removedRisks.length} risks were filtered as duplicates. Review the "Filtered Risks" tab to ensure no important risks were missed.</span>
      </div>
    )}
  </div>
);

const DebugDecisions = ({ data }: { data: AnalysisDebugData }) => (
  <div className="debug-decisions">
    <h4>Duplicate Detection Decisions</h4>
    {data.mergingProcess?.duplicationDetection?.map((decision: any, index: number) => (
      <div key={index} className={`decision-item ${decision.isDuplicate ? 'filtered' : 'kept'}`}>
        <div className="decision-header">
          <span className="risk-title">{decision.generalRisk?.title}</span>
          <span className={`decision-badge ${decision.isDuplicate ? 'filtered' : 'kept'}`}>
            {decision.isDuplicate ? 'FILTERED' : 'KEPT'}
          </span>
        </div>
        <div className="similarity-score">
          Similarity: {((decision.similarityScore || 0) * 100).toFixed(1)}%
        </div>
        <div className="decision-reason">
          {decision.reason || 'No reason provided'}
        </div>
        {decision.templateRisk && (
          <div className="compared-with">
            <strong>Compared with:</strong> {decision.templateRisk.title}
          </div>
        )}
      </div>
    )) || <p>No duplicate detection data available.</p>}
  </div>
);

const DebugFilteredRisks = ({ data }: { data: AnalysisDebugData }) => (
  <div className="debug-filtered-risks">
    <h4>Risks Filtered as Duplicates</h4>
    {data.mergingProcess?.afterMerging?.removedRisks && data.mergingProcess.afterMerging.removedRisks.length > 0 ? (
      <div className="filtered-risks-list">
        {data.mergingProcess.afterMerging.removedRisks.map((risk: any, index: number) => (
          <div key={index} className="filtered-risk-item">
            <h5>{risk.title}</h5>
            <p>{risk.description}</p>
            <div className="risk-meta">
              <span>Severity: {risk.severity}</span>
              <span>Category: {risk.category}</span>
              <span>Source: {risk.source}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No risks were filtered as duplicates.</p>
    )}
  </div>
);

const DebugDataDisplay = ({ debugData }: { debugData: AnalysisDebugData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="debug-data-display">
      <div className="debug-header">
        <h3>Duplicate Detection Analysis</h3>
        <p className="debug-subtitle">
          Detailed breakdown of how risks were processed and merged
        </p>
      </div>
      
      {/* Simplified tab navigation */}
      <div className="debug-tabs">
        <button 
          className={`debug-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`debug-tab ${activeTab === 'decisions' ? 'active' : ''}`}
          onClick={() => setActiveTab('decisions')}
        >
          Merge Decisions
        </button>
        <button 
          className={`debug-tab ${activeTab === 'filtered' ? 'active' : ''}`}
          onClick={() => setActiveTab('filtered')}
        >
          Filtered Risks
        </button>
      </div>
      
      <div className="debug-content">
        {activeTab === 'overview' && <DebugOverview data={debugData} />}
        {activeTab === 'decisions' && <DebugDecisions data={debugData} />}
        {activeTab === 'filtered' && <DebugFilteredRisks data={debugData} />}
      </div>
    </div>
  );
};

export default function DuplicateDebugButton({ debugData, isVisible, onToggle }: DuplicateDebugProps) {
  return (
    <div className="duplicate-debug-container">
      {/* Small, subtle button */}
      <button 
        onClick={onToggle}
        className="duplicate-debug-button"
      >
        <span className="debug-icon">🔍</span>
        Duplicate Debug
        <span className={`chevron ${isVisible ? 'expanded' : 'collapsed'}`}>
          {isVisible ? '▲' : '▼'}
        </span>
      </button>
      
      {/* Expandable debug content */}
      {isVisible && (
        <div className="debug-content-panel">
          <DebugDataDisplay debugData={debugData} />
        </div>
      )}
    </div>
  );
}