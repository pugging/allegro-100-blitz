/**
 * Deep statistical analysis of correct vs incorrect answer distinguishability.
 * Measures: length, trailing phrases, punctuation, specificity markers, numeric content.
 * npx tsx scripts/deep-bias-analysis.ts
 */

import { allBlitzSets } from "../src/lib/data/index";
import type { AnswerKey } from "../src/lib/types";

const KEYS: AnswerKey[] = ["A", "B", "C", "D"];

interface OptionStats {
  len: number;
  wordCount: number;
  hasComma: boolean;
  hasDash: boolean;
  hasParens: boolean;
  hasNumber: boolean;
  endsWithPhrase: boolean; // trailing filler like ", в общем описании..."
  startsWithCapital: boolean;
}

const FILLER_TAILS = [
  "в общем описании",
  "при упрощённой постановке",
  "в классическом учебном",
  "с допущениями",
  "в широком толковании",
  "без контекста вопроса",
  "без отраслевых уточнений",
];

function stats(text: string): OptionStats {
  const t = text.trim();
  return {
    len: [...t].length,
    wordCount: t.split(/\s+/).length,
    hasComma: t.includes(","),
    hasDash: t.includes(" — ") || / - /.test(t),
    hasParens: /\(/.test(t),
    hasNumber: /\d/.test(t),
    endsWithPhrase: FILLER_TAILS.some((f) => t.includes(f)),
    startsWithCapital: /^[A-ZА-ЯЁ]/.test(t),
  };
}

function mean(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function stddev(arr: number[]): number {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length || 1));
}

function pct(n: number, total: number): string {
  return `${((n / total) * 100).toFixed(1)}%`;
}

