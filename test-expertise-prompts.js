// Test to verify the updated expertise-focused prompts
const fs = require("fs");

// Read the ai-analyzer.ts file to verify prompt updates
const analyzerContent = fs.readFileSync("./src/lib/ai-analyzer.ts", "utf8");

console.log("Testing updated AI prompts for senior attorney expertise...\n");

// Test 1: Check if all prompts start with the enhanced expertise description
const expertisePattern =
  /You are a senior contract attorney with 20\+ years of experience reviewing, drafting, and negotiating commercial contracts\. You have seen thousands of contracts and understand both the legal implications and business realities of contract terms\./g;
const matches = analyzerContent.match(expertisePattern);

console.log(
  "✓ Enhanced expertise descriptions found:",
  matches ? matches.length : 0,
);

// Test 2: Check for key expertise indicators
const expertiseIndicators = [
  "deep understanding of market standards",
  "court interpretations",
  "negotiation leverage points",
  "industry-specific nuances",
  "business realities",
  "legal precedents",
  "thousands of contracts",
  "sophisticated parties",
  "experienced counsel",
];

console.log("✓ Key expertise indicators found:");
expertiseIndicators.forEach((indicator) => {
  const found = analyzerContent.includes(indicator);
  console.log(`  ${found ? "✓" : "✗"} "${indicator}"`);
});

// Test 3: Check for market standards and court precedent references
const marketStandardsRefs = [
  "market standards",
  "court precedents",
  "industry benchmarks",
  "market knowledge",
  "precedent analysis",
  "business reality",
  "negotiation experience",
];

console.log("\n✓ Market standards and precedent references:");
marketStandardsRefs.forEach((ref) => {
  const count = (analyzerContent.match(new RegExp(ref, "gi")) || []).length;
  console.log(`  ${count > 0 ? "✓" : "✗"} "${ref}" (${count} occurrences)`);
});

// Test 4: Check for business-focused analysis instructions
const businessFocusIndicators = [
  "business-focused",
  "business realities",
  "commercial implications",
  "business strategy",
  "business problems",
  "business impact",
  "practical enforceability",
  "business relationships",
];

console.log("\n✓ Business-focused analysis indicators:");
businessFocusIndicators.forEach((indicator) => {
  const count = (analyzerContent.match(new RegExp(indicator, "gi")) || [])
    .length;
  console.log(
    `  ${count > 0 ? "✓" : "✗"} "${indicator}" (${count} occurrences)`,
  );
});

// Test 5: Verify all prompts are updated
const promptStartPatterns = [
  /const prompt = `You are a senior contract attorney with 20\+ years of experience/g,
  /const prompt = `You are a senior contract attorney with 20\+ years of experience/g,
];

const promptCount = (analyzerContent.match(/const prompt = `/g) || []).length;
const expertisePromptCount = (
  analyzerContent.match(
    /You are a senior contract attorney with 20\+ years of experience/g,
  ) || []
).length;

console.log(`\n✓ Total prompts found: ${promptCount}`);
console.log(`✓ Prompts with enhanced expertise: ${expertisePromptCount}`);
console.log(
  `✓ Coverage: ${expertisePromptCount === promptCount ? "Complete" : "Partial"} (${expertisePromptCount}/${promptCount})`,
);

console.log("\n✅ Prompt expertise analysis complete!");
