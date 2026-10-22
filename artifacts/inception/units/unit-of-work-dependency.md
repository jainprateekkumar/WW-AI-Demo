# Unit Dependencies

## Dependency Matrix

| Consumer               | Provider               | Boundary                                  | Timing                                   |
| ---------------------- | ---------------------- | ----------------------------------------- | ---------------------------------------- |
| entries-api            | Durable AWS storage    | Approved storage adapter contract         | Runtime; implementation chosen in Design |
| react-client           | entries-api            | GET/POST /api/entries JSON/error contract | Runtime; provider implemented first      |
| Deployment definitions | Both application units | Tested frontend build and Lambda package  | Release after Verify approval            |

No application-unit dependency points from entries-api back to react-client. No circular dependency exists in the proposed decomposition. Infrastructure and storage are external/runtime dependencies, not extra application units.

## Sequence and Coordination

1. Approve application architecture, functional behavior, and infrastructure design.
2. Build and exercise entries-api, including durable write/read behavior.
3. Read the actual API implementation before integrating react-client; verify literal paths and payload fields.
4. Build the client and exercise real UI-to-API submission/refresh locally.
5. Verify the integrated application; then prepare infrastructure and deploy only after separate authorization.

## Critical Shared Contracts

- Literal request paths, HTTP methods, response status, JSON naming, and validation-error structure.
- Timestamp parsing and collection order; existing UI/server ordering mismatch must be decided explicitly.
- Local ports/proxy and cloud API origin/path configuration.
- Public demo scope with synthetic data only.

The original application remains available as a rollback/reference baseline. Do not delete resources or data as part of routine rollback without authorization.
