from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Protocol
from uuid import uuid4

from entries_api.domain import Entry, MAX_RESPONSE_BYTES, ResponseTooLarge, ValidatedEntry
from entries_api.validation import validate_entry


class EntryRepository(Protocol):
    def add(self, entry: Entry) -> None: ...

    def list_all(self) -> list[Entry]: ...


def create_entry(payload: object, repository: EntryRepository) -> Entry:
    values = payload if isinstance(payload, ValidatedEntry) else validate_entry(payload)
    entry_id = str(uuid4())
    created_at_utc = datetime.now(timezone.utc).isoformat(timespec="microseconds")
    created_at_utc = created_at_utc.replace("+00:00", "Z")
    entry = Entry(
        id=entry_id,
        name=values.name,
        email=values.email,
        message=values.message,
        created_at_utc=created_at_utc,
    )
    repository.add(entry)
    return entry


def list_entries(repository: EntryRepository) -> list[Entry]:
    entries = repository.list_all()
    entries.sort(key=lambda item: (item.created_at_utc, item.id), reverse=True)
    encoded = json.dumps(
        [entry.to_dict() for entry in entries],
        ensure_ascii=False,
        separators=(",", ":"),
    ).encode("utf-8")
    if len(encoded) > MAX_RESPONSE_BYTES:
        raise ResponseTooLarge("Collection exceeds the supported response size.")
    return entries