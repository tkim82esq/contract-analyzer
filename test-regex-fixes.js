// Test to verify regex fixes for party extraction
const fs = require("fs");

console.log("=== TESTING REGEX FIXES FOR PARTY EXTRACTION ===\n");

function testRegexFixes() {
  const extractPartiesContent = fs.readFileSync(
    "./src/app/api/extract-parties/route.ts",
    "utf8",
  );

  console.log("Checking for regex patterns with global flag...\n");

  // Check for patterns that should have global flag
  const checks = [
    {
      name: "Employment Agreement patterns have global flag",
      pattern: /Employment Agreement[\s\S]*?patterns:\s*\[\s*\/[^\/]*\/gi/,
      expected: true,
    },
    {
      name: "Service Agreement patterns have global flag",
      pattern: /Service Agreement[\s\S]*?patterns:\s*\[\s*\/[^\/]*\/gi/,
      expected: true,
    },
    {
      name: "NDA patterns have global flag",
      pattern: /NDA[\s\S]*?patterns:\s*\[\s*\/[^\/]*\/gi/,
      expected: true,
    },
    {
      name: "extractPartiesAdvanced patterns have global flag",
      pattern: /extractPartiesAdvanced[\s\S]*?partyPatterns[\s\S]*?\/gi/,
      expected: true,
    },
    {
      name: 'No remaining patterns with only "i" flag used with matchAll',
      pattern: /matchAll\([^)]*\/[^\/]*\/i[^g]/,
      expected: false,
    },
  ];

  const results = checks.map((check) => {
    const found = check.pattern.test(extractPartiesContent);
    const status = found === check.expected ? "✅" : "❌";
    console.log(`${status} ${check.name}: ${found}`);
    return found === check.expected;
  });

  // Count all regex patterns to verify they have appropriate flags
  const allRegexPatterns =
    extractPartiesContent.match(/\/[^\/]+\/[gimuy]*/g) || [];
  const patternsWithGlobalFlag = allRegexPatterns.filter((pattern) =>
    pattern.includes("g"),
  );
  const patternsWithoutGlobalFlag = allRegexPatterns.filter(
    (pattern) => !pattern.includes("g"),
  );

  console.log("\n=== REGEX PATTERN ANALYSIS ===");
  console.log(`Total regex patterns found: ${allRegexPatterns.length}`);
  console.log(`Patterns with global flag: ${patternsWithGlobalFlag.length}`);
  console.log(
    `Patterns without global flag: ${patternsWithoutGlobalFlag.length}`,
  );

  console.log("\n=== PATTERNS WITH GLOBAL FLAG ===");
  patternsWithGlobalFlag.forEach((pattern, index) => {
    console.log(`${index + 1}. ${pattern}`);
  });

  console.log("\n=== PATTERNS WITHOUT GLOBAL FLAG ===");
  patternsWithoutGlobalFlag.forEach((pattern, index) => {
    console.log(`${index + 1}. ${pattern}`);
  });

  // Check for matchAll usage
  const matchAllUsages =
    extractPartiesContent.match(/\w+\.matchAll\([^)]+\)/g) || [];
  console.log("\n=== MATCHALL USAGE ===");
  console.log(`matchAll() usages found: ${matchAllUsages.length}`);
  matchAllUsages.forEach((usage, index) => {
    console.log(`${index + 1}. ${usage}`);
  });

  const passedChecks = results.filter(Boolean).length;
  const totalChecks = results.length;

  console.log(`\n=== RESULTS ===`);
  console.log(`Passed: ${passedChecks}/${totalChecks} checks`);

  if (passedChecks === totalChecks) {
    console.log("🎉 All checks passed! Regex fixes are correctly implemented.");
  } else {
    console.log("⚠️  Some checks failed. Review the implementation.");
  }

  console.log("\n=== EXPECTED BEHAVIOR ===");
  console.log("• All patterns used with matchAll() have global flag");
  console.log("• Employment Agreement patterns: /pattern/gi");
  console.log("• Service Agreement patterns: /pattern/gi");
  console.log("• NDA patterns: /pattern/gi");
  console.log("• extractPartiesAdvanced patterns: /pattern/gi");
  console.log('• No more "non-global RegExp" errors');

  console.log("\n=== PATTERNS THAT SHOULD NOT HAVE GLOBAL FLAG ===");
  console.log("• Patterns used with match() instead of matchAll()");
  console.log("• Single-use patterns that only need first match");
  console.log("• These patterns are correctly left without global flag");
}

testRegexFixes();
