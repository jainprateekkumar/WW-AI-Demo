# Application Architecture

## Decision

Retain the React entry desk; deploy GET and POST as separate Python 3.13 Lambda functions behind API Gateway HTTP API. Use DynamoDB for empty, durable shared storage. Host the static React build in private S3 behind CloudFront. Serve /api/\* through the same distribution so existing relative request paths remain valid.

## Components and Interfaces

The read and create Lambda adapters call shared validation/application functions and a small DynamoDB repository protocol. Each function packages the shared Python modules. The public model remains id/name/email/message/createdAtUtc; GET returns an array, POST returns 201 with Location, and validation uses client-readable errors/title details. No new authentication, operations, or business services are introduced.

## Storage and Consistency

Use one table with collectionId and entryKey string keys, fixed ENTRIES partition, and sortable timestamp/UUID entry keys. Query the base table with consistent reads and paginate internally; use conditional writes to avoid overwriting a generated key. Ordering and failure/body-size limits are finalized in Functional Design. A single partition and full-list response are deliberate demo trade-offs, not a general scalable collection API.

## Hosting and Routing

- CloudFront default origin: private S3 REST endpoint with Origin Access Control and public access blocked.
- /api/\* behavior: API Gateway regional HTTPS origin, default stage, no origin path, API caching disabled, POST supported, viewer Host not forwarded.
- Preserve API errors as JSON; no distribution-wide SPA error rewrite. Existing UI uses only the root page, so no client-route rewrite is required.
- Default CloudFront hostname/certificate; no custom domain or separate certificate is required by scope.

## Local Execution

Vite localhost:5173 proxies /api to FastAPI/uvicorn localhost:5000. The local adapter invokes the same application functions against DynamoDB Local in Docker using a persistent named volume. Reject accidental cloud use when local endpoint configuration is missing; an explicit AWS mode uses the normal AWS credential chain, never committed credentials.

## Safeguards and Constraints

Separate Lambda roles allow table Query or PutItem respectively plus scoped log writes. No VPC/NAT, queues, extra database, or frontend secrets are needed. API is intentionally public and accepts synthetic data only; a CDN and disabled CORS are not authorization or abuse protection. Use TLS, no-store API responses, bounded runtime/request handling, and safe metadata-only logs. Do not claim production readiness or cost guarantees.

## Alternatives Considered

- One Lambda: simpler deployment, but rejected by user in favor of separate operation roles and functions.
- Different storage/hosting or REST API: not selected; HTTP API/DynamoDB/S3/CloudFront meet the small synchronous workflow.
- AWS development table locally: not selected; Docker-based DynamoDB Local avoids cloud mutation during local integration checks.
- JSON persistence: unsuitable for shared durable Lambda writes.

## Traceability and Next Steps

FR1 retained React; FR2 operation routes and Lambda boundary; FR3 shared validation; FR4 DynamoDB; FR5 public demo/no auth; FR6 static AWS hosting. Next approve architecture, then functional/infrastructure design for entries-api followed by react-client. Terraform is created in Release; no code or infrastructure is implemented by these documents.
