import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "llm-basics-02",
  skillId: "llm-basics",
  order: 2,
  title: "Transformer Architecture",
  subtitle:
    "Attention, multi-head blocks, and why GPT-style decoder-only stacks power today’s LLMs — explained for technical interviews.",
  estimatedMinutes: 18,
  objectives: [
    "Explain self-attention as soft lookup between positions and why it enables long-range dependencies.",
    "Describe multi-head attention, feed-forward layers, residual connections, and layer normalization in a transformer block.",
    "Contrast encoder-decoder (e.g. original seq2seq transformers) with decoder-only GPT and encoder-only BERT-style models.",
    "Walk through autoregressive text generation at inference and compare BERT vs GPT objectives at a high level.",
  ],
  content: [
    {
      type: "text",
      content:
        "The 2017 paper **\"Attention Is All You Need\"** introduced the **transformer**: a network built from **attention** layers that process sequences in parallel (unlike RNNs). Modern LLMs are overwhelmingly **decoder-only transformers** (GPT family): they stack identical blocks and predict the next token. Interviewers expect you to connect **attention → context mixing → logits over vocabulary** without hand-waving.",
    },
    {
      type: "callout",
      variant: "info",
      title: "What you can skip in an hour-long loop",
      content:
        "You rarely derive softmax on a whiteboard. You should be able to sketch Q/K/V intuition, say that complexity is O(n²) in sequence length for standard attention, and name mitigations (sparse attention, linear attention, FlashAttention as an implementation win) at a high level.",
    },
    {
      type: "heading",
      level: 2,
      content: "Why attention: long-range dependencies",
    },
    {
      type: "text",
      content:
        "RNNs and early CNNs struggled to connect information many steps apart. **Attention** lets every position **look at** every other position in one layer (subject to masking in decoders). Each position builds a **weighted sum** of values from all positions; weights come from **compatibility** between a **query** and **keys**.",
    },
    {
      type: "heading",
      level: 2,
      content: "Scaled dot-product self-attention",
    },
    {
      type: "text",
      content:
        "For each token, we form vectors **Q** (query), **K** (key), **V** (value) via learned linear projections of the input embedding. Attention weights are softmax(QK^T / √d_k) so larger dot products (more similar query–key direction) get more mass. Output is that softmax matrix times **V**: a **convex combination** of value vectors — interpretable as \"which positions to read from.\" Scaling by √d_k prevents dot products from growing too large in high dimensions, keeping softmax from saturating.",
    },
    {
      type: "code",
      language: "python",
      filename: "attention_shape_intuition.py",
      code: `import torch
import torch.nn.functional as F

# Toy shapes: batch=1, seq=4, dim=8
seq_len, d_k = 4, 8
Q = torch.randn(1, seq_len, d_k)
K = torch.randn(1, seq_len, d_k)
V = torch.randn(1, seq_len, d_k)

scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
weights = F.softmax(scores, dim=-1)
out = torch.matmul(weights, V)
print(out.shape)  # torch.Size([1, 4, 8])`,
    },
    {
      type: "heading",
      level: 2,
      content: "Causal masking in decoder-only models",
    },
    {
      type: "text",
      content:
        "GPT-style models apply a **causal mask** so position *i* cannot attend to positions *j > i*. Otherwise the model could \"cheat\" during next-token training by seeing the future. At generation time you append one token at a time; **KV caching** stores past keys and values so you do not recompute attention over the full prefix every step — critical for latency.",
    },
    {
      type: "tip",
      content:
        "If an interviewer says \"self-attention,\" confirm they mean tokens attending to tokens in the same sequence (vs cross-attention where queries come from one sequence and keys/values from another — used in encoder–decoder stacks).",
    },
    {
      type: "heading",
      level: 2,
      content: "Multi-head attention",
    },
    {
      type: "text",
      content:
        "**Multi-head attention** runs several attention operations in parallel with different learned projections, then concatenates and projects again. Heads can specialize (syntax vs semantics is a loose intuition; what matters is capacity and stable optimization). It is the default in GPT, BERT, and T5 blocks.",
    },
    {
      type: "heading",
      level: 2,
      content: "Transformer block anatomy",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Multi-head self-attention** sublayer with residual: x + Attention(LayerNorm(x)) (Pre-LN variants are common in modern stacks: LayerNorm before attention for training stability).",
        "**Position-wise feed-forward network (FFN)**: two linear layers with a nonlinearity (e.g. GELU), applied independently per token — mixes channels per position after attention mixed information across positions.",
        "**Residual connections** help gradients flow through deep stacks (dozens of layers).",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Pre-LN vs Post-LN",
      content:
        "Original paper used post-norm; many LLMs use pre-norm. If asked, say both exist; pre-LN often trains deeper models more reliably. You do not need vendor-specific diagrams memorized.",
    },
    {
      type: "heading",
      level: 2,
      content: "Positional encoding",
    },
    {
      type: "text",
      content:
        "Attention is **permutation-invariant** without position information. Transformers add **positional encodings** (sinusoidal, learned, or rotary **RoPE** in many modern LLMs) so order matters. RoPE encodes relative position via rotation in embedding space and scales well to long contexts in recent architectures.",
    },
    {
      type: "heading",
      level: 2,
      content: "Encoder–decoder vs decoder-only vs encoder-only",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Encoder–decoder** (e.g. original translation): encoder sees full source; decoder cross-attends to encoder memory while generating target — great for seq2seq, less central to single-stream chat LLMs.",
        "**Decoder-only** (GPT): one stack, causal mask, next-token LM. Simplest path to massive generative models.",
        "**Encoder-only** (BERT): bidirectional self-attention on the full input; trained with masked language modeling — strong for embeddings and classification, not autoregressive generation.",
      ],
    },
    {
      type: "diagram",
      alt: "Decoder-only autoregressive generation",
      content: `flowchart LR
  subgraph one_step
    E[Token embeddings + positions]
    T[Transformer blocks x N]
    L[LM head to vocab logits]
    E --> T --> L
  end
  L --> S[Sample next token]
  S --> E`,
    },
    {
      type: "heading",
      level: 2,
      content: "How GPT generates text",
    },
    {
      type: "text",
      content:
        "Start with prompt tokens. Run the stack to get logits for the **next** position. Sample or argmax one token, **append** it to the context, repeat until stop token or max length. That loop is **autoregressive decoding**. Throughput optimizations (continuous batching, speculative decoding) are hot topics in MLOps interviews.",
    },
    {
      type: "heading",
      level: 3,
      content: "BERT vs GPT (architecture comparison)",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Objective**: BERT — masked tokens + next-sentence prediction (classic); GPT — causal next-token prediction along the sequence.",
        "**Attention**: BERT allows full bidirectional context within the segment; GPT uses causal (left-to-right) masking.",
        "**Typical use**: BERT-style encoders for classification, semantic similarity, feature extraction; GPT-style for open-ended generation and chat.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      title: "One clean interview answer",
      content:
        "\"GPT is a stack of causal self-attention blocks trained to predict the next token; at serve time we repeatedly append sampled tokens. BERT uses bidirectional attention and masking objectives — better as an encoder, not as a standard text generator.\"",
    },
  ],
  keyTakeaways: [
    "Self-attention mixes information across positions using query–key–value soft lookup; scaling stabilizes softmax.",
    "Decoder-only causal transformers power GPT-like LLMs; masking prevents peeking at future tokens during training.",
    "A block is attention + FFN + residuals (+ norm); multi-head attention increases representational flexibility.",
    "Positional information must be injected; RoPE is a common modern choice for long contexts.",
    "BERT encodes bidirectionally; GPT generates autoregressively — different objectives and serving patterns.",
  ],
  interviewTips: [
    "Draw Q, K, V as three projections from the same hidden state — interviewers check whether you confuse self- with cross-attention.",
    "Mention O(n²) attention over sequence length when discussing long documents — it motivates chunking and RAG.",
    "If asked for improvements beyond vanilla attention, cite FlashAttention (IO-aware exact attention) or architectural sparsity at a headline level.",
    "Connect KV cache to inference cost: caching avoids redundant computation for prefix tokens.",
  ],
  exercises: [
    {
      type: "code-completion",
      id: "llm02-cc-mask",
      question:
        "In PyTorch-style pseudocode, causal attention sets scores for j > i to negative infinity before softmax. Fill in the typical mask value used for \"disallowed\" positions.",
      codeTemplate: `# scores shape: (batch, heads, seq, seq)
# mask[i, j] = True means \"allow attention from i to j\"
scores = scores.masked_fill(~mask, ________)`,
      language: "python",
      correctAnswer: "float(\"-inf\")",
      acceptableAnswers: ["-float('inf')", "-torch.inf", "float('-inf')"],
      explanation:
        "Softmax over -inf yields ~0 probability for illegal positions. Libraries may use a large negative constant instead; the idea is the same.",
      interviewNote:
        "If you use FlashAttention or fused kernels, you still explain masking conceptually — on-chip details are optional.",
    },
    {
      type: "ordering",
      id: "llm02-ord-forward",
      question:
        "Order these operations inside one forward step of autoregressive generation **after** the prompt is already cached (top = first).",
      items: [
        "Append newly sampled token id to the running sequence",
        "Compute logits for the next position from the final hidden state",
        "Run transformer block(s) on the **latest** token(s) using KV cache",
        "Sample or argmax the next token from the distribution",
      ],
      correctOrder: [2, 1, 3, 0],
      explanation:
        "With KV cache, you typically forward the new token(s) through layers (using cached K/V for past positions), read logits for the last position, sample, then append the token id for the next iteration. Exact fused kernels reorder work but this is the logical story.",
      interviewNote:
        "Narrate \"we only recompute for the new tail\" — that is the performance story clients care about.",
    },
    {
      type: "true-false",
      id: "llm02-tf-causal",
      statement:
        "During training of a GPT-style decoder, the attention mechanism at position i is allowed to attend to future positions j > i in the same sequence.",
      correct: false,
      explanation:
        "Causal (autoregressive) masking blocks attention to future tokens so the next-token loss is legitimate — otherwise the model could see the answer it is trying to predict. Only past and current positions are visible.",
      interviewNote:
        "Contrast with BERT bidirectional attention, which sees the full sequence in one pass — different training objective.",
    },
    {
      type: "multiple-choice",
      id: "llm02-mc-bert-gpt",
      question:
        "Which pairing best describes the classic distinction between BERT-style encoder models and GPT-style decoder LLMs?",
      options: [
        "BERT is trained with causal next-token prediction; GPT uses masked language modeling on random tokens.",
        "BERT uses bidirectional self-attention on the input; GPT uses causal self-attention and is trained to predict the next token.",
        "BERT cannot produce embeddings; GPT cannot be fine-tuned.",
        "BERT and GPT differ only in tokenizer choice, not in architecture or training objective.",
      ],
      correctIndex: 1,
      explanation:
        "BERT's bidirectional attention and MLM objective contrast with GPT's left-to-right causal LM. Both families can be fine-tuned in various ways today; the option states the standard pedagogical distinction.",
      interviewNote:
        "Mention encoder–decoder models (T5, BART) as a third pattern if you want to show breadth.",
    },
    {
      type: "scenario",
      id: "llm02-sc-attention",
      scenario:
        "The interviewer asks: \"In one minute, explain self-attention to a senior architect who knows neural nets but not NLP.\"",
      question:
        "Give a tight explanation mentioning Q, K, V and what gets weighted.",
      sampleAnswer:
        "Each token is turned into three vectors: query, key, and value. We compare the query at position i to every key j to get attention weights — how much position i should read from position j. Those weights are softmax-normalized scores from dot products, scaled for stability. The output at i is the weighted sum of all value vectors — a soft, differentiable way to copy and blend information from other positions. Stacked layers let higher levels build richer representations.",
      keyPoints: [
        "Softmax-normalized compatibility weights.",
        "Output is weighted sum of values (not keys).",
        "Explains \"mixing\" information across the sequence.",
      ],
      interviewNote:
        "Keep it under 60 seconds; offer to draw a 3×3 grid of scores if they nod.",
    },
  ],
};
