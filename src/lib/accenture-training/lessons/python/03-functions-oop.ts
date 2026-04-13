import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "python-03",
  skillId: "python",
  order: 3,
  title: "Functions, Classes & OOP",
  subtitle:
    "Composable functions and clear object models — how SDKs, agents, and services are structured in Python.",
  estimatedMinutes: 20,
  objectives: [
    "Define flexible functions with *args, **kwargs, and lambdas.",
    "Explain decorators and common built-in decorators at a high level.",
    "Model state with classes, inheritance, and special methods.",
    "Use dataclasses and type hints to document intent for humans and tools.",
  ],
  content: [
    {
      type: "text",
      content:
        "GenAI codebases wrap HTTP clients, tool registries, and memory stores in classes. Functions glue pure transformations. Interviews often ask you to sketch a small class API (e.g. a RateLimiter or ToolRunner) — this lesson gives you the vocabulary.",
    },
    {
      type: "heading",
      level: 2,
      content: "Function definitions and flexibility",
    },
    {
      type: "code",
      language: "python",
      filename: "functions.py",
      code: `from typing import Any

def greet(name: str, *, polite: bool = True) -> str:
    """Keyword-only polite flag after * prevents accidental position mix-ups."""
    prefix = "Hello" if polite else "Yo"
    return f"{prefix}, {name}!"

def call_tool(tool_name: str, *args: Any, **kwargs: Any) -> dict[str, Any]:
    """*args = positional extras, **kwargs = named extras (like many SDK calls)."""
    return {"tool": tool_name, "args": args, "kwargs": kwargs}

print(call_tool("search", "python", limit=10))`,
    },
    {
      type: "tip",
      content:
        "Unpacking at call sites: func(*list_args, **dict_kwargs) forwards parameters — common when wrapping libraries or building decorators.",
    },
    {
      type: "heading",
      level: 2,
      content: "Lambda and higher-order functions",
    },
    {
      type: "text",
      content:
        "Lambdas are single-expression anonymous functions. Use them for short callbacks (sorted(key=lambda x: x[1])). For anything longer, use def for readability and stack traces.",
    },
    {
      type: "code",
      language: "python",
      filename: "lambda_map.py",
      code: `scores = [("alice", 91), ("bob", 87)]
scores.sort(key=lambda pair: pair[1], reverse=True)

nums = [1, 2, 3]
squared = list(map(lambda n: n * n, nums))
print(squared)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Decorators",
    },
    {
      type: "text",
      content:
        "A decorator is a callable that takes a function (or class) and returns a replacement — commonly used for logging, timing, access control, or registering handlers. @syntax applies the decorator at definition time.",
    },
    {
      type: "code",
      language: "python",
      filename: "decorator.py",
      code: `import functools
import time
from typing import Callable, TypeVar, ParamSpec

P = ParamSpec("P")
R = TypeVar("R")


def timed(func: Callable[P, R]) -> Callable[P, R]:
    @functools.wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        start = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            elapsed = time.perf_counter() - start
            print(f"{func.__name__} took {elapsed:.4f}s")

    return wrapper


@timed
def heavy(n: int) -> int:
    return sum(range(n))

print(heavy(100_000))`,
    },
    {
      type: "callout",
      variant: "info",
      title: "functools.wraps",
      content:
        "Always use @functools.wraps on wrapper functions so metadata (__name__, docstring) stays correct — debuggers and type checkers behave better.",
    },
    {
      type: "heading",
      level: 2,
      content: "Classes, inheritance, and common decorators",
    },
    {
      type: "code",
      language: "python",
      filename: "oop.py",
      code: `from __future__ import annotations

class ModelClient:
    """Minimal sketch of an LLM client boundary."""

    def __init__(self, model_name: str, api_key: str) -> None:
        self.model_name = model_name
        self._api_key = api_key  # convention: "internal"

    def complete(self, prompt: str, *, temperature: float = 0.2) -> str:
        # Stub — real code would call an API (%-format avoids TS template brace clashes)
        return "[%s @ T=%s] %s..." % (self.model_name, temperature, prompt[:40])

    @property
    def model(self) -> str:
        return self.model_name

    @staticmethod
    def normalize_text(text: str) -> str:
        return " ".join(text.split())

    @classmethod
    def from_env(cls, model_name: str) -> ModelClient:
        import os

        key = os.environ.get("LLM_API_KEY", "demo-key")
        return cls(model_name, key)


class RateLimitedClient(ModelClient):
    def __init__(self, model_name: str, api_key: str, max_per_minute: int) -> None:
        super().__init__(model_name, api_key)
        self.max_per_minute = max_per_minute

    def complete(self, prompt: str, *, temperature: float = 0.2) -> str:
        # Would enforce rate here
        return super().complete(prompt, temperature=temperature)`,
    },
    {
      type: "list",
      ordered: false,
      items: [
        "__init__ constructs instance state; self is the instance.",
        "@property exposes getters without breaking attribute syntax.",
        "@staticmethod — no self/cls; logical grouping on the class.",
        "@classmethod — first arg cls; common for alternative constructors.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Dataclasses and type hints",
    },
    {
      type: "code",
      language: "python",
      filename: "dataclass_tool.py",
      code: `from dataclasses import dataclass, field
from typing import Sequence


@dataclass(frozen=True)
class ToolCall:
    name: str
    arguments: dict[str, str]
    call_id: str = field(default_factory=lambda: "auto")


def format_batch(calls: Sequence[ToolCall]) -> str:
    return '\\n'.join("%s(%r)" % (c.name, c.arguments) for c in calls)


tc = ToolCall(name="search", arguments={"q": "python asyncio"})
print(format_batch([tc]))`,
    },
    {
      type: "diagram",
      alt: "Relationship between function decorators and class method decorators",
      content: `flowchart TB
  subgraph func[Functions]
    F1[def business_logic] --> F2[@decorator applies wrapper]
  end
  subgraph cls[Classes]
    C1[instance methods use self]
    C2[classmethod uses cls]
    C3[staticmethod no binding]
  end`,
    },
  ],
  keyTakeaways: [
    "*args and **kwargs mirror how real SDKs accept extensible parameters.",
    "Decorators add cross-cutting behavior without duplicating boilerplate.",
    "Inheritance + super() composes behavior; prefer small, focused bases.",
    "Dataclasses reduce boilerplate for data carriers; frozen=True gives hashability when fields allow.",
  ],
  interviewTips: [
    "When designing a class, start with the public method names callers need, then fill state.",
    "Mention immutability (frozen dataclass) when discussing thread safety or dict keys.",
    "If asked about MRO, say Python uses C3 linearization for multiple inheritance — keep hierarchies shallow in design answers.",
  ],
  exercises: [
    {
      type: "true-false",
      id: "py03-tf-static",
      statement:
        "In Python, a @staticmethod can access cls or the instance self without them being listed in the parameter list.",
      correct: false,
      explanation:
        "Static methods do not receive self or cls automatically. They behave like plain functions namespaced on the class.",
      interviewNote:
        "Contrast with @classmethod (gets cls) and ordinary methods (get self).",
    },
    {
      type: "scenario",
      id: "py03-sc-client",
      scenario:
        "You are designing a Python class that wraps an HTTP LLM API. Callers should pass model_id and api_key once, then call .complete(prompt, temperature=...) many times. Internal key must not be printed by repr().",
      question:
        "Which pieces belong in __init__, what visibility convention do you use for the key, and which decorator might expose model_id read-only?",
      sampleAnswer:
        "Store model_id and api_key in __init__. Use self._api_key for a private-by-convention attribute. Expose model_id via @property if you want read-only access without a setter. Implement complete() to call requests or httpx with the stored key.",
      keyPoints: [
        "__init__ for one-time configuration.",
        "Leading underscore for internal attributes.",
        "@property for controlled read access.",
      ],
      interviewNote:
        "Tie to security: never log api_key; mention env vars for real deployments.",
    },
    {
      type: "code-completion",
      id: "py03-cc-super",
      question:
        "Child class __init__ must initialize parent attributes. Fill in the blank to call the parent constructor.",
      codeTemplate: `class B(A):
    def __init__(self, x: int, y: int) -> None:
        ________(x)
        self.y = y`,
      language: "python",
      correctAnswer: "super().__init__",
      explanation:
        "super().__init__(...) forwards to the next class in the MRO chain — here, A.__init__.",
      interviewNote:
        "In cooperative multiple inheritance, always use super() consistently in every __init__.",
    },
    {
      type: "multiple-choice",
      id: "py03-mc-lambda",
      question:
        "Which statement about Python lambdas is most accurate?",
      options: [
        "Lambdas may contain multiple statements separated by semicolons",
        "Lambdas are limited to a single expression and implicitly return its value",
        "Lambdas automatically capture variables by copy at definition time",
        "Lambdas cannot be passed as arguments to sorted()",
      ],
      correctIndex: 1,
      explanation:
        "lambda args: expr defines an anonymous function returning expr. Statements like assignments are not allowed; use def for multi-step logic.",
      interviewNote:
        "Beware late binding in loops with lambdas — a classic pitfall in interviews.",
    },
    {
      type: "ordering",
      id: "py03-ord-mro",
      question:
        "Order these steps when Python resolves an attribute lookup on an instance (typical single inheritance), from first tried to last among these options.",
      items: [
        "The instance __dict__",
        "The class __dict__ and its MRO parents",
        "__getattr__ on the class if defined and normal lookup failed",
      ],
      correctOrder: [0, 1, 2],
      explanation:
        "Normal lookup checks the instance namespace, then walks the class MRO. __getattr__ is only invoked if normal attribute resolution fails.",
      interviewNote:
        "Mention __getattribute__ only if asked — it runs before instance dict and is easy to misuse.",
    },
  ],
};
