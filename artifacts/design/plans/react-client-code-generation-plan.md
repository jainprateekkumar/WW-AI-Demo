# Code Generation Plan: react-client

## Unit Context

- Responsibility: Preserve the existing Fieldnotes UI and form/list/refresh workflows while aligning with the approved Python API.
- Dependency: entries-api source and contract have now been generated; read its actual handlers/HTTP mapping before making frontend calls.
- API calls: relative GET/POST `/api/entries`; GET is newest first; POST 201 returns lower-camel-case Entry; errors use `errors` or `title`.
- UI decisions: show "Public demo. Entries are visible to anyone; use synthetic data only." above form; replace local-record copy; distinguish initial collection-load error from empty state; keep stale collection and form values after failures; no POST retry.
- Stories: formal stories were explicitly skipped. Map files to exact approved FR1/FR5 and AC1/AC4 labels.
- Figma: no design-link file exists. Keep the original CSS and layout with narrow, intentional state/disclosure changes.

## Code Location and Preservation

- Brownfield generated files live only under `code/rearchitected/frontend/`; original `frontend/`, `UserInputApi/`, and `data/` remain untouched.
- Create a deployable copy of only the frontend files required by Vite; do not duplicate the .NET service.
- No Terraform, GitHub workflow, AWS resources, or deployment scripts in this unit.

## Numbered Generation Steps

1. Create frontend `package.json` using the existing React/Vite versions, remove the invalid self-referencing `file:` package, add Vitest/jsdom/Testing Library, and define build/test scripts.
2. Generate package-lock.json from that manifest.
3. Copy the required React entry point and HTML metadata into the rearchitected frontend.
4. Update Vite config to support relative API proxying and Vitest while preserving local API port 5000.
5. Update App.jsx with the approved notice, explicit collection error/retry state, newest-first contract, preserved input on failure, and stable `data-testid` attributes.
6. Make the smallest stylesheet update needed for the notice and error/retry states; retain original design system/layout.
7. Add focused component tests for public notice, empty collection, initial-load error/retry, successful submission, and submission failure retaining values.
8. Add build/test instructions and component summary under `artifacts/build/react-client/docs/`.
9. Confirm exact API call paths against the entries-api implementation, verify all mapped files exist, and record unresolved runtime/browser checks for Build and Test/Verify.

## File to User Story Map

Formal stories were skipped by user choice. Exact approved traceability labels: `FR1: Existing React workflows and UI`; `FR5: Public synthetic-data demo`; `AC1: Save and retrieve synthetic entry after refresh`; `AC4: Actual builds, tests, and browser/API integration`.

| Exact planned code path                         | Approved requirement/acceptance labels |
| ----------------------------------------------- | -------------------------------------- |
| `code/rearchitected/frontend/package.json`      | FR1; FR5; AC4                          |
| `code/rearchitected/frontend/package-lock.json` | FR1; AC4                               |
| `code/rearchitected/frontend/index.html`        | FR1; FR5                               |
| `code/rearchitected/frontend/vite.config.js`    | FR1; AC1; AC4                          |
| `code/rearchitected/frontend/src/main.jsx`      | FR1; AC4                               |
| `code/rearchitected/frontend/src/App.jsx`       | FR1; FR5; AC1; AC4                     |
| `code/rearchitected/frontend/src/styles.css`    | FR1; FR5                               |
| `code/rearchitected/frontend/src/setupTests.js` | FR1; AC4                               |
| `code/rearchitected/frontend/src/App.test.jsx`  | FR1; FR5; AC1; AC4                     |

**Map completeness check:** 9 distinct frontend source/config/test paths. Every path is included in the numbered plan. API contract files are owned by entries-api and are not duplicated here.

## Approval

- [x] User explicitly requested: "please complete the front end part also"; treated as approval to execute this complete mapped plan.

## Approval Gate

Do not write frontend code until the complete plan and File to User Story Map are explicitly approved.
