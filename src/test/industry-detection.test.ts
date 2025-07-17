// Simple test file to validate industry detection accuracy
import { industryDetectionEngine } from '../lib/industry-detection';

// Test cases for different industries
const testCases = [
  {
    name: 'Technology SaaS Contract',
    contractText: `
      This Software as a Service Agreement governs the use of our cloud-based platform.
      The software will provide API access and data processing capabilities.
      Customer data will be encrypted and stored securely in compliance with SOC 2 standards.
      Service Level Agreement guarantees 99.9% uptime.
    `,
    contractType: 'SaaS Agreement',
    companyNames: ['TechCorp Inc.', 'DataSystems LLC'],
    expectedIndustry: 'tech-software',
    minConfidence: 0.7
  },
  {
    name: 'Healthcare Provider Agreement',
    contractText: `
      This Medical Services Agreement establishes the terms for providing clinical care.
      Provider shall maintain compliance with HIPAA regulations for patient data protection.
      Medical records and protected health information must be secured according to federal requirements.
      Emergency care protocols and physician responsibilities are outlined herein.
    `,
    contractType: 'Medical Services Agreement',
    companyNames: ['Regional Medical Center', 'Healthcare Partners'],
    expectedIndustry: 'healthcare',
    minConfidence: 0.8
  },
  {
    name: 'Financial Services Contract',
    contractText: `
      This Investment Services Agreement governs banking and financial advisory services.
      Compliance with SEC regulations and FINRA requirements is mandatory.
      Payment processing and anti-money laundering procedures must be followed.
      Fiduciary duties and investment recommendations are subject to regulatory oversight.
    `,
    contractType: 'Investment Services Agreement',
    companyNames: ['Capital Financial', 'Investment Bank Corp'],
    expectedIndustry: 'financial-services',
    minConfidence: 0.7
  },
  {
    name: 'Manufacturing Supply Agreement',
    contractText: `
      This Manufacturing Agreement covers the production and delivery of industrial components.
      Quality control standards and ISO certification requirements apply to all products.
      Environmental compliance with EPA regulations is mandatory for all manufacturing processes.
      Product liability insurance and safety standards must be maintained throughout production.
    `,
    contractType: 'Manufacturing Agreement',
    companyNames: ['Industrial Manufacturing Co.', 'Production Systems Inc.'],
    expectedIndustry: 'manufacturing',
    minConfidence: 0.6
  },
  {
    name: 'Real Estate Lease',
    contractText: `
      This Commercial Lease Agreement establishes terms for property rental.
      Fair housing compliance and ADA accessibility requirements must be met.
      Property management responsibilities include maintenance and tenant relations.
      Zoning compliance and local building codes apply to all property uses.
    `,
    contractType: 'Lease Agreement',
    companyNames: ['Metro Properties', 'Commercial Realty Group'],
    expectedIndustry: 'real-estate',
    minConfidence: 0.6
  }
];

// Run tests
console.log('=== INDUSTRY DETECTION ACCURACY TESTS ===\n');

let totalTests = 0;
let passedTests = 0;

for (const testCase of testCases) {
  totalTests++;
  console.log(`Testing: ${testCase.name}`);
  
  try {
    const result = industryDetectionEngine.detectIndustry(
      testCase.contractText,
      testCase.contractType,
      testCase.companyNames
    );
    
    if (!result) {
      console.log(`❌ FAIL: No industry detected`);
      console.log(`   Expected: ${testCase.expectedIndustry} (min confidence: ${testCase.minConfidence})`);
      console.log('');
      continue;
    }
    
    const { industryId, confidence, matchedIndicators } = result;
    
    console.log(`   Detected: ${result.industryName} (${industryId})`);
    console.log(`   Confidence: ${(confidence * 100).toFixed(1)}%`);
    console.log(`   Matched indicators:`, {
      keywords: matchedIndicators.keywords.length,
      contractTypes: matchedIndicators.contractTypes.length,
      companyIndicators: matchedIndicators.companyIndicators.length,
      regulatoryFrameworks: matchedIndicators.regulatoryFrameworks.length
    });
    
    // Check if test passes
    const industryMatch = industryId === testCase.expectedIndustry;
    const confidenceMatch = confidence >= testCase.minConfidence;
    
    if (industryMatch && confidenceMatch) {
      console.log(`✅ PASS`);
      passedTests++;
    } else {
      console.log(`❌ FAIL:`);
      if (!industryMatch) {
        console.log(`   Industry mismatch: expected ${testCase.expectedIndustry}, got ${industryId}`);
      }
      if (!confidenceMatch) {
        console.log(`   Low confidence: expected ${testCase.minConfidence}, got ${confidence.toFixed(3)}`);
      }
    }
    
    // Show validation quality
    const quality = industryDetectionEngine.validateDetectionQuality(result);
    console.log(`   Quality Score: ${(quality.qualityScore * 100).toFixed(1)}%`);
    if (quality.recommendations.length > 0) {
      console.log(`   Recommendations: ${quality.recommendations[0]}`);
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error}`);
  }
  
  console.log('');
}

console.log('=== TEST RESULTS ===');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Accuracy: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

// Test edge cases
console.log('\n=== EDGE CASE TESTS ===');

// Test with empty contract
const emptyResult = industryDetectionEngine.detectIndustry('', '', []);
console.log('Empty contract detection:', emptyResult ? 'Detected something (unexpected)' : 'No detection (expected)');

// Test with ambiguous contract
const ambiguousResult = industryDetectionEngine.detectIndustry(
  'This agreement establishes terms for business services and general operations.',
  'Service Agreement',
  ['Business Corp']
);
console.log('Ambiguous contract detection:');
if (ambiguousResult) {
  console.log(`  Detected: ${ambiguousResult.industryName} (confidence: ${(ambiguousResult.confidence * 100).toFixed(1)}%)`);
} else {
  console.log('  No confident detection (expected for ambiguous content)');
}

// Test fallback pattern
const fallbackPattern = industryDetectionEngine.getIndustryPattern('nonexistent-industry');
console.log(`Fallback pattern: ${fallbackPattern.identification.industryName}`);

export { testCases }; // Export for potential use in other tests