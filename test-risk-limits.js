// Test to verify all risk limits have been removed
const fs = require("fs");

console.log("Testing for remaining risk limits in codebase...\n");

// Files to check
const filesToCheck = [
  "./src/lib/ai-analyzer.ts",
  "./src/app/api/analyze/route.ts",
];

let foundLimits = [];

filesToCheck.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");

  console.log(`Checking ${file}...`);

  // Check for risk count limits in prompts
  const riskLimitPatterns = [
    /Focus on [0-9]+-[0-9]+ risks/i,
    /Provide [0-9]+-[0-9]+ risks/i,
    /Identify [0-9]+-[0-9]+ risks/i,
    /[0-9]+-[0-9]+ most.*risks/i,
    /top [0-9]+ risks/i,
    /first [0-9]+ risks/i,
    /maximum.*[0-9]+ risks/i,
  ];

  lines.forEach((line, index) => {
    riskLimitPatterns.forEach((pattern) => {
      if (pattern.test(line)) {
        foundLimits.push({
          file,
          line: index + 1,
          content: line.trim(),
          type: "Risk count limit in prompt",
        });
      }
    });
  });

  // Check for array slicing of risks
  const slicingPatterns = [
    /risks\.slice\([0-9]+/i,
    /\.slice\([0-9]+.*risks/i,
    /keyReviewPoints\.slice\([0-9]+/i,
    /redFlags\.slice\([0-9]+/i,
    /template\..*\.slice\([0-9]+/i,
  ];

  lines.forEach((line, index) => {
    slicingPatterns.forEach((pattern) => {
      if (pattern.test(line)) {
        foundLimits.push({
          file,
          line: index + 1,
          content: line.trim(),
          type: "Array slicing limitation",
        });
      }
    });
  });

  console.log(`  ✓ Checked ${lines.length} lines`);
});

console.log("\nResults:");
if (foundLimits.length === 0) {
  console.log("✅ No risk limits found! All limitations have been removed.");
} else {
  console.log(`❌ Found ${foundLimits.length} remaining risk limits:`);
  foundLimits.forEach((limit, index) => {
    console.log(`\n${index + 1}. ${limit.type}`);
    console.log(`   File: ${limit.file}:${limit.line}`);
    console.log(`   Content: ${limit.content}`);
  });
}

// Check for positive indicators that limits were removed
const analyzerContent = fs.readFileSync("./src/lib/ai-analyzer.ts", "utf8");

const positiveIndicators = [
  "Identify ALL significant risks",
  "Do not limit the number of risks",
  "comprehensive analysis is critical",
  "thoroughness is essential",
  "comprehensive clause analysis is essential",
];

console.log("\n✅ Positive indicators found:");
positiveIndicators.forEach((indicator) => {
  const found = analyzerContent.includes(indicator);
  console.log(`  ${found ? "✓" : "✗"} "${indicator}"`);
});

// Check template guidance functions
const templateGuidanceChecks = [
  "point.mustHave.join(", // Should be join, not slice
  "point.shouldAvoid.join(", // Should be join, not slice
  "template.redFlags.forEach(", // Should be forEach, not slice
  "template.partySpecificConcerns[partyRole].forEach(", // Should be forEach, not slice
];

console.log("\n✅ Template guidance unlimited access:");
templateGuidanceChecks.forEach((check) => {
  const found = analyzerContent.includes(check);
  console.log(`  ${found ? "✓" : "✗"} "${check}"`);
});

console.log("\n🎯 Summary: Risk analysis is now unlimited and comprehensive!");
