# react-client Infrastructure Design

## Static Hosting

- Publish the Vite production build to a private S3 bucket in the approved demo stack.
- Enable S3 Block Public Access, default SSE-S3 encryption, and CloudFront Origin Access Control; bucket policy permits only the distribution's read access.
- CloudFront default behavior serves the site over HTTPS using the provided hostname/certificate. No custom domain, DNS, or frontend runtime secrets.
- API `/api/*` behavior is the shared API infrastructure, not a separate client origin. Keep same-origin fetch calls and disable API caching.

## Cache and Upload

- Content-hashed JS/CSS assets: long-lived immutable cache metadata.
- `index.html`: no-cache/revalidate metadata; CloudFront default root object is `index.html`.
- API paths never use static fallback or SPA error rewriting.
- GitHub Actions workflow runs only by `workflow_dispatch`, builds the frontend, and publishes using GitHub OIDC into a protected GitHub environment named for the demo. Environment reviewer approval is required before AWS credentials are issued to the deploy job.
- Publishing role is scoped to this repository/environment and only the target bucket prefix plus this distribution's invalidation. No Terraform/resource-creation, DynamoDB, Lambda, IAM, or broad CloudFront administration permissions.
- Upload step must not use `aws s3 sync --delete`; removal of existing objects is not authorized. Old hashed files may accumulate until a separately approved cleanup policy is established.

## CI/CD Trust and Permissions

- GitHub OIDC provider: `token.actions.githubusercontent.com`; trust exact repository `jainprateekkumar/WW-AI-Demo` and protected GitHub Environment claim (proposed name `demo`). No long-lived AWS access keys in GitHub secrets.
- Restrict workflow permissions to `contents: read` and `id-token: write`; pin third-party actions to reviewed immutable commit SHAs in Release.
- AWS role actions: bucket-scoped `s3:ListBucket` (only if required by publisher), `s3:PutObject` on target prefix, and `cloudfront:CreateInvalidation` on the one distribution. No `s3:DeleteObject`.
- GitHub environment protection must have a configured reviewer and deployment branch policy before the workflow can publish; otherwise deployment is blocked.

## Local Development

Use Vite at localhost:5173 and FastAPI at localhost:5000; do not invoke GitHub Actions or cloud services for local development. The production build reads no AWS credentials and uses relative `/api/entries`.

## Remaining Release Inputs

Confirm GitHub repository/environment settings, reviewer(s), environment label (`demo` proposed), AWS account/profile, distribution/bucket outputs, immutable action pins, branch rules, and expected costs. Provisioning remains a separate approved operation. No workflow or AWS resources are created in Design.
