"use client";

import React, { useState } from 'react';

interface DuplicationConfig {
  similarityThreshold: number;
  titleWeight: number;
  descriptionWeight: number;
  categoryWeight: number;
  enableManualOverrides: boolean;
}

interface ThresholdConfigPanelProps {
  currentConfig: DuplicationConfig;
  onConfigChange: (config: DuplicationConfig) => void;
  onReanalyze?: () => void;
  isReanalyzing?: boolean;
}

export default function ThresholdConfigPanel({ 
  currentConfig, 
  onConfigChange, 
  onReanalyze,
  isReanalyzing = false 
}: ThresholdConfigPanelProps) {
  const [config, setConfig] = useState<DuplicationConfig>(currentConfig);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleConfigChange = (key: keyof DuplicationConfig, value: number | boolean) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const resetToDefaults = () => {
    const defaultConfig: DuplicationConfig = {
      similarityThreshold: 0.6,
      titleWeight: 0.4,
      descriptionWeight: 0.3,
      categoryWeight: 0.3,
      enableManualOverrides: true
    };
    setConfig(defaultConfig);
    onConfigChange(defaultConfig);
  };

  const getThresholdRecommendation = (threshold: number) => {
    if (threshold >= 0.8) return { text: "Very Strict - May miss legitimate duplicates", color: "text-red-600" };
    if (threshold >= 0.7) return { text: "Strict - Conservative duplicate detection", color: "text-orange-600" };
    if (threshold >= 0.5) return { text: "Balanced - Recommended setting", color: "text-green-600" };
    if (threshold >= 0.3) return { text: "Lenient - May filter unique risks", color: "text-yellow-600" };
    return { text: "Very Lenient - High risk of false positives", color: "text-red-600" };
  };

  const recommendation = getThresholdRecommendation(config.similarityThreshold);

  return (
    <div className="threshold-config-panel bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">⚙️ Duplicate Detection Configuration</h3>
          <div className="flex gap-2">
            <button
              onClick={resetToDefaults}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset to Defaults
            </button>
            {onReanalyze && (
              <button
                onClick={onReanalyze}
                disabled={isReanalyzing}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isReanalyzing ? 'Reanalyzing...' : 'Reanalyze with New Settings'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Threshold Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Similarity Threshold
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={config.similarityThreshold}
              onChange={(e) => handleConfigChange('similarityThreshold', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>More Unique Risks</span>
              <span className="font-medium">{(config.similarityThreshold * 100).toFixed(0)}%</span>
              <span>Fewer Duplicates</span>
            </div>
            <p className={`text-sm ${recommendation.color}`}>
              {recommendation.text}
            </p>
          </div>
        </div>

        {/* Current Impact Preview */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Expected Impact</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Current threshold: <span className="font-medium">{(config.similarityThreshold * 100).toFixed(1)}%</span></div>
            <div>
              {config.similarityThreshold > 0.7 ? (
                <span className="text-orange-600">⚠️ Higher threshold may keep more risks but increase false negatives</span>
              ) : config.similarityThreshold < 0.4 ? (
                <span className="text-yellow-600">⚠️ Lower threshold may filter more risks but increase false positives</span>
              ) : (
                <span className="text-green-600">✅ Balanced threshold recommended for most contracts</span>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Controls */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Advanced Weight Configuration</span>
            <svg 
              className={`ml-1 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title Weight ({config.titleWeight})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.titleWeight}
                  onChange={(e) => handleConfigChange('titleWeight', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How much the risk title similarity affects duplicate detection</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description Weight ({config.descriptionWeight})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.descriptionWeight}
                  onChange={(e) => handleConfigChange('descriptionWeight', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How much the risk description similarity affects duplicate detection</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Weight ({config.categoryWeight})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.categoryWeight}
                  onChange={(e) => handleConfigChange('categoryWeight', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How much the risk category match affects duplicate detection</p>
              </div>

              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Weights should add up to approximately 1.0 for optimal results. 
                  Current sum: {(config.titleWeight + config.descriptionWeight + config.categoryWeight).toFixed(1)}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.enableManualOverrides}
                    onChange={(e) => handleConfigChange('enableManualOverrides', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Enable Manual Override Buttons</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Show "Restore Risk" buttons for manually overriding duplicate detection</p>
              </div>
            </div>
          )}
        </div>

        {/* Preset Configurations */}
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-2">Quick Presets</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button
              onClick={() => {
                const strictConfig = { ...config, similarityThreshold: 0.8, titleWeight: 0.5, descriptionWeight: 0.4, categoryWeight: 0.1 };
                setConfig(strictConfig);
                onConfigChange(strictConfig);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Strict (80%)
            </button>
            <button
              onClick={() => {
                const balancedConfig = { ...config, similarityThreshold: 0.6, titleWeight: 0.4, descriptionWeight: 0.3, categoryWeight: 0.3 };
                setConfig(balancedConfig);
                onConfigChange(balancedConfig);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Balanced (60%)
            </button>
            <button
              onClick={() => {
                const lenientConfig = { ...config, similarityThreshold: 0.4, titleWeight: 0.3, descriptionWeight: 0.3, categoryWeight: 0.4 };
                setConfig(lenientConfig);
                onConfigChange(lenientConfig);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Lenient (40%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}