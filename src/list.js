import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getHeaders } from "./cors.js";

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

export const handler = async (event) => {
  const headers = getHeaders(event);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const result = await client.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: "entity-createdAt-index",
      KeyConditionExpression: "entity = :e",
      ExpressionAttributeValues: { ":e": "review" },
      ScanIndexForward: false,
      Limit: 3,
    }),
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Items),
  };
};
