import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rag-02",
  skillId: "rag",
  order: 2,
  title: "Разделение документов на части и индексирование",
  subtitle:
    "От беспорядочных файлов до векторов с возможностью поиска: загрузчики, стратегии фрагментирования, метаданные, встраивания и индексирование векторного хранилища с помощью Python в стиле LangChain.",
  estimatedMinutes: 16,
  objectives: [
    "Выбирайте загрузчики документов для источников PDF, HTML и Markdown.",
    "Сравните фрагментирование фиксированного размера, рекурсивное и семантическое фрагментирование и их компромиссы.",
    "Настройте размер фрагмента и перекрытие для соответствия отзыву, точности и бюджетам токенов.",
    "Объясните извлечение метаданных и как оно обеспечивает фильтрацию и цитирование.",
    "Описать генерацию и индексацию встраивания в векторное хранилище.",
  ],
  content: [
    {
      type: "text",
      content:
        "Качество поиска часто ограничивается тем, как вы **обрезаете** документы. Слишком большие фрагменты разбавляют вложения несвязанными идеями; слишком маленькие фрагменты теряют контекст перекрестного предложения. Загрузчики извлекают текст из файлов; Чанкеры формируют то, что на самом деле видит специалист по внедрению.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Почему интервьюеров это волнует",
      content:
        "Кандидатам младшего/среднего уровня следует отказаться от фразы «мы используем 512 токенов» и рассуждать: перекрытие уменьшает границы границ, заголовки/метаданные улучшают фильтры, а максимальная длина последовательности модели внедрения ограничивает эффективный размер фрагмента.",
    },
    {
      type: "heading",
      level: 2,
      content: "Загрузчики документов",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "PDF: шум макета (верхние, нижние колонтитулы, столбцы) — при сканировании часто требуется очистка или распознавание текста.",
        "HTML: удалить сценарии/стили; сохраняйте заголовки и ссылки как метаданные, когда они полезны.",
        "Markdown: структура явная (# заголовков, списков) — отлично подходит для иерархического разбиения на фрагменты.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Стратегии дробления",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Фиксированный размер: разделяйте каждые N символов или токенов — просто, быстро, можно разбить в середине предложения или в середине таблицы.",
        "Рекурсивный: разделение по иерархии разделителей (\\\n\\\n, \\\n, пробел), чтобы дольше сохранять абзацы и строки неповрежденными.",
        "Семантика: встраивайте предложения/абзацы и объединяйте или разделяйте их при резком скачке расстояния встраивания — адаптируется к содержимому, но требует больше вычислений.",
      ],
    },
    {
      type: "heading",
      level: 3,
      content: "Размер фрагмента и перекрытие",
    },
    {
      type: "text",
      content:
        "Большие фрагменты улучшают **полноту контекста**, но ухудшают специфичность встраивания и увеличивают стоимость быстрого реагирования. **Перекрытие** (например, 10–20 % длины фрагмента) снижает вероятность того, что критическое предложение окажется на границе обрезки. Настраивайтесь с помощью поисковых оценок, а не только догадок.",
    },
    {
      type: "tip",
      content:
        "Если таблицы или код появляются часто, рассмотрите возможность разделения правил по типам документов (ограждения кода Markdown, HTML <pre>, эвристика таблиц PDF) вместо одного глобального разделителя.",
    },
    {
      type: "heading",
      level: 2,
      content: "Извлечение метаданных",
    },
    {
      type: "text",
      content:
        "Прикрепите структурированные поля к каждому чанку: `source`, `page`, `section`, `author`, `updated_at`, теги ACL для многопользовательских фильтров. Метаданные обеспечивают **предварительную фильтрацию** перед векторным поиском (например, только политики «2024») и более подробное цитирование в пользовательском интерфейсе.",
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
