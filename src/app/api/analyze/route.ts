import { NextRequest, NextResponse } from 'next/server';
import { analyzeContractWithAI, preprocessContract } from '@/lib/ai-analyzer';
import { extractTextFromFile, cleanExtractedText } from '@/lib/document-parser';
import { getContractTemplate, getPartySpecificRedFlags } from '@/lib/contract-templates';

// Fallback mock analysis if AI fails - now uses contract templates
async function mockAnalyze(contractType: string, partyRole: string) {
  const template = getContractTemplate(contractType);
  const redFlags = getPartySpecificRedFlags(contractType, partyRole);
  
  // Generate template-based mock risks
  let mockRisks = [];
  
  if (template) {
    // Create risks based on template review points
    mockRisks = template.keyReviewPoints.slice(0, 3).map((point, index) => ({
      id: index + 1,
      category: point.category,
      severity: index === 0 ? 'high' as const : index === 1 ? 'medium' as const : 'low' as const,
      title: `${point.category} Issues`,
      description: point.description,
      recommendation: `Review ${point.category.toLowerCase()} carefully and negotiate improvements.`
    }));
    
    // Add red flag-based risks
    redFlags.slice(0, 2).forEach((flag) => {
      mockRisks.push({
        id: mockRisks.length + 1,
        category: 'Risk Pattern',
        severity: flag.severity,
        title: `Red Flag: ${flag.pattern}`,
        description: flag.explanation,
        recommendation: `Address this concern before signing.`
      });
    });
  } else {
    // Fallback to original mock data if no template
    const defaultMockRisks = {
      'Employee': [
        {
          id: 1,
          category: 'Compensation',
          severity: 'medium' as const,
          title: 'Unclear Bonus Structure',
          description: 'The bonus calculation method is not clearly defined.',
          recommendation: 'Request specific bonus calculation formula.'
        },
        {
          id: 2,
          category: 'Benefits',
          severity: 'low' as const,
          title: 'Limited PTO Policy',
          description: 'Vacation time allocation may be below industry standard.',
          recommendation: 'Negotiate for additional paid time off.'
        }
      ],
      'Employer': [
        {
          id: 1,
          category: 'Intellectual Property',
          severity: 'high' as const,
          title: 'Weak IP Assignment',
          description: 'IP assignment clause may not cover all work.',
          recommendation: 'Strengthen IP assignment language.'
        },
        {
          id: 2,
          category: 'Confidentiality',
          severity: 'low' as const,
          title: 'Broad Confidentiality Terms',
          description: 'Confidentiality obligations may be too restrictive.',
          recommendation: 'Clarify scope of confidential information.'
        }
      ]
    };
    mockRisks = defaultMockRisks[partyRole as keyof typeof defaultMockRisks] || defaultMockRisks['Employee'];
  }
  
  return {
    summary: {
      totalRisks: mockRisks.length,
      highRisks: mockRisks.filter(r => r.severity === 'high').length,
      mediumRisks: mockRisks.filter(r => r.severity === 'medium').length,
      lowRisks: mockRisks.filter(r => r.severity === 'low').length,
      overallRiskLevel: mockRisks.some(r => r.severity === 'high') ? 'high' : 'medium'
    },
    risks: mockRisks,
    contractType,
    partyRole
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const contractType = formData.get('contractType') as string;
    const partyRole = formData.get('partyRole') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Extract text from the file
    let text;
    try {
      text = await extractTextFromFile(file);
      text = cleanExtractedText(text);
      
      if (!text || text.trim().length < 100) {
        throw new Error('Document appears to be empty or too short');
      }
      
      console.log(`Extracted ${text.length} characters from ${file.name}`);
    } catch (extractError) {
      console.error('Text extraction failed:', extractError);
      return NextResponse.json(
        { error: `Failed to read document: ${extractError instanceof Error ? extractError.message : 'Unknown error'}` },
        { status: 400 }
      );
    }
    
    const processedText = preprocessContract(text);
    
    // Check if we have an API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('No Anthropic API key found, using mock analysis');
      const mockResult = await mockAnalyze(contractType, partyRole);
      return NextResponse.json({
        ...mockResult,
        contractText: text
      });
    }
    
    try {
      // Try AI analysis
      const analysis = await analyzeContractWithAI(
        processedText,
        contractType,
        partyRole
      );
      
      return NextResponse.json({
        ...analysis,
        contractText: text
      });
    } catch (aiError) {
      console.error('AI analysis failed, falling back to mock:', aiError);
      // Fallback to mock analysis if AI fails
      const mockResult = await mockAnalyze(contractType, partyRole);
      return NextResponse.json({
        ...mockResult,
        contractText: text,
        warning: 'AI analysis unavailable, showing sample risks'
      });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze contract' },
      { status: 500 }
    );
  }
}