import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/lib/dynamo.js", () => {
	const send = vi.fn(async () => ({ Attributes: { id: "1", title: "t", updatedAt: "now" } }));
	return {
		ddb: { send },
		getTableName: () => "table",
		__esModule: true
	};
});

describe("updateItem.handler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns 400 when id missing", async () => {
		const { handler } = await import("../src/handlers/updateItem.js");
		const res = await handler({ pathParameters: null, body: "{}" });
		expect(res.statusCode).toBe(400);
	});

	it("returns 400 when no fields provided", async () => {
		const { handler } = await import("../src/handlers/updateItem.js");
		const res = await handler({ pathParameters: { id: "1" }, body: "{}" });
		expect(res.statusCode).toBe(400);
	});

	it("returns 200 on success", async () => {
		const { handler } = await import("../src/handlers/updateItem.js");
		const res = await handler({ pathParameters: { id: "1" }, body: JSON.stringify({ title: "x" }) });
		expect(res.statusCode).toBe(200);
	});
});


