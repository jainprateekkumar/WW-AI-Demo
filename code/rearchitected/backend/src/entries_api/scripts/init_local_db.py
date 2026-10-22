from __future__ import annotations

import os

import boto3


def main() -> None:
    endpoint_url = os.environ.get("DYNAMODB_ENDPOINT_URL", "http://localhost:8000")
    region = os.environ.get("AWS_REGION", "us-west-2")
    table_name = os.environ.get("TABLE_NAME", "ww-ai-demo-entries-local")
    client = boto3.client(
        "dynamodb",
        endpoint_url=endpoint_url,
        region_name=region,
        aws_access_key_id="local",
        aws_secret_access_key="local",
    )

    try:
        client.describe_table(TableName=table_name)
    except client.exceptions.ResourceNotFoundException:
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

    print(f"Local table ready: {table_name}")


if __name__ == "__main__":
    main()