import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "langchain-langgraph-01",
  skillId: "langchain-langgraph",
  order: 1,
  title: "Основы LangChain",
  subtitle:
    "Что такое LangChain, почему важны структуры оркестрации, основные абстракции (модели, сообщения, подсказки, парсеры) и составление логики с помощью LCEL.",
  estimatedMinutes: 18,
  objectives: [
    "Объясните, что предоставляет LangChain по сравнению с прямым вызовом SDK провайдера.",
    "Используйте ChatModels и типы сообщений (система, человек, искусственный интеллект) в Python.",
    "Создавайте подсказки с помощью шаблонов и анализируйте выходные данные модели в структурированные данные.",
    "Создавайте исполняемые файлы с помощью синтаксиса канала LCEL и дополнительного структурированного вывода.",
  ],
  content: [
    {
      type: "text",
      content:
        "**LangChain** — это платформа с открытым исходным кодом для создания приложений с большими языковыми моделями. Он стандартизирует способы подключения моделей, подсказок, памяти, инструментов и извлечения данных, поэтому команды могут быстрее создавать прототипы и проводить рефакторинг в соответствии с производственными шаблонами (отслеживание, потоковая передача, повторные попытки), не переписывая все с нуля.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Почему фреймворки важны на собеседованиях",
      content:
        "Интервьюеры заботятся о том, чтобы вы могли сформулировать компромиссы: LangChain обеспечивает шаблонность и предлагает компонуемые «исполняемые файлы», но включает весовые абстракции и гибкие API. Сильный ответ назовет, когда вы перейдете на сырой OpenAI/Anthropic SDK (малая задержка, минимальные задержки), а когда оркестрация окупается (RAG, агенты, крючки оценки).",
    },
    {
      type: "heading",
      level: 2,
      content: "Установка и окружающая среда",
    },
    {
      type: "text",
      content:
        "Установите пакеты для вашего провайдера(ов). Раздел LangChain содержит функциональность `langchain-core` (общие типы), предложения решений (например, `langchain-openai`) и дополнительные дополнения. Всегда загружайте ключи API из среды доступности — никогда не передавайте секреты.",
    },
    {
      type: "code",
      language: "bash",
      filename: "setup.sh",
      code: `# Core + OpenAI (example)
pip install -U langchain langchain-core langchain-openai langchain-anthropic python-dotenv

# .env (do not commit)
# OPENAI_API_KEY=...
# ANTHROPIC_API_KEY=...`,
    },
    {
      type: "heading",
      level: 2,
      content: "Модели чата: ChatOpenAI и ChatAnthropic.",
    },
    {
      type: "text",
      content:
        "**Модели чата** обрабатывают список **сообщений** и возвращают **AIMessage**. ChatOpenAI и ChatAnthropic — это тонкие адаптеры API-интерфейсов поставщиков с общим интерфейсом («invoke», «stream», «batch»), поэтому замена поставщиков — это в основном изменение конструктора.",
    },
    {
      type: "code",
      language: "python",
      filename: "chat_models.py",
      code: `import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()

llm_openai = ChatOpenAI(model="gpt-4o-mini", temperature=0)
llm_claude = ChatAnthropic(model="claude-3-5-sonnet-20241022", temperature=0)

messages = [
    SystemMessage(content="Вы — архитектор лаконичных решений."),
    HumanMessage(content="Объясните векторный поиск в двух предложениях."),
]

ai_msg = llm_openai.invoke(messages)
print(ai_msg.content)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Сообщения и роли",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Системное сообщение**: инструкции высокого уровня, тон и правила безопасности — по возможности сохраняются стабильными во время поворотов.",
        "**HumanMessage**: данные конечного пользователя (или моделируемого пользователя в тестах).",
        "**AIMessage**: выходные данные модели; может включать вызовы инструментов в современные модели вызова функций.",
        "**ToolMessage** (более поздние уроки): результаты возвращаются после выполнения инструмента.",
      ],
    },
    {
      type: "tip",
      content:
        "Считайте системное сообщение своим «уровнем политики». В работе с клиентом согласуйте его с юридическими формулировками/соответствием требованиям и создайте версию кода.",
    },
    {
      type: "heading",
      level: 2,
      content: "Шаблоны подсказок",
    },
    {
      type: "text",
      content:
        "`ChatPromptTemplate` создает списки сообщений из переменных — это безопаснее, чем ручное создание f-строк, для экранирования, повторного использования и частичного применения. Сочетайте шаблоны с моделями с помощью LCEL.",
    },
    {
      type: "code",
      language: "python",
      filename: "prompt_template.py",
      code: `from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "Ответ на {языке}. Будьте правдивы."),
    ("human", "{question}"),
])

