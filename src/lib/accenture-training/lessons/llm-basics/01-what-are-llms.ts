import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "llm-basics-01",
  skillId: "llm-basics",
  order: 1,
  title: "What Are Large Language Models?",
  subtitle:
    "From the AI stack to tokens and sampling — the vocabulary and mechanics you need to discuss LLMs credibly in a GenAI engineering interview.",
  estimatedMinutes: 18,
  objectives: [
    "Place LLMs within AI, machine learning, and deep learning and explain what a language model optimizes for.",
    "Describe pre-training, fine-tuning, and RLHF at a level accurate enough for system-design discussion.",
    "Compare major model families (GPT, Claude, Llama) and relate parameter count to capacity versus cost.",
    "Contrast training and inference, and explain tokens, temperature, top-p, and context windows with real deployment implications.",
  ],
  content: [
    {
      type: "text",
      content:
        "A **large language model (LLM)** is a deep neural network trained to predict the next token (or a masked token) over vast text. At inference time it generates text **autoregressively**: each predicted token is fed back as input for the next step. You do not need to derive backpropagation on a whiteboard, but you must speak clearly about **data**, **objectives**, **scale**, and **runtime behavior** — that is what Accenture GenAI engineering screeners expect.",
    },
    {
      type: "callout",
      variant: "info",
      title: "How this maps to client work",
      content:
        "On engagements you will choose models (API vs open-weight), estimate latency and cost from token usage, and explain trade-offs to architects and risk stakeholders. This lesson gives you the shared language for those conversations.",
    },
    {
      type: "heading",
      level: 2,
      content: "AI, machine learning, and deep learning",
    },
    {
      type: "text",
      content:
        "**Artificial intelligence** is the broad goal of systems that exhibit useful intelligent behavior. **Machine learning** is a subset where behavior improves from data rather than only hand-written rules. **Deep learning** uses stacked neural layers (often transformers for LLMs) to learn representations; scale and data made modern LLMs possible. LLMs are one application of deep learning focused on **sequences of discrete tokens** (text).",
    },
    {
      type: "diagram",
      alt: "Hierarchy from AI to LLMs",
      content: `flowchart TB
  AI[Artificial Intelligence]
  ML[Machine Learning]
  DL[Deep Learning]
  LLM[Large Language Models]
  AI --> ML
  ML --> DL
  DL --> LLM`,
    },
    {
      type: "heading",
      level: 2,
      content: "What is a language model?",
    },
    {
      type: "text",
      content:
        "A **language model** assigns probabilities to token sequences. A causal (autoregressive) model learns P(token_t | token_1, …, token_{t-1}). Training minimizes prediction error over billions of examples so the model internalizes grammar, facts, reasoning patterns, and style from the corpus. **Generation** is repeated sampling from that conditional distribution.",
    },
    {
      type: "tip",
      content:
        "In interviews, say explicitly that an LLM does not \"look up\" answers in a database unless you add retrieval (RAG); it completes likely continuations given the prompt and weights.",
    },
    {
      type: "heading",
      level: 2,
      content: "Training data and the training stack",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "**Pre-training**: Next-token prediction on large mixed corpora (web, books, code, etc.). Builds broad linguistic and world knowledge but can include noise and bias from the sources.",
        "**Supervised fine-tuning (SFT)**: Train on curated prompt–response pairs so the model follows instructions and formats (e.g. chat, JSON).",
        "**Alignment (e.g. RLHF / preference tuning)**: Human or AI feedback ranks outputs so the model is more helpful, honest, and harmless — reduces toxic or undesired behavior but does not guarantee factual perfection.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Precision matters",
      content:
        "RLHF shapes preferences; it does not replace factual grounding. Many \"hallucination\" issues in production are treated with RAG, tool use, or policy layers — covered in a later lesson.",
    },
    {
      type: "heading",
      level: 2,
      content: "Model families you should name-check",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**GPT** (OpenAI): Decoder-only transformer family; widely used via API. Strong general reasoning and tool integration in recent versions.",
        "**Claude** (Anthropic): Competitive frontier models with emphasis on long context and safety training; common in enterprise via API.",
        "**Llama** (Meta, open weights): Popular for on-prem, fine-tuning, and cost control; ecosystem includes many derivatives (e.g. Mistral, community fine-tunes).",
      ],
    },
    {
      type: "heading",
      level: 3,
      content: "Parameters and \"size\"",
    },
    {
      type: "text",
      content:
        "**Parameters** are learned weights. Larger models (e.g. 7B, 70B, 400B+) tend to store more patterns and reason better but cost more VRAM, latency, and money. In practice you match model size to **latency SLO**, **budget**, and **privacy** (smaller open models on VPC vs public API).",
    },
    {
      type: "heading",
      level: 2,
      content: "Training vs inference",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Training / fine-tuning**: Updates weights; needs GPUs/TPUs, large datasets, and careful MLOps. Done rarely compared to inference for many products.",
        "**Inference**: Forward passes with frozen weights to serve users. Dominated by memory bandwidth, batching, KV-cache optimization, and autoregressive length (each new token needs a full forward pass through the stack).",
      ],
    },
    {
      type: "callout",
      variant: "success",
      title: "Interview sound bite",
      content:
        "\"Training is about changing weights to minimize loss over a dataset; inference reuses those weights to sample outputs. Serving cost scales with tokens processed and generated, not with how big the training job was.\"",
    },
    {
      type: "heading",
      level: 2,
      content: "Tokens and tokenization",
    },
    {
      type: "text",
      content:
        "Models do not see raw Unicode characters as atomic units; a **tokenizer** maps text to **tokens** (subword pieces). Common schemes: BPE, SentencePiece. Implications: similar English words may split differently; pricing and context limits are in **tokens**, not words; very long numeric IDs or base64 blobs can explode token count and cost.",
    },
    {
      type: "code",
      language: "python",
      filename: "token_count_stub.py",
      code: `# Conceptual: count tokens the way APIs do (example with tiktoken for OpenAI models)
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")
text = "Accenture GenAI — estimate interview prep."
tokens = enc.encode(text)
print(len(tokens), tokens[:10])`,
    },
    {
      type: "heading",
      level: 2,
      content: "Temperature and top-p (nucleus sampling)",
    },
    {
      type: "text",
      content:
        "At each step the model outputs a probability distribution over the vocabulary. **Temperature** scales logits before softmax: low T (e.g. 0.2) sharpens the distribution (more deterministic); high T flattens it (more random). **Top-p** keeps the smallest set of tokens whose cumulative probability ≥ p and samples from that set — useful to cap long-tail weird tokens. Production systems often use **low temperature** for structured extraction and **moderate** for creative drafts.",
    },
    {
      type: "heading",
      level: 2,
      content: "Context window",
    },
    {
      type: "text",
      content:
        "The **context window** is the maximum tokens the model can attend to in one forward pass (prompt + completion). Long windows (128k+ on some models) enable large documents but increase compute and memory. Anything beyond the window is **invisible** unless you summarize, chunk, or retrieve (RAG). Always relate window size to **your** prompt engineering and pipeline design in interviews.",
    },
    {
      type: "diagram",
      alt: "Context window as sliding memory",
      content: `flowchart LR
  P[Prompt tokens] --> W[Within context window]
  W --> O[Output tokens]
  O -.-> W`,
    },
  ],
  keyTakeaways: [
    "LLMs are deep learning models trained to predict tokens; generation is autoregressive sampling, not database lookup.",
    "Pre-training builds broad capability; SFT and alignment shape behavior — neither removes the need for grounding in critical applications.",
    "Parameters and context window drive quality, cost, and latency; tokenization ties billing and limits to subwords, not words.",
    "Temperature and top-p control randomness; choose them based on task (structured vs creative) and measure quality empirically.",
  ],
  interviewTips: [
    "Start answers with a one-sentence definition (\"autoregressive next-token predictor\") before diving into architecture.",
    "When asked about \"how ChatGPT was built,\" mention pre-training + instruction tuning + RLHF/preference learning as distinct stages.",
    "Tie \"why hallucinations happen\" to probabilistic completion — interviewers reward causal explanations over buzzwords.",
    "If discussing cost, mention input vs output tokens and that generated length linearly increases inference work.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "llm01-mc-inference",
      question:
        "A production chatbot serves 1M users per day but the model weights have not been updated for a month. Which statement best describes what happens on each user message?",
      options: [
        "The system performs backpropagation on every message to learn from the user.",
        "The system runs forward passes (inference) through frozen weights to sample the next tokens.",
        "The system reloads the entire pre-training corpus into GPU memory for each request.",
        "The system only updates embeddings, not transformer layers, on each request.",
      ],
      correctIndex: 1,
      explanation:
        "Serving traffic is almost always inference: repeated forward passes with fixed weights. Online learning in production is rare and would be an explicit, separate pipeline — not the default LLM API behavior.",
      interviewNote:
        "Contrasting training vs inference is a frequent screen — mention KV cache and autoregressive decoding if you want bonus depth.",
    },
    {
      type: "code-completion",
      id: "llm01-cc-temperature",
      question:
        "In many Python SDKs, generation kwargs include `temperature`. Fill in the typical numeric value used for **deterministic / near-greedy** decoding in production extractors (choose one common default).",
      codeTemplate: `response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": prompt}],
    temperature=________,
)`,
      language: "python",
      correctAnswer: "0",
      acceptableAnswers: ["0.0", "0.2"],
      explanation:
        "temperature=0 (or very low values like 0.2) reduces sampling randomness for structured tasks. Some APIs treat 0 as greedy argmax; always validate behavior in the specific SDK.",
      interviewNote:
        "Mention that temperature interacts with top_p and that you should evaluate JSON validity rates, not just eyeball text.",
    },
    {
      type: "ordering",
      id: "llm01-ord-lifecycle",
      question:
        "Order these stages in a typical frontier chat model lifecycle (top = earliest). Use the indices as shown in the shuffled list.",
      items: [
        "Alignment / preference tuning (e.g. RLHF-style) on ranked outputs",
        "Large-scale pre-training with next-token prediction on broad corpora",
        "Supervised fine-tuning on instruction–response demonstrations",
        "Deployment: inference-only API with frozen weights",
      ],
      correctOrder: [1, 2, 0, 3],
      explanation:
        "Broad order: massive pre-training → instruction SFT → preference alignment → frozen-weight serving. Exact recipes vary by vendor but this narrative is interview-safe.",
      interviewNote:
        "If probed, acknowledge that some pipelines merge or repeat stages (e.g. DPO instead of classic RLHF) — show you know names vary.",
    },
    {
      type: "true-false",
      id: "llm01-tf-tokens",
      statement:
        "For commercial LLM APIs, billing and maximum prompt length are always based on the number of words in English, not tokenizer output.",
      correct: false,
      explanation:
        "Billing and limits are tokenizer-driven (tokens). Word count is a rough heuristic only; multilingual text, symbols, and code can have very different token-per-character ratios.",
      interviewNote:
        "Share a concrete anecdote: logging `len(enc.encode(prompt))` before calling APIs saved cost — interviewers like operational awareness.",
    },
    {
      type: "scenario",
      id: "llm01-sc-window",
      scenario:
        "A client wants to \"drop their full 500-page policy PDF\" into a single GPT-style prompt because the marketing page says \"long context.\" Latency spikes and answers still omit sections.",
      question:
        "How do you explain the problem and propose a better approach in 3–4 sentences?",
      sampleAnswer:
        "Even long-context models have finite windows and expensive attention over huge prompts; a 500-page PDF may exceed limits or leave the model unable to reliably attend to all details. Latency grows with prompt tokens, so monolithic prompts hurt UX. Prefer chunking with retrieval (RAG), summarization hierarchies, or a dedicated search index so each call sends only the relevant passages. Measure groundedness with evals rather than assuming the model \"read everything.\"",
      keyPoints: [
        "Finite context window and cost/latency scale with prompt tokens.",
        "Attention does not equal perfect recall over hundreds of pages.",
        "RAG / chunking is the standard enterprise pattern for large corpora.",
      ],
      interviewNote:
        "Accenture interviews often test whether you sell RAG responsibly — acknowledge limits, then propose measurable mitigation.",
    },
  ],
};
