"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  ListChecks,
} from "lucide-react";
import type { PeTaskId } from "@/lib/process-excellence/registry";
import {
  PE_BLOCK_LABELS,
  PE_TASK_IDS,
  PE_TASK_META,
} from "@/lib/process-excellence/registry";
import { PeTaskQuestions } from "@/components/process-excellence/pe-task-questions";
import { PeTaskAnswers } from "@/components/process-excellence/pe-task-answers";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const NOTES_STORAGE_PREFIX = "allegro-pe-notes:v1:";

function notesKey(id: PeTaskId) {
  return `${NOTES_STORAGE_PREFIX}${id}`;
}

export function ProcessExcellenceTaskClient({ taskId }: { taskId: PeTaskId }) {
  const meta = PE_TASK_META[taskId];
  const block = PE_BLOCK_LABELS[meta.block];
  const idx = PE_TASK_IDS.indexOf(taskId);
  const prevId = idx > 0 ? PE_TASK_IDS[idx - 1]! : null;
  const nextId =
    idx < PE_TASK_IDS.length - 1 ? PE_TASK_IDS[idx + 1]! : null;

  const notesFieldId = useId();
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        setNotes(localStorage.getItem(notesKey(taskId)) ?? "");
      } catch {
        setNotes("");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const persistNotes = useCallback((value: string) => {
    try {
      localStorage.setItem(notesKey(taskId), value);
    } catch {
      /* ignore */
    }
  }, [taskId]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href="/process-excellence"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "inline-flex gap-1.5",
          )}
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          К списку заданий
        </Link>
        <Badge variant="secondary" className="font-mono">
          {idx + 1} / {PE_TASK_IDS.length}
        </Badge>
        <Badge variant="outline">{block.title}</Badge>
      </div>

      <Card className="overflow-hidden border-border/80 shadow-md">
        <CardHeader className="border-b border-border/60 bg-muted/30">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardDescription className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {block.description}
              </CardDescription>
              <CardTitle className="mt-1 text-xl sm:text-2xl">
                Задание {taskId}. {meta.title}
              </CardTitle>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ListChecks className="size-3.5 shrink-0" aria-hidden />
                ~{meta.estimatedMin} мин · {meta.short}
              </p>
            </div>
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary ring-1 ring-primary/20">
              PE
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <PeTaskQuestions id={taskId} />

          <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/20 p-4">
            <Label
              htmlFor={notesFieldId}
              className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <ClipboardList className="size-4 text-primary" aria-hidden />
              Твои заметки и черновик ответа
            </Label>
            <textarea
              id={notesFieldId}
              value={notes}
              onChange={(e) => {
                const v = e.target.value;
                setNotes(v);
                persistNotes(v);
              }}
              rows={6}
              placeholder="Пиши расчёты, выводы для стейкхолдера, гипотезы… Сохраняется локально в браузере."
              className={cn(
                "w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-relaxed",
                "text-foreground placeholder:text-muted-foreground",
                "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              )}
            />
            <p className="mt-2 text-[11px] text-muted-foreground">
              Данные не отправляются на сервер — только в{" "}
              <span className="font-mono">localStorage</span>.
            </p>
          </div>

          <details className="group mt-8 rounded-xl border border-border bg-card shadow-sm open:ring-1 open:ring-primary/15">
            <summary className="cursor-pointer list-none rounded-xl px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40">
              <span className="flex items-center justify-between gap-2">
                Ключ для самопроверки
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground group-open:bg-primary/10 group-open:text-primary">
                  раскрыть
                </span>
              </span>
            </summary>
            <div className="border-t border-border px-4 py-4">
              <PeTaskAnswers id={taskId} />
            </div>
          </details>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30">
          {prevId ? (
            <Link
              href={`/process-excellence/${prevId}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "inline-flex gap-1.5",
              )}
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              Задание {prevId}
            </Link>
          ) : (
            <span />
          )}
          {nextId ? (
            <Link
              href={`/process-excellence/${nextId}`}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "inline-flex gap-1.5",
              )}
            >
              Задание {nextId}
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
          ) : (
            <Link
              href="/process-excellence"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
              )}
            >
              Завершить
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
