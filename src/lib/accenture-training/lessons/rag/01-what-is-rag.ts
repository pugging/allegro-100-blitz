import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rag-01",
  skillId: "rag",
  order: 1,
  title: "What is RAG?",
  subtitle:
    "Why retrieval matters for trustworthy GenAI, how RAG differs from fine-tuning and prompting alone, and the shape of a production pipeline.",
  estimatedMinutes: 17,
  objectives: [
    "Explain which problems RAG addresses (hallucinations, stale knowledge, domain grounding).",
    "Compare RAG with fine-tuning and prompt engineering and when to combine approaches.",
    "Describe the end-to-end RAG pipeline from ingest to generation.",
    "Recognize common enterprise use cases and trade-offs of naive RAG.",
  ],
  content: [
    {
      type: "text",
      content:
        "Large language models compress broad patterns from training data into weights. They can sound authoritative while being wrong or outdated. Retrieval-Augmented Generation (RAG) grounds answers in **documents you control** by fetching relevant passages before the model writes the final response.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Interview framing",
      content:
        "A crisp one-liner wins: \"RAG reduces reliance on parametric memory by injecting non-parametric knowledge at inference time.\" Follow with when that helps (policies, tickets, code) vs when it does not (pure reasoning with no corpus).",
    },
    {
      type: "heading",
      level: 2,
      content: "Problems RAG helps solve",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Hallucinations: the model invents facts; retrieved citations give the generator something to stay faithful to.",
        "Knowledge cutoff: your index can hold this week’s release notes or HR policies without retraining the base model.",
        "Domain specificity: proprietary playbooks, contracts, and logs are rarely in pre-training; RAG brings them into context.",
        "Auditability: you can log which chunks were retrieved—useful for compliance and debugging.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "RAG is not magic",
      content:
        "Bad chunks, wrong embeddings, or vague queries still produce weak or misleading answers. RAG shifts the bottleneck to retrieval quality and evaluation, not away from engineering rigor.",
    },
    {
      type: "heading",
      level: 2,
      content: "RAG vs fine-tuning vs prompt engineering",
    },
    {
      type: "text",
      content:
        "**Prompt engineering** shapes behavior and output format with instructions and examples in the context window. It does not add new factual knowledge beyond what fits in the prompt unless you paste documents yourself—RAG automates that paste step at scale.",
    },
    {
      type: "text",
      content:
        "**Fine-tuning** updates model weights (full, LoRA, etc.) to specialize tone, format, or task priors. It is expensive to refresh frequently and risky for volatile facts. Teams often use **RAG for facts**, **fine-tuning for style or tool-use habits**, and **prompting for guardrails**.",
    },
    {
      type: "tip",
      content:
        "In interviews, mention \"data freshness\" and \"cost/latency\": RAG can update a vector index in minutes; full fine-tuning cycles are slower and need curated datasets.",
    },
    {
      type: "heading",
      level: 2,
      content: "End-to-end RAG pipeline",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Ingest: load sources (PDFs, HTML, tickets, code) and normalize text.",
        "Chunk: split documents into segments sized for embedding models and context windows.",
        "Embed: turn each chunk into a dense vector (and optionally sparse signals for hybrid search).",
        "Store / index: upsert vectors (+ metadata) into a vector database or search backend.",
        "Retrieve: given a user query, fetch top-k similar chunks (maybe re-rank).",
        "Augment: build a prompt with system rules + retrieved passages + user question.",
        "Generate: call the LLM; optionally validate citations or run a second critique step.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Real-world use cases",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Enterprise search and internal Q&A over wikis, SharePoint, and Confluence.",
        "Customer support assistants grounded in KB articles and past resolved tickets.",
        "Developer copilots that retrieve repo docs, ADRs, and API references.",
        "Regulated domains (finance, healthcare) where answers should cite approved sources.",
      ],
    },
    {
      type: "heading",
      level: 3,
      content: "Naive RAG in one diagram",
    },
    {
      type: "diagram",
      alt: "Naive RAG flow from documents through chunking and embedding to vector store, then query retrieval into LLM",
      content: `flowchart LR
  subgraph ingest [Ingest]
    D[Documents] --> C[Chunking]
    C --> E[Embedding model]
  end
  E --> V[(Vector store)]
  Q[User query] --> EQ[Query embedding]
  EQ --> V
  V --> K[Top-k chunks]
  K --> P[Prompt assembly]
  P --> L[LLM]
  L --> A[Answer]`,
    },
    {
      type: "code",
      language: "python",
      filename: "minimal_rag_concept.py",
      code: `# Conceptual sketch — not production-hardened
# 1) Chunks live in a vector store with metadata.
# 2) At query time, retrieve → stuff into prompt → generate.

SYSTEM = """Answer using ONLY the context. If missing, say you don't know."""

def build_prompt(context_chunks: list[str], question: str) -> str:
    context = "\\n\\n".join(context_chunks)
    return f"{SYSTEM}\\n\\nContext:\\n{context}\\n\\nQuestion: {question}"

# retrieve(query) → embed query → similarity search → return chunk texts
# generate(prompt) → call your LLM API`,
    },
  ],
  keyTakeaways: [
    "RAG grounds generation in retrieved text, improving factuality and freshness versus parametric memory alone.",
    "Prompting changes behavior; fine-tuning shifts weights; RAG injects external knowledge—often used together.",
    "The pipeline spans ingest, chunk, embed, index, retrieve, augment, and generate—weakness in any stage hurts answers.",
    "Naive RAG is the baseline architecture; later lessons add chunking, retrieval, and evaluation depth.",
  ],
  interviewTips: [
    "Start with the business problem (stale HR policy, support deflection) before naming algorithms.",
    "Contrast parametric vs non-parametric knowledge and give one example of each.",
    "Mention observability: log queries, retrieved IDs, and latency per stage.",
    "Acknowledge failure modes: empty retrieval, duplicate chunks, and prompt injection via documents.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "rag01-mc-vs-ft",
      question:
        "Your product team needs assistants that answer from internal PDFs that change weekly. Which approach best addresses *fresh factual grounding* with minimal retraining overhead?",
      options: [
        "Full fine-tuning on all PDFs every week",
        "RAG with an updatable document index and retrieval at query time",
        "Prompt engineering only, pasting entire PDFs into every request",
        "Switching to a smaller model to reduce hallucinations",
      ],
      correctIndex: 1,
      explanation:
        "RAG lets you refresh chunks and embeddings in the index as documents change, without a full model retrain. Weekly full fine-tuning is slow and costly; pasting whole PDFs hits context limits; model size alone does not fix stale or missing knowledge.",
      interviewNote:
        "Add that you would still use prompting for tone/safety and might fine-tune for format—not for weekly PDF churn.",
    },
    {
      type: "ordering",
      id: "rag01-ord-pipeline",
      question:
        "Order these RAG pipeline stages from first to last (top = earliest).",
      items: [
        "Generate an answer with the LLM using augmented context",
        "Embed query and retrieve top-k chunks from the index",
        "Chunk documents and embed chunks into vectors",
        "Load raw documents from sources (e.g. PDF, HTML)",
      ],
      correctOrder: [3, 2, 1, 0],
      explanation:
        "Typical order: load documents → chunk + embed chunks into the index → at query time embed query and retrieve → augment prompt and generate. Retrieval always happens after the index exists.",
      interviewNote:
        "If asked about streaming UX, note retrieve/generate can be pipelined or shown progressively—still logically after indexing.",
    },
    {
      type: "true-false",
      id: "rag01-tf-no-hallucination",
      statement: "RAG completely eliminates hallucinations from language models.",
      correct: false,
      explanation:
        "RAG reduces unsupported claims by grounding in retrieved text, but the model can still misread context, cherry-pick, or synthesize incorrectly. Evaluation, citations, and guardrails remain necessary.",
      interviewNote:
        "Show maturity: propose faithfulness checks and human review for high-risk answers.",
    },
    {
      type: "scenario",
      id: "rag01-sc-enterprise",
      scenario:
        "An Accenture client wants an internal chatbot over 50k Confluence pages for consultants. Legal requires that answers cite the source page title and URL.",
      question:
        "In two or three sentences, how would you use RAG to meet the citation requirement?",
      sampleAnswer:
        "Store each chunk in the vector index with metadata for page title and URL. At retrieval, pass the top-k chunks with that metadata into the prompt and instruct the model to cite only those sources. Log retrieval IDs with each answer for audit trails.",
      keyPoints: [
        "Metadata per chunk carries citation fields.",
        "Prompt constrains the model to provided context.",
        "Logging links generations to retrieved evidence.",
      ],
      interviewNote:
        "Mention optional re-ranking or snippet highlighting in the UI for trust.",
    },
    {
      type: "code-completion",
      id: "rag01-cc-augment",
      question:
        "Complete the f-string placeholder so the prompt includes a joined context block before the user question.",
      codeTemplate: `context_chunks = ["Chunk A...", "Chunk B..."]
question = "What is the refund policy?"
prompt = f"Use only this context:\\n\\n{________}\\n\\nQuestion: {question}"`,
      language: "python",
      correctAnswer: '"\\n\\n".join(context_chunks)',
      acceptableAnswers: ["'\\n\\n'.join(context_chunks)", '"\\n".join(context_chunks)'],
      explanation:
        "Joining chunks with clear separators preserves boundaries and token efficiency better than str(list). Newlines help the model scan distinct passages.",
      interviewNote:
        "Mention you might add chunk IDs or titles in a production template for citations.",
    },
  ],
};
