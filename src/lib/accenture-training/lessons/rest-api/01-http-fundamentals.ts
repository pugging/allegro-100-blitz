import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rest-api-01",
  skillId: "rest-api",
  order: 1,
  title: "HTTP Protocol Fundamentals",
  subtitle:
    "How the web really talks: requests, responses, methods, status codes, headers, and URLs—foundation for every API you will build or call from GenAI services.",
  estimatedMinutes: 15,
  objectives: [
    "Explain the HTTP request/response cycle and the role of clients, servers, and intermediaries.",
    "Choose appropriate HTTP methods and interpret common status code families.",
    "Use headers, query parameters, and message bodies correctly when designing or consuming APIs.",
    "Read and construct well-formed URLs and simple raw HTTP messages for debugging.",
  ],
  content: [
    {
      type: "text",
      content:
        "HTTP (Hypertext Transfer Protocol) is the application-layer protocol most REST APIs use. A **client** (browser, mobile app, Python script, or an LLM tool-calling layer) sends a **request**; a **server** returns a **response**. Understanding this cycle is essential when you integrate models with search APIs, vector stores, or internal microservices at scale.",
    },
    {
      type: "heading",
      level: 2,
      content: "The request/response cycle",
    },
    {
      type: "diagram",
      alt: "Client sends HTTP request to server; server returns HTTP response",
      content:
        "flowchart LR\n  Client[Client] -->|HTTP Request| Server[Server]\n  Server -->|HTTP Response| Client",
    },
    {
      type: "text",
      content:
        "Each **HTTP request** has a method, a target (path + optional query on the server), protocol version, and headers; it may include a **body** (payload). The **response** has a status line (version, status code, reason phrase), headers, and often a body (HTML, JSON, image bytes, etc.). Proxies, load balancers, and CDNs may sit in the middle but preserve this model.",
    },
    {
      type: "callout",
      variant: "info",
      title: "REST vs HTTP",
      content:
        "REST is an *architectural style* for APIs; HTTP is the *transport*. You can use HTTP without being fully RESTful, but most REST APIs you meet are HTTP/JSON.",
    },
    {
      type: "heading",
      level: 2,
      content: "HTTP methods",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**GET** — Retrieve a resource. Should not change server state. Safe for caching when indicated by headers.",
        "**POST** — Create a resource or trigger a process. Body usually carries the input; server assigns IDs or side effects.",
        "**PUT** — Replace a resource at a known URI (full representation). Often treated as idempotent.",
        "**PATCH** — Partial update; only changed fields. Semantics vary by API—always read the docs.",
        "**DELETE** — Remove a resource. Typically idempotent (repeating yields the same end state).",
      ],
    },
    {
      type: "tip",
      content:
        "In interviews, tie methods to **intent** and **side effects**: GET for reads, POST for non-idempotent creates/actions, PUT/PATCH for updates, DELETE for removal. Mention that some APIs misuse POST for everything—know the difference between ideal design and legacy reality.",
    },
    {
      type: "heading",
      level: 2,
      content: "Status codes (families)",
    },
    {
      type: "text",
      content:
        "Status codes are three-digit numbers grouped by the first digit. Clients and intermediaries use them to decide retries, caching, and error handling.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**2xx Success** — 200 OK (generic success), 201 Created (resource created), 204 No Content (success with empty body).",
        "**3xx Redirection** — 301/308 permanent, 302/307 temporary; clients may follow Location header.",
        "**4xx Client errors** — 400 Bad Request, 401 Unauthorized (authentication), 403 Forbidden (authorized identity but no permission), 404 Not Found, 409 Conflict, 429 Too Many Requests.",
        "**5xx Server errors** — 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable (often with Retry-After).",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "401 vs 403",
      content:
        "Rough rule: **401** = “who are you?” (missing/invalid credentials). **403** = “I know who you are; you cannot do this.” Interviewers like this distinction for API gateways and OAuth-protected LLM endpoints.",
    },
    {
      type: "heading",
      level: 2,
      content: "Headers that matter every day",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Content-Type** — MIME type of the body (e.g. `application/json`; form posts use `application/x-www-form-urlencoded` or `multipart/form-data`).",
        "**Accept** — What representation the client prefers (`application/json`, `text/html`).",
        "**Authorization** — Credentials (e.g. `Bearer <token>`, `Basic ...`). Never log full tokens in production.",
        "**User-Agent** — Identifies the client (browsers send rich strings; scripts often set a project name).",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Query parameters vs request body",
    },
    {
      type: "text",
      content:
        "**Query string** appears after `?` in the URL (`/search?q=rag&limit=10`). Good for filters, pagination, and cacheable reads. **Body** carries larger or structured data (JSON for POST/PUT/PATCH). Sensitive data should not live in query strings (URLs leak via logs and Referer headers).",
    },
    {
      type: "code",
      language: "python",
      filename: "requests_example.py",
      code: `import requests

# Query params: visible in URL, suitable for GET filters
resp = requests.get(
    "https://api.example.com/v1/documents",
    params={"q": "contract", "page": 1, "page_size": 20},
    headers={"Accept": "application/json"},
    timeout=30,
)
resp.raise_for_status()
print(resp.status_code, resp.headers.get("Content-Type"))
print(resp.json())

# JSON body: typical for POST creates
payload = {"title": "SOW", "owner": "team-genai"}
create = requests.post(
    "https://api.example.com/v1/documents",
    json=payload,
    headers={"Content-Type": "application/json"},
    timeout=30,
)
create.raise_for_status()`,
    },
    {
      type: "heading",
      level: 2,
      content: "URL structure",
    },
    {
      type: "text",
      content:
        "A URL has a **scheme** (`https`), **authority** (host + optional port), **path** (`/v1/users/42`), optional **query**, and **fragment** (`#section`—usually client-side, not sent to server in HTTP). API design often versions in the path (`/v1/...`) or via headers—be ready to discuss trade-offs briefly.",
    },
    {
      type: "code",
      language: "http",
      filename: "raw_request.txt",
      code: `GET /v1/users/42/orders?status=open HTTP/1.1
Host: shop.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOi...`,
    },
    {
      type: "callout",
      variant: "success",
      title: "GenAI connection",
      content:
        "When your agent calls a retrieval or embeddings API, you are still doing HTTP: method + URL + headers + optional JSON body. Timeouts, retries on 429/503, and parsing JSON errors are the same skills as for any REST integration.",
    },
  ],
  keyTakeaways: [
    "HTTP pairs requests (method, URL, headers, optional body) with responses (status, headers, body).",
    "Match methods to intent; know idempotency and when GET must stay side-effect free.",
    "Interpret 2xx/3xx/4xx/5xx at a glance and choose retries vs client fixes.",
    "Use query params for filters on reads; put structured or sensitive data in the body with correct Content-Type.",
    "URLs decompose into scheme, host, path, query, and fragment—design affects caching and logging.",
  ],
  interviewTips: [
    "Give a crisp 30-second walkthrough of a GET vs POST call, including where parameters live.",
    "Mention **timeouts** and **status-based retries** when discussing production API clients (relevant for LLM orchestration).",
    "If asked about caching, tie **GET + cache headers** (Cache-Control, ETag) to safe reads.",
    "Relate **429** to rate limits on third-party model or search APIs and backoff strategies.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "rest-api-01-mc-methods",
      question:
        "You need to fetch a paginated list of documents from a REST API without changing server state. Which method is most appropriate?",
      options: ["POST", "GET", "PUT", "PATCH"],
      correctIndex: 1,
      explanation:
        "GET is for safe retrieval. Pagination and filters belong in the query string (or occasionally headers), not as a state-changing operation.",
      interviewNote:
        "Shows you default to REST semantics instead of tunneling everything through POST.",
    },
    {
      type: "code-completion",
      id: "rest-api-01-cc-requests-get",
      question:
        "Complete the `requests.get` call so the request includes an `Authorization: Bearer <token>` header and a 15-second timeout.",
      codeTemplate: `import requests

TOKEN = "replace-me"
url = "https://api.example.com/v1/profile"
resp = requests.get(
    url,
    # TODO: add headers dict with Bearer token and timeout=15
)
resp.raise_for_status()`,
      language: "python",
      correctAnswer: `headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15`,
      acceptableAnswers: [
        'headers={"Authorization": "Bearer " + TOKEN}, timeout=15',
        "headers={'Authorization': f'Bearer {TOKEN}'}, timeout=15",
      ],
      explanation:
        "Pass `headers` for auth metadata; always set a finite `timeout` so agents and batch jobs do not hang forever.",
      interviewNote:
        "Mention never hardcoding real tokens—use environment variables or a secret store in real systems.",
    },
    {
      type: "ordering",
      id: "rest-api-01-order-lifecycle",
      question:
        "Order these steps in a typical successful HTTP/1.1 request/response round trip (client perspective).",
      items: [
        "Client opens (or reuses) a TCP connection to host:port",
        "Client sends request line, headers, optional body",
        "Server processes and returns status line, headers, optional body",
        "Client parses status code and body (e.g. JSON decode)",
      ],
      correctOrder: [0, 1, 2, 3],
      explanation:
        "Transport comes first, then request, then response processing. HTTP/2 multiplexes streams but the logical sequence is the same.",
      interviewNote:
        "You can briefly note HTTP/2 frames vs HTTP/1.1 text if the interviewer goes deeper.",
    },
    {
      type: "true-false",
      id: "rest-api-01-tf-301-body",
      statement:
        "A 301 Moved Permanently response always includes a JSON body describing the new location.",
      correct: false,
      explanation:
        "301 responses often have a small HTML body or empty body; clients should follow the Location header. APIs may return JSON, but it is not required by the status code itself.",
      interviewNote:
        "Demonstrates you read specs pragmatically, not from assumptions.",
    },
    {
      type: "scenario",
      id: "rest-api-01-scenario-retries",
      scenario:
        "Your GenAI batch job calls an external embeddings API. Roughly 2% of calls return HTTP 503 with no Retry-After header, while 98% return 200 with JSON.",
      question:
        "How would you handle this at the HTTP layer before giving up? What would you log?",
      sampleAnswer:
        "Use a bounded retry with exponential backoff and jitter on 503 (and optionally 502), cap total attempts, and fail the batch item with context if still failing. Log correlation id, endpoint, attempt count, latency, and status—not response bodies that may contain sensitive text. Respect 429 if it appears by backing off more aggressively.",
      keyPoints: [
        "Retries belong in client design for transient 5xx",
        "Backoff + jitter avoids thundering herds",
        "Avoid logging secrets or full payloads",
      ],
      interviewNote:
        "Tie answer to production SLOs and idempotent retry safety for POST if applicable.",
    },
  ],
};
