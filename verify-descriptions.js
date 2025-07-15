// Script to verify the enhanced risk descriptions meet our requirements
const fs = require("fs");

function analyzeDescription(description, title) {
  const words = description.split(/\s+/);
  const wordCount = words.length;

  console.log(`--- ANALYZING: ${title} ---`);
  console.log(`Word Count: ${wordCount} words`);

  // Check word count requirement
  if (wordCount >= 50 && wordCount <= 150) {
    console.log(`✅ Word count: ${wordCount} words (within 50-150 range)`);
  } else {
    console.log(`❌ Word count: ${wordCount} words (outside 50-150 range)`);
  }

  // Check for specific contractual language
  const hasContractReference =
    /section \d+|clause|contract|agreement|provision/i.test(description);
  console.log(
    `${hasContractReference ? "✅" : "❌"} Contains specific contractual reference: ${hasContractReference}`,
  );

  // Check for party impact analysis
  const hasPartyImpact = /client|you|your business|for a client/i.test(
    description,
  );
  console.log(
    `${hasPartyImpact ? "✅" : "❌"} Addresses specific party impact: ${hasPartyImpact}`,
  );

  // Check for realistic scenarios
  const hasScenarios =
    /could|would|may|if|means|this creates|results in|forcing/i.test(
      description,
    );
  console.log(
    `${hasScenarios ? "✅" : "❌"} Describes realistic scenarios: ${hasScenarios}`,
  );

  // Check for quantified consequences
  const hasQuantification =
    /\$[\d,]+|\d+%|\d+\s*(days|months|years)|standard|industry/i.test(
      description,
    );
  console.log(
    `${hasQuantification ? "✅" : "❌"} Includes quantified/contextual information: ${hasQuantification}`,
  );

  // Check for industry context
  const hasIndustryContext =
    /industry|standard|practice|typical|common|normal/i.test(description);
  console.log(
    `${hasIndustryContext ? "✅" : "❌"} Provides industry context: ${hasIndustryContext}`,
  );

  // Check that it doesn't include recommendations
  const hasRecommendations =
    /should|must|recommend|negotiate|require|consider|request/i.test(
      description,
    );
  console.log(
    `${!hasRecommendations ? "✅" : "❌"} Avoids recommendation language: ${!hasRecommendations}`,
  );

  // Check for clear business language
  const hasLegalJargon =
    /whereas|heretofore|pursuant|notwithstanding|aforementioned/i.test(
      description,
    );
  console.log(
    `${!hasLegalJargon ? "✅" : "❌"} Uses business language (avoids legal jargon): ${!hasLegalJargon}`,
  );

  console.log("\nDESCRIPTION:");
  console.log(`"${description}"`);
  console.log("\n" + "=".repeat(80) + "\n");
}

// Load and analyze the simulated response
const response = JSON.parse(
  fs.readFileSync("./simulated-response.json", "utf8"),
);

console.log("=== ENHANCED RISK DESCRIPTION VERIFICATION ===\n");
console.log(`Total Risks: ${response.risks.length}\n`);

response.risks.forEach((risk, index) => {
  analyzeDescription(risk.description, risk.title);
});

// Summary analysis
console.log("=== SUMMARY ===");
const allDescriptions = response.risks.map((r) => r.description);
const allWordCounts = allDescriptions.map((d) => d.split(/\s+/).length);
const avgWordCount = Math.round(
  allWordCounts.reduce((a, b) => a + b, 0) / allWordCounts.length,
);

console.log(`Average word count: ${avgWordCount} words`);
console.log(
  `Word count range: ${Math.min(...allWordCounts)} - ${Math.max(...allWordCounts)} words`,
);

const inRange = allWordCounts.filter(
  (count) => count >= 50 && count <= 150,
).length;
console.log(
  `Descriptions within 50-150 word range: ${inRange}/${allWordCounts.length} (${Math.round((inRange / allWordCounts.length) * 100)}%)`,
);

console.log("\n=== EXAMPLE HIGH-QUALITY DESCRIPTION ===");
const bestExample = response.risks[0];
console.log(`Title: ${bestExample.title}`);
console.log(`Category: ${bestExample.category}`);
console.log(`Severity: ${bestExample.severity}`);
console.log(`Word Count: ${bestExample.description.split(/\s+/).length} words`);
console.log(`Description: "${bestExample.description}"`);
console.log(`Recommendation: "${bestExample.recommendation}"`);
