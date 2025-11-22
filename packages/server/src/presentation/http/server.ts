import path from "node:path";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import {
	type FastifyTRPCPluginOptions,
	fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { env } from "../../infrastructure/environment.js";
import { createContext } from "./rpc/context.js";
import { trpcRouter } from "./rpc/router.js";

export function createServer() {
	const server = fastify({
		logger:
			env.NODE_ENV === "development"
				? {
						transport: {
							target: "pino-pretty",
							options: {
								colorize: true,
								translateTime: "HH:MM:ss Z",
								ignore: "pid,hostname",
							},
						},
					}
				: true,
	});

	if (env.NODE_ENV === "development") {
		server.register(fastifyCors, {
			origin: "http://localhost:5173",
			allowedHeaders: ["Content-Type", "Authorization"],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		});
	}

	console.log(path.join(import.meta.dirname, "public"));
	server.register(fastifyStatic, {
		root: path.join(import.meta.dirname, "public"),
		prefix: "/",
	});

	server.get("/health", (_, reply) => {
		return reply.send({ status: "ok" });
	});

	server.register(fastifyTRPCPlugin, {
		prefix: "/rpc",
		trpcOptions: {
			router: trpcRouter,
			createContext,
			onError({ path, error }) {
				console.error(`Error in RPC handler on path '${path}':`, error);
			},
		} satisfies FastifyTRPCPluginOptions<typeof trpcRouter>["trpcOptions"],
	});

	return server;
}
