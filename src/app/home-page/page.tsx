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
import {Post} from "@/interfaces/Post"


// Sample data for posts
const samplePosts: Post[] = [
  {
    id: "1",
    gameId: "1",
    character: {
      id: "1",
      name: "John Doe",
      handle: "johndoe",
      image: "/placeholder.svg?height=40&width=40",
    },
    day: 0,
    text: "Just launched my new website! Check it out at example.com #webdev #launch",
    image: "/placeholder.svg?height=300&width=500",
    numLikes: 42,
    numComments: 7,
    numRetweets: 12,
  },
  {
    id: "2",
    gameId: "1",
    character: {
      id: "2",
      name: "Jane Smith",
      handle: "janesmith",
      image: "/placeholder.svg?height=40&width=40",
    },
    day: 1,
    text: "Had a great meeting with @johndoe today about the upcoming project. Excited to get started!",
    numLikes: 18,
    numComments: 3,
    numRetweets: 2,
  },
  {
    id: "3",
    gameId: "1",
    character: {
      id: "3",
      name: "Tech News",
      handle: "technews",
      image: "/placeholder.svg?height=40&width=40",
    },
    day: 1,
    text:
      "Breaking: New AI model released that can generate code from natural language descriptions. #AI #coding #technology",
    image: "/placeholder.svg?height=300&width=500",
    numLikes: 128,
    numComments: 32,
    numRetweets: 64,
  },
  {
    id: "4",
    gameId: "1",
    character: {
      id: "4",
      name: "Travel Enthusiast",
      handle: "travelbug",
      image: "/placeholder.svg?height=40&width=40",
    },
    day: 2,
    text: "Just booked my trip to Japan! Any recommendations @japantravel? #travel #japan #vacation",
    numLikes: 76,
    numComments: 24,
    numRetweets: 8,
  },
]

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
            router.push(`/profile/${post.character.handle}/post/${post.id}`);
        }
    };

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent post click event
        router.push(`/profile/${post.character.name}`);
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
                    <AvatarImage src={post.character.image} alt={post.character.name} />
                    <AvatarFallback>{post.character.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div className="flex items-center">
                        {/* Name Clickable */}
                        <span 
                            className="font-semibold hover:underline cursor-pointer profile-link" 
                            onClick={handleProfileClick}
                        >
                            {post.character.name}
                        </span>

                        {/* Handle Clickable */}
                        <span 
                            className="text-gray-500 ml-2 hover:underline cursor-pointer profile-link" 
                            onClick={handleProfileClick}
                        >
                            @{post.character.handle}
                        </span>

                        <span className="text-gray-500 mx-2">·</span>
                        <span className="text-gray-500">{post.day}</span>
                    </div>

                    <div className="mt-1 text-gray-800">{formatText(post.text)}</div>

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
                            <span>{post.numComments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Repeat2 className="h-4 w-4" />
                            <span>{post.numRetweets}</span>
                        </Button>
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

interface NewPostFormProps {
    onClose?: () => void;
}
  
const NewPostForm = ({ onClose }: NewPostFormProps) => {
const [text, setText] = useState<string>("");
const [image, setImage] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement | null>(null);

const handleSubmit = () => {
    console.log("Submitting post:", { text, image });
    setText("");
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
    <>
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
        value={text}
        onChange={(e) => setText(e.target.value)}
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

        <Button onClick={handleSubmit} disabled={!text.trim()}>
        <Send className="h-4 w-4 mr-2" />
        Post
        </Button>
    </div>
    </>
);
};


export default function TwitterFeed() {
const [showModal, setShowModal] = useState<boolean>(false);

return (
    <div className="max-w-xl mx-auto">
    <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <h1 className="text-xl font-bold">Home</h1>
    </div>
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="p-4 border-b bg-white">
          <NewPostForm />
      </div>
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

