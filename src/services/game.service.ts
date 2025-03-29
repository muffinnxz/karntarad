import { Character } from '@/interfaces/Character';
import admin from "@/lib/firebase-admin";
import { Game } from "@/interfaces/Game";
import { DayType } from '@/interfaces/Post';
import { getCompany } from "@/services/company.service";
import { getScenario } from "./scenario.service";
import path from "path";
import Together from "together-ai";
import fs from "fs";

export const createGame = async (userId: string, companyId: string, scenarioId: string) => {
	const firestore = admin.firestore();
	const gameRef = firestore.collection("games").doc();

	const company = await getCompany(companyId);
	const scenario = await getScenario(scenarioId);

	const generateCharacterFile = path.join(
		process.cwd(),
		"src/prompts/generate-character.txt"
	);

	const characterContent = fs.readFileSync(generateCharacterFile, "utf-8");

	const characterPrompt = characterContent.replace("{companyDescription}", company.description).replace("{scenarioDescription}", scenario.description);

	const together = new Together({
		apiKey: process.env.TOGETHER_API_KEY,
	});
	const llmModel = "deepseek-ai/DeepSeek-V3"
	const responseLLM = await together.chat.completions.create({
		model: llmModel,
		messages: [{ role: "user", content: characterPrompt }],
		response_format: { type: "json_object" },
	});
	const responseContent = responseLLM.choices[0]?.message?.content;

	const characterList: Character[] = JSON.parse(responseContent || "[]");

	const game: Game = {
		id: gameRef.id,
		company: company,
		scenario: scenario,
		userId: userId,
		day: 0,
		result: "In Progress",
		characterList: characterList
	}
	await gameRef.set(game);

	return game;
}

export const getGame = async (gameId: string) => {
	const fs = admin.firestore();
	const gameRef = fs.collection("games").doc(gameId);
	const game = await gameRef.get();
	return game.data() as Game;
}

export const getGamesByUserId = async (userId: string) => {
	const fs = admin.firestore();
	const gamesRef = fs.collection("games").where("userId", "==", userId);
	const games = await gamesRef.get();
	return games.docs.map((doc) => doc.data() as Game);
}

export const deleteGame = async (gameId: string) => {
	const fs = admin.firestore();
	const gameRef = fs.collection("games").doc(gameId);
	const gameSnapshot = await gameRef.get();

	await gameRef.delete();
	return gameSnapshot.data();
};


export const updateGame = async (gameId: string, day: DayType, result: string) => {
	const fs = admin.firestore();
	const gameRef = fs.collection("games").doc(gameId);

	const game = {
		day: day,
		result: result
	}
	await gameRef.update(game);
	return game;
}
