"use client";
import type React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, Heart, User, PlayIcon, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Post } from "@/interfaces/Post";
import { Game } from "@/interfaces/Game";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { BarChart, Bar, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface DailyLikes {
  day: number;
  likes: number;
}

interface StatsBoxProps {
  icon: React.ReactNode;
  title: string;
  dailyLikes?: DailyLikes[];
}

function StatsBox({ icon, title, dailyLikes }: StatsBoxProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h3 className="text-lg font-medium">{title}</h3>
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
  start?: number;
  end: number;
  growth?: number;
  percentage?: boolean;
}

function MetricCard({ icon, title, start, end, growth }: MetricCardProps) {
  if (!start || !growth) {
    return (
      <Card className="w-full h-full">
        <CardContent className="p-6 h-full">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-medium">{title}</h3>
            <div className="text-2xl font-bold ml-auto">{end.toLocaleString()} Likes</div>
          </div>
        </CardContent>
      </Card>
    );
  }
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
          <div className="text-blue-500">{word}</div>{" "}
        </span>
      );
    } else {
      return <span key={index}>{word} </span>;
    }
  });
};

const formatDay = (day: number) => {
  switch (day) {
    case 0:
      return "Day 0 - Sunday";
    case 1:
      return "Day 1 - Monday";
    case 2:
      return "Day 2 - Tuesday";
    case 3:
      return "Day 3 - Wednesday";
    case 4:
      return "Day 4 - Thursday";
    case 5:
      return "Day 5 - Friday";
    case 6:
      return "Day 6 - Saturday";
    case 7:
      return "Day 7 - Sunday";
    default:
      return `Day ${day} - Invalid day`;
  }
};

const PostItem = ({ post }: { post: Post }) => {
  const router = useRouter();

  // Local state to track like status and like count
  const [isLiked, setIsLiked] = useState<boolean>(post.isLikeByUser || false);
  const [likes, setLikes] = useState<number>(post.numLikes);

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

  // Handler for toggling like status
  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    try {
      const response = await axios.post("/post/like", { postId: post.id });
      if (response.status === 200) {
        const data = response.data;
        setIsLiked(data.isLikeByUser);
        setLikes(data.numLikes);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Card className="mb-4 p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10 cursor-pointer profile-link" onClick={handleProfileClick}>
          <AvatarImage src={post.creator.image} alt={post.creator.name} />
          <AvatarFallback>{post.creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold hover:underline cursor-pointer profile-link" onClick={handleProfileClick}>
              {post.creator.name}
            </span>
            <span
              className="text-gray-500 ml-2 hover:underline cursor-pointer profile-link"
              onClick={handleProfileClick}
            >
              @{post.creator.username}
            </span>
            <span className="text-gray-500 mx-2">·</span>
            <span className="text-gray-500">{formatDay(post.day)}</span>
            {post.sentiment && (
              <Badge
                variant="outline"
                className={`ml-2 text-xs px-1.5 py-0 ${
                  post.sentiment === "positive"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : post.sentiment === "neutral"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                    : "bg-red-100 text-red-800 border-red-300"
                }`}
              >
                {post.sentiment}
              </Badge>
            )}
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
            <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={handleLikeToggle}>
              <Heart className={`h-4 w-4 ${isLiked ? "text-red-500" : ""}`} />
              <span>{likes}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
interface SentimentData {
  day: number;
  positive: number;
  neutral: number;
  negative: number;
}

// Add new component for Sentiment Chart
function SentimentBarChart({ data }: { data: SentimentData[] }) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-6 w-6" />
          <h3 className="text-lg font-medium">Community Sentiment Analysis</h3>
          <div className="text-2xl font-bold ml-auto">
            Total of {data.reduce((sum, day) => sum + day.positive + day.neutral + day.negative, 0)} posts
          </div>
        </div>
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 30, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid horizontal={true} vertical={false} stroke="#eee" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(day) => `Day ${day}`}
              />
              <YAxis hide={true} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "8px"
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{
                  paddingBottom: "20px"
                }}
              />
              <Bar dataKey="positive" fill="#22c55e" name="Positive" radius={[4, 4, 0, 0]} /> {/* Green-500 */}
              <Bar dataKey="neutral" fill="#eab308" name="Neutral" radius={[4, 4, 0, 0]} /> {/* Yellow-500 */}
              <Bar dataKey="negative" fill="#ef4444" name="Negative" radius={[4, 4, 0, 0]} /> {/* Red-500 */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GameSummary({ params }: { params: { gameId: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [dailyLikes, setDailyLikes] = useState<DailyLikes[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
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
          const botPosts = posts.filter((post: Post) => post.creator.username !== gameData.company?.username);

          // Calculate daily likes
          const dailyLikes: DailyLikes[] = Array.from({ length: 8 }, (_, i) => ({
            day: i,
            likes: userPosts
              .filter((post: Post) => post.day === i)
              .reduce((acc: number, post: Post) => acc + post.numLikes, 0)
          }));

          // Calculate sentiment data for each day
          const sentimentByDay: SentimentData[] = Array.from({ length: 8 }, (_, day) => {
            const dayPosts = botPosts.filter((post: Post) => post.day === day);
            return {
              day,
              positive: dayPosts.filter((post: Post) => post.sentiment === "positive").length,
              neutral: dayPosts.filter((post: Post) => post.sentiment === "neutral").length,
              negative: dayPosts.filter((post: Post) => post.sentiment === "negative").length
            };
          });

          setTotalLikes(userPosts.reduce((acc: number, post: Post) => acc + post.numLikes, 0));
          setUserPosts(userPosts);
          setDailyLikes(dailyLikes);
          setSentimentData(sentimentByDay);
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
    if (userPosts.length > 0) {
      setFilteredPosts(userPosts.sort((a, b) => b.numLikes - a.numLikes).slice(0, 4));
    }
  }, [userPosts]);

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
                <Building className="h-5 w-5 text-gray-600" />
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
        <div className="grid grid-cols-1 gap-6 items-stretch">
          <MetricCard
            icon={<User className="h-6 w-6" />}
            title="Total Followers"
            start={10000}
            end={gameData.followerCount}
            growth={calculateGrowth(10000, gameData.followerCount)}
            percentage={true}
          />
          <MetricCard icon={<ThumbsUp className="h-6 w-6" />} title="Total Likes" end={totalLikes} />
        </div>

        <StatsBox
          icon={<ThumbsUp className="h-6 w-6" />}
          title="Likes Distribution in User Posts"
          dailyLikes={dailyLikes}
        />
      </div>

      <div className="mb-8">
        <SentimentBarChart data={sentimentData} />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Top Performing Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
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
