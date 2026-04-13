import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rag-04",
  skillId: "rag",
  order: 4,
  title: "Оценка и оптимизация RAG",
  subtitle:
    "Измеряйте то, что важно, с помощью метрик в стиле RAGAS, устраняйте типичные сбои, настраивайте стек и распознавайте само-RAG, корректирующую RAG и агентные шаблоны для производства.",
  estimatedMinutes: 16,
  objectives: [
    "Опишите RAGAS и основные показатели: достоверность, релевантность ответа, точность/запоминание контекста.",
    "Перечислите распространенные виды отказов RAG и укажите, на каком этапе конвейера они возникают.",
    "Применяйте рычаги оптимизации: разбиение на фрагменты, встраивания, маршрутизацию и переранжирование.",
    "Контрастная само-РАГ, корректирующая РАГ и агентная РАГ на высоком уровне.",
    "Назовите производственные проблемы: стоимость, задержка, безопасность и управление данными.",
  ],
  content: [
    {
      type: "text",
      content:
        "Доставка RAG без оценки предполагается. Такие платформы, как **RAGAS** (и аналогичные наборы инструментов), используют оценки с помощью LLM или классические оценки для количественной оценки качества поиска и генерации, поэтому вы можете сравнивать размеры фрагментов, способы внедрения или подсказки с доказательствами, а не с флюидами.",
    },
    {
      type: "callout",
      variant: "info",
      title: "РАГАС в интервью",
      content:
        "От вас не требуется выводить формулы. Объясните, что метрики нацелены на **обоснованность** (достоверность), **полезность** (релевантность ответов) и **качество извлечения** (точность/запоминание контекста), а также что LLM как судья нуждается в калибровке и золотых наборах.",
    },
    {
      type: "heading",
      level: 2,
      content: "Метрики в стиле RAGAS (концептуальные)",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Верность: соответствует ли ответ полученному контексту (не выдумывая факты)?",
        "Релевантность ответа: действительно ли ответ отвечает на вопрос пользователя?",
        "Точность контекста: является ли полученный контекст наиболее полезным или шумным?",
        "Запоминание контекста: выявил ли поиск доказательства, необходимые для ответа (охват)?",
      ],
    },
    {
      type: "text",
      content:
        "Сочетайте автоматические оценки с **человеческой проверкой** крайних случаев и небольшим **золотым набором данных** (вопрос, идеальный ответ, подтверждающие идентификаторы документов) для регрессионного тестирования при изменении фрагментации или модели.",
    },
    {
      type: "heading",
      level: 2,
      content: "Распространенные виды отказов",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Пропущенный поиск: несоответствие фрагментов/встраивания/запросов → ложные ответы «нет в документации».",
        "Отравленный контекст: нерелевантные фрагменты сбивают с толку модель → неправильные, но уверенные ответы.",
        "Противоречивые источники: корпус устарел + обновлены страницы политики.",
        "Быстрое внедрение через документы: моделью управляет ненадежный текст.",
        "Пики задержки/стоимости: слишком много фрагментов, повторное ранжирование или варианты с несколькими запросами.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Методы оптимизации",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Настройка чанка: размер, перекрытие, разделители с учетом структуры, шаблоны «родитель-потомок».",
        "Выбор модели внедрения: при необходимости модели, специфичные для предметной области или многоязычные.",
        "Маршрутизация запросов: отправляйте часто задаваемые вопросы в один индекс, технические характеристики — в другой.",
        "Гибрид + переоценка: расширяйте запоминаемость, а затем повышайте точность.",
        "Улучшенные подсказки: строгое цитирование только из контекста, неизвестная обработка, схема вывода.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Расширенные шаблоны",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Self-RAG: модель критикует поиск/генерацию и может инициировать еще один проход поиска.",
        "Корректирующий RAG (CRAG): выявляет поиск с низкой степенью достоверности и корректирует его (например, откат или повторный запрос через Интернет).",
        "Агентическая RAG: агенты, использующие инструменты, планируют подзапросы, повторяют поиск и проверяют — более высокие возможности, более высокие затраты и поверхность сбоев.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Производственные соображения",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Наблюдаемость: запрос трассировки → полученные идентификаторы → хэш запроса → версия модели.",
        "PII и ACL: применяйте фильтры метаданных для каждого пользователя/арендатора.",
        "Ограничения скорости и пакетная обработка для внедрения и API-интерфейсов LLM.",
        "Версионные индексы и откат при отправке неправильной загрузки.",
      ],
    },
    {
      type: "code",
      language: "python",
      filename: "ragas_eval_sketch.py",
      code: `# Conceptual RAGAS usage — install ragas, datasets, and your LLM/embeddings
# from datasets import Dataset
# from ragas import evaluate
# from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall

# data_samples = [{
#     "question": "...",
#     "answer": model_answer,
#     "contexts": [c.page_content for c in retrieved_chunks],
#     "ground_truth": reference_answer,  # for some metrics / datasets
# }]
# dataset = Dataset.from_list(data_samples)
# result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, ...])
# print(result)

# In practice you batch hundreds of rows, pin judge model versions, and compare runs.`,
    },
    {
      type: "tip",
      content:
        "When optimizing, change **one knob per experiment** (chunk size OR embedder OR re-ranker) so you know what moved the metric.",
    },
    {
      type: "diagram",
      alt: "Feedback loop from metrics back to chunking retrieval and prompts",
      content: `flowchart TD
  D[Golden questions + labels] --> R[Run RAG pipeline]
  R --> M[Metrics: faithfulness precision recall]
  M --> T{Triage}
  T -->|bad retrieval| CH[Chunking / hybrid / routing]
  T -->|bad generation| PR[Prompt / model / citations]
  CH --> R
  PR --> R`,
    },
  ],
  keyTakeaways: [
    "Evaluate both retrieval (context precision/recall) and generation (faithfulness, relevancy).",
    "Failure modes map to stages: bad chunks, bad queries, bad ranking, or unsafe prompting.",
    "Optimization is iterative: instrument, measure, change one variable, re-run.",
    "Self-RAG, CRAG, and agentic RAG add reflection or tools—powerful but need governance.",
  ],
  interviewTips: [
    "Propose a minimal eval set before discussing fancy architectures.",
    "Tie metrics to user harm: compliance bots need faithfulness; discovery bots need recall.",
    "Mention judge LLM bias and the need for human spot checks.",
    "Close with production: logging, PII, and index versioning.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "rag04-mc-faithfulness",
      question:
        "Which metric most directly targets whether the generated answer is supported by the retrieved passages (not adding unsupported facts)?",
      options: [
        "Context recall",
        "Faithfulness",
        "Answer relevancy",
        "Chunk overlap percentage",
      ],
      correctIndex: 1,
      explanation:
        "Faithfulness (groundedness) checks alignment between the answer and provided context. Context recall focuses on whether needed evidence was retrieved; answer relevancy focuses on addressing the question—both are related but distinct.",
      interviewNote:
        "If asked how to measure, mention LLM-judge prompts with rubrics or entailment models.",
    },
    {
      type: "true-false",
      id: "rag04-tf-ragas-human",
      statement:
        "Automated RAG metrics remove the need for any human review before production rollout.",
      correct: false,
      explanation:
        "Automated metrics accelerate iteration but can be blind to domain nuance, judge-model bias, and rare failure modes. Human evaluation on critical slices remains a best practice for high-risk applications.",
      interviewNote:
        "Accenture-style clients often expect governance language—cite sampling and sign-off.",
    },
    {
      type: "ordering",
      id: "rag04-ord-debug",
      question:
        "You see high faithfulness but wrong answers. Order these debugging steps sensibly (first → last).",
      items: [
        "Check whether retrieved contexts actually contain supporting evidence (context recall)",
        "Verify the user question is preserved correctly end-to-end (logging)",
        "Tune generation prompt or model if retrieval is already correct",
        "Inspect chunking and query transformation if evidence is missing from top-k",
      ],
      correctOrder: [1, 0, 3, 2],
      explanation:
        "First confirm logging and question fidelity, then diagnose retrieval coverage (recall). If chunks are wrong, fix chunking/query path. If retrieval is good but answers wrong, shift to generation-side fixes.",
      interviewNote:
        "Narrate the hypothesis-driven flow aloud in live interviews.",
    },
    {
      type: "scenario",
      id: "rag04-sc-self-rag",
      scenario:
        "Stakeholders want the assistant to refuse when documents do not contain an answer, but the model still fabricates policy details on empty retrieval.",
      question:
        "Name two mitigations spanning retrieval and generation, without changing the base model weights.",
      sampleAnswer:
        "Generation: add a strict prompt to answer only from context and output a fixed \"no sufficient evidence\" when chunks are empty or below a similarity threshold. Retrieval: add a confidence gate or self-RAG critique step that re-queries or stops when retrieval scores are weak; log those cases for chunking improvements.",
      keyPoints: [
        "Explicit abstention policy in the prompt.",
        "Similarity or score thresholds on retrieval.",
        "Optional critique/second pass (self-RAG style).",
      ],
      interviewNote:
        "Mention user-facing UX for \"I don't know\" with suggested next steps.",
    },
    {
      type: "code-completion",
      id: "rag04-cc-import",
      question:
        "Complete the import line for the RAGAS metric that measures whether the answer stays grounded in the retrieved contexts.",
      codeTemplate: `from ragas.metrics import ________`,
      language: "python",
      correctAnswer: "faithfulness",
      acceptableAnswers: [],
      explanation:
        "faithfulness is the RAGAS metric associated with groundedness in context. (You often import several metrics together in real scripts.)",
      interviewNote:
        "If package APIs change, emphasize you verify imports from current docs—concept matters most.",
    },
  ],
};
