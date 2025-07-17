"use client";

import React, { useState } from 'react';
import { RiskNote } from '@/types/risk-note';
import { 
  DocumentArrowDownIcon, 
  EnvelopeIcon, 
  PrinterIcon, 
  ClipboardDocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface RiskNoteExportProps {
  riskNote: RiskNote;
  onClose: () => void;
}

export default function RiskNoteExport({ riskNote, onClose }: RiskNoteExportProps) {
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'EMAIL' | 'PRINT' | 'CLIPBOARD'>('PDF');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [includeDetails, setIncludeDetails] = useState(true);

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');

    try {
      switch (selectedFormat) {
        case 'PDF':
          await exportToPDF();
          break;
        case 'EMAIL':
          await exportToEmail();
          break;
        case 'PRINT':
          await exportToPrint();
          break;
        case 'CLIPBOARD':
          await exportToClipboard();
          break;
      }
      setExportStatus('success');
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    // This would typically use a library like jsPDF or html2pdf
    // For now, we'll simulate the export
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate PDF content
    const pdfContent = generatePDFContent();
    
    // Create a blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-note-${riskNote.metadata.contractName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToEmail = async () => {
    if (!emailRecipient) {
      throw new Error('Email recipient required');
    }

    // This would typically integrate with an email service
    const emailContent = generateEmailContent();
    
    // For now, we'll open the default mail client
    const subject = encodeURIComponent(`Risk Assessment: ${riskNote.metadata.contractName}`);
    const body = encodeURIComponent(emailContent);
    const mailtoUrl = `mailto:${emailRecipient}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;
  };

  const exportToPrint = async () => {
    // Generate print-friendly content
    const printContent = generatePrintContent();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Risk Assessment - ${riskNote.metadata.contractName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .risk-item { margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; }
              .high-risk { background-color: #fee; }
              .medium-risk { background-color: #fff8e1; }
              .low-risk { background-color: #f0f8f0; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToClipboard = async () => {
    const textContent = generateTextContent();
    
    try {
      await navigator.clipboard.writeText(textContent);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const generatePDFContent = () => {
    return `
CONTRACT RISK ASSESSMENT
Generated: ${riskNote.metadata.analysisDate}

═══════════════════════════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
Contract: ${riskNote.metadata.contractName}
Contract Type: ${riskNote.metadata.contractType}
Your Role: ${riskNote.metadata.yourRole}
Overall Risk Level: ${riskNote.executiveSummary.overallRiskLevel}
Recommended Action: ${riskNote.executiveSummary.recommendedAction.replace(/_/g, ' ')}

Key Message: ${riskNote.executiveSummary.keyMessage}
Confidence Score: ${Math.round(riskNote.executiveSummary.confidenceScore * 100)}%

═══════════════════════════════════════════════════════════════════════════════

RISK OVERVIEW
High Risk: ${riskNote.riskOverview.breakdown.high}
Medium Risk: ${riskNote.riskOverview.breakdown.medium}
Low Risk: ${riskNote.riskOverview.breakdown.low}

Top Concerns:
${riskNote.riskOverview.topConcerns.map((concern, i) => `${i + 1}. ${concern}`).join('\n')}

${includeDetails ? `
═══════════════════════════════════════════════════════════════════════════════

DETAILED RISKS
${riskNote.detailedRisks.map(risk => `
${risk.title} (${risk.impactLevel} RISK - ${risk.urgency})
Business Impact: ${risk.businessImpact}
Recommended Action: ${risk.recommendedAction}
Contract Reference: ${risk.contractReference}
${risk.financialImpact ? `Financial Impact: ${risk.financialImpact}` : ''}
`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════

NEGOTIATION PRIORITIES

MUST HAVE:
${riskNote.negotiationPriorities.mustHave.map((item, i) => `${i + 1}. ${item.item}${item.dealBreaker ? ' (DEAL BREAKER)' : ''}
   Rationale: ${item.rationale}`).join('\n')}

SHOULD HAVE:
${riskNote.negotiationPriorities.shouldHave.map((item, i) => `${i + 1}. ${item.item} (${item.negotiatingPower} negotiating power)
   Rationale: ${item.rationale}`).join('\n')}

NICE TO HAVE:
${riskNote.negotiationPriorities.niceToHave.map((item, i) => `${i + 1}. ${item.item}
   Rationale: ${item.rationale}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════

NEXT STEPS
${riskNote.nextSteps.map((step, i) => `${i + 1}. ${step.action} (${step.priority.replace(/_/g, ' ')})
   Timeline: ${step.timeline}
   Stakeholder: ${step.stakeholder}
   Description: ${step.description}`).join('\n')}
` : ''}

═══════════════════════════════════════════════════════════════════════════════

DISCLAIMER
${riskNote.disclaimer}

Generated by Contract Analyzer v${riskNote.metadata.analyzerVersion}
`;
  };

  const generateEmailContent = () => {
    return `Subject: Risk Assessment - ${riskNote.metadata.contractName}

Dear Colleague,

Please find attached the risk assessment for the ${riskNote.metadata.contractType} contract.

EXECUTIVE SUMMARY:
• Overall Risk Level: ${riskNote.executiveSummary.overallRiskLevel}
• Recommended Action: ${riskNote.executiveSummary.recommendedAction.replace(/_/g, ' ')}
• Key Message: ${riskNote.executiveSummary.keyMessage}

RISK BREAKDOWN:
• High Risk: ${riskNote.riskOverview.breakdown.high}
• Medium Risk: ${riskNote.riskOverview.breakdown.medium}
• Low Risk: ${riskNote.riskOverview.breakdown.low}

TOP CONCERNS:
${riskNote.riskOverview.topConcerns.map((concern, i) => `${i + 1}. ${concern}`).join('\n')}

IMMEDIATE NEXT STEPS:
${riskNote.nextSteps
  .filter(step => step.priority === 'IMMEDIATE')
  .map(step => `• ${step.action} (${step.stakeholder})`)
  .join('\n')}

For the complete analysis, please refer to the attached risk note.

Best regards,
Contract Risk Analyzer

---
${riskNote.disclaimer}
`;
  };

  const generatePrintContent = () => {
    return `
      <div class="header">
        <h1>CONTRACT RISK ASSESSMENT</h1>
        <p>Generated: ${riskNote.metadata.analysisDate}</p>
      </div>

      <div class="section">
        <h2>Executive Summary</h2>
        <p><strong>Contract:</strong> ${riskNote.metadata.contractName}</p>
        <p><strong>Your Role:</strong> ${riskNote.metadata.yourRole}</p>
        <p><strong>Overall Risk Level:</strong> ${riskNote.executiveSummary.overallRiskLevel}</p>
        <p><strong>Key Message:</strong> ${riskNote.executiveSummary.keyMessage}</p>
      </div>

      <div class="section">
        <h2>Risk Overview</h2>
        <p>High Risk: ${riskNote.riskOverview.breakdown.high} | Medium Risk: ${riskNote.riskOverview.breakdown.medium} | Low Risk: ${riskNote.riskOverview.breakdown.low}</p>
        
        <h3>Top Concerns</h3>
        <ul>
          ${riskNote.riskOverview.topConcerns.map(concern => `<li>${concern}</li>`).join('')}
        </ul>
      </div>

      ${includeDetails ? `
        <div class="section">
          <h2>Detailed Risks</h2>
          ${riskNote.detailedRisks.map(risk => `
            <div class="risk-item ${risk.impactLevel.toLowerCase()}-risk">
              <h4>${risk.title} (${risk.impactLevel} RISK)</h4>
              <p><strong>Business Impact:</strong> ${risk.businessImpact}</p>
              <p><strong>Recommended Action:</strong> ${risk.recommendedAction}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="section">
        <h2>Next Steps</h2>
        ${riskNote.nextSteps.map(step => `
          <div class="risk-item">
            <h4>${step.action}</h4>
            <p><strong>Timeline:</strong> ${step.timeline}</p>
            <p><strong>Stakeholder:</strong> ${step.stakeholder}</p>
            <p>${step.description}</p>
          </div>
        `).join('')}
      </div>
    `;
  };

  const generateTextContent = () => {
    return `CONTRACT RISK ASSESSMENT
Generated: ${riskNote.metadata.analysisDate}

EXECUTIVE SUMMARY
Contract: ${riskNote.metadata.contractName}
Overall Risk Level: ${riskNote.executiveSummary.overallRiskLevel}
Key Message: ${riskNote.executiveSummary.keyMessage}

RISK BREAKDOWN
High: ${riskNote.riskOverview.breakdown.high} | Medium: ${riskNote.riskOverview.breakdown.medium} | Low: ${riskNote.riskOverview.breakdown.low}

TOP CONCERNS
${riskNote.riskOverview.topConcerns.map((concern, i) => `${i + 1}. ${concern}`).join('\n')}

NEXT STEPS
${riskNote.nextSteps.map((step, i) => `${i + 1}. ${step.action} (${step.timeline})`).join('\n')}

Generated by Contract Analyzer v${riskNote.metadata.analyzerVersion}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Export Risk Note</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'PDF', label: 'PDF Document', icon: DocumentArrowDownIcon },
                { value: 'EMAIL', label: 'Email', icon: EnvelopeIcon },
                { value: 'PRINT', label: 'Print', icon: PrinterIcon },
                { value: 'CLIPBOARD', label: 'Copy to Clipboard', icon: ClipboardDocumentIcon }
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value as any)}
                  className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                    selectedFormat === format.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <format.icon className="h-5 w-5 mr-2" />
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email Recipient */}
          {selectedFormat === 'EMAIL' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Recipient
              </label>
              <input
                type="email"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                required
              />
            </div>
          )}

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Include detailed risk analysis
                </span>
              </label>
            </div>
          </div>

          {/* Export Status */}
          {exportStatus === 'success' && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">
                Risk note exported successfully!
              </span>
            </div>
          )}

          {exportStatus === 'error' && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">
                Export failed. Please try again.
              </span>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || (selectedFormat === 'EMAIL' && !emailRecipient)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isExporting || (selectedFormat === 'EMAIL' && !emailRecipient)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isExporting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </div>
              ) : (
                `Export ${selectedFormat}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}