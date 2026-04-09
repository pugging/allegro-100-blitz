import type { AnswerKey, BlitzSet, Question } from "../types";

const KEYS: AnswerKey[] = ["A", "B", "C", "D"];

function charLen(s: string): number {
  return [...s].length;
}

/**
 * Убирает «хвосты»-пояснения у правильного варианта (часто дублируют explanation).
 * Без обрезки середины определения — только устойчивые паттерны.
 */
function shortenCorrectText(text: string, maxLen: number): string {
  let t = text.trim();
  for (let pass = 0; pass < 20 && charLen(t) > maxLen; pass++) {
    const before = t;

    const dash = t.indexOf(" — ");
    if (dash > 8 && charLen(t) - dash > 22) {
      t = t.slice(0, dash).trim();
      continue;
    }

    const asciiDash = t.search(/\s-\s/);
    if (asciiDash > 8 && charLen(t) - asciiDash > 22) {
      t = t.slice(0, asciiDash).trim();
      continue;
    }

    const cidx = t.lastIndexOf(": ");
    if (cidx > 12 && charLen(t) - cidx > 32) {
      t = t.slice(0, cidx).trim();
      continue;
    }

    t = t.replace(/\s*\([^)]{20,}\)\s*$/, "").trim();

    const dot = t.indexOf(". ");
    if (dot > 8 && dot < charLen(t) - 28) {
      t = t.slice(0, dot).trim();
      continue;
    }

    if (t === before) break;
  }
  return t;
}

/** Небольшое удлинение короткого дистрактора без мета-формулировок «это неверно». */
function padDistractor(text: string, minLen: number, seed: string): string {
  const t = text.trim();
  if (charLen(t) >= minLen) return t;
  const pads = [
    ", в общем описании без отраслевых уточнений",
    ", при упрощённой постановке задачи",
    ", в классическом учебном изложении термина",
    ", с допущениями «как правило» без исключений",
    ", в широком толковании без контекста вопроса",
  ];
  let out = t;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  let guard = 0;
  while (charLen(out) < minLen && guard++ < 4) {
    out = out + pads[h % pads.length]!;
    h = (h * 17 + 1) >>> 0;
  }
  return out;
}

function balanceQuestionOptions(q: Question): Question {
  const opts: Record<AnswerKey, string> = { ...q.options };
  const ci = KEYS.indexOf(q.correct);
  const lens = KEYS.map((k) => charLen(opts[k]));
  const correctLen0 = lens[ci]!;
  const wrongLens = lens.filter((_, idx) => idx !== ci);
  const maxWrong = Math.max(...wrongLens);
  const meanWrong = wrongLens.reduce((a, b) => a + b, 0) / 3;
  const meanAll = lens.reduce((a, b) => a + b, 0) / 4;

  // Цель: правильный не длиннее «планака» дистракторов + небольшой зазор
  const targetCorrect = Math.min(
    86,
    Math.max(
      Math.ceil(maxWrong + 6),
      Math.ceil(meanWrong * 1.06),
      Math.ceil(meanAll * 1.03),
    ),
  );

  if (correctLen0 > targetCorrect) {
    opts[q.correct] = shortenCorrectText(opts[q.correct]!, targetCorrect);
  }

  const lens2 = KEYS.map((k) => charLen(opts[k]!));
  let newCorrectLen = lens2[ci]!;
  let newWrong = KEYS.filter((k) => k !== q.correct).map((k) => charLen(opts[k]!));
  let newMaxWrong = Math.max(...newWrong);

  if (newCorrectLen > newMaxWrong + 2) {
    opts[q.correct] = shortenCorrectText(
      opts[q.correct]!,
      Math.max(newMaxWrong + 4, 24),
    );
    newCorrectLen = charLen(opts[q.correct]!);
    newWrong = KEYS.filter((k) => k !== q.correct).map((k) => charLen(opts[k]!));
    newMaxWrong = Math.max(...newWrong);
  }

  const padTarget = Math.min(
    74,
    Math.max(newMaxWrong, Math.ceil(newCorrectLen * 0.94), 30),
  );

  for (const k of KEYS) {
    if (k === q.correct) continue;
    const L = charLen(opts[k]!);
    if (L < padTarget * 0.78 && L < 40 && !/^\d+(?:[.,]\d+)?$/.test(opts[k]!.trim())) {
      opts[k] = padDistractor(opts[k]!, Math.ceil(padTarget * 0.85), `${q.id}_${k}`);
    }
  }

  return { ...q, options: opts };
}

function balanceCategory(cat: BlitzSet["categories"][0]): typeof cat {
  return {
    ...cat,
    questions: cat.questions.map((q) => balanceQuestionOptions(q)) as typeof cat.questions,
  };
}

/** Снижает корреляцию «самый длинный = верный»: укорачивает пояснения у correct, слегка выравнивает короткие дистракторы. */
export function balanceOptionLengthsInSets(sets: BlitzSet[]): BlitzSet[] {
  return sets.map((set) => ({
    ...set,
    categories: set.categories.map(balanceCategory) as typeof set.categories,
  }));
}
