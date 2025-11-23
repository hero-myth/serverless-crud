import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
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
	 await ddb.send(new DeleteCommand({
		 TableName: getTableName(),
		 Key: { id },
		 ConditionExpression: "attribute_exists(id)"
	 }));
	 return respond(200, { id, deleted: true });
	} catch (err) {
	 console.error(err);
	 const code = err?.name === "ConditionalCheckFailedException" ? 404 : 500;
	 return respond(code, { message: code === 404 ? "Not found" : "Failed to delete item" });
	}
};


