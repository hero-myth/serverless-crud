import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Items from "./Items.jsx";

vi.mock("../api.js", () => {
	const get = vi.fn(async () => ({ data: { items: [{ id: "1", title: "First", description: "A" }] } }));
	const post = vi.fn(async () => ({ data: { id: "2", title: "New", description: "" } }));
	const put = vi.fn(async () => ({ data: { id: "1", title: "Edited", description: "A" } }));
	const del = vi.fn(async () => ({ data: { deleted: true } }));
	return { default: { get, post, put, delete: del } };
});

describe("Items page", () => {
	it("renders list and allows create flow", async () => {
		render(<Items />);
		// Wait for initial list load
		await waitFor(() => expect(screen.getByText("First")).toBeInTheDocument());
		// Create a new item
		const title = screen.getByRole("textbox", { name: /title/i });
		fireEvent.change(title, { target: { value: "New" } });
		fireEvent.click(screen.getByRole("button", { name: /create/i }));
		// Expect optimistic insertion
		await waitFor(() => expect(screen.getByText(/new/i)).toBeInTheDocument());
	});
});


