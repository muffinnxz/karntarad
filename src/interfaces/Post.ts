export interface PostCreator {
  name: string;
  username: string;
  image?: string;
}

export interface Post {
  id: string;
  gameId: string;
  day: number;
  creator: PostCreator;
  text: string;
  numLikes: number;
  image?: string;
  sentiment?: string;
}
