export interface Scenario {
	id: string;
	userId: string;
	name: string;
	description: string;
	createdAt: Date;
}

export interface ScenarioPostRequest {
	name: string;
	description: string;
}

export interface ScenarioPostResponse {
	scenario: Scenario;
}

export interface ScenarioGetResponse {
	userScenarios: Scenario[];
	communityScenarios: Scenario[];
}
