import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, getTableName } from "../lib/dynamo.js";
import { json } from "../lib/http.js";

export const handler = async (event) => {
	try {
		const id = event.pathParameters?.id;
		if (!id) return json(400, { message: "Missing id" });
		const res = await ddb.send(new GetCommand({
			TableName: getTableName(),
			Key: { id }
		}));
		if (!res.Item) return json(404, { message: "Not found" });
		return json(200, res.Item);
	} catch (err) {
		console.error(err);
		return json(500, { message: "Failed to get item" });
	}
};


