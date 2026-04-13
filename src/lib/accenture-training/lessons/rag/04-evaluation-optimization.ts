import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rag-04",
  skillId: "rag",
  order: 4,
  title: "RAG Evaluation & Optimization",
  subtitle:
    "Measure what matters with RAGAS-style metrics, debug common failures, tune the stack, and recognize self-RAG, corrective RAG, and agentic patterns for production.",
  estimatedMinutes: 16,
  objectives: [
    "Describe RAGAS and core metrics: faithfulness, answer relevancy, context precision/recall.",
    "List common RAG failure modes and which pipeline stage they implicate.",
    "Apply optimization levers: chunking, embeddings, routing, and re-ranking.",
    "Contrast self-RAG, corrective RAG, and agentic RAG at a high level.",
    "Name production concerns: cost, latency, safety, and data governance.",
  ],
  content: [
    {
      type: "text",
      content:
        "Shipping RAG without evaluation is guessing. Frameworks like **RAGAS** (and similar toolkits) use LLM-assisted judges or classical scores to quantify retrieval and generation quality so you can compare chunk sizes, embedders, or prompts with evidence—not vibes.",
    },
    {
      type: "callout",
      variant: "info",
      title: "RAGAS in interviews",
      content:
        "You are not expected to derive formulas. Do explain that metrics target **grounding** (faithfulness), **usefulness** (answer relevancy), and **retrieval quality** (context precision/recall), and that LLM-as-judge needs calibration and golden sets.",
    },
    {
      type: "heading",
      level: 2,
      content: "RAGAS-style metrics (conceptual)",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Faithfulness: does the answer stick to retrieved context (not inventing facts)?",
        "Answer relevancy: does the answer actually address the user question?",
        "Context precision: is retrieved context mostly useful, or noisy?",
        "Context recall: did retrieval surface the evidence needed to answer (coverage)?",
      ],
    },
    {
      type: "text",
      content:
        "Pair automated scores with **human review** on edge cases and a small **golden dataset** of (question, ideal answer, supporting doc IDs) for regression testing when you change chunking or models.",
    },
    {
      type: "heading",
      level: 2,
      content: "Common failure modes",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Missed retrieval: chunking/embedder/query mismatch → false \"not in docs\" answers.",
        "Poisoned context: irrelevant chunks confuse the model → wrong but confident answers.",
        "Contradictory sources: corpus has outdated + updated policy pages.",
        "Prompt injection via documents: untrusted text steers the model.",
        "Latency/cost spikes: too many chunks, re-rankers, or multi-query variants.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Optimization techniques",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Chunk tuning: size, overlap, structure-aware splitters, parent-child patterns.",
        "Embedding model selection: domain-specific or multilingual models when needed.",
        "Query routing: send FAQs to one index, technical specs to another.",
        "Hybrid + re-ranking: widen recall then sharpen precision.",
        "Better prompts: strict cite-only-from-context, unknown handling, output schema.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Advanced patterns",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Self-RAG: the model critiques retrieval/generation and may trigger another retrieval pass.",
        "Corrective RAG (CRAG): detect low-confidence retrieval and correct (e.g. web fallback or re-query).",
        "Agentic RAG: tool-using agents plan sub-queries, iterate retrieval, and verify—higher capability, higher cost and failure surface.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Production considerations",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Observability: trace query → retrieved IDs → prompt hash → model version.",
        "PII and ACLs: enforce metadata filters per user/tenant.",
        "Rate limits and batching for embedding and LLM APIs.",
        "Versioned indexes and rollback when a bad ingest ships.",
      ],
    },
    {
      type: "code",
      language: "python",
      filename: "ragas_eval_sketch.py",
      code: `# Conceptual RAGAS usage — install ragas, datasets, and your LLM/embeddings
# from datasets import Dataset
# from ragas import evaluate
# from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall

# data_samples = [{
#     "question": "...",
#     "answer": model_answer,
#     "contexts": [c.page_content for c in retrieved_chunks],
#     "ground_truth": reference_answer,  # for some metrics / datasets
# }]
# dataset = Dataset.from_list(data_samples)
# result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, ...])
# print(result)

# In practice you batch hundreds of rows, pin judge model versions, and compare runs.`,
    },
    {
      type: "tip",
      content:
        "When optimizing, change **one knob per experiment** (chunk size OR embedder OR re-ranker) so you know what moved the metric.",
    },
    {
      type: "diagram",
      alt: "Feedback loop from metrics back to chunking retrieval and prompts",
      content: `flowchart TD
  D[Golden questions + labels] --> R[Run RAG pipeline]
  R --> M[Metrics: faithfulness precision recall]
  M --> T{Triage}
  T -->|bad retrieval| CH[Chunking / hybrid / routing]
  T -->|bad generation| PR[Prompt / model / citations]
  CH --> R
  PR --> R`,
    },
  ],
  keyTakeaways: [
    "Evaluate both retrieval (context precision/recall) and generation (faithfulness, relevancy).",
    "Failure modes map to stages: bad chunks, bad queries, bad ranking, or unsafe prompting.",
    "Optimization is iterative: instrument, measure, change one variable, re-run.",
    "Self-RAG, CRAG, and agentic RAG add reflection or tools—powerful but need governance.",
  ],
  interviewTips: [
    "Propose a minimal eval set before discussing fancy architectures.",
    "Tie metrics to user harm: compliance bots need faithfulness; discovery bots need recall.",
    "Mention judge LLM bias and the need for human spot checks.",
    "Close with production: logging, PII, and index versioning.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "rag04-mc-faithfulness",
      question:
        "Which metric most directly targets whether the generated answer is supported by the retrieved passages (not adding unsupported facts)?",
      options: [
        "Context recall",
        "Faithfulness",
        "Answer relevancy",
        "Chunk overlap percentage",
      ],
      correctIndex: 1,
      explanation:
        "Faithfulness (groundedness) checks alignment between the answer and provided context. Context recall focuses on whether needed evidence was retrieved; answer relevancy focuses on addressing the question—both are related but distinct.",
      interviewNote:
        "If asked how to measure, mention LLM-judge prompts with rubrics or entailment models.",
    },
    {
      type: "true-false",
      id: "rag04-tf-ragas-human",
      statement:
        "Automated RAG metrics remove the need for any human review before production rollout.",
      correct: false,
      explanation:
        "Automated metrics accelerate iteration but can be blind to domain nuance, judge-model bias, and rare failure modes. Human evaluation on critical slices remains a best practice for high-risk applications.",
      interviewNote:
        "Accenture-style clients often expect governance language—cite sampling and sign-off.",
    },
    {
      type: "ordering",
      id: "rag04-ord-debug",
      question:
        "You see high faithfulness but wrong answers. Order these debugging steps sensibly (first → last).",
      items: [
        "Check whether retrieved contexts actually contain supporting evidence (context recall)",
        "Verify the user question is preserved correctly end-to-end (logging)",
        "Tune generation prompt or model if retrieval is already correct",
        "Inspect chunking and query transformation if evidence is missing from top-k",
      ],
      correctOrder: [1, 0, 3, 2],
      explanation:
        "First confirm logging and question fidelity, then diagnose retrieval coverage (recall). If chunks are wrong, fix chunking/query path. If retrieval is good but answers wrong, shift to generation-side fixes.",
      interviewNote:
        "Narrate the hypothesis-driven flow aloud in live interviews.",
    },
    {
      type: "scenario",
      id: "rag04-sc-self-rag",
      scenario:
        "Stakeholders want the assistant to refuse when documents do not contain an answer, but the model still fabricates policy details on empty retrieval.",
      question:
        "Name two mitigations spanning retrieval and generation, without changing the base model weights.",
      sampleAnswer:
        "Generation: add a strict prompt to answer only from context and output a fixed \"no sufficient evidence\" when chunks are empty or below a similarity threshold. Retrieval: add a confidence gate or self-RAG critique step that re-queries or stops when retrieval scores are weak; log those cases for chunking improvements.",
      keyPoints: [
        "Explicit abstention policy in the prompt.",
        "Similarity or score thresholds on retrieval.",
        "Optional critique/second pass (self-RAG style).",
      ],
      interviewNote:
        "Mention user-facing UX for \"I don't know\" with suggested next steps.",
    },
    {
      type: "code-completion",
      id: "rag04-cc-import",
      question:
        "Complete the import line for the RAGAS metric that measures whether the answer stays grounded in the retrieved contexts.",
      codeTemplate: `from ragas.metrics import ________`,
      language: "python",
      correctAnswer: "faithfulness",
      acceptableAnswers: [],
      explanation:
        "faithfulness is the RAGAS metric associated with groundedness in context. (You often import several metrics together in real scripts.)",
      interviewNote:
        "If package APIs change, emphasize you verify imports from current docs—concept matters most.",
    },
  ],
};
