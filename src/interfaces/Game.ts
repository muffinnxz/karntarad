
import { Company } from './Company';
import { Scenario } from './Scenario';

export interface Game {
	id: string;
	company: Company;
	scenario: Scenario;
	userId: string;
	days: number;
	result: string;
}
