"use client"

import { useRouter } from "next/navigation";
import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Repeat2, ImageIcon, X, Send } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Define TypeScript interfaces
interface User {
  id: number;
  name: string
  handle: string
  avatar: string
}

interface Post {
  id: number
  user: User
  date: Date
  content: string
  image: string | null
  likes: number
  comments: number
  retweets: number
}

// Sample data for posts
const samplePosts: Post[] = [
  {
    id: 1,
    user: {
      id: 1,
      name: "John Doe",
      handle: "johndoe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: new Date("2023-06-05T12:30:00"),
    content: "Just launched my new website! Check it out at example.com #webdev #launch",
    image: "/placeholder.svg?height=300&width=500",
    likes: 42,
    comments: 7,
    retweets: 12,
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Jane Smith",
      handle: "janesmith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: new Date("2023-06-04T09:15:00"),
    content: "Had a great meeting with @johndoe today about the upcoming project. Excited to get started!",
    image: null,
    likes: 18,
    comments: 3,
    retweets: 2,
  },
  {
    id: 3,
    user: {
      id: 3,
      name: "Tech News",
      handle: "technews",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: new Date("2023-06-03T16:45:00"),
    content:
      "Breaking: New AI model released that can generate code from natural language descriptions. #AI #coding #technology",
    image: "/placeholder.svg?height=300&width=500",
    likes: 128,
    comments: 32,
    retweets: 64,
  },
  {
    id: 4,
    user: {
      id: 4,
      name: "Travel Enthusiast",
      handle: "travelbug",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: new Date("2023-06-02T11:20:00"),
    content: "Just booked my trip to Japan! Any recommendations @japantravel? #travel #japan #vacation",
    image: null,
    likes: 76,
    comments: 24,
    retweets: 8,
  },
]

// Function to format date to day of week
const formatDate = (date: Date): string => {
  const days = ["day 0 - Monday", "day 1 - Tuesday", "day 2 - Wednesday", "day 3 - Thursday", "day 4 - Friday", "day 5 - Saturday", "day 6 - Sunday"]
  return days[date.getDay()]
}

// Function to format text with @ and # highlighting
const formatText = (text: string) => {
  // Split the text by spaces to process each word
  const words = text.split(" ")

  return words.map((word, index) => {
    if (word.startsWith("@")) {
      // Handle mentions
      return (
        <span key={index}>
          <Link href={`/profile/${word.substring(1)}`} className="text-blue-500 hover:underline">
            {word}
          </Link>{" "}
        </span>
      )
    } else if (word.startsWith("#")) {
      // Handle hashtags
      return (
        <span key={index}>
          <Link href={`/hashtag/${word.substring(1)}`} className="text-blue-500 hover:underline">
            {word}
          </Link>{" "}
        </span>
      )
    } else {
      // Regular text
      return <span key={index}>{word} </span>
    }
  })
}

// Post component
const PostItem = ({ post }: { post: Post }) => {
    const router = useRouter();
    
    const handlePostClick = (e: React.MouseEvent) => {
        if (!(e.target as HTMLElement).closest("button, .profile-link")) {
            router.push(`/profile/${post.user.handle}/post/${post.id}`);
        }
    };

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent post click event
        router.push(`/profile/${post.user.name}`);
    };

    return (
        <Card 
            className="mb-4 p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer" 
            onClick={handlePostClick}
        >
            <div className="flex items-start space-x-3">
                {/* Avatar Clickable */}
                <Avatar 
                    className="h-10 w-10 cursor-pointer profile-link" 
                    onClick={handleProfileClick}
                >
                    <AvatarImage src={post.user.avatar} alt={post.user.name} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div className="flex items-center">
                        {/* Name Clickable */}
                        <span 
                            className="font-semibold hover:underline cursor-pointer profile-link" 
                            onClick={handleProfileClick}
                        >
                            {post.user.name}
                        </span>

                        {/* Handle Clickable */}
                        <span 
                            className="text-gray-500 ml-2 hover:underline cursor-pointer profile-link" 
                            onClick={handleProfileClick}
                        >
                            @{post.user.handle}
                        </span>

                        <span className="text-gray-500 mx-2">·</span>
                        <span className="text-gray-500">{formatDate(post.date)}</span>
                    </div>

                    <div className="mt-1 text-gray-800">{formatText(post.content)}</div>

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
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Repeat2 className="h-4 w-4" />
                            <span>{post.retweets}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

interface NewPostFormProps {
    onClose?: () => void;
}
  
const NewPostForm = ({ onClose }: NewPostFormProps) => {
const [content, setContent] = useState<string>("");
const [image, setImage] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement | null>(null);

const handleSubmit = () => {
    console.log("Submitting post:", { content, image });
    setContent("");
    setImage(null);
    if (onClose) onClose();
};

const handleImageUpload = () => {
    fileInputRef.current?.click(); // Open file picker
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
        setImage(reader.result as string); // Set base64 image preview
    };
    reader.readAsDataURL(file);
    }
};

return (
    <div className="p-4 border rounded-lg bg-white w-full max-w-lg">
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">New Post</h2>
        {onClose && (
        <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
        </Button>
        )}
    </div>

    <Textarea
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] mb-4"
    />

    {image && (
        <div className="relative mb-4">
        <Image src={image} alt="Uploaded image" width={500} height={300} className="w-full rounded-lg" />
        <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 rounded-full p-1 h-8 w-8"
            onClick={() => setImage(null)}
        >
            <X className="h-4 w-4" />
        </Button>
        </div>
    )}

    {/* Hidden file input */}
    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

    <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={handleImageUpload} disabled={!!image}>
        <ImageIcon className="h-4 w-4 mr-2" />
        Add Image
        </Button>

        <Button onClick={handleSubmit} disabled={!content.trim()}>
        <Send className="h-4 w-4 mr-2" />
        Post
        </Button>
    </div>
    </div>
);
};


export default function TwitterFeed() {
const [showModal, setShowModal] = useState<boolean>(false);

return (
    <div className="max-w-xl mx-auto">
    <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <h1 className="text-xl font-bold">Home</h1>
    </div>

    <div className="p-4 border-b bg-white">
        <NewPostForm />
    </div>

    <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-4">
        {samplePosts.map((post) => (
            <PostItem key={post.id} post={post} />
        ))}
        </div>
    </ScrollArea>

    <div className="fixed bottom-4 right-4">
        <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
            <Button onClick={() => setShowModal(true)}>New Post</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
            <NewPostForm onClose={() => setShowModal(false)} />
        </DialogContent>
        </Dialog>
    </div>
    </div>
);
}

