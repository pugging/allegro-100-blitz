import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cloud-platforms-04",
  skillId: "cloud-platforms",
  order: 4,
  title: "Deployment & MLOps Basics",
  subtitle:
    "From Docker images to production GenAI: registries, CI/CD, model APIs, secrets, observability, experimentation, IaC, cost discipline, and free-tier practice strategies.",
  estimatedMinutes: 15,
  objectives: [
    "Explain container basics and why teams package ML and LLM apps as images.",
    "Describe container registries and how CI/CD promotes immutable artifacts.",
    "Outline model serving patterns (REST endpoints, scaling, versioning).",
    "Manage secrets and environment configuration safely across environments.",
    "Name monitoring, logging, A/B testing, Terraform-level IaC, and cost controls relevant to Accenture delivery.",
  ],
  content: [
    {
      type: "text",
      content:
        "Shipping GenAI features is **software engineering** with extra risks: nondeterminism, data leakage, and fast-moving dependencies. Interviewers want to hear that you think about **containers**, **pipelines**, **secrets**, **observability**, and **cost**—not only notebook experiments.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Accenture delivery lens",
      content:
        "Large programs use **shared platforms**: enterprise container registries, approved base images, centralized logging, and FinOps reviews. Junior candidates stand out by referencing **those guardrails** rather than only local Docker Desktop flows.",
    },
    {
      type: "heading",
      level: 2,
      content: "Containerization (Docker basics)",
    },
    {
      type: "text",
      content:
        "A **container image** bundles your app, dependencies, and a minimal runtime filesystem. **Docker** (or buildpacks) produces images that run the same on a laptop, in CI, and on **Kubernetes** or **managed container services** (Azure Container Apps, ECS, Cloud Run). For Python LLM services, you pin **requirements.txt** or **Poetry** locks and avoid baking API keys into layers.",
    },
    {
      type: "code",
      language: "bash",
      filename: "docker_workflow.sh",
      code: `# Build and tag an API image locally
docker build -t myorg/genai-api:1.0.0 .

# Run with env vars injected at runtime (never ARG for production secrets)
docker run --rm -p 8080:8080 \\
  -e OPENAI_API_KEY="$OPENAI_API_KEY" \\
  myorg/genai-api:1.0.0

# Push to a registry (example: Azure Container Registry)
az acr login --name myregistry
docker tag myorg/genai-api:1.0.0 myregistry.azurecr.io/genai-api:1.0.0
docker push myregistry.azurecr.io/genai-api:1.0.0`,
    },
    {
      type: "heading",
      level: 2,
      content: "Container registries",
    },
    {
      type: "text",
      content:
        "**Registries** (ACR, ECR, Artifact Registry) store immutable image tags. Pipelines build once, scan for vulnerabilities, sign images (where required), and promote **the same digest** from dev → test → prod. This reduces \"works on my machine\" drift and supports rollback by redeploying a known tag.",
    },
    {
      type: "heading",
      level: 2,
      content: "CI/CD for ML and LLM apps",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Continuous integration:** Lint, unit tests, contract tests for APIs, and **container build** on every merge.",
        "**Continuous delivery:** Deploy to staging with **synthetic prompts** or golden-set regression tests before production approval.",
        "**Model artifacts:** Version prompts, retrieval indexes, and model weights/config separately; store metadata (hash, dataset snapshot) alongside the deployment ticket.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Model serving (API endpoints)",
    },
    {
      type: "text",
      content:
        "Expose models behind **REST or gRPC** APIs with **timeouts**, **rate limits**, and **structured error** responses. Scale horizontally for stateless inference; use **queues** for long jobs. For LLMs, add **streaming** where UX needs it and cap **max tokens** to control cost.",
    },
    {
      type: "heading",
      level: 2,
      content: "Environment variables and secrets",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Environment variables** configure non-secret toggles (region, feature flags, log level).",
        "**Secrets** belong in **Azure Key Vault**, **AWS Secrets Manager**, or **GCP Secret Manager**, injected at runtime via platform integration—not in Git or Dockerfiles.",
        "**Rotation:** Plan API key rotation and **zero-downtime** reload strategies with your platform team.",
      ],
    },
    {
      type: "callout",
      variant: "danger",
      title: "Never in the repo",
      content:
        "Hard-coded API keys are a **screening failure** in many Accenture-style interviews. Always say **Key Vault + managed identity** or the cloud-native equivalent.",
    },
    {
      type: "heading",
      level: 2,
      content: "Monitoring and logging",
    },
    {
      type: "text",
      content:
        "Instrument **latency**, **error rate**, **token usage**, and **cache hit rate** for retrieval. Log **request IDs** and **deployment versions**, not end-user PII. Dashboards in **Azure Monitor**, **CloudWatch**, or **Cloud Operations** support incident response and FinOps conversations.",
    },
    {
      type: "heading",
      level: 2,
      content: "A/B testing for models",
    },
    {
      type: "text",
      content:
        "Route a **percentage of traffic** to a challenger prompt, model version, or retrieval configuration. Compare **task success**, **human ratings**, or **downstream KPIs** (deflection, conversion). Feature flags or service mesh traffic splits implement this without duplicating entire stacks.",
    },
    {
      type: "heading",
      level: 2,
      content: "Infrastructure as code (Terraform mention)",
    },
    {
      type: "text",
      content:
        "**Terraform**, **Bicep**, or **CloudFormation** describe infrastructure declaratively so environments are reproducible and reviewed in PRs. You do not need to be a Terraform expert—interviewers want awareness that **prod changes** go through versioned modules and policy checks, not manual clicks alone.",
    },
    {
      type: "heading",
      level: 2,
      content: "Cost management",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Tagging** resources by cost center and environment.",
        "**Budgets and alerts** when token or GPU spend spikes.",
        "**Right-sizing** instances and using **autoscaling** min/max thoughtfully.",
        "**Caching** embeddings and repeated queries to cut duplicate model calls.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Getting started with free tiers",
    },
    {
      type: "tip",
      content:
        "Use **personal sandbox subscriptions** with spending caps, **destroy resources** after labs, and favor **serverless SKUs** for demos. Document what you built in a **README** with architecture sketch—portfolio beats passive video courses in interviews.",
    },
    {
      type: "diagram",
      alt: "CI builds container, pushes to registry, deploys to environment with secrets from vault",
      content: `flowchart LR
  DEV[Dev merge] --> CI[CI pipeline]
  CI --> IMG[Container image]
  IMG --> REG[(Registry)]
  REG --> DEPLOY[Deploy to env]
  KV[(Secrets vault)] --> DEPLOY
  DEPLOY --> MON[Monitoring + logs]`,
    },
  ],
  keyTakeaways: [
    "Containers standardize dependencies; registries store immutable artifacts promoted through environments.",
    "CI/CD for AI adds **eval harnesses** and artifact metadata, not only unit tests.",
    "Serving layers need timeouts, limits, auth, and scaling policies suited to LLM latency profiles.",
    "Secrets stay in vaults with rotation; env vars hold non-sensitive configuration.",
    "Observability, A/B tests, IaC, and FinOps are expected in enterprise delivery conversations.",
  ],
  interviewTips: [
    "When asked \"how would you deploy?\", answer **image → registry → orchestrator → traffic split** in one breath.",
    "Mention **Azure Container Apps / AKS** if the role is Microsoft-heavy; still acknowledge Kubernetes-agnostic ideas.",
    "Prepare one story: a bug you caught via **logs/metrics** or a rollback you performed.",
    "Ask clarifying questions about **RTO/RPO**, **PII**, and **approved tools**—consulting interviews reward structured thinking.",
  ],
  exercises: [
    {
      type: "true-false",
      id: "cp04-tf-dockerfile-secrets",
      statement:
        "Best practice is to pass production API keys as `ARG` values in a Dockerfile so the image is self-contained.",
      correct: false,
      explanation:
        "`ARG` values can leak in image history and build caches. Production secrets should be injected at **runtime** from a vault or platform secret store via environment variables or mounted secrets—not baked into the image build.",
      interviewNote:
        "Offer the alternative: multi-stage builds for slim images + runtime secret injection.",
    },
    {
      type: "scenario",
      id: "cp04-sc-rollback",
      scenario:
        "After a Friday deploy, error rates on your **LLM summarization API** double. Metrics show higher latency but infrastructure CPU is healthy.",
      question:
        "What three actions would you take in the first 30 minutes, in order?",
      sampleAnswer:
        "First, **rollback or traffic-shift** to the previous known-good deployment or feature flag state to protect users. Second, pull **structured logs** for the new version—compare token counts, upstream dependency errors, and retrieval timeouts versus the prior release. Third, reproduce with a **golden set** of prompts in staging to see if the model, prompt template, or retrieval index changed, then open a blameless incident note with hypotheses.",
      keyPoints: [
        "Mitigate user impact before deep debugging.",
        "Use versioned releases and flags for fast reversal.",
        "Separate infra vs model vs data pipeline causes.",
      ],
      interviewNote:
        "Accenture values calm **incident command** style answers.",
    },
    {
      type: "code-completion",
      id: "cp04-cc-dockerfile",
      question:
        "Complete the Dockerfile instruction that sets the **working directory** inside the container (common before COPY/CMD).",
      codeTemplate: `FROM python:3.12-slim
________ /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]`,
      language: "dockerfile",
      correctAnswer: "WORKDIR",
      acceptableAnswers: ["workdir"],
      explanation:
        "`WORKDIR /app` creates/changes to `/app` so subsequent `COPY` and commands run in a predictable path. Similar to `cd` during build and runtime defaults.",
      interviewNote:
        "Mention `USER` non-root for extra security points if relevant.",
    },
    {
      type: "multiple-choice",
      id: "cp04-mc-ab",
      question:
        "You want to compare two **prompt templates** on live traffic with minimal code duplication. What is the most fitting pattern?",
      options: [
        "Fork the entire repository for each prompt variant",
        "Use feature flags or weighted routing to split traffic between templates",
        "SSH into production servers and edit files manually",
        "Disable monitoring so differences are not visible",
      ],
      correctIndex: 1,
      explanation:
        "Feature flags or controlled traffic splits enable A/B or canary tests with shared infrastructure. Repo forks and manual SSH edits do not scale and lack governance; hiding monitoring is unsafe and unprofessional.",
      interviewNote:
        "Name a tool class (LaunchDarkly, Azure App Configuration, custom gateway) if asked for examples.",
    },
    {
      type: "ordering",
      id: "cp04-ord-iac",
      question:
        "Order these practices from **strongest governance** (first) to **weakest** (last) for production infrastructure changes.",
      items: [
        "Clicking resources into existence in the console without documentation",
        "Terraform modules reviewed in PR with policy checks, then applied by automation",
        "Ad-hoc CLI scripts run from a single engineer's laptop without peer review",
        "Infrastructure defined in version control but applied manually from engineers' machines",
      ],
      correctOrder: [1, 3, 2, 0],
      explanation:
        "Best: reviewed IaC + automated apply with guardrails. Next: code in Git but manual apply (better than nothing). Worse: unreviewed scripts. Weakest: undocumented console-only changes that cannot be reproduced.",
      interviewNote:
        "Relate to **policy-as-code** (OPA, Azure Policy) if the conversation goes deep.",
    },
  ],
};
