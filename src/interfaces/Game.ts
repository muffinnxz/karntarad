import { Company } from "./Company";
import { Scenario } from "./Scenario";
import { Character } from "./Character";

export interface Game {
  id: string;
  userId: string;
  company: Company;
  scenario: Scenario;
  characterList: Character[];
  day: number;
  status: "in_progress" | "completed";
  createdAt: Date;
}

export interface GamePostRequest {
  companyId: string;
  scenarioId: string;
}

export interface GamePostResponse {
  game: Game;
}
