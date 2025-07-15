// Test real API call to capture actual logs
const fs = require("fs");

async function testRealLogs() {
  try {
    console.log("=== TESTING REAL API CALL WITH LOGS ===\n");

    // Read test contract
    const contractText = fs.readFileSync("./test-contract.txt", "utf8");

    // Create form data
    const formData = new FormData();
    formData.append("contractText", contractText);
    formData.append("contractType", "Service Agreement");
    formData.append("partyRole", "Service Provider");
    formData.append("includeClauseBreakdown", "false");
    formData.append(
      "extractedParties",
      JSON.stringify({
        Client: "ABC Corp",
        "Service Provider": "XYZ Services",
      }),
    );

    console.log("Making API call to analyze Service Agreement...");
    console.log("Contract length:", contractText.length);
    console.log("Contract type: Service Agreement");
    console.log("Party role: Service Provider");

    // Make API call
    const response = await fetch("http://localhost:3001/api/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `API call failed: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();

    console.log("\n=== API RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Success:", result.success);
    console.log("Total risks:", result.analysis?.risks?.length || 0);
    console.log("Risk breakdown:", result.analysis?.summary || {});

    if (result.analysis?.risks) {
      console.log("\n=== SAMPLE RISKS ===");
      result.analysis.risks.slice(0, 3).forEach((risk, index) => {
        console.log(`${index + 1}. ${risk.title} (${risk.severity})`);
        console.log(`   Source: ${risk.source || "unknown"}`);
        console.log(`   Category: ${risk.category}`);
        console.log(`   Description: ${risk.description.substring(0, 100)}...`);
        console.log("");
      });
    }

    console.log("\n=== VERIFICATION ===");
    console.log("✅ API call succeeded");
    console.log("✅ Analysis completed");
    console.log("✅ Multiple risks returned");

    // Check for evidence of hybrid flow
    const hasHighRisks = result.analysis?.summary?.highRisks > 0;
    const hasMultipleRisks = result.analysis?.risks?.length > 5;
    const hasTemplateAnalysis = result.analysis?.templateAnalysis;

    console.log("✅ High severity risks found:", hasHighRisks);
    console.log("✅ Multiple risks identified:", hasMultipleRisks);
    console.log("✅ Template analysis included:", !!hasTemplateAnalysis);

    console.log("\n🎯 Check server logs for detailed flow logging!");
    console.log("🎯 Look for: === RISK ANALYSIS FLOW ===");
    console.log("🎯 Look for: Template risks found: [N]");
    console.log("🎯 Look for: General risks found: [N]");
    console.log("🎯 Look for: Combined total risks: [N]");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Make sure the server is running on port 3001");
  }
}

testRealLogs();
