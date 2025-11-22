import { describe, expect, it } from "vitest";

describe("GET /health", () => {
	it("should return 200", async () => {
		const response = await fetch("http://localhost:3000/health");
		expect(response.status).toBe(200);
	});
});
