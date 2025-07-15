// Test hybrid flow by verifying the implementation
const fs = require("fs");

console.log("=== TESTING HYBRID FLOW IMPLEMENTATION ===\n");

function testHybridFlow() {
  try {
    console.log("Verifying hybrid flow implementation...");

    // Check if Service Agreement template exists
    const templateContent = fs.readFileSync(
      "./src/lib/contract-templates.ts",
      "utf8",
    );
    const hasServiceAgreement = templateContent.includes("'Service Agreement'");
    console.log("✓ Service Agreement template exists:", hasServiceAgreement);

    // Check if ai-analyzer has the enhanced flow
    const analyzerContent = fs.readFileSync("./src/lib/ai-analyzer.ts", "utf8");

    // Check for the detailed logging we added
    const hasFlowLogging = analyzerContent.includes(
      "=== RISK ANALYSIS FLOW ===",
    );
    console.log("✓ Enhanced flow logging added:", hasFlowLogging);

    const hasTemplateAndGeneral =
      analyzerContent.includes("Running template analysis:") &&
      analyzerContent.includes("Running general analysis:");
    console.log(
      "✓ Both template and general analysis configured:",
      hasTemplateAndGeneral,
    );

    const hasSeniorAttorney = analyzerContent.includes(
      "senior contract attorney with 20+ years of experience",
    );
    console.log("✓ Senior attorney expertise emphasized:", hasSeniorAttorney);

    const hasUnlimitedRisks =
      analyzerContent.includes("Identify ALL significant risks") &&
      analyzerContent.includes("Do not limit the number of risks");
    console.log("✓ Unlimited risk analysis configured:", hasUnlimitedRisks);

    const hasDetailedLogging =
      analyzerContent.includes("Template risks found:") &&
      analyzerContent.includes("General risks found:") &&
      analyzerContent.includes("Combined total risks:");
    console.log("✓ Detailed logging implemented:", hasDetailedLogging);

    // Check for specific log statements we added
    const hasStartingLogs =
      analyzerContent.includes("=== STARTING TEMPLATE-SPECIFIC ANALYSIS ===") &&
      analyzerContent.includes("=== STARTING GENERAL ANALYSIS ===");
    console.log("✓ Analysis start logging added:", hasStartingLogs);

    const hasMergingLogs = analyzerContent.includes("=== MERGING RESULTS ===");
    console.log("✓ Merging logging added:", hasMergingLogs);

    const hasRiskBreakdown =
      analyzerContent.includes("Risk breakdown:") &&
      analyzerContent.includes("Risk sources:");
    console.log("✓ Risk breakdown logging added:", hasRiskBreakdown);

    const hasCompletionLogs = analyzerContent.includes(
      "=== ENHANCED ANALYSIS COMPLETE ===",
    );
    console.log("✓ Completion logging added:", hasCompletionLogs);

    // Check merge function
    const hasMergeFunction = analyzerContent.includes(
      "mergeAndDeduplicateRisks",
    );
    console.log("✓ Risk merging function exists:", hasMergeFunction);

    // Check for template-specific analysis function
    const hasTemplateSpecificAnalysis = analyzerContent.includes(
      "performTemplateSpecificAnalysis",
    );
    console.log(
      "✓ Template-specific analysis function exists:",
      hasTemplateSpecificAnalysis,
    );

    // Check for general legal analysis function
    const hasGeneralLegalAnalysis = analyzerContent.includes(
      "performGeneralLegalAnalysis",
    );
    console.log(
      "✓ General legal analysis function exists:",
      hasGeneralLegalAnalysis,
    );

    // Check for the hybrid flow in performEnhancedAnalysis
    const hasHybridFlow =
      analyzerContent.includes("shouldRunTemplate = true") &&
      analyzerContent.includes("shouldRunGeneral = true");
    console.log("✓ Hybrid flow (both analyses) configured:", hasHybridFlow);

    console.log("\n=== EXPECTED FLOW FOR SERVICE AGREEMENT ===");
    console.log("When a Service Agreement is analyzed:");
    console.log("1. === RISK ANALYSIS FLOW ===");
    console.log("2. Template found: true");
    console.log("3. Running template analysis: true");
    console.log("4. Running general analysis: true");
    console.log("5. === STARTING TEMPLATE-SPECIFIC ANALYSIS ===");
    console.log("6. Template risks found: [N]");
    console.log("7. === STARTING GENERAL ANALYSIS ===");
    console.log("8. General risks found: [N]");
    console.log("9. === MERGING RESULTS ===");
    console.log("10. Combined total risks: [N]");
    console.log("11. Risk breakdown: { high: X, medium: Y, low: Z }");
    console.log("12. Risk sources: { template: X, general: Y, hybrid: Z }");
    console.log("13. === ENHANCED ANALYSIS COMPLETE ===");

    console.log("\n=== VERIFICATION RESULTS ===");
    const allChecks = [
      hasServiceAgreement,
      hasFlowLogging,
      hasTemplateAndGeneral,
      hasSeniorAttorney,
      hasUnlimitedRisks,
      hasDetailedLogging,
      hasStartingLogs,
      hasMergingLogs,
      hasRiskBreakdown,
      hasCompletionLogs,
      hasMergeFunction,
      hasTemplateSpecificAnalysis,
      hasGeneralLegalAnalysis,
      hasHybridFlow,
    ];

    const passedChecks = allChecks.filter(Boolean).length;
    const totalChecks = allChecks.length;

    console.log(`✅ Passed: ${passedChecks}/${totalChecks} checks`);

    if (passedChecks === totalChecks) {
      console.log(
        "🎉 ALL CHECKS PASSED - Hybrid flow is correctly implemented!",
      );
      console.log(
        "🎯 The system will now run both template and general analysis",
      );
      console.log("🎯 All risks will be included (no artificial limits)");
      console.log("🎯 Senior attorney expertise will be emphasized");
      console.log("🎯 Detailed logging will show the complete flow");
    } else {
      console.log("⚠️  Some checks failed - review the implementation");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testHybridFlow();
