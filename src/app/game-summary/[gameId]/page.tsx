"use client";
import type React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, Heart, User, PlayIcon, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Post } from "@/interfaces/Post";
import { Game } from "@/interfaces/Game";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

interface DailyLikes {
  day: number;
  likes: number;
}

interface StatsBoxProps {
  icon: React.ReactNode;
  title: string;
  label: string;
  total: number;
  dailyLikes?: DailyLikes[];
}

function StatsBox({ icon, title, label, total, dailyLikes }: StatsBoxProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="text-2xl font-bold ml-auto">
            {total.toLocaleString()} {label}
          </div>
        </div>
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyLikes} margin={{ top: 30, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid horizontal={true} vertical={false} stroke="#eee" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(day) => `Day ${day}`}
              />
              <YAxis hide={true} />
              <Line
                dataKey="likes"
                type="monotone"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{
                  r: 5,
                  fill: "#8884d8",
                  stroke: "#8884d8"
                }}
                activeDot={{
                  r: 7,
                  fill: "#8884d8",
                  stroke: "#fff",
                  strokeWidth: 2
                }}
              >
                <LabelList
                  dataKey="likes"
                  position="top"
                  offset={10}
                  fill="#666"
                  fontSize={12}
                  formatter={(value: number) => `${value}`}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  start: number;
  end: number;
  growth: number;
  percentage?: boolean;
}

function MetricCard({ icon, title, start, end, growth }: MetricCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          {icon}
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <div className="text-sm text-gray-500">Started with</div>
            <div className="font-semibold text-xl">{start.toLocaleString()}</div>
          </div>
          <div className="flex justify-between items-baseline">
            <div className="text-sm text-gray-500">Ended with</div>
            <div className="font-semibold text-2xl">{end.toLocaleString()}</div>
          </div>
          <div className="pt-4">
            <Progress value={80} className="h-2 mb-2 bg-gray-200" />
            <div className="flex justify-end">
              <div className={`text-sm font-medium ${growth >= 0 ? "text-[#8884d8]" : "text-red-600"}`}>
                {growth >= 0 ? "+" : "-"}
                {growth}% growth
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
        <span key={index} className="text-blue-500">
          {word}
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

const PostItem = ({ post }: { post: Post }) => {
  return (
    <Card className="mb-4 p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.creator.image} alt={post.creator.name} />
          <AvatarFallback>{post.creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold">{post.creator.name}</span>
            <span className="text-gray-500 ml-2">@{post.creator.username}</span>
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
  const [isLoading, setIsLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [dailyLikes, setDailyLikes] = useState<DailyLikes[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch game data
        const gameResponse = await axios(`/game?id=${params.gameId}`);
        const gameData = gameResponse.data[0];
        setGameData(gameData);

        // Fetch posts only if gameData is available
        if (gameData) {
          const postResponse = await axios(`/post?gameId=${gameData.id}`);
          const posts = postResponse.data;

          const userPosts = posts.filter((post: Post) => post.creator.username === gameData.company?.username);

          // Calculate daily likes
          const dailyLikes: DailyLikes[] = Array.from({ length: 7 }, (_, i) => ({
            day: i,
            likes: userPosts
              .filter((post: Post) => post.day === i)
              .reduce((acc: number, post: Post) => acc + post.numLikes, 0)
          }));

          setTotalLikes(userPosts.reduce((acc: number, post: Post) => acc + post.numLikes, 0));
          setPosts(userPosts);
          setDailyLikes(dailyLikes); // Add state for dailyLikes
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && params.gameId) {
      fetchData();
    }
  }, [params.gameId, user]);

  useEffect(() => {
    if (posts.length > 0) {
      setFilteredPosts(posts.sort((a, b) => b.numLikes - a.numLikes).slice(0, 3));
    }
  }, [posts]);

  const calculateGrowth = (start: number, end: number) => {
    return start === 0 ? 100 : Math.round(((end - start) / start) * 100);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center mb-6">
          <Link href="/my-game" className="flex items-center text-gray-600 hover:text-gray-900">
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
          <Link href="/my-game" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>My Games</span>
          </Link>
        </div>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Game Not Found</h2>
          <p className="mb-8">We couldn&apos;t find the game data you&apos;re looking for.</p>
          <Button asChild>
            <Link href="/my-game">Return to My Games</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Link href="/my-game" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>My Games</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div className="w-full space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Game Summary</h1>

          <div className="grid gap-4">
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-500">COMPANY</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{gameData.company.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{gameData.company.description}</p>
            </div>

            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <PlayIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-500">SCENARIO</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{gameData.scenario.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{gameData.scenario.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MetricCard
          icon={<User className="h-6 w-6" />}
          title="Total Followers"
          start={10000}
          end={gameData.followerCount}
          growth={calculateGrowth(10000, gameData.followerCount)}
          percentage={true}
        />
        <StatsBox
          icon={<ThumbsUp className="h-6 w-6" />}
          title="Total Likes"
          label="likes"
          total={totalLikes}
          dailyLikes={dailyLikes}
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Top Performing Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="mr-4">
          <Link href="/my-game">Back to My Games</Link>
        </Button>
      </div>
    </div>
  );
}
