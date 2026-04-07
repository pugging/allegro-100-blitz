"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DifficultyBadge } from "./DifficultyBadge";
import { RoleBadge } from "./RoleBadge";
import type { Question, AnswerKey } from "@/lib/types";

interface QuizQuestionProps {
  question: Question;
  index: number;
  total: number;
  onAnswer: (questionId: string, answer: AnswerKey, correct: boolean) => void;
  previousAnswer?: AnswerKey;
}

const keys: AnswerKey[] = ["A", "B", "C", "D"];

export function QuizQuestion({
  question,
  index,
  total,
  onAnswer,
  previousAnswer,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<AnswerKey | null>(
    previousAnswer ?? null,
  );
  const answered = selected !== null;

  function handleSelect(key: AnswerKey) {
    if (answered) return;
    setSelected(key);
    onAnswer(question.id, key, key === question.correct);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          Вопрос {index + 1} / {total}
        </span>
        <div className="flex gap-1.5">
          <RoleBadge role={question.role} />
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
      </div>

      <p className="text-lg font-medium leading-relaxed">{question.text}</p>

      <div className="grid gap-2">
        {keys.map((key) => {
          const isCorrect = key === question.correct;
          const isSelected = key === selected;
          let style =
            "border border-border/60 bg-card hover:border-primary/40 hover:bg-accent/40 cursor-pointer";

          if (answered) {
            if (isCorrect) {
              style =
                "border border-[color:var(--success)]/45 bg-[color:var(--success)]/10 text-foreground";
            } else if (isSelected && !isCorrect) {
              style =
                "border border-[color:var(--danger)]/45 bg-[color:var(--danger)]/10 text-foreground";
            } else {
              style = "border border-border/40 bg-muted/30 opacity-60";
            }
          }

          return (
            <Card
              key={key}
              className={`transition-all ${style} ${answered ? "cursor-default" : ""}`}
              onClick={() => handleSelect(key)}
            >
              <CardContent className="flex items-start gap-3 py-3 px-4">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    answered && isCorrect
                      ? "bg-[color:var(--success)] text-white"
                      : answered && isSelected && !isCorrect
                        ? "bg-[color:var(--danger)] text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {key}
                </span>
                <span className="text-sm leading-relaxed">
                  {question.options[key]}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {answered && (
        <div
          className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm leading-relaxed text-foreground"
          role="status"
          aria-live="polite"
        >
          <span className="font-semibold text-primary">Пояснение: </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
