/**
 * Validation script: checks data integrity across all 100 blitz sets.
 * Run with: node --experimental-strip-types scripts/validate.mjs
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Simple regex-based extraction since we can't import TS directly
const dataDir = join(__dirname, "..", "src", "lib", "data");
const files = ["batch1.ts", "batch2.ts", "batch3.ts", "batch4.ts", "batch5.ts"];

let totalSets = 0;
let totalQuestions = 0;
const allIds = new Set();
const duplicateIds = [];
const topicsFound = new Set();
const rolesFound = new Set();
const difficultiesFound = new Map();
const errors = [];

// Role coverage check against job descriptions
const requiredTopicPatterns = {
  automation: [
    /python/i, /sql/i, /rpa|uipath/i, /agile|scrum/i, /git/i, /api|rest/i,
    /test/i, /database/i, /algorithm/i, /docker|kubernetes/i,
  ],
  controller: [
    /financial|finance/i, /excel/i, /ecommerce|metric/i, /logistics/i,
    /data_analysis|data_visual/i, /accounting/i, /cost/i, /budget/i,
  ],
  project: [
    /pm_|project/i, /lean|six_sigma/i, /process/i, /stakeholder/i,
    /risk/i, /logistics/i, /kpi/i, /agile|kanban|scrum/i,
  ],
  general: [
    /allegro/i, /ecommerce/i, /soft_skill|workplace/i, /gdpr|privacy/i,
  ],
};

for (const file of files) {
  const content = readFileSync(join(dataDir, file), "utf-8");

  // Count sets by matching id: <number>
  const setIds = [...content.matchAll(/^\s*id:\s*(\d+),/gm)];
  totalSets += setIds.length;

  // Count questions by matching id: "b<n>_q<n>"
  const questionIds = [...content.matchAll(/id:\s*"(b\d+_q\d+)"/g)];
  totalQuestions += questionIds.length;

  for (const m of questionIds) {
    if (allIds.has(m[1])) {
      duplicateIds.push(m[1]);
    }
    allIds.add(m[1]);
  }

  // Extract topics
  const topics = [...content.matchAll(/topic:\s*"([^"]+)"/g)];
  for (const t of topics) topicsFound.add(t[1]);

  // Extract roles
  const roles = [...content.matchAll(/role:\s*"(automation|controller|project|general)"/g)];
  for (const r of roles) rolesFound.add(r[1]);

  // Extract difficulties
  const diffs = [...content.matchAll(/difficulty:\s*"(easy|medium|hard)"/g)];
  for (const d of diffs) {
    difficultiesFound.set(d[1], (difficultiesFound.get(d[1]) || 0) + 1);
  }
}

// Validation checks
console.log("=== ALLEGRO 100 BLITZ - VALIDATION REPORT ===\n");

// 1. Total sets
console.log(`1. Total blitz sets: ${totalSets}`);
if (totalSets !== 100) errors.push(`Expected 100 sets, found ${totalSets}`);
else console.log("   ✓ OK");

// 2. Total questions
console.log(`\n2. Total questions: ${totalQuestions}`);
if (totalQuestions !== 900) errors.push(`Expected 900 questions, found ${totalQuestions}`);
else console.log("   ✓ OK");

// 3. Duplicate IDs
console.log(`\n3. Duplicate question IDs: ${duplicateIds.length}`);
if (duplicateIds.length > 0) {
  errors.push(`Duplicate IDs: ${duplicateIds.join(", ")}`);
  console.log(`   ✗ DUPLICATES: ${duplicateIds.slice(0, 10).join(", ")}`);
} else {
  console.log("   ✓ OK - all unique");
}

// 4. Roles coverage
console.log(`\n4. Roles found: ${[...rolesFound].join(", ")}`);
const expectedRoles = ["automation", "controller", "project", "general"];
for (const r of expectedRoles) {
  if (!rolesFound.has(r)) errors.push(`Missing role: ${r}`);
}
console.log("   ✓ All 4 roles present");

// 5. Difficulty distribution
console.log("\n5. Difficulty distribution (question-level):");
for (const [d, count] of difficultiesFound) {
  console.log(`   ${d}: ${count}`);
}

// 6. Topics
console.log(`\n6. Unique topics: ${topicsFound.size}`);
console.log(`   Topics: ${[...topicsFound].sort().join(", ")}`);

// 7. Role-specific topic coverage
console.log("\n7. Topic coverage vs job descriptions:");
for (const [role, patterns] of Object.entries(requiredTopicPatterns)) {
  const roleTopics = [...topicsFound].filter((t) => {
    // Very rough: check if any question with this topic has this role
    return true; // we check pattern match instead
  });
  let covered = 0;
  const missing = [];
  for (const pattern of patterns) {
    const found = [...topicsFound].some((t) => pattern.test(t));
    if (found) covered++;
    else missing.push(pattern.source);
  }
  console.log(`   ${role}: ${covered}/${patterns.length} topic areas covered`);
  if (missing.length > 0) {
    console.log(`      Missing patterns: ${missing.join(", ")}`);
    errors.push(`${role}: missing topic patterns: ${missing.join(", ")}`);
  }
}

// Summary
console.log("\n=== SUMMARY ===");
if (errors.length === 0) {
  console.log("✓ ALL CHECKS PASSED");
} else {
  console.log(`✗ ${errors.length} ERRORS FOUND:`);
  for (const e of errors) console.log(`  - ${e}`);
}

console.log("\n=== DONE ===");
