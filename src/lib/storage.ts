import { recomputeProgressFromBlitzes } from "@/lib/recompute-progress";
import type { UserProgress, BlitzResult, AnswerKey } from "./types";

const STORAGE_KEY = "allegro-blitz-progress";

function getDefaultProgress(): UserProgress {
  return {
    completedBlitzes: {},
    totalCorrect: 0,
    totalAnswered: 0,
    topicStats: {},
  };
}

/** Read raw localStorage and rebuild topic stats from answers (source of truth: completed blitzes). */
export function loadProgressFromStorage(): UserProgress {
  if (typeof window === "undefined") return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw) as {
      completedBlitzes?: Record<string, BlitzResult>;
    };
    const map: Record<number, BlitzResult> = {};
    if (parsed.completedBlitzes) {
      for (const [k, v] of Object.entries(parsed.completedBlitzes)) {
        map[Number(k)] = v;
      }
    }
    return recomputeProgressFromBlitzes(map);
  } catch {
    return getDefaultProgress();
  }
}

export function loadProgress(): UserProgress {
  return loadProgressFromStorage();
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ completedBlitzes: progress.completedBlitzes }),
  );
}

export function saveBlitzResult(
  result: BlitzResult,
  _topicAnswers: { topic: string; correct: boolean }[],
): UserProgress {
  const progress = loadProgressFromStorage();
  progress.completedBlitzes[result.blitzId] = result;
  const next = recomputeProgressFromBlitzes(progress.completedBlitzes);
  saveProgress(next);
  return next;
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getBlitzAnswer(
  blitzId: number,
  questionId: string,
): AnswerKey | null {
  const progress = loadProgressFromStorage();
  const r = progress.completedBlitzes[blitzId];
  if (!r) return null;
  return r.answers[questionId] ?? null;
}
