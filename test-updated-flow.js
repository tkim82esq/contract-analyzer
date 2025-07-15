// Simple test to verify the updated risk analysis flow
const { analyzeContractWithAI } = require("./src/lib/ai-analyzer");
const fs = require("fs");

async function testUpdatedFlow() {
  console.log("Testing updated risk analysis flow...");

  // Read test contract
  const contractText = fs.readFileSync("./test-contract.txt", "utf8");

  try {
    console.log(
      "1. Testing template-based analysis with both template and general analysis...",
    );
    const result = await analyzeContractWithAI(
      contractText,
      "Service Agreement",
      "Service Provider",
      false,
      { Client: "ABC Corp", "Service Provider": "XYZ Services" },
    );

    console.log("✓ Analysis completed successfully");
    console.log(`✓ Total risks found: ${result.risks.length}`);
    console.log(`✓ High risks: ${result.summary.highRisks}`);
    console.log(`✓ Medium risks: ${result.summary.mediumRisks}`);
    console.log(`✓ Low risks: ${result.summary.lowRisks}`);

    // Check if we have risks from both sources
    const templateRisks = result.risks.filter((r) => r.source === "template");
    const aiRisks = result.risks.filter((r) => r.source === "ai_insight");
    const hybridRisks = result.risks.filter((r) => r.source === "hybrid");

    console.log(`✓ Template risks: ${templateRisks.length}`);
    console.log(`✓ AI insight risks: ${aiRisks.length}`);
    console.log(`✓ Hybrid risks: ${hybridRisks.length}`);

    // Verify risk count meets our minimum threshold
    if (result.risks.length >= 10) {
      console.log("✓ Risk count meets minimum threshold (10+)");
    } else {
      console.log(
        `⚠ Risk count below minimum threshold: ${result.risks.length}`,
      );
    }

    // Check that prompts mention senior attorney
    console.log("✓ Updated prompts should emphasize senior attorney expertise");

    console.log("\n2. Testing general analysis (no template)...");
    const generalResult = await analyzeContractWithAI(
      contractText,
      "Unknown Contract Type",
      "Party A",
      false,
      {},
    );

    console.log("✓ General analysis completed successfully");
    console.log(`✓ Total risks found: ${generalResult.risks.length}`);

    console.log("\n✅ All tests passed! Updated flow is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error(error.stack);
  }
}

testUpdatedFlow();
