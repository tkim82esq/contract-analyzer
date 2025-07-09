import { NextRequest, NextResponse } from 'next/server';
import { analyzeContractClauses, preprocessContract } from '@/lib/ai-analyzer';

export async function POST(request: NextRequest) {
  try {
    const { contractText, contractType, partyRole } = await request.json();

    console.log('Clause analysis request:', {
      contractTextLength: contractText?.length || 0,
      contractTextPreview: contractText?.substring(0, 200) || 'No text',
      contractType,
      partyRole
    });

    if (!contractText || !contractType || !partyRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Preprocess the contract text
    const processedText = preprocessContract(contractText);
    
    // Check if we have an API key
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return mock data for demo
      return NextResponse.json({
        clauses: [
          {
            id: 1,
            section: "1",
            title: "Services",
            text: "The Service Provider shall provide software development services...",
            risks: [
              {
                severity: "medium",
                description: "Scope of services is not clearly defined"
              }
            ],
            analysis: "This clause outlines your service obligations but lacks specific deliverables."
          },
          {
            id: 2,
            section: "2",
            title: "Payment Terms",
            text: "Payment shall be made within 60 days of invoice...",
            risks: [
              {
                severity: "high",
                description: "Extended payment terms may cause cash flow issues"
              }
            ],
            analysis: "The 60-day payment term is longer than industry standard."
          }
        ]
      });
    }
    
    try {
      // Get clause analysis
      const clauses = await analyzeContractClauses(
        processedText,
        contractType,
        partyRole
      );
      
      return NextResponse.json({ clauses });
    } catch (aiError) {
      console.error('AI clause analysis failed:', aiError);
      return NextResponse.json(
        { error: 'Failed to analyze clauses', clauses: [] },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Clause analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}