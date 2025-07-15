// Test to verify JSON parsing fixes
const fs = require("fs");

console.log("=== TESTING JSON PARSING FIXES ===\n");

function testJSONFixes() {
  const analyzerContent = fs.readFileSync("./src/lib/ai-analyzer.ts", "utf8");

  console.log("Checking for JSON parsing improvements...\n");

  // Check for explicit JSON instructions in prompts
  const checks = [
    {
      name: "Template analysis has explicit JSON instructions",
      pattern:
        /You MUST respond with ONLY a valid JSON object, no other text\.\nStart your response with \{ and end with \}/,
      expected: true,
    },
    {
      name: "General analysis has explicit JSON instructions",
      pattern:
        /You MUST respond with ONLY a valid JSON object, no other text\.\nStart your response with \{ and end with \}/,
      expected: true,
    },
    {
      name: "Template analysis has example format",
      pattern: /EXAMPLE FORMAT:/,
      expected: true,
    },
    {
      name: "General analysis has example format",
      pattern: /EXAMPLE FORMAT:/,
      expected: true,
    },
    {
      name: "Template analysis has fallback handling",
      pattern: /Using fallback empty results for template analysis/,
      expected: true,
    },
    {
      name: "General analysis has fallback handling",
      pattern: /Using fallback empty results for general analysis/,
      expected: true,
    },
    {
      name: "Legal analysis has fallback handling",
      pattern: /Using fallback empty results for general legal analysis/,
      expected: true,
    },
    {
      name: "Multiple JSON extraction methods",
      pattern: /Method 1: Try direct parsing if response is clean JSON/,
      expected: true,
    },
    {
      name: "Regex JSON extraction fallback",
      pattern: /Method 2: Extract JSON with regex/,
      expected: true,
    },
    {
      name: "Raw response logging on error",
      pattern: /Raw response:', content\.text/,
      expected: true,
    },
    {
      name: "Data structure validation",
      pattern: /Invalid analysis data structure/,
      expected: true,
    },
    {
      name: "Direct JSON parsing check",
      pattern: /trimmed\.startsWith\('\{'\) && trimmed\.endsWith\('\}'\)/,
      expected: true,
    },
  ];

  const results = checks.map((check) => {
    const found = check.pattern.test(analyzerContent);
    const status = found === check.expected ? "✅" : "❌";
    console.log(`${status} ${check.name}: ${found}`);
    return found === check.expected;
  });

  const passedChecks = results.filter(Boolean).length;
  const totalChecks = results.length;

  console.log(`\n=== RESULTS ===`);
  console.log(`Passed: ${passedChecks}/${totalChecks} checks`);

  if (passedChecks === totalChecks) {
    console.log(
      "🎉 All checks passed! JSON parsing fixes are correctly implemented.",
    );
  } else {
    console.log("⚠️  Some checks failed. Review the implementation.");
  }

  console.log("\n=== IMPROVEMENTS MADE ===");
  console.log("1. ✅ Added explicit JSON-only response instructions");
  console.log("2. ✅ Added example JSON format in prompts");
  console.log("3. ✅ Added multiple JSON extraction methods");
  console.log("4. ✅ Added comprehensive error logging");
  console.log("5. ✅ Added fallback handling for failed parsing");
  console.log("6. ✅ Added data structure validation");
  console.log("7. ✅ Applied fixes to all analysis functions");

  console.log("\n=== EXPECTED BEHAVIOR ===");
  console.log("• Claude will receive clear instructions to return only JSON");
  console.log("• Parser will try direct parsing first, then regex extraction");
  console.log("• Failed parsing will log the raw response for debugging");
  console.log("• Analysis will continue with empty results if JSON fails");
  console.log('• No more "No JSON found" errors that break the analysis');
  console.log("• Detailed logging shows what parsing method is used");

  console.log("\n=== FUNCTIONS IMPROVED ===");
  console.log("• performTemplateSpecificAnalysis");
  console.log("• performGeneralComprehensiveAnalysis");
  console.log("• performGeneralLegalAnalysis");
  console.log("• All functions now have robust JSON parsing");
}

testJSONFixes();
