import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Amplify Auth (avoid real network)
vi.mock("aws-amplify/auth", () => {
	return {
		signOut: vi.fn(async () => {}),
		signIn: vi.fn(async () => ({})),
		fetchAuthSession: vi.fn(async () => ({
			tokens: { idToken: "test", accessToken: "test" }
		})),
		getCurrentUser: vi.fn(async () => ({ username: "test" }))
	};
});

// Ensure Vite envs exist in tests to avoid undefined usage
globalThis.import_meta = { env: {} };


