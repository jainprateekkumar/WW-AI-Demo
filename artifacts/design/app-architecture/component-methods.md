# Component Interfaces

Signatures describe planned Python interfaces, not implemented code. Detailed validation and ordering are resolved in per-unit Functional Design.

| Component             | Interface                                                           | Purpose                                                                             |
| --------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Create Lambda adapter | create_handler(event: dict, context: object) -> dict                | Decode Gateway v2 request, call application function, encode HTTP response          |
| List Lambda adapter   | list_handler(event: dict, context: object) -> dict                  | Call collection function and encode HTTP response                                   |
| Application           | create_entry(payload: object, repository: EntryRepository) -> Entry | Validate raw input, generate identity/time, persist, return public entity           |
| Application           | list_entries(repository: EntryRepository) -> list[Entry]            | Read complete demo collection in the approved order                                 |
| Validation            | validate_entry(payload: object) -> ValidatedEntry                   | Enforce the approved .NET-compatible field contract; raise typed validation failure |
| Repository            | add(entry: Entry) -> None                                           | Conditional durable write                                                           |
| Repository            | list_all() -> list[Entry]                                           | Strongly consistent base-table Query across internal pages                          |
| Response mapping      | to_http_response(result: object, status: int) -> dict               | JSON serialization, headers, body, and problem mapping                              |
| Local adapter         | GET/POST /api/entries                                               | Thin FastAPI adapter over the same application functions and error mapping          |
| React                 | loadEntries(showRefresh: boolean)                                   | Read collection and update UI state                                                 |
| React                 | submitEntry(event)                                                  | Submit form and update collection/status                                            |

## Data Types and Failure Boundaries

- Entry: id, name, email, message, createdAtUtc; all public fields are strings.
- ValidatedEntry: validated, normalized name/email/message only; no client-supplied identity or timestamp.
- EntryRepository: small protocol implemented by the same DynamoDB adapter against AWS or DynamoDB Local, selected explicitly by configuration.
- ValidationError: field-to-message mapping; HTTP 400 problem details with errors.
- StorageUnavailable: sanitized service failure; HTTP 503 with title and request ID, no submitted values or AWS exception text.
- Unexpected exception: generic HTTP 500; log safe operation metadata only.

## HTTP Contract Matrix

| Client Call       | Gateway Route     | Lambda       | Success                                    |
| ----------------- | ----------------- | ------------ | ------------------------------------------ |
| GET /api/entries  | GET /api/entries  | get_entries  | 200 JSON array, including []               |
| POST /api/entries | POST /api/entries | create_entry | 201 JSON entry; Location /api/entries/{id} |

Both paths remain unchanged through CloudFront. Location preserves the existing contract and does not imply a new GET-by-ID endpoint. HTTP headers include JSON content type and Cache-Control: no-store for API responses.
