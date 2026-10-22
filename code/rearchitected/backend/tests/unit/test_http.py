from __future__ import annotations

import json

from fastapi.testclient import TestClient

from entries_api.domain import Entry
from entries_api.http import handle_get, handle_post
from entries_api.local_api import app


class Repository:
    def __init__(self) -> None:
        self.entries: list[Entry] = []

    def add(self, entry: Entry) -> None:
        self.entries.append(entry)

    def list_all(self) -> list[Entry]:
        return list(self.entries)


class Context:
    aws_request_id = "test-request"


def _event(method: str, body: str = "", content_type: str = "application/json") -> dict:
    return {
        "rawPath": "/api/entries",
        "requestContext": {"http": {"method": method}},
        "headers": {"content-type": content_type},
        "body": body,
    }


def test_post_returns_existing_success_contract(repository) -> None:
    response = handle_post(
        _event("POST", json.dumps({"name": "Jane", "email": "jane@example.com", "message": "hi"})),
        Context(),
        lambda: repository,
    )

    entry = json.loads(response["body"])
    assert response["statusCode"] == 201
    assert response["headers"]["Location"] == f"/api/entries/{entry['id']}"
    assert set(entry) == {"id", "name", "email", "message", "createdAtUtc"}
    assert response["headers"]["Cache-Control"] == "no-store"


def test_invalid_post_does_not_create_repository(repository) -> None:
    response = handle_post(
        _event("POST", json.dumps({"name": "", "email": "bad", "message": ""})),
        Context(),
        lambda: (_ for _ in ()).throw(AssertionError("repository must not be created")),
    )

    assert response["statusCode"] == 400
    assert "errors" in json.loads(response["body"])
    assert repository.add_calls == 0


def test_bad_content_type_and_oversize_body_are_rejected() -> None:
    bad_type = handle_post(_event("POST", "{}", "text/plain"), Context(), lambda: None)
    too_large = handle_post(_event("POST", " " * (16 * 1024 + 1)), Context(), lambda: None)

    assert bad_type["statusCode"] == 415
    assert too_large["statusCode"] == 413


def test_wrong_path_and_method_are_rejected() -> None:
    wrong_path = {**_event("GET"), "rawPath": "/api/other"}
    wrong_method = _event("POST")

    assert handle_get(wrong_path, Context(), lambda: None)["statusCode"] == 404
    assert handle_get(wrong_method, Context(), lambda: None)["statusCode"] == 405


def test_local_fastapi_adapter_uses_shared_handler(monkeypatch) -> None:
    repository = Repository()
    monkeypatch.setattr("entries_api.local_api.get_repository", lambda: repository)
    client = TestClient(app)

    saved = client.post(
        "/api/entries",
        json={"name": "Jane", "email": "jane@example.com", "message": "hello"},
    )
    listed = client.get("/api/entries")

    assert saved.status_code == 201
    assert listed.status_code == 200
    assert listed.json()[0]["id"] == saved.json()["id"]