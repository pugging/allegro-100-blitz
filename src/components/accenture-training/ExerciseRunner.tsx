"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/accenture-training/types";

interface ExerciseRunnerProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
}

export function ExerciseRunner({
  exercise,
  onComplete,
  isCompleted,
}: ExerciseRunnerProps) {
  switch (exercise.type) {
    case "multiple-choice":
      return (
        <MCQExercise
          exercise={exercise}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );
    case "code-completion":
      return (
        <CodeCompletionExercise
          exercise={exercise}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );
    case "ordering":
      return (
        <OrderingExercise
          exercise={exercise}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );
    case "true-false":
      return (
        <TrueFalseExercise
          exercise={exercise}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );
    case "scenario":
      return (
        <ScenarioExercise
          exercise={exercise}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );
  }
}

function MCQExercise({
  exercise,
  onComplete,
  isCompleted,
}: {
  exercise: Extract<Exercise, { type: "multiple-choice" }>;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  function handleSelect(idx: number) {
    if (answered || isCompleted) return;
    setSelected(idx);
    onComplete(idx === exercise.correctIndex);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium leading-relaxed text-foreground">
        {exercise.question}
      </p>
      <div className="grid gap-2">
        {exercise.options.map((opt, idx) => {
          const isCorrect = idx === exercise.correctIndex;
          const isSelected = idx === selected;

          let style =
            "border border-border/60 bg-card hover:border-primary/40 hover:bg-accent/40 cursor-pointer";

          if (answered || isCompleted) {
            if (isCorrect) {
              style =
                "border border-[color:var(--success)]/45 bg-[color:var(--success)]/10";
            } else if (isSelected && !isCorrect) {
              style =
                "border border-[color:var(--danger)]/45 bg-[color:var(--danger)]/10";
            } else {
              style = "border border-border/40 bg-muted/30 opacity-60";
            }
          }

          const labels = ["A", "B", "C", "D", "E", "F"];

          return (
            <Card
              key={idx}
              className={cn(
                "transition-all",
                style,
                answered || isCompleted ? "cursor-default" : "",
              )}
              onClick={() => handleSelect(idx)}
            >
              <CardContent className="flex items-start gap-3 py-3 px-4">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    answered && isCorrect
                      ? "bg-[color:var(--success)] text-white"
                      : answered && isSelected && !isCorrect
                        ? "bg-[color:var(--danger)] text-white"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {labels[idx]}
                </span>
                <span className="text-sm text-foreground">{opt}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {(answered || isCompleted) && (
        <ExplanationBox
          explanation={exercise.explanation}
          interviewNote={exercise.interviewNote}
        />
      )}
    </div>
  );
}

function CodeCompletionExercise({
  exercise,
  onComplete,
  isCompleted,
}: {
  exercise: Extract<Exercise, { type: "code-completion" }>;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isCorrect =
    answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase() ||
    (exercise.acceptableAnswers ?? []).some(
      (a) => a.trim().toLowerCase() === answer.trim().toLowerCase(),
    );

  function handleSubmit() {
    if (submitted || isCompleted) return;
    setSubmitted(true);
    onComplete(isCorrect);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium leading-relaxed text-foreground">
        {exercise.question}
      </p>
      <CodeBlock
        language={exercise.language}
        code={exercise.codeTemplate}
      />
      <div className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          disabled={submitted || isCompleted}
          placeholder="Type your answer..."
          className={cn(
            "flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            submitted && isCorrect && "border-[color:var(--success)]/45 bg-[color:var(--success)]/5",
            submitted && !isCorrect && "border-[color:var(--danger)]/45 bg-[color:var(--danger)]/5",
          )}
        />
        {!submitted && !isCompleted && (
          <Button onClick={handleSubmit} disabled={!answer.trim()}>
            Check
          </Button>
        )}
      </div>
      {submitted && !isCorrect && (
        <p className="text-sm text-muted-foreground">
          Correct answer:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            {exercise.correctAnswer}
          </code>
        </p>
      )}
      {(submitted || isCompleted) && (
        <ExplanationBox
          explanation={exercise.explanation}
          interviewNote={exercise.interviewNote}
        />
      )}
    </div>
  );
}

function OrderingExercise({
  exercise,
  onComplete,
  isCompleted,
}: {
  exercise: Extract<Exercise, { type: "ordering" }>;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
}) {
  const [order, setOrder] = useState<number[]>(() =>
    exercise.items.map((_, i) => i),
  );
  const [submitted, setSubmitted] = useState(false);

  const isCorrect =
    submitted &&
    order.every((val, idx) => val === exercise.correctOrder[idx]);

  function moveUp(idx: number) {
    if (idx === 0 || submitted || isCompleted) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveDown(idx: number) {
    if (idx === order.length - 1 || submitted || isCompleted) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  function handleSubmit() {
    if (submitted || isCompleted) return;
    setSubmitted(true);
    const correct = order.every(
      (val, idx) => val === exercise.correctOrder[idx],
    );
    onComplete(correct);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium leading-relaxed text-foreground">
        {exercise.question}
      </p>
      <div className="space-y-2">
        {order.map((itemIdx, pos) => {
          const correctPos =
            submitted && exercise.correctOrder[pos] === itemIdx;
          const wrongPos = submitted && !correctPos;

          return (
            <div
              key={itemIdx}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-3 text-sm transition-all",
                correctPos &&
                  "border-[color:var(--success)]/45 bg-[color:var(--success)]/5",
                wrongPos &&
                  "border-[color:var(--danger)]/45 bg-[color:var(--danger)]/5",
                !submitted && "border-border/60 bg-card",
              )}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {pos + 1}
              </span>
              <span className="flex-1">{exercise.items[itemIdx]}</span>
              {!submitted && !isCompleted && (
                <div className="flex gap-1">
                  <button
                    onClick={() => moveUp(pos)}
                    disabled={pos === 0}
                    className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                  >
                    &#9650;
                  </button>
                  <button
                    onClick={() => moveDown(pos)}
                    disabled={pos === order.length - 1}
                    className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                  >
                    &#9660;
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!submitted && !isCompleted && (
        <Button onClick={handleSubmit}>Check Order</Button>
      )}
      {submitted && !isCorrect && (
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Correct order:</p>
          <ol className="mt-1 list-decimal pl-5">
            {exercise.correctOrder.map((itemIdx) => (
              <li key={itemIdx}>{exercise.items[itemIdx]}</li>
            ))}
          </ol>
        </div>
      )}
      {(submitted || isCompleted) && (
        <ExplanationBox
          explanation={exercise.explanation}
          interviewNote={exercise.interviewNote}
        />
      )}
    </div>
  );
}

function TrueFalseExercise({
  exercise,
  onComplete,
  isCompleted,
}: {
  exercise: Extract<Exercise, { type: "true-false" }>;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
}) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const answered = answer !== null;

  function handleSelect(val: boolean) {
    if (answered || isCompleted) return;
    setAnswer(val);
    onComplete(val === exercise.correct);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium leading-relaxed text-foreground">
        {exercise.statement}
      </p>
      <div className="flex gap-3">
        {[true, false].map((val) => {
          const isCorrect = val === exercise.correct;
          const isSelected = val === answer;

          let style =
            "border border-border/60 bg-card hover:border-primary/40 cursor-pointer";

          if (answered || isCompleted) {
            if (isCorrect) {
              style =
                "border border-[color:var(--success)]/45 bg-[color:var(--success)]/10";
            } else if (isSelected && !isCorrect) {
              style =
                "border border-[color:var(--danger)]/45 bg-[color:var(--danger)]/10";
            } else {
              style = "border border-border/40 bg-muted/30 opacity-60";
            }
          }

          return (
            <button
              key={String(val)}
              onClick={() => handleSelect(val)}
              className={cn(
                "flex-1 rounded-xl py-4 text-center text-sm font-semibold transition-all",
                style,
                (answered || isCompleted) && "cursor-default",
              )}
            >
              {val ? "True" : "False"}
            </button>
          );
        })}
      </div>
      {(answered || isCompleted) && (
        <ExplanationBox
          explanation={exercise.explanation}
          interviewNote={exercise.interviewNote}
        />
      )}
    </div>
  );
}

function ScenarioExercise({
  exercise,
  onComplete,
  isCompleted,
}: {
  exercise: Extract<Exercise, { type: "scenario" }>;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);

  function handleReveal() {
    if (revealed || isCompleted) return;
    setRevealed(true);
    onComplete(true);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed">
        <p className="mb-1 font-semibold text-foreground">Scenario:</p>
        <p className="text-foreground/90">{exercise.scenario}</p>
      </div>
      <p className="text-sm font-medium text-foreground">{exercise.question}</p>
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        disabled={revealed || isCompleted}
        placeholder="Write your answer here..."
        rows={4}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
      />
      {!revealed && !isCompleted && (
        <Button onClick={handleReveal} disabled={!userAnswer.trim()}>
          Show Sample Answer
        </Button>
      )}
      {(revealed || isCompleted) && (
        <>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">
            <p className="mb-2 font-semibold text-primary">Sample answer:</p>
            <p className="text-foreground/90">{exercise.sampleAnswer}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-sm">
            <p className="mb-2 font-semibold text-foreground">Key points to cover:</p>
            <ul className="space-y-1 pl-4 list-disc text-foreground/80">
              {exercise.keyPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
          {exercise.interviewNote && (
            <div className="rounded-xl border border-amber-300/30 bg-amber-50/50 p-3 text-sm text-amber-900">
              <span className="font-semibold">Interview note: </span>
              {exercise.interviewNote}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ExplanationBox({
  explanation,
  interviewNote,
}: {
  explanation: string;
  interviewNote?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm leading-relaxed">
        <span className="font-semibold text-primary">Explanation: </span>
        <span className="text-foreground">{explanation}</span>
      </div>
      {interviewNote && (
        <div className="rounded-xl border border-amber-300/30 bg-amber-50/50 p-3 text-sm text-amber-900">
          <span className="font-semibold">Interview note: </span>
          {interviewNote}
        </div>
      )}
    </div>
  );
}
