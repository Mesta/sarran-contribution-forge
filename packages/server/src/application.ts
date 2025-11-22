import { env } from "./infrastructure/environment.js";
import { createServer } from "./presentation/http/server.js";

export function startApplication() {
	const server = createServer();
	server.listen({ port: env.HTTP_PORT, host: "0.0.0.0" });
}
