import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rest-api-02",
  skillId: "rest-api",
  order: 2,
  title: "ОТДЫХ Архитектура и дизайн",
  subtitle:
    "Ограничения, моделирование ресурсов, отображение CRUD, управление версиями, HATEOAS, идемпотентность и модель зрелости Ричардсона — как рассуждать об API, как инженер-разработчик.",
  estimatedMinutes: 15,
  objectives: [
    "Расскажите об архитектурных ограничениях REST и о том, что они дают вам в распределенных системах.",
    "Называйте ресурсы существительными, сопоставляйте CRUD с методами HTTP и выбирайте JSON или XML с компромиссами.",
    "Объясните стратегии управления версиями API и идею HATEOAS.",
    "Примените идемпотентность и модель зрелости Ричардсона для оценки реальных API.",
  ],
  content: [
    {
      type: "text",
      content:
        "**REST** (Передача репрезентативного состояния) описывает ограничения, которые делают сетевые системы масштабируемыми и развиваемыми. Диссертация Роя Филдинга формализовала их; На практике команды создают **ресурсо-ориентированные HTTP API** с согласованными кодами состояния и представлениями (часто в формате JSON), которые клиенты и агенты ИИ могут предсказуемо использовать.",
    },
    {
      type: "heading",
      level: 2,
      content: "Основные ограничения REST (практический взгляд)",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Клиент-сервер** — Разделение задач: пользовательский интерфейс/агенты развиваются независимо от служб данных.",
        "**Stateless** — каждый запрос содержит весь контекст (аутентификация, идентификаторы); сервер не сохраняет состояние *сессии* между вызовами. (С данными сервера в базах данных все в порядке.)",
        "**Кэшируемый** — ответы можно пометить как кэшируемые для снижения нагрузки, что важно для слоев извлечения с большим объемом чтения.",
        "**Единый интерфейс** — ресурсы, идентифицируемые с помощью URI, манипуляции с помощью представлений, самоописательные сообщения, **HATEOAS** необязательный в чистой теории, но редко встречающийся в API JSON.",
        "**Многоуровневая система**. Клиенты не могут определить, обращаются ли они к серверу приложений, шлюзу или кешу. Включает прокси-серверы и CDN.",
        "**Код по требованию (необязательно)** — сервер может расширять поведение клиента (редко для API JSON; больше ориентировано на веб-страницы).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Безгражданство и GenAI",
      content:
        "*Память разговоров* чат-бота — это сохраняемое вами состояние приложения (БД, кеш, контрольная точка LangGraph), а не привязка HTTP-сессии к балансировщику нагрузки. Каждый вызов инструмента/API должен включать идентификаторы, необходимые серверу.",
    },
    {
      type: "heading",
      level: 2,
      content: "Соглашения об именах ресурсов",
    },
    {
      type: "text",
      content:
        "В путях моделируйте **существительные** (ресурсы), а не **глаголы**. Предпочитайте коллекции во множественном числе: `/users`, `/users/{id}/orders`. Используйте субресурсы для сдерживающих отношений; параметры запроса для фильтрации, сортировки и разреженных наборов полей.",
    },
    {
      type: "code",
      language: "text",
      filename: "uri_examples.txt",
      code: `GET    /api/v1/knowledge-bases
GET    /api/v1/knowledge-bases/{kb_id}
GET    /api/v1/knowledge-bases/{kb_id}/documents
POST   /api/v1/knowledge-bases/{kb_id}/documents
GET    /api/v1/documents?tag=finance&sort=updated_at`,
    },
    {
      type: "tip",
      content:
        "Avoid `/getUser` or `/createOrder` RPC-style paths in REST interviews unless the interviewer explicitly compares REST vs RPC (gRPC, GraphQL).",
    },
    {
      type: "heading",
      level: 2,
      content: "CRUD mapping",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Create — `POST /collection` (server assigns id) or `PUT /collection/{id}` when client supplies id",
        "Read — `GET /collection/{id}` or `GET /collection`",
        "Update (full) — `PUT /collection/{id}`",
        "Update (partial) — `PATCH /collection/{id}`",
        "Delete — `DELETE /collection/{id}`",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "JSON vs XML",
    },
    {
      type: "text",
      content:
        "**JSON** is the default for modern APIs: browser-native, compact, maps cleanly to Python dicts and Pydantic models. **XML** still appears in enterprise SOAP/legacy integrations—strong schema (XSD), tooling for signatures. For new GenAI services, default to JSON unless a standard (e.g., SAML) requires XML.",
    },
    {
      type: "heading",
      level: 2,
      content: "API versioning",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**URI path** — `/v1/users` (visible, easy to route; can clutter resource design).",
        "**Header** — `Accept: application/vnd.company.v2+json` (clean URIs; harder for humans testing in browser).",
        "**Query** — `?version=2` (simple; easy to forget in clients).",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Breaking changes",
      content:
        "Renaming fields, changing types, or redefining status semantics are breaking—bump version or use additive changes with feature flags. AI clients parsing JSON are brittle to silent schema drift.",
    },
    {
      type: "heading",
      level: 2,
      content: "HATEOAS in one minute",
    },
    {
      type: "text",
      content:
        "**Hypermedia as the Engine of Application State** means responses include links to next valid actions (like HTML forms). Example JSON style: `{ \"id\": 1, \"_links\": { \"self\": { \"href\": \"/orders/1\" }, \"cancel\": { \"href\": \"/orders/1/cancel\" } } }`. Most internal JSON APIs skip full HATEOAS; public hypermedia APIs (HAL, JSON-LD) use it more. Know the concept for interviews even if you rarely implement it.",
    },
    {
      type: "heading",
      level: 2,
      content: "Idempotency",
    },
    {
      type: "text",
      content:
        "An operation is **idempotent** if repeating it with the same inputs leaves the resource in the same state (e.g., PUT with full body, DELETE). **POST** create is generally *not* idempotent without a server-side idempotency key. Payment and LLM job-creation endpoints often accept **Idempotency-Key** headers to deduplicate retries.",
    },
    {
      type: "heading",
      level: 2,
      content: "Richardson Maturity Model",
    },
    {
      type: "diagram",
      alt: "Four levels from POX to hypermedia-driven REST",
      content:
        "flowchart TB\n  L0[Level 0: POX - single POST tunnel]\n  L1[Level 1: Resources - many URIs]\n  L2[Level 2: HTTP verbs - proper methods + status codes]\n  L3[Level 3: Hypermedia - HATEOAS links]\n  L0 --> L1 --> L2 --> L3",
    },
    {
      type: "text",
      content:
        "**Level 0** — One URI, HTTP as transport (SOAP-style tunneling). **Level 1** — Multiple resources (nouns). **Level 2** — Verbs and status codes used meaningfully. **Level 3** — Hypermedia guides clients. Many production APIs sit at **Level 2** with good JSON schemas—that is still “RESTful enough” for most teams.",
    },
  ],
  keyTakeaways: [
    "REST’s value is constraints: stateless requests, uniform interfaces, cacheability, layering.",
    "Design around resources and relationships; express actions as sub-resources or domain events when needed.",
    "Version deliberately; prefer additive JSON changes when you can.",
    "Idempotency matters for retries—especially for POST that triggers side effects.",
    "Richardson levels help you critique APIs without dogma.",
  ],
  interviewTips: [
    "Contrast **REST** with **RPC/gRPC** in one sentence: resources+HTTP vs procedures+efficient binary.",
    "Mention **OpenAPI** as the contract between teams and as input for agent tool schemas.",
    "If asked about GraphQL, note **over/under-fetching** trade-offs vs REST resource granularity.",
  ],
  exercises: [
    {
      type: "true-false",
      id: "rest-api-02-tf-stateless-db",
      statement:
        "In a strictly stateless REST design, the server must not store any data in a database between requests.",
      correct: false,
      explanation:
        "Stateless means no *session* state tied to a connection on the server; persistent domain data in databases is normal and expected.",
      interviewNote:
        "Clarifying this separates junior confusion from middle-level understanding.",
    },
    {
      type: "multiple-choice",
      id: "rest-api-02-mc-richardson",
      question:
        "An API uses distinct URIs for users and orders and returns 404 for missing resources, but always responds 200 OK to POST /invokeAction with an XML payload. Which Richardson level best describes it?",
      options: [
        "Level 3 — Hypermedia-driven",
        "Level 2 — HTTP verbs and status codes used correctly",
        "Level 1 — Multiple resources but HTTP features underused",
        "Level 0 — Single URI tunnel",
      ],
      correctIndex: 2,
      explanation:
        "Multiple URIs suggest at least Level 1, but misusing 200 for all POST outcomes means HTTP verbs/status codes are not used as Level 2 expects.",
      interviewNote:
        "Shows you judge APIs by behavior, not buzzwords.",
    },
    {
      type: "code-completion",
      id: "rest-api-02-cc-idempotency",
      question:
        "Fill in the header name commonly used by APIs so a retried POST create is deduplicated server-side.",
      codeTemplate: `import requests

headers = {
    "Content-Type": "application/json",
    # TODO: add idempotency header with value "job-2026-0413-001"
}
requests.post("https://api.example.com/v1/jobs", json={"type": "embed"}, headers=headers)`,
      language: "python",
      correctAnswer: '"Idempotency-Key": "job-2026-0413-001"',
      acceptableAnswers: [
        "'Idempotency-Key': 'job-2026-0413-001'",
        '"Idempotency-Key":"job-2026-0413-001"',
      ],
      explanation:
        "Stripe and many internal platforms standardize on Idempotency-Key for safe retries of non-idempotent POST.",
      interviewNote:
        "Link to observability: log the key, not full payloads, for support.",
    },
    {
      type: "ordering",
      id: "rest-api-02-order-crud",
      question:
        "Order these HTTP method intents from most read-only / safe (top) to most likely to create new server-side state on each call (bottom).",
      items: ["GET /reports/summary", "DELETE /sessions/abc", "POST /inference/jobs", "PUT /configs/default"],
      correctOrder: [0, 3, 1, 2],
      explanation:
        "GET is safe read. PUT replaces known resource (idempotent, state-changing but not ‘new id’ each time). DELETE removes (idempotent in effect). POST often creates new job records—least safe to repeat without keys.",
      interviewNote:
        "If challenged, acknowledge PATCH variability and API-specific semantics.",
    },
    {
      type: "scenario",
      id: "rest-api-02-scenario-search-post",
      scenario:
        "Your squad exposes `/search` as POST with a JSON body because queries are long and complex. A reviewer says “REST means GET only for reads.”",
      question:
        "How do you respond with trade-offs and a pragmatic recommendation?",
      sampleAnswer:
        "Acknowledge REST prefers GET for safe, cacheable reads when queries fit in URL limits and do not expose sensitive data in logs. For large structured queries, POST is common (sometimes called ‘search via POST’); mitigate with explicit documentation, stable schemas, and optional GET for simple cases. If caching matters, consider GET with compressed query encoding or a two-step POST-to-redirect pattern—trade complexity vs cache hit rates.",
      keyPoints: [
        "REST is guidance; operational constraints exist",
        "GET leakage and URL length matter",
        "Document and version the search contract",
      ],
      interviewNote:
        "Consulting interviews reward balanced trade-off answers over dogma.",
    },
  ],
};
