import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { ddb, getTableName } from "../lib/dynamo.js";
import { json } from "../lib/http.js";

export const handler = async (event) => {
	try {
		const data = typeof event.body === "string" ? JSON.parse(event.body || "{}") : event.body || {};
		const { title, description } = data;
		if (!title || typeof title !== "string") {
			return json(400, { message: "Field 'title' is required and must be a string" });
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
		return json(201, item);
	} catch (err) {
		console.error(err);
		return json(500, { message: "Failed to create item" });
	}
};


