import { describe, expect, it } from "vitest";
import { getRPCClient } from "../utils/rpc.utils";

describe("GET /trpc/listJobOffers", () => {
	it("should return 200", async () => {
		const client = getRPCClient();
		const jobOffers = await client.listJobOffers.query();
		expect(jobOffers).toEqual([
			{ id: 1, name: "Job Offer 1" },
			{ id: 2, name: "Job Offer 2" },
		]);
	});
});
