"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Heart } from "lucide-react";
import { Character } from "@/interfaces/Character";
import { Post } from "@/interfaces/Post";
import { useAuth } from "@/contexts/AuthContext";

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

export default function UserProfilePage({ params }: { params: { id: string; "profile-id": string } }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Character | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Extract params to fix exhaustive deps warning
  const gameId = params.id;
  const profileId = params["profile-id"];

  useEffect(() => {
    // Fetch game data which includes both company and characterList
    axios
      .get(`/game?id=${gameId}`)
      .then((response) => {
        const gameData = response.data[0];
        // If the profile-id matches the company's username, use company data
        if (profileId === gameData.company.username) {
          const companyProfile: Character = {
            id: gameData.company.id, // Ensure the 'id' property is included
            name: gameData.company.name,
            username: gameData.company.username,
            image: gameData.company.companyProfileURL,
            description: gameData.company.description
          };
          setProfile(companyProfile);
          // Check if the current user is the company owner
          if (user && user.uid === gameData.company.userId) {
            setIsOwnProfile(true);
          }
        } else {
          // Otherwise, use a character from the characterList
          const foundCharacter = gameData.characterList.find((ch: Character) => ch.username === profileId);
          setProfile(foundCharacter);
          if (user && foundCharacter && user.displayName === foundCharacter.name) {
            setIsOwnProfile(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching game data:", error);
      });
  }, [gameId, profileId, user]);

  useEffect(() => {
    // Once the profile is set, fetch all posts for the game and filter by the profile's username
    if (profile) {
      axios
        .get(`/post?gameId=${gameId}`)
        .then((response) => {
          const allPosts: Post[] = response.data;
          const profilePosts = allPosts.filter((post) => post.creator.username === profile.username);
          // Sort posts by day in ascending order
          profilePosts.sort((a, b) => b.day - a.day);
          setPosts(profilePosts);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [profile, gameId]);

  if (!profile || loading) return <p>Loading...</p>;

  // Use a default banner image (you can update this if the profile has a banner property)
  const bannerImage = "/banner/character-banner-temp.png";
  // Use a default avatar image if none is provided
  const avatarImage = profile.image || "";

  return (
    <div className="max-w-full">
      {/* Header with back button */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center">
        <Link href={`/game/${gameId}`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">{profile.name}</h1>
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
                  <Image src={avatarImage} alt={profile.name} width={128} height={128} className="object-cover" />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              {isOwnProfile && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">You</span>
              )}
            </div>
            <p className="text-gray-500">@{profile.username}</p>
          </div>
          <p className="mt-3 text-gray-700">{profile.description}</p>
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
