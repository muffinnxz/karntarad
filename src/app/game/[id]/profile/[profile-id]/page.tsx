"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Heart } from "lucide-react";

// Define a Character interface (adjust according to your actual Character.ts)
interface Character {
  name: string;
  username: string;
  image?: string;
  banner?: string;
  description: string;
}

// Define a Post interface (adjust fields as needed)
interface Post {
  id: string;
  gameId: string;
  day: number;
  creator: {
    name: string;
    username: string;
    image?: string;
  };
  text: string;
  image?: string;
  numLikes: number;
  createdAt?: string;
}

// Format text with @ and # highlighting
const formatText = (id: string, text: string) => {
  const words = text.split(" ");
  return words.map((word, index) => {
    if (word.startsWith("@")) {
      return (
        <span key={index}>
          <Link href={`/game/${id}/profile/${word.substring(1)}`} className="text-blue-500 hover:underline">
            {word}
          </Link>{" "}
        </span>
      );
    } else if (word.startsWith("#")) {
      return (
        <span key={index}>
          <Link href={`/hashtag/${word.substring(1)}`} className="text-blue-500 hover:underline">
            {word}
          </Link>{" "}
        </span>
      );
    } else {
      return <span key={index}>{word} </span>;
    }
  });
};

// Format the day number into a label
const formatDay = (day: number) => {
  switch (day) {
    case 0:
      return "Day 0 - Monday";
    case 1:
      return "Day 1 - Tuesday";
    case 2:
      return "Day 2 - Wednesday";
    case 3:
      return "Day 3 - Thursday";
    case 4:
      return "Day 4 - Friday";
    case 5:
      return "Day 5 - Saturday";
    case 6:
      return "Day 6 - Sunday";
    default:
      return `Day ${day} - Invalid day`;
  }
};

// Post item with card layout and avatar
const PostItem = ({ post }: { post: Post }) => {
  const router = useRouter();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.creator) {
      const query = new URLSearchParams({
        name: post.creator.name || "",
        image: post.creator.image || ""
      }).toString();
      router.push(`/game/${post.gameId}/profile/${post.creator.username}?${query}`);
    }
  };

  return (
    <Card className="mb-4 p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 cursor-pointer" onClick={handleProfileClick}>
          <AvatarImage src={post.creator.image || "/placeholder.svg"} alt={post.creator.name} />
          <AvatarFallback>{post.creator.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold hover:underline cursor-pointer" onClick={handleProfileClick}>
              {post.creator.name}
            </span>
            <span className="text-gray-500 ml-2 hover:underline cursor-pointer" onClick={handleProfileClick}>
              @{post.creator.username}
            </span>
            <span className="text-gray-500 mx-2">·</span>
            <span className="text-gray-500">{formatDay(post.day)}</span>
          </div>

          <div className="mt-1 text-gray-800">{formatText(post.gameId, post.text)}</div>

          {post.image && (
            <div className="mt-3 rounded-xl overflow-hidden">
              <Image
                src={post.image}
                alt="Post image"
                width={500}
                height={300}
                className="w-full object-cover rounded-xl"
              />
            </div>
          )}

          <div className="flex mt-3 text-gray-500">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{post.numLikes}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function BotProfilePage({ params }: { params: { id: string; "profile-id": string } }) {
  const searchParams = useSearchParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch game data to get the character list
    axios
      .get(`/game?id=${params.id}`)
      .then((response) => {
        const gameData = response.data[0];
        const foundCharacter = gameData.characterList.find((ch: Character) => ch.username === params["profile-id"]);
        setCharacter(foundCharacter);
      })
      .catch((error) => {
        console.error("Error fetching game data:", error);
      });
  }, [params.id, params["profile-id"]]);

  useEffect(() => {
    // Once we have the character, fetch all posts and filter by the character's username
    if (character) {
      axios
        .get(`/post?gameId=${params.id}`)
        .then((response) => {
          const allPosts: Post[] = response.data;
          const characterPosts = allPosts.filter((post) => post.creator.username === character.username);
          // Sort posts by day in ascending order
          characterPosts.sort((a, b) => a.day - b.day);
          setPosts(characterPosts);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [character, params.id]);

  if (!character || loading) return <p>Loading...</p>;

  // Use a default banner if none is provided
  const bannerImage = character.banner || "/banner/character-banner-temp.png";
  // Use a default avatar image if none is provided
  const avatarImage = character.image || "";

  return (
    <div className="max-w-full">
      {/* Header with back button */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center">
        <Link href={`/game/${params.id}`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">{character.name}</h1>
      </div>

      {/* Banner and Profile Info */}
      <div className="relative max-w-2xl mx-auto">
        <div className="h-48 bg-gray-200">
          <Image
            src={bannerImage}
            alt="Profile banner"
            width={1200}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <div className="relative -mt-16">
              <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden flex items-center justify-center bg-gray-300 text-4xl font-bold">
                {avatarImage ? (
                  <Image src={avatarImage} alt={character.name} width={128} height={128} className="object-cover" />
                ) : (
                  character.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-bold">{character.name}</h2>
            <p className="text-gray-500">@{character.username}</p>
          </div>
          <p className="mt-3 text-gray-700">{character.description}</p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="p-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Posts</h2>
        </div>
        {posts.length > 0 ? posts.map((post) => <PostItem key={post.id} post={post} />) : <p>No posts yet.</p>}
      </div>
    </div>
  );
}
