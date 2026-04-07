"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DifficultyBadge } from "./DifficultyBadge";
import { RoleBadge } from "./RoleBadge";
import type { BlitzSet, BlitzStatus, BlitzResult } from "@/lib/types";

const statusStyles: Record<BlitzStatus, string> = {
  not_started: "border-border/60 shadow-sm",
  in_progress: "border-[color:var(--warning)]/35 ring-1 ring-[color:var(--warning)]/15 shadow-sm",
  completed: "border-[color:var(--success)]/35 ring-1 ring-[color:var(--success)]/15 shadow-sm",
};

interface BlitzCardProps {
  set: BlitzSet;
  result?: BlitzResult;
}

export function BlitzCard({ set, result }: BlitzCardProps) {
  const status: BlitzStatus = result
    ? "completed"
    : "not_started";

  const roles = [...new Set(set.categories.map((c) => c.role))];
  const score = result
    ? `${result.correctCount}/${result.totalCount}`
    : null;

  const scoreColor =
    result && result.correctCount === result.totalCount
      ? "text-[color:var(--success)]"
      : result && result.correctCount >= result.totalCount * 0.7
        ? "text-[color:var(--warning)]"
        : "text-[color:var(--danger)]";

  return (
    <Link href={`/blitz/${set.id}`}>
      <Card
        className={`group relative cursor-pointer overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${statusStyles[status]}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              #{String(set.id).padStart(3, "0")}
            </span>
            <DifficultyBadge difficulty={set.difficulty} />
          </div>
          <CardTitle className="text-base leading-snug mt-1">
            {set.title}
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-1.5 mt-2">
            {roles.map((r) => (
              <RoleBadge key={r} role={r} />
            ))}
          </CardDescription>
          {score && (
            <div className={`mt-2 text-sm font-semibold ${scoreColor}`}>
              {score} правильных
            </div>
          )}
          {status === "completed" && result && result.correctCount === result.totalCount && (
            <div className="absolute top-2 right-2 text-lg text-[color:var(--success)]">
              &#10003;
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
