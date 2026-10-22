from __future__ import annotations

import base64
import binascii
import json
from collections.abc import Callable
from typing import Any

from entries_api.application import EntryRepository, create_entry, list_entries
from entries_api.domain import (
    MAX_REQUEST_BYTES,
    ResponseTooLarge,
    StorageUnavailable,
    ValidationError,
)
from entries_api.validation import validate_entry


RepositoryFactory = Callable[[], EntryRepository]


def json_response(
    status_code: int,
    payload: Any,
    request_id: str,
    extra_headers: dict[str, str] | None = None,
) -> dict[str, Any]:
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Request-Id": request_id,
    }
    if extra_headers:
        headers.update(extra_headers)
    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        "isBase64Encoded": False,
    }


def problem_response(
    status_code: int,
    title: str,
    request_id: str,
    errors: dict[str, list[str]] | None = None,
    extra_headers: dict[str, str] | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {"title": title, "status": status_code}
    if errors is not None:
        payload["errors"] = errors
    return json_response(status_code, payload, request_id, extra_headers)


def _event_method(event: dict[str, Any]) -> str:
    return str(event.get("requestContext", {}).get("http", {}).get("method", "")).upper()


def _event_path(event: dict[str, Any]) -> str:
    return str(event.get("rawPath", event.get("path", "")))


def _headers(event: dict[str, Any]) -> dict[str, str]:
    return {str(key).casefold(): str(value) for key, value in event.get("headers", {}).items()}


def _request_id(context: Any) -> str:
    return str(getattr(context, "aws_request_id", "local"))


def _decode_payload(event: dict[str, Any], request_id: str) -> tuple[Any | None, dict[str, Any] | None]:
    headers = _headers(event)
    content_type = headers.get("content-type", "").split(";", maxsplit=1)[0].strip().casefold()
    if content_type != "application/json":
        return None, problem_response(415, "Content-Type must be application/json.", request_id)

    body = event.get("body")
    if not isinstance(body, str):
        return None, problem_response(400, "The request body must contain JSON.", request_id)

    try:
        raw_body = base64.b64decode(body, validate=True) if event.get("isBase64Encoded") else body.encode("utf-8")
    except (binascii.Error, UnicodeEncodeError):
        return None, problem_response(400, "The request body must contain valid JSON.", request_id)

    if len(raw_body) > MAX_REQUEST_BYTES:
        return None, problem_response(413, "The request body exceeds the supported size.", request_id)

    try:
        return json.loads(raw_body), None
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None, problem_response(400, "The request body must contain valid JSON.", request_id)


def handle_get(event: dict[str, Any], context: Any, repository_factory: RepositoryFactory) -> dict[str, Any]:
    request_id = _request_id(context)
    if _event_path(event) != "/api/entries":
        return problem_response(404, "Resource not found.", request_id)
    if _event_method(event) != "GET":
        return problem_response(405, "Method not allowed.", request_id, extra_headers={"Allow": "GET"})

    try:
        entries = list_entries(repository_factory())
        return json_response(200, [entry.to_dict() for entry in entries], request_id)
    except (StorageUnavailable, ResponseTooLarge):
        return problem_response(503, "The collection is temporarily unavailable.", request_id)
    except Exception:
        return problem_response(500, "An unexpected error occurred.", request_id)


def handle_post(event: dict[str, Any], context: Any, repository_factory: RepositoryFactory) -> dict[str, Any]:
    request_id = _request_id(context)
    if _event_path(event) != "/api/entries":
        return problem_response(404, "Resource not found.", request_id)
    if _event_method(event) != "POST":
        return problem_response(405, "Method not allowed.", request_id, extra_headers={"Allow": "POST"})

    payload, error_response = _decode_payload(event, request_id)
    if error_response is not None:
        return error_response

    try:
        validated = validate_entry(payload)
        entry = create_entry(validated, repository_factory())
        return json_response(
            201,
            entry.to_dict(),
            request_id,
            extra_headers={"Location": f"/api/entries/{entry.id}"},
        )
    except ValidationError as error:
        return problem_response(
            400,
            "One or more validation errors occurred.",
            request_id,
            errors=error.errors,
        )
    except StorageUnavailable:
        return problem_response(503, "The entry could not be saved.", request_id)
    except Exception:
        return problem_response(500, "An unexpected error occurred.", request_id)