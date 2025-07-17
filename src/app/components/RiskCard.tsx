"use client";

import { useState } from "react";

interface Risk {
  id: number;
  category: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
}

interface RiskCardProps {
  risk: Risk;
}

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default function RiskCard({ risk }: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskSeverityClass = (severity: string) => {
    switch (severity) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "medium";
    }
  };

  return (
    <div 
      className={`card risk-card ${isExpanded ? 'expanded' : 'collapsed'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="card-content">
        {/* Risk Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            {/* Risk Indicator */}
            <div className={`risk-indicator ${getRiskSeverityClass(risk.severity)} flex-shrink-0`}>
              {risk.severity}
            </div>
            
            {/* Risk Title */}
            <h3 className="text-lg font-semibold text-gray-900 ml-3 flex-1 min-w-0">
              {risk.title}
            </h3>
          </div>
          
          {/* Expand/Collapse Icon */}
          <ChevronDownIcon 
            className={`w-5 h-5 text-gray-400 expand-icon flex-shrink-0 ml-3 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </div>

        {/* Risk Meta */}
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
            {risk.category}
          </span>
        </div>

        {/* Risk Content - Expandable */}
        <div className={`risk-content transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
        }`}>
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Risk Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {risk.description}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommendation</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {risk.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}