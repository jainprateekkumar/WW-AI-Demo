from __future__ import annotations

import pytest

from entries_api.domain import ValidationError
from entries_api.validation import validate_entry


def test_validates_case_insensitive_fields_and_trims_after_validation() -> None:
    result = validate_entry({"Name": " Jane ", "EMAIL": "jane@example.com", "Message": " note "})

    assert result.name == "Jane"
    assert result.email == "jane@example.com"
    assert result.message == "note"


@pytest.mark.parametrize(
    ("payload", "field"),
    [
        ({"name": " ", "email": "jane@example.com", "message": "note"}, "Name"),
        ({"name": "Jane", "email": "not-an-email", "message": "note"}, "Email"),
        ({"name": "x" * 101, "email": "jane@example.com", "message": "note"}, "Name"),
        ({"name": "Jane", "email": "jane@example.com", "message": "x" * 2001}, "Message"),
        ({"name": 1, "email": "jane@example.com", "message": "note"}, "Name"),
        ({"email": "jane@example.com", "message": "note"}, "Name"),
    ],
)
def test_invalid_fields_return_property_keyed_errors(payload: object, field: str) -> None:
    with pytest.raises(ValidationError) as raised:
        validate_entry(payload)

    assert field in raised.value.errors


def test_length_uses_utf16_code_units() -> None:
    with pytest.raises(ValidationError) as raised:
        validate_entry({"name": "😀" * 51, "email": "jane@example.com", "message": "note"})

    assert "Name" in raised.value.errors


def test_maximum_lengths_are_inclusive_and_checked_before_trim() -> None:
    result = validate_entry(
        {
            "name": "n" * 100,
            "email": "a" * 188 + "@example.com",
            "message": "m" * 2000,
        }
    )

    assert len(result.name) == 100
    assert len(result.email) == 200
    assert len(result.message) == 2000


def test_spaces_do_not_make_an_over_limit_value_valid_after_trim() -> None:
    with pytest.raises(ValidationError) as raised:
        validate_entry(
            {
                "name": "n" * 100 + " ",
                "email": "jane@example.com",
                "message": "note",
            }
        )

    assert "Name" in raised.value.errors


def test_non_object_json_is_invalid() -> None:
    with pytest.raises(ValidationError):
        validate_entry(["Jane", "jane@example.com", "note"])