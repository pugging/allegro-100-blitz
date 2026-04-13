import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "langchain-langgraph-01",
  skillId: "langchain-langgraph",
  order: 1,
  title: "LangChain Fundamentals",
  subtitle:
    "What LangChain is, why orchestration frameworks matter, core abstractions (models, messages, prompts, parsers), and composing logic with LCEL.",
  estimatedMinutes: 18,
  objectives: [
    "Explain what LangChain provides versus calling provider SDKs directly.",
    "Use ChatModels and message types (system, human, AI) in Python.",
    "Build prompts with templates and parse model output into structured data.",
    "Compose runnables with LCEL pipe syntax and optional structured output.",
  ],
  content: [
    {
      type: "text",
      content:
        "**LangChain** is an open-source framework for building applications with large language models. It standardizes how you wire models, prompts, memory, tools, and retrieval so teams can ship prototypes faster and refactor toward production patterns (tracing, streaming, retries) without rewriting everything from scratch.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Why frameworks matter in interviews",
      content:
        "Interviewers care that you can articulate trade-offs: LangChain reduces boilerplate and offers composable \"runnables,\" but adds abstraction weight and moving APIs. A strong answer names when you would drop to raw OpenAI/Anthropic SDKs (tight latency, minimal deps) vs when orchestration pays off (RAG, agents, eval hooks).",
    },
    {
      type: "heading",
      level: 2,
      content: "Installation and environment",
    },
    {
      type: "text",
      content:
        "Install the packages for your provider(s). LangChain splits functionality across `langchain-core` (shared types), integration packages (e.g. `langchain-openai`), and optional extras. Always load API keys from environment variables—never commit secrets.",
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
      content: "ChatModels: ChatOpenAI and ChatAnthropic",
    },
    {
      type: "text",
      content:
        "**Chat models** consume a list of **messages** and return an **AIMessage**. `ChatOpenAI` and `ChatAnthropic` are thin adapters over vendor APIs with a shared interface (`invoke`, `stream`, `batch`), so swapping providers is mostly a constructor change.",
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
    SystemMessage(content="You are a concise solution architect."),
    HumanMessage(content="Explain vector search in two sentences."),
]

ai_msg = llm_openai.invoke(messages)
print(ai_msg.content)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Messages and roles",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**SystemMessage**: high-level instructions, tone, and safety rules—kept stable across turns when possible.",
        "**HumanMessage**: end-user input (or simulated user in tests).",
        "**AIMessage**: model output; may include tool calls in modern function-calling models.",
        "**ToolMessage** (later lessons): results fed back after tool execution.",
      ],
    },
    {
      type: "tip",
      content:
        "Treat the system message as your \"policy layer.\" In client work, align it with legal/compliance wording and version it like code.",
    },
    {
      type: "heading",
      level: 2,
      content: "Prompt templates",
    },
    {
      type: "text",
      content:
        "`ChatPromptTemplate` builds message lists from variables—safer than manual f-strings for escaping, reuse, and partial application. Pair templates with models using LCEL.",
    },
    {
      type: "code",
      language: "python",
      filename: "prompt_template.py",
      code: `from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer in {language}. Be factual."),
    ("human", "{question}"),
])

formatted = prompt.invoke({"language": "English", "question": "What is RAG?"})
# formatted.to_messages() → list of BaseMessage`,
    },
    {
      type: "heading",
      level: 2,
      content: "Output parsers and structured output",
    },
    {
      type: "text",
      content:
        "**Parsers** turn model text into Python objects (JSON, lists, Pydantic models). LangChain provides `StrOutputParser` for plain text and `JsonOutputParser` / **structured output** helpers that bind a schema so the model returns machine-readable fields—critical for downstream tools and UIs.",
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
    bullets: list[str] = Field(description="Key bullet points")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# LCEL: prompt | model | parser
prompt = ChatPromptTemplate.from_messages([
    ("system", "Summarize for an executive."),
    ("human", "{text}"),
])

chain_text = prompt | llm | StrOutputParser()

# Structured output (provider-dependent; uses function/tool style under the hood)
structured_llm = llm.with_structured_output(Summary)
chain_structured = prompt | structured_llm

out = chain_structured.invoke({"text": "Long article ..."})
# out is a Summary instance`,
    },
    {
      type: "heading",
      level: 2,
      content: "LCEL: the pipe operator",
    },
    {
      type: "text",
      content:
        "**LangChain Expression Language (LCEL)** lets you compose callables with `|` into a single **Runnable**. Data flows left to right; LangChain can batch, stream, and trace the graph. `RunnablePassthrough.assign(...)` is common for injecting retrieved context alongside the user query.",
    },
    {
      type: "diagram",
      alt: "LCEL chain flow from prompt through LLM to output parser",
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
        "LangChain major versions rename imports and modules. In interviews, say you verify docs for your pinned version and pin dependencies in `requirements.txt` or Poetry for reproducible builds.",
    },
  ],
  keyTakeaways: [
    "LangChain standardizes LLM apps: messages, prompts, models, parsers, and composition—reducing one-off glue code.",
    "ChatModels share an interface; system/human/AI messages map cleanly to provider chat APIs.",
    "Prompt templates separate data from instructions; parsers turn text into typed structures.",
    "LCEL (`|`) builds Runnable pipelines suitable for streaming, batching, and observability.",
  ],
  interviewTips: [
    "Contrast \"thin wrapper around OpenAI\" vs \"orchestration + swap-friendly interfaces + Runnable protocol.\"",
    "Mention structured output when the interviewer asks about JSON APIs or tool arguments.",
    "Name one risk: framework magic can hide errors—use logging and LangSmith (later lesson) to inspect steps.",
    "If asked about latency, note each `|` step is still a network call unless you batch or cache.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "lc01-mc-lcel",
      question:
        "You need a pipeline that formats a user question with a system policy, calls `ChatOpenAI`, and returns plain text. Which pattern best matches idiomatic LangChain v0.2+?",
      options: [
        "Call `openai.ChatCompletion.create` directly in a loop for each field",
        "`ChatPromptTemplate | ChatOpenAI | StrOutputParser`",
        "Subclass `BaseLLM` and override `_call` for every project",
        "Store the entire conversation in one string and split on commas",
      ],
      correctIndex: 1,
      explanation:
        "LCEL composes a prompt template, model, and string parser into one Runnable. Raw SDK calls skip LangChain’s Runnable protocol; subclassing BaseLLM is rarely needed for standard chat; delimiter-splitting is fragile compared to message objects.",
      interviewNote:
        "Add that you would attach callbacks or a tracer for production and consider streaming with `.stream()`.",
    },
    {
      type: "code-completion",
      id: "lc01-cc-messages",
      question:
        "Complete the import and constructor so `messages` is a valid chat input for `ChatOpenAI.invoke`.",
      codeTemplate: `from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, ________

messages = [
    SystemMessage(content="You are helpful."),
    ________(content="Hello!"),
]
llm = ChatOpenAI(model="gpt-4o-mini")
print(llm.invoke(messages).content)`,
      language: "python",
      correctAnswer: "HumanMessage",
      acceptableAnswers: ["HumanMessage"],
      explanation:
        "User turns use `HumanMessage`. `AIMessage` is for model outputs; `SystemMessage` sets policy. Imports come from `langchain_core.messages`.",
      interviewNote:
        "Mention you might add `HumanMessage` history in a loop for multi-turn chat.",
    },
    {
      type: "ordering",
      id: "lc01-ord-runnable",
      question:
        "Order these steps when a Runnable chain built with LCEL runs `chain.invoke({...})` (earliest first).",
      items: [
        "ChatModel returns an AIMessage",
        "Output parser converts the AIMessage to the final Python/str value",
        "ChatPromptTemplate expands variables into a message list",
        "Caller passes a dict of input variables",
      ],
      correctOrder: [3, 2, 0, 1],
      explanation:
        "Invoke starts with input variables → prompt renders messages → model produces AIMessage → parser maps to the return type (e.g. string or structured object).",
      interviewNote:
        "If streaming, parsers may chunk differently—say you’d confirm behavior for your parser in docs.",
    },
    {
      type: "true-false",
      id: "lc01-tf-black-box",
      statement:
        "Using LangChain means you never need to understand the underlying OpenAI or Anthropic API request format.",
      correct: false,
      explanation:
        "LangChain abstracts common paths, but debugging auth errors, rate limits, tool schemas, and model-specific quirks still requires provider knowledge. Treat the framework as leverage, not a black box.",
      interviewNote:
        "Show seniority: you read raw requests in traces when outputs look wrong.",
    },
    {
      type: "scenario",
      id: "lc01-sc-client",
      scenario:
        "A client wants a microservice that accepts `{ \"topic\": str }` and returns `{ \"summary\": str, \"risk_level\": \"low\"|\"medium\"|\"high\" }` for auditors. They use OpenAI.",
      question:
        "Which two LangChain ideas would you name in your design (one sentence each)?",
      sampleAnswer:
        "Use `ChatOpenAI.with_structured_output` with a Pydantic model so the API returns validated fields instead of free-form text. Compose a `ChatPromptTemplate` with LCEL so the policy text and parsing stay testable and traceable.",
      keyPoints: [
        "Structured output / schema binding for machine-readable JSON-like results.",
        "Prompt template + LCEL for maintainability and observability.",
      ],
      interviewNote:
        "Mention Zod or JSON Schema on the API boundary if the service is not Python-only.",
    },
  ],
};
