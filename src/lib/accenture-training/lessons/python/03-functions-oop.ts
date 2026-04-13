import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "python-03",
  skillId: "python",
  order: 3,
  title: "Функции, классы и ООП",
  subtitle:
    "Композиция функций и понятные объектные модели — как в Python устроены SDK, агенты и сервисы.",
  estimatedMinutes: 20,
  objectives: [
    "Определять гибкие функции с *args, **kwargs и лямбдами.",
    "Объяснять декораторы и распространённые встроенные декораторы на высоком уровне.",
    "Моделировать состояние классами, наследованием и специальными методами.",
    "Использовать датаклассы и аннотации типов, чтобы фиксировать намерение для людей и инструментов.",
  ],
  content: [
    {
      type: "text",
      content:
        "В кодовых базах GenAI HTTP-клиенты, реестры инструментов и хранилища памяти оборачивают в классы. Функции склеивают чистые преобразования. На интервью часто просят набросать небольшой API класса (например, RateLimiter или ToolRunner) — этот урок даёт нужный словарь.",
    },
    {
      type: "heading",
      level: 2,
      content: "Определение функций и гибкость",
    },
    {
      type: "code",
      language: "python",
      filename: "functions.py",
      code: `from typing import Any

def greet(name: str, *, polite: bool = True) -> str:
    """Флаг вежливости только по ключу после * снижает риск перепутать позиционные аргументы."""
    prefix = "Здравствуйте" if polite else "Привет"
    return f"{prefix}, {name}!"

def call_tool(tool_name: str, *args: Any, **kwargs: Any) -> dict[str, Any]:
    """*args — лишние позиционные, **kwargs — именованные (как во многих вызовах SDK)."""
    return {"tool": tool_name, "args": args, "kwargs": kwargs}

print(call_tool("search", "python", limit=10))`,
    },
    {
      type: "tip",
      content:
        "Распаковка при вызове: func(*list_args, **dict_kwargs) пробрасывает параметры — типично при обёртке библиотек или написании декораторов.",
    },
    {
      type: "heading",
      level: 2,
      content: "Лямбды и функции высшего порядка",
    },
    {
      type: "text",
      content:
        "Лямбды — анонимные функции из одного выражения. Используйте для коротких колбэков (sorted(key=lambda x: x[1])). Если логика длиннее — пишите def ради читаемости и трассировок стека.",
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
      content: "Декораторы",
    },
    {
      type: "text",
      content:
        "Декоратор — вызываемый объект, который принимает функцию (или класс) и возвращает замену — часто для логирования, замера времени, контроля доступа или регистрации обработчиков. Синтаксис @ применяет декоратор в момент определения.",
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
            print(f"{func.__name__} заняла {elapsed:.4f} с")

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
        "Всегда используйте @functools.wraps на обёртках, чтобы метаданные (__name__, docstring) сохранялись — отладчики и проверка типов ведут себя предсказуемее.",
    },
    {
      type: "heading",
      level: 2,
      content: "Классы, наследование и распространённые декораторы методов",
    },
    {
      type: "code",
      language: "python",
      filename: "oop.py",
      code: `from __future__ import annotations

class ModelClient:
    """Минимальный эскиз границы клиента LLM."""

    def __init__(self, model_name: str, api_key: str) -> None:
        self.model_name = model_name
        self._api_key = api_key  # соглашение: «внутреннее»

    def complete(self, prompt: str, *, temperature: float = 0.2) -> str:
        # Заглушка — в реальности вызов API (%-формат избегает конфликта с шаблонами TS)
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
        # Здесь бы проверяли лимит
        return super().complete(prompt, temperature=temperature)`,
    },
    {
      type: "list",
      ordered: false,
      items: [
        "__init__ создаёт состояние экземпляра; self — сам экземпляр.",
        "@property даёт геттеры без ломания синтаксиса атрибутов.",
        "@staticmethod — без self/cls; логическая группировка на классе.",
        "@classmethod — первый аргумент cls; часто для альтернативных конструкторов.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Датаклассы и аннотации типов",
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
      alt: "Связь декораторов функций и декораторов методов класса",
      content: `flowchart TB
  subgraph func[Функции]
    F1[def business_logic] --> F2[@decorator оборачивает]
  end
  subgraph cls[Классы]
    C1[методы экземпляра с self]
    C2[classmethod с cls]
    C3[staticmethod без привязки]
  end`,
    },
  ],
  keyTakeaways: [
    "*args и **kwargs отражают то, как реальные SDK принимают расширяемые параметры.",
    "Декораторы добавляют сквозную логику без дублирования шаблонного кода.",
    "Наследование и super() собирают поведение; предпочитайте небольшие узкие базы.",
    "Датаклассы уменьшают шаблон для носителей данных; frozen=True даёт хешируемость, когда поля позволяют.",
  ],
  interviewTips: [
    "Проектируя класс, начните с имён публичных методов, которые нужны вызывающему коду, затем добавьте состояние.",
    "Упоминайте неизменяемость (frozen dataclass) при обсуждении потокобезопасности или ключей словаря.",
    "Если спросят про MRO, скажите, что Python использует линейризацию C3 при множественном наследовании — в ответах про дизайн держите иерархии плоскими.",
  ],
  exercises: [
    {
      type: "true-false",
      id: "py03-tf-static",
      statement:
        "В Python @staticmethod может обращаться к cls или к экземпляру self без перечисления их в списке параметров.",
      correct: false,
      explanation:
        "У статических методов нет автоматической передачи self или cls. Они ведут себя как обычные функции, размещённые в пространстве имён класса.",
      interviewNote:
        "Сопоставьте с @classmethod (получает cls) и обычными методами (получают self).",
    },
    {
      type: "scenario",
      id: "py03-sc-client",
      scenario:
        "Вы проектируете класс-обёртку над HTTP API LLM. Вызывающий код один раз передаёт model_id и api_key, затем много раз вызывает .complete(prompt, temperature=...). Внутренний ключ не должен попадать в repr().",
      question:
        "Что кладёте в __init__, какое соглашение о видимости для ключа и какой декоратор может отдать model_id только для чтения?",
      sampleAnswer:
        "В __init__ сохраняем model_id и api_key. Для ключа — self._api_key (по соглашению «внутреннее»). model_id можно отдать через @property без сеттера. В complete() вызываете requests/httpx с сохранённым ключом.",
      keyPoints: [
        "__init__ для одноразовой конфигурации.",
        "Ведущее подчёркивание для внутренних атрибутов.",
        "@property для контролируемого чтения.",
      ],
      interviewNote:
        "Свяжите с безопасностью: не логировать api_key; в продакшене — переменные окружения.",
    },
    {
      type: "code-completion",
      id: "py03-cc-super",
      question:
        "В дочернем __init__ нужно инициализировать поля родителя. Заполните пропуск для вызова конструктора родителя.",
      codeTemplate: `class B(A):
    def __init__(self, x: int, y: int) -> None:
        ________(x)
        self.y = y`,
      language: "python",
      correctAnswer: "super().__init__",
      explanation:
        "super().__init__(...) передаёт управление следующему классу в цепочке MRO — здесь A.__init__.",
      interviewNote:
        "При кооперативном множественном наследовании везде последовательно используйте super() в каждом __init__.",
    },
    {
      type: "multiple-choice",
      id: "py03-mc-lambda",
      question:
        "Какое утверждение о лямбдах в Python наиболее точно?",
      options: [
        "Лямбды могут содержать несколько операторов, разделённых точкой с запятой",
        "Лямбды ограничены одним выражением и неявно возвращают его значение",
        "Лямбды всегда захватывают переменные по копии в момент определения",
        "Лямбды нельзя передавать как аргументы в sorted()",
      ],
      correctIndex: 1,
      explanation:
        "lambda args: expr задаёт анонимную функцию, возвращающую expr. Операторы вроде присваивания недопустимы; для многошаговой логики используйте def.",
      interviewNote:
        "Остерегайтесь позднего связывания в циклах с лямбдами — классическая ловушка на интервью.",
    },
    {
      type: "ordering",
      id: "py03-ord-mro",
      question:
        "Упорядочьте шаги разрешения обращения к атрибуту экземпляра (типичное одиночное наследование) — от того, что пробуют первым, к последнему из перечисленных.",
      items: [
        "Словарь экземпляра __dict__",
        "Словарь класса и родители по MRO",
        "__getattr__ у класса, если определён и обычный поиск не сработал",
      ],
      correctOrder: [0, 1, 2],
      explanation:
        "Обычный поиск сначала смотрит пространство имён экземпляра, затем обходит MRO класса. __getattr__ вызывается только если обычное разрешение не нашло атрибут.",
      interviewNote:
        "Про __getattribute__ говорите только если спросят — он выполняется до словаря экземпляра и легко даёт ошибки.",
    },
  ],
};
