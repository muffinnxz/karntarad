
import { Company } from './Company';
import { Scenario } from './Scenario';
import { DayType } from './Post';
export interface Game {
	id: string;
	company: Company;
	scenario: Scenario;
	userId: string;
	day: DayType;
	result: string;
}

export interface GamePostRequest {
	companyId: string;
	scenarioId: string;
}

export interface GamePostResponse {
	game: Game;
}


