import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rag-01",
  skillId: "rag",
  order: 1,
  title: "Что такое РАГ?",
  subtitle:
    "Почему извлечение имеет значение для заслуживающего доверия GenAI, чем RAG отличается от простой настройки и подсказки, а также формы производственного конвейера.",
  estimatedMinutes: 17,
  objectives: [
    "Объясните, какие проблемы решает RAG (галлюцинации, устаревшие знания, заземление предметной области).",
    "Сравните RAG с тонкой настройкой и быстрым проектированием и определите, когда следует комбинировать подходы.",
    "Описать сквозной конвейер RAG от приема до генерации.",
    "Распознайте распространенные варианты корпоративного использования и компромиссы с простым RAG.",
  ],
  content: [
    {
      type: "text",
      content:
        "Большие языковые модели сжимают общие шаблоны обучающих данных в веса. Они могут звучать авторитетно, но при этом быть неправильными или устаревшими. Поисково-дополненная генерация (RAG) обосновывает ответы в **документах, которые вы контролируете**, извлекая соответствующие отрывки до того, как модель запишет окончательный ответ.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Оформление интервью",
      content:
        "Четкая фраза побеждает: «RAG снижает зависимость от параметрической памяти, вводя непараметрические знания во время вывода». Далее укажите, когда это помогает (политики, билеты, код), а когда нет (чистые рассуждения без корпуса).",
    },
    {
      type: "heading",
      level: 2,
      content: "Проблемы, которые помогает решить RAG",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Галлюцинации: модель выдумывает факты; полученные цитаты дают генератору что-то, чему можно оставаться верным.",
        "Ограничение знаний: ваш индекс может содержать примечания к выпуску на этой неделе или кадровую политику без переобучения базовой модели.",
        "Специфика предметной области: проприетарные сборники сценариев, контракты и журналы редко проходят предварительное обучение; RAG приводит их в контекст.",
        "Возможность аудита: вы можете регистрировать, какие фрагменты были получены, что полезно для обеспечения соответствия требованиям и отладки.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "ТРЯПКА - это не волшебство",
      content:
        "Плохие фрагменты, неправильные встраивания или расплывчатые запросы по-прежнему дают слабые или вводящие в заблуждение ответы. RAG смещает узкое место в сторону качества поиска и оценки, а не от инженерной строгости.",
    },
    {
      type: "heading",
      level: 2,
      content: "RAG vs тонкая настройка vs оперативное проектирование",
    },
    {
      type: "text",
      content:
        "**Быстрое проектирование** формирует поведение и формат вывода с помощью инструкций и примеров в контекстном окне. Он не добавляет новых фактических знаний сверх того, что умещается в подсказке, если вы не вставляете документы самостоятельно — RAG автоматизирует этот этап вставки в нужном масштабе.",
    },
    {
      type: "text",
      content:
        "**Точная настройка** обновляет веса модели (полная, LoRA и т. д.) для специализации тона, формата или априорных задач. Частое обновление обходится дорого и рискованно из-за нестабильных фактов. Команды часто используют **RAG для сбора фактов**, **тонкую настройку стиля или привычек использования инструментов** и **подсказку об установлении ограничений**.",
    },
    {
      type: "tip",
      content:
        "В интервью упоминайте «свежесть данных» и «стоимость/задержку»: RAG может обновить векторный индекс за считанные минуты; Полные циклы тонкой настройки выполняются медленнее и требуют тщательно подобранных наборов данных.",
    },
    {
      type: "heading",
      level: 2,
      content: "Сквозной конвейер RAG",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Всасывание: загрузка источников (PDF, HTML, заявки, код) и нормализация текста.",
        "Чанк: разбивайте документы на сегменты, размер которых позволяет встраивать модели и контекстные окна.",
        "Внедрение: превратите каждый фрагмент в плотный вектор (и, возможно, в разреженные сигналы для гибридного поиска).",
        "Хранение/индексирование: вставка векторов (+ метаданные) в базу данных векторов или сервер поиска.",
        "Извлечение: по запросу пользователя извлеките топ-k похожих фрагментов (возможно, повторно ранжируйте).",
        "Дополнение: создайте подсказку с системными правилами + найденными отрывками + вопросом пользователя.",
        "Создать: позвонить в LLM; при необходимости проверьте цитаты или выполните второй этап критики.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Реальные варианты использования",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Корпоративный поиск и внутренние вопросы и ответы через вики, SharePoint и Confluence.",
        "Помощники по поддержке клиентов, знакомые со статьями базы знаний и ранее решенными заявками.",
        "Вторые пилоты разработчиков, которые получают документы репозиториев, ADR и ссылки на API.",
        "Регулируемые области (финансы, здравоохранение), ответы в которых должны содержать утвержденные источники.",
      ],
    },
    {
      type: "heading",
      level: 3,
      content: "Наивный RAG в одной диаграмме",
    },
    {
      type: "diagram",
      alt: "Наивный поток RAG из документов через разбиение на фрагменты и встраивание в векторное хранилище, а затем поиск по запросу в LLM.",
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

SYSTEM = """Отвечайте, используя ТОЛЬКО контекст. Если отсутствует, скажите, что не знаете."""

def build_prompt(context_chunks: list[str], question: str) -> str:
    context = "\\n\\n".join(context_chunks)
    return f"{СИСТЕМА}\\\n\\\nКонтекст:\\\n{контекст}\\\n\\\nВопрос: {вопрос}"

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
question = "Какова политика возврата?"
prompt = f"Используйте только этот контекст:\\\n\\\n{________}\\\n\\\nВопрос: {вопрос}"`,
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
