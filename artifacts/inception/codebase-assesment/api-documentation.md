# Existing API Contract

## POST /api/entries

- Request: JSON object with name, email, and message strings.
- Validation: required fields; name maximum 100 characters; email maximum 200 characters and EmailAddress validation; message maximum 2000 characters.
- Validation occurs before trimming; valid strings are trimmed before storage.
- Success: 201 Created; Location /api/entries/{id}; JSON entry with id, name, email, message, createdAtUtc using default web JSON naming.
- Invalid annotated input: validation-problem response containing an errors object; framework binding errors are handled separately by ASP.NET Core.
- ID: GUID. Timestamp: UTC.

## GET /api/entries

- Request: no parameters.
- Success: 200 OK and JSON array of entries.
- Returns JSON-file order; no pagination, filtering, or explicit sorting.

## Internal Interfaces

- EntryStore.AddAsync(Entry): appends an entry while holding the semaphore.
- EntryStore.GetAllAsync(): reads the collection while holding the semaphore.
- ReadAsync(): missing file returns an empty list; existing JSON deserializes to entries.

## Compatibility Notes

The frontend parses validation errors through errors or title, consumes lower-camel-case entry fields, and expects GET to return an array. A newly saved item is prepended in the UI even though server retrieval retains insertion order. Location points to an individual resource path with no GET-by-ID implementation. Preserve behavior unless an intentional change is approved.