function main() {
  const correctLens: number[] = [];
  const wrongLens: number[] = [];
  const correctWords: number[] = [];
  const wrongWords: number[] = [];

  let correctHasComma = 0, wrongHasComma = 0;
  let correctHasDash = 0, wrongHasDash = 0;
  let correctHasParens = 0, wrongHasParens = 0;
  let correctHasNumber = 0, wrongHasNumber = 0;
  let correctHasFiller = 0, wrongHasFiller = 0;

  let longestIsCorrect = 0;
  let shortestIsCorrect = 0;

  let totalQ = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  const lenRatios: number[] = [];

  for (const set of allBlitzSets) {
    for (const cat of set.categories) {
      for (const q of cat.questions) {
        totalQ++;
        const ci = q.correct;
        const allStats = KEYS.map((k) => ({ key: k, ...stats(q.options[k]) }));
        const correctS = allStats.find((s) => s.key === ci)!;
        const wrongS = allStats.filter((s) => s.key !== ci);

        correctLens.push(correctS.len);
        correctWords.push(correctS.wordCount);
        totalCorrect++;
        if (correctS.hasComma) correctHasComma++;
        if (correctS.hasDash) correctHasDash++;
        if (correctS.hasParens) correctHasParens++;
        if (correctS.hasNumber) correctHasNumber++;
        if (correctS.endsWithPhrase) correctHasFiller++;

        for (const w of wrongS) {
          wrongLens.push(w.len);
          wrongWords.push(w.wordCount);
          totalWrong++;
          if (w.hasComma) wrongHasComma++;
          if (w.hasDash) wrongHasDash++;
          if (w.hasParens) wrongHasParens++;
          if (w.hasNumber) wrongHasNumber++;
          if (w.endsWithPhrase) wrongHasFiller++;
        }

        const maxLen = Math.max(...allStats.map((s) => s.len));
        const minLen = Math.min(...allStats.map((s) => s.len));
        if (correctS.len === maxLen) longestIsCorrect++;
        if (correctS.len === minLen) shortestIsCorrect++;

        const meanWrongLen = mean(wrongS.map((s) => s.len));
        if (meanWrongLen > 0) lenRatios.push(correctS.len / meanWrongLen);
      }
    }
  }

  console.log(`\n========== DEEP BIAS ANALYSIS (${totalQ} questions) ==========\n`);

  console.log("--- LENGTH (characters) ---");
  console.log(`Correct:  mean=${mean(correctLens).toFixed(1)}  std=${stddev(correctLens).toFixed(1)}`);
  console.log(`Wrong:    mean=${mean(wrongLens).toFixed(1)}  std=${stddev(wrongLens).toFixed(1)}`);
  console.log(`Ratio correct/wrong mean: ${(mean(correctLens) / mean(wrongLens)).toFixed(3)}`);
  console.log(`Longest option is correct: ${longestIsCorrect}/${totalQ} (${pct(longestIsCorrect, totalQ)})`);
  console.log(`Shortest option is correct: ${shortestIsCorrect}/${totalQ} (${pct(shortestIsCorrect, totalQ)})`);
  console.log(`  (ideal: ~25% for both)`);

  console.log("\n--- WORD COUNT ---");
  console.log(`Correct: mean=${mean(correctWords).toFixed(1)}  std=${stddev(correctWords).toFixed(1)}`);
  console.log(`Wrong:   mean=${mean(wrongWords).toFixed(1)}  std=${stddev(wrongWords).toFixed(1)}`);

  console.log("\n--- STRUCTURAL MARKERS ---");
  console.log(`Has comma:   correct=${pct(correctHasComma, totalCorrect)}  wrong=${pct(wrongHasComma, totalWrong)}`);
  console.log(`Has dash:    correct=${pct(correctHasDash, totalCorrect)}  wrong=${pct(wrongHasDash, totalWrong)}`);
  console.log(`Has parens:  correct=${pct(correctHasParens, totalCorrect)}  wrong=${pct(wrongHasParens, totalWrong)}`);
  console.log(`Has number:  correct=${pct(correctHasNumber, totalCorrect)}  wrong=${pct(wrongHasNumber, totalWrong)}`);

  console.log("\n--- FILLER PHRASES (padding artifacts) ---");
  console.log(`Correct has filler tail: ${correctHasFiller}/${totalCorrect} (${pct(correctHasFiller, totalCorrect)})`);
  console.log(`Wrong has filler tail:   ${wrongHasFiller}/${totalWrong} (${pct(wrongHasFiller, totalWrong)})`);
  console.log(`  ** If wrong >> correct, filler phrases are a giveaway **`);

  console.log("\n--- LENGTH RATIO DISTRIBUTION (correct / mean_wrong) ---");
  const buckets = { "<0.7": 0, "0.7-0.9": 0, "0.9-1.1": 0, "1.1-1.3": 0, ">1.3": 0 };
  for (const r of lenRatios) {
    if (r < 0.7) buckets["<0.7"]++;
    else if (r < 0.9) buckets["0.7-0.9"]++;
    else if (r < 1.1) buckets["0.9-1.1"]++;
    else if (r < 1.3) buckets["1.1-1.3"]++;
    else buckets[">1.3"]++;
  }
  for (const [k, v] of Object.entries(buckets)) {
    console.log(`  ${k}: ${v} (${pct(v, totalQ)})`);
  }

  // Worst offenders: questions where correct answer length is >1.5x or <0.5x the wrong mean
  const outliers: { id: string; ratio: number; correctLen: number; wrongMean: number }[] = [];
  for (const set of allBlitzSets) {
    for (const cat of set.categories) {
      for (const q of cat.questions) {
        const cLen = [...q.options[q.correct].trim()].length;
        const wLens = KEYS.filter((k) => k !== q.correct).map((k) => [...q.options[k].trim()].length);
        const wMean = mean(wLens);
        const ratio = wMean > 0 ? cLen / wMean : 0;
        if (ratio > 1.5 || ratio < 0.5) {
          outliers.push({ id: q.id, ratio, correctLen: cLen, wrongMean: Math.round(wMean) });
        }
      }
    }
  }
  console.log(`\n--- EXTREME OUTLIERS (ratio <0.5 or >1.5): ${outliers.length} ---`);
  outliers
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 15)
    .forEach((o) =>
      console.log(`  ${o.id}  ratio=${o.ratio.toFixed(2)}  correct=${o.correctLen}ch  wrongMean=${o.wrongMean}ch`),
    );
  if (outliers.length > 15) console.log(`  ... and ${outliers.length - 15} more`);
}

main();
