import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "python-04",
  skillId: "python",
  order: 4,
  title: "Error Handling, Testing & Best Practices",
  subtitle:
    "Ship reliable GenAI services: fail gracefully, log intelligently, test behavior, and keep environments reproducible.",
  estimatedMinutes: 15,
  objectives: [
    "Use try/except/finally and design domain-specific exceptions.",
    "Apply structured logging instead of print in production-minded code.",
    "Write focused pytest tests and explain common fixture patterns.",
    "Isolate dependencies with venv, follow PEP 8, and use mypy for static checks.",
  ],
  content: [
    {
      type: "text",
      content:
        "Interviewers and reviewers judge engineering maturity by how you handle failures, observability, and repeatability. GenAI pipelines fail on rate limits, malformed JSON, and model timeouts — your Python should surface errors clearly and stay testable.",
    },
    {
      type: "heading",
      level: 2,
      content: "Exceptions: try / except / else / finally",
    },
    {
      type: "text",
      content:
        "Catch the narrowest exception you can handle; avoid bare except. Use else for code that runs only when no exception occurred, and finally for cleanup (closing files, releasing locks). Re-raise or chain exceptions with `raise ... from e` to preserve context.",
    },
    {
      type: "code",
      language: "python",
      filename: "errors.py",
      code: `import json
from typing import Any


def parse_model_response(raw: str) -> dict[str, Any]:
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError("Model returned invalid JSON") from exc
    else:
        if not isinstance(data, dict):
            raise TypeError("Expected JSON object at top level")
        return data
    finally:
        # Placeholder for metrics or cleanup hooks
        pass


try:
    parse_model_response("{not json")
except ValueError as err:
    print("Handled:", err.__cause__)  # original JSONDecodeError`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Never swallow errors silently",
      content:
        "Empty except blocks and vague except Exception hides bugs. Log or re-wrap with context, then fail fast or return a structured error to callers.",
    },
    {
      type: "heading",
      level: 2,
      content: "Custom exceptions",
    },
    {
      type: "code",
      language: "python",
      filename: "custom_errors.py",
      code: `class ModelAPIError(Exception):
    """Base for all vendor API failures."""


class RateLimitError(ModelAPIError):
    def __init__(self, retry_after: float | None = None) -> None:
        super().__init__("Rate limited")
        self.retry_after = retry_after


def call_stub(status: int) -> None:
    if status == 429:
        raise RateLimitError(retry_after=2.5)
    if status >= 400:
        raise ModelAPIError("upstream error")


try:
    call_stub(429)
except RateLimitError as e:
    print("Backoff seconds:", e.retry_after)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Logging",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Use the logging module; configure handlers once at process entry (level, format, destination).",
        "Log with extra context (request_id, user_id) using structured logging or key=value patterns.",
        "Reserve print for quick scripts; libraries and services should use loggers.",
      ],
    },
    {
      type: "code",
      language: "python",
      filename: "logging_demo.py",
      code: `import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
log = logging.getLogger("genai.worker")

log.info("job_started", extra={"job_id": "42"})
try:
    1 / 0
except ZeroDivisionError:
    log.exception("unhandled_math")  # includes traceback`,
    },
    {
      type: "tip",
      content:
        "In interviews, mention correlation IDs across LLM calls — the same idea as request_id in HTTP middleware.",
    },
    {
      type: "heading",
      level: 2,
      content: "pytest basics",
    },
    {
      type: "text",
      content:
        "Name test files `test_*.py` and functions `test_*`. Use assert with simple expressions; pytest rewrites asserts for rich failures. Parametrize tests to cover edge cases without copy-paste.",
    },
    {
      type: "code",
      language: "python",
      filename: "test_parse.py",
      code: `import pytest
from errors import parse_model_response


def test_parse_ok():
    out = parse_model_response('{"ok": true}')
    assert out["ok"] is True


def test_parse_bad_json():
    with pytest.raises(ValueError) as record:
        parse_model_response("<<<")
    assert record.value.__cause__ is not None


@pytest.mark.parametrize(
    "payload",
    ["[]", '"string"', "null"],
)
def test_rejects_non_object(payload: str):
    with pytest.raises(TypeError):
        parse_model_response(payload)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Virtual environments and packaging hygiene",
    },
    {
      type: "code",
      language: "bash",
      filename: "venv.sh",
      code: `python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install --upgrade pip
pip install -r requirements.txt`,
    },
    {
      type: "text",
      content:
        "Commit requirements.txt or pyproject.toml lock metadata; never rely on a global site-packages for team projects. `pip freeze` is a blunt instrument — prefer explicit version pins for reproducible GenAI stacks.",
    },
    {
      type: "heading",
      level: 2,
      content: "PEP 8 and mypy",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "PEP 8: snake_case functions, PascalCase classes, 4-space indent, two blank lines between top-level defs.",
        "Run `ruff` or `flake8` in CI; auto-format with `black` or `ruff format` if the team agrees.",
        "Add `mypy` gradually: start with public APIs and data models; use typing.Protocol for duck-typed clients.",
      ],
    },
    {
      type: "diagram",
      alt: "Flow from try block through except to logging and test coverage",
      content: `flowchart LR
  A[try operation] --> B{Exception?}
  B -->|yes| C[specific except]
  C --> D[log + re-raise or fallback]
  B -->|no| E[return result]
  D --> F[pytest asserts behavior]`,
    },
  ],
  keyTakeaways: [
    "Chain exceptions with `from` so operators see root causes in logs.",
    "pytest.raises documents expected failures better than manual try/except in tests.",
    "venv + pinned deps prevent \"works on my laptop\" drift across notebooks and APIs.",
    "Linting and mypy pay off fastest on shared GenAI service code paths.",
  ],
  interviewTips: [
    "When asked about testing LLM outputs, separate deterministic parsing tests from stochastic model behavior (snapshots, schema checks, golden files).",
    "Say you would log latency, token usage, and error class — not raw prompts with PII.",
    "Mention feature flags or circuit breakers if the conversation turns to resilience.",
  ],
  exercises: [
    {
      type: "ordering",
      id: "py04-ord-except",
      question:
        "Order these practices from generally best (top) to riskiest (bottom) when handling exceptions in application code.",
      items: [
        "Catch BaseException to silence all failures including KeyboardInterrupt",
        "Catch specific types (ValueError, HTTPError) close to where you can recover",
        "Let exceptions propagate after logging context at a boundary layer",
        "Use bare `except:` with pass",
      ],
      correctOrder: [1, 2, 0, 3],
      explanation:
        "Specific catches and boundary logging are sound. Catching BaseException is worse (masks interrupts). Bare except with pass is the riskiest — it swallows everything without context.",
      interviewNote:
        "Relate to FastAPI/Starlette exception handlers vs. inner loops.",
    },
    {
      type: "true-false",
      id: "py04-tf-finally",
      statement:
        "The `finally` block of a try statement runs even when a return statement executes inside the `try` block.",
      correct: true,
      explanation:
        "finally is guaranteed to run on the way out (unless the interpreter is killed abruptly), including when try or except returns.",
      interviewNote:
        "Useful for closing httpx clients or releasing semaphores — say that aloud in system-design questions.",
    },
    {
      type: "multiple-choice",
      id: "py04-mc-pytest",
      question:
        "Which pytest pattern best documents that a function must raise ValueError for invalid input?",
      options: [
        "Wrap the call in try/except and assert False if no error",
        "Use pytest.raises(ValueError) as a context manager around the call",
        "Monkeypatch sys.exit and assert exit code 1",
        "Call pytest.fail() before invoking the function",
      ],
      correctIndex: 1,
      explanation:
        "`with pytest.raises(ValueError):` is idiomatic and fails the test if the exception type does not occur.",
      interviewNote:
        "Mention match= for exception messages when using pytest 7+.",
    },
    {
      type: "scenario",
      id: "py04-sc-retry",
      scenario:
        "Your OpenAI-compatible client sometimes returns HTTP 429 with a Retry-After header. You wrap calls in a function `complete(prompt: str) -> str`.",
      question:
        "How do you structure try/except, logging, and a retry loop without catching programming bugs like TypeError?",
      sampleAnswer:
        "Catch a narrow HTTPError or a custom RateLimitError raised from the client layer. Log status, retry_after, and request_id. Retry only on 429 with exponential backoff capped at N attempts. Let TypeError and ValueError propagate — they indicate code bugs, not transient API conditions.",
      keyPoints: [
        "Separate retryable transport errors from logic bugs.",
        "Log structured fields; avoid logging full prompts if they contain secrets.",
        "Cap retries and surface failure after exhaustion.",
      ],
      interviewNote:
        "Connect to production patterns: tenacity library or httpx built-in retries.",
    },
    {
      type: "code-completion",
      id: "py04-cc-mypy",
      question:
        "You run mypy on a file and it complains that a function may return None. You add an explicit return type that includes None. Fill in the blank using typing.Optional shorthand for str | None.",
      codeTemplate: `from typing import Optional

def find_model(name: str) -> Optional[str]:
    if name == "default":
        return "gpt-4o"
    return ________`,
      language: "python",
      correctAnswer: "None",
      acceptableAnswers: ["none"],
      explanation:
        "Optional[str] is equivalent to str | None (PEP 604). Returning None matches the declared type.",
      interviewNote:
        "In interviews, mention narrowing checks like `if x is None: raise` before use.",
    },
  ],
};
