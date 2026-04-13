import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rag-02",
  skillId: "rag",
  order: 2,
  title: "Document Chunking & Indexing",
  subtitle:
    "From messy files to searchable vectors: loaders, chunking strategies, metadata, embeddings, and vector-store indexing with LangChain-style Python.",
  estimatedMinutes: 16,
  objectives: [
    "Choose document loaders for PDF, HTML, and Markdown sources.",
    "Compare fixed-size, recursive, and semantic chunking and their tradeoffs.",
    "Tune chunk size and overlap for recall vs precision and token budgets.",
    "Explain metadata extraction and how it powers filtering and citations.",
    "Outline embedding generation and indexing into a vector store.",
  ],
  content: [
    {
      type: "text",
      content:
        "Retrieval quality is often capped by how you **cut** documents. Chunks that are too large dilute embeddings with unrelated ideas; chunks too small lose cross-sentence context. Loaders get text out of files; chunkers shape what the embedder actually sees.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Why interviewers care",
      content:
        "Junior/Mid candidates should move past \"we use 512 tokens\" to reasoning: overlap reduces boundary cuts, headings/metadata improve filters, and the embedding model’s max sequence length constrains effective chunk size.",
    },
    {
      type: "heading",
      level: 2,
      content: "Document loaders",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "PDF: layout noise (headers, footers, columns)—often needs cleanup or OCR for scans.",
        "HTML: strip scripts/styles; preserve headings and links as metadata when useful.",
        "Markdown: structure is explicit (# headers, lists)—great for hierarchical chunking.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Chunking strategies",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Fixed-size: split every N characters or tokens—simple, fast, can break mid-sentence or mid-table.",
        "Recursive: split on a hierarchy of separators (\\n\\n, \\n, space) to keep paragraphs and lines intact longer.",
        "Semantic: embed sentences/paragraphs and merge or split where embedding distance jumps—adapts to content but costs more compute.",
      ],
    },
    {
      type: "heading",
      level: 3,
      content: "Chunk size vs overlap",
    },
    {
      type: "text",
      content:
        "Larger chunks improve **context completeness** but hurt embedding specificity and inflate prompt cost. **Overlap** (e.g. 10–20% of chunk length) reduces the chance that a critical sentence sits on a cut boundary. Tune with retrieval evals, not guesses alone.",
    },
    {
      type: "tip",
      content:
        "If tables or code appear often, consider chunking rules per doc type (Markdown code fences, HTML <pre>, PDF table heuristics) instead of one global splitter.",
    },
    {
      type: "heading",
      level: 2,
      content: "Metadata extraction",
    },
    {
      type: "text",
      content:
        "Attach structured fields to each chunk: `source`, `page`, `section`, `author`, `updated_at`, ACL tags for multi-tenant filters. Metadata enables **pre-filtering** before vector search (e.g. only \"2024\" policies) and richer citations in the UI.",
    },
    {
      type: "heading",
      level: 2,
      content: "Embeddings and indexing",
    },
    {
      type: "text",
      content:
        "Each chunk is passed through an embedding model to produce a fixed-dimensional vector. Vectors are upserted into a **vector store** (Pinecone, Weaviate, Chroma, pgvector, etc.) with optional hybrid sparse indexes. Batch API calls and respect rate limits in production pipelines.",
    },
    {
      type: "code",
      language: "python",
      filename: "langchain_loaders_chunking.py",
      code: `# LangChain-style document loading and recursive splitting (APIs evolve—verify imports for your version)
from langchain_community.document_loaders import PyPDFLoader, UnstructuredHTMLLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# PDF: one Document per page by default in many loaders
pdf_docs = PyPDFLoader("handbook.pdf").load()

# HTML
html_docs = UnstructuredHTMLLoader("policy.html").load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=120,
    separators=["\\n\\n", "\\n", ". ", " ", ""],
)

def enrich_metadata(docs: list[Document], source: str) -> list[Document]:
    for i, d in enumerate(docs):
        d.metadata.setdefault("source", source)
        d.metadata["chunk_index"] = i
    return docs

chunks = splitter.split_documents(pdf_docs)
chunks = enrich_metadata(chunks, source="handbook.pdf")

# Next step: batch embed chunks → upsert to vector store with same metadata keys
# embeddings = embedding_model.embed_documents([c.page_content for c in chunks])`,
    },
    {
      type: "callout",
      variant: "success",
      title: "Production habit",
      content:
        "Version your chunking config (size, overlap, splitter class) alongside the index name. Changing chunking without reindexing silently desynchronizes \"what we think is in the index\" from reality.",
    },
    {
      type: "diagram",
      alt: "Flow from loaders to splitter to embeddings to vector index",
      content: `flowchart TD
  PDF[PDF loader] --> S[Recursive splitter]
  MD[Markdown loader] --> S
  S --> M[Metadata enrich]
  M --> EM[Embedding API batch]
  EM --> VS[(Vector store index)]`,
    },
  ],
  keyTakeaways: [
    "Loaders normalize heterogeneous files into text + metadata; quality upstream saves pain at retrieval.",
    "Recursive splitting usually beats naive fixed cuts for prose; semantic chunking helps heterogeneous docs at higher cost.",
    "Overlap mitigates boundary loss; chunk size trades specificity against context and cost.",
    "Metadata enables filtering, citations, and ACLs—design schemas before bulk indexing.",
  ],
  interviewTips: [
    "When asked \"how do you chunk?\", answer with goals (recall/precision), then concrete parameters and why.",
    "Mention reindexing strategy when chunk size or embedding model changes.",
    "Bring up OCR and table extraction as PDF footguns.",
    "Connect to latency: fewer, larger chunks can shrink retrieval count but blow up prompt tokens.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "rag02-mc-overlap",
      question:
        "What is the primary purpose of chunk overlap in typical character/token-based splitters?",
      options: [
        "To double the embedding API cost on purpose",
        "To reduce the chance that important sentences are split across chunk boundaries without context",
        "To guarantee each chunk has a unique UUID",
        "To replace the need for a vector database",
      ],
      correctIndex: 1,
      explanation:
        "Overlap duplicates a tail of the previous chunk at the start of the next so ideas spanning a cut still appear in full in at least one chunk. It is a recall-oriented technique, not about UUIDs or replacing vector search.",
      interviewNote:
        "Nuance: too much overlap increases near-duplicate retrieval—pair overlap with dedup or MMR later.",
    },
    {
      type: "code-completion",
      id: "rag02-cc-splitter",
      question:
        "Complete the missing argument so consecutive chunks share 120 characters of boundary context (LangChain RecursiveCharacterTextSplitter).",
      codeTemplate: `splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    ________,
    separators=["\\n\\n", "\\n", " ", ""],
)`,
      language: "python",
      correctAnswer: "chunk_overlap=120",
      acceptableAnswers: ["chunk_overlap = 120"],
      explanation:
        "chunk_overlap repeats the tail of one chunk at the start of the next. It pairs with chunk_size to balance recall across boundaries against index redundancy.",
      interviewNote:
        "If live coding, write chunk_size before chunk_overlap and narrate the tradeoff as you type.",
    },
    {
      type: "ordering",
      id: "rag02-ord-index-pipeline",
      question:
        "Order these indexing-time steps for a typical batch RAG job (first → last).",
      items: [
        "Upsert vectors + metadata into the vector store",
        "Load raw files into Document objects",
        "Compute embedding vectors for each chunk",
        "Split documents into chunks with enriched metadata",
      ],
      correctOrder: [1, 3, 2, 0],
      explanation:
        "Load → split/chunk (+metadata) → embed chunks → upsert to the index. Embedding before upsert is required; loading must precede splitting.",
      interviewNote:
        "Clarify offline (batch) vs online incremental updates if the interviewer asks about streaming new docs.",
    },
    {
      type: "true-false",
      id: "rag02-tf-metadata",
      statement:
        "Storing only the embedding vector without any metadata is sufficient for enterprise RAG that must filter by department and show source URLs.",
      correct: false,
      explanation:
        "Filtering and citations need structured metadata (department, URL, ACL, page). Vectors alone do not carry those fields unless you join through a separate table—usually you store metadata alongside vectors in the index.",
      interviewNote:
        "Mention hybrid or SQL pre-filters supported by many vector DBs.",
    },
    {
      type: "scenario",
      id: "rag02-sc-markdown",
      scenario:
        "You ingest technical Markdown docs with deep heading hierarchies. Fixed 500-character chunks split many code examples in half, hurting retrieval of full snippets.",
      question:
        "What chunking adjustment would you propose first, and why?",
      sampleAnswer:
        "Switch to RecursiveCharacterTextSplitter with separators that respect Markdown structure (double newlines, headings) or use a Markdown-aware splitter so code fences stay intact. Increase chunk_size modestly for code-heavy sections or split code blocks into separate chunks with metadata type=code.",
      keyPoints: [
        "Structure-aware separators beat blind fixed windows for Markdown/code.",
        "Optionally tag chunk types in metadata for retrieval filters.",
        "Re-evaluate with retrieval metrics after the change.",
      ],
      interviewNote:
        "Shows you connect chunking symptoms to fix paths without jumping to a new vector DB.",
    },
  ],
};
