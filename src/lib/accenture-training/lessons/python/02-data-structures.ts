import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "python-02",
  skillId: "python",
  order: 2,
  title: "Data Structures: Lists, Dicts, Sets, Tuples",
  subtitle:
    "Choose the right container for the job — essential for pipelines, token batches, and configuration in GenAI systems.",
  estimatedMinutes: 20,
  objectives: [
    "Manipulate lists with slicing, methods, and list comprehensions.",
    "Model relationships with dictionaries, including iteration and nesting.",
    "Use sets for uniqueness and fast membership; tuples for fixed records.",
    "Describe typical time complexities for common operations at a high level.",
  ],
  content: [
    {
      type: "text",
      content:
        "Data structures are where interview problems and production GenAI code meet: chunk metadata as dicts, token IDs as lists, vocabulary as sets, and immutable prompts as tuples. Knowing APIs and complexity avoids accidental O(n²) bottlenecks.",
    },
    {
      type: "heading",
      level: 2,
      content: "Lists: ordered, mutable sequences",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Indexing l[i], negative indices from the end, slicing l[i:j] (end exclusive).",
        "Common methods: append, extend, insert, pop, remove, sort (in place), reverse.",
        "List comprehension: [expr for x in iterable if condition] — concise and fast in CPython for many patterns.",
      ],
    },
    {
      type: "code",
      language: "python",
      filename: "lists.py",
      code: `tokens = ["The", "quick", "brown", "fox"]
tokens.append("!")
first_two = tokens[:2]           # copy slice
tokens[1:3] = ["slow", "red"]    # replace slice
lengths = [len(t) for t in tokens if t.isalpha()]
print(lengths)

# Sort pairs by second element
pairs = [("doc_a", 0.9), ("doc_b", 0.4)]
pairs.sort(key=lambda p: p[1], reverse=True)
print(pairs[0][0])  # doc_a`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Copy vs. reference",
      content:
        "Assignment copies a reference, not the list. Use list(old), old.copy(), or old[:] for a shallow copy. Nested structures still share inner objects unless you deepcopy.",
    },
    {
      type: "heading",
      level: 2,
      content: "Dictionaries: key → value maps",
    },
    {
      type: "text",
      content:
        "Dict keys must be hashable (str, int, tuple of immutables, etc.). Insertion order is preserved in Python 3.7+. Use .get(key, default) to avoid KeyError and setdefault or collections.defaultdict for grouping.",
    },
    {
      type: "code",
      language: "python",
      filename: "dicts.py",
      code: `from collections import defaultdict

# Chunk metadata in a RAG-style pipeline
chunk = {
    "id": "c-1042",
    "text": "Python is widely used in ML.",
    "source_doc": "handbook.pdf",
    "tokens": 8,
}

# Safe read
score = chunk.get("score", 0.0)

# Group filenames by extension
paths = ["a.py", "b.py", "note.md"]
by_ext = defaultdict(list)
for p in paths:
    name, _, ext = p.partition(".")
    by_ext[ext].append(p)

# Iterate keys, values, items
for cid, meta in [("c1", chunk)]:
    print(cid, meta["tokens"])

# Dict comprehension
word = "accenture"
freq = {ch: word.count(ch) for ch in sorted(set(word))}
print(freq)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Sets: uniqueness and set algebra",
    },
    {
      type: "code",
      language: "python",
      filename: "sets.py",
      code: `a = {"python", "java", "go"}
b = {"python", "rust", "java"}

print(a & b)   # intersection
print(a | b)   # union
print(a - b)   # difference

# Membership is average O(1)
stopwords = {"the", "a", "an"}
tokens = ["the", "model", "works"]
filtered = [t for t in tokens if t not in stopwords]
print(filtered)`,
    },
    {
      type: "tip",
      content:
        "When you need both ordering and uniqueness, common patterns are dict.fromkeys(seq) (Python 3.7+ preserves order) or a plain loop with a seen set.",
    },
    {
      type: "heading",
      level: 2,
      content: "Tuples: fixed-shape records",
    },
    {
      type: "text",
      content:
        "Tuples are immutable sequences. They are hashable when all elements are hashable — useful as dict keys (e.g. (layer, head) → tensor slice). Named tuples and dataclasses (next lesson) improve readability.",
    },
    {
      type: "code",
      language: "python",
      filename: "tuples.py",
      code: `point = (10, 20)
x, y = point  # unpacking

def minmax(nums: list[int]) -> tuple[int, int]:
    return min(nums), max(nums)

low, high = minmax([3, 1, 4])
print(low, high)`,
    },
    {
      type: "heading",
      level: 2,
      content: "When to use which (rules of thumb)",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "List — ordered collection, duplicates allowed, need index access or stack/queue behavior.",
        "Dict — associate identifiers with payloads (ids → embeddings metadata, config keys).",
        "Set — test membership, dedupe, or mathematical set operations on unique elements.",
        "Tuple — small fixed bundles; keys in dicts; return multiple values from a function.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Complexity cheat sheet (typical CPython)",
    },
    {
      type: "diagram",
      alt: "Table of average-case complexities for core operations",
      content: `flowchart LR
  subgraph list[List]
    L1[index read/write] --> L1O[O of 1]
    L2[append end] --> L2O[O of 1 amortized]
    L3[search value in list] --> L3O[O of n]
  end
  subgraph dict[Dict and Set]
    D1[get/set by key] --> D1O[O of 1 average]
    D2[iterate all items] --> D2O[O of n]
  end`,
    },
    {
      type: "callout",
      variant: "success",
      title: "Interview framing",
      content:
        "Say \"average O(1) hash table lookup\" for dict/set membership, and \"O(n) scan\" for finding a value in a list when you do not have an index. Worst cases exist (hash collisions); big-O is still the expected shorthand.",
    },
  ],
  keyTakeaways: [
    "Slicing copies subranges; list methods like sort mutate in place.",
    "dict.get and defaultdict reduce KeyError noise in real pipelines.",
    "Sets excel at deduping and membership; lists preserve order.",
    "Choosing the wrong container often shows up as hidden quadratic loops.",
  ],
  interviewTips: [
    "Before coding, say whether you need order, duplicates, or fast lookup — then pick the structure.",
    "If asked to optimize, look for \"in list\" inside a loop over large n — consider a set or dict.",
    "Mention that dict keys must be hashable; lists cannot be dict keys.",
  ],
  exercises: [
    {
      type: "scenario",
      id: "py02-sc-invert",
      scenario:
        "You receive a list of log lines; each line is a string user_id. You must return a dict mapping each user_id to how many times it appeared.",
      question:
        "Which data structure do you use as the accumulator and what is a clean loop body?",
      sampleAnswer:
        "Use a dict counts = {}. For each uid in lines: counts[uid] = counts.get(uid, 0) + 1. Alternatively defaultdict(int) with counts[uid] += 1.",
      keyPoints: [
        "Dict maps key → count.",
        "get or defaultdict avoids branching on key existence.",
        "Time is O(n) over n lines with O(1) average dict updates.",
      ],
      interviewNote:
        "This pattern is identical to counting token frequencies or label counts in NLP preprocessing.",
    },
    {
      type: "multiple-choice",
      id: "py02-mc-lookup",
      question:
        "You have 1,000,000 unique string keys and need to test membership millions of times in a hot loop. Which structure minimizes average lookup cost?",
      options: [
        "list — simple and ordered",
        "dict mapping keys to True (or set) — hash-based average O(1) membership",
        "tuple of keys — immutable so always fastest",
        "nested lists — parallel arrays for keys and flags",
      ],
      correctIndex: 1,
      explanation:
        "set and dict keys use hash tables; membership is average O(1). Scanning a list is O(n) per check, which explodes in nested loops.",
      interviewNote:
        "Relate to stopword filtering or allowed-tool name checks in agent loops.",
    },
    {
      type: "ordering",
      id: "py02-ord-complexity",
      question:
        "Order these list operations from typically fastest average time to slowest (for large n).",
      items: [
        "lst.append(x) at the end",
        "x in lst (membership test)",
        "lst[i] = x (index assignment with valid i)",
        "lst.sort() (Timsort in place)",
      ],
      correctOrder: [2, 0, 3, 1],
      explanation:
        "Index assign and append are O(1) amortized; sort is O(n log n); naive membership scan is O(n). For strict speed ranking at huge n: O(1) ops first, then sort, then linear search.",
      interviewNote:
        "If the question is ambiguous, clarify whether \"in\" uses list vs set — complexity changes completely.",
    },
    {
      type: "code-completion",
      id: "py02-cc-comp",
      question:
        "Complete the list comprehension to produce squares of even numbers from nums (e.g. [2,3,4] → [4, 16]). Fill in the blank after \"if\".",
      codeTemplate: `nums = [2, 3, 4, 5, 6]
squares = [n * n for n in nums if ________]`,
      language: "python",
      correctAnswer: "n % 2 == 0",
      acceptableAnswers: ["n%2==0"],
      explanation:
        "n % 2 == 0 selects even integers; the comprehension maps each to its square.",
      interviewNote:
        "Comprehensions are readable for simple filters; switch to a loop if logic grows complex.",
    },
    {
      type: "true-false",
      id: "py02-tf-dict-eq",
      statement:
        "In Python 3, dict1 == dict2 is True when both have the same keys mapped to the same values, even if keys were inserted in a different order.",
      correct: true,
      explanation:
        "Mapping equality compares the key-value pairs, not insertion order. Example: {\"a\": 1, \"b\": 2} == {\"b\": 2, \"a\": 1} evaluates to True.",
      interviewNote:
        "Do not confuse iteration order (insertion-ordered in 3.7+) with equality semantics.",
    },
  ],
};
