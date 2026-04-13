"use client";

import { useEffect, useState } from "react";
import { getLessonScore } from "@/lib/accenture-training/progress";
import { Badge } from "@/components/ui/badge";

export function LessonCompletionBadge({ lessonId }: { lessonId: string }) {
  const [result, setResult] = useState<{
    score: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    setResult(getLessonScore(lessonId));
  }, [lessonId]);

  if (!result) return null;

  const pct = result.total > 0 ? result.score / result.total : 0;

  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-medium ${
        pct >= 0.8
          ? "border-[color:var(--success)]/40 text-[color:var(--success)]"
          : pct >= 0.6
            ? "border-[color:var(--warning)]/40 text-[color:var(--warning)]"
            : "border-[color:var(--danger)]/40 text-[color:var(--danger)]"
      }`}
    >
      {result.score}/{result.total}
    </Badge>
  );
}
