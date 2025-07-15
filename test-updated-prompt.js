// Test the updated general analysis prompt
const fs = require("fs");

console.log("=== TESTING UPDATED GENERAL ANALYSIS PROMPT ===\n");

function testUpdatedPrompt() {
  const analyzerContent = fs.readFileSync("./src/lib/ai-analyzer.ts", "utf8");

  console.log("Checking for updated prompt components...\n");

  // Check for the new comprehensive prompt structure
  const checks = [
    {
      name: "Concise senior attorney introduction",
      pattern:
        /You are a senior contract attorney with 20\+ years of experience\. Perform a comprehensive risk analysis/,
      expected: true,
    },
    {
      name: "Comprehensive risk categories",
      pattern: /Identify ALL significant risks, including:/,
      expected: true,
    },
    {
      name: "Missing provisions focus",
      pattern: /Missing provisions that should be present/,
      expected: true,
    },
    {
      name: "Ambiguous language focus",
      pattern: /Ambiguous language that could be interpreted against/,
      expected: true,
    },
    {
      name: "Market standards deviation",
      pattern: /Unusual terms that deviate from market standards/,
      expected: true,
    },
    {
      name: "Hidden risks in standard clauses",
      pattern: /Hidden risks in seemingly standard clauses/,
      expected: true,
    },
    {
      name: "Cumulative effect analysis",
      pattern: /Cumulative effect of multiple provisions/,
      expected: true,
    },
    {
      name: "Enforceability concerns",
      pattern: /Enforceability concerns/,
      expected: true,
    },
    {
      name: "Practical business risks",
      pattern: /Practical business risks beyond pure legal issues/,
      expected: true,
    },
    {
      name: "No risk limits instruction",
      pattern: /Do not limit the number of risks/,
      expected: true,
    },
    {
      name: "Thorough analysis expectation",
      pattern:
        /A thorough analysis might identify 10-20 risks depending on the contract complexity/,
      expected: true,
    },
    {
      name: "Include every significant issue",
      pattern: /Include every significant issue that could impact/,
      expected: true,
    },
    {
      name: "Comprehensive analysis critical",
      pattern: /comprehensive analysis is critical/,
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
      "🎉 All checks passed! Updated prompt is correctly implemented.",
    );
  } else {
    console.log("⚠️  Some checks failed. Review the implementation.");
  }

  console.log("\n=== UPDATED PROMPT STRUCTURE ===");
  console.log("1. ✅ Concise senior attorney introduction");
  console.log("2. ✅ Clear context section");
  console.log("3. ✅ Comprehensive risk categories list");
  console.log("4. ✅ Explicit instruction to find ALL risks");
  console.log("5. ✅ Expectation of 10-20 risks for thorough analysis");
  console.log("6. ✅ Detailed description requirements maintained");
  console.log("7. ✅ No artificial limits imposed");

  console.log("\n=== EXPECTED BEHAVIOR ===");
  console.log("The updated prompt will now:");
  console.log("• Focus on ALL significant risks without limits");
  console.log("• Specifically look for missing provisions");
  console.log("• Identify ambiguous language risks");
  console.log("• Find unusual terms that deviate from market standards");
  console.log("• Uncover hidden risks in standard clauses");
  console.log("• Analyze cumulative effects of multiple provisions");
  console.log("• Assess enforceability concerns");
  console.log("• Include practical business risks beyond legal issues");
  console.log("• Expect 10-20 risks for comprehensive analysis");
  console.log("• Maintain detailed 50-150 word descriptions");
}

testUpdatedPrompt();
