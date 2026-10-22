# Entries API Business Logic

## Create Entry

1. Decode a JSON object, accepting request-property casing the same way as the current .NET web defaults.
2. Check that name, email, and message are strings and satisfy the existing Required, length, and email rules before trimming. Keep compatibility in UTF-16 code units for maximum lengths, since .NET String.Length counts UTF-16 units; verify representative cases against the real .NET validator during Build.
3. Trim each accepted field with semantics equivalent to .NET string Trim; reject whitespace-only required fields.
4. Generate a lowercase hyphenated UUID and UTC timestamp on the server. Clients cannot select id, createdAtUtc, collection keys, or timestamps; unknown fields are ignored.
5. Conditionally write the entry. Only report success after the durable write succeeds. Return 201, the public entry, and Location /api/entries/{id}.

## List Entries

1. Query the single ENTRIES partition from the base table using strongly consistent reads.
2. Continue through DynamoDB pages, map items to public fields, and order newest first by UTC timestamp, then ID descending for deterministic ties.
3. Return 200 and a complete JSON array, including [] for an empty table.
4. If the resulting encoded JSON exceeds the 4 MiB response budget, return a sanitized 503 problem rather than truncating the collection or exceeding synchronous Lambda response limits. This is an explicit demo-scale constraint; no pagination contract is added.

## Failure Outcomes

- Invalid/malformed JSON or validation errors: 400; no storage write.
- Unsupported media type: 415.
- DynamoDB/throttling/deadline or response-budget failure: sanitized 503, no implementation or input details.
- Unexpected application error: generic 500 with request ID; safe diagnostics only in logs.
- A timed-out POST may have committed despite the client receiving an error. Do not claim exactly-once behavior or automatically retry POST.

## Shared Execution

Lambda and local FastAPI adapters invoke these same application functions and validation/error mapping. Only transport decoding/encoding and explicit database endpoint configuration differ. Storage must be real DynamoDB/DynamoDB Local in integration tests; in-memory fakes do not prove persistence.
