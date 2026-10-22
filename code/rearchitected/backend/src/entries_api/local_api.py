from __future__ import annotations

import base64
import uuid
from typing import Any

from fastapi import FastAPI, Request, Response

from entries_api.http import handle_get, handle_post
from entries_api.repository import get_repository


app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


def _context(request: Request) -> Any:
    return type("LocalContext", (), {"aws_request_id": str(uuid.uuid4())})()


def _as_response(result: dict[str, Any]) -> Response:
    return Response(
        content=result["body"],
        status_code=result["statusCode"],
        headers=result["headers"],
    )


@app.get("/api/entries")
async def get_entries(request: Request) -> Response:
    event = {
        "rawPath": request.url.path,
        "requestContext": {"http": {"method": "GET"}},
        "headers": dict(request.headers),
    }
    return _as_response(handle_get(event, _context(request), get_repository))


@app.post("/api/entries")
async def create_entry(request: Request) -> Response:
    body = await request.body()
    event = {
        "rawPath": request.url.path,
        "requestContext": {"http": {"method": "POST"}},
        "headers": dict(request.headers),
        "body": base64.b64encode(body).decode("ascii"),
        "isBase64Encoded": True,
    }
    return _as_response(handle_post(event, _context(request), get_repository))