import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
export const ddb = DynamoDBDocumentClient.from(client, {
	transformEmptyValues: true
});

export const getTableName = () => {
	const tableName = process.env.ITEMS_TABLE_NAME;
	if (!tableName) {
		throw new Error("ITEMS_TABLE_NAME environment variable is not set");
	}
	return tableName;
};


