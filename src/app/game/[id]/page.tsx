"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, ImageIcon, X, Send, ArrowLeft, ChevronLeft, ChevronRight, Loader, User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Post } from "@/interfaces/Post";
import type { Game } from "@/interfaces/Game";
import type { Character } from "@/interfaces/Character";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axios";

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
              <span
                className={`ml-2 font-bold ${
                  post.sentiment === "positive"
                    ? "text-green-500"
                    : post.sentiment === "neutral"
                    ? "text-[#c6dc3c]"
                    : "text-red-500"
                }`}
              >
                ●
              </span>
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

interface NewPostFormProps {
  onClose?: () => void;
  gameId: string;
  day: number;
  taggableUsers?: Character[];
}

const NewPostForm = ({ onClose, gameId, day, taggableUsers }: NewPostFormProps) => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Use suggestions state as Character[]
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    const words = newText.split(/\s+/);
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith("@")) {
      const query = lastWord.substring(1);
      if (taggableUsers && query.length > 0) {
        const filtered = taggableUsers.filter(
          (user) => user.username && user.username.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user: Character) => {
    const words = text.split(/\s+/);
    words[words.length - 1] = "@" + user.username;
    const newText = words.join(" ") + " ";
    setText(newText);
    setShowSuggestions(false);
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      console.error("Post cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/post", { gameId, day, text, image });
      console.log("Post submitted successfully:", response.data);
      setText("");
      setImage(null);
      if (onClose) onClose();
      window.location.href = `/game/${gameId}`;
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">New Post</h2>
      </div>
      <div className="relative">
        <Textarea
          placeholder="What's happening?"
          value={text}
          onChange={handleTextChange}
          className="min-h-[100px] mb-4"
          disabled={loading}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
            <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-500">Suggestions</p>
            </div>
            {suggestions.map((user) => (
              <div
                key={user.username}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(user)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-gray-100">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-800">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{user.name}</span>
                    <span className="text-sm text-gray-500">@{user.username}</span>
                  </div>
                </div>
              </div>
            ))}
            {suggestions.length > 5 && (
              <div className="sticky bottom-0 bg-gray-50 px-4 py-2 text-center text-xs text-gray-500 border-t">
                {suggestions.length} results found
              </div>
            )}
          </div>
        )}
      </div>
      {image && (
        <div className="relative mb-4">
          <Image
            src={image || "/placeholder.svg"}
            alt="Uploaded image"
            width={256}
            height={256}
            className="rounded-lg"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 left-2 rounded-full p-1 h-8 w-8"
            onClick={() => setImage(null)}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={handleImageUpload} disabled={!!image || loading}>
          <ImageIcon className="h-4 w-4 mr-2" />
          Add Image
        </Button>
        <Button onClick={handleSubmit} disabled={!text.trim() || loading}>
          {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </>
  );
};

export default function GamePage({ params: { id } }: { params: { id: string } }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [game, setGame] = useState<Game | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [dayFilter, setDayFilter] = useState<number | null>(null);
  const [visibleDay, setVisibleDay] = useState<number>(0);

  const filteredPosts = dayFilter !== null ? posts.filter((post) => post.day === dayFilter) : posts;

  console.log("Filtered Posts:", filteredPosts);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    // Sort by day in descending order (newer days first)
    if (b.day !== a.day) {
      return b.day - a.day;
    }
  
    const isACompanyPost = game?.company.username === a.creator.username;
    const isBCompanyPost = game?.company.username === b.creator.username;
  
    // Within the same day, prioritize company posts
    if (isACompanyPost && !isBCompanyPost) return -1;
    if (!isACompanyPost && isBCompanyPost) return 1;
  
    return 0; // Keep default order otherwise
  });
  
  console.log("Sorted Posts:", sortedPosts);

  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setVisibleDay((prev) => (prev > 0 ? prev - 1 : 0));
    } else {
      setVisibleDay((prev) => (prev < (game?.day ?? 6) ? prev + 1 : (game?.day ?? 6)));
    }
  };

  useEffect(() => {
    if (!id || !user) return;
    const fetchGameAndPosts = async () => {
      try {
        const gameResponse = await axios.get(`/game?id=${id}`);
        console.log("Game Response:", JSON.stringify(gameResponse.data, null, 2));
        if (gameResponse.status !== 200) {
          throw new Error("Failed to fetch game details");
        }
        setGame(gameResponse.data[0]);
        const postsResponse = await axios.get(`/post?gameId=${id}`);
        if (postsResponse.status !== 200) {
          throw new Error("Failed to fetch posts");
        }
        setPosts(postsResponse.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchGameAndPosts();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <Loader className="h-10 w-10 animate-spin text-blue-500" />
          <p className="mt-3 text-gray-500 text-lg font-medium">Loading game data...</p>
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-full">
      <div className="flex items-center sticky top-0 bg-white z-10 p-4 border-b">
        <Link href={`/my-game`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">{`Company: ${game?.company.name}`}</h1>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-600">{`Scenario: ${game?.scenario.name}`}</span>
              <span className="text-gray-500 mx-2">·</span>
              <span className="text-gray-500">{formatDay(game?.day ?? 0)}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
          <User className="h-5 w-5" />
          <span className="text-gray-700 font-medium">{game?.followerCount?.toLocaleString() ?? 0}</span>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="max-w-xl mx-auto">
          {game?.status === "in_progress" && (
            <div className="p-4 border-b bg-white">
              <NewPostForm gameId={id} day={game?.day ?? 0} taggableUsers={game?.characterList} />
            </div>
          )}
          <div className="p-4">
            {sortedPosts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="fixed bottom-4 left-4">
        <div className="flex items-center gap-2">
            <Button
                variant={dayFilter === null ? "default" : "outline"}
                onClick={() => setDayFilter(null)}
                className="min-w-[60px]"
                >
                All
            </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("prev")} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
            <Button
              variant={dayFilter === visibleDay ? "default" : "outline"}
              onClick={() => setDayFilter(visibleDay)}
              className="min-w-[40px] whitespace-nowrap"
            >
              {visibleDay}
            </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("next")} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {game?.status === "in_progress" ? (
        <div className="fixed bottom-4 right-4">
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowModal(true)}>New Post</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <NewPostForm
                onClose={() => setShowModal(false)}
                gameId={id}
                day={game?.day ?? 0}
                taggableUsers={game?.characterList}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="fixed bottom-4 right-4">
          <Link href={`/game-summary/${id}`}>
            <Button>View Game Summary</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
