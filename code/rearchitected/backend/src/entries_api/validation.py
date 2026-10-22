from __future__ import annotations

import re
from collections.abc import Mapping
from typing import Any

from entries_api.domain import ValidatedEntry, ValidationError


_FIELDS = (
    ("name", "Name", 100),
    ("email", "Email", 200),
    ("message", "Message", 2000),
)
_EMAIL_PATTERN = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")


def _utf16_length(value: str) -> int:
    return len(value.encode("utf-16-le", errors="surrogatepass")) // 2


def validate_entry(payload: Any) -> ValidatedEntry:
    if not isinstance(payload, Mapping):
        raise ValidationError({"": ["The request body must be a JSON object."]})

    fields: dict[str, Any] = {}
    for key, value in payload.items():
        if isinstance(key, str):
            fields[key.casefold()] = value

    errors: dict[str, list[str]] = {}
    normalized: dict[str, str] = {}

    for field_name, property_name, max_length in _FIELDS:
        value = fields.get(field_name)
        if not isinstance(value, str):
            errors.setdefault(property_name, []).append(
                f"The {property_name} field is required and must be a string."
            )
            continue

        if not value or not value.strip():
            errors.setdefault(property_name, []).append(
                f"The {property_name} field is required."
            )

        if _utf16_length(value) > max_length:
            errors.setdefault(property_name, []).append(
                f"The field {property_name} must be a string with a maximum length of {max_length}."
            )

        if field_name == "email" and value and not _EMAIL_PATTERN.fullmatch(value):
            errors.setdefault(property_name, []).append(
                f"The {property_name} field is not a valid e-mail address."
            )

        normalized[field_name] = value.strip()

    if errors:
        raise ValidationError(errors)

    return ValidatedEntry(
        name=normalized["name"],
        email=normalized["email"],
        message=normalized["message"],
    )