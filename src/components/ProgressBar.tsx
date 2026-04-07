"use client";

import { HydrationSafeProgress } from "@/components/HydrationSafeProgress";

interface ProgressBarProps {
  completed: number;
  total: number;
  correctRate?: number;
}

export function ProgressBar({ completed, total, correctRate }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Пройдено: <span className="font-semibold text-foreground">{completed}</span> / {total}
        </span>
        {correctRate !== undefined && (
          <span className="text-muted-foreground">
            Точность:{" "}
            <span
              className={`font-semibold ${
                correctRate >= 80
                  ? "text-[color:var(--success)]"
                  : correctRate >= 60
                    ? "text-[color:var(--warning)]"
                    : "text-[color:var(--danger)]"
              }`}
            >
              {correctRate}%
            </span>
          </span>
        )}
      </div>
      <HydrationSafeProgress value={pct} className="h-2" />
    </div>
  );
}
