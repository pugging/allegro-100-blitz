import type { SkillId, SkillTrack, Lesson } from "./types";

export const SKILL_TRACKS: Record<SkillId, SkillTrack> = {
  python: {
    id: "python",
    title: "Python",
    shortTitle: "Python",
    description:
      "From syntax basics to Python for AI/ML. Data structures, OOP, testing, and the ecosystem used in GenAI projects.",
    icon: "python",
    color: "bg-blue-500/10 text-blue-600",
    lessonCount: 5,
    totalMinutes: 90,
    category: "core",
  },
  git: {
    id: "git",
    title: "Git & Version Control",
    shortTitle: "Git",
    description:
      "Repository fundamentals, branching strategies, collaboration workflows, PRs, and CI/CD basics.",
    icon: "git",
    color: "bg-orange-500/10 text-orange-600",
    lessonCount: 3,
    totalMinutes: 45,
    category: "core",
  },
  "rest-api": {
    id: "rest-api",
    title: "REST APIs",
    shortTitle: "REST API",
    description:
      "HTTP protocol, REST architecture, building APIs with FastAPI/Flask, authentication, and security patterns.",
    icon: "api",
    color: "bg-green-500/10 text-green-600",
    lessonCount: 4,
    totalMinutes: 60,
    category: "core",
  },
  "llm-basics": {
    id: "llm-basics",
    title: "LLM Fundamentals",
    shortTitle: "LLMs",
    description:
      "What are LLMs, transformer architecture, tokenization, embeddings, semantic search, and known limitations.",
    icon: "brain",
    color: "bg-purple-500/10 text-purple-600",
    lessonCount: 4,
    totalMinutes: 70,
    category: "genai",
  },
  rag: {
    id: "rag",
    title: "RAG (Retrieval-Augmented Generation)",
    shortTitle: "RAG",
    description:
      "End-to-end RAG pipeline: document ingestion, chunking, indexing, retrieval strategies, and evaluation.",
    icon: "search",
    color: "bg-indigo-500/10 text-indigo-600",
    lessonCount: 4,
    totalMinutes: 65,
    category: "genai",
  },
  "vector-databases": {
    id: "vector-databases",
    title: "Vector Databases",
    shortTitle: "Vector DBs",
    description:
      "Vector similarity concepts, HNSW/IVF indexing, and hands-on with Pinecone, Chroma, and Weaviate.",
    icon: "database",
    color: "bg-cyan-500/10 text-cyan-600",
    lessonCount: 3,
    totalMinutes: 45,
    category: "genai",
  },
  "prompt-engineering": {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    shortTitle: "Prompting",
    description:
      "Prompting fundamentals, Chain-of-Thought, few-shot, system prompts, guardrails, and evaluation techniques.",
    icon: "sparkles",
    color: "bg-amber-500/10 text-amber-600",
    lessonCount: 4,
    totalMinutes: 55,
    category: "genai",
  },
  "langchain-langgraph": {
    id: "langchain-langgraph",
    title: "LangChain & LangGraph",
    shortTitle: "LangChain",
    description:
      "Building LLM applications with LangChain, chains, agents, tools, and stateful workflows with LangGraph.",
    icon: "link",
    color: "bg-emerald-500/10 text-emerald-600",
    lessonCount: 4,
    totalMinutes: 70,
    category: "tools",
  },
  "cloud-platforms": {
    id: "cloud-platforms",
    title: "Cloud Platforms",
    shortTitle: "Cloud",
    description:
      "Cloud fundamentals, Azure AI Services, AWS/GCP overview, deployment patterns, and MLOps basics.",
    icon: "cloud",
    color: "bg-sky-500/10 text-sky-600",
    lessonCount: 4,
    totalMinutes: 60,
    category: "tools",
  },
};

export const SKILL_ORDER: SkillId[] = [
  "python",
  "git",
  "rest-api",
  "llm-basics",
  "rag",
  "vector-databases",
  "prompt-engineering",
  "langchain-langgraph",
  "cloud-platforms",
];

export const CATEGORY_LABELS = {
  core: { title: "Core Engineering", description: "Foundational skills required for the role" },
  genai: { title: "Generative AI", description: "LLM concepts, RAG, and prompt engineering" },
  tools: { title: "Frameworks & Cloud", description: "Practical tools and cloud platforms" },
} as const;

const lessonModules: Record<string, () => Promise<{ lesson: Lesson }>> = {};

export function registerLesson(id: string, loader: () => Promise<{ lesson: Lesson }>) {
  lessonModules[id] = loader;
}

export async function loadLesson(id: string): Promise<Lesson | null> {
  const loader = lessonModules[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.lesson;
}

export function getLessonIdsForSkill(skillId: SkillId): string[] {
  return Object.keys(lessonModules)
    .filter((id) => id.startsWith(`${skillId}-`))
    .sort();
}
