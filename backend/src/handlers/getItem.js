import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, getTableName } from "../lib/dynamo.js";

const respond = (statusCode, body) => ({
	statusCode,
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(body)
});

export const handler = async (event) => {
	try {
		const id = event.pathParameters?.id;
		if (!id) return respond(400, { message: "Missing id" });
		const res = await ddb.send(new GetCommand({
			TableName: getTableName(),
			Key: { id }
		}));
		if (!res.Item) return respond(404, { message: "Not found" });
		return respond(200, res.Item);
	} catch (err) {
		console.error(err);
		return respond(500, { message: "Failed to get item" });
	}
};


