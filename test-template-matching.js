// Simple test script to demonstrate template matching functionality
const {
  templateMatcher,
  findTemplateMatches,
  calculateSimilarityScore,
} = require("./src/lib/contract-templates.ts");

console.log("=== Template Matching Test ===\n");

// Test exact matches
console.log("1. Exact Matches:");
console.log(
  "Employment Agreement:",
  templateMatcher("Employment Agreement")?.matchType,
);
console.log(
  "Service Agreement:",
  templateMatcher("Service Agreement")?.matchType,
);
console.log("NDA:", templateMatcher("NDA")?.matchType);

// Test alias matches
console.log("\n2. Alias Matches:");
console.log(
  "Job Agreement:",
  templateMatcher("Job Agreement")?.matchType,
  templateMatcher("Job Agreement")?.score,
);
console.log(
  "Confidentiality Agreement:",
  templateMatcher("Confidentiality Agreement")?.matchType,
  templateMatcher("Confidentiality Agreement")?.score,
);
console.log(
  "Software as a Service Contract:",
  templateMatcher("Software as a Service Contract")?.matchType,
  templateMatcher("Software as a Service Contract")?.score,
);

// Test fuzzy matches
console.log("\n3. Fuzzy Matches:");
console.log(
  "Services Agreement:",
  templateMatcher("Services Agreement")?.matchType,
  templateMatcher("Services Agreement")?.score,
);
console.log(
  "Employee Contract:",
  templateMatcher("Employee Contract")?.matchType,
  templateMatcher("Employee Contract")?.score,
);
console.log(
  "Privacy Notice:",
  templateMatcher("Privacy Notice")?.matchType,
  templateMatcher("Privacy Notice")?.score,
);

// Test term-based matches
console.log("\n4. Term-based Matches:");
console.log(
  "Contract with salary and benefits:",
  templateMatcher("contract with salary and benefits")?.matchType,
  templateMatcher("contract with salary and benefits")?.score,
);
console.log(
  "Confidential information agreement:",
  templateMatcher("confidential information agreement")?.matchType,
  templateMatcher("confidential information agreement")?.score,
);

// Test multiple matches
console.log('\n5. Multiple Matches for "Software Agreement":');
const matches = findTemplateMatches("Software Agreement", 3);
matches.forEach((match, index) => {
  console.log(
    `  ${index + 1}. ${match.template.contractType} (${match.matchType}, ${match.score.toFixed(2)})`,
  );
});

// Test similarity scoring
console.log("\n6. Similarity Scores:");
console.log(
  "Service vs Services:",
  calculateSimilarityScore("service agreement", "services agreement").toFixed(
    2,
  ),
);
console.log(
  "Employment vs Job:",
  calculateSimilarityScore("employment agreement", "job agreement").toFixed(2),
);
console.log(
  "NDA vs Non-Disclosure:",
  calculateSimilarityScore("nda", "non-disclosure agreement").toFixed(2),
);

console.log("\n=== Test Complete ===");
