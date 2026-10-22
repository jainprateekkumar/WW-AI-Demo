# Technology Stack

## Languages and Frameworks

- C#: compiler version not pinned in the inspected project; ASP.NET Core targeting .NET 8.
- JavaScript/JSX: browser frontend; React and React DOM ^19.1.0.
- HTML/CSS: document and existing visual styling.

## Build Tools

- .NET SDK: installed version not checked.
- Vite ^6.3.5 with @vitejs/plugin-react ^4.7.0.
- npm: package manager; installed version not checked.
- Node: package manifest declares >=18.0.0; installed version not checked.

## Storage and Hosting

- JSON file configured as data/entries.json relative to the API content root.
- Local Vite API proxy target: http://localhost:5000.
- No cloud hosting or infrastructure definitions identified in the inspected files.

## Testing

Manual HTTP examples exist. No automated runner or coverage configuration was identified. Runtime and build verification have not been performed during this assessment.

## Requested Target

AWS serverless, React frontend, API Gateway, and Python Lambda functions. Python runtime version and supporting AWS services remain to be decided.
