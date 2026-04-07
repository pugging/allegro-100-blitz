"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Имитация SkillPanel: ~1.5 мин на вопрос (мягкий ориентир, без автосабмита). */
export const QUESTION_TIME_BUDGET_SEC = 90;

function formatMmSs(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function QuestionTimer({
  questionId,
  answered,
  disabled,
}: {
  questionId: string;
  answered: boolean;
  disabled: boolean;
}) {
  const [left, setLeft] = useState(QUESTION_TIME_BUDGET_SEC);

  useEffect(() => {
    setLeft(QUESTION_TIME_BUDGET_SEC);
  }, [questionId]);

  useEffect(() => {
    if (disabled || answered) return;
    const id = setInterval(() => {
      setLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [questionId, answered, disabled]);

  if (disabled || answered) {
    return (
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        Лимит: —
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-mono text-xs tabular-nums transition-colors",
        left === 0 && "font-medium text-[color:var(--danger)]",
        left > 0 &&
          left <= 15 &&
          "font-medium text-[color:var(--warning)]",
        left > 15 && "text-muted-foreground",
      )}
      aria-live="polite"
      aria-atomic="true"
      title="Рекомендуемый лимит времени на вопрос (как в SkillPanel)"
    >
      Лимит: {formatMmSs(left)}
      {left === 0 ? " · время вышло" : ""}
    </span>
  );
}
