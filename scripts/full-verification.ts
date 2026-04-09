/**
 * Full-pack verification of all 900 questions.
 * Checks every axis that could leak the correct answer.
 * npx tsx scripts/full-verification.ts
 */

import { allBlitzSets } from "../src/lib/data/index";
import type { AnswerKey, Question, BlitzSet } from "../src/lib/types";

const KEYS: AnswerKey[] = ["A", "B", "C", "D"];

function charLen(s: string): number { return [...s].length; }
function mean(a: number[]): number { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; }
function pct(n: number, t: number): string { return `${((n / t) * 100).toFixed(1)}%`; }

interface QCtx { q: Question; setId: number; slot: number; diff: string; }

const all: QCtx[] = [];
for (const s of allBlitzSets) {
  let slot = 0;
  for (const c of s.categories) {
    for (const q of c.questions) {
      all.push({ q, setId: s.id, slot: slot++, diff: s.difficulty });
    }
  }
}

const TOTAL = all.length;
const flag = (label: string, val: string) => console.log(`  [${val}] ${label}`);

function section(title: string) { console.log(`\n${"=".repeat(60)}\n  ${title}\n${"=".repeat(60)}`); }

// ────────────────────────────────────────────────────────────
section("1. LENGTH — chars");
{
  const cLens: number[] = [], wLens: number[] = [];
  let longestCorrect = 0, shortestCorrect = 0;
  const posCount = [0, 0, 0, 0];
  for (const { q } of all) {
    const lens = KEYS.map(k => charLen(q.options[k]));
    const ci = KEYS.indexOf(q.correct);
    cLens.push(lens[ci]!);
    lens.forEach((l, i) => { if (i !== ci) wLens.push(l); });
    const sorted = KEYS.map((k, i) => ({ k, l: lens[i]! })).sort((a, b) => a.l - b.l);
    posCount[sorted.findIndex(x => x.k === q.correct)]++;
    if (lens[ci] === Math.max(...lens)) longestCorrect++;
    if (lens[ci] === Math.min(...lens)) shortestCorrect++;
  }
  console.log(`  Correct mean: ${mean(cLens).toFixed(1)}ch   Wrong mean: ${mean(wLens).toFixed(1)}ch   Ratio: ${(mean(cLens) / mean(wLens)).toFixed(3)}`);
  flag("Longest=correct", `${longestCorrect}/${TOTAL} ${pct(longestCorrect, TOTAL)}`);
  flag("Shortest=correct", `${shortestCorrect}/${TOTAL} ${pct(shortestCorrect, TOTAL)}`);
  console.log(`  Position distribution (shortest→longest):`);
  posCount.forEach((n, i) => console.log(`    pos${i}: ${n} ${pct(n, TOTAL)}`));
  const pickLongest = posCount[3]! / TOTAL * 100;
  const pickShortest = posCount[0]! / TOTAL * 100;
  flag("Pick-longest accuracy", `${pickLongest.toFixed(1)}% (baseline 25%)`);
  flag("Pick-shortest accuracy", `${pickShortest.toFixed(1)}% (baseline 25%)`);
}

// ────────────────────────────────────────────────────────────
section("2. LENGTH — word count");
{
  const cW: number[] = [], wW: number[] = [];
  for (const { q } of all) {
    const wc = (s: string) => s.trim().split(/\s+/).length;
    cW.push(wc(q.options[q.correct]));
    for (const k of KEYS) { if (k !== q.correct) wW.push(wc(q.options[k])); }
  }
  console.log(`  Correct mean words: ${mean(cW).toFixed(1)}   Wrong mean words: ${mean(wW).toFixed(1)}`);
}

