"use client";

import type React from "react";
import Image from "next/image";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, ThumbsUp, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Post } from "@/interfaces/Post";

interface GameStats {
  gameId: string;
  brandName: string;
  duration: string;
  posts: Post[];
}

// Function to format text with @ and # highlighting
const formatText = (id: string, text: string) => {
  // Split the text by spaces to process each word
  const words = text.split(" ");

  return words.map((word, index) => {
    if (word.startsWith("@")) {
      // Handle mentions
      return (
        <span key={index}>
          <Link href={`/game/${id}/profile/${word.substring(1)}`} className="text-blue-500 hover:underline">
            {word}
          </Link>{" "}
        </span>
      );
    } else if (word.startsWith("#")) {
      // Handle hashtags
      return (
        <span key={index}>
          <Link href={`/hashtag/${word.substring(1)}`} className="text-blue-500 hover:underline">
            {word}
          </Link>{" "}
        </span>
      );
    } else {
      // Regular text
      return <span key={index}>{word} </span>;
    }
  });
};

const formatDay = (day: number) => {
  switch (day) {
    case 0:
      return "day 0 - Monday";
    case 1:
      return "day 1 - Tuesday";
    case 2:
      return "day 2 - Wednesday";
    case 3:
      return "day 3 - Thursday";
    case 4:
      return "day 4 - Friday";
    case 5:
      return "day 5 - Saturday";
    case 6:
      return "day 6 - Sunday";
    default:
      return `day ${day} - Invalid day`;
  }
};

const PostItem = ({ post }: { post: Post }) => {
  return (
    <Card className="mb-4 p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.character?.image} alt={post.character?.name} />
          <AvatarFallback>{post.character?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold">{post.character?.name}</span>
            <span className="text-gray-500 ml-2">@{post.character?.username}</span>
            <span className="text-gray-500 mx-2">·</span>
            <span className="text-gray-500">{formatDay(post.day)}</span>
          </div>

          <div className="mt-1 text-gray-800">{formatText(post.gameId, post.text)}</div>

          {post.image && (
            <div className="mt-3 rounded-xl overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg"}
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

export default function GameSummary({ params }: { params: { gameId: string } }) {
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState<GameStats | null>(null);
  const [totalLikes, setTotalLikes] = useState(0);
  //   const [posts, setPosts] = useState<Post[]>([]);
  //   const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockData: GameStats = {
          gameId: params.gameId,
          brandName: "EcoFriendly",
          duration: "7 days",
          posts: [
            {
              id: "post1",
              gameId: params.gameId,
              text: "Introducing our new sustainable product line! #EcoFriendly",
              image: "/placeholder.svg?height=300&width=300",
              numLikes: 245,
              day: 1
            },
            {
              id: "post2",
              gameId: params.gameId,
              text: "Introducing our new sustainable product line! #EcoFriendly",
              image: "/placeholder.svg?height=300&width=300",
              numLikes: 245,
              day: 1
            },
            {
              id: "post3",
              gameId: params.gameId,
              text: "Introducing our new sustainable product line! #EcoFriendly",
              image: "/placeholder.svg?height=300&width=300",
              numLikes: 245,
              day: 1
            }
          ]
        };
        setTotalLikes(mockData.posts.reduce((acc, post) => acc + post.numLikes, 0));

        setGameData(mockData);
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [params.gameId]);

  //   useEffect(() => {
  //     const fetchPosts = async () => {
  //       try {
  //         const response = await fetch(`/api/posts?gameId=${params.gameId}`);
  //         const data = await response.json();
  //         setPosts(data);
  //       } catch (error) {
  //         console.error("Error fetching posts:", error);
  //       }
  //     };

  //     fetchPosts();
  //   }, [params.gameId]);

  //   useEffect(() => {
  //     if (posts.length > 0) {
  //       setFilteredPosts(posts.sort((a, b) => b.numLikes - a.numLikes).slice(0, 3));
  //     }
  //   }, [posts]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center mb-6">
          <Link href="/my-games" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>My Games</span>
          </Link>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg">Loading game summary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center mb-6">
          <Link href="/my-games" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>My Games</span>
          </Link>
        </div>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Game Not Found</h2>
          <p className="mb-8">We couldn&apos;t find the game data you&apos;re looking for.</p>
          <Button asChild>
            <Link href="/my-games">Return to My Games</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Link href="/my-games" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>My Games</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Game Summary</h1>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Share Results
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-8">
        {/* <MetricCard
          icon={<Users className="h-6 w-6" />}
          title="Followers"
          start={gameData.metrics.followers.start}
          end={gameData.metrics.followers.end}
          growth={followerGrowth}
        /> */}
        <StatsBox icon={<ThumbsUp className="h-6 w-6" />} title="Total Likes" total={totalLikes} />
      </div>
      <h2 className="text-2xl font-semibold mb-4">Top Performing Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {gameData.posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="mr-4">
          <Link href="/my-games">Back to My Games</Link>
        </Button>
        <Button asChild>
          <Link href="/game/new">Start New Game</Link>
        </Button>
      </div>
    </div>
  );
}

interface StatsBoxProps {
  icon: React.ReactNode;
  title: string;
  total: number;
}

export function StatsBox({ icon, title, total }: StatsBoxProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="text-2xl font-bold">{total.toLocaleString()} Likes</div>
      </CardContent>
    </Card>
  );
}
