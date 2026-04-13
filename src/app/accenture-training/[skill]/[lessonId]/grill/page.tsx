"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SKILL_TRACKS } from "@/lib/accenture-training/registry";
import { getLessonIdBySlug, loadLesson } from "@/lib/accenture-training/lessons";
import { markLessonComplete } from "@/lib/accenture-training/progress";
import { ExerciseRunner } from "@/components/accenture-training/ExerciseRunner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SkillId, Lesson } from "@/lib/accenture-training/types";

interface PageProps {
  params: Promise<{ skill: string; lessonId: string }>;
}

export default function GrillPage({ params }: PageProps) {
  const { skill, lessonId: slug } = use(params);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const skillId = skill as SkillId;
  const track = skill in SKILL_TRACKS ? SKILL_TRACKS[skillId] : null;

  useEffect(() => {
    if (!track) return;
    const id = getLessonIdBySlug(skillId, slug);
    if (!id) return;
    loadLesson(id).then((l) => {
      setLesson(l);
      setLoading(false);
    });
  }, [skillId, slug, track]);

  if (!track) notFound();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Загрузка заданий...</p>
      </div>
    );
  }

  if (!lesson || lesson.exercises.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Для этого урока пока нет заданий</h1>
        <Link href={`/accenture-training/${skillId}/${slug}`}>
          <Button className="mt-4">&larr; К уроку</Button>
        </Link>
      </div>
    );
  }

  const exercises = lesson.exercises;
  const total = exercises.length;

  function handleComplete(correct: boolean) {
    setCompleted((prev) => new Set(prev).add(currentIdx));
    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (currentIdx < total - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      const lessonFullId = getLessonIdBySlug(skillId, slug);
      if (lessonFullId) {
        markLessonComplete(lessonFullId, score, total);
      }
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
          <h2 className="text-2xl font-bold">
            {score === total
              ? "Идеально!"
              : score >= total * 0.8
                ? "Отлично!"
                : score >= total * 0.6
                  ? "Хорошая работа!"
                  : "Продолжайте практиковаться!"}
          </h2>
          <p className="mt-3 text-4xl font-bold">
            <span
              className={
                score >= total * 0.8
                  ? "text-[color:var(--success)]"
                  : score >= total * 0.6
                    ? "text-[color:var(--warning)]"
                    : "text-[color:var(--danger)]"
              }
            >
              {score}
            </span>
            <span className="text-muted-foreground"> / {total}</span>
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href={`/accenture-training/${skillId}/${slug}`}>
              <Button variant="outline">&larr; К уроку</Button>
            </Link>
            <Link href={`/accenture-training/${skillId}`}>
              <Button>Все уроки</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link
            href={`/accenture-training/${skillId}/${slug}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            &larr; {lesson.title}
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            GRILL
          </span>
          <Badge variant="outline">{track.shortTitle}</Badge>
          <span className="text-xs text-muted-foreground">
            Задание {currentIdx + 1} / {total}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-1.5 w-full rounded-full bg-muted">
          <div
            className="h-1.5 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(completed.size / total) * 100}%` }}
          />
        </div>
      </div>

      <ExerciseRunner
        exercise={exercises[currentIdx]}
        onComplete={handleComplete}
        isCompleted={completed.has(currentIdx)}
      />

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
        >
          &larr; Назад
        </Button>

        <div className="flex gap-1.5">
          {exercises.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === currentIdx
                  ? "scale-125 bg-primary"
                  : completed.has(i)
                    ? "bg-[color:var(--success)]"
                    : "bg-muted"
              }`}
              aria-label={`Задание ${i + 1}`}
            />
          ))}
        </div>

        <Button
          size="sm"
          onClick={handleNext}
          disabled={!completed.has(currentIdx)}
        >
          {currentIdx < total - 1 ? "Далее \u2192" : "Завершить"}
        </Button>
      </div>
    </div>
  );
}
