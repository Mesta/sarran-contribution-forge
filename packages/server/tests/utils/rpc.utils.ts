import { createTRPCClient, httpBatchLink, type TRPCClient } from "@trpc/client";
import type { trpcRouter } from "../../src/presentation/http/rpc/router";

export function getRPCClient(): TRPCClient<typeof trpcRouter> {
	return createTRPCClient({
		links: [httpBatchLink({ url: `http://localhost:3000/rpc` })],
	});
}
