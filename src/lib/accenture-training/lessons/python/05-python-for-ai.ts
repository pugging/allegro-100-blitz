import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "python-05",
  skillId: "python",
  order: 5,
  title: "Python для ИИ и данных",
  subtitle:
    "NumPy, Pandas, HTTP и асинхронность — повседневный набор для прототипов GenAI и продакшен-адаптеров.",
  estimatedMinutes: 15,
  objectives: [
    "Загружать и преобразовывать числовые и табличные данные с NumPy и Pandas.",
    "Безопасно читать JSON и CSV с диска или из API.",
    "Вызывать REST API через requests и понимать async/await для параллельного I/O.",
    "Ориентироваться в экосистеме (OpenAI SDK, LangChain, ноутбуки) с ясными границами.",
  ],
  content: [
    {
      type: "text",
      content:
        "Большая часть инженерии GenAI — склейка: забрать контекст, сбатчить эмбеддинги, соединить скоры ретрива, стримить токены клиенту. Стеки данных и HTTP в Python — место этой склейки до того, как LangChain и подобное оркестрируют потоки выше уровнем.",
    },
    {
      type: "heading",
      level: 2,
      content: "Основы NumPy",
    },
    {
      type: "text",
      content:
        "NumPy даёт непрерывные числовые массивы и векторизованные операции на C. За массивами NumPy стоят тензоры PyTorch, признаки scikit-learn и многие утилиты эмбеддингов.",
    },
    {
      type: "code",
      language: "python",
      filename: "numpy_basics.py",
      code: `import numpy as np

vec = np.array([0.1, 0.2, 0.3], dtype=np.float32)
mat = np.ones((2, 3))
row_means = mat.mean(axis=1)
scaled = vec * 10
dot = np.dot(vec, vec)
print(row_means.shape, scaled, dot)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Pandas для таблиц",
    },
    {
      type: "code",
      language: "python",
      filename: "pandas_basics.py",
      code: `import pandas as pd

df = pd.DataFrame(
    [
        {"doc_id": "a1", "score": 0.91, "label": "relevant"},
        {"doc_id": "b2", "score": 0.33, "label": "irrelevant"},
    ]
)
top = df.sort_values("score", ascending=False).head(1)
mask = df["score"] > 0.5
print(df.loc[mask, "doc_id"].tolist())`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Угол интервью",
      content:
        "Будьте готовы сравнить векторизованные операции Pandas с циклами Python по строкам — проверяют понимание «обрывов» производительности при миллионах строк.",
    },
    {
      type: "heading",
      level: 2,
      content: "Ввод-вывод JSON и CSV",
    },
    {
      type: "code",
      language: "python",
      filename: "io_files.py",
      code: `import csv
import json
from pathlib import Path

payload = {"model": "gpt-4o", "temperature": 0.2}
Path("config.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
loaded = json.loads(Path("config.json").read_text(encoding="utf-8"))

with Path("scores.csv").open("w", newline="", encoding="utf-8") as fh:
    writer = csv.DictWriter(fh, fieldnames=["id", "score"])
    writer.writeheader()
    writer.writerow({"id": "chunk-1", "score": "0.87"})

rows = list(csv.DictReader(Path("scores.csv").open(encoding="utf-8")))
print(rows)`,
    },
    {
      type: "heading",
      level: 2,
      content: "HTTP через requests",
    },
    {
      type: "code",
      language: "python",
      filename: "http_client.py",
      code: `import os

import requests

API_KEY = os.environ.get("OPENAI_API_KEY", "")
url = "https://api.openai.com/v1/models"
headers = {"Authorization": "Bearer %s" % API_KEY}

resp = requests.get(url, headers=headers, timeout=30)
resp.raise_for_status()
data = resp.json()
first_id = data["data"][0]["id"] if data.get("data") else None
print(first_id)`,
    },
    {
      type: "callout",
      variant: "danger",
      title: "Секреты",
      content:
        "Никогда не хардкодьте API-ключи в репозитории. Используйте переменные окружения, менеджеры секретов или конфигурацию платформы (Azure Key Vault, AWS Secrets Manager).",
    },
    {
      type: "heading",
      level: 2,
      content: "async/await для параллельного I/O",
    },
    {
      type: "text",
      content:
        "asyncio позволяет одному потоку перекрывать ожидания сети. FastAPI и httpx (async) подходят для шлюзов GenAI с несколькими источниками ретрива.",
    },
    {
      type: "code",
      language: "python",
      filename: "async_demo.py",
      code: `import asyncio


async def fake_fetch(doc_id: str) -> str:
    await asyncio.sleep(0.05)
    return "text-%s" % doc_id


async def main() -> None:
    ids = ["a", "b", "c"]
    results = await asyncio.gather(*(fake_fetch(i) for i in ids))
    print(results)


asyncio.run(main())`,
    },
    {
      type: "heading",
      level: 2,
      content: "Экосистема: ноутбуки и SDK",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Jupyter / VS Code notebooks — для разведки; стабильный код выносите в импортируемые модули для продакшена.",
        "SDK openai / anthropic / google-generativeai — тонкие типизированные клиенты поверх HTTPS; изучите повторы и стриминг.",
        "LangChain / LangGraph — слои композиции; поймите, когда прямые вызовы SDK проще, чем лишняя абстракция.",
      ],
    },
    {
      type: "diagram",
      alt: "Путь данных: файлы и API → Python → вызовы модели",
      content: `flowchart LR
  CSV[Файлы CSV JSON] --> P[Pandas json]
  API[REST API] --> R[requests или httpx]
  P --> T[Токенизация чанка]
  R --> T
  T --> M[SDK модели]
  M --> S[Стрим или батч ответа]`,
    },
    {
      type: "tip",
      content:
        "В домашних заданиях аккуратный пакет `src/` и минимальный `notebooks/`, импортирующий из `src`, производит лучшее впечатление, чем один огромный ноутбук.",
    },
  ],
  keyTakeaways: [
    "Для чисел и таблиц в масштабе предпочитайте векторизованный NumPy/Pandas циклам Python.",
    "Всегда задавайте таймауты и вызывайте raise_for_status() (или аналог) у HTTP-клиентов.",
    "Шаблоны asyncio.gather напрямую соответствуют параллельному ретриву в RAG.",
    "Считайте ноутбуки черновиком; выносите переиспользуемую логику в тестируемые модули.",
  ],
  interviewTips: [
    "Если спросят про батчинг эмбеддингов, назовите формы массивов, dtype и объём памяти.",
    "Сопоставьте синхронный requests в скриптах и async httpx в высоконагруженных сервисах.",
    "Называйте пакеты честно (что реально использовали), а не перечисляйте весь трендовый список.",
  ],
  exercises: [
    {
      type: "code-completion",
      id: "py05-cc-pandas",
      question:
        "Дан DataFrame `df` со столбцом \"score\". Допишите цепочку: сортировка по убыванию и первые 5 строк.",
      codeTemplate: `top5 = df.sort_values("score", ascending=False).________`,
      language: "python",
      correctAnswer: "head(5)",
      acceptableAnswers: ["head( 5 )"],
      explanation:
        "sort_values упорядочивает строки; head(5) берёт пять первых. Альтернатива — iloc[:5] после reset_index, если опираетесь на позицию.",
      interviewNote:
        "Уточните, что head не копирует весь фрейм — в зависимости от версии pandas это срез; на интервью обычно ждут именно head.",
    },
    {
      type: "multiple-choice",
      id: "py05-mc-async",
      question:
        "В asyncio зачем asyncio.gather предпочтительнее последовательных await при загрузке независимых документов?",
      options: [
        "gather параллелит сжатие на CPU в потоках",
        "gather планирует I/O-задачи совместно в одном потоке, сокращая время на стене",
        "gather полностью обходит GIL при доступе к dict Python",
        "gather автоматически использует multiprocessing для каждой задачи",
      ],
      correctIndex: 1,
      explanation:
        "asyncio кооперативно планирует задачи во время ожидания I/O. Независимые сетевые запросы перекрываются по времени. CPU-bound по-прежнему нуждается в процессах или нативных библиотеках — gather не параллелит CPU «магически».",
      interviewNote:
        "Свяжите с загрузкой нескольких URL или строк БД перед слиянием контекста для LLM.",
    },
    {
      type: "true-false",
      id: "py05-tf-requests-json",
      statement:
        "После `resp = requests.get(url)` вызов `resp.json()` всегда успешен без дополнительных проверок, если HTTP-код 200.",
      correct: false,
      explanation:
        "Ответ 200 может содержать не-JSON. Используйте resp.raise_for_status() и оборачивайте json() в try/except или проверяйте Content-Type. Часть API отдаёт 200 с телом ошибки.",
      interviewNote:
        "Упомяните SSE-стримы, где .json() неуместен.",
    },
    {
      type: "ordering",
      id: "py05-ord-ml-pipeline",
      question:
        "Упорядочьте шаги минимального офлайн-скрипта оценки RAG (от первого к последнему).",
      items: [
        "Посчитать метрики (например, exact match или LLM-судья) и записать результаты",
        "Загрузить вопросы и эталонные ответы из JSONL",
        "Для каждого вопроса извлечь top-k чанков из векторного индекса",
        "Для каждого вопроса вызвать LLM с извлечённым контекстом",
      ],
      correctOrder: [1, 2, 3, 0],
      explanation:
        "Данные → ретрив → генерация ответов → оценка и сохранение. Генерация без ретрива ломает предпосылку RAG.",
      interviewNote:
        "Показывает понимание сквозной оценки, а не только вызовов API.",
    },
    {
      type: "scenario",
      id: "py05-sc-key",
      scenario:
        "Нужно закоммитить в публичный GitHub небольшой CLI на Python, вызывающий OpenAI-совместимый эндпоинт.",
      question:
        "Где должен храниться API-ключ и как скрипт читает его в рантайме?",
      sampleAnswer:
        "Ключ не коммитить. Хранить в переменной окружения (например OPENAI_API_KEY). В Python: os.environ[\"OPENAI_API_KEY\"] или локально python-dotenv с .env в .gitignore. В CI/CD — секрет из хранилища платформы.",
      keyPoints: [
        "Переменные окружения или менеджеры секретов — не исходники.",
        ".env только для локальной разработки, в .gitignore.",
        "В README указать имя переменной без примеров значений.",
      ],
      interviewNote:
        "Гигиена безопасности — частый скрининг на GenAI-платформах — отвечайте чётко.",
    },
  ],
};
