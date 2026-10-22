# Existing System Architecture

## Overview

Two application packages: a React/Vite frontend and a .NET 8 ASP.NET Core minimal API. No AWS infrastructure is present in the supplied source structure.

## Architecture and Data Flow

1. Browser loads the React application.
2. Client requests GET /api/entries; Vite proxies /api to http://localhost:5000 in development.
3. User submits the form; client sends POST /api/entries with JSON.
4. API validates input, generates a GUID and UTC timestamp, and trims submitted fields.
5. EntryStore reads, appends, and rewrites data/entries.json under a process-local semaphore.
6. API returns 201 and the entry; client prepends it to the displayed collection.

## Dependencies and Infrastructure

- Frontend depends on the HTTP API contract, not the .NET runtime.
- API depends on writable persistent local storage.
- Data path is configurable through Storage:FilePath.
- No external services, database server, VPC, infrastructure-as-code, or cloud deployment configuration was identified in the inspected files.

## Migration Constraints

Python Lambda must preserve or deliberately revise the HTTP contract. Lambda local storage is not a durable shared entry database. Hosting, persistence, authentication, AWS region, and deployment execution remain undecided.
