# Entries API and Local Development

## HTTP Contract

- `GET /api/entries`: 200 JSON array, newest first; `[]` when empty.
- `POST /api/entries`: JSON `{ "name": string, "email": string, "message": string }`; 201 JSON entry with `id`, `name`, `email`, `message`, `createdAtUtc`, and `Location: /api/entries/{id}`.
- Field limits before trimming: name 100, email 200, message 2000 UTF-16 code units. Email behavior still requires comparison against the original .NET API before claiming exact compatibility.
- Invalid content returns 400 with an `errors` mapping; unsupported media returns 415; body over 16 KiB returns 413; storage/read/4 MiB collection bound returns a sanitized 503.
- Public unauthenticated demo: submit synthetic data only. No authentication, update/delete, import, or individual-entry read route.

## Local Service

1. From `code/rearchitected/`, start only the isolated local database with `docker compose up -d dynamodb-local`.
2. From `code/rearchitected/backend/`, install dependencies from `uv.lock`: `uv sync --frozen`.
3. Set the example local variables from `.env.example`; `APP_ENV=local` and `DYNAMODB_ENDPOINT_URL=http://localhost:8000` are mandatory for local mode.
4. Initialize the local table: `uv run python -m entries_api.scripts.init_local_db`.
5. Start the adapter on port 5000: `uv run uvicorn entries_api.local_api:app --host 127.0.0.1 --port 5000`.
6. From `frontend/`, run `npm ci` then `npm run dev`. Vite on port 5173 proxies `/api` to port 5000.

The Docker named volume intentionally preserves local demo entries across restarts. The integration test uses a unique disposable table and refuses to run unless explicitly opted in against a localhost DynamoDB Local endpoint.

## Lambda Entry Points

- Read function: `entries_api.lambda_handlers.get_entries_handler`.
- Create function: `entries_api.lambda_handlers.create_entry_handler`.
- Both require `APP_ENV=aws`, a deployed `TABLE_NAME`, and the Lambda execution role. Do not put credentials in deployment variables.

## Verification Note

The environment's terminal test call was skipped, and no .NET-vs-Python runtime compatibility comparison or real DynamoDB Local/browser exercise is claimed here. Run those checks in Build and Test/Verify before treating the migration as validated.
