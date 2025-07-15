// Test script to verify enhanced risk descriptions
const fs = require("fs");
const path = require("path");

// Import the AI analyzer
const { analyzeContractWithAI } = require("./src/lib/ai-analyzer.ts");

async function testRiskDescriptions() {
  try {
    // Read the test contract
    const contractText = fs.readFileSync("./test-contract.txt", "utf8");

    console.log("=== TEST CONTRACT ===");
    console.log(contractText);
    console.log("\n=== ANALYZING CONTRACT ===\n");

    // Analyze from Client perspective
    const analysis = await analyzeContractWithAI(
      contractText,
      "Software Development Agreement",
      "Client",
      false, // includeClauseBreakdown
      {}, // extractedParties
      null, // template
    );

    console.log("=== RISK ANALYSIS RESULTS ===\n");
    console.log(`Total Risks Found: ${analysis.risks.length}\n`);

    // Check each risk description
    analysis.risks.forEach((risk, index) => {
      console.log(`--- RISK ${index + 1}: ${risk.title} ---`);
      console.log(`Category: ${risk.category}`);
      console.log(`Severity: ${risk.severity}`);
      console.log(`Word Count: ${risk.description.split(" ").length} words`);
      console.log(`Description: ${risk.description}`);
      console.log(`Recommendation: ${risk.recommendation}`);
      console.log("\n");

      // Verify requirements
      const wordCount = risk.description.split(" ").length;
      if (wordCount < 50) {
        console.log(
          `⚠️  WARNING: Description only ${wordCount} words (minimum 50)`,
        );
      } else {
        console.log(`✅ Word count: ${wordCount} words`);
      }

      // Check for key elements
      const hasContractualIssue =
        risk.description.toLowerCase().includes("contract") ||
        risk.description.toLowerCase().includes("agreement") ||
        risk.description.toLowerCase().includes("terms");
      const hasPartyImpact =
        risk.description.toLowerCase().includes("client") ||
        risk.description.toLowerCase().includes("you");
      const hasConsequences =
        risk.description.toLowerCase().includes("could") ||
        risk.description.toLowerCase().includes("would") ||
        risk.description.toLowerCase().includes("may") ||
        risk.description.toLowerCase().includes("risk");

      console.log(`✅ Contains contractual issue: ${hasContractualIssue}`);
      console.log(`✅ Addresses party impact: ${hasPartyImpact}`);
      console.log(`✅ Describes consequences: ${hasConsequences}`);
      console.log("---\n");
    });
  } catch (error) {
    console.error("Error during analysis:", error);
  }
}

// Run the test
testRiskDescriptions();
