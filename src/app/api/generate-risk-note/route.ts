import { NextRequest, NextResponse } from 'next/server';
import { RiskNoteGenerator } from '@/lib/risk-note-generator';
import { RiskNoteGenerationInput } from '@/types/risk-note';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['risks', 'contractType', 'partyRole', 'contractName'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate risks array
    if (!Array.isArray(body.risks)) {
      return NextResponse.json(
        { error: 'Risks must be an array' },
        { status: 400 }
      );
    }

    // Validate each risk object
    for (const risk of body.risks) {
      if (!risk.id || !risk.title || !risk.severity || !risk.description) {
        return NextResponse.json(
          { error: 'Each risk must have id, title, severity, and description' },
          { status: 400 }
        );
      }
      
      if (!['high', 'medium', 'low'].includes(risk.severity)) {
        return NextResponse.json(
          { error: 'Risk severity must be high, medium, or low' },
          { status: 400 }
        );
      }
    }

    // Prepare input for risk note generation
    const input: RiskNoteGenerationInput = {
      risks: body.risks,
      contractType: body.contractType,
      partyRole: body.partyRole,
      extractedParties: body.extractedParties || {},
      contractName: body.contractName,
      analysisMetadata: body.analysisMetadata || {
        processingTime: Date.now(),
        templateAnalysis: {}
      }
    };

    // Generate risk note
    const riskNote = RiskNoteGenerator.generateRiskNote(input);

    // Return the generated risk note
    return NextResponse.json({
      success: true,
      riskNote
    });

  } catch (error) {
    console.error('Risk note generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate risk note',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Risk Note Generation API',
      version: '1.0.0',
      endpoints: {
        'POST /api/generate-risk-note': 'Generate a professional risk note from analysis data'
      }
    }
  );
}