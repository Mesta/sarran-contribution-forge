import { initTRPC } from "@trpc/server";
import {
	generateContribution,
	generateContributionSchema,
} from "./mutations/generate-contribution.mutation.js";

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

export const trpcRouter = router({
	generateContribution: publicProcedure
		.input(generateContributionSchema)
		.mutation(generateContribution),
});

export type AppRouter = typeof trpcRouter;
