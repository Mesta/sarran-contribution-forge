import { useState } from "react";
import "./App.css";
import { trpc } from "./lib/trpc";

const OPPOSITION_REASONS = [
	{
		id: "environmental-pollution",
		label: "Préoccupations concernant la pollution environnementale",
	},
	{ id: "water-contamination", label: "Risques de contamination de l'eau" },
	{ id: "air-quality", label: "Dégradation de la qualité de l'air" },
	{ id: "noise-pollution", label: "Pollution sonore" },
	{
		id: "biodiversity",
		label: "Impact sur la faune et la biodiversité locales",
	},
	{ id: "traffic", label: "Augmentation du trafic de poids lourds" },
	{ id: "property-value", label: "Baisse de la valeur immobilière" },
	{ id: "health", label: "Préoccupations sanitaires pour les résidents" },
	{ id: "landscape", label: "Destruction du paysage naturel" },
	{ id: "dust", label: "Émissions de poussières et particules" },
	{ id: "water-resources", label: "Épuisement des ressources en eau locales" },
	{ id: "community", label: "Perturbation de la vie communautaire" },
];

function App() {
	const [location, setLocation] = useState("");
	const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

	const generateContributionMutation =
		trpc.generateContribution.useMutation();

	const handleReasonToggle = (reasonId: string) => {
		setSelectedReasons((prev) =>
			prev.includes(reasonId)
				? prev.filter((id) => id !== reasonId)
				: [...prev, reasonId],
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const result = await generateContributionMutation.mutateAsync({
				location,
				selectedReasons,
			});
			console.log("Contribution generated:", result);
			alert("Contribution soumise avec succès !");
		} catch (error) {
			console.error("Error generating contribution:", error);
			alert("Erreur lors de la soumission de la contribution");
		}
	};

	return (
		<div className="dashboard">
			<header className="dashboard-header">
				<h1>Consultation publique - Carrière du Sarran</h1>
				<p className="subtitle">
					Partagez vos préoccupations concernant le projet
				</p>
			</header>

			<main className="dashboard-content">
				<form onSubmit={handleSubmit} className="contribution-form">
					<div className="form-group">
						<label htmlFor="location">
							📍 Votre localisation <span className="required">*</span>
						</label>
						<input
							type="text"
							id="location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							placeholder="Entrez votre ville ou adresse"
							required
						/>
					</div>

					<fieldset className="form-group">
						<legend>
							Motifs d'opposition
							{selectedReasons.length > 0 && (
								<span style={{ color: "#2d3748", marginLeft: "0.5rem" }}>
									({selectedReasons.length} sélectionné
									{selectedReasons.length > 1 ? "s" : ""})
								</span>
							)}
						</legend>
						<p className="form-helper">
							Sélectionnez toutes les préoccupations qui vous concernent :
						</p>
						<div className="checkbox-group">
							{OPPOSITION_REASONS.map((reason) => (
								<div
									key={reason.id}
									className="checkbox-item"
									onClick={() => handleReasonToggle(reason.id)}
								>
									<input
										type="checkbox"
										id={reason.id}
										checked={selectedReasons.includes(reason.id)}
										onChange={() => handleReasonToggle(reason.id)}
									/>
									<label htmlFor={reason.id}>{reason.label}</label>
								</div>
							))}
						</div>
					</fieldset>

					<button
						type="submit"
						className="submit-button"
						disabled={generateContributionMutation.isPending}
					>
						{generateContributionMutation.isPending
							? "⏳ Envoi en cours..."
							: "✓ Soumettre la contribution"}
					</button>
				</form>
			</main>
		</div>
	);
}

export default App;
