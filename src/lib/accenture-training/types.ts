export type SkillId =
  | "python"
  | "git"
  | "rest-api"
  | "llm-basics"
  | "rag"
  | "vector-databases"
  | "prompt-engineering"
  | "langchain-langgraph"
  | "cloud-platforms";

export type ContentBlockType =
  | "text"
  | "heading"
  | "code"
  | "callout"
  | "tip"
  | "list"
  | "diagram";

export interface TextBlock {
  type: "text";
  content: string;
}

export interface HeadingBlock {
  type: "heading";
  level: 2 | 3 | 4;
  content: string;
}

export interface CodeBlock {
  type: "code";
  language: string;
  code: string;
  filename?: string;
}

export interface CalloutBlock {
  type: "callout";
  variant: "info" | "warning" | "success" | "danger";
  title?: string;
  content: string;
}

export interface TipBlock {
  type: "tip";
  content: string;
}

export interface ListBlock {
  type: "list";
  ordered: boolean;
  items: string[];
}

export interface DiagramBlock {
  type: "diagram";
  alt: string;
  content: string;
}

export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | CodeBlock
  | CalloutBlock
  | TipBlock
  | ListBlock
  | DiagramBlock;

export interface MultipleChoiceExercise {
  type: "multiple-choice";
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  interviewNote?: string;
}

export interface CodeCompletionExercise {
  type: "code-completion";
  id: string;
  question: string;
  codeTemplate: string;
  language: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation: string;
  interviewNote?: string;
}

export interface OrderingExercise {
  type: "ordering";
  id: string;
  question: string;
  items: string[];
  correctOrder: number[];
  explanation: string;
  interviewNote?: string;
}

export interface TrueFalseExercise {
  type: "true-false";
  id: string;
  statement: string;
  correct: boolean;
  explanation: string;
  interviewNote?: string;
}

export interface ScenarioExercise {
  type: "scenario";
  id: string;
  scenario: string;
  question: string;
  sampleAnswer: string;
  keyPoints: string[];
  interviewNote?: string;
}

export type Exercise =
  | MultipleChoiceExercise
  | CodeCompletionExercise
  | OrderingExercise
  | TrueFalseExercise
  | ScenarioExercise;

export interface Lesson {
  id: string;
  skillId: SkillId;
  order: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  objectives: string[];
  content: ContentBlock[];
  keyTakeaways: string[];
  interviewTips: string[];
  exercises: Exercise[];
}

export interface SkillTrack {
  id: SkillId;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  lessonCount: number;
  totalMinutes: number;
  category: "core" | "genai" | "tools";
}
