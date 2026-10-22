from __future__ import annotations

from datetime import datetime, timezone

import pytest

from entries_api.application import create_entry, list_entries
from entries_api.domain import Entry, ResponseTooLarge
from entries_api.validation import validate_entry


def test_create_generates_server_id_and_utc_timestamp(repository) -> None:
    entry = create_entry(
        validate_entry({"name": "Jane", "email": "jane@example.com", "message": "hello"}),
        repository,
    )

    assert len(entry.id) == 36
    assert entry.id == entry.id.lower()
    assert datetime.fromisoformat(entry.created_at_utc.replace("Z", "+00:00")).tzinfo == timezone.utc
    assert repository.entries == [entry]


def test_list_entries_sorts_newest_first_with_id_tiebreaker(repository) -> None:
    repository.entries.extend(
        [
            Entry("b", "B", "b@example.com", "m", "2026-01-01T00:00:00.000000Z"),
            Entry("c", "C", "c@example.com", "m", "2026-01-02T00:00:00.000000Z"),
            Entry("a", "A", "a@example.com", "m", "2026-01-01T00:00:00.000000Z"),
        ]
    )

    assert [entry.id for entry in list_entries(repository)] == ["c", "b", "a"]


def test_oversize_collection_is_not_silently_truncated(repository) -> None:
    repository.entries.extend(
        Entry(str(index), "A", "a@example.com", "x" * 2000, "2026-01-01T00:00:00.000000Z")
        for index in range(2200)
    )

    with pytest.raises(ResponseTooLarge):
        list_entries(repository)