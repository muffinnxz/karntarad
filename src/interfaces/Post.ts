import { Character } from "./Character";
import { User } from "./User";
export type DayType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Post {
	id: string;
	gameId: string;
    day: DayType;
    user?: User;        // post from the real user
    character?: Character; // post from AI character
    text: string;
    numLikes: number;
    image?: string;
    banner?: string
    bio?: string
}

