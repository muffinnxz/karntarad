import { Character } from "./Character";
import { User } from "./User";
export interface Post {
  id: string;
  gameId: string;
  day: number;
  user?: User; // post from the real user
  character?: Character; // post from AI character
  text: string;
  numLikes: number;
  image?: string;
}
