import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "git-01",
  skillId: "git",
  order: 1,
  title: "Git Fundamentals",
  subtitle:
    "Version control concepts, the three trees, commits, history, and safe defaults for GenAI engineering work.",
  estimatedMinutes: 15,
  objectives: [
    "Explain why teams use version control and how Git snapshots history.",
    "Differentiate the working directory, staging area, and local repository.",
    "Create commits with clear messages and inspect history with log and diff.",
    "Configure .gitignore to keep secrets and generated artifacts out of Git.",
    "Describe HEAD and how it relates to the latest commit on a branch.",
  ],
  content: [
    {
      type: "heading",
      level: 2,
      content: "Why version control matters",
    },
    {
      type: "text",
      content:
        "Version control records **who changed what, when, and why** across files. For GenAI projects you will juggle application code, prompts, evaluation notebooks, and configuration. Without Git, you lose reproducibility: you cannot reliably return to the model version, prompt text, or API settings that produced a specific result. Git is the industry default for collaborating with engineers, reviewers, and CI/CD pipelines.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world context",
      content:
        "A consulting team ships a RAG pipeline: ingestion scripts, chunking logic, and a FastAPI service. A teammate changes chunk size and breaks retrieval. With Git, you diff the commit, revert or fix forward, and link the change to a ticket. Without Git, you are comparing folders by hand.",
    },
    {
      type: "heading",
      level: 2,
      content: "What Git is (and is not)",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Git is a **distributed** version control system: every clone has a full copy of history (not just the latest files).",
        "Git stores **snapshots** (commits), not per-file deltas only—each commit points to a tree of files at that moment.",
        "Git is **not** GitHub: Git is the tool; GitHub/GitLab/Azure DevOps are hosts for remotes, PRs, and automation.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "The three areas: working directory, staging, repository",
    },
    {
      type: "text",
      content:
        "Think in **three trees**: (1) your **working directory**—files as they exist on disk right now; (2) the **staging area** (index)—what you propose for the next commit; (3) the **repository**—committed snapshots stored under `.git/`. You edit in the working tree, **stage** what belongs in the next snapshot, then **commit** to record that snapshot with a message.",
    },
    {
      type: "diagram",
      alt: "Flow from working directory to staging to commit",
      content:
        "Working directory  --git add-->  Staging (index)  --git commit-->  Repository (.git)\n   ^                                                              |\n   |--------------------------- checkout / reset ----------------|",
    },
    {
      type: "heading",
      level: 3,
      content: "Creating a repository: git init",
    },
    {
      type: "text",
      content:
        "Run `git init` in an empty or existing project folder to create a `.git` directory. That turns the folder into a Git repository. You typically init once per project root, not inside every subfolder.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `mkdir my-genai-service && cd my-genai-service
git init
# Initialised empty Git repository in .../my-genai-service/.git/`,
    },
    {
      type: "heading",
      level: 3,
      content: "Staging and committing",
    },
    {
      type: "text",
      content:
        "`git add` copies changes from the working directory into the staging area. `git commit` freezes the staged state into a new commit object with an author, timestamp, parent commit, and message. Unstaged changes remain in the working directory and are **not** part of that commit.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `# Stage one file
git add src/main.py

# Stage everything in the repo (use carefully)
git add .

git commit -m "feat: add health check endpoint for API"`
    },
    {
      type: "callout",
      variant: "warning",
      title: "Avoid blind git add .",
      content:
        "Before `git add .`, skim `git status`. GenAI repos often grow `.env`, `venv/`, `node_modules/`, or large `*.bin` model files. Those should be ignored, not committed.",
    },
    {
      type: "heading",
      level: 3,
      content: "HEAD",
    },
    {
      type: "text",
      content:
        "**HEAD** is a pointer to the current commit (usually the tip of your current branch). When you make a new commit, HEAD moves forward to that commit. Commands like `git show HEAD` or `git diff HEAD` use HEAD as the reference point for “where you are now.”",
    },
    {
      type: "heading",
      level: 2,
      content: "Inspecting history: git log and git diff",
    },
    {
      type: "text",
      content:
        "`git log` lists commits (newest first by default). Useful flags: `--oneline` for compact output, `-n 5` for the last five commits, `--graph` with branches (more relevant after you learn branching). `git diff` without arguments shows **unstaged** changes; `git diff --staged` shows what is staged for the next commit.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git status
git diff
git diff --staged
git log --oneline -10`,
    },
    {
      type: "tip",
      content:
        "In interviews, mention that you use small, focused commits with messages that explain **why**, not only **what**—reviewers and future you will read the log under time pressure.",
    },
    {
      type: "heading",
      level: 2,
      content: ".gitignore",
    },
    {
      type: "text",
      content:
        "A `.gitignore` file lists patterns for paths Git should **not** track. Typical entries: virtual environments, dependency folders, build outputs, OS junk, and **secrets** (`.env`, service account JSON). For Python ML work you often ignore `__pycache__/`, `.venv/`, `*.pyc`, and artifact directories.",
    },
    {
      type: "code",
      language: "bash",
      filename: ".gitignore",
      code: `.env
.venv/
__pycache__/
*.pyc
node_modules/
dist/
.ipynb_checkpoints/
*.sqlite`,
    },
    {
      type: "callout",
      variant: "danger",
      title: "Secrets in Git are permanent in practice",
      content:
        "If you commit an API key, assume it is compromised: rotate the key and use secret scanning. Prevention beats cleanup—keep `.env` ignored and use templates like `.env.example` with dummy values.",
    },
    {
      type: "heading",
      level: 2,
      content: "Mental model checklist",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Edit files → working directory changes.",
        "`git add` → stage a subset you are ready to snapshot.",
        "`git commit` → record staged state; working directory may still have other edits.",
        "`git log` / `git diff` → understand history and uncommitted work.",
      ],
    },
  ],
  keyTakeaways: [
    "Git tracks snapshots (commits) of your project, not just “latest files.”",
    "Separate working directory, staging, and repository—stage intentionally before committing.",
    "HEAD points to your current commit; diff and show use it as a reference.",
    ".gitignore keeps noise and secrets out of history; treat leaked keys as incidents.",
    "Small commits with clear messages make code review and debugging easier.",
  ],
  interviewTips: [
    "Be ready to draw or narrate the three-tree model; interviewers use it to test fundamentals.",
    "Tie Git to team outcomes: reproducibility, review, rollbacks, and CI—not “we use Git because everyone does.”",
    "Mention you never commit `.env` or model weights when discussing responsible GenAI delivery.",
    "If asked about mistakes, describe recovering with `git status`, `git diff`, and careful staging—shows operational maturity.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "git-01-ex-01",
      question:
        "You changed `prompts/system.txt` and `src/app.py`. You want only `src/app.py` in the next commit. Which sequence is correct?",
      options: [
        "`git add .` then `git commit`",
        "`git add src/app.py` then `git commit`",
        "`git commit src/app.py` without `git add` (always works)",
        "`git stash` then `git commit`",
      ],
      correctIndex: 1,
      explanation:
        "`git add` stages specific paths. `git add .` would stage everything including `prompts/system.txt`. `git commit` records what is staged; path-only `git commit` without staging can work only in certain flows with flags, but the standard safe path is add then commit.",
      interviewNote:
        "Shows you understand selective staging—critical when prompt and code changes belong in different commits or PRs.",
    },
    {
      type: "code-completion",
      id: "git-01-ex-02",
      question:
        "Fill in the command to show changes that are **staged** for the next commit.",
      codeTemplate: "git diff ___",
      language: "bash",
      correctAnswer: "--staged",
      acceptableAnswers: ["--cached", "--staged"],
      explanation:
        "`git diff --staged` (synonym `--cached`) compares the staging area to the last commit. Plain `git diff` shows unstaged working tree changes.",
      interviewNote:
        "Interviewers may ask how you verify a commit before you run `git commit`; naming `--staged` signals precision.",
    },
    {
      type: "ordering",
      id: "git-01-ex-03",
      question:
        "Order these steps for the **first time** you put a new local project under Git and create an initial commit.",
      items: [
        "`git commit -m \"Initial commit\"`",
        "`git init`",
        "`git add` (stage files you want tracked)",
      ],
      correctOrder: [1, 2, 0],
      explanation:
        "Initialize the repo (`git init`), stage files (`git add`), then commit. Committing before `add` usually creates an empty commit or nothing to commit.",
      interviewNote:
        "Basic sequencing questions filter for hands-on use versus memorizing definitions only.",
    },
    {
      type: "true-false",
      id: "git-01-ex-04",
      statement:
        "After `git commit`, the working directory is always identical to the last commit—no uncommitted changes can remain.",
      correct: false,
      explanation:
        "`git commit` only snapshots **staged** changes. You can still have unstaged or untracked files in the working directory after a commit.",
      interviewNote:
        "A common trap question; answering false with staging vs working tree shows depth.",
    },
    {
      type: "scenario",
      id: "git-01-ex-05",
      scenario:
        "You are on a GenAI sprint. You accidentally created a `.env` with an OpenAI API key and ran `git add .` in the project root. You have **not** committed yet.",
      question:
        "What do you do next to keep the key out of Git, and what would you do if you had already committed?",
      sampleAnswer:
        "Immediately run `git reset HEAD .env` or `git restore --staged .env` to unstage the file. Confirm with `git status`. Add `.env` to `.gitignore` if missing. If the key was committed, rotate the key with the provider, remove it from history (e.g., `git filter-repo` or BFG) if policy requires, and force-push only with team agreement—treat the old key as leaked.",
      keyPoints: [
        "Unstage before commit is cheap; fixing published history is expensive.",
        ".gitignore prevents recurrence; it does not remove already tracked files.",
        "Secret rotation is mandatory once a key touched a shared remote.",
      ],
      interviewNote:
        "Accenture-style delivery stresses governance; mentioning rotation and policy aligns with client expectations.",
    },
  ],
};
