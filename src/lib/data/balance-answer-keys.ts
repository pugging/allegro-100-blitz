import type { AnswerKey, BlitzSet, Question } from "../types";

const KEYS: AnswerKey[] = ["A", "B", "C", "D"];

/** FNV-1a — стабильный хэш для выбора одной из 6 перестановок. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function permutations3(arr: AnswerKey[]): AnswerKey[][] {
  if (arr.length <= 1) return [arr];
  const out: AnswerKey[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const head = arr[i]!;
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const tail of permutations3(rest)) {
      out.push([head, ...tail]);
    }
  }
  return out;
}

/**
 * Биекция oldKey → newKey: текст с метки oldKey оказывается под newKey.
 * correctNew = sigma(correctOld); нужно sigma(correctOld) === target.
 */
function sigmaFor(
  correctOld: AnswerKey,
  targetNew: AnswerKey,
  variant: number,
): Map<AnswerKey, AnswerKey> {
  const sigma = new Map<AnswerKey, AnswerKey>();
  sigma.set(correctOld, targetNew);
  const othersOld = KEYS.filter((k) => k !== correctOld);
  const othersNew = KEYS.filter((k) => k !== targetNew);
  const orderings = permutations3(othersNew);
  const chosen = orderings[variant % orderings.length]!;
  for (let i = 0; i < 3; i++) {
    sigma.set(othersOld[i]!, chosen[i]!);
  }
  return sigma;
}

function applySigma(q: Question, sigma: Map<AnswerKey, AnswerKey>): Question {
  const newOptions: Record<AnswerKey, string> = {
    A: "",
    B: "",
    C: "",
    D: "",
  };
  for (const k of KEYS) {
    newOptions[sigma.get(k)!] = q.options[k];
  }
  return {
    ...q,
    options: newOptions,
    correct: sigma.get(q.correct)!,
  };
}

/** 25× каждая буква, перемешивание детерминировано слотом. */
function targetsForSlot(slotIndex: number): AnswerKey[] {
  const rep = (letter: AnswerKey, n: number): AnswerKey[] =>
    Array.from({ length: n }, () => letter);
  const arr: AnswerKey[] = [
    ...rep("A", 25),
    ...rep("B", 25),
    ...rep("C", 25),
    ...rep("D", 25),
  ];
  let seed = Math.imul(slotIndex + 1, 0x9e3779b9) ^ 0xdeadbeef;
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function flattenQuestionsInSet(set: BlitzSet): Question[] {
  return set.categories.flatMap((c) => [...c.questions]);
}

/**
 * Убирает смещение B/C: в каждой из 9 позиций блица ровно по 25 правильных A, B, C, D.
 * Перестановка вариантов сохраняет смысл вопроса; результат детерминирован.
 */
export function balanceBlitzSets(sets: BlitzSet[]): BlitzSet[] {
  const sorted = [...sets].sort((a, b) => a.id - b.id);
  const bySlot: Question[][] = Array.from({ length: 9 }, () => []);

  for (const set of sorted) {
    const flat = flattenQuestionsInSet(set);
    if (flat.length !== 9) {
      throw new Error(`Blitz ${set.id}: ожидается 9 вопросов, получено ${flat.length}`);
    }
    for (let slot = 0; slot < 9; slot++) {
      bySlot[slot]!.push(flat[slot]!);
    }
  }

  const updated = new Map<string, Question>();

  for (let slot = 0; slot < 9; slot++) {
    const bucket = bySlot[slot]!;
    const targets = targetsForSlot(slot);
    if (bucket.length !== targets.length) {
      throw new Error(`Слот ${slot}: несовпадение длины bucket/targets`);
    }
    for (let i = 0; i < bucket.length; i++) {
      const q = bucket[i]!;
      const target = targets[i]!;
      const variant = hashString(q.id);
      const sigma = sigmaFor(q.correct, target, variant);
      updated.set(q.id, applySigma(q, sigma));
    }
  }

  return sorted.map((set) => ({
    ...set,
    categories: set.categories.map((cat) => ({
      ...cat,
      questions: cat.questions.map((q) => updated.get(q.id)!) as [
        Question,
        Question,
        Question,
      ],
    })) as typeof set.categories,
  }));
}

const LETTER_IX: Record<AnswerKey, number> = { A: 0, B: 1, C: 2, D: 3 };

/** Таблица сопряжённости: строка = позиция 0..8 в блице, столбец = A..D (наборы по id). */
export function slotAnswerContingency(sets: BlitzSet[]): number[][] {
  const grid: number[][] = Array.from({ length: 9 }, () => [0, 0, 0, 0]);
  const ordered = [...sets].sort((a, b) => a.id - b.id);
  for (const set of ordered) {
    const flat = flattenQuestionsInSet(set);
    for (let slot = 0; slot < 9; slot++) {
      const q = flat[slot]!;
      grid[slot]![LETTER_IX[q.correct]]! += 1;
    }
  }
  return grid;
}

/** Глобальные частоты A,B,C,D */
export function letterMargins(sets: BlitzSet[]): Record<AnswerKey, number> {
  const m: Record<AnswerKey, number> = { A: 0, B: 0, C: 0, D: 0 };
  const ordered = [...sets].sort((a, b) => a.id - b.id);
  for (const set of ordered) {
    for (const cat of set.categories) {
      for (const q of cat.questions) {
        m[q.correct] += 1;
      }
    }
  }
  return m;
}
