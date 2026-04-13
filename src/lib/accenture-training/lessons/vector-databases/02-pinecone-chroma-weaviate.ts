import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "vector-databases-02",
  skillId: "vector-databases",
  order: 2,
  title: "Сосновая шишка, цветность и плетение",
  subtitle:
    "Три популярных стека векторного хранилища — управляемое облако, локальный открытый исходный код и гибридный поиск — а также минимальные шаблоны Python для обновления и запроса.",
  estimatedMinutes: 15,
  objectives: [
    "Contrast Pinecone (управляемый), Chroma (встроенный/локальный) и Weaviate (гибридный) для типичных рабочих нагрузок GenAI.",
    "Выполняйте базовые операции обновления, выборки и запроса на Python в соответствии с клиентскими шаблонами каждой экосистемы.",
    "Решите, когда победит бессерверный поиск, автономный или гибридный поиск по ключевым словам + векторный поиск.",
  ],
  content: [
    {
      type: "text",
      content:
        "Базы данных векторов — это специализированные хранилища для многомерных векторов, а также **метаданных**, по которым вы фильтруете (идентификаторы клиентов, временные метки, теги ACL). В клиентских проектах вы редко создаете индексы с нуля — вы интегрируете стек поставщика или OSS, встраиваете контент в автономном или онлайн-режиме и настраиваете отзыв/задержку.",
    },
    {
      type: "heading",
      level: 2,
      content: "Пейзаж с первого взгляда",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Сосновая шишка:** полностью управляемая, бессерверная; вы передаете векторы через API, минимальные операции.",
        "**Цветность:** удобна для разработчиков, работает внутри процесса или на сервере; отлично подходит для ноутбуков и прототипов.",
        "**Weaviate:** ядро ​​с открытым исходным кодом и облачные возможности; сильные **гибридные** (BM25 + вектор) и API-интерфейсы в стиле GraphQL.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      title: "Корпоративный объектив",
      content:
        "Короткий список по следующим вопросам: местонахождение данных, SSO/RBAC, резервное копирование/восстановление, соглашения об уровне обслуживания, модель стоимости (на модуль или на вектор), а также нужен ли вам готовый гибридный лексический поиск.",
    },
    {
      type: "heading",
      level: 2,
      content: "Сравнительная таблица",
    },
    {
      type: "text",
      content:
        "Точные названия функций меняются ежеквартально — всегда проверяйте их в официальной документации перед началом производства. В этой таблице отражена форма решения, которую стажеры должны принять во время обсуждений архитектуры.",
    },
    {
      type: "code",
      language: "text",
      filename: "comparison-summary.txt",
      code: `| Dimension        | Pinecone           | Chroma              | Weaviate                |
|-----------------|--------------------|---------------------|-------------------------|
| Primary vibe    | Managed SaaS       | Local-first OSS     | Hybrid search platform  |
| Ops burden      | Low (vendor ops)   | You or team         | Medium (self or cloud)  |
| Hybrid search   | Add-ons / patterns | Often pair w/ tools | First-class BM25+vector |
| Great for       | Fast prod MVPs     | Dev/test, on-device | RAG w/ keyword needs    |`,
    },
    {
      type: "heading",
      level: 2,
      content: "Pinecone: managed vectors",
    },
    {
      type: "text",
      content:
        "You create an **index** with dimension and distance metric (cosine, Euclidean, dot product). Records have **ids**, **values** (the vector), and **metadata** for pre/post-filtering. Serverless indexes scale with usage; pod-based indexes offer predictable performance profiles.",
    },
    {
      type: "code",
      language: "python",
      filename: "pinecone_upsert_query.py",
      code: `# Conceptual pattern — install: pip install pinecone-client
# Requires PINECONE_API_KEY and an existing index matching embedding dim.

from pinecone import Pinecone

pc = Pinecone(api_key="YOUR_API_KEY")
index = pc.Index("genai-docs")

# Upsert (batch in production)
index.upsert(
    vectors=[
        {
            "id": "doc-1001",
            "values": [0.1, 0.2, 0.3],  # length = index dimension
            "metadata": {"source": "runbook", "team": "sre"},
        }
    ]
)

# Query
qvec = [0.11, 0.19, 0.31]
response = index.query(vector=qvec, top_k=5, include_metadata=True)
for match in response["matches"]:
    print(match["id"], match["score"], match.get("metadata", {}))`,
    },
    {
      type: "tip",
      content:
        "Batch upserts (hundreds–thousands per request within limits) and retry with backoff. For RAG, store chunk text in object storage and only metadata + id in Pinecone if payloads grow large—policies vary by project.",
    },
    {
      type: "heading",
      level: 2,
      content: "Chroma: embedded and open source",
    },
    {
      type: "text",
      content:
        "Chroma emphasizes **simplicity**: create a **Collection**, add documents with optional embeddings, query by embedding or by text if you wire an embedding function. It shines in **local dev**, CI fixtures, and demos before you promote data to a managed service.",
    },
    {
      type: "code",
      language: "python",
      filename: "chroma_basic.py",
      code: `# pip install chromadb
import chromadb
from chromadb.config import Settings

client = chromadb.Client(Settings(anonymized_telemetry=False))
collection = client.create_collection(name="policies")

# If you omit embeddings, supply them explicitly in production.
collection.add(
    ids=["p-1", "p-2"],
    documents=[
        "Пароли необходимо менять каждые 90 дней.",
        "Личная информация клиента не может покинуть регион ЕС.",
    ],
    metadatas=[{"dept": "it"}, {"dept": "legal"}],
)

results = collection.query(
    query_texts=["Как часто меняются пароли?"],
    n_results=2,
)
print(results["ids"], results["distances"])`,
    },
    {
      type: "heading",
      level: 2,
      content: "Weaviate: hybrid and modular",
    },
    {
      type: "text",
      content:
        "Weaviate stores objects in **classes** (like tables). You define a **vectorizer** module or bring your own vectors. **Hybrid queries** combine sparse (BM25) and dense (vector) scores—valuable when users type SKU codes, proper nouns, or jargon that pure semantic search blurs.",
    },
    {
      type: "code",
      language: "python",
      filename: "weaviate_concept.py",
      code: `# pip install weaviate-client
# Pseudocode — schema must exist with vectorizer or manual vectors.

import weaviate

client = weaviate.connect_to_local()  # or connect_to_wcs(...)

coll = client.collections.get("DocumentChunk")

uuid = coll.data.insert(
    properties={"title": "Учебник по вызову", "text": "Перезапустите модуль, если..."},
    vector=[0.01] * 1536,  # if not using a server-side vectorizer
)

response = coll.query.near_vector(
    near_vector=[0.02] * 1536,
    limit=5,
    return_metadata=weaviate.classes.query.MetadataQuery(distance=True),
)

client.close()`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "API drift",
      content:
        "Weaviate v4 Python client differs substantially from v3. Chroma and Pinecone also evolve SDK shapes. In interviews, emphasize version pinning and reading release notes—not memorizing method names.",
    },
    {
      type: "heading",
      level: 2,
      content: "When to use which",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "**Pinecone** when you want minimal infrastructure and predictable cloud scaling for vector-only retrieval.",
        "**Chroma** when the team needs fast iteration on laptops, automated tests, or lightweight on-prem prototypes.",
        "**Weaviate** when hybrid lexical+semantic search, modular retrieval, or self-hosted control is a first-class requirement.",
      ],
    },
    {
      type: "diagram",
      alt: "Data flow from documents to embeddings to three database options",
      content: `flowchart LR
  Docs[Documents / chunks] --> Emb[Embedding model]
  Emb --> V[Vectors + metadata]
  V --> P[Pinecone API]
  V --> C[Chroma collection]
  V --> W[Weaviate class]
  P --> App[App / RAG chain]
  C --> App
  W --> App`,
    },
  ],
  keyTakeaways: [
    "Pinecone optimizes for managed, API-first vector workloads at scale.",
    "Chroma lowers friction for local development and OSS-centric teams.",
    "Weaviate emphasizes hybrid search and flexible deployment models.",
    "All systems need consistent embedding models, id strategy, and metadata for filtering.",
  ],
  interviewTips: [
    "Name trade-offs: ops burden, hybrid search, residency, and cost—not just ‘which is popular’.",
    "Describe upsert + query + metadata filter in plain English for any vendor.",
    "Acknowledge SDK versioning; say you would pin deps and read migration guides.",
    "Connect choice to evaluation: recall@k on a labeled set beats vendor marketing.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "vd02-mc-hybrid",
      question:
        "A product owner reports that pure semantic search misses exact policy numbers (e.g., ‘POL-2041’) in long documents. Which direction fits best **first**?",
      options: [
        "Switch to a smaller embedding model",
        "Add hybrid lexical+vector retrieval (e.g., BM25 + dense) or explicit keyword fields",
        "Double the chunk size to 4,096 tokens always",
        "Disable metadata filtering entirely",
      ],
      correctIndex: 1,
      explanation:
        "Exact tokens and codes are classic BM25 wins; hybrid search (Weaviate native, or separate lexical index) addresses this better than only shrinking embeddings or blind chunk inflation.",
      interviewNote:
        "Mention Elasticsearch/OpenSearch + vector as an alternative pattern—shows breadth.",
    },
    {
      type: "code-completion",
      id: "vd02-cc-pinecone-arg",
      question:
        "In the Pinecone Python client, the `query` call takes the query vector under a keyword parameter. Fill in the correct parameter name.",
      codeTemplate: `response = index.query(
    ________=qvec,
    top_k=5,
    include_metadata=True,
)`,
      language: "python",
      correctAnswer: "vector",
      acceptableAnswers: ["vector"],
      explanation:
        "index.query(vector=..., top_k=...) is the common pattern in v3-style APIs; always verify against your installed client version.",
      interviewNote:
        "If unsure in a live interview, say you’d check the typed client or official quickstart—signals mature engineering.",
    },
    {
      type: "ordering",
      id: "vd02-ord-rag-ingest",
      question:
        "Order these for a typical batch RAG ingestion pipeline into a vector DB.",
      items: [
        "Embed each chunk with the production embedding model",
        "Upsert vectors with stable ids and metadata",
        "Chunk and clean source documents",
        "Evaluate retrieval quality on a small golden set",
      ],
      correctOrder: [2, 0, 1, 3],
      explanation:
        "Chunk/clean → embed → upsert to DB → evaluate. Evaluation often runs iteratively, but first load requires content and vectors before tuning.",
      interviewNote:
        "Mention idempotency: re-ingest should upsert same logical ids.",
    },
    {
      type: "true-false",
      id: "vd02-tf-chroma-server",
      statement:
        "Chroma is only usable inside Jupyter notebooks and cannot run as a persistent server or embedded library in applications.",
      correct: false,
      explanation:
        "Chroma supports embedded/in-process usage and can run as a server for persistence; notebooks are a common starting point, not a limitation.",
      interviewNote:
        "Contrast ‘prototype in notebook’ vs. ‘production deployment topology’.",
    },
    {
      type: "scenario",
      id: "vd02-sc-pinecone-vs-weaviate",
      scenario:
        "A client needs EU data residency, hybrid search for SKU + description, and they already run Kubernetes on Azure. Your team has SRE capacity.",
      question:
        "How would you narrow Pinecone vs. Weaviate (or a combined stack) for a proof of concept?",
      sampleAnswer:
        "Confirm residency offerings and networking for each. If hybrid SKU search is core, prioritize Weaviate (self-hosted on AKS or Weaviate Cloud if compliant) or pair Pinecone with a lexical engine (e.g., Azure AI Search). PoC: ingest 10k SKUs, measure recall@10 for SKU-exact queries vs. paraphrase queries, and compare ops cost (managed Pinecone vs. self-hosted Weaviate).",
      keyPoints: [
        "Residency and compliance first.",
        "Hybrid requirement steers architecture.",
        "PoC with representative queries beats slide-deck comparisons.",
      ],
      interviewNote:
        "Show you can combine vendors—vector store + search service—is a credible enterprise pattern.",
    },
  ],
};
