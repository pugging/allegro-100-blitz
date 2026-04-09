/**
 * Статистика смещения длины вариантов (правильный vs неверные).
 * Запуск: npx tsx scripts/analyze-option-length-bias.ts
 */

import { allBlitzSets } from "../src/lib/data/index";

function main() {
  const keys = ["A", "B", "C", "D"] as const;
  let strictLongest = 0;
  let longerThanAnyWrong = 0;
  const ratios: number[] = [];

  for (const set of allBlitzSets) {
    for (const cat of set.categories) {
      for (const q of cat.questions) {
        const ci = keys.indexOf(q.correct);
        const lens = keys.map((k) => [...q.options[k]].length);
        const c = lens[ci]!;
        const wrong = lens.filter((_, i) => i !== ci);
        const maxLen = Math.max(...lens);
        const maxWrong = Math.max(...wrong);
        const meanWrong = wrong.reduce((a, b) => a + b, 0) / 3;

        if (c === maxLen && lens.filter((l) => l === maxLen).length === 1) {
          strictLongest += 1;
        }
        if (c > maxWrong) longerThanAnyWrong += 1;
        ratios.push(c / (meanWrong + 0.001));
      }
    }
  }

  const n = ratios.length;
  const sorted = [...ratios].sort((a, b) => a - b);
  const mean = ratios.reduce((a, b) => a + b, 0) / n;

  console.log("=== Длина текста вариантов (после balance в index.ts) ===\n");
  console.log("Вопросов:", n);
  console.log(
    "Правильный СТРОГО самый длинный (один максимум):",
    strictLongest,
    `(${((strictLongest / n) * 100).toFixed(1)}%)`,
  );
  console.log(
    "Правильный длиннее ЛЮБОГО неверного:",
    longerThanAnyWrong,
    `(${((longerThanAnyWrong / n) * 100).toFixed(1)}%)`,
  );
  console.log("Среднее len(прав.) / mean(len неверных):", mean.toFixed(3));
  console.log("Медиана:", sorted[Math.floor(n / 2)]!.toFixed(3));
  console.log("p90:", sorted[Math.floor(n * 0.9)]!.toFixed(3));
}

main();
