import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "git-02",
  skillId: "git",
  order: 2,
  title: "Branching, Merging & Rebasing",
  subtitle:
    "Isolate work on branches, integrate changes with merge or rebase, resolve conflicts, and use stash and cherry-pick safely.",
  estimatedMinutes: 15,
  objectives: [
    "Create and switch branches for parallel feature and experiment work.",
    "Compare merge and rebase and know when each is appropriate on shared branches.",
    "Resolve merge conflicts using status, diff, and markers in files.",
    "Explain fast-forward vs three-way merge outcomes.",
    "Use git stash and cherry-pick for focused, reversible workflows.",
  ],
  content: [
    {
      type: "heading",
      level: 2,
      content: "Why branches exist",
    },
    {
      type: "text",
      content:
        "A **branch** is a movable pointer to a commit. Branches let you work on a new RAG retriever, a prompt tweak, or a bugfix **without destabilizing** `main`. When the work is reviewed and tested, you integrate it back. On client projects, branches map to tickets, PRs, or release trains.",
    },
    {
      type: "heading",
      level: 3,
      content: "Creating and switching branches",
    },
    {
      type: "text",
      content:
        "`git branch` lists branches; `git branch feature/foo` creates a branch pointing at the current commit. `git switch feature/foo` (or older `git checkout feature/foo`) moves HEAD to that branch. `git switch -c feature/foo` creates and switches in one step.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git switch main
git pull origin main
git switch -c feature/rag-hybrid-search

# ... commit work ...

git switch main`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Naming conventions",
      content:
        "Common patterns: `feature/`, `fix/`, `chore/`, `docs/` prefixes; include ticket IDs when the org uses Jira/Azure Boards (`feature/ABC-123-hybrid-search`). Consistency beats clever names.",
    },
    {
      type: "heading",
      level: 2,
      content: "Merging: fast-forward vs three-way",
    },
    {
      type: "text",
      content:
        "**Merge** combines histories. **Fast-forward**: if `main` has no new commits since your branch split off, Git can move `main` forward to your tip—linear history, no merge commit. **Three-way merge**: if both branches moved, Git finds a common ancestor and builds a merge commit with two parents. That preserves the true parallel history.",
    },
    {
      type: "diagram",
      alt: "Fast-forward vs merge commit",
      content:
        "Fast-forward:\\n  main: A---B\\n  feature:     C\\n  After merge: A---B---C (main moved to C)\\n\\nThree-way:\\n  main:    A---B---M (merge commit)\\n  feature: A---X---Y---/\\n  Common ancestor: A or B as appropriate",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git switch main
git merge feature/rag-hybrid-search

# If you prefer always creating a merge commit (no FF):
# git merge --no-ff feature/rag-hybrid-search`,
    },
    {
      type: "heading",
      level: 2,
      content: "Rebase vs merge",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Merge** keeps a branched history; safe default for shared branches and for beginners.",
        "**Rebase** replays your commits on top of another branch, producing a **linear** sequence. It **rewrites** commit SHAs for the rebased commits.",
        "Rule of thumb: **do not rebase commits already pushed** that others might have based work on. Rebase local commits before opening a PR if your team prefers linear history.",
      ],
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git switch feature/rag-hybrid-search
git fetch origin
git rebase origin/main

# If conflicts: fix files, then
# git add <file>
# git rebase --continue
# To abort: git rebase --abort`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Shared branch discipline",
      content:
        "Rebasing `main` or a branch your teammates use, after they pulled your old SHAs, causes duplicate commits and painful recovery. When unsure, merge.",
    },
    {
      type: "heading",
      level: 2,
      content: "Merge conflicts",
    },
    {
      type: "text",
      content:
        "Conflicts happen when Git cannot auto-combine edits. You will see `<<<<<<<`, `=======`, `>>>>>>>` markers in files (or conflict markers in JSON/YAML—be careful). Process: `git status` lists **unmerged** paths; open each file, decide the correct combined content, remove markers, `git add` the file, then `git merge --continue` or `git commit` (merge) / `git rebase --continue` (rebase).",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git merge feature/conflicting-branch
# CONFLICT (content): Merge conflict in src/config.yaml

git status
# fix file, then:
git add src/config.yaml
git merge --continue`,
    },
    {
      type: "tip",
      content:
        "For GenAI repos, conflicts often hit `pyproject.toml`, lockfiles, or shared `prompts/*.md`. Resolve with the team’s source of truth—sometimes product owns prompts, platform owns dependencies.",
    },
    {
      type: "heading",
      level: 2,
      content: "git stash",
    },
    {
      type: "text",
      content:
        "**Stash** saves a snapshot of dirty working directory (and optionally staged) state so you can switch branches clean. Use when you must jump to a hotfix but are mid-edit. `git stash push -m \"wip: tokenizer\"` saves; `git stash list` shows stack; `git stash pop` applies and removes the latest.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git stash push -m "WIP: evaluation notebook"
git switch hotfix/token-limit
# ... work, commit ...
git switch -
git stash pop`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Stash is local",
      content:
        "`git stash` does not push to the remote. It is not a substitute for commits when you need backup or sharing.",
    },
    {
      type: "heading",
      level: 2,
      content: "git cherry-pick",
    },
    {
      type: "text",
      content:
        "**Cherry-pick** applies the patch from an existing commit onto your current branch, creating a **new** commit with a new SHA. Useful to pull one bugfix from another branch without merging everything. Risk: you duplicate the same logical change in two branches if you later merge—communicate with the team.",
    },
    {
      type: "code",
      language: "bash",
      filename: "terminal",
      code: `git switch release/1.2
git cherry-pick abc1234`,
    },
  ],
  keyTakeaways: [
    "Branches isolate work; merge or rebase integrates it—rebase rewrites history.",
    "Fast-forward merges are linear; three-way merges record parallel development.",
    "Resolve conflicts by editing files, removing markers, staging, and continuing the operation.",
    "Stash is for short, local context switches—not for long-term backup.",
    "Cherry-pick ports specific commits; coordinate to avoid duplicate fixes.",
  ],
  interviewTips: [
    "State clearly: “I avoid rebasing shared public history.” That single sentence scores well.",
    "Walk through conflict resolution: status → edit → add → continue.",
    "Relate branches to PRs: one ticket, one branch, small diffs when possible.",
    "If asked about Git Flow vs trunk-based, preview lesson 3—but know merge is universal.",
  ],
  exercises: [
    {
      type: "scenario",
      id: "git-02-ex-01",
      scenario:
        "`main` advanced while you worked on `feature/embeddings`. Your tech lead asks for a linear history on the PR. You have not pushed `feature/embeddings` yet, or only you use it.",
      question:
        "Which integration approach do you prefer and what commands outline the happy path?",
      sampleAnswer:
        "Fetch latest `main`, then `git switch feature/embeddings` and `git rebase origin/main` (or merge `main` into the feature if the team forbids rebase). Resolve conflicts per file, `git add`, `git rebase --continue`. Force-push the feature branch only if already pushed (`git push --force-with-lease`) after confirming no one else branched from it.",
      keyPoints: [
        "Rebase before push yields linear commits; merge preserves merge commits.",
        "`--force-with-lease` is safer than `--force` when updating remote branches.",
        "Team policy beats personal preference.",
      ],
      interviewNote:
        "Demonstrates you know rewrite implications and the safer force-push flag.",
    },
    {
      type: "true-false",
      id: "git-02-ex-02",
      statement:
        "A fast-forward merge can occur when the target branch has new commits after your feature branch was created.",
      correct: false,
      explanation:
        "Fast-forward happens when the target branch (e.g. `main`) **has not** moved forward from the merge-base to the tip of the branch being merged—Git can simply advance the pointer. If `main` has new commits, you typically need a merge commit or rebase first.",
      interviewNote:
        "Tests the merge graph, not just command names.",
    },
    {
      type: "multiple-choice",
      id: "git-02-ex-03",
      question:
        "During `git rebase`, you fix a conflict in `README.md`, run `git add README.md`. What is the correct next step?",
      options: [
        "`git commit -m \"fix conflict\"`",
        "`git rebase --continue`",
        "`git merge --abort`",
        "`git stash pop`",
      ],
      correctIndex: 1,
      explanation:
        "In a rebase, after staging resolved files, `git rebase --continue` resumes replaying commits. `git merge --abort` applies to merge, not rebase (use `git rebase --abort` to cancel).",
      interviewNote:
        "Mixing merge and rebase vocabulary is a red flag—precision matters.",
    },
    {
      type: "ordering",
      id: "git-02-ex-04",
      question:
        "Order these steps to resolve a **merge** conflict and complete the merge (standard workflow).",
      items: [
        "`git commit` (completes merge if all conflicts resolved)",
        "Edit conflicted files to final content; remove conflict markers",
        "`git status` to see unmerged paths",
        "`git add` on each resolved file",
      ],
      correctOrder: [2, 1, 3, 0],
      explanation:
        "Inspect status, fix files, stage resolutions, then commit to finalize the merge (or `merge --continue` in merge flows that use it).",
      interviewNote:
        "Shows procedural fluency under stress—similar to live pairing interviews.",
    },
    {
      type: "code-completion",
      id: "git-02-ex-05",
      question:
        "Complete the command to **abort** an in-progress rebase and return to the pre-rebase state.",
      codeTemplate: "git rebase ___",
      language: "bash",
      correctAnswer: "--abort",
      acceptableAnswers: ["--abort"],
      explanation:
        "`git rebase --abort` stops the rebase and restores HEAD to the state before `git rebase` started.",
      interviewNote:
        "Knowing escape hatches signals you have debugged real rebases, not only read docs.",
    },
  ],
};
