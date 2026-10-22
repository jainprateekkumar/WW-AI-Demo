# entries-api Infrastructure Design

## Compute and API

- Regional API Gateway HTTP API in us-west-2, `$default` stage, payload format 2.0.
- Exact routes: GET /api/entries -> get Lambda; POST /api/entries -> create Lambda. No stage prefix, custom domain, authentication, or Lambda Function URL.
- Separate Python 3.13 x86_64 Lambda packages and execution roles. Proposed initial sizing: 256 MiB and 5-second timeout each; validate against measured behavior.
- get role: DynamoDB Query on the one table and scoped CloudWatch log writes. create role: DynamoDB PutItem on that table and scoped log writes. No Scan, wildcard table access, VPC, NAT, or static credentials.
- Table name is an environment variable; AWS SDK uses the execution role.

## Durable Store

- One DynamoDB table, PAY_PER_REQUEST, string partition key `collectionId`, string sort key `entryKey`, environment-prefixed name.
- Fixed `ENTRIES` partition; fixed-width UTC timestamp plus UUID sort key supports newest-first reads and unique conditional writes.
- DynamoDB-managed encryption. No customer-managed key, TTL, public delete API, or import. Table starts empty; entries remain until manually removed.
- Point-in-time recovery is not enabled by default; no disaster-recovery guarantee is made.

## Public Traffic and Bounds

- Public unauthenticated API; user declined WAF. Configure API Gateway route/stage throttles as Terraform inputs. Proposed defaults: 2 requests/second and burst 5 per route; user must review/confirm before deployment. These are guardrails, not a bill cap.
- Application rejects request bodies over 16 KiB before JSON decoding with sanitized 413; approved form fields require much less.
- Lambda runtime and the approved 4 MiB encoded GET response budget bound synchronous response work; oversize collections fail rather than truncate.
- Proposed Lambda log retention: 14 days. Capture request ID, operation/status, duration, and sanitized category only; never bodies or contact/message values. No Gateway body logging.

## Static Hosting and Routing

- CloudFront distribution; private S3 REST origin secured by Origin Access Control; S3 public access blocked and default SSE-S3 encryption.
- `/api/*` behavior targets the regional API Gateway origin over HTTPS, no origin path, supports GET/HEAD/OPTIONS/POST, disables caching, and does not forward the viewer Host header. Forward content type and required request data; no browser cross-origin call is needed.
- Default behavior serves React files from S3. Hashed assets may have long immutable caching; `index.html` must revalidate. Do not rewrite API 4xx/5xx to the frontend document.
- Use CloudFront hostname/certificate. No custom domain, DNS, certificate, or CORS configuration is in scope.

## Local Development

- DynamoDB Local in Docker with a persistent named volume and explicit initialization.
- FastAPI adapter on localhost:5000 and Vite on localhost:5173; local repository endpoint is explicit. Refuse silent AWS fallback in local mode.
- Docker availability and package compatibility remain to be checked during Build; integration checks use actual DynamoDB Local, not in-memory persistence.

## Cost, Operations, and Authorization

Cost drivers include API Gateway requests, Lambda duration, DynamoDB requests/storage, S3 storage/requests, and CloudFront requests/data transfer. No live estimate or AWS Budget resource is included; actual cost depends on traffic, region, and transfer. Throttling does not establish a maximum bill.

Terraform inputs should include region (us-west-2), environment label (proposed `demo`), throttle rate/burst, request limit, and log retention. Before provisioning, the user must approve the concrete resource plan/cost assumptions and verify local AWS account/profile and environment name. Never request credentials in chat. This design creates no resources.
