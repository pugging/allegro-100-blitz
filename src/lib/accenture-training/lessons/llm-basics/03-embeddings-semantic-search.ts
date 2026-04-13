import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "llm-basics-03",
  skillId: "llm-basics",
  order: 3,
  title: "Embeddings & Semantic Search",
  subtitle:
    "Turning text into vectors, measuring similarity, and building retrieval pipelines — the core mechanics behind semantic search and RAG.",
  estimatedMinutes: 17,
  objectives: [
    "Define embeddings and contrast static word vectors with contextual and sentence embeddings.",
    "Explain cosine similarity, dot product, and Euclidean distance and when each is appropriate.",
    "Outline a production semantic search pipeline from indexing to ranking.",
    "Read and extend simple Python for encoding documents and retrieving nearest neighbors.",
  ],
  content: [
    {
      type: "text",
      content:
        "An **embedding** is a dense real-valued vector representation of text (token, sentence, paragraph, image patch, etc.) in ℝ^d. Similar meanings should map to nearby vectors under a chosen geometry so we can **search**, **cluster**, **classify**, or **retrieve** without hand-crafted rules. In GenAI systems, embeddings power **semantic search**, **RAG**, deduplication, and recommendation — interviewers expect you to connect vectors to business outcomes (latency, recall@k, freshness).",
    },
    {
      type: "callout",
      variant: "info",
      title: "Link to Accenture delivery",
      content:
        "Clients rarely ask for \"embeddings\"; they ask for \"find policies like this question\" or \"group tickets by intent.\" Your job is to translate that into embedding models, indexes, and evaluation.",
    },
    {
      type: "heading",
      level: 2,
      content: "From Word2vec intuition to modern vectors",
    },
    {
      type: "text",
      content:
        "**Word2vec** (2013) showed that predicting context from a word (or vice versa) learns linear structure: analogies like king − man + woman ≈ queen in vector space. Limitation: **one vector per word type** — \"bank\" (river) and \"bank\" (finance) collide. **Contextual embeddings** from transformers assign different vectors depending on surrounding tokens; **sentence / document embeddings** collapse a whole span into one vector for retrieval, often via mean pooling, CLS tokens, or dedicated sentence models.",
    },
    {
      type: "heading",
      level: 2,
      content: "Common embedding model families",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**OpenAI embedding APIs** (e.g. text-embedding-3-small/large): strong general quality, hosted, billed per token — typical default for greenfield cloud RAG.",
        "**sentence-transformers** (SBERT family): open models you can run on CPU/GPU; `sentence-transformers` on Hugging Face is the standard Python stack for offline batching and air-gapped clients.",
        "Domain-specific fine-tunes (legal, medical, code) when generic embeddings miss jargon or synonyms critical to recall.",
      ],
    },
    {
      type: "tip",
      content:
        "Always normalize vectors when you rely on cosine similarity — many APIs return L2-normalized embeddings so dot product equals cosine similarity.",
    },
    {
      type: "heading",
      level: 2,
      content: "Similarity metrics",
    },
    {
      type: "text",
      content:
        "Given vectors u, v (non-zero): **cosine similarity** = (u·v) / (||u|| ||v||) ∈ [-1, 1] for general vectors, often [0,1] for NLP if components are non-negative. It measures **angle**, not magnitude — good when length correlates with verbosity rather than importance. **Dot product** u·v equals cosine × ||u|| × ||v||; if norms differ a lot, dot product favors longer documents unless you normalize. **Euclidean distance** ||u − v||_2 is monotonic with cosine for **unit vectors** (smaller distance ⟺ higher cosine), but behaves differently otherwise.",
    },
    {
      type: "code",
      language: "python",
      filename: "similarity_numpy.py",
      code: `import numpy as np

def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

u = np.array([1.0, 2.0, 3.0])
v = np.array([1.0, 2.0, 3.1])
print("cosine:", cosine_sim(u, v))
print("L2 distance:", np.linalg.norm(u - v))`,
    },
    {
      type: "heading",
      level: 2,
      content: "Semantic search pipeline",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "**Ingest & chunk**: split documents into passages sized for the embedding model and downstream LLM context.",
        "**Embed**: batch-encode chunks; store metadata (source URI, ACL, timestamps).",
        "**Index**: load vectors into a vector store (FAISS, Milvus, Pinecone, pgvector, etc.) with the right metric (usually inner product or cosine on normalized vectors).",
        "**Query**: embed the user query with the **same** model and hyperparameters; retrieve top-k neighbors.",
        "**Rank / filter**: optional reranker (cross-encoder), metadata filters, freshness boosts.",
        "**Generate (RAG)**: pass retrieved passages to the LLM with citations — covered in depth in the RAG track.",
      ],
    },
    {
      type: "diagram",
      alt: "Semantic search data flow",
      content: `flowchart LR
  docs[Documents] --> chunk[Chunking]
  chunk --> emb[Embedding model]
  emb --> idx[Vector index]
  q[User query] --> emb2[Same embedding model]
  emb2 --> knn[kNN top-k]
  idx --> knn
  knn --> out[Contexts to LLM or UI]`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Metric mismatch breaks quality",
      content:
        "If the index is built for cosine but you feed unnormalized vectors and use inner product without checking, rankings drift. Align **model**, **normalization**, and **distance definition** across offline and online paths.",
    },
    {
      type: "heading",
      level: 2,
      content: "Practical Python: encode and compare",
    },
    {
      type: "text",
      content:
        "Below is a minimal pattern with `sentence-transformers`. Swap `model_name` for your approved corporate model; keep batch sizes tuned to GPU memory for large corpora.",
    },
    {
      type: "code",
      language: "python",
      filename: "semantic_search_minimal.py",
      code: `from sentence_transformers import SentenceTransformer, util

model_name = "all-MiniLM-L6-v2"  # small demo model; replace per enterprise policy
model = SentenceTransformer(model_name)

passages = [
    "Return policy: refunds within 30 days with receipt.",
    "Shipping to EU takes 5–7 business days.",
    "API rate limit is 60 requests per minute per key.",
]
query = "How long do I have to refund a purchase?"

q_emb = model.encode(query, convert_to_tensor=True)
p_emb = model.encode(passages, convert_to_tensor=True)

sims = util.cos_sim(q_emb, p_emb)[0]
best = int(sims.argmax())
print("best passage idx:", best, "score:", float(sims[best]))`,
    },
    {
      type: "callout",
      variant: "success",
      title: "Interview framing",
      content:
        "\"We embed queries and documents in the same space, then retrieve by nearest neighbors. Quality depends on chunking, model choice, and eval — not just vector dimension.\"",
    },
  ],
  keyTakeaways: [
    "Embeddings map text to vectors so semantic nearness approximates usefulness for search and clustering.",
    "Word2vec explains the idea; modern sentence embeddings and APIs power enterprise RAG.",
    "Cosine rewards direction; dot product mixes direction and magnitude unless normalized.",
    "End-to-end pipelines chunk, embed, index, query, optionally rerank — consistency of model and metric matters.",
  ],
  interviewTips: [
    "When asked \"how does semantic search work?\" draw ingest → embed → index → kNN → (optional) rerank in under 30 seconds.",
    "Mention evaluation: MRR, nDCG, or simple recall@k on labeled query sets — hiring managers want measurement, not vibes.",
    "Acknowledge cold-start and domain shift: embeddings trained on web text may underperform on internal acronyms until fine-tuned.",
    "For regulated clients, note PII handling: some teams embed redacted text or run models inside VPC.",
  ],
  exercises: [
    {
      type: "scenario",
      id: "llm03-sc-metric",
      scenario:
        "A product manager says: \"Our knowledge base has both short FAQ lines and 2-page legal clauses. Rankings favor long clauses even when a short FAQ answers the question.\"",
      question:
        "Which similarity metric issue might contribute, and what is one concrete mitigation?",
      sampleAnswer:
        "Raw dot product tends to correlate with vector norm; longer texts often produce larger-magnitude embeddings, so they can dominate dot-product ranking even when angle similarity is higher for a short FAQ. Mitigations: L2-normalize embeddings and use cosine (or inner product on normalized vectors), add length penalties, chunk long documents uniformly, or use a two-stage retriever plus cross-encoder reranking that scores query–passage pairs directly.",
      keyPoints: [
        "Dot product vs cosine / normalization.",
        "Chunking and length bias.",
        "Reranking as a fix for coarse retrieval.",
      ],
      interviewNote:
        "Shows you debug retrieval systems, not only call `embed()`.",
    },
    {
      type: "multiple-choice",
      id: "llm03-mc-word2vec",
      question:
        "What is the main limitation of classic Word2vec-style static embeddings for enterprise Q&A compared to contextual transformer embeddings?",
      options: [
        "They require a GPU cluster for inference on every token.",
        "Each word type has a single vector regardless of context, so polysemy and domain senses collide.",
        "They cannot be converted to floating-point numbers.",
        "They only work for Python source code, not natural language.",
      ],
      correctIndex: 1,
      explanation:
        "Static embeddings map \"bank\" to one point in space; contextual models (and good sentence embeddings) separate senses using surrounding text. Other options are false or irrelevant.",
      interviewNote:
        "Follow up with how chunk-level sentence embeddings are still a compression — trade-offs matter for RAG.",
    },
    {
      type: "code-completion",
      id: "llm03-cc-normalize",
      question:
        "Fill in the NumPy expression to **L2-normalize** row vectors in matrix `X` (each row is one embedding) before computing inner products as cosine similarity.",
      codeTemplate: `import numpy as np

X = np.array([[3.0, 4.0], [1.0, 0.0], [2.0, 2.0]])
norms = np.linalg.norm(X, axis=1, keepdims=True)
X_norm = X / ________`,
      language: "python",
      correctAnswer: "norms",
      acceptableAnswers: ["norms + 1e-12"],
      explanation:
        "Divide each row by its L2 norm so each embedding lies on the unit sphere; then dot products equal cosine similarities. Tiny epsilons (e.g. 1e-12) are sometimes added to norms for numerical safety.",
      interviewNote:
        "Mention zero-vector guards in production — empty strings should not crash normalization.",
    },
    {
      type: "ordering",
      id: "llm03-ord-pipeline",
      question:
        "Order the stages of a typical **batch** semantic search index build (top = first).",
      items: [
        "Push vectors + metadata into a vector index (e.g. FAISS / vector DB)",
        "Chunk source documents with consistent strategy and overlap policy",
        "Encode each chunk with the chosen embedding model",
        "Collect or crawl raw documents from sources of truth",
      ],
      correctOrder: [3, 1, 2, 0],
      explanation:
        "Collect documents → chunk → embed → load index. Skipping chunking before embedding mixes scales badly and hurts retrieval granularity.",
      interviewNote:
        "For streaming updates, mention incremental upserts and re-embedding when models change.",
    },
    {
      type: "true-false",
      id: "llm03-tf-cosine-euclidean",
      statement:
        "For unit-length (L2-normalized) embedding vectors, ranking passages by highest cosine similarity always produces the identical ordering as ranking by lowest Euclidean distance to the query vector.",
      correct: true,
      explanation:
        "For unit vectors, ||q − p||^2 = 2 − 2 cos(q, p), so smaller Euclidean distance corresponds exactly to larger cosine similarity; the orderings match.",
      interviewNote:
        "Use this fact to justify using fast inner-product indexes after normalization.",
    },
  ],
};
