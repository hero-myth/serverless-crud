import "dotenv/config";
import { Amplify } from "aws-amplify";
import { signIn, fetchAuthSession, signOut } from "aws-amplify/auth";

const required = (name) => {
	const v = process.env[name];
	if (!v) {
		throw new Error(`Missing required env var: ${name}`);
	}
	return v;
};

const API_BASE_URL = required("API_BASE_URL");
const COGNITO_REGION = required("COGNITO_REGION");
const COGNITO_USER_POOL_ID = required("COGNITO_USER_POOL_ID");
const COGNITO_CLIENT_ID = required("COGNITO_CLIENT_ID");
const TEST_USER_EMAIL = required("TEST_USER_EMAIL");
const TEST_USER_PASSWORD = required("TEST_USER_PASSWORD");

Amplify.configure({
	Auth: {
		Cognito: {
			region: COGNITO_REGION,
			userPoolId: COGNITO_USER_POOL_ID,
			userPoolClientId: COGNITO_CLIENT_ID
		}
	}
});

const authHeaders = async () => {
	const session = await fetchAuthSession();
	const jwt =
		session?.tokens?.idToken?.toString() ||
		session?.tokens?.accessToken?.toString();
	return {
		Authorization: `Bearer ${jwt}`,
		"Content-Type": "application/json"
	};
};

const run = async () => {
	console.log("Signing in test user:", TEST_USER_EMAIL);
	await signIn({ username: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
	const headers = await authHeaders();

	// Create
	console.log("POST /items");
	let res = await fetch(`${API_BASE_URL}/items`, {
		method: "POST",
		headers,
		body: JSON.stringify({ title: "itest", description: "from integration test" })
	});
	console.log("Status:", res.status);
	const created = await res.json();
	if (res.status !== 201) throw new Error("Create failed: " + JSON.stringify(created));
	const id = created.id;

	// Get
	console.log("GET /items/" + id);
	res = await fetch(`${API_BASE_URL}/items/${id}`, { headers });
	console.log("Status:", res.status);
	if (res.status !== 200) throw new Error("Get failed");

	// List
	console.log("GET /items");
	res = await fetch(`${API_BASE_URL}/items`, { headers });
	console.log("Status:", res.status);
	if (res.status !== 200) throw new Error("List failed");

	// Update
	console.log("PUT /items/" + id);
	res = await fetch(`${API_BASE_URL}/items/${id}`, {
		method: "PUT",
		headers,
		body: JSON.stringify({ title: "itest-updated" })
	});
	console.log("Status:", res.status);
	if (res.status !== 200) throw new Error("Update failed");

	// Delete
	console.log("DELETE /items/" + id);
	res = await fetch(`${API_BASE_URL}/items/${id}`, { method: "DELETE", headers });
	console.log("Status:", res.status);
	if (res.status !== 200) throw new Error("Delete failed");

	await signOut();
	console.log("Integration tests passed");
};

run().catch((err) => {
	console.error(err);
	process.exit(1);
});


