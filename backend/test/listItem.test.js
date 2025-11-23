import { describe, it, expect, vi, beforeEach } from "vitest";

const items = [
	{ id: "2", title: "b", updatedAt: "2025-01-01T00:00:00.000Z" },
	{ id: "1", title: "a", updatedAt: "2024-01-01T00:00:00.000Z" }
];

vi.mock("../src/lib/dynamo.js", () => {
	const send = vi.fn(async () => ({ Items: items }));
	return {
		ddb: { send },
		getTableName: () => "table",
		__esModule: true
	};
});

describe("listItems.handler", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns 200 and items array", async () => {
		const { handler } = await import("../src/handlers/listItems.js");
		const res = await handler();
		expect(res.statusCode).toBe(200);
		const body = JSON.parse(res.body);
		expect(Array.isArray(body.items)).toBe(true);
		expect(body.items[0].id).toBe("2"); // sorted by updatedAt desc
	});
});


