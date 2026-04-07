import type { BlitzSet } from "../types";
import { balanceBlitzSets } from "./balance-answer-keys";
import { batch1 } from "./batch1";
import { batch2 } from "./batch2";
import { batch3 } from "./batch3";
import { batch4 } from "./batch4";
import { batch5 } from "./batch5";

const rawBlitzSets: BlitzSet[] = [
  ...batch1,
  ...batch2,
  ...batch3,
  ...batch4,
  ...batch5,
];

/** Без смещения буквы правильного ответа к B/C; см. `balance-answer-keys.ts`. */
export const allBlitzSets: BlitzSet[] = balanceBlitzSets(rawBlitzSets);

export function getBlitzSetById(id: number): BlitzSet | undefined {
  return allBlitzSets.find((s) => s.id === id);
}

export function getBlitzSetsByDifficulty(difficulty: BlitzSet["difficulty"]): BlitzSet[] {
  return allBlitzSets.filter((s) => s.difficulty === difficulty);
}

export function getAllTopics(): string[] {
  const topics = new Set<string>();
  for (const set of allBlitzSets) {
    for (const cat of set.categories) {
      for (const q of cat.questions) {
        topics.add(q.topic);
      }
    }
  }
  return Array.from(topics).sort();
}

export function getAllRoles(): string[] {
  const roles = new Set<string>();
  for (const set of allBlitzSets) {
    for (const cat of set.categories) {
      roles.add(cat.role);
    }
  }
  return Array.from(roles).sort();
}
