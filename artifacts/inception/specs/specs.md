# Requirements: AWS Serverless Migration

## Intent and Scope

Migrate WW-AI-Demo on main from a React/.NET/local-JSON application to React with Python AWS Lambda APIs behind API Gateway. Brownfield, multi-component migration with concise Simple-level artifacts; the original under-20-minute process target does not override approval or verification gates. Requirements are awaiting user approval.

## Functional Requirements

- FR1: Retain the current React UI and submission, list, and refresh workflows; update local-storage wording where needed without a visual redesign.
- FR2: Replace the .NET API in the migrated runtime with Python Lambda functions behind API Gateway. Preserve GET/POST /api/entries, lower-camel-case entry fields, UTC timestamps, IDs, 201 creation response, and client-readable validation errors.
- FR3: Preserve required name/email/message validation and length limits (100/200/2000), email validation, and trimming. Document deliberate compatibility differences before implementation.
- FR4: Use a durable shared AWS store; start empty, with no import of existing JSON entries. DynamoDB is the proposed store, subject to design approval.
- FR5: Operate as a public demo without login or per-user ownership. All entries are publicly accessible; use synthetic data only. Cognito and authentication are out of scope.
- FR6: Host React on AWS without a long-running application server. Private S3 with CloudFront is proposed, subject to design approval.

## Non-Functional Requirements

- Keep AWS permissions resource-scoped, do not store credentials in code, use HTTPS for cloud traffic, and exclude contact/message content from logs.
- Preserve loading, saving, refresh, validation, error, and success feedback. Durable storage must work across independent Lambda invocations.
- Provide ordinary automated validation/contract tests, persistence integration checks, frontend build verification, and real browser/API read-write exercises. Report unverified cloud behavior honestly.
- Scale, availability, latency, RTO/RPO, and budget guarantees are not specified; do not claim production readiness.
- Optional resiliency, SECURITY, and property-based-testing baselines are disabled by user choice. This does not waive basic secure coding or conventional testing.

## Deployment and Operations

- Deliver runnable local code, dependency/configuration files, tests, Terraform definitions, deployment instructions, and an eventual AWS deployment.
- AWS region: us-west-2. Environment name and authenticated AWS account/profile must be confirmed before creating resources; never request credentials through chat.
- Confirm the deployment plan, billable resources, public access, and target with the user before any cloud mutation. Deployment depends on locally available authorized AWS access and required tooling.
- Leave existing source and data intact until the generated replacement is approved; no commit, push, branch switch, or destructive cleanup is authorized.

## Acceptance Criteria

1. The migrated React UI can save a valid synthetic entry and retrieve it after refresh through the Python API.
2. Invalid requests return useful validation failures without writing entries; field names and response shapes match the existing client contract.
3. Entries survive independent invocations and process restarts in the chosen durable store; empty storage returns an empty collection.
4. Builds and selected tests run with recorded results; browser/API integration is actually exercised, not inferred from mocks.
5. Infrastructure and deployment instructions are validated. After a separate approval and prerequisite checks, deploy in us-west-2 and verify the hosted submission/read workflow; otherwise clearly record the deployment blocker rather than claim completion.
