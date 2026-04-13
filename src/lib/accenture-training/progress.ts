import type { SkillId } from "./types";

const STORAGE_KEY = "acn-training-progress";

export interface LessonProgress {
  lessonId: string;
  completedAt: string;
  grillScore: number;
  grillTotal: number;
}

export interface TrainingProgress {
  lessons: Record<string, LessonProgress>;
}

function getEmptyProgress(): TrainingProgress {
  return { lessons: {} };
}

export function loadTrainingProgress(): TrainingProgress {
  if (typeof window === "undefined") return getEmptyProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyProgress();
    return JSON.parse(raw) as TrainingProgress;
  } catch {
    return getEmptyProgress();
  }
}

export function saveTrainingProgress(progress: TrainingProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // quota exceeded — silently fail
  }
}

export function markLessonComplete(
  lessonId: string,
  score: number,
  total: number,
): void {
  const progress = loadTrainingProgress();
  progress.lessons[lessonId] = {
    lessonId,
    completedAt: new Date().toISOString(),
    grillScore: score,
    grillTotal: total,
  };
  saveTrainingProgress(progress);
}

export function isLessonComplete(lessonId: string): boolean {
  const progress = loadTrainingProgress();
  return lessonId in progress.lessons;
}

export function getLessonScore(
  lessonId: string,
): { score: number; total: number } | null {
  const progress = loadTrainingProgress();
  const p = progress.lessons[lessonId];
  if (!p) return null;
  return { score: p.grillScore, total: p.grillTotal };
}

export function getSkillProgress(
  skillId: SkillId,
  lessonIds: string[],
): { completed: number; total: number; percentage: number } {
  const progress = loadTrainingProgress();
  const completed = lessonIds.filter((id) => id in progress.lessons).length;
  const total = lessonIds.length;
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
