import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { ddb, getTableName } from "../lib/dynamo.js";

const ok = (body) => ({
	statusCode: 201,
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(body)
});

const bad = (message, code = 400) => ({
	statusCode: code,
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({ message })
});

export const handler = async (event) => {
	try {
		const data = typeof event.body === "string" ? JSON.parse(event.body || "{}") : event.body || {};
		const { title, description } = data;
		if (!title || typeof title !== "string") {
			return bad("Field 'title' is required and must be a string");
		}
		const now = new Date().toISOString();
		const item = {
			id: uuidv4(),
			title,
			description: typeof description === "string" ? description : "",
			createdAt: now,
			updatedAt: now
		};
		await ddb.send(new PutCommand({
			TableName: getTableName(),
			Item: item,
			ConditionExpression: "attribute_not_exists(id)"
		}));
		return ok(item);
	} catch (err) {
		console.error(err);
		return bad("Failed to create item", 500);
	}
};


