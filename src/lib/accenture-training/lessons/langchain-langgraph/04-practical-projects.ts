import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "langchain-langgraph-04",
  skillId: "langchain-langgraph",
  order: 4,
  title: "Practical Projects & Tips",
  subtitle:
    "End-to-end RAG with LangChain, research assistants with LangGraph, debugging with LangSmith, testing and performance, and portfolio ideas for interviews.",
  estimatedMinutes: 17,
  objectives: [
    "Outline a minimal production-shaped RAG stack using LangChain components.",
    "Describe a LangGraph research flow with retrieval, synthesis, and review.",
    "Use tracing and tests to harden chains and graphs.",
    "Plan low-cost practice setups (free tiers, Ollama) and portfolio demos.",
  ],
  content: [
    {
      type: "text",
      content:
        "This lesson ties the track together: ship **RAG** with LangChain primitives, add **multi-step reasoning** with LangGraph, and operationalize with **LangSmith**, tests, and sensible performance choices—exactly the stories that resonate in a one-hour technical interview.",
    },
    {
      type: "heading",
      level: 2,
      content: "RAG chatbot end-to-end (LangChain)",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Load and chunk documents; embed with `OpenAIEmbeddings` or a local model.",
        "Store vectors in Chroma, FAISS, or a hosted DB; attach metadata (source, page).",
        "Build a retriever (`similarity_search_with_score` or MMR) and a `RunnablePassthrough.assign(context=...)` chain.",
        "Prompt: system rules + context + user question; parse or stream the answer.",
      ],
    },
    {
      type: "code",
      language: "python",
      filename: "rag_chain_minimal.py",
      code: `# Minimal pattern — adapt imports to your stack
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_texts(
    ["LangGraph adds durable stateful workflows.", "RAG grounds answers in retrieved text."],
    embedding=embeddings,
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer using only the context. Cite chunk ideas briefly."),
    ("human", "Context:\\n{context}\\n\\nQuestion: {question}"),
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def format_docs(docs):
    return "\\n\\n".join(d.page_content for d in docs)

chain = (
    RunnablePassthrough.assign(context=lambda x: format_docs(retriever.invoke(x["question"])))
    | prompt
    | llm
    | StrOutputParser()
)

answer = chain.invoke({"question": "What is LangGraph good for?"})`,
    },
    {
      type: "heading",
      level: 2,
      content: "Research assistant with LangGraph",
    },
    {
      type: "text",
      content:
        "Model **plan → search → read → synthesize → critique** as nodes. Conditional edges send weak drafts back to retrieval or to a human approval node before emailing a summary. Persist `thread_id` per research task so analysts can resume.",
    },
    {
      type: "diagram",
      alt: "Research assistant graph from plan through retrieve and synthesize to optional human review",
      content: `flowchart TD
  P[plan queries] --> R[retrieve sources]
  R --> S[synthesize draft]
  S --> Q{quality check}
  Q -->|weak| R
  Q -->|ok| H{needs human?}
  H -->|yes| HR[human review]
  HR --> F[finalize]
  H -->|no| F`,
    },
    {
      type: "heading",
      level: 2,
      content: "Debugging with LangSmith",
    },
    {
      type: "text",
      content:
        "**LangSmith** (or OpenTelemetry exporters) captures traces: prompts, token usage, latency per node, and tool I/O. For interviews, describe how you reproduced a bug by finding the retrieval step returning empty context, then fixed chunking—not by guessing.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Data handling",
      content:
        "Traces may contain PII and secrets. Configure sampling, redaction, and environment separation (dev vs prod) per client policy.",
    },
    {
      type: "heading",
      level: 2,
      content: "Testing strategies",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Unit tests**: mock LLM responses to assert prompt shape and parser output.",
        "**Golden tests**: freeze expected answers for fixed retrieval fixtures.",
        "**Eval harnesses**: LLM-as-judge or rule checks on citations and refusal behavior.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Performance optimization",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Cache embeddings for static corpora; batch embed where APIs allow.",
        "Trim context: smaller k, re-ranking, or hierarchical summaries.",
        "Stream tokens to the UI; parallelize independent retrievals with `RunnableParallel`.",
        "Right-size models: small for routing, large for final answer if budget allows.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Community resources",
    },
    {
      type: "text",
      content:
        "Official LangChain docs, GitHub discussions, Discord, and release notes are primary. For enterprise, skim security advisories and LTS guidance—versions move quickly.",
    },
    {
      type: "heading",
      level: 2,
      content: "Practice at home: free tiers and Ollama",
    },
    {
      type: "text",
      content:
        "Use **OpenAI / Anthropic free credits** or low-cost keys for short sessions. Run **Ollama** locally for Llama/Mistral models to practice LangChain `ChatOllama` without cloud spend—expect slower inference on laptops but excellent learning value.",
    },
    {
      type: "tip",
      content:
        "Portfolio: a GitHub repo with README architecture diagram, `.env.example`, and a 3-minute Loom beats a slide deck alone.",
    },
    {
      type: "callout",
      variant: "success",
      title: "Portfolio ideas for Accenture-style interviews",
      content:
        "Policy Q&A bot over PDFs with citations; ticket triage agent with human handoff; contract clause extractor graph with confidence routing; internal API copilot with tool auth. Pick one, instrument it, and document failure modes.",
    },
  ],
  keyTakeaways: [
    "RAG in LangChain = retriever + context assembly + prompt + model + optional parsers/streaming.",
    "LangGraph adds durable, branchy workflows suited to research and compliance gates.",
    "LangSmith-style tracing plus tests turns demos into engineering stories.",
    "Local models (Ollama) and careful caching make practice affordable.",
  ],
  interviewTips: [
    "Walk through one trace screenshot: \"Here retrieval was empty because k=1 and chunking split tables wrong.\"",
    "Quantify: latency budget, cost per 1k queries, and when you would re-rank.",
    "State security: secrets in env vars, no PII in prompts sent to third parties without review.",
    "End with what you would monitor in week one of production: errors, empty retrieval rate, thumbs feedback.",
  ],
  exercises: [
    {
      type: "scenario",
      id: "lc04-sc-rag-debug",
      scenario:
        "In LangSmith you see high latency and answers that ignore the retrieved context. Logs show 12 large chunks stuffed into the prompt every time.",
      question:
        "Name two concrete changes and what you would verify after each.",
      sampleAnswer:
        "Reduce k and add MMR or a re-ranker to shrink context, then re-run golden questions to check answer overlap with sources. Second, add a post-generation check that the answer must reference at least one retrieved source title or abstain—verify via eval set precision.",
      keyPoints: [
        "Context trimming / better retrieval selection.",
        "Evaluation loop after changes.",
      ],
      interviewNote:
        "Mention token cost drops as a business benefit, not only latency.",
    },
    {
      type: "multiple-choice",
      id: "lc04-mc-ollama",
      question:
        "You want to practice LangChain locally without cloud API charges. Which setup is most appropriate for iterative hacking on a laptop?",
      options: [
        "Hardcode production AWS keys in the notebook",
        "Ollama + `ChatOllama` (or similar local integration) with small models",
        "Disable SSL verification globally",
        "Paste customer PII into public Colab for embedding tests",
      ],
      correctIndex: 1,
      explanation:
        "Ollama runs open models locally for safe, low-cost iteration. Hardcoded keys, disabled TLS, and public PII violate security and privacy norms.",
      interviewNote:
        "Say you still use env vars for any cloud fallback and scrub notebooks before sharing.",
    },
    {
      type: "code-completion",
      id: "lc04-cc-retriever",
      question:
        "Complete the Runnable so `context` is filled by formatting retrieved documents before the prompt.",
      codeTemplate: `from langchain_core.runnables import RunnablePassthrough

chain = (
    RunnablePassthrough.assign(
        context=lambda x: format_docs(________.invoke(x["question"]))
    )
    | prompt
    | llm
)
`,
      language: "python",
      correctAnswer: "retriever",
      acceptableAnswers: ["retriever"],
      explanation:
        "The retriever object (from a vector store) accepts a query string via `.invoke` and returns documents to format into context.",
      interviewNote:
        "Mention type hints: retriever might be `VectorStoreRetriever`.",
    },
    {
      type: "ordering",
      id: "lc04-ord-prod",
      question:
        "Order these rollout steps for a client pilot (best practice first to last).",
      items: [
        "Define success metrics and a small golden eval set",
        "Instrument traces and redact sensitive fields",
        "Ship read-only tools and retrieval with ACLs enforced server-side",
        "Iterate on prompts and chunking using trace insights",
      ],
      correctOrder: [0, 1, 2, 3],
      explanation:
        "Start with measurable goals, add observability with privacy controls, enforce backend authz on tools/data, then optimize prompts and retrieval using traces.",
      interviewNote:
        "If asked about agile, you can parallelize some tasks—but never skip ACL enforcement before widening users.",
    },
    {
      type: "true-false",
      id: "lc04-tf-traces",
      statement:
        "LangSmith traces alone are a substitute for automated regression tests on RAG quality.",
      correct: false,
      explanation:
        "Traces help debug individual runs; automated tests and eval datasets catch regressions across releases. Use both: traces for investigation, tests for gates in CI/CD.",
      interviewNote:
        "Mention running evals on every prompt or retrieval config change.",
    },
  ],
};
