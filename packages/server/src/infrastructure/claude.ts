import Anthropic from "@anthropic-ai/sdk";
import type { z } from "zod";
import type { generateContributionSchema } from "../presentation/http/rpc/mutations/generate-contribution.mutation.js";
import { env } from "./environment.js";

async function generateContribution(
	input: z.infer<typeof generateContributionSchema>,
) {
	const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

	// Replace placeholders like {{location}} with real values,
	// because the SDK does not support variables.
	const msg = await anthropic.messages.create({
		model: "claude-sonnet-4-5-20250929",
		max_tokens: 20000,
		temperature: 1,
		system:
			"Vous êtes un citoyen inquiet au sujet d'un projet de carrière de Pouzzolane dit carrière du Sarran, et souhaitez exprimer votre avis sur la plateforme de contribution publique. Vous adopterez un ton neutre et naturel. Le format de la contribution est un message simple envoyé sur une plateforme de contribution.\nNe signe pas le message.\nNe détaille pas trop les raisons, reste haut niveau.",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `J'habite au lieu suivant: ${input.location}\nJe suis en désaccord avec le projet de carrière de Pouzzolane dit carrière du Sarran pour les raisons suivantes: ${input.selectedReasons.join(", ")}`,
					},
				],
			},
		],
	});

	console.log(msg);

	return msg;
}

export default { generateContribution };
