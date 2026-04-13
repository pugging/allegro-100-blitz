import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "python-04",
  skillId: "python",
  order: 4,
  title: "Обработка ошибок, тесты и практики",
  subtitle:
    "Надёжные GenAI-сервисы: корректные сбои, осмысленные логи, проверка поведения и воспроизводимые окружения.",
  estimatedMinutes: 15,
  objectives: [
    "Использовать try/except/finally и проектировать предметные исключения.",
    "Применять структурированное логирование вместо print в коде, ориентированном на продакшен.",
    "Писать сфокусированные тесты pytest и объяснять типичные приёмы с фикстурами.",
    "Изолировать зависимости через venv, следовать PEP 8 и применять mypy для статических проверок.",
  ],
  content: [
    {
      type: "text",
      content:
        "Зрелость инженера на интервью и в ревью судят по тому, как вы обрабатываете сбои, наблюдаемость и повторяемость. Пайплайны GenAI падают на лимитах, битом JSON и таймаутах моделей — Python должен ясно отдавать ошибки и оставаться тестируемым.",
    },
    {
      type: "heading",
      level: 2,
      content: "Исключения: try / except / else / finally",
    },
    {
      type: "text",
      content:
        "Ловите максимально узкое исключение, которое можете обработать; избегайте голого except. Блок else — для кода, который выполняется только если исключения не было; finally — для очистки (закрытие файлов, снятие блокировок). Повторно выбрасывайте или связывайте цепочкой: `raise ... from e`, чтобы сохранить контекст.",
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
        raise ValueError("Модель вернула некорректный JSON") from exc
    else:
        if not isinstance(data, dict):
            raise TypeError("Ожидался JSON-объект на верхнем уровне")
        return data
    finally:
        # Заглушка под метрики или хуки очистки
        pass


try:
    parse_model_response("{not json")
except ValueError as err:
    print("Обработано:", err.__cause__)  # исходный JSONDecodeError`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Не глотайте ошибки молча",
      content:
        "Пустые блоки except и размытое except Exception скрывают баги. Логируйте или оборачивайте с контекстом, затем быстро падайте или возвращайте структурированную ошибку вызывающему коду.",
    },
    {
      type: "heading",
      level: 2,
      content: "Пользовательские исключения",
    },
    {
      type: "code",
      language: "python",
      filename: "custom_errors.py",
      code: `class ModelAPIError(Exception):
    """Базовый класс для сбоев API поставщика."""


class RateLimitError(ModelAPIError):
    def __init__(self, retry_after: float | None = None) -> None:
        super().__init__("Превышен лимит запросов")
        self.retry_after = retry_after


def call_stub(status: int) -> None:
    if status == 429:
        raise RateLimitError(retry_after=2.5)
    if status >= 400:
        raise ModelAPIError("ошибка upstream")


try:
    call_stub(429)
except RateLimitError as e:
    print("Пауза, сек:", e.retry_after)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Логирование",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Используйте модуль logging; настройте обработчики один раз при старте процесса (уровень, формат, назначение).",
        "Логируйте с дополнительным контекстом (request_id, user_id) через структурированные логи или шаблон key=value.",
        "print оставьте для быстрых скриптов; библиотеки и сервисы должны использовать логгеры.",
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
    log.exception("unhandled_math")  # включает traceback`,
    },
    {
      type: "tip",
      content:
        "На интервью упомяните корреляционные идентификаторы между вызовами LLM — та же идея, что request_id в HTTP middleware.",
    },
    {
      type: "heading",
      level: 2,
      content: "Основы pytest",
    },
    {
      type: "text",
      content:
        "Тестовые файлы называйте `test_*.py`, функции — `test_*`. Используйте assert с простыми выражениями; pytest переписывает assert для подробных сообщений об ошибках. Параметризуйте тесты, чтобы покрывать краевые случаи без копипаста.",
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
      content: "Виртуальные окружения и гигиена зависимостей",
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
        "Коммитьте requirements.txt или зафиксированные метаданные pyproject.toml; не полагайтесь на глобальный site-packages в командных проектах. `pip freeze` груб — предпочитайте явные пины версий для воспроизводимых стеков GenAI.",
    },
    {
      type: "heading",
      level: 2,
      content: "PEP 8 и mypy",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "PEP 8: функции в snake_case, классы в PascalCase, отступ 4 пробела, две пустые строки между определениями верхнего уровня.",
        "Запускайте `ruff` или `flake8` в CI; автоформат — `black` или `ruff format`, если команда согласна.",
        "Подключайте `mypy` постепенно: сначала публичные API и модели данных; для утиной типизации клиентов — typing.Protocol.",
      ],
    },
    {
      type: "diagram",
      alt: "Поток: try → except → логирование и покрытие тестами",
      content: `flowchart LR
  A[try операция] --> B{Исключение?}
  B -->|да| C[конкретный except]
  C --> D[лог + повторный raise или fallback]
  B -->|нет| E[вернуть результат]
  D --> F[pytest проверяет поведение]`,
    },
  ],
  keyTakeaways: [
    "Связывайте исключения через `from`, чтобы в логах была первопричина.",
    "pytest.raises лучше документирует ожидаемый сбой, чем ручной try/except в тестах.",
    "venv + зафиксированные зависимости предотвращают «у меня на ноутбуке работает» в ноутбуках и API.",
    "Линтеры и mypy быстрее всего окупаются на общих путях кода GenAI-сервисов.",
  ],
  interviewTips: [
    "Когда спрашивают про тестирование выходов LLM, разделяйте детерминированные тесты разбора и стохастическое поведение модели (снимки, проверки схемы, эталонные файлы).",
    "Скажите, что логируете задержку, расход токенов и класс ошибки — но не сырые промпты с ПДн.",
    "Упомяните feature flags или circuit breaker, если разговор идёт об устойчивости.",
  ],
  exercises: [
    {
      type: "ordering",
      id: "py04-ord-except",
      question:
        "Упорядочьте эти практики от обычно лучшей (сверху) до самой рискованной (снизу) при обработке исключений в прикладном коде.",
      items: [
        "Ловить BaseException, чтобы заглушить все сбои, включая KeyboardInterrupt",
        "Ловить конкретные типы (ValueError, HTTPError) там, где можно восстановиться",
        "Дать исключению подняться после логирования контекста на границе слоя",
        "Использовать голый `except:` с pass",
      ],
      correctOrder: [1, 2, 0, 3],
      explanation:
        "Конкретные перехваты и логирование на границе — разумно. BaseException хуже (маскирует прерывания). Голый except с pass — самое рискованное: глотает всё без контекста.",
      interviewNote:
        "Свяжите с обработчиками исключений FastAPI/Starlette и внутренними циклами.",
    },
    {
      type: "true-false",
      id: "py04-tf-finally",
      statement:
        "Блок `finally` у try выполняется даже если внутри `try` выполнился return.",
      correct: true,
      explanation:
        "finally гарантированно выполняется на выходе (если интерпретатор не убит аварийно), в том числе когда try или except делают return.",
      interviewNote:
        "Полезно для закрытия клиентов httpx или освобождения семафоров — проговорите это на вопросах про архитектуру.",
    },
    {
      type: "multiple-choice",
      id: "py04-mc-pytest",
      question:
        "Какой приём pytest лучше всего документирует, что функция должна выбросить ValueError при неверном вводе?",
      options: [
        "Обернуть вызов в try/except и assert False, если ошибки не было",
        "Использовать pytest.raises(ValueError) как менеджер контекста вокруг вызова",
        "Подменить sys.exit и проверить код выхода 1",
        "Вызвать pytest.fail() до вызова функции",
      ],
      correctIndex: 1,
      explanation:
        "`with pytest.raises(ValueError):` — идиоматично и валит тест, если исключение нужного типа не произошло.",
      interviewNote:
        "Упомяните match= для текста исключения в pytest 7+.",
    },
    {
      type: "scenario",
      id: "py04-sc-retry",
      scenario:
        "Клиент, совместимый с OpenAI, иногда отвечает HTTP 429 с заголовком Retry-After. Вы оборачиваете вызовы в функцию `complete(prompt: str) -> str`.",
      question:
        "Как устроить try/except, логирование и цикл повторов, не перехватывая баги вроде TypeError?",
      sampleAnswer:
        "Ловите узкий HTTPError или свой RateLimitError, поднятый на уровне клиента. Логируйте статус, retry_after и request_id. Повторяйте только при 429 с экспоненциальной задержкой, ограничив число попыток N. TypeError и ValueError пусть поднимаются — это баги кода, а не временные сбои API.",
      keyPoints: [
        "Разделяйте повторяемые транспортные ошибки и логические баги.",
        "Логируйте структурированные поля; не логируйте полные промпты, если там секреты.",
        "Ограничивайте число повторов и после исчерпания отдавайте сбой наверх.",
      ],
      interviewNote:
        "Свяжите с продакшеном: библиотека tenacity или встроенные повторы в httpx.",
    },
    {
      type: "code-completion",
      id: "py04-cc-mypy",
      question:
        "mypy ругается, что функция может вернуть None. Вы добавляете явный тип возврата с None через сокращение Optional. Заполните пропуск для str | None.",
      codeTemplate: `from typing import Optional

def find_model(name: str) -> Optional[str]:
    if name == "default":
        return "gpt-4o"
    return ________`,
      language: "python",
      correctAnswer: "None",
      acceptableAnswers: ["none"],
      explanation:
        "Optional[str] эквивалентен str | None (PEP 604). Возврат None соответствует объявленному типу.",
      interviewNote:
        "На интервью упомяните сужение типов: `if x is None: raise` до использования.",
    },
  ],
};
