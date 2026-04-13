import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "prompt-engineering-02",
  skillId: "prompt-engineering",
  order: 2,
  title: "Advanced Techniques: CoT & Few-Shot",
  subtitle:
    "Teach by example, reason step by step, and orchestrate multi-step thought patterns—without letting verbosity mask weak grounding.",
  estimatedMinutes: 14,
  objectives: [
    "Design few-shot prompts with diverse, canonical examples that map to production edge cases.",
    "Apply Chain-of-Thought (CoT), zero-shot CoT, self-consistency, and Tree of Thoughts at a high level.",
    "Contrast ReAct-style reasoning+acting with pure text CoT for tool-using agents.",
    "Compare techniques by latency, cost, interpretability, and failure modes.",
  ],
  content: [
    {
      type: "text",
      content:
        "Frontier models handle many tasks zero-shot, but **few-shot** demonstrations still sharpen format adherence, domain jargon, and reasoning templates. **Chain-of-Thought** prompting asks the model to externalize intermediate steps—improving multi-step math, logic, and planning when paired with capable models.",
    },
    {
      type: "heading",
      level: 2,
      content: "Few-shot prompting",
    },
    {
      type: "text",
      content:
        "Provide **input → output** exemplars in the prompt (typically 1–8). Choose examples that are **diverse**, **correct**, and **representative** of tricky cases—near duplicates waste context. Label each example clearly (e.g., “Example 1”). For classification, balance classes to avoid bias.",
    },
    {
      type: "code",
      language: "text",
      filename: "few-shot-classification.txt",
      code: `Classify the ticket into {billing, bug, feature_request}.

Example 1:
Ticket: "I was double charged on April 2 for seat SKU-88."
Label: billing

Example 2:
Ticket: "Export to CSV hangs at 10k rows since v2.3."
Label: bug

Example 3:
Ticket: "Please add dark mode to the analyst dashboard."
Label: feature_request

Ticket:
{{ticket}}
Label:`,
    },
    {
      type: "tip",
      content:
        "If the model copies example specifics (names, IDs), swap in synthetic placeholders and instruct: “Do not copy example entities.”",
    },
    {
      type: "heading",
      level: 2,
      content: "Chain-of-Thought (CoT)",
    },
    {
      type: "text",
      content:
        "**CoT** appends reasoning before the final answer: “Let’s solve step by step.” It increases token use but can reduce arithmetic/logic errors. Teach interns to require a final, **parseable** answer line (e.g., `ANSWER: JSON {...}`) so pipelines do not break on rambling traces.",
    },
    {
      type: "heading",
      level: 2,
      content: 'Zero-shot CoT: "Let\'s think step by step"',
    },
    {
      type: "text",
      content:
        "Kojima-style **zero-shot CoT** adds a single trigger phrase without examples. Surprisingly effective on some benchmarks; unreliable on others. Treat it as a **free experiment** before investing in labeled few-shot traces.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Faithfulness",
      content:
        "CoT **narratives can sound convincing while wrong** (unfaithful reasoning). Do not treat chain text as audit proof—verify outcomes with tests, tools, or human review.",
    },
    {
      type: "heading",
      level: 2,
      content: "Self-consistency",
    },
    {
      type: "text",
      content:
        "Sample **multiple** CoT rollouts at higher temperature, then **majority-vote** the final answer. Improves robustness on math/logic at **N×** cost. Use when mistakes are expensive (safety checks, financial reconciliations) and latency allows.",
    },
    {
      type: "heading",
      level: 2,
      content: "Tree of Thoughts (high level)",
    },
    {
      type: "text",
      content:
        "**Tree of Thoughts** explores multiple reasoning branches, backtracks, and scores partial paths—closer to search algorithms than a single linear chain. Powerful conceptually; heavier to orchestrate in production (more calls, controller logic).",
    },
    {
      type: "heading",
      level: 2,
      content: "ReAct: Reasoning + Acting",
    },
    {
      type: "text",
      content:
        "**ReAct** interleaves short **Thought**, **Action** (call a tool/API), **Observation** loops. Ideal when answers require **fresh data** (CRM lookup, calculator, vector DB). Contrast with pure CoT, which hallucinates facts if context is missing.",
    },
    {
      type: "code",
      language: "text",
      filename: "react-pattern-sketch.txt",
      code: `Thought: I need the user's open invoice total from the billing API.
Action: get_open_invoices(user_id="U-1044")
Observation: [{"id":"INV-9","amount":120.0}]

Thought: Single open invoice; answer the user's question with the amount.
Action: respond_to_user
Final: You have one open invoice INV-9 for $120.00.`,
    },
    {
      type: "heading",
      level: 2,
      content: "Practical comparison",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "**Few-shot:** Best format/teaching ROI for specialized schemas and jargon.",
        "**CoT / zero-shot CoT:** Cheap logic boost; watch token costs and unfaithful chains.",
        "**Self-consistency:** Accuracy up, cost/latency up—use selectively.",
        "**ReAct:** Grounding via tools—essential when knowledge cannot live in the prompt.",
      ],
    },
    {
      type: "diagram",
      alt: "ReAct loop between thought action and observation",
      content: `flowchart TD
  T[Thought] --> A[Action / Tool call]
  A --> O[Observation]
  O --> T
  T --> F[Final answer]`,
    },
  ],
  keyTakeaways: [
    "Few-shot examples teach format and edge cases—quality and diversity beat quantity.",
    "CoT externalizes reasoning; combine with verifiable final outputs.",
    "Self-consistency trades compute for stability on brittle reasoning tasks.",
    "ReAct connects LLM reasoning to real tools for grounded enterprise workflows.",
  ],
  interviewTips: [
    "Contrast when you’d use tools (ReAct) vs. when CoT alone is dangerous.",
    "Mention faithfulness: plausible reasoning ≠ correct reasoning.",
    "Discuss cost: self-consistency multiplies tokens—justify with risk.",
    "Show a minimal few-shot template—interviewers love concrete structure.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "pe02-mc-react",
      question:
        "A workflow must fetch live inventory from an ERP API before answering ‘Can we ship 500 units tomorrow?’ Which pattern fits best?",
      options: [
        "Pure zero-shot without tools",
        "Long CoT with no external calls",
        "ReAct-style loop with a verified inventory tool/API",
        "Self-consistency with temperature 0 only",
      ],
      correctIndex: 2,
      explanation:
        "Fresh operational data requires tool grounding; ReAct (or an equivalent agent pattern) interleaves reasoning with API calls. Pure CoT risks hallucinated stock levels.",
      interviewNote:
        "Name idempotency, timeouts, and auth on tool calls—enterprise detail.",
    },
    {
      type: "code-completion",
      id: "pe02-cc-cot-trigger",
      question:
        "Complete the classic zero-shot Chain-of-Thought trigger phrase (Kojima et al.).",
      codeTemplate: `Before answering, ______________________________.`,
      language: "text",
      correctAnswer: "let's think step by step",
      acceptableAnswers: [
        "Let's think step by step",
        "lets think step by step",
        "Let us think step by step",
      ],
      explanation:
        "The widely cited trigger is ‘Let's think step by step’—capitalization may vary; effect depends on model and task.",
      interviewNote:
        "Note this is heuristic—not guaranteed—and can add verbosity without accuracy gains.",
    },
    {
      type: "ordering",
      id: "pe02-ord-cost-latency",
      question:
        "Order these techniques from **typically lowest** average latency/cost per answer to **highest** (single answers, comparable model).",
      items: [
        "Self-consistency with 5 sampled chains + majority vote",
        "Single zero-shot answer (temperature 0.2)",
        "One-shot prompt with a single example",
        "Linear CoT single rollout (no extra samples)",
      ],
      correctOrder: [1, 2, 3, 0],
      explanation:
        "Single zero-shot is cheapest; adding one example slightly increases tokens; CoT adds reasoning tokens; self-consistency multiplies full rollouts.",
      interviewNote:
        "Clarify assumptions aloud in interviews—token counts dominate cost.",
    },
    {
      type: "true-false",
      id: "pe02-tf-cot-faithful",
      statement:
        "Chain-of-Thought text from the model is always a faithful, step-by-step record of how it derived the final answer.",
      correct: false,
      explanation:
        "Models can generate plausible reasoning that does not match internal computation—treat CoT as hints, not cryptographic proof.",
      interviewNote:
        "Link to evaluation with unit tests or tool verification.",
    },
    {
      type: "scenario",
      id: "pe02-sc-bad-fewshot",
      scenario:
        "After adding three few-shot examples, accuracy on ‘billing’ tickets dropped—users get mislabeled as ‘bug’. Examples were all short and polite; production tickets are noisy caps-lock rants.",
      question:
        "What would you change in the prompt design and evaluation process?",
      sampleAnswer:
        "Revise few-shots to mirror real noise (anonymized) and include at least one ambiguous boundary example with explanation. Add a calibration line: if payment language dominates, prefer billing unless a reproducible technical error is described. Measure per-class precision/recall on a stratified set. Consider dropping to one strong example plus definitions instead of three similar ones.",
      keyPoints: [
        "Few-shot distribution must match production.",
        "Define class boundaries explicitly.",
        "Evaluate with confusion matrix, not gut feel.",
      ],
      interviewNote:
        "Shows you understand distribution shift—not just ‘add more examples’.",
    },
  ],
};
