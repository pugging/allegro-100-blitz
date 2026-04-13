import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rag-03",
  skillId: "rag",
  order: 3,
  title: "Стратегии поиска",
  subtitle:
    "От наивного сходства top-k до гибридного поиска, повторного ранжирования, преобразования запросов и шаблонов LangChain, таких как контекстное сжатие и извлечение родительских документов.",
  estimatedMinutes: 16,
  objectives: [
    "Объясните метрики сходства (косинус, скалярное произведение) и когда нормализация имеет значение.",
    "Примените поиск top-k и MMR, чтобы сбалансировать релевантность и разнообразие.",
    "Опишите гибридное ключевое слово + семантический поиск и повторное ранжирование.",
    "Опишите методы преобразования запросов (HyDE, многозапрос) и контекстное сжатие.",
    "Сравните поиск дочерних фрагментов с раскрытием родительского документа для контекста.",
  ],
  content: [
    {
      type: "text",
      content:
        "Многие системы RAG выигрывают или проигрывают при извлечении данных. Сильная модель внедрения с наивным top-k все равно может возвращать избыточные отрывки или пропускать точные ключевые слова (SKU, юридические ссылки). В этом уроке рассматривается набор инструментов, который вы сможете обсудить на техническом собеседовании.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Ментальная модель",
      content:
        "Думайте в два этапа: **припоминание** (внесите все необходимое в набор кандидатов) и **точность** (выявление наилучшего порядка для LLM). Гибридный поиск улучшает запоминаемость; повторное ранжирование повышает точность.",
    },
    {
      type: "heading",
      level: 2,
      content: "Поиск по сходству: косинус против скалярного произведения",
    },
    {
      type: "text",
      content:
        "Вложения часто **L2-нормализованы**, что делает **косинусное сходство** эквивалентным скалярному произведению в соответствующем масштабе. Скалярное произведение ненормализованных векторов предпочитает более длинные тексты. Предположим, на собеседованиях вы проверяете, нормализует ли ваш провайдер выходные данные и принимают ли индексы внутреннего продукта (например, некоторые конфигурации ИНС) единичные векторы.",
    },
    {
      type: "heading",
      level: 2,
      content: "Поиск Top-k",
    },
    {
      type: "text",
      content:
        "Учитывая вектор запроса, извлеките k ближайших соседей в пространстве внедрения. Маленький k сохраняет токены, но рискует пропустить доказательства; большое k увеличивает шум и стоимость. Динамический k (остановка, когда сходство падает ниже порогового значения) является распространенным уточнением.",
    },
    {
      type: "heading",
      level: 2,
      content: "MMR (Максимальная предельная релевантность)",
    },
    {
      type: "text",
      content:
        "MMR сочетает **релевантность запросу** с **разнообразием выбранных документов**. Это уменьшает количество почти одинаковых фрагментов, переполняющих контекстное окно, что полезно, когда в корпусе имеется большое количество дубликатов (шаблоновые статьи базы знаний).",
    },
    {
      type: "heading",
      level: 2,
      content: "Гибридный поиск",
    },
    {
      type: "text",
      content:
        "Объедините **плотные векторы** (семантические) с **разреженными сигналами** (BM25, ключевое слово). Плотный поиск находит перефразы; разреженный находит точные токены (коды ошибок, SKU). Стратегии объединения включают взвешенную сумму баллов, взаимное объединение рангов (RRF) или предоставление возможности повторному ранжированию использовать оба списка.",
    },
    {
      type: "heading",
      level: 2,
      content: "Re-ranking",
    },
    {
      type: "text",
      content:
        "Поиск ИНС на первом этапе происходит быстро, но приблизительно; **кросс-кодер** или специальный инструмент для повторного ранжирования более точно оценивает пары (запрос, отрывок) в коротком списке (например, 50 → 8). Задержка увеличивается, поэтому используйте в производстве двухэтапные шаблоны.",
    },
    {
      type: "heading",
      level: 2,
      content: "Преобразование запроса",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "HyDE: сгенерируйте гипотетический документ, отвечающий на запрос, вставьте этот текст, извлеките его с его помощью — помогает выполнять короткие или абстрактные запросы.",
        "Мультизапрос: LLM переписывает вопрос пользователя на несколько вариантов; извлечение для каждого и объединение/дедупликация — улучшает запоминание неоднозначных фраз.",
        "Шаг назад/декомпозиция: разбейте сложные вопросы на подзапросы для итеративного поиска (связывает их с агентными шаблонами).",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Контекстное сжатие",
    },
    {
      type: "text",
      content:
        "После извлечения запустите меньшую модель или эвристику, чтобы **сжать** каждый отрывок так, чтобы остались только предложения, соответствующие запросу, прежде чем заполнять подсказку. Убирает шум и токены; добавляет задержку и еще одну поверхность отказа — оценивайте внимательно.",
    },
    {
      type: "heading",
      level: 2,
      content: "Средство извлечения родительских документов",
    },
    {
      type: "text",
      content:
        "Встраивайте **небольшие дочерние фрагменты** для точного поиска, а затем заменяйте или расширяйте **родительский** раздел/полный документ для создания. Вы получаете плотные встраивания плюс более широкий контекст для LLM — классическое исправление граничных эффектов без гигантских вложений.",
    },
    {
      type: "code",
      language: "python",
      filename: "retrieval_snippets.py",
      code: `# Illustrative patterns — adapt to your LangChain version / vector store

# MMR-style selection is available on many vector store wrappers:
# docs = vectorstore.max_marginal_relevance_search(query, k=4, fetch_k=20, lambda_mult=0.5)
# lambda_mult → 1 emphasizes relevance; lower values emphasize diversity.

# Multi-query retrieval (conceptual)
# queries = llm.generate_variants(user_question)
# buckets = [vectorstore.similarity_search(q, k=5) for q in queries]
# merged = dedupe_by_doc_id(buckets)

# ParentDocumentRetriever: small chunks in the vectorstore, mapping to larger stored docs
# retrieve small ids → load parent text from docstore for prompt context

from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
# compressor = LLMChainExtractor.from_llm(llm)
# compression_retriever = ContextualCompressionRetriever(
#     base_compressor=compressor, base_retriever=base_retriever
# )`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Latency budget",
      content:
        "Each extra LLM call (HyDE, multi-query, compression) adds round-trips. For real-time chat, cap variants, parallelize where possible, or cache frequent queries.",
    },
    {
      type: "diagram",
      alt: "Two-stage retrieval with ANN then re-ranker",
      content: `flowchart LR
  Q[User query] --> E[Embed / transform]
  E --> ANN[ANN top-50]
  ANN --> RR[Re-ranker top-8]
  RR --> P[Prompt + LLM]`,
    },
  ],
  keyTakeaways: [
    "Cosine vs dot product hinges on normalization; know what your stack assumes.",
    "Top-k is the baseline; MMR reduces redundancy in the context window.",
    "Hybrid search combines semantic and lexical strengths; re-ranking sharpens the final ordering.",
    "Query transforms and parent/child patterns attack vocabulary mismatch and chunk-boundary issues.",
  ],
  interviewTips: [
    "Name two failure modes (e.g. duplicate chunks, exact-term miss) and match each to a technique.",
    "Separate offline indexing from online query path when discussing latency.",
    "If you cite HyDE or multi-query, mention evaluation—more retrieval is not always better.",
    "Relate contextual compression to token cost and signal-to-noise ratio.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "rag03-mc-hybrid",
      question:
        "A support bot fails on tickets that include exact error codes like E-10432 but works for paraphrased symptoms. Which retrieval upgrade targets that gap best?",
      options: [
        "Increase temperature on the generator",
        "Add lexical/BM25 (sparse) hybrid retrieval or keyword filters alongside dense search",
        "Switch to a larger embedding model only",
        "Remove chunk overlap entirely",
      ],
      correctIndex: 1,
      explanation:
        "Exact tokens are where sparse lexical methods shine; dense embeddings may not align error codes with natural language. Hybrid or keyword filters directly improve recall for those patterns. Temperature and overlap do not fix lexical mismatch.",
      interviewNote:
        "Mention RRF or weighted fusion if the interviewer wants implementation detail.",
    },
    {
      type: "ordering",
      id: "rag03-ord-twostage",
      question:
        "Order these steps for a common two-stage retrieval + generation setup (first → last).",
      items: [
        "Call the LLM with retrieved passages in the prompt",
        "Re-rank the candidate list to select final passages",
        "Embed the user query (or transformed queries)",
        "ANN retrieve a larger candidate set (e.g. top 50)",
      ],
      correctOrder: [2, 3, 1, 0],
      explanation:
        "Embed query → ANN wide recall → re-rank for precision → augment prompt and generate. Skipping re-rank is valid for low-latency paths but changes the pattern.",
      interviewNote:
        "Add that fetch_k in MMR is analogous: over-fetch then narrow.",
    },
    {
      type: "true-false",
      id: "rag03-tf-mmr",
      statement:
        "MMR primarily increases the average similarity of every retrieved chunk to the query, ignoring diversity.",
      correct: false,
      explanation:
        "MMR explicitly balances relevance and diversity; it often sacrifices a bit of raw relevance to avoid redundant near-duplicate chunks in the context window.",
      interviewNote:
        "Connect to user-visible issues: five identical KB articles wasting tokens.",
    },
    {
      type: "scenario",
      id: "rag03-sc-parent",
      scenario:
        "Legal Q&A retrieves 256-token chunks for accuracy, but the model answers without seeing the full clause because key qualifiers sit in adjacent chunks.",
      question:
        "Which pattern from this lesson addresses that, and how would you describe it in one sentence?",
      sampleAnswer:
        "Use a parent-document retriever: retrieve small child chunks for embedding precision, then expand to the parent paragraph or section when building the LLM prompt so qualifiers and definitions stay attached.",
      keyPoints: [
        "Small chunks for embedding quality.",
        "Larger parent for generation context.",
        "Requires a reliable child→parent mapping in storage.",
      ],
      interviewNote:
        "Alternative acceptable answer: increase chunk size with overlap—tradeoffs on specificity.",
    },
    {
      type: "code-completion",
      id: "rag03-cc-mmr",
      question:
        "Fill in the typical LangChain vector store method name that runs maximal marginal relevance search (not plain similarity_search).",
      codeTemplate: `docs = vectorstore.________(query, k=5, fetch_k=25, lambda_mult=0.6)`,
      language: "python",
      correctAnswer: "max_marginal_relevance_search",
      acceptableAnswers: ["max_marginal_relevance_search_by_vector"],
      explanation:
        "max_marginal_relevance_search (and variants accepting a query vector) over-fetch candidates then diversify. Parameters k, fetch_k, and lambda_mult tune recall vs diversity.",
      interviewNote:
        "If API names drift by version, say you would check docs—interviewers care about the concept.",
    },
  ],
};
