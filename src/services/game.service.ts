import admin from "@/lib/firebase-admin";
import { Game } from "@/interfaces/Game";
import { DayType } from '@/interfaces/Post';
import { getCompany } from "@/services/company.service";
import { getScenario } from "./scenario.service";
import { Character } from "@/interfaces/Character";

export const createGame = async (userId: string, companyId: string, scenarioId: string, characterList: Character[]) => {
	const fs = admin.firestore();
	const gameRef = fs.collection("games").doc();

	const company = await getCompany(companyId);
	const scenario = await getScenario(scenarioId);
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
