"use client";

import { useState, useEffect, useCallback, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { getBlitzSetById } from "@/lib/data";
import { loadProgressFromStorage } from "@/lib/storage";
import { useProgressContext } from "@/contexts/ProgressContext";
import { QuizQuestion } from "@/components/QuizQuestion";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Button } from "@/components/ui/button";
import { HydrationSafeProgress } from "@/components/HydrationSafeProgress";
import { QuestionTimer } from "@/components/QuestionTimer";
import type { AnswerKey, BlitzResult, Question } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BlitzPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { persistBlitzResult, hydrated } = useProgressContext();
  const blitzId = parseInt(id, 10);
  const set = getBlitzSetById(blitzId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({});
  const [topicResults, setTopicResults] = useState<
    { topic: string; correct: boolean }[]
  >([]);
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const sessionStartMsRef = useRef<number | null>(null);
  const secondsRef = useRef(0);
  secondsRef.current = seconds;

  useEffect(() => {
    if (finished || !set) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [finished, set]);

  useEffect(() => {
    if (!set || !hydrated) return;
    const progress = loadProgressFromStorage();
    const prev = progress.completedBlitzes[blitzId];
    if (prev) {
      const n = set.categories.flatMap((c) => c.questions).length;
      setAnswers(prev.answers);
      setFinished(true);
      setCurrentIndex(Math.max(0, n - 1));
      setSeconds(
        typeof prev.durationSeconds === "number" ? prev.durationSeconds : 0,
      );
      sessionStartMsRef.current = null;
    } else if (sessionStartMsRef.current === null) {
      sessionStartMsRef.current = Date.now();
    }
  }, [blitzId, hydrated, set]);

  if (!set) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Набор #{id} не найден</h1>
        <Button className="mt-4" onClick={() => router.push("/")}>
          На главную
        </Button>
      </div>
    );
  }

  const allQuestions: Question[] = set.categories.flatMap((c) => c.questions);

  const handleAnswer = useCallback(
    (questionId: string, answer: AnswerKey, correct: boolean) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
      const q = allQuestions.find((q) => q.id === questionId)!;
      setTopicResults((prev) => [...prev, { topic: q.topic, correct }]);
    },
    [allQuestions],
  );

  const handleNext = useCallback(() => {
    setCurrentIndex((i) =>
      i < allQuestions.length - 1 ? i + 1 : i,
    );
  }, [allQuestions.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const handleFinish = useCallback(() => {
    const byTick = secondsRef.current;
    const wallSeconds =
      sessionStartMsRef.current != null
        ? Math.floor((Date.now() - sessionStartMsRef.current) / 1000)
        : byTick;
    const finalDuration = Math.max(byTick, wallSeconds);

    const correctCount = allQuestions.filter(
      (q) => answers[q.id] === q.correct,
    ).length;

    const result: BlitzResult = {
      blitzId: blitzId,
      answers,
      correctCount,
      totalCount: allQuestions.length,
      completedAt: new Date().toISOString(),
      durationSeconds: finalDuration,
    };

    void persistBlitzResult(result, topicResults);
    setSeconds(finalDuration);
    setFinished(true);
  }, [
    allQuestions,
    answers,
    blitzId,
    persistBlitzResult,
    topicResults,
  ]);

  useEffect(() => {
    if (finished) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const el = document.activeElement;
      if (
        el instanceof HTMLButtonElement ||
        el instanceof HTMLAnchorElement ||
        el?.getAttribute("role") === "button"
      ) {
        return;
      }
      const currentId = allQuestions[currentIndex]?.id;
      if (!currentId || !answers[currentId]) return;
      e.preventDefault();
      if (currentIndex < allQuestions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (Object.keys(answers).length === allQuestions.length) {
        handleFinish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    finished,
    answers,
    currentIndex,
    allQuestions,
    handleFinish,
  ]);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === allQuestions.length;
  const correctCount = allQuestions.filter(
    (q) => answers[q.id] === q.correct,
  ).length;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const current = allQuestions[currentIndex];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Блиц #{String(set.id).padStart(3, "0")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{set.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <DifficultyBadge difficulty={set.difficulty} />
          <span
            className="font-mono text-sm tabular-nums text-muted-foreground"
            title="Время с начала блица"
          >
            Всего: {formatTime(seconds)}
          </span>
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <QuestionTimer
          questionId={current.id}
          answered={!!answers[current.id]}
          disabled={finished}
        />
      </div>

      <div className="mb-8">
        <HydrationSafeProgress
          value={(answeredCount / allQuestions.length) * 100}
          className="h-1.5"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>
            {answeredCount} / {allQuestions.length} отвечено
          </span>
          {finished && (
            <span
              className={
                correctCount >= allQuestions.length * 0.8
                  ? "text-[color:var(--success)]"
                  : correctCount >= allQuestions.length * 0.6
                    ? "text-[color:var(--warning)]"
                    : "text-[color:var(--danger)]"
              }
            >
              {correctCount} / {allQuestions.length} правильно
            </span>
          )}
        </div>
      </div>

      {/* Category indicator */}
      <div className="mb-4 text-xs text-muted-foreground">
        Категория:{" "}
        <span className="text-foreground font-medium">
          {set.categories[Math.floor(currentIndex / 3)]?.name}
        </span>
      </div>

      <QuizQuestion
        key={current.id}
        question={current}
        index={currentIndex}
        total={allQuestions.length}
        onAnswer={handleAnswer}
        previousAnswer={answers[current.id]}
      />

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          &#8592; Назад
        </Button>

        <div className="flex gap-1.5">
          {allQuestions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-primary scale-125"
                  : answers[q.id]
                    ? answers[q.id] === q.correct
                      ? "bg-[color:var(--success)]"
                      : "bg-[color:var(--danger)]"
                    : "bg-muted"
              }`}
              aria-label={`Вопрос ${i + 1}`}
            />
          ))}
        </div>

        {currentIndex < allQuestions.length - 1 ? (
          <Button size="sm" onClick={handleNext}>
            Далее &#8594;
          </Button>
        ) : !finished ? (
          <Button
            size="sm"
            onClick={handleFinish}
            disabled={!allAnswered}
            className={
              allAnswered ? "bg-[color:var(--success)] hover:opacity-90" : ""
            }
          >
            Завершить
          </Button>
        ) : (
          <Button size="sm" onClick={() => router.push("/")}>
            На главную
          </Button>
        )}
      </div>

      {!finished && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          После выбора ответа:{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">
            Enter
          </kbd>{" "}
          — следующий вопрос или завершение
        </p>
      )}

      {finished && (
        <div className="mt-8 rounded-xl border border-border/60 bg-card p-6 text-center">
          <h2 className="text-2xl font-bold">
            {correctCount === allQuestions.length
              ? "Идеально!"
              : correctCount >= allQuestions.length * 0.8
                ? "Отлично!"
                : correctCount >= allQuestions.length * 0.6
                  ? "Неплохо!"
                  : "Нужно подтянуть!"}
          </h2>
          <p className="mt-2 text-4xl font-bold">
            <span
              className={
                correctCount >= allQuestions.length * 0.8
                  ? "text-[color:var(--success)]"
                  : correctCount >= allQuestions.length * 0.6
                    ? "text-[color:var(--warning)]"
                    : "text-[color:var(--danger)]"
              }
            >
              {correctCount}
            </span>
            <span className="text-muted-foreground">
              {" "}
              / {allQuestions.length}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Время: {formatTime(seconds)}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Button variant="outline" onClick={() => router.push("/")}>
              К наборам
            </Button>
            <Button onClick={() => router.push("/results")}>
              Результаты
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
