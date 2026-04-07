import { allBlitzSets } from "@/lib/data";
import type { BlitzResult, UserProgress } from "@/lib/types";

export function recomputeProgressFromBlitzes(
  completedBlitzes: Record<number, BlitzResult>,
): UserProgress {
  let totalCorrect = 0;
  let totalAnswered = 0;
  const topicStats: Record<string, { correct: number; total: number }> = {};

  for (const set of allBlitzSets) {
    const result = completedBlitzes[set.id];
    if (!result) continue;

    for (const cat of set.categories) {
      for (const q of cat.questions) {
        const ans = result.answers[q.id];
        if (ans === undefined) continue;
        totalAnswered += 1;
        const ok = ans === q.correct;
        if (ok) totalCorrect += 1;
        if (!topicStats[q.topic]) {
          topicStats[q.topic] = { correct: 0, total: 0 };
        }
        topicStats[q.topic].total += 1;
        if (ok) topicStats[q.topic].correct += 1;
      }
    }
  }

  return {
    completedBlitzes,
    totalCorrect,
    totalAnswered,
    topicStats,
  };
}
