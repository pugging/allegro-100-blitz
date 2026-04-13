"use client";

import { useEffect, useState } from "react";
import { getSkillProgress } from "@/lib/accenture-training/progress";
import { getLessonIdsForSkill } from "@/lib/accenture-training/lessons";
import type { SkillId } from "@/lib/accenture-training/types";

export function SkillProgressBadge({ skillId }: { skillId: SkillId }) {
  const [progress, setProgress] = useState<{
    completed: number;
    total: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    const ids = getLessonIdsForSkill(skillId);
    setProgress(getSkillProgress(skillId, ids));
  }, [skillId]);

  if (!progress || progress.completed === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 min-w-[60px] rounded-full bg-muted">
        <div
          className="h-1.5 rounded-full bg-[color:var(--success)] transition-all duration-300"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
        {progress.completed}/{progress.total}
      </span>
    </div>
  );
}
