import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, getTableName } from "../lib/dynamo.js";

const respond = (statusCode, body) => ({
	statusCode,
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(body)
});

export const handler = async () => {
	try {
		const res = await ddb.send(new ScanCommand({
			TableName: getTableName()
		}));
		const items = (res.Items || []).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
		return respond(200, { items });
	} catch (err) {
		console.error(err);
		return respond(500, { message: "Failed to list items" });
	}
};


