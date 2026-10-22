from __future__ import annotations

from dataclasses import dataclass
from typing import Any


COLLECTION_ID = "ENTRIES"
MAX_REQUEST_BYTES = 16 * 1024
MAX_RESPONSE_BYTES = 4 * 1024 * 1024


class ValidationError(Exception):
    def __init__(self, errors: dict[str, list[str]]) -> None:
        super().__init__("The request contains invalid fields.")
        self.errors = errors


class StorageUnavailable(Exception):
    pass


class ResponseTooLarge(Exception):
    pass


@dataclass(frozen=True, slots=True)
class ValidatedEntry:
    name: str
    email: str
    message: str


@dataclass(frozen=True, slots=True)
class Entry:
    id: str
    name: str
    email: str
    message: str
    created_at_utc: str

    def to_dict(self) -> dict[str, str]:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "message": self.message,
            "createdAtUtc": self.created_at_utc,
        }

    @classmethod
    def from_record(cls, record: dict[str, Any]) -> Entry:
        return cls(
            id=str(record["id"]),
            name=str(record["name"]),
            email=str(record["email"]),
            message=str(record["message"]),
            created_at_utc=str(record["createdAtUtc"]),
        )