import { randomUUID } from "node:crypto";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req, res }: CreateFastifyContextOptions) {
	const requestId = { name: req.headers["x-request-id"] ?? randomUUID() };
	return { req, res, requestId };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
