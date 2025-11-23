import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, getTableName } from "../lib/dynamo.js";
import { json } from "../lib/http.js";

export const handler = async (event) => {
	try {
		const id = event.pathParameters?.id;
		if (!id) return json(400, { message: "Missing id" });
		const data = typeof event.body === "string" ? JSON.parse(event.body || "{}") : event.body || {};
		const { title, description } = data;
		if (!title && !description) {
			return json(400, { message: "Provide at least one of: title, description" });
		}
		const now = new Date().toISOString();
		const updateParts = [];
		const exprValues = { ":updatedAt": now };
		const exprNames = {};
		if (typeof title === "string") {
			updateParts.push("#t = :title");
			exprValues[":title"] = title;
			exprNames["#t"] = "title";
		}
		if (typeof description === "string") {
			updateParts.push("#d = :description");
			exprValues[":description"] = description;
			exprNames["#d"] = "description";
		}
		updateParts.push("#u = :updatedAt");
		exprNames["#u"] = "updatedAt";

		const res = await ddb.send(new UpdateCommand({
			TableName: getTableName(),
			Key: { id },
			UpdateExpression: "SET " + updateParts.join(", "),
			ExpressionAttributeValues: exprValues,
			ExpressionAttributeNames: exprNames,
			ConditionExpression: "attribute_exists(id)",
			ReturnValues: "ALL_NEW"
		}));
		return json(200, res.Attributes || {});
	} catch (err) {
		console.error(err);
		const code = err?.name === "ConditionalCheckFailedException" ? 404 : 500;
		return json(code, { message: code === 404 ? "Not found" : "Failed to update item" });
	}
};


