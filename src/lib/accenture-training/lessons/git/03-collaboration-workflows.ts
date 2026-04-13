import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "git-03",
  skillId: "git",
  order: 3,
  title: "Collaboration, PRs & CI/CD",
  subtitle:
    "Remotes, pull requests, reviews, branching strategies, GitHub Actions, protected branches, and releases for delivery teams.",
  estimatedMinutes: 15,
  objectives: [
    "Use fetch, pull, and push correctly with remote tracking branches.",
    "Describe pull requests and constructive code review for GenAI codebases.",
    "Contrast Git Flow and trunk-based development at a high level.",
    "Read a basic GitHub Actions workflow and understand branch protection.",
    "Explain tags and releases for versioning services and artifacts.",
  ],
  content: [
    {
      type: "heading",
      level: 2,
      content: "Remote repositories",
    },
    {
      type: "text",
      content:
        "A **remote** (usually `origin`) is another copy of the repo on a server. Your local branches are independent until you **fetch** or **push**. `git clone` sets `origin` and checks out a default branch. For consulting squads, remotes live on GitHub Enterprise, Azure Repos, or GitLab—Git commands stay the same; URLs and auth differ.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git remote -v
git fetch origin
git pull origin main
git push -u origin feature/rag-metrics`,
    },
    {
      type: "callout",
      variant: "info",
      title: "fetch vs pull",
      content:
        "`git fetch` downloads commits and updates remote-tracking branches (e.g. `origin/main`) **without** merging into your current branch. `git pull` is typically `fetch` + `merge` (or `rebase`, depending on config). Many seniors prefer **fetch then merge/rebase explicitly** to see incoming changes first.",
    },
    {
      type: "heading",
      level: 2,
      content: "Pull requests (PRs) / merge requests",
    },
    {
      type: "text",
      content:
        "A **pull request** is a request to merge one branch into another (often `feature/*` → `main`). It bundles **diff**, description, linked ticket, CI results, and **review** threads. For GenAI work, PRs should call out prompt changes, new dependencies, evaluation impact, and any data-handling implications—reviewers cannot guess risk from code alone.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Keep PRs **small** when possible: easier review, faster feedback, simpler rollback.",
        "Write a **title** that states intent; use the body for context, screenshots, and test notes.",
        "Respond to review comments with commits or replies; resolve threads when addressed.",
      ],
    },
    {
      type: "tip",
      content:
        "When your PR touches both Python and prompts, consider splitting into two PRs or clearly section the description so reviewers can approve each concern.",
    },
    {
      type: "heading",
      level: 2,
      content: "Git Flow vs trunk-based (conceptual)",
    },
    {
      type: "text",
      content:
        "**Git Flow** uses long-lived branches like `develop`, `release/*`, and `hotfix/*` with prescribed merges—good for scheduled releases, heavier process. **Trunk-based** favors short-lived branches off `main`, frequent merges, feature flags, and strong CI—common in high-velocity product teams. Enterprises often blend: protected `main`, release tags, and automation gates.",
    },
    {
      type: "diagram",
      alt: "Trunk-based short branches versus Git Flow branches",
      content:
        "Trunk-based: contributors branch briefly from main, PR, merge often.\\nGit Flow: parallel develop/release/hotfix lines with merge choreography.\\nBoth rely on code review + CI; trunk-based stresses smaller batches.",
    },
    {
      type: "heading",
      level: 2,
      content: "GitHub Actions basics",
    },
    {
      type: "text",
      content:
        "CI/CD often starts with **GitHub Actions**: YAML workflows under `.github/workflows/` triggered by `push`, `pull_request`, or `schedule`. A job runs on a runner (Ubuntu, etc.), checks out code, installs dependencies, runs **lint/tests/build**, and can publish artifacts. GenAI repos might add secret-backed smoke tests against sandboxes—never print keys in logs.",
    },
    {
      type: "code",
      language: "yaml",
      filename: ".github/workflows/ci.yml",
      code: `name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Secrets in Actions",
      content:
        "Store API keys in **GitHub Secrets** or vault integrations; reference them as `${{ secrets.NAME }}`. Redact outputs and avoid echoing environment variables that contain credentials.",
    },
    {
      type: "heading",
      level: 2,
      content: "Protecting branches",
    },
    {
      type: "text",
      content:
        "**Branch protection rules** on `main` typically require: PR before merge, approving reviews, passing status checks, linear history (optional), and no force-push. This prevents accidental direct pushes that skip CI—critical when multiple Accenture pods touch the same client repo.",
    },
    {
      type: "heading",
      level: 2,
      content: "Tags and releases",
    },
    {
      type: "text",
      content:
        "A **tag** points to a specific commit—often `v1.3.0` for semantic versioning. **Releases** attach notes, binaries, or container images to a tag. For services, tags trigger deploy pipelines; for libraries, they mark PyPI/npm versions. Lightweight vs annotated tags: annotated (`git tag -a`) stores author, date, message—preferred for releases.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git tag -a v0.2.0 -m "RAG pipeline: hybrid search + eval harness"
git push origin v0.2.0`,
    },
    {
      type: "callout",
      variant: "success",
      title: "Interview sound bite",
      content:
        "“We use PRs into protected `main`, required CI green, at least one reviewer, and semver tags to cut releases.” That sentence maps cleanly to enterprise delivery.",
    },
  ],
  keyTakeaways: [
    "Remotes sync work; fetch vs pull matters for controlled integration.",
    "PRs are the collaboration unit: diff + context + CI + review.",
    "Git Flow vs trunk-based is a tradeoff of release cadence versus batch size.",
    "GitHub Actions encodes CI in YAML; secrets must never leak into logs.",
    "Tags/releases anchor deployable versions for services and libraries.",
  ],
  interviewTips: [
    "Mention protected `main`, required checks, and PR reviews as non-negotiables on client work.",
    "Connect Actions to your stack: pytest, ruff, mypy, or npm test—show you have run CI locally too.",
    "If asked about rollback, tie tags/releases to deploy pipelines and prior artifacts.",
    "For GenAI: call out human review for prompt and safety-related changes, not only code style.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "git-03-ex-01",
      question:
        "Your teammate pushed new commits to `origin/main`. You want to **see** those commits locally **without** merging them into your current branch yet. What do you run?",
      options: [
        "`git pull`",
        "`git push origin main`",
        "`git fetch origin`",
        "`git clone`",
      ],
      correctIndex: 2,
      explanation:
        "`git fetch` updates remote-tracking branches like `origin/main` while leaving your current branch untouched. You can then `git log origin/main` or merge/rebase when ready.",
      interviewNote:
        "Separating fetch from pull signals mature daily workflow.",
    },
    {
      type: "ordering",
      id: "git-03-ex-02",
      question:
        "Order these steps for a typical **first push** of a new local branch to `origin` and upstream tracking.",
      items: [
        "`git push -u origin feature/my-branch`",
        "Commit work on `feature/my-branch` locally",
        "`git switch -c feature/my-branch` (create branch from updated base)",
      ],
      correctOrder: [2, 1, 0],
      explanation:
        "Create the branch from the right base, commit locally, then push and set upstream with `-u` so future `git push`/`git pull` know the remote branch.",
      interviewNote:
        "Upstream (`-u`) is a common follow-up question in live coding setups.",
    },
    {
      type: "true-false",
      id: "git-03-ex-03",
      statement:
        "Branch protection rules on `main` replace the need for code review—CI passing is sufficient quality gates.",
      correct: false,
      explanation:
        "Protection rules **enforce** process (e.g. reviews required), they do not replace human judgment. CI catches many issues but not product correctness, prompt safety, or architectural fit.",
      interviewNote:
        "Shows balance between automation and governance—relevant to regulated clients.",
    },
    {
      type: "code-completion",
      id: "git-03-ex-04",
      question:
        "Fill in the workflow path so GitHub Actions discovers the file (conventional location).",
      codeTemplate: "___/workflows/ci.yml",
      language: "bash",
      correctAnswer: ".github",
      acceptableAnswers: [".github"],
      explanation:
        "GitHub loads workflow YAML from `.github/workflows/` in the repository root.",
      interviewNote:
        "Basic CI path knowledge is often assumed for full-stack or platform interns.",
    },
    {
      type: "scenario",
      id: "git-03-ex-05",
      scenario:
        "The client’s repo requires two approvals on `main`, CI must pass, and force-push is disabled. You need to hotfix a production bug in the inference service tonight.",
      question:
        "Outline how you use branches, PR, CI, and tagging so the fix is traceable and compliant.",
      sampleAnswer:
        "Create `hotfix/inference-timeout` from the tagged production commit (or protected release branch if used). Implement the minimal fix, open a PR to `main` with clear description and risk. Request two reviewers per policy; if on-call allows, use designated approvers. Ensure CI green. Merge via PR (no direct push). Tag a new patch release (e.g. `v1.4.1`) on the merge commit or follow the client’s release job. Deploy via their pipeline; attach release notes linking ticket and rollback plan.",
      keyPoints: [
        "Hotfixes still go through protected `main` unless client defines `release/*` exception.",
        "Traceability: ticket, PR, CI run, tag, deploy record.",
        "Semantic patch bump for bugfixes communicates scope to ops.",
      ],
      interviewNote:
        "Accenture interviews value policy-aware answers over cowboy deploys.",
    },
  ],
};
