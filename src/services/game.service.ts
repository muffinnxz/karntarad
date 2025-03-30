import { Character } from "@/interfaces/Character";
import admin from "@/lib/firebase-admin";
import { Game } from "@/interfaces/Game";
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

  console.log(company, scenario);

  const generateDay0File = path.join(process.cwd(), "src/prompts/generate-day-0.txt");
  const day0Content = fs.readFileSync(generateDay0File, "utf-8");

  const day0Prompt = day0Content
    .replace("{{company}}", JSON.stringify(company, null, 2))
    .replace("{{scenario}}", JSON.stringify(scenario, null, 2));

  const together = new Together({
    apiKey: process.env.TOGETHER_API_KEY
  });
  const llmModel = "deepseek-ai/DeepSeek-V3";
  const responseLLM = await together.chat.completions.create({
    model: llmModel,
    messages: [{ role: "system", content: day0Prompt }]
  });
  const responseContent = responseLLM.choices[0]?.message?.content;

  // Parse the response content to extract characters and posts
  let characterList: Character[] = [];
  let postsList: { username: string; content: string; likes: number; sentiment: string }[] = [];

  if (responseContent) {
    // Extract characters from XML-like tags
    const charactersMatch = responseContent.match(/<characters>([\s\S]*?)<\/characters>/);
    if (charactersMatch && charactersMatch[1]) {
      try {
        characterList = JSON.parse(charactersMatch[1]);
      } catch (e) {
        console.error("Failed to parse characters:", e);
        characterList = [];
      }
    }

    // Extract posts from XML-like tags
    const postsMatch = responseContent.match(/<posts>([\s\S]*?)<\/posts>/);
    if (postsMatch && postsMatch[1]) {
      try {
        postsList = JSON.parse(postsMatch[1]);
      } catch (e) {
        console.error("Failed to parse posts:", e);
        postsList = [];
      }
    }
  }

  const createPost = async (v: { username: string; content: string; likes: number; sentiment: string }) => {
    const postRef = firestore.collection("posts").doc();

    await postRef.set({
      id: postRef.id,
      gameId: gameRef.id,
      day: 0,
      creator: {
        name: characterList.find((char) => char.username === v.username)?.name || "Unknown",
        username: v.username
      },
      text: v.content,
      numLikes: v.likes || 0,
      sentiment: v.sentiment || "neutral"
    });
  };

  await Promise.all(postsList.map(createPost));

  // Create the game object
  const game: Game = {
    id: gameRef.id,
    userId,
    company,
    scenario,
    characterList,
    day: 0,
    followerCount: 10000,
    status: "in_progress",
    createdAt: new Date()
  };

  console.log("Game:", game);

  console.log("Posts:", postsList);

  // Save the game to Firestore
  await gameRef.set(game);
  return game;
};

export const getGame = async (gameId: string) => {
  const fs = admin.firestore();
  const gameRef = fs.collection("games").doc(gameId);
  const game = await gameRef.get();
  return game.data() as Game;
};

export const getGamesByUserId = async (userId: string) => {
  const fs = admin.firestore();
  const gamesRef = fs.collection("games").where("userId", "==", userId);
  const games = await gamesRef.get();
  return games.docs.map((doc) => doc.data() as Game);
};

export const getGameById = async (id: string) => {
  const fs = admin.firestore();
  const gamesRef = fs.collection("games").where("id", "==", id);
  const games = await gamesRef.get();
  return games.docs.map((doc) => doc.data() as Game);
};

export const deleteGame = async (gameId: string) => {
  const fs = admin.firestore();
  const gameRef = fs.collection("games").doc(gameId);
  const gameSnapshot = await gameRef.get();

  await gameRef.delete();
  return gameSnapshot.data();
};

export const updateGame = async (gameId: string, day: number, status: string, followerCount: number) => {
  const fs = admin.firestore();
  const gameRef = fs.collection("games").doc(gameId);

  const game = {
    day,
    status,
    followerCount
  };
  await gameRef.update(game);
  return game;
};
