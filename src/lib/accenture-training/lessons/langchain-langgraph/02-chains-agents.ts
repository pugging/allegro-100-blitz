import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "langchain-langgraph-02",
  skillId: "langchain-langgraph",
  order: 2,
  title: "Chains, Tools & Agents",
  subtitle:
    "Composing runnables into chains, parallel steps, tool definitions, ReAct-style agents, function calling, execution loops, streaming, and callbacks.",
  estimatedMinutes: 18,
  objectives: [
    "Describe chains versus single LLM calls and when to use RunnableSequence vs RunnableParallel.",
    "Define tools with the `@tool` decorator and wire built-in or custom tools to a model.",
    "Explain the ReAct pattern and how tool calling maps to OpenAI-style function schemas.",
    "Outline streaming and callbacks for UX and observability in agent loops.",
  ],
  content: [
    {
      type: "text",
      content:
        "A **chain** is a composed **Runnable** pipeline: prompt → model → parser, or more complex graphs with branches. LangChain encourages small, testable steps you can swap (e.g. swap retriever implementation) without rewriting orchestration code.",
    },
    {
      type: "heading",
      level: 2,
      content: "RunnableSequence and RunnableParallel",
    },
    {
      type: "text",
      content:
        "**RunnableSequence** (often written with `|`) runs steps in order, passing the previous output forward. **RunnableParallel** runs independent steps with the same input dict and merges outputs—ideal for \"retrieve + classify + rewrite\" fan-out patterns before a final merge step.",
    },
    {
      type: "code",
      language: "python",
      filename: "runnable_parallel.py",
      code: `from langchain_core.runnables import RunnableParallel, RunnablePassthrough

# fan-out: keep original input and add two derived fields
chain = RunnableParallel(
    question=RunnablePassthrough(),
    context=lambda x: fake_retrieve(x["question"]),
    language=lambda x: detect_lang(x["question"]),
)

def fake_retrieve(q: str) -> str:
    return "doc snippets..."

def detect_lang(q: str) -> str:
    return "en"

out = chain.invoke({"question": "Refund policy?"})
# {"question": {...}, "context": "...", "language": "en"}`,
    },
    {
      type: "heading",
      level: 2,
      content: "Tools: built-in patterns",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Web search**: delegate to Tavily, SerpAPI, or Bing—wrap as a tool returning summarized snippets.",
        "**Calculator / code**: sandboxed eval or SymPy-style math—expose only safe operations in production.",
        "**Retriever**: wrap `vector_store.as_retriever()` as a tool so the agent decides when to fetch context.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Security",
      content:
        "Tools are arbitrary Python. In enterprise settings, enforce authz, input validation, and rate limits per tool. Never expose raw SQL or shell without hard guardrails.",
    },
    {
      type: "heading",
      level: 2,
      content: "Custom tools with @tool",
    },
    {
      type: "code",
      language: "python",
      filename: "custom_tool.py",
      code: `from langchain_core.tools import tool

@tool
def crm_lookup(account_id: str) -> str:
    """Fetch account status from CRM by opaque account id."""
    # call internal API with service credentials
    return "status=active tier=gold"

@tool
def sum_numbers(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b

tools = [crm_lookup, sum_numbers]`,
    },
    {
      type: "tip",
      content:
        "Docstrings become the tool description sent to the model—write them like API docs: what it does, args, and failure behavior.",
    },
    {
      type: "heading",
      level: 2,
      content: "Agents and ReAct",
    },
    {
      type: "text",
      content:
        "An **agent** lets the model choose **actions** (tool calls) iteratively. **ReAct** (Reason + Act) interleaves thought-like narration, tool calls, and observations until a stop condition. Modern chat models often use **native tool / function calling** instead of parsing \"Action:\" lines from free text—more reliable for production.",
    },
    {
      type: "heading",
      level: 2,
      content: "Tool calling with OpenAI functions",
    },
    {
      type: "text",
      content:
        "OpenAI-compatible models return `tool_calls` on the assistant message. LangChain’s agent executor binds tools to the model, executes the requested tool, appends a **ToolMessage**, and loops until the model responds without tools or hits max iterations.",
    },
    {
      type: "code",
      language: "python",
      filename: "agent_react.py",
      code: `# Conceptual pattern (imports vary by langchain version)
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Use tools when needed. If unsure, ask a clarifying question."),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

# tools = [crm_lookup, ...]
# agent = create_tool_calling_agent(llm, tools, prompt)
# executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
# result = executor.invoke({"input": "What's the status for ACC-123?", "chat_history": []})`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Interview angle",
      content:
        "Be ready to compare **single-shot RAG** (always retrieve) vs **agentic retrieval** (model decides when to call the retriever tool). Agents add flexibility and risk—loops, cost, and harder evaluation.",
    },
    {
      type: "heading",
      level: 2,
      content: "Streaming and callbacks",
    },
    {
      type: "text",
      content:
        "**Streaming** (`astream_events` or model `.stream`) improves perceived latency for chat UIs. **Callbacks** hook into chain lifecycle events for logging, metrics, and token counting—pair with LangSmith or OpenTelemetry in real systems.",
    },
    {
      type: "diagram",
      alt: "Agent loop with model tool calls and tool execution feeding back ToolMessages",
      content: `flowchart TD
  U[User input] --> A[Agent / LLM]
  A -->|tool_calls| T[Tool execution]
  T --> TM[ToolMessage results]
  TM --> A
  A -->|final text| R[Response]`,
    },
  ],
  keyTakeaways: [
    "Chains compose Runnables; parallel steps reduce latency when tasks are independent.",
    "Tools are typed, documented callables—retrieval, search, and domain APIs are common.",
    "Agents loop: model proposes tools, runtime executes, results return as ToolMessages.",
    "Streaming and callbacks matter for UX and production observability.",
  ],
  interviewTips: [
    "State a stop policy: max iterations, timeouts, and fallback to human handoff.",
    "Compare text-parsed ReAct vs native function calling for reliability.",
    "Mention cost: each loop may invoke the model again—budget tokens per session.",
    "Tie tools to authorization: the LLM proposes; the backend still enforces ACLs.",
  ],
  exercises: [
    {
      type: "ordering",
      id: "lc02-ord-agent",
      question:
        "Order the typical first iteration of a tool-calling agent turn (earliest first).",
      items: [
        "Runtime executes the tool and wraps output in a ToolMessage",
        "Model returns an AIMessage with tool_calls",
        "User sends HumanMessage with a task",
        "Model receives updated message list including ToolMessage",
      ],
      correctOrder: [2, 1, 0, 3],
      explanation:
        "User message → model proposes tool_calls → runtime runs tools → ToolMessages are appended → model called again with full history.",
      interviewNote:
        "Note parallel tool_calls if the model batches multiple tools in one turn.",
    },
    {
      type: "multiple-choice",
      id: "lc02-mc-parallel",
      question:
        "You need to run embedding a query and fetching user profile from cache concurrently before merging into one prompt. Which Runnable fits best?",
      options: [
        "A single `StrOutputParser`",
        "`RunnableParallel` with named branches",
        "`HumanMessage` only",
        "A while-loop that calls `input()`",
      ],
      correctIndex: 1,
      explanation:
        "`RunnableParallel` executes branches over the same input and combines outputs. Parsers handle output shape, not concurrency; HumanMessage is a message type; stdin loops are unrelated.",
      interviewNote:
        "Mention thread pools or async runnables if I/O-bound and your stack supports it.",
    },
    {
      type: "true-false",
      id: "lc02-tf-shell",
      statement:
        "In production, it is always safer to give an agent unrestricted shell access so it can fix its own errors.",
      correct: false,
      explanation:
        "Unrestricted shell is high risk (data exfiltration, destructive commands). Prefer allow-listed tools, sandboxed execution, and human approval for sensitive operations.",
      interviewNote:
        "Accenture clients often require audit trails—tie actions to service accounts, not end-user shells.",
    },
    {
      type: "code-completion",
      id: "lc02-cc-tool",
      question:
        "Complete the decorator that registers `lookup_policy` as a LangChain tool.",
      codeTemplate: `from langchain_core.tools import ________

@________
def lookup_policy(topic: str) -> str:
    """Return internal policy text for a topic keyword."""
    return "Policy: ..."
`,
      language: "python",
      correctAnswer: "tool",
      acceptableAnswers: ["tool"],
      explanation:
        "`@tool` (from `langchain_core.tools`) wraps a function with name, description, and args schema inferred from the signature.",
      interviewNote:
        "If asked about typing, mention Annotated and Field for richer JSON schemas.",
    },
    {
      type: "scenario",
      id: "lc02-sc-support",
      scenario:
        "A support bot can search a KB (retriever tool), create a ticket (API tool), and escalate to a human (tool that posts to Slack). The model sometimes calls `create_ticket` before searching the KB.",
      question:
        "What two controls would you propose (policy + technical)?",
      sampleAnswer:
        "Policy: update the system prompt to require KB search first unless the user explicitly requests a ticket. Technical: add a lightweight router chain or state machine (LangGraph in the next lesson) that enforces \"search before ticket\" edges, plus max-iteration and logging on tool calls.",
      keyPoints: [
        "Prompt/system rules for ordering preferences.",
        "Explicit graph or guard middleware—not only prompt hope.",
      ],
      interviewNote:
        "Mention evaluation: log traces where ticket fires without retrieval and fix with tests.",
    },
  ],
};
