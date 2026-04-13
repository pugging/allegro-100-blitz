import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "prompt-engineering-01",
  skillId: "prompt-engineering",
  order: 1,
  title: "Prompt Engineering Fundamentals",
  subtitle:
    "Structure prompts like mini product specs: clear instructions, grounded context, explicit output formats, and controlled randomness.",
  estimatedMinutes: 14,
  objectives: [
    "Decompose a prompt into instruction, context, input, and output format—and know why each matters.",
    "Apply zero-shot and role prompting appropriately without over-constraining the model.",
    "Choose temperature and related sampling settings for creative vs. deterministic tasks.",
    "Iterate prompts using small test sets instead of one-off vibes.",
  ],
  content: [
    {
      type: "text",
      content:
        "**Prompt engineering** is the disciplined practice of shaping inputs so a language model produces reliable, safe, and parseable outputs. For interns shipping assistants at enterprise clients, prompts are part of the interface contract—just like API schemas.",
    },
    {
      type: "heading",
      level: 2,
      content: "Anatomy of a strong prompt",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Instruction:** What you want done (verb-first, unambiguous).",
        "**Context:** Grounding facts, retrieved documents, user profile—only what is needed.",
        "**Input:** The variable part (user question, ticket text, JSON payload).",
        "**Output format:** JSON schema, bullet list, table, or strict template for downstream parsers.",
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "prompt-template-example.txt",
      code: `You are a support triage assistant for Contoso Cloud.

Context (trusted knowledge base excerpt):
---
{{kb_excerpt}}
---

User ticket:
---
{{ticket_text}}
---

Instructions:
1) Classify severity as P1|P2|P3.
2) Summarize the issue in one sentence.
3) List up to 3 next actions for the engineer.

Return JSON with keys: severity, summary, next_actions (array of strings).`,
    },
    {
      type: "tip",
      content:
        "Put **constraints** (length limits, banned topics, citation rules) adjacent to the instruction—not buried after a wall of context—so the model attends to them.",
    },
    {
      type: "heading",
      level: 2,
      content: "Zero-shot prompting",
    },
    {
      type: "text",
      content:
        "**Zero-shot** means you give no worked examples—only instructions. It works best when the task is familiar to the model (summarize, translate, classify with clear labels). For niche formats or enterprise jargon, zero-shot often needs tighter schemas or few-shot demonstrations.",
    },
    {
      type: "heading",
      level: 2,
      content: "Role prompting",
    },
    {
      type: "text",
      content:
        "Assigning a **role** (“You are a senior SRE…”) steers tone and depth. It is not magic: vague roles add little; specific roles plus evaluation criteria help. Combine role with **rubrics** (“Prefer actionable steps over theory”) for client-facing assistants.",
    },
    {
      type: "callout",
      variant: "info",
      title: "System vs. user message",
      content:
        "In chat APIs, persistent policies (safety, style, tool rules) usually live in the **system** message; ephemeral task inputs live in **user** messages. Exact behavior depends on the provider—always read their guidance.",
    },
    {
      type: "heading",
      level: 2,
      content: "Output formatting: JSON and Markdown",
    },
    {
      type: "text",
      content:
        "Downstream code expects machine-readable outputs. **JSON mode** (when supported) reduces syntax errors; still validate with a schema library. Markdown is human-friendly but brittle to parse—if you need headings, agree on a strict subset (e.g., `##` sections only).",
    },
    {
      type: "code",
      language: "python",
      filename: "validate_json_output.py",
      code: `import json
from typing import Any, Dict

FENCE = chr(96) * 3  # markdown code fence (avoid raw backticks in embedding strings)

def parse_model_json(text: str) -> Dict[str, Any]:
    """Parse first JSON object in model output; validate in production with pydantic."""
    text = text.strip()
    if text.startswith(FENCE):
        text = text.removeprefix(FENCE + "json").removeprefix(FENCE).strip()
        text = text.rsplit(FENCE, 1)[0].strip()
    return json.loads(text)

# Always wrap with try/except and retry or repair strategies in real services.`,
    },
    {
      type: "heading",
      level: 2,
      content: "Temperature and sampling parameters",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Low temperature (≈0–0.3):** More deterministic—classification, extraction, codegen with tests.",
        "**Higher temperature (≈0.7–1.0):** More diverse—brainstorming, marketing copy, role-play training data.",
        "**top_p / top_k:** Nucleus or top-k sampling truncates the tail of the distribution—pairs with temperature for fine control.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Determinism caveat",
      content:
        "Even at temperature 0, some platforms are not bitwise deterministic across retries. For audits, log prompts, model version, and seeds if exposed.",
    },
    {
      type: "heading",
      level: 2,
      content: "Iterative refinement",
    },
    {
      type: "text",
      content:
        "Treat prompts like code: version them, run a **small golden set** of inputs, and compare outputs with automated checks (JSON schema, regex, embedding similarity to references). Change one variable at a time—instruction vs. context ordering vs. temperature.",
    },
    {
      type: "diagram",
      alt: "Iterate prompt with test cases and metrics",
      content: `flowchart LR
  P[Prompt vN] --> T[Test cases]
  T --> M{Metrics OK?}
  M -->|no| P2[Edit one knob]
  P2 --> P
  M -->|yes| Ship[Ship / handoff]`,
    },
  ],
  keyTakeaways: [
    "Strong prompts separate instruction, context, input, and output format deliberately.",
    "Zero-shot is a baseline; add examples or schemas when reliability drops.",
    "Temperature and sampling tune creativity vs. determinism—match them to task risk.",
    "Iterate with versioned prompts and automated checks, not ad-hoc chat trials only.",
  ],
  interviewTips: [
    "Mention JSON schema validation and handling markdown fences from models.",
    "Explain when you’d raise temperature vs. when you’d keep it near zero.",
    "Reference system vs. user messages for policy vs. task separation.",
    "Describe a minimal evaluation set—interviewers want process, not buzzwords.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "pe01-mc-temp",
      question:
        "Which task pair best matches **low temperature** vs. **higher temperature**?",
      options: [
        "Low: creative slogan brainstorm — High: VAT extraction from invoices",
        "Low: JSON field extraction — High: diverse user-story ideation",
        "Low: poetry generation — High: SQL query from strict schema",
        "Low and high should always be identical for fairness",
      ],
      correctIndex: 1,
      explanation:
        "Structured extraction and compliance-sensitive tasks favor low temperature; open-ended ideation often benefits from higher temperature and sampling diversity.",
      interviewNote:
        "Add that you still validate outputs regardless of temperature—models err at T=0.",
    },
    {
      type: "code-completion",
      id: "pe01-cc-json-keys",
      question:
        "Fill in the missing key name so the prompt asks for a JSON array of strings named consistently with common style guides.",
      codeTemplate: `Return a JSON object with keys:
- "severity" (string, one of "low"|"med"|"high")
- "________" (array of strings, max 3 items)`,
      language: "text",
      correctAnswer: "next_steps",
      acceptableAnswers: ["next_steps", "nextSteps", "actions", "recommended_actions"],
      explanation:
        "`next_steps` is illustrative; in interviews, stress consistency with your parser and snake_case vs. camelCase conventions per API.",
      interviewNote:
        "Enterprise APIs often use camelCase JSON—align prompt keys with consumer code.",
    },
    {
      type: "ordering",
      id: "pe01-ord-prompt-parts",
      question:
        "Order these blocks as they typically appear in a **clear** enterprise support prompt (top to bottom).",
      items: [
        "Variable user ticket / customer input",
        "Explicit output format (JSON keys and enums)",
        "Role and safety/compliance instructions",
        "Retrieved knowledge base excerpt (trimmed)",
      ],
      correctOrder: [2, 3, 0, 1],
      explanation:
        "Common pattern: establish role/policy → ground with retrieved context → present the live user input → end with strict output instructions (recency bias helps the model follow format).",
      interviewNote:
        "Acknowledge provider-specific best practices—order isn’t universal but reasoning is.",
    },
    {
      type: "true-false",
      id: "pe01-tf-vague-role",
      statement:
        "Assigning a vague role like ‘You are a helpful assistant’ alone is usually sufficient to guarantee enterprise-grade compliance with a detailed JSON schema.",
      correct: false,
      explanation:
        "Vague roles add little guarantee; explicit instructions, examples, validation, and guardrails (later lesson) carry the reliability burden.",
      interviewNote:
        "Mention schema validation + retries—shows production thinking.",
    },
    {
      type: "scenario",
      id: "pe01-sc-noisy-tickets",
      scenario:
        "A classification prompt works on 20 clean examples but fails on messy tickets with PII and typos. Stakeholders refuse few-shot examples for privacy reasons.",
      question:
        "How do you refine the approach without leaking customer data in the prompt?",
      sampleAnswer:
        "Stay zero-shot but strengthen structure: separate PII handling rule (redact before model or use allow-listed fields), add explicit label definitions with decision boundaries, require JSON with confidence and rationale fields for debugging, and lower temperature. Build an internal synthetic dataset (paraphrased, anonymized) for offline eval. Consider structured preprocessing (spell-normalization, language detection) before the LLM.",
      keyPoints: [
        "Synthetic or anonymized internal eval when real few-shot is blocked.",
        "Stronger definitions beat a fluffy role line.",
        "Preprocess and validate; don’t rely on the model to ‘just know’.",
      ],
      interviewNote:
        "PII + prompt engineering intersects with security—name redaction pipelines.",
    },
  ],
};
