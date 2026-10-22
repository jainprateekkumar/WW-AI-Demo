# Requirement-to-Unit Map

Separate user stories/personas were explicitly skipped. This document maps the approved requirements and acceptance criteria rather than inventing unapproved stories.

| Requirement                                       | Responsible Unit or Workstream              | Evidence Required                                         |
| ------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------- |
| FR1: Existing React workflows and UI              | react-client                                | Real submit/list/refresh and UI checks                    |
| FR2: Python Lambda/API Gateway and compatible API | entries-api; infrastructure design/Release  | Contract tests, real calls, cloud routing verification    |
| FR3: Validation, limits, trimming                 | entries-api; react-client feedback          | Valid/invalid/boundary tests and UI error behavior        |
| FR4: Empty durable shared store; no import        | entries-api; infrastructure design/Release  | Independent-invocation read/write and restart persistence |
| FR5: Public synthetic-data demo                   | Both units; Release                         | No fabricated privacy claims; public access documented    |
| FR6: Serverless React hosting                     | react-client; infrastructure design/Release | Validated static build, hosting/routing verification      |

## Acceptance Criteria Coverage

| Criterion                                                                  | Owners                                  |
| -------------------------------------------------------------------------- | --------------------------------------- |
| AC1: Save and retrieve synthetic entry after refresh                       | Both units                              |
| AC2: Invalid input fails without writing; compatible shapes                | entries-api, with react-client feedback |
| AC3: Durable persistence and empty collection                              | entries-api; Release validation         |
| AC4: Actual builds, tests, and browser/API integration                     | Both units; Verify                      |
| AC5: Validated infrastructure and separately approved us-west-2 deployment | Infrastructure design; Release          |

## Coverage Review

- [x] FR1-FR6 assigned.
- [x] All five acceptance criteria assigned.
- [x] Operational and infrastructure obligations remain assigned outside application units.
- [x] Excluded functionality has not been introduced through decomposition.
- [x] Entries API precedes client integration, with no circular dependency.

No code, infrastructure, runtime checks, or cloud deployment has been completed by these planning artifacts.
