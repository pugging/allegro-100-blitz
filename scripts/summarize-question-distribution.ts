/**
 * Распределение сложности и «кодовых» вопросов по 100 блицам.
 * npx tsx scripts/summarize-question-distribution.ts
 */

import { allBlitzSets } from "../src/lib/data/index";

function hasCodeSnippet(q: {
  text: string;
  options: Record<string, string>;
}): boolean {
  const blob = q.text + "\n" + Object.values(q.options).join("\n");
  if (/\n/.test(q.text)) return true;
  if (/\bdef\b|\bclass\b|^from\s+\w+\s+import/m.test(blob)) return true;
  if (/\bprint\s*\(|\blambda\b|\*\*|\[1,/.test(blob) && /int|str|list|def|print/.test(blob))
    return true;
  if (/\bSELECT\b|\bFROM\b|\bWHERE\b|\bOVER\s*\(/i.test(blob)) return true;
  if (/<class\s+'/.test(blob)) return true;
  if (/for\s+\w+\s+in\s+range|while\s+/.test(blob)) return true;
  return false;
}

function main() {
  const byQDiff = { easy: 0, medium: 0, hard: 0 };
  let codeCount = 0;
  const codePerBlitz = new Map<number, number>();
  const topicCount = new Map<string, number>();

  for (const set of allBlitzSets) {
    let cb = 0;
    for (const cat of set.categories) {
      for (const q of cat.questions) {
        byQDiff[q.difficulty] += 1;
        topicCount.set(q.topic, (topicCount.get(q.topic) ?? 0) + 1);
        if (hasCodeSnippet(q)) {
          codeCount += 1;
          cb += 1;
        }
      }
    }
    if (cb > 0) codePerBlitz.set(set.id, cb);
  }

  const blitzBySetDiff = { easy: 0, medium: 0, hard: 0 };
  for (const s of allBlitzSets) {
    blitzBySetDiff[s.difficulty] += 1;
  }

  const codeBlitzSorted = [...codePerBlitz.entries()].sort((a, b) => a[0] - b[0]);
  const firstCodeBlitz = codeBlitzSorted[0]?.[0];

  const easyBlitzIds = allBlitzSets.filter((s) => s.difficulty === "easy").map((s) => s.id);
  const firstNonEasy = allBlitzSets.find((s) => s.difficulty !== "easy")?.id;

  console.log("=== 100 блицов (наборов) по полю difficulty ===");
  console.log(blitzBySetDiff);
  console.log("ID блицов easy:", easyBlitzIds.slice(0, 20).join(", "), "… всего", easyBlitzIds.length);
  console.log("Первый блиц не-easy (по порядку в данных): id =", firstNonEasy);
  console.log("");
  console.log("=== 900 вопросов по полю question.difficulty ===");
  console.log(byQDiff);
  console.log("");
  console.log("=== Код / SQL / многострочные примеры (эвристика по тексту) ===");
  console.log("Вопросов с кодом или SQL в формулировке:", codeCount);
  console.log("Блицов, где есть ≥1 такой вопрос:", codePerBlitz.size);
  console.log("Первый блиц (минимальный id) с таким вопросом:", firstCodeBlitz);
  console.log("Примеры: блиц id → число кодовых вопросов в нём");
  console.log(codeBlitzSorted.slice(0, 25).map(([id, n]) => `  #${id}: ${n}`).join("\n"));

  const topics = [...topicCount.entries()].sort((a, b) => b[1] - a[1]);
  console.log("");
  console.log("=== Топ тем (topic) по числу вопросов ===");
  for (const [t, n] of topics.slice(0, 20)) {
    console.log(`  ${n}\t${t}`);
  }
}

main();
