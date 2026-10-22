# Requirements Clarification Questions

Preserve the React application's entry submission/list/refresh workflows and the GET/POST /api/entries contract unless you request otherwise. Proposed supporting AWS services are private S3 with CloudFront for the frontend and DynamoDB for durable entries; these are proposals pending your answers and design approval.

## Question 1: Existing Data

How should existing JSON entries be handled?

A) Preserve existing entries with an explicit import step; keep current workflows and UI.

B) Start with an empty AWS database; keep current workflows and UI.

X) Other (describe changes or a different migration policy).

[Answer]: B) Start empty.

## Question 2: Access Model

Who should be able to submit and view entries, including names and email addresses?

A) Public demo with no login; use synthetic data only and document that entries are public.

B) Authenticated users only through Amazon Cognito; users see only their own entries.

X) Other (describe audience and access rules).

[Answer]: A) Public demo.

## Question 3: Delivery and Deployment

What should this migration deliver?

A) Runnable local application, tests, Terraform definitions, and deployment instructions; do not deploy AWS resources.

B) The same deliverables plus deployment to my AWS account after explicit approval; provide the region and environment name, never credentials.

X) Other (describe deployment, infrastructure tooling, or hosting constraints).

[Answer]: B) Include AWS deployment. Region supplied in follow-up: us-west-2. Environment name remains a configurable deployment parameter to confirm before resource creation.

## Question 4: Resiliency Extensions

Should the resiliency baseline be applied to this project?

**What this extension is.** Enabling it applies a set of **directional, design-time best practices** for building resilient systems, derived from the **AWS Well-Architected Framework (Reliability Pillar)** and resilience-review guidance. It steers requirements, design, and code toward fault tolerance, high availability, observability, and recoverability — covering 15 practice areas across business goals, change management, observability, high availability, disaster recovery, and continuous improvement.

**What this extension is NOT.** Enabling it does **not** make your workload production-ready, nor does it certify or guarantee any availability, RTO, or RPO target. It is a **starting point** that scaffolds good resiliency decisions early — it is not a substitute for a formal **AWS Well-Architected Review** of the built system.

Treat the output as a well-grounded **first draft of your resiliency posture** to build on and validate — not a finished, production-certified result.

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance (recommended for business-critical workloads, as an informed starting point that you can validate and harden before go-live)

B) No — skip the resiliency baseline (suitable for PoCs, prototypes, and experimental projects where rapid iteration matters more than reliability)

X) Other (please describe after [Answer]: tag below)

[Answer]: B) No - skip resiliency baseline.

## Question 5: Security Extensions

Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: B) No - skip SECURITY extension rules.

## Question 6: Property-Based Testing Extension

Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)

X) Other (please describe after [Answer]: tag below)

[Answer]: C) No - skip PBT extension rules.

## Question 7: AWS Target Follow-Up

Which AWS region and environment name should the deployment use?

A) ap-south-1 / demo.

B) us-east-1 / demo.

C) Decide before deployment; keep both configurable.

X) Other (provide region and environment name; never credentials).

[Answer]: X) us-west-2

Interpretation: Region confirmed as us-west-2. The environment name is not yet supplied and will be confirmed as a deployment parameter before resource creation, not silently assumed.
