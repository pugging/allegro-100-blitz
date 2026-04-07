"use client";

import { useMemo, useState } from "react";
import { allBlitzSets } from "@/lib/data";
import { BlitzCard } from "@/components/BlitzCard";
import { FilterBar } from "@/components/FilterBar";
import { ProgressBar } from "@/components/ProgressBar";
import { useProgressContext } from "@/contexts/ProgressContext";
import type { Difficulty, RoleTag } from "@/lib/types";

type FilterStatus = "all" | "not_started" | "completed";

export default function HomePage() {
  const { progress, hydrated } = useProgressContext();
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [role, setRole] = useState<RoleTag | "all">("all");
  const [status, setStatus] = useState<FilterStatus>("all");

  const filtered = useMemo(() => {
    return allBlitzSets.filter((set) => {
      if (difficulty !== "all" && set.difficulty !== difficulty) return false;
      if (role !== "all") {
        const hasRole = set.categories.some((c) => c.role === role);
        if (!hasRole) return false;
      }
      if (status !== "all") {
        const done = !!progress.completedBlitzes[set.id];
        if (status === "completed" && !done) return false;
        if (status === "not_started" && done) return false;
      }
      return true;
    });
  }, [difficulty, role, status, progress]);

  const completedCount = Object.keys(progress.completedBlitzes).length;
  const correctRate =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : undefined;

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-muted-foreground sm:px-6">
        Загрузка прогресса…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 space-y-2 sm:mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Allegro 100 Blitz
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          900 вопросов для подготовки к Allegro e-Xperience 2026 — Automation
          Engineer, Business Controller, Project Specialist
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <ProgressBar
          completed={completedCount}
          total={allBlitzSets.length}
          correctRate={correctRate}
        />
      </div>

      <div className="mb-6 sm:mb-8">
        <FilterBar
          difficulty={difficulty}
          role={role}
          status={status}
          onDifficultyChange={setDifficulty}
          onRoleChange={setRole}
          onStatusChange={setStatus}
        />
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        Показано: {filtered.length} из {allBlitzSets.length}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {filtered.map((set) => (
          <BlitzCard
            key={set.id}
            set={set}
            result={progress.completedBlitzes[set.id]}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center text-muted-foreground">
          Нет наборов по выбранным фильтрам
        </div>
      )}
    </div>
  );
}
