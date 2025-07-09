import { NextRequest, NextResponse } from 'next/server';
import { analyzeContractWithAI, preprocessContract } from '@/lib/ai-analyzer';
import { extractTextFromFile, cleanExtractedText } from '@/lib/document-parser';

// Fallback mock analysis if AI fails
async function mockAnalyze(contractType: string, partyRole: string) {
  const mockRisks = {
    'Employee': [
      {
        id: 1,
        category: 'Compensation',
        severity: 'medium' as const,
        title: 'Unclear Bonus Structure',
        description: 'The bonus calculation method is not clearly defined.',
        recommendation: 'Request specific bonus calculation formula.'
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
      }
    ]
  };

  const risks = mockRisks[partyRole as keyof typeof mockRisks] || mockRisks['Employee'];
  
  return {
    summary: {
      totalRisks: risks.length,
      highRisks: risks.filter(r => r.severity === 'high').length,
      mediumRisks: risks.filter(r => r.severity === 'medium').length,
      lowRisks: 0,
      overallRiskLevel: 'medium'
    },
    risks,
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