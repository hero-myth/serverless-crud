import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, getTableName } from "../lib/dynamo.js";
import { json } from "../lib/http.js";

export const handler = async () => {
	try {
		const res = await ddb.send(new ScanCommand({
			TableName: getTableName()
		}));
		const items = (res.Items || []).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
		return json(200, { items });
	} catch (err) {
		console.error(err);
		return json(500, { message: "Failed to list items" });
	}
};


