# Services and Orchestration

## Entry Creation

API Gateway invokes create_entry Lambda. Its adapter decodes the HTTP request and calls the shared create_entry application function. Validation precedes persistence; server-generated identity/time are mapped to a DynamoDB item. A confirmed write returns 201 and the public entry. Validation errors do not invoke a write. Failure responses do not echo input or internal exception text.

## Collection Retrieval

API Gateway invokes get_entries Lambda. The application function asks the repository for the complete demo collection. The repository queries the base table using the fixed collection partition, follows internal pages, and returns public entities without database key attributes. Ordering and oversize-response handling require functional approval; there is no new client pagination contract.

## Frontend Integration

React fetches same-origin /api/entries. Locally, Vite forwards /api to the FastAPI adapter. In AWS, CloudFront forwards /api/\* to the HTTP API's regional execute-api origin without adding/removing a stage prefix. The default API stage avoids an extra path component.

## Local/Cloud Behavior Parity

The local FastAPI adapter and Lambda adapters depend on the same application functions, validation, error mapping, and DynamoDB repository. Only HTTP event translation and endpoint configuration differ. DynamoDB Local persists on a Docker named volume; it is not a hosted AWS dependency and requires no real AWS credentials.

## Operational Boundaries

- No workflow engine, queue, event bus, VPC, NAT gateway, or always-on backend is required for two synchronous operations.
- Two Lambda roles separate Query from PutItem; no Scan or wildcard table access is needed.
- CloudWatch captures request IDs, operation/status, and safe diagnostics, never request bodies or stored contact/message fields.
- Do not automatically retry POST from the client or promise exactly-once behavior. An ambiguous failed response may follow a successful write; idempotency is not part of the existing contract.
- Basic safeguards apply despite optional baselines being disabled. Throttles, concurrency, log retention, and rollback settings are specified during Infrastructure Design.

## Verification Obligations

Exercise real valid/invalid creation and collection reads, restart local API/storage to check persistence, build React, and run browser submit/refresh. Later deployment must verify the actual CloudFront-to-Gateway path and independent Lambda persistence. Designs and mocks alone are not runtime evidence.
