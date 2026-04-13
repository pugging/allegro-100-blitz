import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cloud-platforms-02",
  skillId: "cloud-platforms",
  order: 2,
  title: "Azure AI Services",
  subtitle:
    "How Accenture-scale teams use Azure for GenAI: Azure OpenAI, Cognitive Services, AI Search, Azure ML, Functions, resource management, and how it differs from calling OpenAI directly.",
  estimatedMinutes: 15,
  objectives: [
    "Explain Azure OpenAI Service: deployments, endpoints, keys, and responsible AI boundaries.",
    "Map prebuilt Azure AI (Cognitive Services) capabilities to common product needs.",
    "Describe hybrid search (vector + keyword) in Azure AI Search for RAG patterns.",
    "Position Azure Machine Learning and Azure Functions in an AI solution architecture.",
    "Use resource groups for governance and compare Azure OpenAI with the public OpenAI API at a high level.",
  ],
  content: [
    {
      type: "text",
      content:
        "**Microsoft Azure** is a primary cloud partner for Accenture across industries. For GenAI interviews, expect questions on **Azure OpenAI Service**, **Azure AI Search** (formerly Cognitive Search), and how you would **secure, deploy, and observe** models in an enterprise subscription—not only how to prompt a model.",
    },
    {
      type: "callout",
      variant: "success",
      title: "Why interviewers emphasize Azure",
      content:
        "Many client contracts standardize on Azure AD (Entra ID), private networking, and Microsoft agreements. Showing you can place AI resources inside **resource groups**, **VNets**, and **managed identity** patterns signals you can work on real delivery teams.",
    },
    {
      type: "heading",
      level: 2,
      content: "Azure OpenAI Service",
    },
    {
      type: "text",
      content:
        "Azure OpenAI exposes **compatible APIs** for chat, completions, and embeddings using **models you deploy inside your tenant**. You create a **deployment** (model + capacity), then call the regional endpoint with an API key or **Azure AD** token. Content filtering and abuse monitoring are part of the platform contract—know they exist and that policies are configurable within Microsoft’s guardrails.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Deployment:** Choose model family (e.g. GPT-4o, text-embedding-3) and throughput (TPM) in your Azure OpenAI resource.",
        "**Endpoint:** Region-specific URL; never hardcode keys—use Key Vault, managed identity, or pipeline secrets.",
        "**SDK:** `openai` Python package with Azure-specific client configuration (API version, Azure endpoint, deployment name).",
      ],
    },
    {
      type: "code",
      language: "python",
      filename: "azure_openai_chat.py",
      code: `import os
from openai import AzureOpenAI

# Use environment variables in real code — never commit keys
client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version="2024-02-15-preview",
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
)

response = client.chat.completions.create(
    model=os.environ["AZURE_OPENAI_DEPLOYMENT"],  # deployment name, not raw OpenAI model id
    messages=[{"role": "user", "content": "Summarize zero-trust in one paragraph."}],
)
print(response.choices[0].message.content)`,
    },
    {
      type: "heading",
      level: 2,
      content: "Azure AI / Cognitive Services (prebuilt APIs)",
    },
    {
      type: "text",
      content:
        "Beyond LLMs, **Azure AI services** include speech, vision, language, and decision APIs—for example transcription, document intelligence (layout OCR), translation, and custom classifiers. In solution design, you often **compose** a small specialized model with a general LLM rather than forcing one model to do everything.",
    },
    {
      type: "heading",
      level: 2,
      content: "Azure AI Search",
    },
    {
      type: "text",
      content:
        "**Azure AI Search** is a managed search service that supports **full-text**, **facets**, **filters**, and **vector fields** for semantic search. A typical RAG pattern: chunk documents → embed with Azure OpenAI embeddings → upsert vectors + metadata into an index → at query time run **hybrid search** (keyword + vector) → inject top results into the chat prompt.",
    },
    {
      type: "tip",
      content:
        "Interview soundbite: \"Hybrid search reduces the 'missed keyword' problem for proper nouns while vectors handle paraphrases.\"",
    },
    {
      type: "heading",
      level: 2,
      content: "Azure Machine Learning (AML)",
    },
    {
      type: "text",
      content:
        "**Azure Machine Learning** is the platform for training, tracking experiments (MLflow), registering models, and batch or online **managed endpoints**. For GenAI, teams use it for fine-tuning workflows, evaluation pipelines, and GPU compute—often alongside Azure OpenAI for base models.",
    },
    {
      type: "heading",
      level: 2,
      content: "Azure Functions for AI endpoints",
    },
    {
      type: "text",
      content:
        "**Azure Functions** (and Azure Container Apps / App Service) host lightweight **HTTP APIs** that call Azure OpenAI, enqueue jobs, or validate requests. They integrate with **Application Insights** for tracing and give you a place to enforce **auth**, **rate limits**, and **PII redaction** before the model sees text.",
    },
    {
      type: "heading",
      level: 2,
      content: "Resource groups and management",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Resource group:** Logical container for related resources (OpenAI account, Search service, Function App) with shared lifecycle and tagging for cost allocation.",
        "**RBAC:** Azure roles control who can read keys, deploy models, or change networking.",
        "**Policies:** Azure Policy enforces org rules (e.g. deny public blob access) across subscriptions.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Azure OpenAI vs direct OpenAI API",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Data processing:** Enterprise deals often prefer Azure OpenAI for **Microsoft’s commercial data boundary** and existing Azure contracts—always confirm current terms with your engagement lead.",
        "**Identity:** Azure AD–based auth integrates with corporate SSO; public OpenAI uses API keys and separate org billing.",
        "**Model availability:** SKUs and regions differ; deployment names replace some \"model\" parameters you know from OpenAI docs.",
        "**Features:** Parity moves quickly—verify API versions and features (e.g. assistants, batch) in official docs for your interview examples.",
      ],
    },
    {
      type: "diagram",
      alt: "RAG on Azure with OpenAI embeddings, AI Search index, and Function App API",
      content: `flowchart LR
  subgraph ingest [Ingest]
    DOC[Documents] --> CH[Chunk + embed]
  end
  CH --> AOAI[Azure OpenAI embeddings]
  AOAI --> IDX[(Azure AI Search index)]
  U[User] --> FN[Azure Function API]
  FN --> SRCH[Hybrid query]
  SRCH --> IDX
  IDX --> FN
  FN --> CHAT[Azure OpenAI chat deployment]
  CHAT --> U`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Compliance language",
      content:
        "Do not invent legal guarantees in interviews. Say you would follow **client policy**, **DPA**, and **Microsoft documentation** for data residency, logging, and human review requirements.",
    },
  ],
  keyTakeaways: [
    "Azure OpenAI uses **deployments** and Azure endpoints; SDK configuration differs slightly from the public OpenAI API.",
    "Azure AI Search combines keyword and vector retrieval—common backbone for enterprise RAG.",
    "Azure ML supports training, registry, and managed endpoints; Functions/App Service host secure front doors to models.",
    "Resource groups, RBAC, and policies are how enterprises govern AI workloads at scale.",
    "Accenture contexts often assume **Azure-first** integration with Entra ID and hybrid networking.",
  ],
  interviewTips: [
    "Draw a **box diagram**: client → API → search → LLM, and mention **where secrets live** (Key Vault).",
    "Say **hybrid search** when asked how to improve retrieval quality—then name metadata filters.",
    "If unsure on a SKU, say you would check **model catalog**, **quota**, and **region availability** in the portal.",
    "Connect to **MLOps** vocabulary: environments, versioning, evaluation, and rollback—even for LLM apps.",
  ],
  exercises: [
    {
      type: "code-completion",
      id: "cp02-cc-azure-client",
      question:
        "Complete the Azure OpenAI Python client constructor argument that holds the **regional base URL** (not the deployment name).",
      codeTemplate: `client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version="2024-02-15-preview",
    ________=os.environ["AZURE_OPENAI_ENDPOINT"],
)`,
      language: "python",
      correctAnswer: "azure_endpoint",
      explanation:
        "`azure_endpoint` is the keyword argument for your resource URL (e.g. `https://myresource.openai.azure.com/`). The deployment name is passed separately when calling `chat.completions.create`.",
      interviewNote:
        "Mention you would rotate keys via Key Vault and prefer managed identity in production.",
    },
    {
      type: "multiple-choice",
      id: "cp02-mc-search",
      question:
        "You need enterprise RAG over PDFs with **acronyms and product codes** that users type verbatim. Which retrieval approach do you advocate first on Azure?",
      options: [
        "Vector-only search in Azure AI Search",
        "Hybrid search (keyword + vector) with metadata filters",
        "Load every PDF into the prompt each request",
        "Fine-tune the base model on all PDFs weekly",
      ],
      correctIndex: 1,
      explanation:
        "Hybrid search helps exact tokens and rare strings while vectors help paraphrases. Metadata filters narrow scope (e.g. by department). Vector-only can miss exact codes; full-PDF prompts do not scale; weekly full fine-tuning is heavy for volatile docs.",
      interviewNote:
        "Add that you would measure hit rate, nDCG, or task success with a labeled eval set.",
    },
    {
      type: "ordering",
      id: "cp02-ord-rag-azure",
      question:
        "Order these steps for a **batch ingest** into Azure AI Search with Azure OpenAI embeddings (first → last).",
      items: [
        "Upsert documents with text + vector fields into the search index",
        "Chunk source documents and call embedding deployment per chunk",
        "Define or update the index schema to include a vector field and key",
        "Extract text from source files (e.g. blob storage triggers)",
      ],
      correctOrder: [2, 3, 1, 0],
      explanation:
        "You need an index schema with a vector field before you can store vectors. Typical flow: extract text → chunk → embed → upsert into the index. (Exact automation varies; schema readiness always precedes first vector upsert.)",
      interviewNote:
        "If challenged on parallelism, mention batched embedding calls and idempotent upserts.",
    },
    {
      type: "true-false",
      id: "cp02-tf-deployment-name",
      statement:
        "In the Azure OpenAI Python SDK, the `model` parameter in `chat.completions.create` is always identical to the public OpenAI model string such as `gpt-4o` with no deployment concept.",
      correct: false,
      explanation:
        "On Azure OpenAI you pass your **deployment name** as the `model` argument (deployment name you chose in Azure), which maps to a specific model SKU behind the scenes. It is not the same as copying raw OpenAI model IDs without checking your deployment configuration.",
      interviewNote:
        "Clarify that API *shape* is similar but *resource naming* is Azure-specific.",
    },
    {
      type: "scenario",
      id: "cp02-sc-secure",
      scenario:
        "A client wants an internal GenAI chatbot on Azure. Security mandates **no API keys in application code** and **auditability** of who called the model.",
      question:
        "Outline two concrete Azure mechanisms you would mention in the design (not full implementation).",
      sampleAnswer:
        "Use **managed identities** so the Function App or App Service calls Azure OpenAI without storing keys, backed by **Azure RBAC** on the Cognitive Services resource. Forward **Entra ID (Azure AD)** user identity or app roles at the API layer and log **request IDs, caller principal, and deployment name** to Log Analytics / Application Insights for audit trails.",
      keyPoints: [
        "Managed identity removes long-lived keys from code.",
        "Entra ID for user/app authentication at the edge.",
        "Centralized logging for compliance evidence.",
      ],
      interviewNote:
        "Optionally mention private endpoints if the interviewer asks about network isolation.",
    },
  ],
};
