# Units of Work

## entries-api

- Purpose: Replace the current .NET runtime with Python Lambda functions exposed through API Gateway.
- Owns: GET/POST /api/entries, request validation, trimming, ID/timestamp generation, client-compatible responses, shared durable persistence, local API execution, and backend tests.
- Excludes: Authentication, user ownership, existing-data import, update/delete features, and frontend rendering.
- Contract: JSON entry fields id, name, email, message, createdAtUtc; GET array; POST 201 and validation failures readable by the existing client.
- Verification: Builds/import checks, valid/invalid input tests, durable read/write integration, and real API exercises.

## react-client

- Purpose: Keep the current entry-desk experience while integrating the Python API locally and on AWS.
- Owns: Form/list/refresh workflows, request configuration, accurate cloud-storage wording, loading/error/success states, frontend build, and responsive browser verification.
- Excludes: Visual redesign, Figma work, authentication, storage implementation, and new entry operations.
- Contract: Consume the approved entries API; do not guess route prefixes or field names.
- Verification: Actual UI submission and refresh, invalid-input feedback, empty/error states, desktop/mobile layout, and successful production build.

## Delivery Responsibilities

The two units are coordinated within this repository. Infrastructure design defines AWS resources and permissions; Release creates Terraform, deployment instructions, and any explicitly authorized AWS deployment. No separate infrastructure application unit is needed.

## Preservation and Sequencing

Keep original source and entry data untouched. Generated code is written under code/ only after Design approval. Build entries-api before react-client; test the complete integration before Release. Region is us-west-2; environment and authenticated account require deployment-time confirmation.

## Pending Design Decisions

Storage access pattern and ordering, Python runtime, Lambda organization, local execution approach, and precise CloudFront/API routing remain design decisions, not assumptions approved by this planning document.
