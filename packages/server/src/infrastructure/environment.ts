import { number, oneOf, string, validate } from "valienv";

export const env = validate({
	env: process.env,
	validators: {
		HTTP_PORT: number,
		NODE_ENV: oneOf("development", "test", "production"),
		ANTHROPIC_API_KEY: string,
	},
});
