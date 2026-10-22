# react-client Infrastructure Design Plan

## Context

Two-unit migration. API infrastructure is approved: CloudFront serves private S3 content and forwards `/api/*` to API Gateway; same-origin relative requests are preserved. Region us-west-2, one configurable demo environment, default CloudFront hostname, no custom domain, and no login. Retain the React appearance except for the public synthetic-data notice and accurate storage wording.

## Proposed Mapping

- Vite production build as static files in private S3; CloudFront OAC is the only origin reader.
- CloudFront default behavior serves static content; `/api/*` forwards to the already designed uncached API origin.
- Hashed assets use long immutable caching; `index.html` revalidates. Upload and invalidate the document only when necessary.
- Local development remains Vite :5173 -> FastAPI :5000; no cloud credentials or deployed resources are required.
- Terraform owns infrastructure; artifact publishing/deployment steps belong in Release.

## Question 1: Frontend Artifact Publishing

How should the static frontend be published during deployment?

A) Release runbook uses AWS CLI to sync the Vite `dist/` directory, sets cache metadata, then invalidates `/index.html` only; commands are manual and require a separately approved AWS profile/account.

B) Add automated CI/CD publishing with GitHub Actions and AWS OIDC; requires repository/workflow configuration and an additional trust/deployment surface.

X) Other (describe your deployment pipeline/tooling).

[Answer]:

## Recorded Answer and Approval

- Frontend Artifact Publishing: B) GitHub Actions with OIDC, after a manually dispatched workflow and protected environment approval.
- React Infrastructure Approval: A) Approved - generate React infrastructure design.

## Execution Checklist

- [x] Read approved React functional design and API deployment architecture.
- [x] Confirm private origin and same-origin API dependency.
- [x] Choose publishing workflow and approve the approach.
- [x] Generate infrastructure-design.md.
- [x] Generate deployment-architecture.md.
- [x] Verify origins, asset/API behaviors, cache boundaries, and deployment dependency order.
- [ ] Obtain artifact approval before completing Design.

## Safety Boundary

Design only; no build, artifact upload, AWS identity inspection, resource creation, invalidation, or deployment. Release must confirm environment/account and explicit cost/resource approval.
