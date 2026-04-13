import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "vector-databases-03",
  skillId: "vector-databases",
  order: 3,
  title: "Indexing Algorithms & Querying",
  subtitle:
    "From exhaustive search to ANN: HNSW, IVF, product quantization, FAISS, and how metadata filters interact with latency and recall.",
  estimatedMinutes: 15,
  objectives: [
    "Explain brute-force k-NN vs. approximate nearest neighbor (ANN) and why ANN dominates at scale.",
    "Describe HNSW, IVF, and PQ at a conceptual level and their build/query tradeoffs.",
    "Use FAISS as a reference mental model for composing indexes in research and tooling.",
    "Reason about metadata filtering, hybrid queries, and scaling sharding/replication.",
  ],
  content: [
    {
      type: "text",
      content:
        "Given a query vector **q** and **n** database vectors, **exact** k-nearest neighbors compares **q** to every vector—O(n·d) per query with naive linear algebra. When n reaches millions or billions, full scan is too slow. **Approximate nearest neighbor (ANN)** algorithms return neighbors in sublinear time with high probability, trading a small amount of recall for large latency wins.",
    },
    {
      type: "heading",
      level: 2,
      content: "Brute force vs. ANN",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Brute force:** Simple, 100% recall (within floating error), best for tiny corpora or exact audits.",
        "**ANN:** Graph-based (HNSW), tree/cluster (IVF), hashing (LSH families), or combinations—tuned via parameters and training data.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "What you measure",
      content:
        "Teams track **recall@k** (did the true top-k appear?), **latency p50/p95**, **QPS**, and **index build time**. A stunning p50 with terrible p95 fails SLA-sensitive apps.",
    },
    {
      type: "heading",
      level: 2,
      content: "HNSW (Hierarchical Navigable Small World)",
    },
    {
      type: "text",
      content:
        "HNSW builds a **multi-layer graph**: upper layers are sparse long jumps for coarse navigation; lower layers are dense for fine search. Query starts at an entry point, greedily moves to closer neighbors, then refines—like subway lines plus local streets. **efConstruction** (build) and **efSearch** (query) control accuracy vs. speed.",
    },
    {
      type: "tip",
      content:
        "Many managed databases expose HNSW or variants under the hood. When tuning, increase efSearch until recall@k plateaus—then stop burning latency.",
    },
    {
      type: "heading",
      level: 2,
      content: "IVF (Inverted File Index)",
    },
    {
      type: "text",
      content:
        "IVF **clusters** vectors (e.g., k-means with **nlist** centroids). At query time, you compare **q** to centroids and search only the **nprobe** closest clusters—reducing comparisons dramatically. Higher **nprobe** improves recall but increases work per query.",
    },
    {
      type: "heading",
      level: 2,
      content: "PQ (Product Quantization)",
    },
    {
      type: "text",
      content:
        "PQ splits each d-dimensional vector into subvectors, each quantized to a small codebook. Stored vectors become compact **codes**; distances are **asymmetric** (ADC): quantize the query less aggressively and approximate DB distances via lookup tables. PQ slashes memory footprint and speeds distance estimates at the cost of accuracy.",
    },
    {
      type: "heading",
      level: 2,
      content: "FAISS (Facebook AI Similarity Search)",
    },
    {
      type: "text",
      content:
        "FAISS is a library, not a database—it composes **Index** objects (Flat, IVF, HNSW) with optional PQ or scalar quantizers. Researchers and engineers use it for benchmarks, on-prem GPU search, and understanding how parameters interact.",
    },
    {
      type: "code",
      language: "python",
      filename: "faiss_minimal.py",
      code: `# pip install faiss-cpu  (or faiss-gpu)
import numpy as np
import faiss

d = 64
n = 10000
xb = np.random.random((n, d)).astype("float32")

index = faiss.IndexFlatL2(d)  # exact L2 brute force
index.add(xb)

xq = np.random.random((5, d)).astype("float32")
k = 4
distances, indices = index.search(xq, k)
print(indices)  # shape (5, k)

# Example ANN: IVF + PQ requires training on representative data
nlist = 100
quantizer = faiss.IndexFlatL2(d)
ivf_pq = faiss.IndexIVFPQ(quantizer, d, nlist, 8, 8)
ivf_pq.train(xb)
ivf_pq.add(xb)
ivf_pq.nprobe = 10
distances2, indices2 = ivf_pq.search(xq, k)`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Training data matters",
      content:
        "IVF and PQ need **representative** vectors for training. If production embeddings drift (new model version), retrain or rebuild—otherwise recall collapses silently.",
    },
    {
      type: "heading",
      level: 2,
      content: "Index build vs. query tradeoffs",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "**Build time:** HNSW with high efConstruction is slow to insert but fast to query; batch builds amortize cost.",
        "**Memory:** PQ/SQ compress vectors; graph indexes add pointer overhead.",
        "**Serving:** Separate read replicas; shard by tenant or hash if single index exceeds RAM.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Metadata filtering and hybrid queries",
    },
    {
      type: "text",
      content:
        "**Pre-filtering** restricts candidates before distance computation (good when filters are selective). **Post-filtering** runs ANN then drops disallowed hits (simple but can return fewer than k if many neighbors are filtered out). Hybrid stacks combine **BM25** scores with vector scores via weighted sums, reciprocal rank fusion, or learned rerankers.",
    },
    {
      type: "heading",
      level: 2,
      content: "Scaling considerations",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Partition indexes per region/tenant to cap blast radius and RAM.",
        "Warm replicas; cache frequent query embeddings at the edge when safe.",
        "Monitor **embedding drift** and **deletes**—tombstones and compaction policies vary by vendor.",
      ],
    },
    {
      type: "diagram",
      alt: "HNSW layers as sparse to dense graph levels",
      content: `flowchart TB
  L2[Layer 2 - sparse long links]
  L1[Layer 1 - medium density]
  L0[Layer 0 - dense local graph]
  L2 --> L1 --> L0
  Q[Query vector] --> L2`,
    },
  ],
  keyTakeaways: [
    "ANN trades a controlled recall drop for orders-of-magnitude faster queries at scale.",
    "HNSW navigates a hierarchical graph; IVF searches promising clusters; PQ compresses vectors.",
    "FAISS composes indexes for research and high-performance custom stacks.",
    "Metadata filters and hybrid retrieval need design—pre vs. post filter affects recall@k.",
  ],
  interviewTips: [
    "Define recall@k before diving into algorithm names.",
    "Mention efSearch/nprobe as the knobs you’d tune with a validation set.",
    "Separate ‘vector library (FAISS)’ from ‘vector database (persistence, RBAC, backup)’.",
    "Call out embedding model version changes as a silent recall killer.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "vd03-mc-hnsw",
      question:
        "In HNSW, increasing **efSearch** during query time most directly affects what?",
      options: [
        "Embedding dimension d",
        "The number of centroids in k-means",
        "Search accuracy/latency tradeoff (more neighbor explorations, usually higher recall, slower)",
        "The batch size of the embedding API",
      ],
      correctIndex: 2,
      explanation:
        "efSearch controls how many candidates are explored during greedy search in the graph—higher values typically improve recall at the cost of more distance comparisons and latency.",
      interviewNote:
        "Pair with efConstruction for build-time accuracy—shows full picture.",
    },
    {
      type: "code-completion",
      id: "vd03-cc-faiss-flat",
      question:
        "Complete the FAISS call to create an exact L2 brute-force index for dimension `d`.",
      codeTemplate: `import faiss

d = 128
index = faiss.________(d)`,
      language: "python",
      correctAnswer: "IndexFlatL2",
      acceptableAnswers: ["IndexFlatL2"],
      explanation:
        "IndexFlatL2 stores all vectors and performs exhaustive L2 search—baseline for small n or correctness checks.",
      interviewNote:
        "Mention IndexFlatIP for inner product on unit vectors.",
    },
    {
      type: "ordering",
      id: "vd03-ord-ann-logic",
      question:
        "Order these ANN concepts from **coarse / cheap** to **fine / detailed** in a typical IVF mental model.",
      items: [
        "Scan all vectors in selected clusters (exact or small ANN inside clusters)",
        "Compare query to cluster centroids to pick nprobe lists",
        "Train or fit cluster centroids on a vector sample",
      ],
      correctOrder: [2, 1, 0],
      explanation:
        "Fit centroids (offline) → at query, route via centroid distances → search within chosen inverted lists.",
      interviewNote:
        "Relate to classic information retrieval inverted indexes—interviewers like the analogy.",
    },
    {
      type: "true-false",
      id: "vd03-tf-post-filter-k",
      statement:
        "Post-filtering after a top-k vector search always guarantees k results if the index returns k neighbors before filtering.",
      correct: false,
      explanation:
        "Post-filtering can discard many of the k neighbors if they fail metadata predicates, yielding fewer than k results unless you over-fetch (e.g., retrieve 10k then filter) or use pre-filtering strategies.",
      interviewNote:
        "Mention over-fetch + rerank as a pragmatic fix—common in production.",
    },
    {
      type: "scenario",
      id: "vd03-sc-slo",
      scenario:
        "Production RAG must meet p95 latency 120 ms with 10M chunks. Brute-force scan averages 800 ms. Current HNSW recall@10 is 0.72 vs. ground truth; product wants ≥0.9.",
      question:
        "What steps do you propose without immediately buying bigger hardware?",
      sampleAnswer:
        "Benchmark efSearch (or vendor equivalent) upward until recall@10 crosses 0.9 while watching p95. If latency fails, consider better sharding, smaller index per tenant, or a two-stage retrieve (ANN wide @50 + cheap reranker). Validate embedding model isn’t mismatched to training data. As last resort, discuss PQ compression impact—might hurt recall, so measure.",
      keyPoints: [
        "Tune ANN parameters against a labeled set.",
        "Over-fetch and rerank recovers recall under filters.",
        "Check model/index training alignment before blaming ‘the algorithm’.",
      ],
      interviewNote:
        "Shows structured debugging: measure → tune → architectural fallback.",
    },
  ],
};
