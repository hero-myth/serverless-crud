import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/lib/dynamo.js", () => {
	const send = vi.fn(async () => ({}));
	return {
		ddb: { send },
		getTableName: () => "table",
		__esModule: true
	};
});

describe("createItem.handler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns 400 when title is missing", async () => {
		const { handler } = await import("../src/handlers/createItem.js");
		const res = await handler({ body: JSON.stringify({ description: "x" }) });
		expect(res.statusCode).toBe(400);
		const data = JSON.parse(res.body);
		expect(data.message).toMatch(/title/i);
	});

	it("returns 201 and item when valid", async () => {
		const { handler } = await import("../src/handlers/createItem.js");
		const res = await handler({ body: JSON.stringify({ title: "abc", description: "d" }) });
		expect(res.statusCode).toBe(201);
		const data = JSON.parse(res.body);
		expect(data.id).toBeTruthy();
		expect(data.title).toBe("abc");
	});
});