// ────────────────────────────────────────────────────────────
section("3. STRUCTURAL MARKERS");
{
  const markers: Record<string, { c: number; w: number }> = {};
  const check = (name: string, re: RegExp) => {
    markers[name] = { c: 0, w: 0 };
    for (const { q } of all) {
      for (const k of KEYS) {
        if (re.test(q.options[k])) {
          if (k === q.correct) markers[name]!.c++; else markers[name]!.w++;
        }
      }
    }
  };
  check("comma", /,/);
  check("em-dash ( — )", / — /);
  check("ascii-dash ( - )", / - /);
  check("semicolon", /;/);
  check("colon", /:/);
  check("parens", /\(/);
  check("quotes «»", /[«»]/);
  check("quotes \"\"", /"/);
  check("exclamation", /!/);
  check("question mark", /\?/);
  check("ellipsis …", /…/);
  check("starts with number", /^\d/);
  check("ends with number", /\d$/);
  check("has ALL_CAPS word ≥3ch", /\b[A-ZА-ЯЁ]{3,}\b/);
  check("has English word", /[a-zA-Z]{3,}/);

  for (const [name, { c, w }] of Object.entries(markers)) {
    const cPct = (c / TOTAL * 100).toFixed(1);
    const wPct = (w / (TOTAL * 3) * 100).toFixed(1);
    const diff = Math.abs(parseFloat(cPct) - parseFloat(wPct));
    const warn = diff > 10 ? " ⚠️ BIG GAP" : diff > 5 ? " ⚡ gap" : "";
    console.log(`  ${name.padEnd(28)} correct=${cPct}%  wrong=${wPct}%${warn}`);
  }
}

// ────────────────────────────────────────────────────────────
section("4. FIRST WORD / STARTING PATTERN");
{
  const firstWords: Record<string, { c: number; w: number }> = {};
  for (const { q } of all) {
    for (const k of KEYS) {
      const fw = q.options[k].trim().split(/\s/)[0]!.toLowerCase().replace(/[^a-zа-яё0-9]/g, "");
      if (!fw) continue;
      if (!firstWords[fw]) firstWords[fw] = { c: 0, w: 0 };
      if (k === q.correct) firstWords[fw]!.c++; else firstWords[fw]!.w++;
    }
  }
  const sorted = Object.entries(firstWords)
    .filter(([, v]) => v.c + v.w >= 15)
    .map(([word, v]) => {
      const totalForWord = v.c + v.w;
      const correctRate = v.c / totalForWord;
      return { word, ...v, totalForWord, correctRate };
    })
    .sort((a, b) => Math.abs(b.correctRate - 0.25) - Math.abs(a.correctRate - 0.25));

  console.log("  First words with ≥15 occurrences, sorted by deviation from 25%:");
  for (const { word, c, w, totalForWord, correctRate } of sorted.slice(0, 20)) {
    const warn = Math.abs(correctRate - 0.25) > 0.1 ? " ⚠️" : "";
    console.log(`    "${word}" (${totalForWord}x): correct=${pct(c, totalForWord)}${warn}`);
  }
}

// ────────────────────────────────────────────────────────────
section("5. ENDING CHARACTER");
{
  const endings: Record<string, { c: number; w: number }> = {};
  for (const { q } of all) {
    for (const k of KEYS) {
      const t = q.options[k].trim();
      const last = t.slice(-1);
      if (!endings[last]) endings[last] = { c: 0, w: 0 };
      if (k === q.correct) endings[last]!.c++; else endings[last]!.w++;
    }
  }
  const sorted = Object.entries(endings)
    .filter(([, v]) => v.c + v.w >= 10)
    .sort((a, b) => (b[1].c + b[1].w) - (a[1].c + a[1].w));

  for (const [ch, { c, w }] of sorted.slice(0, 15)) {
    const total = c + w;
    const cRate = c / total;
    const warn = Math.abs(cRate - 0.25) > 0.1 ? " ⚠️" : "";
    console.log(`    ends "${ch}" (${total}x): correct=${pct(c, total)}${warn}`);
  }
}

// ────────────────────────────────────────────────────────────
section("6. NEGATION / ABSOLUTISM WORDS");
{
  const negWords = ["не ", "нет", "никогда", "невозможно", "ничего", "нельзя", "запрещ"];
  const absWords = ["всегда", "только", "исключительно", "обязательно", "любой", "каждый", "все ", "ни один"];

  let negCorrect = 0, negWrong = 0, absCorrect = 0, absWrong = 0;
  for (const { q } of all) {
    for (const k of KEYS) {
      const t = q.options[k].toLowerCase();
      const hasNeg = negWords.some(w => t.includes(w));
      const hasAbs = absWords.some(w => t.includes(w));
      if (k === q.correct) {
        if (hasNeg) negCorrect++;
        if (hasAbs) absCorrect++;
      } else {
        if (hasNeg) negWrong++;
        if (hasAbs) absWrong++;
      }
    }
  }
  console.log(`  Negation words:  correct=${pct(negCorrect, TOTAL)} (${negCorrect})  wrong=${pct(negWrong, TOTAL * 3)} (${negWrong})`);
  console.log(`  Absolutism words: correct=${pct(absCorrect, TOTAL)} (${absCorrect})  wrong=${pct(absWrong, TOTAL * 3)} (${absWrong})`);
  const negCRate = negCorrect / (negCorrect + negWrong);
  const absCRate = absCorrect / (absCorrect + absWrong);
  flag("Negation → correct rate", `${(negCRate * 100).toFixed(1)}% (baseline 25%)`);
  flag("Absolutism → correct rate", `${(absCRate * 100).toFixed(1)}% (baseline 25%)`);
}

// ────────────────────────────────────────────────────────────
section("7. CORRECT LETTER DISTRIBUTION");
{
  const byLetter: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const { q } of all) byLetter[q.correct]++;
  for (const [k, n] of Object.entries(byLetter)) {
    console.log(`    ${k}: ${n} ${pct(n, TOTAL)}`);
  }
}

// ────────────────────────────────────────────────────────────
section("8. CORRECT LETTER BY SLOT (position 1-9 in blitz)");
{
  const grid: number[][] = Array.from({ length: 9 }, () => [0, 0, 0, 0]);
  for (const { q, slot } of all) {
    grid[slot]![KEYS.indexOf(q.correct)]++;
  }
  console.log("  Slot |   A    B    C    D  | χ² from uniform");
  for (let s = 0; s < 9; s++) {
    const row = grid[s]!;
    const expected = TOTAL / 9 / 4; // 25 each
    const chi2 = row.reduce((sum, obs) => sum + (obs - expected) ** 2 / expected, 0);
    const cells = row.map(n => String(n).padStart(4)).join(" ");
    const warn = chi2 > 7.81 ? " ⚠️" : ""; // df=3, p<0.05
    console.log(`    ${s + 1}   | ${cells} | ${chi2.toFixed(2)}${warn}`);
  }
}

// ────────────────────────────────────────────────────────────
section("9. CORRECT LETTER BY DIFFICULTY");
{
  for (const diff of ["easy", "medium", "hard"] as const) {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    let total = 0;
    for (const { q, diff: d } of all) {
      if (d !== diff) continue;
      counts[q.correct]++;
      total++;
    }
    const cells = KEYS.map(k => `${k}=${counts[k]}(${pct(counts[k], total)})`).join("  ");
    console.log(`  ${diff.padEnd(6)}: ${cells}`);
  }
}

// ────────────────────────────────────────────────────────────
section("10. EXPLANATION OVERLAP WITH CORRECT ANSWER");
{
  let overlapCorrect = 0, overlapWrong = 0;
  for (const { q } of all) {
    const explWords = new Set(q.explanation.toLowerCase().split(/\s+/).filter(w => w.length > 4));
    if (explWords.size < 3) continue;
    for (const k of KEYS) {
      const optWords = q.options[k].toLowerCase().split(/\s+/).filter(w => w.length > 4);
      const overlap = optWords.filter(w => explWords.has(w)).length;
      const overlapRate = optWords.length > 0 ? overlap / optWords.length : 0;
      if (overlapRate > 0.4) {
        if (k === q.correct) overlapCorrect++; else overlapWrong++;
      }
    }
  }
  console.log(`  Options with >40% word overlap with explanation:`);
  console.log(`    Correct: ${overlapCorrect}   Wrong: ${overlapWrong}`);
  const total = overlapCorrect + overlapWrong;
  if (total > 0) {
    flag("High-overlap → correct rate", `${(overlapCorrect / total * 100).toFixed(1)}% (baseline 25%)`);
  }
}

// ────────────────────────────────────────────────────────────
section("11. OPTION UNIQUENESS — repeated text across options");
{
  let exactDupes = 0;
  for (const { q } of all) {
    const texts = KEYS.map(k => q.options[k].trim().toLowerCase());
    const unique = new Set(texts);
    if (unique.size < 4) exactDupes++;
  }
  console.log(`  Questions with duplicate option text: ${exactDupes}`);
}

// ────────────────────────────────────────────────────────────
section("12. EXPANSION ARTIFACTS — clause repetition");
{
  const clauseFreq = new Map<string, number>();
  const KNOWN_CLAUSES = [
    "в рамках стандартной финансовой отчётности",
    "за вычетом операционных и внереализационных расходов",
    "с учётом амортизации и курсовых разниц",
    "включая корректировки по переоценке активов",
    "в пересчёте на единицу проданной продукции",
    "до начисления процентов и налогов (EBIT)",
    "по данным управленческого учёта за период",
    "в соответствии с МСФО/GAAP стандартами",
    "и возвращает объект соответствующего типа",
    "с генерацией TypeError при несовместимых операндах",
    "при этом изменяя состояние объекта на месте",
    "с сохранением ссылки в текущем пространстве имён",
    "через стандартный протокол итерации объектов",
    "с учётом порядка разрешения методов (MRO)",
    "в соответствии с Agile-манифестом",
    "с целью выявления препятствий",
    "при итеративном планировании работ",
    "на основе приоритетов Product Owner",
    "с фиксацией в бэклоге спринта",
    "в экосистеме группы Allegro",
    "с программой Smart!",
    "на рынке Центральной Европы",
  ];

  for (const { q } of all) {
    for (const k of KEYS) {
      for (const clause of KNOWN_CLAUSES) {
        if (q.options[k].includes(clause)) {
          clauseFreq.set(clause, (clauseFreq.get(clause) ?? 0) + 1);
        }
      }
    }
  }
  // How many appear ONLY in wrong answers (expansion artifact)?
  let clauseOnlyWrong = 0, clauseInCorrect = 0;
  for (const clause of KNOWN_CLAUSES) {
    let inC = 0, inW = 0;
    for (const { q } of all) {
      for (const k of KEYS) {
        if (q.options[k].includes(clause)) {
          if (k === q.correct) inC++; else inW++;
        }
      }
    }
    if (inW > 0 && inC === 0) clauseOnlyWrong++;
    if (inC > 0) clauseInCorrect++;
  }

  console.log(`  Known expansion clauses checked: ${KNOWN_CLAUSES.length}`);
  console.log(`  Clauses appearing ONLY in wrong answers: ${clauseOnlyWrong}`);
  console.log(`  Clauses appearing in ≥1 correct answer: ${clauseInCorrect}`);

  const sorted = [...clauseFreq.entries()].sort((a, b) => b[1] - a[1]);
  console.log("  Top clauses by frequency:");
  for (const [clause, n] of sorted.slice(0, 10)) {
    console.log(`    ${n}x: "${clause.slice(0, 50)}..."`);
  }
}

// ────────────────────────────────────────────────────────────
section("13. GRAMMATICAL COHERENCE SPOT-CHECK");
{
  const bad: string[] = [];
  for (const { q } of all) {
    for (const k of KEYS) {
      const t = q.options[k];
      // Check for preposition collisions: "для в ", "для на ", "для с ", "для для "
      if (/\bдля [внс] |\bдля для\b|\bпри при\b|\bна на\b/.test(t)) {
        bad.push(`${q.id} ${k}: "${t.slice(0, 80)}"`);
      }
      // Check for double comma
      if (/,,/.test(t)) {
        bad.push(`${q.id} ${k}: double comma in "${t.slice(0, 80)}"`);
      }
      // Check for double space
      if (/  /.test(t.trim())) {
        bad.push(`${q.id} ${k}: double space in "${t.slice(0, 80)}"`);
      }
      // Semicolon followed by capital (unnatural in Russian mid-sentence)
      if (/; [А-ЯЁA-Z]/.test(t) && charLen(t) < 60) {
        bad.push(`${q.id} ${k}: suspicious semicolon in "${t.slice(0, 80)}"`);
      }
    }
  }
  if (bad.length === 0) {
    console.log("  ✓ No grammatical collisions detected");
  } else {
    console.log(`  Found ${bad.length} issues:`);
    for (const b of bad.slice(0, 20)) console.log(`    ${b}`);
    if (bad.length > 20) console.log(`    ... and ${bad.length - 20} more`);
  }
}

// ────────────────────────────────────────────────────────────
section("14. ANSWER STRATEGY SIMULATION");
{
  const strategies: Record<string, number> = {};

  // Strategy: always pick longest
  let pickLongest = 0;
  for (const { q } of all) {
    const lens = KEYS.map(k => ({ k, l: charLen(q.options[k]) }));
    lens.sort((a, b) => b.l - a.l);
    if (lens[0]!.k === q.correct) pickLongest++;
  }
  strategies["Always longest"] = pickLongest;

  // Strategy: always pick shortest
  let pickShortest = 0;
  for (const { q } of all) {
    const lens = KEYS.map(k => ({ k, l: charLen(q.options[k]) }));
    lens.sort((a, b) => a.l - b.l);
    if (lens[0]!.k === q.correct) pickShortest++;
  }
  strategies["Always shortest"] = pickShortest;

  // Strategy: pick option with most commas
  let pickMostCommas = 0;
  for (const { q } of all) {
    const counts = KEYS.map(k => ({ k, n: (q.options[k].match(/,/g) || []).length }));
    counts.sort((a, b) => b.n - a.n);
    if (counts[0]!.k === q.correct) pickMostCommas++;
  }
  strategies["Most commas"] = pickMostCommas;

  // Strategy: pick option with parens
  let pickParens = 0;
  for (const { q } of all) {
    const withP = KEYS.filter(k => /\(/.test(q.options[k]));
    if (withP.length === 1 && withP[0] === q.correct) pickParens++;
  }
  strategies["Only option with parens"] = pickParens;

  // Strategy: pick option with no expansion clause
  let pickNoExpansion = 0;
  const EXP_MARKERS = ["в рамках", "с учётом", "включая", "при ", "через ", "после ", "используя", "на основе", "для ", "в соответствии"];
  for (const { q } of all) {
    const hasMarker = KEYS.map(k => {
      const t = q.options[k].toLowerCase();
      return EXP_MARKERS.some(m => t.includes(m));
    });
    const noMarker = KEYS.filter((_, i) => !hasMarker[i]);
    if (noMarker.length === 1 && noMarker[0] === q.correct) pickNoExpansion++;
  }
  strategies["Only option WITHOUT expansion markers"] = pickNoExpansion;

  // Strategy: pick most specific (has number or abbreviation)
  let pickSpecific = 0;
  for (const { q } of all) {
    const specificity = KEYS.map(k => {
      const t = q.options[k];
      let score = 0;
      if (/\d/.test(t)) score += 2;
      if (/\([A-Z]{2,}\)/.test(t)) score += 3;
      if (/[A-Z]{3,}/.test(t)) score += 1;
      return { k, score };
    });
    specificity.sort((a, b) => b.score - a.score);
    if (specificity[0]!.score > 0 && specificity[0]!.k === q.correct) pickSpecific++;
  }
  strategies["Most specific (numbers/abbrevs)"] = pickSpecific;

  console.log("  Strategy simulation (baseline = 225 = 25%):");
  for (const [name, correct] of Object.entries(strategies)) {
    const pctVal = (correct / TOTAL * 100).toFixed(1);
    const delta = correct - 225;
    const warn = Math.abs(delta) > 45 ? " ⚠️ EXPLOITABLE" : Math.abs(delta) > 22 ? " ⚡ notable" : "";
    console.log(`    ${name.padEnd(45)} ${correct}/${TOTAL} = ${pctVal}%  Δ=${delta > 0 ? "+" : ""}${delta}${warn}`);
  }
}

// ────────────────────────────────────────────────────────────
section("15. OVERALL VERDICT");
{
  console.log("  See above for details. Key metrics:");
  console.log("  - Any strategy ≥30% → exploitable bias");
  console.log("  - Any structural marker gap >10pp → visual tell");
  console.log("  - Any expansion clause exclusively in wrong → artifact leak");
}
