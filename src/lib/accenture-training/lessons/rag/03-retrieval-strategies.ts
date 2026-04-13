import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rag-03",
  skillId: "rag",
  order: 3,
  title: "Retrieval Strategies",
  subtitle:
    "From naive top-k similarity to hybrid search, re-ranking, query transforms, and LangChain patterns like contextual compression and parent-document retrieval.",
  estimatedMinutes: 16,
  objectives: [
    "Explain similarity metrics (cosine, dot product) and when normalization matters.",
    "Apply top-k retrieval and MMR to balance relevance vs diversity.",
    "Describe hybrid keyword + semantic search and re-ranking.",
    "Outline query transformation techniques (HyDE, multi-query) and contextual compression.",
    "Contrast child-chunk retrieval with parent-document expansion for context.",
  ],
  content: [
    {
      type: "text",
      content:
        "Retrieval is where many RAG systems win or lose. A strong embedding model with naive top-k can still return redundant passages or miss exact keywords (SKUs, legal cites). This lesson covers the toolbox you should be able to discuss in a technical interview.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Mental model",
      content:
        "Think in two phases: **recall** (get anything relevant into a candidate set) and **precision** (surface the best ordering for the LLM). Hybrid search improves recall; re-ranking improves precision.",
    },
    {
      type: "heading",
      level: 2,
      content: "Similarity search: cosine vs dot product",
    },
    {
      type: "text",
      content:
        "Embeddings are often **L2-normalized**, making **cosine similarity** equivalent to dot product up to scale. Dot product on unnormalized vectors favors longer texts. In interviews, say you check whether your provider normalizes outputs and whether inner-product indexes (e.g. some ANN configs) assume unit vectors.",
    },
    {
      type: "heading",
      level: 2,
      content: "Top-k retrieval",
    },
    {
      type: "text",
      content:
        "Given a query vector, retrieve the k nearest neighbors in embedding space. Small k saves tokens but risks missing evidence; large k adds noise and cost. Dynamic k (stop when similarity drops below a threshold) is a common refinement.",
    },
    {
      type: "heading",
      level: 2,
      content: "MMR (Maximal Marginal Relevance)",
    },
    {
      type: "text",
      content:
        "MMR trades off **relevance to the query** against **diversity among selected docs**. It reduces five nearly identical chunks crowding the context window—useful when the corpus has heavy duplication (templated KB articles).",
    },
    {
      type: "heading",
      level: 2,
      content: "Hybrid search",
    },
    {
      type: "text",
      content:
        "Combine **dense vectors** (semantic) with **sparse signals** (BM25, keyword). Dense search finds paraphrases; sparse finds exact tokens (error codes, SKUs). Fusion strategies include weighted score sum, reciprocal rank fusion (RRF), or letting a re-ranker consume both lists.",
    },
    {
      type: "heading",
      level: 2,
      content: "Re-ranking",
    },
    {
      type: "text",
      content:
        "First stage ANN retrieval is fast but approximate; a **cross-encoder** or dedicated re-ranker scores (query, passage) pairs more accurately on a short list (e.g. 50 → 8). Latency increases, so use two-stage patterns in production.",
    },
    {
      type: "heading",
      level: 2,
      content: "Query transformation",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "HyDE: generate a hypothetical document answering the query, embed that text, retrieve with it—helps short or abstract queries.",
        "Multi-query: LLM rewrites the user question into several variants; retrieve for each and merge/dedupe—improves recall on ambiguous phrasing.",
        "Step-back / decomposition: break complex questions into sub-queries for iterative retrieval (ties into agentic patterns).",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Contextual compression",
    },
    {
      type: "text",
      content:
        "After retrieval, run a smaller model or heuristic to **compress** each passage to only sentences relevant to the query before stuffing the prompt. Cuts noise and tokens; adds latency and another failure surface—evaluate carefully.",
    },
    {
      type: "heading",
      level: 2,
      content: "Parent document retriever",
    },
    {
      type: "text",
      content:
        "Embed **small child chunks** for precise retrieval, then replace or expand with the **parent** section/full document for generation. You get tight embeddings plus broader context for the LLM—classic fix for boundary effects without giant embeddings.",
    },
    {
      type: "code",
      language: "python",
      filename: "retrieval_snippets.py",
      code: `# Illustrative patterns — adapt to your LangChain version / vector store

# MMR-style selection is available on many vector store wrappers:
# docs = vectorstore.max_marginal_relevance_search(query, k=4, fetch_k=20, lambda_mult=0.5)
# lambda_mult → 1 emphasizes relevance; lower values emphasize diversity.

# Multi-query retrieval (conceptual)
# queries = llm.generate_variants(user_question)
# buckets = [vectorstore.similarity_search(q, k=5) for q in queries]
# merged = dedupe_by_doc_id(buckets)

# ParentDocumentRetriever: small chunks in the vectorstore, mapping to larger stored docs
# retrieve small ids → load parent text from docstore for prompt context

from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
# compressor = LLMChainExtractor.from_llm(llm)
# compression_retriever = ContextualCompressionRetriever(
#     base_compressor=compressor, base_retriever=base_retriever
# )`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Latency budget",
      content:
        "Each extra LLM call (HyDE, multi-query, compression) adds round-trips. For real-time chat, cap variants, parallelize where possible, or cache frequent queries.",
    },
    {
      type: "diagram",
      alt: "Two-stage retrieval with ANN then re-ranker",
      content: `flowchart LR
  Q[User query] --> E[Embed / transform]
  E --> ANN[ANN top-50]
  ANN --> RR[Re-ranker top-8]
  RR --> P[Prompt + LLM]`,
    },
  ],
  keyTakeaways: [
    "Cosine vs dot product hinges on normalization; know what your stack assumes.",
    "Top-k is the baseline; MMR reduces redundancy in the context window.",
    "Hybrid search combines semantic and lexical strengths; re-ranking sharpens the final ordering.",
    "Query transforms and parent/child patterns attack vocabulary mismatch and chunk-boundary issues.",
  ],
  interviewTips: [
    "Name two failure modes (e.g. duplicate chunks, exact-term miss) and match each to a technique.",
    "Separate offline indexing from online query path when discussing latency.",
    "If you cite HyDE or multi-query, mention evaluation—more retrieval is not always better.",
    "Relate contextual compression to token cost and signal-to-noise ratio.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "rag03-mc-hybrid",
      question:
        "A support bot fails on tickets that include exact error codes like E-10432 but works for paraphrased symptoms. Which retrieval upgrade targets that gap best?",
      options: [
        "Increase temperature on the generator",
        "Add lexical/BM25 (sparse) hybrid retrieval or keyword filters alongside dense search",
        "Switch to a larger embedding model only",
        "Remove chunk overlap entirely",
      ],
      correctIndex: 1,
      explanation:
        "Exact tokens are where sparse lexical methods shine; dense embeddings may not align error codes with natural language. Hybrid or keyword filters directly improve recall for those patterns. Temperature and overlap do not fix lexical mismatch.",
      interviewNote:
        "Mention RRF or weighted fusion if the interviewer wants implementation detail.",
    },
    {
      type: "ordering",
      id: "rag03-ord-twostage",
      question:
        "Order these steps for a common two-stage retrieval + generation setup (first → last).",
      items: [
        "Call the LLM with retrieved passages in the prompt",
        "Re-rank the candidate list to select final passages",
        "Embed the user query (or transformed queries)",
        "ANN retrieve a larger candidate set (e.g. top 50)",
      ],
      correctOrder: [2, 3, 1, 0],
      explanation:
        "Embed query → ANN wide recall → re-rank for precision → augment prompt and generate. Skipping re-rank is valid for low-latency paths but changes the pattern.",
      interviewNote:
        "Add that fetch_k in MMR is analogous: over-fetch then narrow.",
    },
    {
      type: "true-false",
      id: "rag03-tf-mmr",
      statement:
        "MMR primarily increases the average similarity of every retrieved chunk to the query, ignoring diversity.",
      correct: false,
      explanation:
        "MMR explicitly balances relevance and diversity; it often sacrifices a bit of raw relevance to avoid redundant near-duplicate chunks in the context window.",
      interviewNote:
        "Connect to user-visible issues: five identical KB articles wasting tokens.",
    },
    {
      type: "scenario",
      id: "rag03-sc-parent",
      scenario:
        "Legal Q&A retrieves 256-token chunks for accuracy, but the model answers without seeing the full clause because key qualifiers sit in adjacent chunks.",
      question:
        "Which pattern from this lesson addresses that, and how would you describe it in one sentence?",
      sampleAnswer:
        "Use a parent-document retriever: retrieve small child chunks for embedding precision, then expand to the parent paragraph or section when building the LLM prompt so qualifiers and definitions stay attached.",
      keyPoints: [
        "Small chunks for embedding quality.",
        "Larger parent for generation context.",
        "Requires a reliable child→parent mapping in storage.",
      ],
      interviewNote:
        "Alternative acceptable answer: increase chunk size with overlap—tradeoffs on specificity.",
    },
    {
      type: "code-completion",
      id: "rag03-cc-mmr",
      question:
        "Fill in the typical LangChain vector store method name that runs maximal marginal relevance search (not plain similarity_search).",
      codeTemplate: `docs = vectorstore.________(query, k=5, fetch_k=25, lambda_mult=0.6)`,
      language: "python",
      correctAnswer: "max_marginal_relevance_search",
      acceptableAnswers: ["max_marginal_relevance_search_by_vector"],
      explanation:
        "max_marginal_relevance_search (and variants accepting a query vector) over-fetch candidates then diversify. Parameters k, fetch_k, and lambda_mult tune recall vs diversity.",
      interviewNote:
        "If API names drift by version, say you would check docs—interviewers care about the concept.",
    },
  ],
};
