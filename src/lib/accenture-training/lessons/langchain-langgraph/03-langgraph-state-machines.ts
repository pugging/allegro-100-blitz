import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "langchain-langgraph-03",
  skillId: "langchain-langgraph",
  order: 3,
  title: "LangGraph: Stateful Workflows",
  subtitle:
    "Why graphs beat one-shot chains for control flow, typed state, nodes and edges, conditional routing, memory, human-in-the-loop, and checkpointing.",
  estimatedMinutes: 17,
  objectives: [
    "Contrast linear LCEL chains with explicit state machines in LangGraph.",
    "Define graph state, nodes, edges, and conditional edges for branching logic.",
    "Sketch human-in-the-loop and checkpointing for durable, reviewable runs.",
    "Outline a multi-step agent as a graph with clear termination conditions.",
  ],
  content: [
    {
      type: "text",
      content:
        "**LangGraph** (built on LangChain Runnable concepts) models workflows as graphs with **shared state** and **nodes** that read/update that state. When \"just chain prompts\" hides branching, retries, approvals, or long-running memory, graphs make the control flow explicit—easier to test, debug, and explain to stakeholders.",
    },
    {
      type: "callout",
      variant: "info",
      title: "When interviewers push back",
      content:
        "Say: \"Chains are great for ETL-style LLM pipelines; graphs shine when business rules need branches, human gates, or persistence across sessions.\" That shows you match the tool to the problem.",
    },
    {
      type: "heading",
      level: 2,
      content: "Limitations of simple chains",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Implicit loops in agents can be opaque—hard to enforce \"always validate before send.\"",
        "Conditional behavior stuffed into prompts is brittle compared to code-level routing.",
        "Long-running workflows need checkpoints and resume—not just a single `invoke`.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "State management",
    },
    {
      type: "text",
      content:
        "LangGraph typically uses a **TypedDict** or Pydantic model for **state**: e.g. `messages`, `plan`, `retrieved_docs`, `human_approved`. Reducers (like message append) define how concurrent updates merge. Clear state is the contract between nodes.",
    },
    {
      type: "heading",
      level: 2,
      content: "StateGraph: nodes and edges",
    },
    {
      type: "text",
      content:
        "A **StateGraph** registers **nodes** (Python callables that receive state and return partial state updates) and **edges** between them. **Conditional edges** read state and choose the next node—e.g. \"if tool_calls then tools node else end.\"",
    },
    {
      type: "code",
      language: "python",
      filename: "langgraph_sketch.py",
      code: `# Illustrative LangGraph-style sketch (API names may vary slightly by version)
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

class State(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

def chatbot(state: State) -> dict:
    # call model with state["messages"], return new AIMessage
    return {"messages": [AIMessage(content="stub reply")]}

def should_continue(state: State) -> str:
    last = state["messages"][-1]
    if getattr(last, "tool_calls", None):
        return "tools"
    return END

builder = StateGraph(State)
builder.add_node("agent", chatbot)
# builder.add_node("tools", tool_node)
# builder.add_edge("tools", "agent")
builder.set_entry_point("agent")
# builder.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})

# graph = builder.compile(checkpointer=...)  # for persistence`,
    },
    {
      type: "heading",
      level: 2,
      content: "Simple chatbot with memory",
    },
    {
      type: "text",
      content:
        "Thread **checkpointers** (in-memory, SQLite, Postgres) store state per `thread_id`. That gives you **conversation memory** across invocations without manually passing lists—critical for customer support and copilots.",
    },
    {
      type: "tip",
      content:
        "Treat `thread_id` like a session key: stable for a user chat, unique per ticket, never trust client-supplied IDs without auth.",
    },
    {
      type: "heading",
      level: 2,
      content: "Human-in-the-loop patterns",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Pause graph before irreversible actions (send email, file ticket, payment).",
        "Surface proposed tool args to a reviewer UI; resume with `Command` or graph API when approved.",
        "Log who approved and when for compliance.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Checkpointing and durability",
    },
    {
      type: "text",
      content:
        "**Checkpointers** persist snapshots after each super-step so you can **resume** after crashes or await human input. In Accenture-style delivery, pair checkpoints with idempotent tools so retries do not double-charge clients.",
    },
    {
      type: "diagram",
      alt: "StateGraph with agent node, conditional edge to tools or end, and checkpoint persistence",
      content: `flowchart LR
  START([start]) --> A[agent node]
  A --> C{tool_calls?}
  C -->|yes| T[tools node]
  T --> A
  C -->|no| E([END])
  A -. snapshot .-> P[(checkpointer)]`,
    },
    {
      type: "callout",
      variant: "success",
      title: "Practical multi-step agent",
      content:
        "Pattern: retrieve → grade relevance → if low, rewrite query and retrieve again → generate answer → optional critique node. Each box is a node; conditional edges encode thresholds instead of burying logic in one mega-prompt.",
    },
  ],
  keyTakeaways: [
    "LangGraph makes control flow and state explicit—better for approvals, branching, and retries than a single linear chain.",
    "State is typed; reducers define how updates merge (e.g. message lists).",
    "Conditional edges implement routers, tool loops, and termination.",
    "Checkpointers enable memory, human-in-the-loop, and durable execution.",
  ],
  interviewTips: [
    "Draw a three-node graph on the whiteboard: plan → act → verify.",
    "Mention idempotency keys for tool side effects when discussing checkpoints.",
    "Compare cost: more nodes can mean more LLM calls—justify each node.",
    "Reference LangSmith traces to show how you debug graph transitions.",
  ],
  exercises: [
    {
      type: "true-false",
      id: "lc03-tf-prompts",
      statement:
        "LangGraph eliminates the need for any prompt engineering because routing is entirely in Python.",
      correct: false,
      explanation:
        "Graphs structure control flow; prompts still steer node behavior, tool use, and output quality. The win is combining explicit code gates with good prompts.",
      interviewNote:
        "Emphasize hybrid: code for policy, prompts for language and nuance.",
    },
    {
      type: "multiple-choice",
      id: "lc03-mc-checkpoint",
      question:
        "You must allow a manager to approve an outbound email drafted by the model before it sends. Which LangGraph capability is most central?",
      options: [
        "Discarding all message history between turns",
        "Checkpointing with interrupt/resume and human review",
        "Using only `StrOutputParser`",
        "Setting temperature to 2.0",
      ],
      correctIndex: 1,
      explanation:
        "Human-in-the-loop flows rely on pausing execution, persisting state, and resuming after approval. Temperature and parsers do not solve gating; wiping history harms context.",
      interviewNote:
        "Mention audit logs and immutable approval records for regulated clients.",
    },
    {
      type: "code-completion",
      id: "lc03-cc-state",
      question:
        "Complete the TypedDict key that commonly holds the conversation transcript in LangGraph examples using `add_messages`.",
      codeTemplate: `from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

class State(TypedDict):
    ________: Annotated[list[BaseMessage], add_messages]
`,
      language: "python",
      correctAnswer: "messages",
      acceptableAnswers: ["messages"],
      explanation:
        "`messages` with `add_messages` is the standard reducer pattern so new turns append rather than replace the list.",
      interviewNote:
        "If asked about other keys, mention custom fields like `retries` or `user_id`.",
    },
    {
      type: "ordering",
      id: "lc03-ord-compile",
      question:
        "Order these steps when building a minimal LangGraph `StateGraph` (earliest first).",
      items: [
        "`compile()` to produce a runnable graph (optionally with checkpointer)",
        "Define the state schema (e.g. TypedDict)",
        "Add nodes and edges (including entry and conditional edges)",
        "Instantiate `StateGraph(State)`",
      ],
      correctOrder: [1, 3, 2, 0],
      explanation:
        "Define state → create graph object → register nodes/edges → compile into an executable app.",
      interviewNote:
        "Note that `compile` is where checkpointer and debug hooks attach.",
    },
    {
      type: "scenario",
      id: "lc03-sc-compliance",
      scenario:
        "A compliance workflow must: (1) extract clauses from a contract PDF, (2) compare against a policy KB, (3) if confidence < 0.8, route to a human reviewer, (4) otherwise auto-summarize risks.",
      question:
        "How would LangGraph structure this differently from one long chain.invoke?",
      sampleAnswer:
        "Model each stage as a node with explicit state fields for extractions, scores, and reviewer notes. Use conditional edges on the confidence score to branch to a human node that interrupts, stores approval in state, then continues. Checkpoint after each major step so retries do not re-run expensive PDF parsing.",
      keyPoints: [
        "Branching on numeric confidence in code, not only prose prompts.",
        "Human node + interrupt for low-confidence paths.",
        "Checkpointing expensive upstream steps.",
      ],
      interviewNote:
        "Mention measuring confidence with a separate evaluator model or rules-based checks.",
    },
  ],
};
