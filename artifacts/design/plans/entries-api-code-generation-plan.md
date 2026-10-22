# Code Generation Plan: entries-api

## Unit Context

- Responsibility: GET/POST `/api/entries`, .NET-compatible validation, newest-first ordering, server ID/time generation, DynamoDB persistence, Lambda adapters, and a local FastAPI adapter.
- Dependency: no application-unit dependency; react-client consumes this actual implementation and contract afterward.
- Approved interfaces: API Gateway HTTP API payload v2; get and create handlers; shared application/validation/repository functions; DynamoDB table with `collectionId`/`entryKey`; local DynamoDB Local on Docker.
- Data entity: `id`, `name`, `email`, `message`, `createdAtUtc`; start empty, no import, no update/delete, public synthetic demo only.
- Stories: separate user stories were explicitly skipped. The map below uses the exact approved requirement labels from `unit-of-work-story-map.md` and acceptance criteria from `specs.md`; no stories are invented.
- Figma: no Figma design links exist; use the approved functional UI design in the React unit.

## Code Location and Preservation

- Project is brownfield; all new backend code, tests, and config go to `code/rearchitected/backend/` (or `code/rearchitected/docker-compose.yml` for shared local infrastructure).
- Existing `UserInputApi/`, `frontend/`, and `data/` remain untouched. Do not copy original source into generated output.
- Terraform and GitHub Actions are Release-only; no deployment definitions in this unit.

## Numbered Generation Steps

1. [x] Create backend Python project manifest with runtime/dev dependencies and packaging metadata.
2. [x] Generate domain types and typed validation/error model.
3. [x] Implement validation code and synthetic boundary tests. Exact .NET runtime-equivalence comparison remains unverified; do not claim exact compatibility until checked.
4. [x] Implement application create/list operations, generated UUID/UTC time, ordering, and response budget handling.
5. [x] Implement boto3 DynamoDB repository with conditional writes, consistent partition query, complete pagination, and explicit local endpoint configuration.
6. [x] Implement shared HTTP response/error mapping and both Lambda payload-v2 handlers.
7. [x] Implement local FastAPI adapter using the same application and HTTP mapping functions.
8. [x] Add local DynamoDB initialization script, pinned Docker Compose image with persistent named volume, and non-secret `.env.example`.
9. [x] Add focused unit tests for validation, application behavior, HTTP errors, handlers, and repository request construction; execution was skipped at the terminal prompt.
10. [x] Add isolated DynamoDB Local integration test for empty collection, write/read, and persistence after a new repository instance; execution not performed.
11. [x] Generate backend local-development/API docs under `artifacts/build/entries-api/docs/`.
12. [x] Confirm all 20 mapped code/config/test paths exist and dependencies are declared. Runtime tests and editor FastAPI import resolution remain unverified.

## File to User Story Map

Formal stories were skipped by user choice. Exact approved traceability labels are used instead: `FR2: Python Lambda/API Gateway and compatible API`; `FR3: Validation, limits, trimming`; `FR4: Empty durable shared store; no import`; `AC2: Invalid input fails without writing; compatible shapes`; `AC3: Durable persistence and empty collection`; `AC4: Actual builds, tests, and browser/API integration`.

| Exact planned code path                                               | Approved requirement/acceptance labels |
| --------------------------------------------------------------------- | -------------------------------------- |
| `code/rearchitected/backend/pyproject.toml`                           | FR2; FR3; FR4; AC4                     |
| `code/rearchitected/backend/uv.lock`                                  | FR2; FR3; FR4; AC4                     |
| `code/rearchitected/backend/src/entries_api/__init__.py`              | FR2; AC4                               |
| `code/rearchitected/backend/src/entries_api/domain.py`                | FR2; FR3; FR4; AC2; AC3                |
| `code/rearchitected/backend/src/entries_api/validation.py`            | FR3; AC2                               |
| `code/rearchitected/backend/src/entries_api/application.py`           | FR2; FR3; FR4; AC2; AC3                |
| `code/rearchitected/backend/src/entries_api/repository.py`            | FR4; AC3                               |
| `code/rearchitected/backend/src/entries_api/http.py`                  | FR2; FR3; AC2; AC4                     |
| `code/rearchitected/backend/src/entries_api/lambda_handlers.py`       | FR2; FR4; AC1; AC2; AC3                |
| `code/rearchitected/backend/src/entries_api/local_api.py`             | FR2; FR3; FR4; AC1; AC2; AC3; AC4      |
| `code/rearchitected/backend/src/entries_api/scripts/init_local_db.py` | FR4; AC3                               |
| `code/rearchitected/backend/.env.example`                             | FR2; FR4; AC4                          |
| `code/rearchitected/backend/tests/conftest.py`                        | FR3; FR4; AC2; AC3; AC4                |
| `code/rearchitected/backend/tests/unit/test_validation.py`            | FR3; AC2                               |
| `code/rearchitected/backend/tests/unit/test_application.py`           | FR2; FR3; FR4; AC2; AC3                |
| `code/rearchitected/backend/tests/unit/test_http.py`                  | FR2; FR3; AC2                          |
| `code/rearchitected/backend/tests/unit/test_lambda_handlers.py`       | FR2; AC2; AC4                          |
| `code/rearchitected/backend/tests/unit/test_repository.py`            | FR4; AC3                               |
| `code/rearchitected/backend/tests/integration/test_dynamodb_local.py` | FR4; AC3; AC4                          |
| `code/rearchitected/docker-compose.yml`                               | FR4; AC3; AC4                          |

**Map completeness check:** 20 distinct mapped code/config/test paths; generation steps explicitly cover all 20. `uv.lock` is generated before code is written and must remain mapped. Documentation under artifacts is excluded from the code-file count. No other code path may be added without updating this map and re-approving the plan.

## Approval

- [x] User approved: A) Approved - generate entries API.

## Approval Gate

No code is written until this complete plan and its file map are approved. Integration and runtime checks follow after the React unit is generated; no AWS resources are created.

## Generation Status

- Code/config/test files: generated in the approved `code/rearchitected/` paths.
- Runtime test commands: skipped by user prompt; no tests are claimed as passing.
- Python 3.13 dependency resolution: succeeded and `uv.lock` was generated.
- Editor diagnostics: FastAPI import remains unresolved in the selected environment; FastAPI is declared in `pyproject.toml` and locked.
