# Dependencies

## Internal Dependencies

- React client depends at runtime on GET/POST /api/entries and its JSON/error contract.
- Vite development proxy depends on an API listening at localhost:5000.
- UserInputApi depends on EntryStore and its writable JSON path.
- EntryStore uses .NET JSON serialization, file I/O, and process-local synchronization.

## External Manifest Dependencies

| Dependency           | Declared Version | Purpose                                                       |
| -------------------- | ---------------- | ------------------------------------------------------------- |
| react                | ^19.1.0          | UI and hooks                                                  |
| react-dom            | ^19.1.0          | Browser rendering                                             |
| vite                 | ^6.3.5           | Development server and build                                  |
| @vitejs/plugin-react | ^4.7.0           | React build integration                                       |
| user-input-client    | file:            | Local self-reference in package manifest; purpose unconfirmed |

The API declares no explicit external NuGet packages and uses the Microsoft.NET.Sdk.Web shared framework. Exact resolved versions, package licenses, dependency vulnerability status, and installation success were not verified.

## Migration Implications

Remove the runtime dependency on the .NET API in the migrated application while retaining a compatible client contract. Resolve the persistent store and deployment wiring before implementation; do not substitute Lambda-local JSON storage.
