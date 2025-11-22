import { z } from "zod";
import Claude from "../../../../infrastructure/claude.js";

export const generateContributionSchema = z.object({
	location: z.string(),
	selectedReasons: z.array(z.string()),
});

export function generateContribution({
	input,
}: {
	input: z.infer<typeof generateContributionSchema>;
}) {
	return Claude.generateContribution(input);
}
