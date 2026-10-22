from __future__ import annotations

from entries_api.domain import Entry
from entries_api.repository import DynamoDBEntryRepository


class Table:
    def __init__(self) -> None:
        self.put_args = None
        self.queries: list[dict] = []

    def put_item(self, **kwargs) -> None:
        self.put_args = kwargs

    def query(self, **kwargs) -> dict:
        self.queries.append(kwargs)
        if len(self.queries) == 1:
            return {
                "Items": [
                    {
                        "id": "b",
                        "name": "B",
                        "email": "b@example.com",
                        "message": "m",
                        "createdAtUtc": "2026-01-02T00:00:00.000000Z",
                    }
                ],
                "LastEvaluatedKey": {"collectionId": "ENTRIES", "entryKey": "next"},
            }
        return {
            "Items": [
                {
                    "id": "a",
                    "name": "A",
                    "email": "a@example.com",
                    "message": "m",
                    "createdAtUtc": "2026-01-01T00:00:00.000000Z",
                }
            ]
        }


def test_add_uses_conditional_put_and_internal_keys() -> None:
    table = Table()
    repository = DynamoDBEntryRepository(table)
    entry = Entry("abc", "Jane", "jane@example.com", "note", "2026-01-01T00:00:00.000000Z")

    repository.add(entry)

    assert table.put_args["Item"]["collectionId"] == "ENTRIES"
    assert table.put_args["Item"]["entryKey"].endswith("#abc")
    assert "attribute_not_exists" in table.put_args["ConditionExpression"]


def test_list_queries_consistently_and_follows_pages() -> None:
    table = Table()
    entries = DynamoDBEntryRepository(table).list_all()

    assert [entry.id for entry in entries] == ["b", "a"]
    assert table.queries[0]["ConsistentRead"] is True
    assert table.queries[0]["ScanIndexForward"] is False
    assert table.queries[1]["ExclusiveStartKey"]["entryKey"] == "next"