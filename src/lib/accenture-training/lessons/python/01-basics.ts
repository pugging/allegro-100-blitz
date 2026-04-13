import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "python-01",
  skillId: "python",
  order: 1,
  title: "Python Basics: Syntax & Core Concepts",
  subtitle:
    "Variables, types, control flow, and I/O — the foundation you will use in every GenAI script, notebook, and service.",
  estimatedMinutes: 20,
  objectives: [
    "Declare variables and reason about Python’s dynamic typing and object references.",
    "Use core types (int, float, str, bool), operators, and built-ins confidently.",
    "Format strings and handle basic console input/output.",
    "Write branching logic and loops with for, while, and range().",
  ],
  content: [
    {
      type: "text",
      content:
        "Python is the lingua franca of modern AI engineering: notebooks, SDKs (OpenAI, LangChain), and cloud runtimes all assume you can read and write idiomatic Python. This lesson builds the muscle memory you need before you touch libraries.",
    },
    {
      type: "callout",
      variant: "info",
      title: "How this maps to interviews",
      content:
        "Screeners often ask you to implement small logic on a whiteboard or live editor: parse input, loop over data, guard edge cases. None of that works without solid basics.",
    },
    {
      type: "heading",
      level: 2,
      content: "Variables, assignment, and types",
    },
    {
      type: "text",
      content:
        "You do not declare types at assignment time; names are bound to objects. Use meaningful names (snake_case for variables and functions per PEP 8). The built-in type() shows what you are working with at runtime.",
    },
    {
      type: "code",
      language: "python",
      filename: "types_demo.py",
      code: `user_id = 42
temperature_c = 36.6
label = "Accenture"
is_active = True

print(type(user_id))       # <class 'int'>
print(type(temperature_c))  # <class 'float'>
print(type(label))         # <class 'str'>
print(type(is_active))     # <class 'bool'>`,
    },
    {
      type: "tip",
      content:
        "Prefer explicit conversions: int(\"10\"), float(\"3.14\"), str(404) — interviewers notice when you assume implicit coercion that Python does not provide (e.g. \"5\" + 3 is an error).",
    },
    {
      type: "heading",
      level: 2,
      content: "Operators and useful built-ins",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Arithmetic: +, -, *, / (true division), // (floor division), % (modulo), ** (power).",
        "Comparisons: ==, !=, <, <=, >, >= — they return bool.",
        "Boolean logic: and, or, not (use them for clarity instead of nesting deeply).",
        "Built-ins you will use constantly: len(), min(), max(), sum(), abs(), round(), sorted().",
      ],
    },
    {
      type: "code",
      language: "python",
      filename: "operators.py",
      code: `scores = [88, 92, 79, 95]
average = sum(scores) / len(scores)
highest = max(scores)
rounded_avg = round(average, 1)
print(f"Average: {rounded_avg}, best: {highest}")`,
    },
    {
      type: "heading",
      level: 2,
      content: "Strings and formatting",
    },
    {
      type: "text",
      content:
        "Strings are immutable sequences. Slicing s[start:stop:step] is inclusive of start and exclusive of stop. For production and interview code, f-strings are the default choice for readability.",
    },
    {
      type: "code",
      language: "python",
      filename: "strings.py",
      code: `name = "genai"
version = 3.12
# f-string (preferred)
msg = f"Running {name} on Python {version}"
# str.format for older codebases
legacy = "Model: {}, temp: {:.2f}".format("gpt", 0.7)
# multiline
doc = """Line one
Line two"""
print(msg)
print(legacy)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Input and output",
    },
    {
      type: "code",
      language: "python",
      filename: "io_cli.py",
      code: `# input() always returns a str — convert if you need numbers
raw = input("Enter batch size: ").strip()
batch_size = int(raw)
print(f"Processing {batch_size} records")`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Production vs. interview",
      content:
        "In real services you rarely use input(); you read from environment variables, HTTP bodies, or queues. In interviews, input() is common for \"read until EOF\" style problems — always validate and convert types.",
    },
    {
      type: "heading",
      level: 2,
      content: "Conditionals and loops",
    },
    {
      type: "text",
      content:
        "if / elif / else evaluates conditions top to bottom. for iterates over any iterable (string, list, range, etc.). while repeats until the condition is false — mind infinite loops. range(stop), range(start, stop), and range(start, stop, step) are your main counting tools.",
    },
    {
      type: "code",
      language: "python",
      filename: "control_flow.py",
      code: `def classify_temperature(c: float) -> str:
    if c < 0:
        return "freezing"
    elif c < 15:
        return "cold"
    elif c < 25:
        return "mild"
    else:
        return "warm"

# Sum first n integers with range (1-based inclusive n)
n = 10
total = 0
for i in range(1, n + 1):
    total += i
print(total)  # 55

# while with guard
remaining = 3
while remaining > 0:
    print(f"ticks left: {remaining}")
    remaining -= 1`,
    },
    {
      type: "diagram",
      alt: "Flow from input through validation to loop processing",
      content: `flowchart TD
  A[Read input as str] --> B{Valid number?}
  B -->|no| C[Prompt or default]
  B -->|yes| D[Convert to int/float]
  D --> E[for / while over work]
  E --> F[Output result]`,
    },
    {
      type: "heading",
      level: 3,
      content: "Quick pattern: accumulate in a loop",
    },
    {
      type: "code",
      language: "python",
      filename: "accumulate.py",
      code: `def count_vowels(text: str) -> int:
    vowels = "aeiouAEIOU"
    count = 0
    for ch in text:
        if ch in vowels:
            count += 1
    return count

print(count_vowels("Accenture"))  # 4`,
    },
  ],
  keyTakeaways: [
    "Python binds names to objects; use type() and explicit conversions instead of guessing.",
    "f-strings are the clearest way to build messages; remember strings are immutable.",
    "range() is half-open on the end — use range(1, n + 1) for 1..n inclusive.",
    "input() returns str; validate before int()/float() to avoid crashes on bad data.",
  ],
  interviewTips: [
    "State assumptions aloud (empty input, negative n, Unicode) — interviewers reward systematic thinking.",
    "Mention time complexity when you loop: O(n) over n characters or items is expected vocabulary.",
    "If stuck, start with a working brute-force loop; optimize after it runs.",
    "Use snake_case and clear names; avoid single-letter variables except in tiny scopes like loop indices.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "py01-mc-types",
      question:
        "What is the type of the expression 10 / 2 in Python 3, and why?",
      options: [
        "int, because both operands are integers",
        "float, because / performs true division and always returns float in Python 3",
        "str, because division coerces to string for display",
        "bool, because comparison operators return boolean",
      ],
      correctIndex: 1,
      explanation:
        "The / operator is true division in Python 3; it returns a float even when the mathematical result is whole (e.g. 10 / 2 → 5.0). Use // for floor division if you need an int.",
      interviewNote:
        "Mention // vs / unprompted — it signals you have debugged numeric bugs in real code.",
    },
    {
      type: "code-completion",
      id: "py01-cc-range",
      question:
        "The following loop should print squares 1, 4, 9, …, 100 (1² through 10²). Fill in the range so the loop variable i runs from 1 to 10 inclusive.",
      codeTemplate: `for i in range(________):
    print(i * i)`,
      language: "python",
      correctAnswer: "1, 11",
      acceptableAnswers: ["1,11"],
      explanation:
        "range(start, stop) excludes stop, so range(1, 11) yields 1..10. range(11) alone would start at 0.",
      interviewNote:
        "Off-by-one errors in range() are a classic live-coding trap; narrate \"stop is exclusive\" as you type.",
    },
    {
      type: "ordering",
      id: "py01-ord-execution",
      question:
        "Order these steps for safely reading an integer from user input in a CLI script (top = first).",
      items: [
        "Convert using int() after validation",
        "Print result or continue program logic",
        "Read a line with input() and strip whitespace",
        "Check the string is non-empty and represents digits (or handle sign)",
      ],
      correctOrder: [2, 3, 0, 1],
      explanation:
        "Typical flow: read → strip → validate string form → int() → use. Skipping validation before int() raises ValueError on bad input.",
      interviewNote:
        "In GenAI tooling you swap input() for JSON or API payloads, but the same idea applies: validate then parse.",
    },
    {
      type: "true-false",
      id: "py01-tf-immutable-str",
      statement:
        "In Python, if x and y are both strings, the expression x + y mutates the object bound to x in place.",
      correct: false,
      explanation:
        "Strings are immutable. x + y creates a new str object; x is unchanged unless you reassign x = x + y.",
      interviewNote:
        "Immutability matters for hashing, concurrency, and avoiding accidental shared-state bugs.",
    },
    {
      type: "scenario",
      id: "py01-sc-fizz",
      scenario:
        "You have 90 seconds in a live interview to print numbers 1 through 30, but replace multiples of 3 with \"Fizz\", multiples of 5 with \"Buzz\", and multiples of both with \"FizzBuzz\".",
      question:
        "Outline the minimal branching structure you would write and which condition you check first.",
      sampleAnswer:
        "Use a loop for i in range(1, 31). Build output: if i % 15 == 0 print FizzBuzz; elif i % 3 == 0 print Fizz; elif i % 5 == 0 print Buzz; else print i. Checking 15 first avoids wrong double matches.",
      keyPoints: [
        "Use modulo (%) for divisibility.",
        "Test the combined condition (LCM of 3 and 5) before individual factors.",
        "Keep the loop bounds inclusive with range(1, 31).",
      ],
      interviewNote:
        "FizzBuzz is still used to filter for basic fluency — deliver it calmly and mention you could extract helpers for readability in production.",
    },
  ],
};
