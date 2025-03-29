import { Character } from "./Character";
export type DayType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Post {
	id: string;
	gameId: string;
    day: DayType;
    character: Character;
    text: string;
    numLikes: number;
    image?: string;
    banner?: string
    bio?: string
}

