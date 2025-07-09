// Test script to verify party-specific analysis
// Run this with: node test-party-analysis.js

const fs = require('fs');

// Test contract - a simple employment agreement with clear party-specific implications
const testContract = `EMPLOYMENT AGREEMENT

1. POSITION: Employee will serve as Software Engineer with duties as assigned by Employer.

2. COMPENSATION: 
- Base salary: $100,000/year
- Bonus: At Employer's sole discretion
- Stock options: 10,000 shares vesting over 4 years, forfeited if terminated for any reason

3. TERMINATION:
- This is at-will employment
- Employer may terminate without cause or notice
- Employee must give 30 days notice
- All unvested options forfeited upon termination

4. NON-COMPETE:
- Employee cannot work for competitors for 2 years after termination
- Covers entire United States
- No geographic limitation based on actual work location

5. INTELLECTUAL PROPERTY:
- All work belongs to Employer
- Includes work done outside business hours
- Includes ideas conceived during employment

6. CONFIDENTIALITY:
- Perpetual confidentiality obligation
- No expiration after termination`;

// Test function
async function testPartySpecificAnalysis() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing party-specific analysis...\n');
  
  // Test 1: Analyze as Employee
  console.log('=== TEST 1: Analyzing as EMPLOYEE ===');
  const employeeAnalysis = await analyzeContract('Employee');
  displayResults('Employee', employeeAnalysis);
  
  // Test 2: Analyze as Employer
  console.log('\n=== TEST 2: Analyzing as EMPLOYER ===');
  const employerAnalysis = await analyzeContract('Employer');
  displayResults('Employer', employerAnalysis);
  
  // Compare results
  console.log('\n=== COMPARISON ===');
  compareAnalyses(employeeAnalysis, employerAnalysis);
}

async function analyzeContract(partyRole) {
  // Create a file from the test contract
  const formData = new FormData();
  const blob = new Blob([testContract], { type: 'text/plain' });
  formData.append('file', blob, 'test-employment.txt');
  formData.append('contractType', 'Employment Agreement');
  formData.append('partyRole', partyRole);
  
  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to analyze as ${partyRole}:`, error);
    return null;
  }
}

function displayResults(role, analysis) {
  if (!analysis || !analysis.risks) {
    console.log(`No analysis results for ${role}`);
    return;
  }
  
  console.log(`\nRisks identified for ${role}:`);
  console.log(`Total: ${analysis.summary.totalRisks}, High: ${analysis.summary.highRisks}, Medium: ${analysis.summary.mediumRisks}`);
  
  analysis.risks.forEach((risk, index) => {
    console.log(`\n${index + 1}. ${risk.title} (${risk.severity.toUpperCase()})`);
    console.log(`   Category: ${risk.category}`);
    console.log(`   Description: ${risk.description}`);
    console.log(`   Recommendation: ${risk.recommendation}`);
  });
}

function compareAnalyses(employeeAnalysis, employerAnalysis) {
  if (!employeeAnalysis || !employerAnalysis) {
    console.log('Cannot compare - missing analysis data');
    return;
  }
  
  // Extract risk categories
  const employeeCategories = new Set(employeeAnalysis.risks.map(r => r.category));
  const employerCategories = new Set(employerAnalysis.risks.map(r => r.category));
  
  console.log('Employee risk categories:', Array.from(employeeCategories).join(', '));
  console.log('Employer risk categories:', Array.from(employerCategories).join(', '));
  
  // Look for opposing perspectives on same clauses
  console.log('\nDifferences in perspective:');
  
  // Check if non-compete is seen differently
  const employeeNonCompete = employeeAnalysis.risks.find(r => 
    r.title.toLowerCase().includes('non-compete') || 
    r.description.toLowerCase().includes('non-compete')
  );
  const employerNonCompete = employerAnalysis.risks.find(r => 
    r.title.toLowerCase().includes('non-compete') || 
    r.description.toLowerCase().includes('non-compete')
  );
  
  if (employeeNonCompete && !employerNonCompete) {
    console.log('- Non-compete is a risk for Employee but not flagged for Employer');
  } else if (!employeeNonCompete && employerNonCompete) {
    console.log('- Non-compete is a risk for Employer but not flagged for Employee');
  }
  
  // Check termination clause perspectives
  const employeeTermination = employeeAnalysis.risks.find(r => 
    r.category === 'Termination' || r.title.toLowerCase().includes('terminat')
  );
  const employerTermination = employerAnalysis.risks.find(r => 
    r.category === 'Termination' || r.title.toLowerCase().includes('terminat')
  );
  
  if (employeeTermination && employerTermination) {
    console.log('\nTermination clause perspectives:');
    console.log(`- Employee: ${employeeTermination.description}`);
    console.log(`- Employer: ${employerTermination.description}`);
  }
}

// Note: This test requires fetch API which isn't available in Node.js by default
console.log('To run this test:');
console.log('1. Make sure the dev server is running (npm run dev)');
console.log('2. Open this file in a browser console or use a tool like Postman');
console.log('3. Or install node-fetch: npm install node-fetch');