export type Difficulty = "easy" | "medium" | "hard";

export type RoleTag =
  | "automation"
  | "controller"
  | "project"
  | "general";

export type AnswerKey = "A" | "B" | "C" | "D";

export interface Question {
  id: string;
  text: string;
  options: Record<AnswerKey, string>;
  correct: AnswerKey;
  explanation: string;
  difficulty: Difficulty;
  role: RoleTag;
  topic: string;
}

export interface BlitzCategory {
  name: string;
  role: RoleTag;
  questions: [Question, Question, Question];
}

export interface BlitzSet {
  id: number;
  title: string;
  difficulty: Difficulty;
  categories: [BlitzCategory, BlitzCategory, BlitzCategory];
}

export type BlitzStatus = "not_started" | "in_progress" | "completed";

export interface BlitzResult {
  blitzId: number;
  answers: Record<string, AnswerKey>;
  correctCount: number;
  totalCount: number;
  completedAt: string;
  /** Секунды от старта до завершения (для саммари и повторного просмотра). */
  durationSeconds?: number;
}

export interface UserProgress {
  completedBlitzes: Record<number, BlitzResult>;
  totalCorrect: number;
  totalAnswered: number;
  topicStats: Record<string, { correct: number; total: number }>;
}
