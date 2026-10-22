# Application Architecture Plan

## Context

Requirement version 1; two approved units: entries-api and react-client. Existing scope is a public synthetic-data demo in us-west-2, starting with an empty durable store. Keep the React appearance and GET/POST /api/entries contract. No application code, deployment definitions, or AWS resources are created in Design.

## Local Design Hypothesis and Check

CloudFront can serve the existing client and forward unchanged /api/entries requests to API Gateway; Python functions can implement the existing contract without a frontend rewrite. The discriminating design check is a route/response matrix connecting each client call to the CloudFront behavior, API Gateway route, Lambda entry point, and response shape. Runtime verification belongs to Build/Verify and cloud routing verification to Release.

## Question 1: AWS Service Layout

Which serverless component layout should be designed?

A) API Gateway HTTP API, Python Lambda, DynamoDB, and private S3 frontend hosting through CloudFront. Forward /api/\* through CloudFront to preserve same-origin frontend calls.

B) Request a different service layout; describe the API Gateway type, durable store, or hosting constraints.

X) Other (describe constraints).

[Answer]: A) HTTP API, Lambda, DynamoDB, S3 + CloudFront.

## Question 2: Lambda Boundaries

How should the two API operations be deployed?

A) Two small Python Lambda functions, one for GET and one for POST, sharing a validation/storage package; separate least-privilege roles.

B) One Python Lambda function that routes GET/POST internally, with a combined role.

X) Other (describe boundaries).

[Answer]: A) Two Lambda functions.

## Question 3: Local Runtime and Verification

Which local API/storage approach should be designed?

A) Thin FastAPI development adapter that calls the same Python application functions; DynamoDB Local via Docker for real persistent read/write integration. No JSON or in-memory replacement for durable integration checks.

B) Local Python API using an explicitly approved AWS development DynamoDB table; requires AWS credentials locally and a separate resource-creation approval before use.

X) Other (describe local tooling restrictions).

[Answer]: A) FastAPI adapter + DynamoDB Local via Docker.

## Execution Checklist

- [x] Review approved scope, API contract, unit boundaries, and execution plan.
- [x] Identify component, interface, orchestration, coupling, and local-runtime choices.
- [x] Receive answers and resolve ambiguity.
- [x] Obtain approval of the architecture approach before generation: A) Approved - generate architecture.
- [x] Generate components.md.
- [x] Generate component-methods.md.
- [x] Generate services.md.
- [x] Generate component-dependency.md.
- [x] Generate app-architecture.md consolidating decisions and alternatives.
- [x] Check route/response matrix, dependency direction, requirement coverage, and basic safeguards.
- [x] Obtain explicit approval of generated architecture before per-unit design: user replied "Approved".

## Remaining Design Sequence

Application architecture, then entries-api functional/infrastructure design, then react-client functional/infrastructure design. Separate NFR documents and Figma were explicitly skipped. Functional design will resolve collection order, validation edge cases, and failure behavior without inventing new features.
