import type { BlitzResult, UserProgress } from "@/lib/types";
import { recomputeProgressFromBlitzes } from "@/lib/recompute-progress";

export function mergeCompletedBlitzes(
  a: Record<number, BlitzResult>,
  b: Record<number, BlitzResult>,
): Record<number, BlitzResult> {
  const merged: Record<number, BlitzResult> = { ...a };
  for (const [idStr, br] of Object.entries(b)) {
    const id = Number(idStr);
    const existing = merged[id];
    if (
      !existing ||
      new Date(br.completedAt).getTime() >= new Date(existing.completedAt).getTime()
    ) {
      merged[id] = br;
    }
  }
  return merged;
}

export function mergeUserProgress(local: UserProgress, remote: UserProgress): UserProgress {
  const mergedBlitzes = mergeCompletedBlitzes(
    local.completedBlitzes,
    remote.completedBlitzes,
  );
  return recomputeProgressFromBlitzes(mergedBlitzes);
}
