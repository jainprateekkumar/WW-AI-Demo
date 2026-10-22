# entries-api Infrastructure Design Plan

## Context

The project has two units, so artifacts belong under `artifacts/design/entries-api/infrastructure-design/`. Region is us-west-2. Approved stack: HTTP API, separate Python Lambdas, DynamoDB, and private S3/CloudFront. Functional contract uses a public endpoint, no authentication, synthetic data, newest-first full-array reads, and a 4 MiB response ceiling. Account and environment name remain unconfirmed; no cloud mutation is authorized.

## Proposed Mapping

- API Gateway HTTP API, default stage, GET and POST /api/entries routes.
- get Lambda with scoped Query; create Lambda with scoped PutItem.
- DynamoDB on-demand table keyed by collectionId/entryKey, empty at creation.
- Private S3 and CloudFront distribution with OAC; /api/\* behavior to API Gateway.
- CloudWatch logs/metrics for safe operational metadata. No VPC, NAT, queue, cache, or custom domain by default.

## Question 1: Environment and Isolation

Which environment naming/isolation should infrastructure support?

A) One demo environment, parameterized environment label (example: demo); verify AWS account/profile before deployment.

B) Separate dev and prod environments with isolated tables, functions, and distributions; prod remains out of scope for deployment unless separately approved.

X) Other (describe environment boundaries).

[Answer]: A) One demo environment, configurable label, account/profile verification before deployment.

## Question 2: Public Write Protection

The API is deliberately public and has no login. Which abuse/cost protection should be designed?

A) API Gateway route/stage throttling with conservative configurable rate/burst, payload limits, and documented synthetic-only use; no WAF service. Set initial numbers as Terraform variables and confirm before deployment.

B) Add AWS WAF rate-based rules at CloudFront/API edge; assess its separate recurring cost before approval.

C) No active rate limiting; accept and document higher abuse and spend risk.

X) Other (describe controls).

[Answer]: A) API Gateway throttling, configurable conservative rate/burst and payload limits; no WAF.

## Question 3: Data Retention

How should public synthetic entries be retained?

A) Retain until manually removed; no public delete route, no automatic TTL.

B) Expire entries after 30 days using a DynamoDB TTL attribute; document that TTL deletion is asynchronous.

X) Other (specify retention).

[Answer]: A) Retain until manually removed; no public delete route or TTL.

## Question 4: Cost Visibility

Which cost-control deliverable should be included?

A) Document pay-per-request/storage/CDN cost drivers and require user review before deployment; no account-level budget resource.

B) Include a configurable AWS Budget alert, requiring a monthly threshold and notification destination before deployment. Budgets can incur service charges and require account permissions.

X) Other (describe cost controls).

[Answer]: A) Document cost drivers and require review; no account-level budget resource.

## Execution Checklist

- [x] Map approved architecture to AWS components and IAM boundaries.
- [x] Collect choices for environment, throttling, retention, and cost visibility.
- [x] Approve plan: A) Approved - generate infrastructure design.
- [x] Generate infrastructure-design.md.
- [x] Generate deployment-architecture.md.
- [x] Check route mapping, private origin access, least privilege, public exposure, cost, and rollback.
- [ ] Obtain artifact approval before react-client design.

## Safety Boundary

This is design only. Do not read credentials, create resources, import data, switch accounts, deploy, or delete anything. Actual deployment requires a later explicit approval for the concrete plan, account, environment, and expected cost.

## Explicitly Unresolved Deployment Values

- Environment label: propose `demo`, confirm before deployment.
- AWS account/profile: confirm locally before deployment; do not transmit credentials.
- API throttle rate/burst and request body limit: safe values proposed as configurable Terraform inputs; exact deployment values to confirm.
- Budget estimate: no traffic assumptions or live price estimate supplied; explain service cost drivers and require user review before provisioning.

## Recorded User Answers

- Environment: A) One demo environment.
- Public write protection: A) API Gateway throttling, configurable rate/burst, no WAF.
- Retention: A) Retain until manually removed; no delete route or TTL.
- Cost visibility: A) Document service cost drivers; no account-level budget resource.
