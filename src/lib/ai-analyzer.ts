import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface Risk {
  id: number;
  category: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  clauseLocation?: string;
  relatedText?: string;
}

export interface Clause {
  id: number;
  section: string;
  title: string;
  text: string;
  risks: Risk[];
  analysis: string;
}

export interface AnalysisResult {
  summary: {
    totalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    overallRiskLevel: string;
  };
  risks: Risk[];
  clauses?: Clause[];
  contractType: string;
  partyRole: string;
}

export async function analyzeContractWithAI(
  contractText: string,
  contractType: string,
  partyRole: string,
  includeClauseBreakdown: boolean = false
): Promise<AnalysisResult> {
  try {
    // Create a focused prompt for Claude
    const prompt = `You are a legal contract analyst. Analyze this ${contractType} from the perspective of the ${partyRole}.

CONTRACT TEXT:
${contractText}

Identify the top 5-7 most important risks for the ${partyRole} in this contract. Focus on risks that could have significant financial, legal, or operational impact.

For each risk, provide:
1. A clear, specific title
2. The risk category (e.g., Payment, Liability, Termination, IP, Confidentiality, etc.)
3. Severity level (high, medium, or low)
4. A detailed description of why this is a risk for the ${partyRole}
5. A specific, actionable recommendation
6. If possible, quote or reference the specific clause

Respond in this exact JSON format:
{
  "risks": [
    {
      "title": "Risk title",
      "category": "Category name",
      "severity": "high|medium|low",
      "description": "Detailed description of the risk",
      "recommendation": "Specific actionable recommendation",
      "clauseLocation": "Section or clause reference if available"
    }
  ]
}

Remember: You are analyzing from the ${partyRole}'s perspective. What helps one party may hurt the other.`;

    // Try different model names
    const modelOptions = [
      'claude-3-5-sonnet-20241022',
      'claude-3-sonnet-20240229',
      'claude-3-opus-20240229',
      'claude-3-haiku-20240307'
    ];

    let response;
    let lastError;

    for (const model of modelOptions) {
      try {
        console.log(`Trying model: ${model}`);
        response = await anthropic.messages.create({
          model,
          max_tokens: 2000,
          temperature: 0,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        });
        console.log(`Success with model: ${model}`);
        break; // If successful, exit the loop
      } catch (error: any) {
        console.log(`Failed with model ${model}:`, error.message);
        lastError = error;
        continue; // Try next model
      }
    }

    if (!response) {
      throw lastError || new Error('All models failed');
    }

    // Parse the response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Extract JSON from the response
    let analysisData;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, try to parse the entire response
        // Sometimes Claude includes the JSON without other text
        try {
          analysisData = JSON.parse(content.text.trim());
        } catch {
          // If that fails, create a structured response from the text
          console.log('No JSON found, attempting to structure the response');
          
          // Ask Claude again with a more specific prompt
          const retryResponse = await anthropic.messages.create({
            model: response.model || 'claude-3-haiku-20240307',
            max_tokens: 2000,
            temperature: 0,
            messages: [
              {
                role: 'user',
                content: `Based on this contract analysis, create a JSON response with exactly this structure:
${content.text}

Return ONLY valid JSON in this exact format, with no other text:
{
  "risks": [
    {
      "title": "string",
      "category": "string",
      "severity": "high|medium|low",
      "description": "string",
      "recommendation": "string"
    }
  ]
}`
              }
            ]
          });
          
          const retryContent = retryResponse.content[0];
          if (retryContent.type === 'text') {
            analysisData = JSON.parse(retryContent.text.trim());
          } else {
            throw new Error('Failed to get structured response');
          }
        }
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text);
      throw new Error('Failed to parse AI response - the document may not be a valid contract');
    }

    // Process and structure the risks
    const risks: Risk[] = analysisData.risks.map((risk: any, index: number) => ({
      id: index + 1,
      category: risk.category || 'General',
      severity: risk.severity || 'medium',
      title: risk.title || 'Untitled Risk',
      description: risk.description || '',
      recommendation: risk.recommendation || '',
      clauseLocation: risk.clauseLocation
    }));

    // Calculate summary
    const summary = {
      totalRisks: risks.length,
      highRisks: risks.filter(r => r.severity === 'high').length,
      mediumRisks: risks.filter(r => r.severity === 'medium').length,
      lowRisks: risks.filter(r => r.severity === 'low').length,
      overallRiskLevel: risks.some(r => r.severity === 'high') ? 'high' : 
                       risks.some(r => r.severity === 'medium') ? 'medium' : 'low'
    };

    return {
      summary,
      risks,
      contractType,
      partyRole
    };

  } catch (error) {
    console.error('AI Analysis Error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('authentication')) {
        throw new Error('Invalid API key. Please check your Anthropic API key in .env.local');
      } else if (error.message.includes('404') || error.message.includes('not_found')) {
        throw new Error('Model not found. The AI service may be updating. Using fallback analysis.');
      } else if (error.message.includes('429') || error.message.includes('rate_limit')) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      } else if (error.message.includes('insufficient_quota')) {
        throw new Error('API quota exceeded. Please check your Anthropic account credits.');
      }
    }
    
    // Generic error
    throw new Error('Failed to analyze contract. Please try again or check your API key.');
  }
}

