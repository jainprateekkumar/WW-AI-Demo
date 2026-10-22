# Entries API Domain Entities

## Entry

| Field        | Type   | Origin           | Rule                                                                       |
| ------------ | ------ | ---------------- | -------------------------------------------------------------------------- |
| id           | string | Server UUID      | Lowercase hyphenated form; immutable                                       |
| name         | string | Request          | Required; <=100 UTF-16 units pre-trim; trimmed on acceptance               |
| email        | string | Request          | Required; <=200 UTF-16 units pre-trim; .NET-compatible email rule; trimmed |
| message      | string | Request          | Required; <=2000 UTF-16 units pre-trim; trimmed                            |
| createdAtUtc | string | Server UTC clock | ISO 8601 UTC; immutable                                                    |

## ValidatedEntry

An internal request value containing only normalized name, email, and message. It cannot contain trusted identity, time, or DynamoDB keys. Unknown input fields are discarded.

## Persistence Record

- collectionId: fixed string `ENTRIES` as partition key.
- entryKey: UTC timestamp in fixed-width sortable ISO format plus `#` and lowercase UUID as sort key.
- Public Entry fields stored without additional contact data.
- Query the `ENTRIES` partition consistently, paginating all DynamoDB pages. Order by sort key descending; decode public timestamps and use ID descending as explicit tie-breaker if required.

## Relationships and Lifecycle

An Entry belongs to the single public demo collection; there is no user/owner relationship, account, or access-control entity. Create is append-only. GET reads the whole collection. Update, delete, retention, and import operations are out of scope. The service starts with an empty table.

## Representation

HTTP JSON property names are lower camel case (`createdAtUtc`). Validation error keys preserve the current API's PascalCase model-property names (`Name`, `Email`, `Message`). Internal table keys never appear in the public response.
