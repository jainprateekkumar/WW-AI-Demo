from __future__ import annotations

from collections.abc import Iterator

import pytest

from entries_api.domain import Entry


class MemoryRepository:
    def __init__(self) -> None:
        self.entries: list[Entry] = []
        self.add_calls = 0

    def add(self, entry: Entry) -> None:
        self.add_calls += 1
        self.entries.append(entry)

    def list_all(self) -> list[Entry]:
        return list(self.entries)


@pytest.fixture
def repository() -> Iterator[MemoryRepository]:
    yield MemoryRepository()