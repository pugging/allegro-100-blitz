import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cloud-platforms-01",
  skillId: "cloud-platforms",
  order: 1,
  title: "Cloud Computing Fundamentals",
  subtitle:
    "Core concepts for interviews: service models, deployment models, regions, the major building blocks, pricing, and how to navigate AWS, Azure, and GCP at a junior level.",
  estimatedMinutes: 15,
  objectives: [
    "Define cloud computing and contrast IaaS, PaaS, and SaaS with examples.",
    "Explain public, private, and hybrid cloud and when enterprises choose each.",
    "Describe regions, availability zones, and why they matter for resilience and latency.",
    "Name essential service families (compute, storage, networking, databases) and common pricing models.",
    "Navigate consoles and CLIs at a high level and compare the Big Three providers.",
  ],
  content: [
    {
      type: "text",
      content:
        "**Cloud computing** is on-demand delivery of IT resources over a network, usually with pay-as-you-go pricing and self-service provisioning. Instead of owning data centers, you rent capacity from a **cloud provider** that operates global infrastructure, APIs, and managed services.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Accenture context",
      content:
        "Accenture delivers large-scale transformation programs on cloud—often **Microsoft Azure** in enterprise and public-sector deals. Showing you understand Azure *and* can speak neutrally about AWS and GCP signals breadth without ignoring the partner ecosystem.",
    },
    {
      type: "heading",
      level: 2,
      content: "IaaS, PaaS, and SaaS",
    },
    {
      type: "text",
      content:
        "These models describe **how much the provider manages** versus what your team still operates. Interviewers often ask you to classify a product or to pick a model for a scenario.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**IaaS (Infrastructure as a Service):** Virtual machines, networks, block storage—you manage OS, runtime, and app. Examples: AWS EC2, Azure Virtual Machines, GCP Compute Engine.",
        "**PaaS (Platform as a Service):** Managed runtime and scaling; you focus on code and data. Examples: Azure App Service, AWS Elastic Beanstalk, Google App Engine.",
        "**SaaS (Software as a Service):** End-user applications in the browser. Examples: Microsoft 365, Salesforce, Slack.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Public, private, and hybrid cloud",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Public cloud:** Shared provider infrastructure (multi-tenant), fastest to provision, global scale.",
        "**Private cloud:** Dedicated environment (on-prem or hosted) for stricter control or compliance.",
        "**Hybrid cloud:** Workloads span public cloud and private/on-prem, often with consistent identity and networking (e.g. Azure Arc, AWS Outposts patterns).",
      ],
    },
    {
      type: "tip",
      content:
        "If asked \"why hybrid?\", mention data residency, legacy systems, phased migration, or burst capacity to public cloud while keeping sensitive data on-prem.",
    },
    {
      type: "heading",
      level: 2,
      content: "Regions and availability zones",
    },
    {
      type: "text",
      content:
        "A **region** is a geographic area (e.g. `westeurope`, `us-east-1`). Within a region, **availability zones (AZs)** are isolated data-center locations with separate power and networking. Deploying across AZs improves **fault tolerance**; choosing a region close to users reduces **latency** and can affect **data residency**.",
    },
    {
      type: "heading",
      level: 2,
      content: "Key service families",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**Compute:** VMs, containers (Kubernetes), serverless functions.",
        "**Storage:** Object storage (files/blobs), block disks, archival tiers.",
        "**Networking:** VPCs/VNets, load balancers, DNS, CDNs, private connectivity.",
        "**Databases:** Relational (managed SQL), NoSQL, caches, warehouses, and vector-capable search.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Pricing models (conceptual)",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "**On-demand:** Pay for what you use by the hour/second—flexible, no commitment.",
        "**Reserved / savings plans:** Commit for 1–3 years for lower rates—good for steady workloads.",
        "**Spot / preemptible:** Deep discounts for interruptible capacity—great for batch jobs, risky for latency-sensitive APIs.",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "The Big Three at a glance",
    },
    {
      type: "text",
      content:
        "**AWS** has the broadest service catalog and market share. **Azure** integrates tightly with Microsoft identity, Office, and enterprise agreements—common in Accenture client landscapes. **GCP** is strong in data analytics, BigQuery, and Kubernetes (GKE). For GenAI, all three offer managed model APIs and ML platforms (covered in later lessons).",
    },
    {
      type: "heading",
      level: 3,
      content: "CLI and console",
    },
    {
      type: "text",
      content:
        "Each cloud provides a **web console** for exploration and a **CLI** for automation. You authenticate once (profiles, service principals, SSO), then create and inspect resources from the terminal or scripts.",
    },
    {
      type: "code",
      language: "bash",
      filename: "cli_examples.sh",
      code: `# Azure CLI (examples — names vary by subscription)
az login
az group create --name rg-demo --location westeurope
az group list -o table

# AWS CLI
aws configure list
aws s3 ls

# Google Cloud SDK
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud compute zones list`,
    },
    {
      type: "diagram",
      alt: "One cloud region containing multiple isolated availability zones",
      content: `flowchart TB
  subgraph region [Region e.g. West Europe]
    subgraph az1 [Availability Zone 1]
      C1[Compute + storage]
    end
    subgraph az2 [Availability Zone 2]
      C2[Compute + storage]
    end
    subgraph az3 [Availability Zone 3]
      C3[Compute + storage]
    end
  end
  LB[Load balancer / global routing] --> az1
  LB --> az2
  LB --> az3`,
    },
    {
      type: "callout",
      variant: "warning",
      title: "Interview pitfall",
      content:
        "Avoid claiming you are \"certified\" in a cloud you only clicked through once. Say what you have **built or debugged** (e.g. deployed a function, set IAM roles, read billing) and what you would **look up** in docs.",
    },
  ],
  keyTakeaways: [
    "IaaS vs PaaS vs SaaS is about the boundary of provider-managed vs team-managed responsibility.",
    "Regions and AZs trade off latency, compliance, and resilience; multi-AZ is a standard resilience pattern.",
    "Compute, storage, networking, and data services are the vocabulary for almost every architecture question.",
    "On-demand, reserved, and spot/preemptible pricing match different workload shapes and risk tolerance.",
    "Azure is central to many Accenture engagements; AWS and GCP remain important for cross-cloud literacy.",
  ],
  interviewTips: [
    "Lead with **business outcomes** (speed, cost, resilience) before listing product names.",
    "When comparing clouds, use one sentence each—avoid a feature dump.",
    "Mention **identity** (Azure AD / Entra ID, IAM roles) as the gate for any real project.",
    "If you lack hands-on depth, say how you would validate an answer: official docs, Well-Architected / CAF frameworks, or a small proof in a sandbox subscription.",
  ],
  exercises: [
    {
      type: "multiple-choice",
      id: "cp01-mc-paas",
      question:
        "Your team deploys a Python API as containers but does not want to patch OS kernels or manage VM fleets. Which model best describes **Azure Container Apps** or **AWS App Runner** at a high level?",
      options: [
        "Pure IaaS—you still install hypervisors",
        "PaaS-style managed runtime with scaling abstracted away",
        "SaaS—end users subscribe in a browser only",
        "On-prem private cloud with no provider APIs",
      ],
      correctIndex: 1,
      explanation:
        "These offerings abstract much of the infrastructure and orchestration so teams focus on container images and configuration—characteristic of PaaS or 'serverless containers' patterns rather than raw IaaS VMs.",
      interviewNote:
        "Nuance: Kubernetes services (AKS/EKS/GKE) sit between IaaS and PaaS—you manage more than App Service but less than bare metal.",
    },
    {
      type: "ordering",
      id: "cp01-ord-responsibility",
      question:
        "Order these **IaaS** responsibilities from **most provider-managed** (top) to **most customer-managed** (bottom).",
      items: [
        "Patching the guest OS and application runtime on a VM",
        "Physical data-center cooling and power",
        "Choosing instance type and attaching disks in the console",
        "Hypervisor and host hardware maintenance",
      ],
      correctOrder: [1, 3, 2, 0],
      explanation:
        "Provider handles physical facilities and host/hypervisor layers. Customer picks VM shape and storage, then owns guest OS patching and application stack on IaaS.",
      interviewNote:
        "On PaaS, more of the bottom moves to the provider—be ready to redraw the line per service.",
    },
    {
      type: "true-false",
      id: "cp01-tf-single-region",
      statement:
        "For maximum availability, a production system should always run in exactly one availability zone to avoid cross-AZ network cost.",
      correct: false,
      explanation:
        "A single AZ is a fault domain; provider outages or maintenance can take it offline. Production patterns typically span multiple AZs in a region (and sometimes multiple regions for disaster recovery), accepting small extra complexity and cost for resilience.",
      interviewNote:
        "Mention trade-offs: multi-region DR vs RPO/RTO requirements and data replication costs.",
    },
    {
      type: "scenario",
      id: "cp01-sc-accenture",
      scenario:
        "An Accenture client asks why they should use **hybrid cloud** instead of moving everything to Azure public cloud in one year.",
      question:
        "Give a concise answer naming at least two realistic drivers and one migration pattern.",
      sampleAnswer:
        "Drivers can include regulatory data residency, legacy mainframes or apps that cannot be lifted easily, and operational risk of a big-bang cutover. A pattern is to keep sensitive data on-prem or in a private environment while migrating new digital workloads to Azure, connected with hybrid identity and networking, then retire systems incrementally.",
      keyPoints: [
        "Compliance and legacy constraints justify hybrid.",
        "Phased migration reduces risk versus big bang.",
        "Hybrid identity/network ties environments together.",
      ],
      interviewNote:
        "Tie to Azure Stack HCI / Arc only if you can explain them simply; otherwise stay conceptual.",
    },
    {
      type: "code-completion",
      id: "cp01-cc-azure-cli",
      question:
        "Complete the Azure CLI **parameter name** (after `--`) that sets the **region** when creating a resource group.",
      codeTemplate: `az group create --name rg-ai-lab --________ westeurope`,
      language: "bash",
      correctAnswer: "location",
      explanation:
        "`--location` (or `-l`) specifies the Azure region for the resource group. `--name` already sets the group name; the blank asks for the location parameter name.",
      interviewNote:
        "If the interviewer probes, mention `az configure` defaults and that region choice affects latency and SKUs available.",
    },
  ],
};
