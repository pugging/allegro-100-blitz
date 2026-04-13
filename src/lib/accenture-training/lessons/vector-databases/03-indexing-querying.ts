import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "vector-databases-03",
  skillId: "vector-databases",
  order: 3,
  title: "Алгоритмы индексирования и запросы",
  subtitle:
    "От исчерпывающего поиска до ANN: HNSW, IVF, квантование произведения, FAISS и то, как фильтры метаданных взаимодействуют с задержкой и отзывом.",
  estimatedMinutes: 15,
  objectives: [
    "Объясните грубую силу k-NN в сравнении с приблизительным ближайшим соседом (ANN) и почему ANN доминирует в масштабе.",
    "Описать HNSW, IVF и PQ на концептуальном уровне и их компромиссы при сборке/запросе.",
    "Используйте FAISS в качестве эталонной ментальной модели для составления индексов в исследованиях и инструментах.",
    "Рассуждения о фильтрации метаданных, гибридных запросах и масштабировании сегментирования/репликации.",
  ],
  content: [
    {
      type: "text",
      content:
        "Учитывая вектор запроса **q** и **n** векторы базы данных, **точные** k-ближайшие соседи сравнивают **q** с каждым вектором — O(n·d) на запрос с помощью наивной линейной алгебры. Когда n достигает миллионов или миллиардов, полное сканирование выполняется слишком медленно. **Алгоритмы приблизительного ближайшего соседа (ANN)** возвращают соседей в сублинейном времени с высокой вероятностью, обменивая небольшой объем отзыва на выигрыш с большой задержкой.",
    },
    {
      type: "heading",
      level: 2,
      content: "Грубая сила против ИНС",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Грубая сила:** Простой, 100 % отзыв (в пределах плавающей ошибки), лучше всего подходит для небольших корпораций или точных проверок.",
        "**ANN:** На основе графа (HNSW), дерева/кластера (IVF), хеширования (семейства LSH) или комбинаций — настраивается с помощью параметров и данных обучения.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Что вы измеряете",
      content:
        "Команды отслеживают **recall@k** ​​(появился ли настоящий топ-k?), **задержку p50/p95**, **QPS** и **время построения индекса**. Потрясающий p50 с ужасным p95 не справляется с приложениями, чувствительными к SLA.",
    },
    {
      type: "heading",
      level: 2,
      content: "HNSW (Иерархический навигационный малый мир)",
    },
    {
      type: "text",
      content:
        "HNSW строит **многослойный график**: верхние слои представляют собой редкие длинные прыжки для грубой навигации; нижние слои плотны для точного поиска. Запрос начинается с точки входа, жадно перемещается к более близким соседям, а затем уточняется — например, линии метро и местные улицы. **efConstruction** (сборка) и **efSearch** (запрос) контролируют точность и скорость.",
    },
    {
      type: "tip",
      content:
        "Многие управляемые базы данных скрыто предоставляют HNSW или его варианты. При настройке увеличивайте efSearch до тех пор, пока Recall@k не выйдет на плато, а затем прекратите сжигать задержку.",
    },
    {
      type: "heading",
      level: 2,
      content: "IVF (инвертированный файловый индекс)",
    },
    {
      type: "text",
      content:
        "Векторы ЭКО **кластеры** (например, k-средние с центроидами **nlist**). Во время запроса вы сравниваете **q** с центроидами и выполняете поиск только в ближайших кластерах **nprobe**, что значительно сокращает количество сравнений. Более высокое значение **nprobe** улучшает отзыв, но увеличивает объем работы на запрос.",
    },
    {
      type: "heading",
      level: 2,
      content: "PQ (квантование продукта)",
    },
    {
      type: "text",
      content:
        "PQ разбивает каждый d-мерный вектор на подвекторы, каждый из которых квантуется в небольшую кодовую книгу. Сохраненные векторы становятся компактными **кодами**; расстояния **асимметричны** (ADC): менее агрессивно квантовайте запрос и приближайте расстояния БД с помощью справочных таблиц. PQ сокращает объем памяти и ускоряет оценку расстояния за счет точности.",
    },
    {
      type: "heading",
      level: 2,
      content: "FAISS (поиск сходства с помощью искусственного интеллекта в Facebook)",
    },
    {
      type: "text",
      content:
        "FAISS — это библиотека, а не база данных. Она состоит из объектов **Index** (Flat, IVF, HNSW) с дополнительными PQ или скалярными квантователями. Исследователи и инженеры используют его для тестов, поиска на локальном графическом процессоре и понимания взаимодействия параметров.",
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
