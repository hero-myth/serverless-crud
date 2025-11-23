import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, getTableName } from "../lib/dynamo.js";
import { json } from "../lib/http.js";

export const handler = async (event) => {
	try {
	 const id = event.pathParameters?.id;
	 if (!id) return json(400, { message: "Missing id" });
	 await ddb.send(new DeleteCommand({
		 TableName: getTableName(),
		 Key: { id },
		 ConditionExpression: "attribute_exists(id)"
	 }));
	 return json(200, { id, deleted: true });
	} catch (err) {
	 console.error(err);
	 const code = err?.name === "ConditionalCheckFailedException" ? 404 : 500;
	 return json(code, { message: code === 404 ? "Not found" : "Failed to delete item" });
	}
};


