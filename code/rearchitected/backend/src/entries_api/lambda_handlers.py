from __future__ import annotations

from typing import Any

from entries_api.http import handle_get, handle_post
from entries_api.repository import get_repository


def get_entries_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    return handle_get(event, context, get_repository)


def create_entry_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    return handle_post(event, context, get_repository)