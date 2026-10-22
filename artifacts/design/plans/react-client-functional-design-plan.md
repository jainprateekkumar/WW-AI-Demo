# React Client Functional Design Plan

## Context and Evidence

Version 1, react-client unit. Keep the existing visual design and workflows. Current App.jsx calls relative GET/POST `/api/entries`, prepends successful POST results, parses `errors` or `title`, and shows loading/save/refresh/success/error states. Vite proxies `/api` to localhost:5000. The approved API sorts newest first, and the app is an unauthenticated public demo restricted to synthetic data.

## Hypothesis and Discriminating Check

The UI can preserve its existing layout by retaining same-origin API paths, existing fetch/state behavior, and updating the inaccurate local-storage note plus a public-data disclosure. Check actual form, empty/list/loading/failure states and submit/refresh ordering in a real browser during Verify.

## Question 1: Public Data Notice

Where should the interface disclose that entries are public and synthetic data only?

A) Add a clear notice directly above the entry form: "Public demo. Entries are visible to anyone; use synthetic data only." Keep the existing page structure otherwise.

B) Replace the current "Saved to your local records" line with that notice; avoid another notice near the form.

X) Other (describe wording or placement).

[Answer]:

## Recorded Answer and Approval

- Public Data Notice: A) Add a clear notice directly above the entry form: "Public demo. Entries are visible to anyone; use synthetic data only."
- React Design Approval: A) Approved - generate React functional design.

## Proposed Behavior

- Keep root route and existing visual treatment; no redesign, authentication, or new entry operations.
- Use same-origin `/api/entries`; Vite proxy locally and CloudFront API behavior in AWS. No hardcoded cloud URL or browser credential.
- Native required/type/length controls remain convenience only; server remains authoritative.
- API and successful POST ordering are newest first. Preserve count and refresh behavior.
- On failure, retain form content, never automatically retry POST, announce error via existing role=alert, and do not claim save success. An ambiguous timeout may follow a durable write.
- Replace inaccurate local-storage wording with the approved public/synthetic notice.

## Execution Checklist

- [x] Read current React component and Vite proxy.
- [x] Align routes, ordering, and errors with approved API designs.
- [x] Resolve public-data notice choice and approve the approach.
- [x] Generate frontend-components.md for react-client.
- [x] Check every call path against the API contract and UI states against existing behavior.
- [ ] Obtain artifact approval before react-client Infrastructure Design.

No code or style changes are made in Design. Browser rendering and interaction evidence is collected during Verify.
