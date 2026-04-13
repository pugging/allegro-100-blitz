import type { Lesson, SkillId } from "../types";

const lessonCache = new Map<string, Lesson>();

type LessonModule = { lesson: Lesson };

const loaders: Record<string, () => Promise<LessonModule>> = {
  "python-01": () => import("./python/01-basics"),
  "python-02": () => import("./python/02-data-structures"),
  "python-03": () => import("./python/03-functions-oop"),
  "python-04": () => import("./python/04-error-handling-testing"),
  "python-05": () => import("./python/05-python-for-ai"),
  "git-01": () => import("./git/01-basics"),
  "git-02": () => import("./git/02-branching-merging"),
  "git-03": () => import("./git/03-collaboration-workflows"),
  "rest-api-01": () => import("./rest-api/01-http-fundamentals"),
  "rest-api-02": () => import("./rest-api/02-rest-principles"),
  "rest-api-03": () => import("./rest-api/03-building-apis"),
  "rest-api-04": () => import("./rest-api/04-auth-security"),
  "llm-basics-01": () => import("./llm-basics/01-what-are-llms"),
  "llm-basics-02": () => import("./llm-basics/02-architecture-transformers"),
  "llm-basics-03": () => import("./llm-basics/03-embeddings-semantic-search"),
  "llm-basics-04": () => import("./llm-basics/04-limitations-hallucinations"),
  "rag-01": () => import("./rag/01-what-is-rag"),
  "rag-02": () => import("./rag/02-chunking-indexing"),
  "rag-03": () => import("./rag/03-retrieval-strategies"),
  "rag-04": () => import("./rag/04-evaluation-optimization"),
  "vector-databases-01": () => import("./vector-databases/01-vector-similarity"),
  "vector-databases-02": () => import("./vector-databases/02-pinecone-chroma-weaviate"),
  "vector-databases-03": () => import("./vector-databases/03-indexing-querying"),
  "prompt-engineering-01": () => import("./prompt-engineering/01-fundamentals"),
  "prompt-engineering-02": () => import("./prompt-engineering/02-techniques-cot-fewshot"),
  "prompt-engineering-03": () => import("./prompt-engineering/03-system-prompts-guardrails"),
  "prompt-engineering-04": () => import("./prompt-engineering/04-evaluation-iteration"),
  "langchain-langgraph-01": () => import("./langchain-langgraph/01-langchain-basics"),
  "langchain-langgraph-02": () => import("./langchain-langgraph/02-chains-agents"),
  "langchain-langgraph-03": () => import("./langchain-langgraph/03-langgraph-state-machines"),
  "langchain-langgraph-04": () => import("./langchain-langgraph/04-practical-projects"),
  "cloud-platforms-01": () => import("./cloud-platforms/01-cloud-fundamentals"),
  "cloud-platforms-02": () => import("./cloud-platforms/02-azure-ai-services"),
  "cloud-platforms-03": () => import("./cloud-platforms/03-aws-gcp-overview"),
  "cloud-platforms-04": () => import("./cloud-platforms/04-deployment-mlops-basics"),
};

export const ALL_LESSON_IDS = Object.keys(loaders).sort();

export function getLessonIdsForSkill(skillId: SkillId): string[] {
  return ALL_LESSON_IDS.filter((id) => id.startsWith(`${skillId}-`));
}

export async function loadLesson(lessonId: string): Promise<Lesson | null> {
  const cached = lessonCache.get(lessonId);
  if (cached) return cached;

  const loader = loaders[lessonId];
  if (!loader) return null;

  const mod = await loader();
  lessonCache.set(lessonId, mod.lesson);
  return mod.lesson;
}

export function getLessonIdBySlug(
  skillId: SkillId,
  slug: string,
): string | null {
  const ids = getLessonIdsForSkill(skillId);
  const match = ids.find((id) => {
    const suffix = id.replace(`${skillId}-`, "");
    return suffix === slug;
  });
  return match ?? null;
}
