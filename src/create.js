import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getHeaders } from "./cors.js";

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

export const handler = async (event) => {
  const headers = getHeaders(event);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const body = JSON.parse(event.body);
  const { rating, text, name, pet, location } = body;

  if (!rating || !text || !name || !pet || !location) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Faltan campos requeridos." }),
    };
  }

  const item = {
    reviewId: uuidv4(),
    entity: "review",
    rating: Number(rating),
    text,
    name,
    pet,
    location,
    createdAt: new Date().toISOString(),
  };

  await client.send(
    new PutCommand({ TableName: process.env.TABLE_NAME, Item: item }),
  );

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(item),
  };
};
