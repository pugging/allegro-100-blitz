import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "prompt-engineering-04",
  skillId: "prompt-engineering",
  order: 4,
  title: "Оценка и итерация",
  subtitle:
    "Сделайте быстрые изменения измеримыми: «золотые наборы», A/B-тесты, судьи LLM, человеческие критерии и управление версиями, которое сохраняется при обновлении модели.",
  estimatedMinutes: 13,
  objectives: [
    "Определите показатели оперативного качества, выходящие за рамки субъективных «вибраций».",
    "Разрабатывайте эксперименты A/B и подсказывайте рабочие процессы управления версиями, подходящие для команд.",
    "Используйте LLM в качестве судьи осторожно, используя контроль предвзятости и выборочные проверки людьми.",
    "Отладка распространенных режимов сбоев и подключение подсказок к корпоративным библиотекам подсказок.",
  ],
  content: [
    {
      type: "text",
      content:
        "Доставка подсказок без оценки подобна внедрению непроверенных бизнес-правил. Для доставки в стиле Accenture вам нужны **повторяемые** методы: помеченные наборы данных, автоматические оценщики, наборы регрессионных методов и журналы изменений, привязанные к версиям модели.",
    },
    {
      type: "heading",
      level: 2,
      content: "Измерение оперативного качества",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Точность задания**: точное совпадение, F1 на ярлыках или семантическое сходство с эталонными ответами.",
        "**Соблюдение ограничений:** процент прохождения схемы JSON, проверка запрещенных фраз, соответствие максимальной длине.",
        "**Задержка и стоимость.** Токены за запрос после изменения приглашения — длинные запросы суммируются в масштабе.",
        "**Безопасность.** Частота нарушений правил в состязательном наборе тестов.",
      ],
    },
    {
      type: "tip",
      content:
        "Начните с **20–50** разнообразных золотых футляров, а затем масштабируйте их до сотен — ширина лучше, чем полировка дубликатов.",
    },
    {
      type: "heading",
      level: 2,
      content: "Подсказки для A/B-тестирования",
    },
    {
      type: "text",
      content:
        "Направьте небольшой процент трафика на **подсказку варианта B**, сохраните константу модели и извлечения и сравните показатели. Обратите внимание на **парадокс Симпсона**: совокупная прибыль может скрыть регресс в регионе или линейке продуктов — срезайте результаты.",
    },
    {
      type: "callout",
      variant: "success",
      title: "Checklist",
      content:
        "Та же версия модели, та же температура, тот же снимок индекса поиска, та же постобработка — меняется только текст подсказки, иначе вы не сможете атрибутировать эффекты.",
    },
    {
      type: "heading",
      level: 2,
      content: "Оценка LLM как судьи",
    },
    {
      type: "text",
      content:
        "Отдельная модель **судьи** оценивает полезность, правильность или стиль с помощью критериев. Быстрый и масштабируемый, но ориентированный на собственные предпочтения (**самопредвзятость**, если судья разделяет семейство генераторов). Смягчите ситуацию с помощью **слепых** сравнений, нескольких судей и периодической калибровки человеком.",
    },
    {
      type: "code",
      language: "text",
      filename: "judge-rubric-snippet.txt",
      code: `You are an impartial evaluator. Compare Answer A and Answer B to the QUESTION.

Rubric (0-5 each):
- Correctness vs. provided FACTS
- Completeness
- Clarity

Rules:
- Prefer answers that cite FACTS when applicable.
- Penalize invented details.

QUESTION: {{question}}
FACTS: {{facts}}
Answer A: {{a}}
Answer B: {{b}}

Output JSON: {"winner":"A|B|tie","scores":{"A":[c,co,cl],"B":[c,co,cl]},"rationale":"..."}`,
    },
    {
      type: "heading",
      level: 2,
      content: "Human evaluation rubrics",
    },
    {
      type: "text",
      content:
        "Experts score outputs on discrete scales with **anchor examples** (what a ‘3’ looks like). Use **dual annotation** on a subset for inter-rater reliability. Human eval is slower but essential for regulated domains and for calibrating automated judges.",
    },
    {
      type: "heading",
      level: 2,
      content: "Prompt versioning",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Store prompts in **git** with semantic tags (`prompts/triage@v1.4`).",
        "Record **model name + revision** alongside each tag—upgrades invalidate baselines.",
        "Attach **changelog entries**: what failure mode was fixed, which metrics moved.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Common failure patterns",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Lost in the middle:** Models underweight context buried mid-prompt—move critical rules to ends or repeat judiciously.",
        "**Format drift:** JSON fences or extra prose—tighten examples and add repair passes.",
        "**Overfitting few-shot:** Memorizes example entities—rotate synthetic examples.",
        "**Retrieval noise:** Bad chunks dominate—fix indexing, not only the prompt.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Debugging prompts",
    },
    {
      type: "text",
      content:
        "Binary-search your prompt: remove half the context—does failure persist? Swap a neutral instruction—does bias disappear? **Trace** tool calls and compare to expected APIs. Log **tokenized** prompts only under privacy review.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Enterprise prompt management",
      content:
        "Central libraries, access control, and approval workflows prevent ‘shadow prompts’ in Lambda env vars. Align with MLOps: promotion stages dev → staging → prod with automated regression gates.",
    },
    {
      type: "diagram",
      alt: "Feedback loop from production to golden set and prompt version bump",
      content: `flowchart LR
  Prod[Production traffic] --> Logs[Sampled logs]
  Logs --> Mine[Mine failures]
  Mine --> Gold[Golden / adversarial set]
  Gold --> Eval[Automated eval]
  Eval --> PR[Prompt PR + review]
  PR --> Prod`,
    },
  ],
  keyTakeaways: [
    "Evaluate prompts against golden sets and explicit metrics—not single demo threads.",
    "A/B tests need controlled variables; slice metrics to catch hidden regressions.",
    "LLM judges accelerate iteration but require bias awareness and human calibration.",
    "Version prompts with models and measure again after every upgrade.",
  ],
  interviewTips: [
    "Propose a minimal eval harness outline when asked ‘how would you test this?’",
    "Mention Simpson’s paradox and cohort slicing—signals statistical maturity.",
    "Acknowledge LLM judge limitations; pair with human spot checks.",
    "Connect prompt repos to CI: fail builds when schema pass rate drops.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "pe04-mc-ab",
      question:
        "You A/B test two prompts and see higher user thumbs-up on variant B, but schema-valid JSON drops from 98% to 91%. Model and temperature are identical. What is the best next step?",
      options: [
        "Ship B immediately because users liked it",
        "Investigate the JSON regression—user satisfaction may hide downstream breakage",
        "Raise temperature on variant A to match B",
        "Delete the evaluation suite to reduce noise",
      ],
      correctIndex: 1,
      explanation:
        "Thumbs-up can miss parser failures in integrated systems. Investigate which inputs fail schema, check if B adds prose around JSON, and fix format instructions or post-processing before shipping.",
      interviewNote:
        "Shows you protect API consumers, not only chat UX.",
    },
    {
      type: "code-completion",
      id: "pe04-cc-metric",
      question:
        "Fill in a standard information-retrieval metric name often reported alongside prompts in RAG evals (abbreviation is fine).",
      codeTemplate: `report = {
  "schema_pass_rate": 0.97,
  "________@5": 0.82,
}`,
      language: "json",
      correctAnswer: "recall",
      acceptableAnswers: ["recall", "Recall", "recall_at_5", "mrr", "MRR", "ndcg"],
      explanation:
        "Recall@k (and sometimes MRR/NDCG) measures whether the right documents or answers appear in the top ranks—common in RAG benchmarking alongside format metrics.",
      interviewNote:
        "Clarify what ‘relevant’ means in your golden set—interview depth marker.",
    },
    {
      type: "ordering",
      id: "pe04-ord-llm-judge",
      question:
        "Order these steps to **responsibly** introduce an LLM-as-judge into a weekly eval pipeline.",
      items: [
        "Run judge on all candidates automatically in CI",
        "Define rubric with anchor examples and pilot on 50 human-scored pairs",
        "Spot-check disagreements and adjust rubric or judge model",
        "Blind pairwise comparisons so judge does not see model names",
      ],
      correctOrder: [1, 3, 2, 0],
      explanation:
        "Pilot with humans + anchors → blind comparisons to reduce bias → calibrate on disagreements → only then scale to full automated judging in CI.",
      interviewNote:
        "Emphasize calibration before automation—mature MLOps answer.",
    },
    {
      type: "true-false",
      id: "pe04-tf-whitespace-ab",
      statement:
        "If two prompts differ only in whitespace, online A/B metrics will always be identical because tokenization removes all whitespace impact.",
      correct: false,
      explanation:
        "Whitespace can affect tokenization boundaries and occasional model behavior; more importantly, ‘identical metrics’ is not guaranteed for any change—always measure. Large whitespace changes can alter token counts and cost.",
      interviewNote:
        "Mention tokenization sensitivity—shows you understand inference details.",
    },
    {
      type: "scenario",
      id: "pe04-sc-model-upgrade",
      scenario:
        "The platform upgrades from GPT-4.x to a newer snapshot. Your golden-set accuracy jumps on summarization but drops on strict JSON extraction.",
      question:
        "How do you respond in a client-facing project?",
      sampleAnswer:
        "Freeze promotion until extraction regressions are triaged. Re-run the full suite with old vs. new snapshot side by side; categorize failures (extra prose, wrong keys). Adjust prompts (stronger delimiters, JSON mode), add repair parsing, or switch extraction to a smaller specialized model. Update version pins in config and document the change in the release log with new metric baselines.",
      keyPoints: [
        "Model upgrade ⇒ re-baseline all prompts.",
        "Separate tasks: summarization gains do not excuse extraction loss.",
        "Document metrics and mitigation for stakeholders.",
      ],
      interviewNote:
        "Demonstrates change management—critical in consulting delivery.",
    },
  ],
};
