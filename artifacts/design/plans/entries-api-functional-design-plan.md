# Entries API Functional Design Plan

## Context and Evidence

Version 1, entries-api unit. Application architecture explicitly approved by the user's message "Approved". The current Program.cs validates Required/StringLength/EmailAddress before trimming and exposes only GET/POST /api/entries. Current GET preserves file order while the client prepends new entries.

## Hypothesis and Discriminating Check

Shared validation/application functions can preserve the current field/response contract across Lambda and the local adapter. A focused acceptance matrix must cover whitespace, wrong types, missing fields, exact length boundaries, email edge cases, and response shapes. Build must compare representative Python validation outcomes with actual .NET behavior; do not claim parity from a similar-looking validator.

## Question 1: Collection Order

What order should GET /api/entries return?

A) Newest first by server UTC creation time, with ID as a stable tie-breaker; matches the current immediate post-save UI order. This deliberately changes the old GET insertion order.

B) Oldest first by server UTC creation time, with ID as a stable tie-breaker; closest to existing GET behavior. The frontend will use the same order after saving and refreshing.

X) Other (describe ordering).

[Answer]:

## Question 2: Validation Compatibility

Which validation policy should govern the Python migration?

A) Preserve existing .NET required/length/email rules, validation-before-trimming, and case-insensitive request field matching. Verify boundary behavior against .NET; no email deliverability/DNS checks.

B) Request different validation rules; describe the intended changes for compatibility and scope review before generation.

X) Other (describe validation constraints).

[Answer]:

## Recorded Answers

- Collection Order: A) Newest first by UTC creation time descending, ID descending as a stable tie-breaker.
- Validation Policy: A) Preserve .NET required/length/email rules, validation-before-trimming, and case-insensitive request field matching; verify against .NET.
- Functional Approach Approval: A) Approved - generate API functional design.

## Proposed Failure and Integrity Rules

- Valid POST returns 201 plus the entry and existing Location header; GET returns 200 and an array, including [].
- Invalid JSON/input returns a client-readable 400 problem; unsupported media type returns 415; storage failures return sanitized 503; unexpected failures return generic 500. Application responses have JSON content type and no-store.
- Validate raw string limits before trimming. Generate UUID and UTC timestamp server-side; ignore unrelated unknown fields without accepting client-generated identity/time.
- No automatic frontend POST retries or exactly-once promise. Preserve form input after failure; an interrupted response may follow a successful write.
- Preserve complete-array GET rather than silently truncate or add client pagination. Follow internal store pages; fail with a controlled 503 if the serialized response or read deadline exceeds safe limits. Set concrete limits during infrastructure design below platform ceilings.
- Do not log submitted names, email addresses, messages, raw request bodies, or AWS exception text in client responses.

## Execution Checklist

- [x] Inspect approved architecture and owning API code.
- [x] Identify collection-order and validation decisions.
- [x] Collect answers and approve functional-design approach.
- [x] Generate business-logic-model.md.
- [x] Generate business-rules.md.
- [x] Generate domain-entities.md.
- [x] Check functional coverage, validation cases, failure behavior, and public response contract.
- [x] Obtain artifact approval before entries-api infrastructure design: A) Approved - continue to infrastructure design.

No application code or infrastructure definitions are created in this stage. Separate NFR stages remain explicitly skipped; ordinary correctness and secure coding remain required.
