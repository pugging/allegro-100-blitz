import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rest-api-04",
  skillId: "rest-api",
  order: 4,
  title: "API-аутентификация и безопасность",
  subtitle:
    "Ключи API, OAuth 2.0, структура JWT, токены Bearer, CORS, ограничения скорости, проверка, HTTPS и риски API в стиле OWASP — то, что интервьюеры ожидают от инженера младшего и среднего уровня в клиентских проектах.",
  estimatedMinutes: 15,
  objectives: [
    "Сравните ключи API, потоки авторизации OAuth 2.0 и аутентификацию носителя на основе JWT.",
    "Объясните поведение CORS на высоком уровне и почему браузеры его применяют.",
    "Перечислите основные элементы управления: HTTPS, проверку ввода, ограничение скорости и области с наименьшими привилегиями.",
    "Распознавайте риски BOLA/IDOR и внедрения в системах GenAI с большим количеством API.",
  ],
  content: [
    {
      type: "text",
      content:
        "Защита API не подлежит обсуждению, если службы используют **PII**, **подсказки модели** или **выставление счетов**. Аутентификация подтверждает, **кто** звонит; авторизация решает **что** они могут делать. Транспортная безопасность (TLS), проверка и контроль злоупотреблений (ограничения скорости) дополняют базовую основу для общедоступной и партнерской интеграции, включая агентов, вызывающих инструменты от имени пользователя.",
    },
    {
      type: "heading",
      level: 2,
      content: "API keys",
    },
    {
      type: "text",
      content:
        "**Ключи API** идентифицируют проект или арендатора. Простота интеграции (X-API-Key или параметр запроса — предпочитают заголовки). Слабые стороны: долгоживущие секреты, грубая авторизация, легкость утечки в клиентском коде. Используйте ключи для вызовов **сервер-сервер**; вращение и область действия для каждой среды (dev/stage/prod).",
    },
    {
      type: "code",
      language: "python",
      filename: "requests_api_key.py",
      code: `import os
import requests

API_KEY = os.environ["ACME_API_KEY"]  # never commit real keys
resp = requests.get(
    "https://api.acme.com/v1/models",
    headers={"X-API-Key": API_KEY},
    timeout=30,
)
resp.raise_for_status()`,
    },
    {
      type: "heading",
      level: 2,
      content: "OAuth 2.0 (conceptual)",
    },
    {
      type: "diagram",
      alt: "Simplified authorization code flow with user, client, authorization server, resource server",
      content:
        "sequenceDiagram\n  participant U as User\n  participant C as Client App\n  participant A as Auth Server\n  participant R as Resource API\n  U->>C: Use feature\n  C->>A: Redirect to authorize (scopes)\n  U->>A: Login + consent\n  A->>C: Authorization code\n  C->>A: Exchange code + client secret for tokens\n  A->>C: Access token (optional refresh)\n  C->>R: API call with Bearer access token\n  R->>C: Protected data",
    },
    {
      type: "text",
      content:
        "**OAuth 2.0** delegates access without sharing passwords. The **authorization code** flow (with PKCE for public clients) is standard for user-delegated access. **Scopes** limit what tokens can do. **Refresh tokens** obtain new access tokens without re-prompting—store them securely server-side.",
    },
    {
      type: "heading",
      level: 2,
      content: "JWT structure (Bearer tokens)",
    },
    {
      type: "text",
      content:
        "A **JSON Web Token** is `header.payload.signature`, Base64URL-encoded. The **payload** holds claims (`sub`, `exp`, `iss`, `aud`, scopes). **Anyone can read** the payload—do not put secrets inside. Verify **signature** (symmetric HS* or asymmetric RS/ES) and **exp/nbf**, enforce **audience** and **issuer**, and prefer short lifetimes. APIs expect `Authorization: Bearer <jwt>`.",
    },
    {
      type: "code",
      language: "text",
      filename: "jwt_concept.txt",
      code: `Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJ1c2VyLTEyMyIsImV4cCI6MTcxMzAwMDAwMCwic2NwIjpbInJlYWQ6ZG9jcyJdfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    },
    {
      type: "callout",
      variant: "danger",
      title: "Do not trust the payload alone",
      content:
        "Parsing the JWT JSON without cryptographic verification enables **alg:none** or forged tokens. Always validate with the library and keys from the issuer.",
    },
    {
      type: "heading",
      level: 2,
      content: "CORS",
    },
    {
      type: "text",
      content:
        "**Cross-Origin Resource Sharing** lets browsers permit `fetch`/`XHR` from one origin to another when the **server** returns appropriate `Access-Control-*` headers. **Simple requests** may succeed; others trigger **preflight** `OPTIONS`. CORS is a **browser** control—non-browser clients (Python, curl) ignore it. Misconfigured `Access-Control-Allow-Origin: *` with credentials is a red flag.",
    },
    {
      type: "heading",
      level: 2,
      content: "Rate limiting & abuse protection",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Per-IP, per-API-key, or per-user token buckets / leaky buckets",
        "Return **429** with `Retry-After` when possible",
        "Pair with WAF/API gateway rules and anomaly detection for LLM endpoints (cost spikes)",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Input validation",
    },
    {
      type: "text",
      content:
        "Treat every input as hostile: path ids, query strings, JSON bodies, and headers. Use **schema validation** (Pydantic), reject unknown fields when appropriate, enforce size limits, and normalize encodings. For GenAI, also consider **prompt injection** as logical abuse—not fixed by SQL escaping alone.",
    },
    {
      type: "heading",
      level: 2,
      content: "HTTPS everywhere",
    },
    {
      type: "text",
      content:
        "TLS protects confidentiality and integrity on the wire. Terminate TLS at a gateway or load balancer; enforce **HSTS** for browsers; use modern cipher suites. Internal service meshes may add mTLS for east-west traffic.",
    },
    {
      type: "heading",
      level: 2,
      content: "Common API vulnerabilities (API Top 10 awareness)",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**BOLA / IDOR** — Broken object level authorization: guessing another user’s `{id}` in `/users/{id}/orders` and succeeding. Fix with **server-side checks** tying resource to authenticated principal.",
        "**Injection** — SQL/NoSQL/OS command injection via unsanitized inputs. Use parameterized queries and strict schemas.",
        "**Excessive data exposure** — Returning entire ORM objects; filter fields per role.",
        "**Unrestricted resource consumption** — Huge payloads or expensive queries; cap limits and stream thoughtfully.",
      ],
    },
    {
      type: "tip",
      content:
        "In Accenture-style client work, mention **OWASP API Security Top 10** by name and give one example from a recent API you designed or consumed.",
    },
    {
      type: "callout",
      variant: "success",
      title: "FastAPI security building blocks",
      content:
        "Use `Depends` with reusable security schemes (`HTTPBearer`, OAuth2PasswordBearer), centralize scope checks, and return **401** vs **403** consistently. Keep secrets in vaults or managed identity—not `.env` committed to git.",
    },
  ],
  keyTakeaways: [
    "Authenticate callers; authorize every resource access—especially ID-based routes (BOLA).",
    "OAuth 2.0 delegates user access; JWTs carry claims but must be verified, not just decoded.",
    "CORS protects browsers; combine with CSRF protections for cookie-based web apps.",
    "Validate inputs with schemas; rate-limit and monitor for cost and abuse on AI endpoints.",
    "HTTPS + least privilege + structured logging (without secrets) form a credible security baseline.",
  ],
  interviewTips: [
    "Differentiate **authentication vs authorization** in one sentence when asked.",
    "Mention **PKCE** when OAuth comes up for SPAs/mobile clients.",
    "For JWT: signature verification, `exp`, `aud`, `iss`, and short TTLs.",
    "Relate **BOLA** to multi-tenant GenAI apps where document ids might leak across tenants.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "rest-api-04-mc-cors",
      question:
        "Which statement about CORS is most accurate?",
      options: [
        "CORS blocks Python requests unless you add special headers in urllib",
        "CORS is enforced by browsers; servers advertise allowed origins via Access-Control-* headers",
        "CORS replaces the need for authentication tokens",
        "CORS guarantees end-to-end encryption of API payloads",
      ],
      correctIndex: 1,
      explanation:
        "CORS is a browser security mechanism; server headers define policy. Server-side clients are not restricted by CORS.",
      interviewNote:
        "Shows you won’t blame ‘CORS’ for server-side integration bugs.",
    },
    {
      type: "ordering",
      id: "rest-api-04-order-jwt-verify",
      question:
        "Order the steps to safely use a JWT access token in an API gateway (conceptual verification pipeline).",
      items: [
        "Parse token structure (header/payload/signature segments)",
        "Verify cryptographic signature with issuer’s public key or shared secret",
        "Validate time-based claims (exp, nbf) and issuer/audience",
        "Map scopes/roles to authorization decision for the requested route",
      ],
      correctOrder: [0, 1, 2, 3],
      explanation:
        "Structure first, then crypto, then standard claims, then app-specific authz—skipping verification invites token forgery.",
      interviewNote:
        "If asked, note JWKS rotation for fetching public keys.",
    },
    {
      type: "true-false",
      id: "rest-api-04-tf-jwt-pci",
      statement:
        "Because JWT payloads are signed, it is safe to store credit card numbers inside the payload as long as the token is sent over HTTPS.",
      correct: false,
      explanation:
        "Signing proves integrity (and issuer) but the payload is readable by anyone holding the token; never place PCI or secrets in JWT claims.",
      interviewNote:
        "Demonstrates understanding of confidentiality vs integrity.",
    },
    {
      type: "code-completion",
      id: "rest-api-04-cc-bearer",
      question:
        "Complete the headers dict to send a Bearer JWT from the environment variable `ACCESS_TOKEN`.",
      codeTemplate: `import os
import requests

token = os.environ["ACCESS_TOKEN"]
requests.get(
    "https://api.example.com/v1/me",
    headers={
        # TODO: Authorization Bearer header using token
    },
    timeout=15,
)`,
      language: "python",
      correctAnswer: '"Authorization": f"Bearer {token}"',
      acceptableAnswers: [
        '"Authorization": "Bearer " + token',
        "'Authorization': f'Bearer {token}'",
      ],
      explanation:
        "OAuth bearer tokens use the Authorization header with the Bearer scheme—standard for protected REST calls.",
      interviewNote:
        "Mention stripping newlines if tokens are pasted from files.",
    },
    {
      type: "scenario",
      id: "rest-api-04-scenario-bola",
      scenario:
        "A RAG service returns documents by `GET /v1/documents/{doc_id}`. Authenticated users pass a JWT. QA notices that swapping `doc_id` in the URL shows another customer’s contract when they guess UUIDs.",
      question:
        "What went wrong and what fixes would you propose?",
      sampleAnswer:
        "This is **BOLA/IDOR**: authentication exists but **authorization** on the object is missing or incorrect. Fix by resolving `doc_id` to a tenant/user principal from the token, enforcing **row-level checks** in the data layer (e.g., WHERE tenant_id = :tenant), returning **404** (not 403) to avoid leaking existence if policy requires, adding **UUIDs** plus rate limits only as defense-in-depth, and auditing access. Add automated tests that user A cannot read user B’s ids.",
      keyPoints: [
        "Authn without authz on resources",
        "Tenant-scoped queries",
        "Tests for horizontal privilege escalation",
      ],
      interviewNote:
        "OWASP API1 (BOLA) is a flagship answer for 2024+ API security interviews.",
    },
  ],
};
