"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { allBlitzSets } from "@/lib/data";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgressContext } from "@/contexts/ProgressContext";
import type { UserProgress } from "@/lib/types";

function TopicHeatmap({ topicStats }: { topicStats: UserProgress["topicStats"] }) {
  const sorted = useMemo(() => {
    return Object.entries(topicStats)
      .map(([topic, stats]) => ({
        topic: topic.replace(/_/g, " "),
        ...stats,
        rate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      }))
      .sort((a, b) => a.rate - b.rate);
  }, [topicStats]);

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Пройдите хотя бы один блиц, чтобы увидеть статистику по темам.
      </p>
    );
  }

  return (
    <div className="grid gap-1.5">
      {sorted.map((item) => {
        const color =
          item.rate >= 80
            ? "bg-[color:var(--success)]/80"
            : item.rate >= 60
              ? "bg-[color:var(--warning)]/80"
              : "bg-[color:var(--danger)]/80";
        return (
          <div key={item.topic} className="flex items-center gap-3">
            <span className="w-40 truncate text-xs text-muted-foreground capitalize">
              {item.topic}
            </span>
            <div className="flex-1 h-5 rounded-sm bg-muted/30 overflow-hidden">
              <div
                className={`h-full rounded-sm transition-all ${color}`}
                style={{ width: `${Math.max(item.rate, 2)}%` }}
              />
            </div>
            <span className="w-16 text-right text-xs font-mono">
              <span
                className={
                  item.rate >= 80
                    ? "text-[color:var(--success)]"
                    : item.rate >= 60
                      ? "text-[color:var(--warning)]"
                      : "text-[color:var(--danger)]"
                }
              >
                {item.rate}%
              </span>
              <span className="text-muted-foreground ml-1">
                ({item.correct}/{item.total})
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function WeakTopics({ topicStats }: { topicStats: UserProgress["topicStats"] }) {
  const weak = useMemo(() => {
    return Object.entries(topicStats)
      .filter(([, s]) => s.total >= 3)
      .map(([topic, s]) => ({
        topic: topic.replace(/_/g, " "),
        rate: Math.round((s.correct / s.total) * 100),
        ...s,
      }))
      .filter((t) => t.rate < 60)
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 10);
  }, [topicStats]);

  if (weak.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Слабых тем нет — вы отлично справляетесь!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {weak.map((t) => (
        <div
          key={t.topic}
          className="flex items-center justify-between rounded-lg border border-[color:var(--danger)]/25 bg-[color:var(--danger)]/5 px-3 py-2"
        >
          <span className="text-sm capitalize">{t.topic}</span>
          <span className="text-sm font-mono text-[color:var(--danger)]">
            {t.rate}% ({t.correct}/{t.total})
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const { progress, hydrated, resetAll } = useProgressContext();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted-foreground sm:px-6">
        Загрузка…
      </div>
    );
  }

  const completedCount = Object.keys(progress.completedBlitzes).length;
  const totalSets = allBlitzSets.length;
  const correctRate =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;

  const byDifficulty = {
    easy: { done: 0, correct: 0, total: 0 },
    medium: { done: 0, correct: 0, total: 0 },
    hard: { done: 0, correct: 0, total: 0 },
  };

  for (const [idStr, result] of Object.entries(progress.completedBlitzes)) {
    const set = allBlitzSets.find((s) => s.id === Number(idStr));
    if (!set) continue;
    const d = set.difficulty;
    byDifficulty[d].done += 1;
    byDifficulty[d].correct += result.correctCount;
    byDifficulty[d].total += result.totalCount;
  }

  const handleReset = () => {
    if (window.confirm("Вы уверены? Весь прогресс будет удалён.")) {
      void resetAll().then(() => router.push("/"));
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Результаты
          </h1>
          <p className="text-sm text-muted-foreground">
            Общая статистика и слабые места
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/")}>
          &#8592; К наборам
        </Button>
      </div>

      <div className="mb-8">
        <ProgressBar
          completed={completedCount}
          total={totalSets}
          correctRate={correctRate}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Пройдено
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedCount}</p>
            <p className="text-xs text-muted-foreground">
              из {totalSets} наборов
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Всего ответов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{progress.totalAnswered}</p>
            <p className="text-xs text-muted-foreground">
              {progress.totalCorrect} правильных
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Точность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                correctRate >= 80
                  ? "text-[color:var(--success)]"
                  : correctRate >= 60
                    ? "text-[color:var(--warning)]"
                    : "text-[color:var(--danger)]"
              }`}
            >
              {correctRate}%
            </p>
            <p className="text-xs text-muted-foreground">общая</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {(["easy", "medium", "hard"] as const).map((d) => {
          const data = byDifficulty[d];
          const rate =
            data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
          const labels = { easy: "Easy", medium: "Medium", hard: "Hard" };
          const colors = {
            easy: "text-[color:var(--success)]",
            medium: "text-[color:var(--warning)]",
            hard: "text-[color:var(--danger)]",
          };
          return (
            <Card key={d}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${colors[d]}`}>
                  {labels[d]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{rate}%</p>
                <p className="text-xs text-muted-foreground">
                  {data.done} наборов, {data.correct}/{data.total} ответов
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Тепловая карта тем</CardTitle>
        </CardHeader>
        <CardContent>
          <TopicHeatmap topicStats={progress.topicStats} />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Слабые места</CardTitle>
        </CardHeader>
        <CardContent>
          <WeakTopics topicStats={progress.topicStats} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="destructive" size="sm" onClick={handleReset}>
          Сбросить прогресс
        </Button>
      </div>
    </div>
  );
}
