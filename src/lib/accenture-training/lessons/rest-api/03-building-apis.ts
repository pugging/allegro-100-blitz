import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "rest-api-03",
  skillId: "rest-api",
  order: 3,
  title: "Создание API с помощью FastAPI и Flask",
  subtitle:
    "Поставка типизированных и документированных API-интерфейсов JSON на Python: FastAPI для скорости и OpenAPI; Flask для минимального количества стеков, а также Curl, HTTPie и Postman для проверки.",
  estimatedMinutes: 15,
  objectives: [
    "Загрузите приложение FastAPI с типизированными параметрами пути/запроса/тела и моделями ответов.",
    "Сравните минимальную маршрутизацию Flask с автоматической проверкой и документацией FastAPI.",
    "Тестируйте конечные точки с помощью коллекций Curl, HTTPie и Postman.",
    "Найдите и используйте документацию OpenAPI (Swagger), созданную на основе кода.",
  ],
  content: [
    {
      type: "text",
      content:
        "**FastAPI** использует подсказки типов Python и модели **Pydantic** для проверки запросов и ответов, а также генерирует метаданные **OpenAPI** для интерактивных документов. **Flask** — это легкий и гибкий инструмент, который часто встречается в существующих сервисах, при этом вы добавляете проверку вручную (например, Marshmallow) или сохраняете небольшие обработчики. Для новых микросервисов GenAI (извлечение, переранжирование, защитные фильтры) FastAPI является надежным стандартом.",
    },
    {
      type: "heading",
      level: 2,
      content: "Настройка FastAPI",
    },
    {
      type: "code",
      language: "bash",
      filename: "setup.sh",
      code: `python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install "fastapi[standard]" uvicorn`,
    },
    {
      type: "code",
      language: "python",
      filename: "main_fastapi.py",
      code: `from datetime import datetime
from typing import Optional

from fastapi import FastAPI, Path, Query, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI(title="API-интерфейс Accenture GenAI для стажеров", version="1.0.0")


class DocumentCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str
    tags: list[str] = Field(default_factory=list)


class DocumentOut(BaseModel):
    id: str
    title: str
    tags: list[str]
    created_at: datetime


FAKE_DB: dict[str, dict] = {}


@app.post("/v1/documents", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
def create_document(payload: DocumentCreate) -> DocumentOut:
    new_id = str(len(FAKE_DB) + 1)
    record = {
        "id": new_id,
        "title": payload.title,
        "tags": payload.tags,
        "content": payload.content,
        "created_at": datetime.utcnow(),
    }
    FAKE_DB[new_id] = record
    return DocumentOut.model_validate(record)


@app.get("/v1/documents/{doc_id}", response_model=DocumentOut)
def get_document(
    doc_id: str = Path(..., description="Идентификатор документа"),
    include_content: bool = Query(False, description="Не реализовано в этой демо-версии"),
) -> DocumentOut:
    if doc_id not in FAKE_DB:
        raise HTTPException(status_code=404, detail="Документ не найден")
    record = FAKE_DB[doc_id]
    if not include_content:
        # Still returns model without content field (response_model strips extras)
        return DocumentOut.model_validate(record)
    return DocumentOut.model_validate(record)


# Run: uvicorn main_fastapi:app --reload`,
    },
    {
      type: "callout",
      variant: "info",
      title: "OpenAPI docs",
      content:
        "With the app running, open `/docs` (Swagger UI) or `/redoc`. These pages list schemas, try-it-out forms, and curl snippets—valuable for QA, PMs, and agents that need structured tool definitions.",
    },
    {
      type: "heading",
      level: 2,
      content: "Flask comparison (minimal)",
    },
    {
      type: "code",
      language: "python",
      filename: "main_flask.py",
      code: `from flask import Flask, request, jsonify, abort

app = Flask(__name__)
STORE = {}


@app.post("/v1/documents")
def create_doc():
    body = request.get_json(silent=True) or {}
    title = body.get("title")
    if not title:
        abort(400, description="требуется название")
    doc_id = str(len(STORE) + 1)
    STORE[doc_id] = {"id": doc_id, "title": title, "content": body.get("content", "")}
    return jsonify(STORE[doc_id]), 201


@app.get("/v1/documents/<doc_id>")
def get_doc(doc_id: str):
    doc = STORE.get(doc_id)
    if not doc:
        abort(404)
    return jsonify(doc)


# Run: flask --app main_flask run --debug`,
    },
    {
      type: "tip",
      content:
        "In interviews, say: “Flask gives freedom; FastAPI gives **validation + docs for free**.” Mention you would add Pydantic or a schema library to Flask for parity.",
    },
    {
      type: "heading",
      level: 2,
      content: "Testing with curl, HTTPie, and Postman",
    },
    {
      type: "code",
      language: "bash",
      filename: "cli_tests.sh",
      code: `# curl — available everywhere
curl -sS -X POST "http://127.0.0.1:8000/v1/documents" \\
  -H "Тип контента: приложение/json" \\
  -d '{"title":"RAG spec","content":"...","tags":["genai"]}' | jq .

curl -sS "http://127.0.0.1:8000/v1/documents/1"

# httpie — readable syntax (pip install httpie)
http POST :8000/v1/documents title="RAG spec" content="..." tags:='["genai"]'
http GET :8000/v1/documents/1`,
    },
    {
      type: "text",
      content:
        "**Postman** and **Insomnia** help you save environments (base URL, auth tokens), chain requests, and export collections for teammates. For CI, you might reuse **OpenAPI** with **Schemathesis** or contract tests—mention awareness even if you have not run them yet.",
    },
    {
      type: "heading",
      level: 2,
      content: "Path vs query vs body (FastAPI recap)",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Path** — `/v1/documents/{doc_id}` → function parameter `doc_id`",
        "**Query** — `?q=text&limit=10` → parameters with defaults or `Query(...)`",
        "**Body** — Pydantic `BaseModel` parameter parses JSON and validates types",
      ],
    },
    {
      type: "callout",
      variant: "success",
      title: "Interview sound bite",
      content:
        "“I define Pydantic models for request/response, let FastAPI generate OpenAPI, and verify behavior with HTTPie plus automated tests hitting the running app or TestClient.”",
    },
  ],
  keyTakeaways: [
    "FastAPI + Pydantic gives validation, serialization, and OpenAPI from type hints.",
    "Flask stays relevant for simple services; add validation explicitly when inputs matter.",
    "Path, query, and body map cleanly to function parameters in FastAPI.",
    "Use curl/HTTPie for quick checks; Postman for shared environments and collections.",
    "Swagger UI at `/docs` accelerates onboarding and agent tool schema work.",
  ],
  interviewTips: [
    "Mention **TestClient** from `fastapi.testclient` for pytest-based API tests without a live port.",
    "Note **async** endpoints (`async def`) when calling external LLM/vector APIs concurrently.",
    "Discuss **dependency injection** (`Depends`) for auth and DB sessions if asked how you structure apps.",
  ],
  exercises: [
    {
      type: "code-completion",
      id: "rest-api-03-cc-fastapi-path",
      question:
        "Complete the FastAPI route decorator so the path is `/v1/items/{item_id}` and only accepts GET.",
      codeTemplate: `from fastapi import FastAPI

app = FastAPI()

# TODO: add GET route for /v1/items/{item_id}
def read_item(item_id: int):
    return {"item_id": item_id}`,
      language: "python",
      correctAnswer: '@app.get("/v1/items/{item_id}")',
      acceptableAnswers: ["@app.get('/v1/items/{item_id}')"],
      explanation:
        "Use `@app.get` with the path template; FastAPI coerces `item_id` to int and returns 422 on bad input.",
      interviewNote:
        "You can add `response_model` next for extra points.",
    },
    {
      type: "multiple-choice",
      id: "rest-api-03-mc-openapi",
      question:
        "Where do FastAPI applications typically expose interactive Swagger UI by default?",
      options: ["/openapi.json", "/swagger", "/docs", "/api"],
      correctIndex: 2,
      explanation:
        "FastAPI serves Swagger UI at `/docs` and ReDoc at `/redoc`; the raw schema is at `/openapi.json`.",
      interviewNote:
        "Knowing the JSON schema location matters for codegen and LLM tool adapters.",
    },
    {
      type: "ordering",
      id: "rest-api-03-order-dev-flow",
      question:
        "Order these steps for a tight local API development loop.",
      items: [
        "Run the app with auto-reload (e.g., uvicorn --reload)",
        "Edit route or Pydantic model",
        "Hit endpoint with HTTPie/curl or Swagger try-it-out",
        "Fix validation errors shown in 422 response or console",
      ],
      correctOrder: [1, 0, 2, 3],
      explanation:
        "Change code, run server with reload, exercise endpoint, iterate on validation—typical FastAPI flow.",
      interviewNote:
        "Mention optional pytest step after manual verification.",
    },
    {
      type: "true-false",
      id: "rest-api-03-tf-flask-validate",
      statement:
        "In Flask, request JSON bodies are always parsed and validated automatically like Pydantic in FastAPI.",
      correct: false,
      explanation:
        "Flask gives `request.get_json()` but no automatic schema validation—you validate manually or with extensions.",
      interviewNote:
        "Shows you understand framework responsibilities vs your code’s.",
    },
    {
      type: "scenario",
      id: "rest-api-03-scenario-llm-latency",
      scenario:
        "You expose `POST /v1/prompts/compile` that calls an LLM and returns a structured JSON plan. Latency is 2–8 seconds and clients retry on timeouts.",
      question:
        "What FastAPI- and HTTP-level measures would you mention in a design review?",
      sampleAnswer:
        "Set explicit **timeouts** on outbound LLM HTTP calls; return **504/502** with clear JSON errors when upstream fails. For POST retries, support **Idempotency-Key** or convert to **202 Accepted** + `GET /jobs/{id}` pattern so duplicates are visible. Document the schema in OpenAPI; consider **async** route handlers and connection pooling. Add **rate limiting** at gateway and log request ids without storing prompts if policy forbids it.",
      keyPoints: [
        "Long-running POST vs async job pattern",
        "Idempotency for retries",
        "OpenAPI contract + structured errors",
      ],
      interviewNote:
        "Ties REST lesson to GenAI latency realities—strong consulting signal.",
    },
  ],
};
