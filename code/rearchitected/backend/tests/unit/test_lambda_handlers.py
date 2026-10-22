from __future__ import annotations

import json

from entries_api import lambda_handlers
from entries_api.domain import Entry


class Repository:
    def add(self, entry: Entry) -> None:
        self.entry = entry

    def list_all(self) -> list[Entry]:
        return []


class Context:
    aws_request_id = "lambda-test"


def test_lambda_handlers_use_gateway_v2_contract(monkeypatch) -> None:
    repository = Repository()
    monkeypatch.setattr(lambda_handlers, "get_repository", lambda: repository)
    event = {
        "rawPath": "/api/entries",
        "requestContext": {"http": {"method": "POST"}},
        "headers": {"content-type": "application/json"},
        "body": json.dumps({"name": "Jane", "email": "jane@example.com", "message": "note"}),
    }

    response = lambda_handlers.create_entry_handler(event, Context())

    assert response["statusCode"] == 201
    assert response["headers"]["X-Request-Id"] == "lambda-test"


def test_get_handler_returns_empty_array(monkeypatch) -> None:
    monkeypatch.setattr(lambda_handlers, "get_repository", Repository)
    event = {
        "rawPath": "/api/entries",
        "requestContext": {"http": {"method": "GET"}},
        "headers": {},
    }

    response = lambda_handlers.get_entries_handler(event, Context())

    assert response["statusCode"] == 200
    assert json.loads(response["body"]) == []