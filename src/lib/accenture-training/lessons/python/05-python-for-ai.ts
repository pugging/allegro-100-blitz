import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "python-05",
  skillId: "python",
  order: 5,
  title: "Python for AI & Data",
  subtitle:
    "NumPy, Pandas, HTTP, and async patterns — the everyday toolkit for GenAI prototypes and production adapters.",
  estimatedMinutes: 15,
  objectives: [
    "Load and shape numeric and tabular data with NumPy and Pandas.",
    "Read JSON and CSV safely from disk or APIs.",
    "Call REST APIs with requests and understand async/await for concurrent I/O.",
    "Navigate the ecosystem (OpenAI SDK, LangChain, notebooks) with clear boundaries.",
  ],
  content: [
    {
      type: "text",
      content:
        "Most GenAI engineering is glue: fetch context, batch embeddings, join retrieval scores, stream tokens to a client. Python’s data and HTTP stacks are where that glue lives before frameworks like LangChain orchestrate higher-level flows.",
    },
    {
      type: "heading",
      level: 2,
      content: "NumPy essentials",
    },
    {
      type: "text",
      content:
        "NumPy gives contiguous numeric arrays and vectorized operations implemented in C. You will see NumPy arrays behind PyTorch tensors, scikit-learn features, and many embedding utilities.",
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
      content: "Pandas for tables",
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
      title: "Interview angle",
      content:
        "Be ready to describe vectorized Pandas operations vs. Python loops over rows — interviewers probe awareness of performance cliffs when preprocessing millions of rows.",
    },
    {
      type: "heading",
      level: 2,
      content: "JSON and CSV I/O",
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
      content: "HTTP with requests",
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
      title: "Secrets",
      content:
        "Never hardcode API keys in source control. Use environment variables, secret managers, or platform-injected config (Azure Key Vault, AWS Secrets Manager).",
    },
    {
      type: "heading",
      level: 2,
      content: "async/await for concurrent I/O",
    },
    {
      type: "text",
      content:
        "asyncio lets one thread interleave network waits. Frameworks like FastAPI and libraries like httpx (async mode) fit GenAI gateways that fan out to multiple retrieval sources.",
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
      content: "Ecosystem: notebooks and SDKs",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Jupyter / VS Code notebooks: great for exploration; move stable code into importable modules for production.",
        "openai / anthropic / google-generativeai SDKs: thin typed clients over HTTPS — learn their retry and streaming APIs.",
        "LangChain / LangGraph: composition layers; understand when raw SDK calls are simpler than framework indirection.",
      ],
    },
    {
      type: "diagram",
      alt: "Data path from files and APIs through Python into model calls",
      content: `flowchart LR
  CSV[CSV JSON files] --> P[Pandas json]
  API[REST API] --> R[requests or httpx]
  P --> T[Tokenize chunk]
  R --> T
  T --> M[Model SDK]
  M --> S[Stream or batch response]`,
    },
    {
      type: "tip",
      content:
        "For take-home tasks, a clean `src/` package plus a minimal `notebooks/` that imports from `src` impresses reviewers more than a single giant notebook.",
    },
  ],
  keyTakeaways: [
    "Prefer vectorized NumPy/Pandas over Python loops for numeric and tabular work at scale.",
    "Always set timeouts and call raise_for_status() (or equivalent) on HTTP clients.",
    "asyncio.gather patterns map directly to parallel retrieval in RAG pipelines.",
    "Treat notebooks as scratchpads; promote reusable logic into tested modules.",
  ],
  interviewTips: [
    "If asked about batching embeddings, mention array shapes, dtype, and memory footprint.",
    "Contrast sync requests in scripts vs. async httpx in high-concurrency services.",
    "Name a few packages honestly (what you have used) rather than listing every trending repo.",
  ],
  exercises: [
    {
      type: "code-completion",
      id: "py05-cc-pandas",
      question:
        "Given a DataFrame `df` with a column \"score\", complete the method call to sort descending and keep the first 5 rows.",
      codeTemplate: `top5 = df.sort_values("score", ascending=False).________`,
      language: "python",
      correctAnswer: "head(5)",
      acceptableAnswers: ["head( 5 )"],
      explanation:
        "sort_values orders rows; head(5) slices the top five. iloc[:5] is an alternative after reset_index if you rely on position.",
      interviewNote:
        "Mention that head does not copy the full frame — it returns a view-like slice depending on pandas version; for interviews, head is the expected answer.",
    },
    {
      type: "multiple-choice",
      id: "py05-mc-async",
      question:
        "In asyncio, why is asyncio.gather preferred over sequential await calls when fetching independent documents?",
      options: [
        "gather runs CPU-bound compression in parallel threads",
        "gather schedules I/O-bound tasks concurrently on one thread, reducing wall-clock wait",
        "gather bypasses the GIL entirely for Python dict access",
        "gather automatically uses multiprocessing for each task",
      ],
      correctIndex: 1,
      explanation:
        "asyncio cooperatively schedules tasks while awaiting I/O. Independent network fetches overlap in time. CPU-bound work still needs processes or native libraries — gather does not magically parallelize CPU.",
      interviewNote:
        "Tie to retrieving multiple URLs or DB rows before merging context for an LLM.",
    },
    {
      type: "true-false",
      id: "py05-tf-requests-json",
      statement:
        "After `resp = requests.get(url)`, calling `resp.json()` always succeeds without extra checks if the HTTP status code is 200.",
      correct: false,
      explanation:
        "A 200 response can still return non-JSON bodies. Use resp.raise_for_status() and wrap json() in try/except or check Content-Type. Some APIs return 200 with error payloads.",
      interviewNote:
        "Mention streaming SSE endpoints where .json() is inappropriate.",
    },
    {
      type: "ordering",
      id: "py05-ord-ml-pipeline",
      question:
        "Order these steps for a minimal offline RAG evaluation script (first to last).",
      items: [
        "Compute metrics (e.g. exact match or LLM-judge) and write results",
        "Load questions and gold answers from JSONL",
        "Retrieve top-k chunks per question from a vector index",
        "For each question, call the LLM with retrieved context",
      ],
      correctOrder: [1, 2, 3, 0],
      explanation:
        "Load data → retrieve context → generate answers → score and persist. Skipping retrieval before generation breaks the RAG assumption.",
      interviewNote:
        "Shows you understand end-to-end evaluation, not only API calls.",
    },
    {
      type: "scenario",
      id: "py05-sc-key",
      scenario:
        "You must commit a small Python CLI to GitHub that calls an OpenAI-compatible endpoint. The repo is public.",
      question:
        "Where should the API key live, and how does the script read it at runtime?",
      sampleAnswer:
        "Never commit the key. Store it in an environment variable (e.g. OPENAI_API_KEY). In Python, read os.environ[\"OPENAI_API_KEY\"] or use python-dotenv locally with .env listed in .gitignore. In CI/CD, inject the secret from the platform’s secret store.",
      keyPoints: [
        "Environment variables or secret managers — not source files.",
        ".env for local dev only, gitignored.",
        "Document the variable name in README without example values.",
      ],
      interviewNote:
        "Security hygiene is a common GenAI platform screen — answer crisply.",
    },
  ],
};
