# Code Structure

## Build Systems

- API: UserInputApi/UserInputApi.csproj, target net8.0.
- Client: frontend/package.json, Vite development/build/preview scripts.

## Source Inventory

- UserInputApi/Program.cs: endpoints, EntryRequest/Entry records, and EntryStore.
- UserInputApi/appsettings.json: logging, allowed hosts, and storage path.
- UserInputApi/UserInputApi.http: manual POST/GET examples.
- UserInputApi/UserInputApi.csproj: .NET web project settings.
- frontend/src/App.jsx: form, requests, collection, and UI states.
- frontend/src/main.jsx: React root and stylesheet import.
- frontend/src/styles.css: existing presentation; not inspected in this assessment.
- frontend/index.html: application document and metadata.
- frontend/vite.config.js: React plugin and API proxy.
- frontend/package.json: dependencies and scripts.
- README.md: repository heading only.

## Patterns and Dependencies

- Minimal API handlers use injected singleton EntryStore.
- SemaphoreSlim serializes operations within one API process.
- React hooks manage form, request status, and collection state.
- Browser fetch calls relative API paths.
- React and React DOM ^19.1.0; Vite ^6.3.5; React plugin ^4.7.0.

Build output under bin/ and obj/ is not application source. Existing data files were not opened to avoid unnecessarily reproducing personal information.
