
import admin from "@/lib/firebase-admin";
import { Scenario } from "@/interfaces/Scenario";

export const createScenario = async (userId: string, name: string, description: string, isPublic: boolean) => {
	const fs = admin.firestore();
	const scenarioRef = fs.collection("scenarios").doc()

	const scenario: Scenario = {
		id: scenarioRef.id,
		userId: userId,
		name: name,
		description: description,
		createdAt: new Date(),
		isPublic: isPublic
	};

	await scenarioRef.set(scenario);
	return scenario;
};

export const getScenario = async (scenarioId: string) => {
	const fs = admin.firestore();
	const scenario = await fs.collection("scenarios").doc(scenarioId).get();
	return scenario.data() as Scenario;
};

export const getScenariosByUserId = async (userId: string) => {
	const fs = admin.firestore();
	const scenarios = await fs.collection("scenarios").where("userId", "==", userId).get();
	return scenarios.docs.map((doc) => doc.data() as Scenario);
};

export const deleteScenario = async (scenarioId: string) => {
	const fs = admin.firestore();
	const scenarioRef = fs.collection("scenarios").doc(scenarioId);
	const scenarioSnapshot = await scenarioRef.get();

	await scenarioRef.delete();
	return scenarioSnapshot.data();
};

export const updateScenario = async (scenarioId: string, userId: string, name: string, description: string) => {
	const fs = admin.firestore();
	const scenario = {
		userId: userId,
		name: name,
		description: description
	}
	await fs.collection("scenarios").doc(scenarioId).update(scenario);
	return scenario;
};

export const getTenRandomScenarios = async (userId: string) => {
	const fs = admin.firestore();
	const scenarios = await fs.collection("scenarios").get();
	const filteredScenarios = scenarios.docs.filter((doc) => doc.data().userId !== userId && doc.data().isPublic);
	const randomScenarios = filteredScenarios.sort(() => Math.random() - 0.5).slice(0, 10);
	return randomScenarios.map((doc) => doc.data() as Scenario);
};
