import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "vector-databases-01",
  skillId: "vector-databases",
  order: 1,
  title: "Vector Similarity & Distance Metrics",
  subtitle:
    "How embeddings become searchable numbers: similarity scores, distance metrics, and what changes when dimensionality grows.",
  estimatedMinutes: 15,
  objectives: [
    "Explain why high-dimensional vectors represent text, images, and other data in GenAI systems.",
    "Compute and interpret cosine similarity, dot product similarity, and Euclidean distance with NumPy.",
    "Choose an appropriate metric for normalized vs. unnormalized embedding spaces.",
    "Describe how distance concentration (curse of dimensionality) affects naive nearest-neighbor intuition.",
  ],
  content: [
    {
      type: "text",
      content:
        "In retrieval-augmented generation (RAG) and semantic search, a model turns content into fixed-length lists of numbers called **embedding vectors**. Your vector database does not “understand” language—it compares vectors using geometry. Picking the right similarity or distance function is as important as picking the right embedding model.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Notation cheat sheet",
      content:
        "Bold symbols like **a** and **b** denote vectors. ||**a**|| is the L2 (Euclidean) length. **a**·**b** is the dot product. θ is the angle between vectors in the plane they span.",
    },
    {
      type: "heading",
      level: 2,
      content: "Vectors in the ML and GenAI context",
    },
    {
      type: "text",
      content:
        "Each dimension captures (opaquely) some aspect learned during training. Similar meanings tend to land in nearby regions of this space, so “closeness” approximates semantic relatedness. Dimensions are rarely human-interpretable one-by-one; you reason about the vector as a whole.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Embeddings are often L2-normalized by the API—check your provider docs before assuming raw magnitudes mean anything.",
        "Batch your vectors for throughput; similarity is embarrassingly parallel across query–document pairs.",
        "Outliers (very long or zero vectors) can dominate naive metrics if you skip normalization.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Dot product and cosine similarity",
    },
    {
      type: "text",
      content:
        "The **dot product** **a**·**b** = Σᵢ aᵢbᵢ measures alignment. For two non-zero vectors, **cosine similarity** is the cosine of the angle between them: cos(θ) = (**a**·**b**) / (||**a**|| ||**b**||). It ranges from −1 to 1 for real vectors (often only non-negative for text embeddings).",
    },
    {
      type: "code",
      language: "python",
      filename: "cosine_numpy.py",
      code: `import numpy as np

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity for 1-D vectors (not batched)."""
    a = np.asarray(a, dtype=np.float64)
    b = np.asarray(b, dtype=np.float64)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0:
        raise ValueError("Zero vector — cosine undefined.")
    return float(np.dot(a, b) / denom)

u = np.array([1.0, 0.0, 1.0])
v = np.array([1.0, 1.0, 0.0])
print(cosine_similarity(u, v))  # ~0.5`,
    },
    {
      type: "tip",
      content:
        "If vectors are already L2-normalized to unit length, cosine similarity equals the dot product. Many hosted embedding APIs return unit vectors specifically so inner-product indexes can substitute for cosine.",
    },
    {
      type: "heading",
      level: 2,
      content: "Euclidean (L2) distance",
    },
    {
      type: "text",
      content:
        "Euclidean distance d₂(**a**,**b**) = ||**a**−**b**||₂ = √(Σᵢ(aᵢ−bᵢ)²) measures straight-line separation. For **unit** vectors, smaller Euclidean distance implies **higher** cosine similarity, but the relationship is nonlinear—do not mix metrics inside the same index without re-tuning.",
    },
    {
      type: "code",
      language: "python",
      filename: "euclidean_numpy.py",
      code: `import numpy as np

def pairwise_l2(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.linalg.norm(a - b))

# Many vectors at once: (n, d) vs (m, d) -> (n, m) distances
def l2_distance_matrix(X: np.ndarray, Y: np.ndarray) -> np.ndarray:
    # ||x||^2 + ||y||^2 - 2 x·y expansion avoids Python loops
    x2 = np.sum(X * X, axis=1, keepdims=True)
    y2 = np.sum(Y * Y, axis=1, keepdims=True).T
    cross = X @ Y.T
    # clamp small negatives from float error
    d2 = np.maximum(x2 + y2 - 2 * cross, 0.0)
    return np.sqrt(d2)`,
    },
    {
      type: "heading",
      level: 2,
      content: "When to use which metric",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "**Cosine / dot product (normalized):** Default for text embeddings where direction matters more than magnitude.",
        "**Euclidean on raw embeddings:** Useful when magnitudes carry signal (some multimodal models) or when your index is built for L2.",
        "**Manhattan (L1):** Occasionally used for sparse or robust variants; less common in off-the-shelf embedding APIs.",
        "**Always align with the index:** FAISS, Pinecone, and others let you pick inner product, L2, or cosine—match training normalization.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "High dimensions and the curse of dimensionality",
    },
    {
      type: "text",
      content:
        "As dimension d grows, random points tend to be far apart in absolute terms, and the ratio of distances to the farthest vs. nearest neighbor shrinks—**distance concentration**. That is why brute-force scan or exact trees degrade, and why production systems use approximate nearest neighbor (ANN) structures (covered in a later lesson).",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Interview trap",
      content:
        "Saying “cosine is always best” without asking about normalization and index type sounds shallow. A strong answer mentions provider defaults, whether magnitude matters, and that ANN trades recall for speed at scale.",
    },
    {
      type: "diagram",
      alt: "Two vectors in 2-D with angle theta between them",
      content: `flowchart LR
  subgraph geom [Geometry view]
    A[Vector a] --- O((Origin))
    B[Vector b] --- O
  end
  O --> M[Cosine: angle]
  O --> E[Euclidean: chord length]`,
    },
  ],
  keyTakeaways: [
    "Embeddings map data into ℝᵈ; retrieval is geometry—pick a metric consistent with your model and index.",
    "Cosine similarity ignores magnitude after normalization; dot product on unit vectors equals cosine.",
    "Euclidean distance measures straight-line separation; relate it to cosine only when norms are fixed.",
    "In high dimensions, distances concentrate—exact search and naive intuition break without ANN methods.",
  ],
  interviewTips: [
    "State whether embeddings are L2-normalized before defending cosine vs. dot product.",
    "Mention that vector DBs expose IP/L2/cosine—your job is to align metric, model, and evaluation.",
    "If asked about speed, bridge to ANN (HNSW, IVF) rather than only discussing formulas.",
    "Sketch the cosine formula and explain it as ‘alignment of directions’, not magic NLP dust.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "vd01-mc-cosine-unit",
      question:
        "Two embedding vectors **a** and **b** are both L2-normalized to unit length. Which identity holds?",
      options: [
        "cosine_similarity(a, b) always equals ||a - b||₂",
        "cosine_similarity(a, b) equals dot(a, b)",
        "cosine_similarity(a, b) equals ||a + b||₂",
        "cosine_similarity is undefined for unit vectors",
      ],
      correctIndex: 1,
      explanation:
        "For unit vectors, ||a|| = ||b|| = 1, so cos(θ) = (a·b)/(1·1) = a·b. Euclidean distance is related but not identical to cosine.",
      interviewNote:
        "This is the ‘inner product index = cosine for unit embeddings’ talking point interviewers like.",
    },
    {
      type: "code-completion",
      id: "vd01-cc-dot",
      question:
        "Fill in the blank so the function returns the raw dot product of two 1-D NumPy arrays.",
      codeTemplate: `import numpy as np

def dot_product(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.________(a, b))`,
      language: "python",
      correctAnswer: "dot",
      acceptableAnswers: ["dot"],
      explanation:
        "np.dot(a, b) computes the scalar dot product for 1-D vectors. For two 2-D matrices, broadcasting rules differ—here we assume 1-D embeddings.",
      interviewNote:
        "Mention vdot or (a @ b) for floats; np.dot is the most common interview answer.",
    },
    {
      type: "ordering",
      id: "vd01-ord-pipeline",
      question:
        "Order these steps for a typical semantic search query (first → last).",
      items: [
        "Return top-k IDs and scores to the caller or reranker",
        "Encode the query with the same embedding model as the corpus",
        "Compare the query vector to index vectors using the chosen metric",
        "Load or build an index aligned to that metric (cosine/IP/L2)",
      ],
      correctOrder: [1, 3, 2, 0],
      explanation:
        "Embed query with the same model → use an index trained for your metric → run vector comparison (ANN) → return ranked results.",
      interviewNote:
        "Embedding mismatch (different model or preprocessing) is a classic production bug—name it.",
    },
    {
      type: "true-false",
      id: "vd01-tf-curse",
      statement:
        "As the number of dimensions grows, pairwise distances between random points tend to become more distinguishable relative to each other, making exact k-NN trivially easy without approximation.",
      correct: false,
      explanation:
        "The curse of dimensionality typically causes distance concentration: relative contrast between near and far neighbors weakens, which motivates approximate methods and careful evaluation—not ‘easier’ exact search.",
      interviewNote:
        "Contrast brute-force O(n) scan with ANN sublinear behavior at scale.",
    },
    {
      type: "scenario",
      id: "vd01-sc-metric-choice",
      scenario:
        "Your team uses OpenAI text embeddings that are L2-normalized. Product wants ‘semantic duplicate detection’ for support tickets. Latency must stay under 50 ms at 5M vectors.",
      question:
        "Which similarity setup do you recommend first, and what follow-up do you request from the platform team?",
      sampleAnswer:
        "Use cosine or inner product on the unit embeddings (equivalent for ranking). Confirm the vector index is built for inner product or cosine and uses ANN (e.g., HNSW/IVF) with tuned recall@k. Ask for embedding model version lock and a golden set to measure precision/recall—metric choice is useless if the index type or model drifts.",
      keyPoints: [
        "Unit vectors → dot product equals cosine for ranking.",
        "Ask about index algorithm parameters and recall targets, not only the formula.",
        "Align embedding model version across ingest and query paths.",
      ],
      interviewNote:
        "Tie metric choice to normalization, index configuration, and offline evaluation—enterprise answer pattern.",
    },
  ],
};
