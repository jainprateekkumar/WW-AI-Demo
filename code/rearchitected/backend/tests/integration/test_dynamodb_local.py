from __future__ import annotations

import os
import uuid
from urllib.parse import urlparse

import boto3
import pytest

from entries_api.application import create_entry
from entries_api.domain import Entry
from entries_api.repository import get_repository
from entries_api.validation import validate_entry


pytestmark = pytest.mark.skipif(
    os.environ.get("RUN_DYNAMODB_LOCAL_INTEGRATION") != "1"
    or os.environ.get("APP_ENV") != "local"
    or urlparse(os.environ.get("DYNAMODB_ENDPOINT_URL", "")).hostname
    not in {"localhost", "127.0.0.1"},
    reason="Requires explicit opt-in and a localhost DynamoDB Local endpoint.",
)


def test_persistent_read_write_survives_new_repository_instance(monkeypatch) -> None:
    endpoint = os.environ["DYNAMODB_ENDPOINT_URL"]
    table_name = f"ww-ai-demo-test-{uuid.uuid4().hex}"
    client = boto3.client(
        "dynamodb",
        endpoint_url=endpoint,
        region_name=os.environ.get("AWS_REGION", "us-west-2"),
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID", "local"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY", "local"),
    )
    client.create_table(
        TableName=table_name,
        KeySchema=[
            {"AttributeName": "collectionId", "KeyType": "HASH"},
            {"AttributeName": "entryKey", "KeyType": "RANGE"},
        ],
        AttributeDefinitions=[
            {"AttributeName": "collectionId", "AttributeType": "S"},
            {"AttributeName": "entryKey", "AttributeType": "S"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )
    client.get_waiter("table_exists").wait(TableName=table_name)
    monkeypatch.setenv("TABLE_NAME", table_name)

    try:
        repository = get_repository()
        assert repository.list_all() == []
        entry = create_entry(
            validate_entry(
                {
                    "name": "Synthetic User",
                    "email": "synthetic@example.com",
                    "message": str(uuid.uuid4()),
                }
            ),
            repository,
        )

        reloaded_repository = get_repository()
        assert entry in reloaded_repository.list_all()
        assert client.describe_table(TableName=table_name)["Table"]["TableStatus"] == "ACTIVE"
    finally:
        client.delete_table(TableName=table_name)