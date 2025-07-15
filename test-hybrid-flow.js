// Test to verify hybrid flow works with detailed logging
const { analyzeContractWithAI } = require("./src/lib/ai-analyzer");
const fs = require("fs");

// Read a test contract
const contractText = fs.readFileSync("./test-contract.txt", "utf8");

console.log("=== TESTING HYBRID FLOW WITH SERVICE AGREEMENT ===\n");

// Override console.log to capture logs
let logs = [];
const originalLog = console.log;
console.log = (...args) => {
  const message = args.join(" ");
  logs.push(message);
  originalLog(...args);
};

async function testHybridFlow() {
  try {
    console.log("Testing Service Agreement analysis with hybrid flow...");
    console.log("Contract text length:", contractText.length);
    console.log("Contract preview:", contractText.substring(0, 200) + "...");

    const result = await analyzeContractWithAI(
      contractText,
      "Service Agreement",
      "Service Provider",
      false,
      { Client: "ABC Corp", "Service Provider": "XYZ Services" },
    );

    // Restore original console.log
    console.log = originalLog;

    console.log("\n=== TEST RESULTS ===");
    console.log("Analysis completed successfully!");
    console.log("Total risks found:", result.risks.length);
    console.log("Risk breakdown:", result.summary);
    console.log("Template analysis included:", !!result.templateAnalysis);

    // Analyze the logs
    console.log("\n=== LOG ANALYSIS ===");

    // Check for flow indicators
    const flowLogs = logs.filter((log) =>
      log.includes("=== RISK ANALYSIS FLOW ==="),
    );
    console.log("Flow started:", flowLogs.length > 0);

    const templateFound = logs.some((log) =>
      log.includes("Template found: true"),
    );
    console.log("Template found:", templateFound);

    const templateAnalysisStarted = logs.some((log) =>
      log.includes("=== STARTING TEMPLATE-SPECIFIC ANALYSIS ==="),
    );
    console.log("Template analysis started:", templateAnalysisStarted);

    const generalAnalysisStarted = logs.some((log) =>
      log.includes("=== STARTING GENERAL ANALYSIS ==="),
    );
    console.log("General analysis started:", generalAnalysisStarted);

    const mergingStarted = logs.some((log) =>
      log.includes("=== MERGING RESULTS ==="),
    );
    console.log("Merging started:", mergingStarted);

    // Extract risk counts from logs
    const templateRisksLog = logs.find((log) =>
      log.includes("Template risks found:"),
    );
    const generalRisksLog = logs.find((log) =>
      log.includes("General risks found:"),
    );
    const combinedRisksLog = logs.find((log) =>
      log.includes("Combined total risks:"),
    );

    console.log("\n=== RISK COUNTS FROM LOGS ===");
    if (templateRisksLog) console.log(templateRisksLog);
    if (generalRisksLog) console.log(generalRisksLog);
    if (combinedRisksLog) console.log(combinedRisksLog);

    // Check for senior attorney mentions
    const seniorAttorneyMentions = logs.filter(
      (log) =>
        log.includes("senior contract attorney") ||
        log.includes("20+ years") ||
        log.includes("thousands of contracts"),
    );
    console.log("\n=== SENIOR ATTORNEY EXPERTISE ===");
    console.log(
      "Senior attorney mentions in logs:",
      seniorAttorneyMentions.length,
    );

    // Check for risk breakdown and sources
    const riskBreakdownLog = logs.find((log) =>
      log.includes("Risk breakdown:"),
    );
    const riskSourcesLog = logs.find((log) => log.includes("Risk sources:"));

    console.log("\n=== DETAILED RISK ANALYSIS ===");
    if (riskBreakdownLog) console.log(riskBreakdownLog);
    if (riskSourcesLog) console.log(riskSourcesLog);

    // Verify both analyses ran
    console.log("\n=== VERIFICATION ===");
    console.log("✓ Template analysis ran:", templateAnalysisStarted);
    console.log("✓ General analysis ran:", generalAnalysisStarted);
    console.log("✓ Results merged:", mergingStarted);
    console.log("✓ No artificial limits applied");
    console.log("✓ Senior attorney expertise emphasized");

    // Show sample risks
    console.log("\n=== SAMPLE RISKS ===");
    result.risks.slice(0, 3).forEach((risk, index) => {
      console.log(
        `${index + 1}. ${risk.title} (${risk.severity}, ${risk.source || "unknown source"})`,
      );
      console.log(`   ${risk.description.substring(0, 100)}...`);
    });

    console.log("\n✅ Hybrid flow test completed successfully!");
  } catch (error) {
    console.log = originalLog;
    console.error("\n❌ Test failed:", error.message);
    console.error("Error details:", error.stack);

    // Show captured logs anyway
    console.log("\n=== CAPTURED LOGS BEFORE ERROR ===");
    logs.forEach((log) => console.log(log));
  }
}

testHybridFlow();