formatted = prompt.invoke({"language": "English", "question": "Что такое РАГ?"})
# formatted.to_messages() → list of BaseMessage`,
    },
    {
      type: "heading",
      level: 2,
      content: "Анализаторы вывода и структурированный вывод",
    },
    {
      type: "text",
      content:
        "**Парсеры** преобразуют текст модели в объекты Python (JSON, списки, модели Pydantic). LangChain предоставляет StrOutputParser для обычного текста и помощники JsonOutputParser/**структурированный вывод**, которые связывают схему, чтобы модель возвращала машиночитаемые поля, что критически важно для последующих инструментов и пользовательских интерфейсов.",
    },
    {
      type: "code",
      language: "python",
      filename: "lcel_chain.py",
      code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field

class Summary(BaseModel):
    title: str = Field(description="Short title")
    bullets: list[str] = Field(description="Ключевые пункты")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# LCEL: prompt | model | parser
prompt = ChatPromptTemplate.from_messages([
    ("system", "Подведение итогов для руководителя."),
    ("human", "{text}"),
])

chain_text = prompt | llm | StrOutputParser()

# Structured output (provider-dependent; uses function/tool style under the hood)
structured_llm = llm.with_structured_output(Summary)
chain_structured = prompt | structured_llm

out = chain_structured.invoke({"text": "Длинная статья..."})
# out is a Summary instance`,
    },
    {
      type: "heading",
      level: 2,
      content: "LCEL: оператор трубопровода",
    },
    {
      type: "text",
      content:
        "**Язык выражений LangChain (LCEL)** позволяет объединять вызываемые объекты с помощью `|` в один **Runnable**. Данные передаются слева направо; LangChain может пакетировать, передавать и отслеживать график. `RunnablePassthrough.assign(...)` обычно используется для внедрения полученного контекста вместе с пользовательским запросом.",
    },
    {
      type: "diagram",
      alt: "Поток цепочки LCEL от приглашения через LLM до выходного синтаксического анализатора",
      content: `flowchart LR
  P[ChatPromptTemplate] --> M[ChatModel]
  M --> O[StrOutputParser]
  P -. variables .-> M`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "API drift",
      content:
        "Основные версии LangChain переименовывают импорт и модули. Предположим, на собеседовании вы проверяете документы на наличие закрепленной версии и закрепляете зависимости в `requirements.txt` или Poetry для воспроизводимых сборок.",
    },
  ],
  keyTakeaways: [
    "LangChain стандартизирует приложения LLM: сообщения, подсказки, модели, анализаторы и композицию, сокращая количество одноразового связующего кода.",
    "ChatModels имеют общий интерфейс; Сообщения системы/человека/ИИ четко сопоставляются с API-интерфейсами чата поставщика.",
    "Шаблоны подсказок отделяют данные от инструкций; парсеры преобразуют текст в типизированные структуры.",
    "LCEL (`|`) создает работоспособные конвейеры, подходящие для потоковой передачи, пакетной обработки и наблюдения.",
  ],
  interviewTips: [
    "Сравните «тонкую оболочку OpenAI» с «оркестрацией + интерфейсами, поддерживающими подкачку + Runnable-протоколом».",
    "Упоминайте структурированный вывод, когда интервьюер спрашивает об API-интерфейсах JSON или аргументах инструментов.",
    "Назовите один риск: магия фреймворка может скрыть ошибки — используйте ведение журнала и LangSmith (позже урок) для проверки шагов.",
    "Если вас спросят о задержке, обратите внимание, что каждый шаг `|` по-прежнему является сетевым вызовом, если вы не выполняете пакетную обработку или кэширование.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "lc01-mc-lcel",
      question:
        "Вам нужен конвейер, который форматирует вопрос пользователя с помощью системной политики, вызывает ChatOpenAI и возвращает обычный текст. Какой шаблон лучше всего соответствует идиоматическому LangChain v0.2+?",
      options: [
        "Вызов openai.ChatCompletion.create непосредственно в цикле для каждого поля.",
        "`ChatPromptTemplate | ЧатOpenAI | StrOutputParser`",
        "Подкласс BaseLLM и переопределение _call для каждого проекта.",
        "Сохраните весь разговор в одной строке и разделите его запятыми.",
      ],
      correctIndex: 1,
      explanation:
        "LCEL объединяет шаблон приглашения, модель и анализатор строк в один Runnable. Вызовы Raw SDK пропускают протокол LangChain Runnable; создание подкласса BaseLLM редко требуется для стандартного чата; Разделение разделителей хрупко по сравнению с объектами сообщений.",
      interviewNote:
        "Добавьте, что вы должны подключить обратные вызовы или трассировщик для производства и рассмотреть возможность потоковой передачи с помощью `.stream()`.",
    },
    {
      type: "code-completion",
      id: "lc01-cc-messages",
      question:
        "Завершите импорт и конструктор, чтобы сообщения были допустимыми входными данными чата для ChatOpenAI.invoke.",
      codeTemplate: `from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, ________

messages = [
    SystemMessage(content="Вы полезны."),
    ________(content="Hello!"),
]
llm = ChatOpenAI(model="gpt-4o-mini")
print(llm.invoke(messages).content)`,
      language: "python",
      correctAnswer: "HumanMessage",
      acceptableAnswers: ["HumanMessage"],
      explanation:
        "Пользователь по очереди использует HumanMessage. `AIMessage` предназначен для выходных данных модели; `SystemMessage` устанавливает политику. Импорт осуществляется из langchain_core.messages.",
      interviewNote:
        "Упомяните, что вы можете добавить историю HumanMessage в цикл для многоходового чата.",
    },
    {
      type: "ordering",
      id: "lc01-ord-runnable",
      question:
        "Упорядочите эти шаги, когда цепочка Runnable, построенная с помощью LCEL, запускает `chain.invoke({...})` (раньше сначала).",
      items: [
        "ChatModel возвращает AIMessage",
        "Синтаксический анализатор вывода преобразует AIMessage в окончательное значение Python/str.",
        "ChatPromptTemplate расширяет переменные в список сообщений",
        "Вызывающий передает набор входных переменных",
      ],
      correctOrder: [3, 2, 0, 1],
      explanation:
        "Вызов начинается с входных переменных → приглашение отображает сообщения → модель создает AIMessage → синтаксический анализатор сопоставляет тип возвращаемого значения (например, строку или структурированный объект).",
      interviewNote:
        "При потоковой передаче парсеры могут фрагментировать по-другому — скажем, вы подтвердите поведение своего парсера в документации.",
    },
    {
      type: "true-false",
      id: "lc01-tf-black-box",
      statement:
        "Использование LangChain означает, что вам никогда не придется понимать базовый формат запросов OpenAI или Anthropic API.",
      correct: false,
      explanation:
        "LangChain абстрагирует общие пути, но отладка ошибок аутентификации, ограничений скорости, схем инструментов и особенностей модели по-прежнему требует знаний поставщика. Относитесь к системе как к рычагу воздействия, а не как к черному ящику.",
      interviewNote:
        "Покажите старшинство: вы читаете необработанные запросы в трассировках, когда выходные данные выглядят неправильно.",
    },
    {
      type: "scenario",
      id: "lc01-sc-client",
      scenario:
        "Клиенту нужен микросервис, который принимает `{ \"topic\": str }` и возвращает `{ \"summary\": str, \"risk_level\": \"low\"|\"medium\"|\"high\" }` для аудиторов. Они используют OpenAI.",
      question:
        "Какие две идеи LangChain вы бы назвали в своем дизайне (по одному предложению каждая)?",
      sampleAnswer:
        "Используйте ChatOpenAI.with_structured_output с моделью Pydantic, чтобы API возвращал проверенные поля вместо текста в произвольной форме. Создайте шаблон ChatPromptTemplate с LCEL, чтобы текст политики и синтаксический анализ оставались проверяемыми и отслеживаемыми.",
      keyPoints: [
        "Структурированный вывод/привязка схемы для машиночитаемых результатов в формате JSON.",
        "Подскажите шаблон + LCEL для ремонтопригодности и наблюдаемости.",
      ],
      interviewNote:
        "Упомяните Zod или JSON Schema на границе API, если служба не поддерживает только Python.",
    },
  ],
};
