#!/usr/bin/env node

// Development Helper Script
// Checks for common Next.js development issues

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔧 Contract Analyzer Development Helper");
console.log("======================================");

// Check Node.js version
const nodeVersion = process.version;
console.log(`📦 Node.js: ${nodeVersion}`);

// Check if we're on macOS (file watching issues)
const platform = process.platform;
console.log(`💻 Platform: ${platform}`);

if (platform === "darwin") {
  console.log("ℹ️  macOS detected - checking file watching limits...");
  try {
    const watchLimit = execSync("sysctl kern.maxfiles", { encoding: "utf8" });
    console.log(`   ${watchLimit.trim()}`);
  } catch (e) {
    console.log("   ⚠️  Could not check file watching limits");
  }
}

// Check for antivirus software (common culprits)
console.log("\n🛡️  Checking for potential antivirus interference...");
const antivirusProcesses = ["MsMpEng", "avguard", "kavtray", "mcshield"];
try {
  const processes = execSync("ps aux", { encoding: "utf8" });
  const foundAntivirus = antivirusProcesses.filter((av) =>
    processes.includes(av),
  );

  if (foundAntivirus.length > 0) {
    console.log(
      `   ⚠️  Found antivirus processes: ${foundAntivirus.join(", ")}`,
    );
    console.log(
      "   💡 Consider adding your project folder to antivirus exclusions",
    );
  } else {
    console.log("   ✅ No common antivirus processes detected");
  }
} catch (e) {
  console.log("   ℹ️  Could not check for antivirus processes");
}

// Check port usage
console.log("\n🔌 Checking port usage...");
[3000, 3001, 3002].forEach((port) => {
  try {
    const result = execSync(`lsof -i :${port}`, { encoding: "utf8" });
    console.log(`   ⚠️  Port ${port} is in use:`);
    console.log(
      result
        .split("\n")
        .slice(0, 3)
        .map((line) => `      ${line}`)
        .join("\n"),
    );
  } catch (e) {
    console.log(`   ✅ Port ${port} is free`);
  }
});

// Check .next folder size
console.log("\n📁 Checking .next folder...");
try {
  const nextPath = path.join(process.cwd(), ".next");
  if (fs.existsSync(nextPath)) {
    const size = execSync(`du -sh ${nextPath}`, { encoding: "utf8" }).trim();
    console.log(`   📊 .next folder size: ${size}`);

    // Check if it's unusually large (>500MB)
    const sizeMatch = size.match(/(\d+(?:\.\d+)?)\s*([KMGT]?B)/);
    if (sizeMatch) {
      const [, value, unit] = sizeMatch;
      const sizeInMB =
        unit === "GB"
          ? parseFloat(value) * 1000
          : unit === "MB"
            ? parseFloat(value)
            : parseFloat(value) / 1000;

      if (sizeInMB > 500) {
        console.log(
          "   ⚠️  .next folder is unusually large - consider clearing cache",
        );
      }
    }
  } else {
    console.log("   ✅ .next folder does not exist (clean slate)");
  }
} catch (e) {
  console.log("   ℹ️  Could not check .next folder size");
}

// Check memory usage
console.log("\n💾 Memory usage:");
const memUsage = process.memoryUsage();
console.log(`   Heap Used: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
console.log(`   Heap Total: ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`);

// Check for multiple terminal sessions
console.log("\n🖥️  Checking for multiple Node processes...");
try {
  const nodeProcesses = execSync(
    'ps aux | grep -E "(node|npm|next)" | grep -v grep',
    { encoding: "utf8" },
  );
  const processCount = nodeProcesses
    .split("\n")
    .filter((line) => line.trim()).length;
  console.log(`   Found ${processCount} Node-related processes`);

  if (processCount > 3) {
    console.log(
      "   ⚠️  Multiple Node processes detected - you may have multiple servers running",
    );
  }
} catch (e) {
  console.log("   ✅ No Node processes found");
}

// Recommendations
console.log("\n💡 Recommendations:");
console.log('   • Use "npm run dev:clean" for a fresh start');
console.log('   • Use "npm run dev:force" if ports are stuck');
console.log('   • Use "npm run port:check" to monitor port usage');
console.log('   • Use "npm run health:check" for system info');
console.log("   • Run this script periodically: node scripts/dev-helper.js");
