import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cloud-platforms-03",
  skillId: "cloud-platforms",
  order: 3,
  title: "AWS & GCP for AI",
  subtitle:
    "High-signal overview of AWS Bedrock, SageMaker, Lambda, S3, GCP Vertex AI, BigQuery, Cloud Functions, cross-cloud equivalence, and how to justify a platform choice in an interview.",
  estimatedMinutes: 15,
  objectives: [
    "Describe AWS Bedrock and how teams access foundation models securely.",
    "Summarize SageMaker’s role versus serverless inference patterns.",
    "Explain Vertex AI and BigQuery in analytics-heavy AI workloads.",
    "Map equivalent services across AWS, Azure, and GCP for compute, storage, functions, and AI gateways.",
    "Discuss how to choose a cloud for a GenAI project without sounding tribal.",
  ],
  content: [
    {
      type: "text",
      content:
        "Accenture delivers **multi-cloud** programs, but candidates should still speak fluently about **AWS** and **GCP**—clients standardize on different vendors by history, acquisition, or data science preference. This lesson focuses on **managed AI APIs**, **ML platforms**, **serverless glue**, and **data lakes** that appear in real architectures.",
    },
    {
      type: "heading",
      level: 2,
      content: "AWS for GenAI",
    },
    {
      type: "heading",
      level: 3,
      content: "Amazon Bedrock",
    },
    {
      type: "text",
      content:
        "**Amazon Bedrock** is AWS’s **fully managed service** for invoking **foundation models** from multiple providers through a unified API. Typical use: select a model, configure IAM permissions, call **InvokeModel** or **Converse** from application code, and log outputs to CloudWatch. You still design **prompts, retrieval, and evaluation**—Bedrock is the **gateway**, not the product by itself.",
    },
    {
      type: "heading",
      level: 3,
      content: "Amazon SageMaker (basics)",
    },
    {
      type: "text",
      content:
        "**SageMaker** covers notebooks, training jobs, **feature store**, model registry, and **endpoints** for online inference. For GenAI, teams use it for **fine-tuning**, batch evaluation, or hosting custom models when Bedrock’s catalog is not enough. Expect interview prompts about **when to train** versus **when to retrieve** or prompt.",
    },
    {
      type: "heading",
      level: 3,
      content: "Lambda, S3, and the glue layer",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**AWS Lambda:** Run short HTTP handlers or event-driven workers (S3 upload → Lambda → enqueue embedding job). Pay per invocation; watch cold starts and concurrency limits for LLM fan-out.",
        "**Amazon S3:** Durable object store for documents, parquet features, and model artifacts. Often the **source of truth** before indexing into OpenSearch or a vector DB.",
      ],
    },
    {
      type: "code",
      language: "bash",
      filename: "aws_cli_bedrock_hint.sh",
      code: `# List foundation models available in Bedrock (IAM permissions required)
aws bedrock list-foundation-models --region us-east-1 --query "modelSummaries[?contains(modelId, 'anthropic')].modelId" --output table

# Example: invoke via AWS CLI is possible but apps usually use boto3 SDK
# Always enforce least-privilege IAM policies on bedrock:InvokeModel`,
    },
    {
      type: "heading",
      level: 2,
      content: "GCP for GenAI",
    },
    {
      type: "heading",
      level: 3,
      content: "Vertex AI",
    },
    {
      type: "text",
      content:
        "**Vertex AI** is Google Cloud’s unified ML platform: datasets, training pipelines, **Model Garden** (Google and partner models), and online/batch prediction. For LLMs, teams use **Gemini** APIs through Vertex with enterprise controls (VPC-SC, CMEK) similar in spirit to Azure OpenAI’s enterprise positioning.",
    },
    {
      type: "heading",
      level: 3,
      content: "BigQuery for analytics",
    },
    {
      type: "text",
      content:
        "**BigQuery** is a serverless warehouse for structured analytics at scale. In AI interviews, connect it to **feature engineering**, **batch scoring**, **LLM-generated SQL** guardrails, and **data governance** (row-level security). It complements—not replaces—vector search for unstructured text.",
    },
    {
      type: "heading",
      level: 3,
      content: "Cloud Functions",
    },
    {
      type: "text",
      content:
        "**Google Cloud Functions** (and Cloud Run) host lightweight APIs that call Vertex, enqueue Pub/Sub jobs, or validate requests—analogous to Lambda + API Gateway patterns on AWS.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Equivalence, not identity",
      content:
        "Cloud services evolve monthly. In interviews, treat equivalence tables as **directional**: they show you understand **categories** (managed LLM gateway, serverless compute, object store) even if feature names differ.",
    },
    {
      type: "heading",
      level: 2,
      content: "Service equivalence (AWS ↔ Azure ↔ GCP)",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Managed LLM / FM access:** Bedrock ↔ Azure OpenAI + Azure AI model catalog ↔ Vertex AI Model Garden / Gemini API.",
        "**ML platform / notebooks:** SageMaker ↔ Azure Machine Learning ↔ Vertex AI (Workbench, Pipelines).",
        "**Serverless functions:** Lambda ↔ Azure Functions ↔ Cloud Functions (Cloud Run for containers).",
        "**Object storage:** S3 ↔ Azure Blob Storage ↔ Cloud Storage.",
        "**Managed Kubernetes:** EKS ↔ AKS ↔ GKE.",
        "**IAM:** IAM ↔ Entra ID + Azure RBAC ↔ Cloud IAM.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Choosing the right cloud for your project",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Existing estate:** SAP on Azure, massive AWS data lake, or BigQuery-centric analytics often dictate the starting point.",
        "**Talent and support:** Partner incentives, internal guilds, and enterprise agreements reduce friction.",
        "**Compliance:** Data residency, encryption keys, and network isolation requirements may favor one vendor’s region map or private link story.",
        "**Feature fit:** Specific models, GPU quotas, or search integrations may tip a spike—validate with a **time-boxed proof**.",
      ],
    },
    {
      type: "tip",
      content:
        "Accenture-safe answer: \"We align to the client’s **cloud center of excellence** and security baseline, then pick services that meet **latency, cost, and model** requirements—often Azure-first, but we integrate AWS/GCP data sources via event buses and APIs.\"",
    },
    {
      type: "diagram",
      alt: "Equivalence of managed AI gateway and serverless API across three clouds",
      content: `flowchart TB
  subgraph aws [AWS]
    B[Bedrock] --> L[Lambda API]
    S3a[(S3)] --> L
  end
  subgraph azure [Azure]
    AO[Azure OpenAI] --> F[Azure Functions]
    Ba[(Blob)] --> F
  end
  subgraph gcp [GCP]
    V[Vertex AI Gemini] --> CF[Cloud Functions]
    Gs[(GCS)] --> CF
  end`,
    },
  ],
  keyTakeaways: [
    "Bedrock and Vertex AI are **managed model gateways**; engineering work remains in prompts, retrieval, evaluation, and security.",
    "SageMaker and Vertex AI cover **ML lifecycle** beyond chat—training, registry, batch, endpoints.",
    "Lambda / Functions / Cloud Run are typical **edge** layers for auth, orchestration, and throttling.",
    "S3 / Blob / GCS are standard **document and artifact** stores feeding indexes and pipelines.",
    "Equivalence thinking helps in multi-cloud interviews; **client context** picks the winner.",
  ],
  interviewTips: [
    "When asked \"AWS or GCP?\", respond with **criteria** (data gravity, IAM model, model catalog) not religion.",
    "Name **one concrete service** per category instead of fifteen buzzwords.",
    "Mention **IAM least privilege** for any `InvokeModel` or Vertex call—interviewers listen for security instinct.",
    "If the role is Azure-heavy, acknowledge AWS/GCP **as integration endpoints** (e.g. cross-cloud events, shared data products).",
  ],
  exercises: [
    {
      type: "scenario",
      id: "cp03-sc-multicloud",
      scenario:
        "A retail client stores product images in **S3**, runs analytics in **BigQuery**, and mandates **Azure AD** for workforce identity. They want a single GenAI assistant for store managers.",
      question:
        "In three sentences, how would you approach cloud placement without forcing one vendor for everything?",
      sampleAnswer:
        "Keep each datastore where it already meets compliance and skills, expose a **thin API** in the client’s preferred landing zone (often Azure for identity), and use **federated identity** or secure service principals for cross-cloud calls. Prototype the LLM path where enterprise agreements and private networking are strongest—typically **Azure OpenAI** here—while pulling catalog metadata from existing AWS/GCP systems via read-only APIs or replicated summaries. Document **latency, cost, and operational ownership** before hard-coding the topology.",
      keyPoints: [
        "Respect data gravity and existing investments.",
        "Put the user-facing API where IAM and contracts align.",
        "Prove cross-cloud patterns with metrics, not slogans.",
      ],
      interviewNote:
        "Shows systems thinking—Accenture interviewers value integration maturity.",
    },
    {
      type: "code-completion",
      id: "cp03-cc-boto",
      question:
        "Complete the boto3 **service name** used to call many Amazon Bedrock runtime operations (Python SDK).",
      codeTemplate: `import boto3
client = boto3.client("________", region_name="us-east-1")
# client.invoke_model(...)`,
      language: "python",
      correctAnswer: "bedrock-runtime",
      explanation:
        "The boto3 client for invocations is typically `bedrock-runtime` (hyphen in CLI/SDK service id). A separate `bedrock` client handles control-plane operations like listing models—know both exist.",
      interviewNote:
        "If unsure, say you would verify in boto3 docs—shows careful engineering habits.",
    },
    {
      type: "multiple-choice",
      id: "cp03-mc-sagemaker",
      question:
        "A data science team needs **GPU training**, experiment tracking, a **model registry**, and **HTTPS endpoints** for a custom transformer—not just an API to a vendor foundation model. Which AWS offering fits best as the primary platform?",
      options: [
        "AWS Lambda only",
        "Amazon SageMaker",
        "Amazon S3 Glacier",
        "AWS CloudFront",
      ],
      correctIndex: 1,
      explanation:
        "SageMaker is the managed ML platform for notebooks, training, registration, and deployment. Lambda is for short serverless functions; Glacier is archival storage; CloudFront is CDN—none replace an ML platform for training and serving custom models.",
      interviewNote:
        "Clarify you might still **call Bedrock** from the same architecture for some tasks—hybrid is common.",
    },
    {
      type: "ordering",
      id: "cp03-ord-lifecycle",
      question:
        "Order these **ML platform** activities in a typical **mature** lifecycle (first → last).",
      items: [
        "Register a versioned model artifact after validation metrics pass gates",
        "Run offline batch scoring or shadow traffic on a candidate model",
        "Train or fine-tune using a tracked experiment and dataset snapshot",
        "Deploy the approved model to a production endpoint behind monitoring",
      ],
      correctOrder: [2, 1, 0, 3],
      explanation:
        "Train with experiment tracking → evaluate offline or shadow → register the promoted artifact → deploy to production with monitoring. Gates and automation vary, but **register before prod deploy** is the usual contract.",
      interviewNote:
        "Mention CI/CD triggers and human approval for regulated clients.",
    },
    {
      type: "true-false",
      id: "cp03-tf-bigquery-rag",
      statement:
        "BigQuery alone is always the best primary store for semantic search over millions of unstructured PDF pages in a RAG system.",
      correct: false,
      explanation:
        "BigQuery excels at structured analytics and can host embeddings in some designs, but large-scale **unstructured** RAG usually pairs object storage + specialized **search/vector** layers (Vertex AI Search, open-source vector DBs, etc.). The best design depends on access patterns, latency, and cost—not a single warehouse.",
      interviewNote:
        "Show you know **hybrid architectures**: warehouse for metrics, vector index for passages.",
    },
  ],
};
