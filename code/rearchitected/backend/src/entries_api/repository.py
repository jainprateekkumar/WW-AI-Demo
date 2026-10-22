from __future__ import annotations

import os
from typing import Any

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key

from entries_api.domain import COLLECTION_ID, Entry, StorageUnavailable


class DynamoDBEntryRepository:
    def __init__(self, table: Any) -> None:
        self._table = table

    def add(self, entry: Entry) -> None:
        item = {
            "collectionId": COLLECTION_ID,
            "entryKey": f"{entry.created_at_utc}#{entry.id}",
            **entry.to_dict(),
        }
        try:
            self._table.put_item(
                Item=item,
                ConditionExpression="attribute_not_exists(collectionId) AND attribute_not_exists(entryKey)",
            )
        except (BotoCoreError, ClientError) as error:
            raise StorageUnavailable("The entry could not be stored.") from error

    def list_all(self) -> list[Entry]:
        entries: list[Entry] = []
        query: dict[str, Any] = {
            "KeyConditionExpression": Key("collectionId").eq(COLLECTION_ID),
            "ConsistentRead": True,
            "ScanIndexForward": False,
        }
        try:
            while True:
                response = self._table.query(**query)
                entries.extend(Entry.from_record(item) for item in response.get("Items", []))
                last_key = response.get("LastEvaluatedKey")
                if not last_key:
                    break
                query["ExclusiveStartKey"] = last_key
        except (BotoCoreError, ClientError, KeyError, TypeError) as error:
            raise StorageUnavailable("The collection could not be read.") from error
        return entries


def get_repository() -> DynamoDBEntryRepository:
    mode = os.environ.get("APP_ENV")
    endpoint_url = os.environ.get("DYNAMODB_ENDPOINT_URL")
    table_name = os.environ.get("TABLE_NAME")
    region = os.environ.get("AWS_REGION", "us-west-2")

    if not table_name:
        raise StorageUnavailable("The storage configuration is unavailable.")

    try:
        if mode == "local":
            if not endpoint_url:
                raise StorageUnavailable("Local storage requires an explicit endpoint.")
            resource = boto3.resource(
                "dynamodb",
                endpoint_url=endpoint_url,
                region_name=region,
                aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID", "local"),
                aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY", "local"),
            )
        elif mode == "aws" and not endpoint_url:
            resource = boto3.resource("dynamodb", region_name=region)
        else:
            raise StorageUnavailable("The storage mode is not explicitly configured.")
        return DynamoDBEntryRepository(resource.Table(table_name))
    except StorageUnavailable:
        raise
    except (BotoCoreError, ClientError, ValueError) as error:
        raise StorageUnavailable("The storage service is unavailable.") from error