// Helper function to extract key information from contract
export function preprocessContract(text: string): string {
  // Limit contract length to avoid token limits
  const maxLength = 15000; // About 3750 tokens
  
  if (text.length > maxLength) {
    // Try to intelligently truncate
    // First, try to find a good breaking point
    const breakPoint = text.lastIndexOf('\n\n', maxLength);
    if (breakPoint > maxLength * 0.8) {
      return text.substring(0, breakPoint) + '\n\n[Contract truncated for analysis]';
    }
    return text.substring(0, maxLength) + '... [Contract truncated for analysis]';
  }
  
  return text;
}

// New function for clause-by-clause analysis
export async function analyzeContractClauses(
  contractText: string,
  contractType: string,
  partyRole: string
): Promise<Clause[]> {
  try {
    const prompt = `You are a legal contract analyst. Break down this ${contractType} into its main clauses and analyze each one from the perspective of the ${partyRole}.

CONTRACT TEXT:
${contractText}

For each major clause or section in the contract:
1. Extract the clause text
2. Identify the section/clause title
3. Analyze risks specifically for the ${partyRole}
4. Provide a brief analysis of what this clause means

Respond in this exact JSON format:
{
  "clauses": [
    {
      "section": "Section number or identifier",
      "title": "Clause title (e.g., 'Payment Terms', 'Termination')",
      "text": "The actual text of the clause",
      "risks": [
        {
          "severity": "high|medium|low",
          "description": "Specific risk in this clause for the ${partyRole}"
        }
      ],
      "analysis": "Brief explanation of what this clause means for the ${partyRole}"
    }
  ]
}

Focus on the most important 8-12 clauses. Identify specific risks in each clause.`;

    const modelOptions = [
      'claude-3-5-sonnet-20241022',
      'claude-3-sonnet-20240229',
      'claude-3-opus-20240229',
      'claude-3-haiku-20240307'
    ];

    let response;
    for (const model of modelOptions) {
      try {
        response = await anthropic.messages.create({
          model,
          max_tokens: 3000,
          temperature: 0,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        });
        break;
      } catch (error) {
        continue;
      }
    }

    if (!response) {
      throw new Error('Failed to analyze clauses');
    }

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse the response
    let clauseData;
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        clauseData = JSON.parse(jsonMatch[0]);
      } else {
        clauseData = JSON.parse(content.text.trim());
      }
    } catch (parseError) {
      console.error('Failed to parse clause analysis:', content.text);
      throw new Error('Failed to parse clause analysis');
    }

    // Process clauses
    const clauses: Clause[] = clauseData.clauses.map((clause: any, index: number) => ({
      id: index + 1,
      section: clause.section || `Section ${index + 1}`,
      title: clause.title || 'Untitled Clause',
      text: clause.text || '',
      risks: (clause.risks || []).map((risk: any, riskIndex: number) => ({
        id: riskIndex + 1,
        category: clause.title || 'General',
        severity: risk.severity || 'medium',
        title: `Risk in ${clause.title}`,
        description: risk.description || '',
        recommendation: '',
        relatedText: clause.text
      })),
      analysis: clause.analysis || ''
    }));

    return clauses;

  } catch (error) {
    console.error('Clause analysis error:', error);
    throw error;
  }
}