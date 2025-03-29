"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Repeat2, ArrowLeft, Send } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Define TypeScript interfaces
interface User {
  id: string
  name: string
  handle: string
  avatar: string
}

interface Comment {
  id: string
  user: User
  content: string
  date: Date
  likes: number
}

interface Post {
  id: string
  user: User
  date: Date
  content: string
  image: string | null
  likes: number
  comments: number
  retweets: number
  commentsList: Comment[]
}

// Sample user data
const currentUser: User = {
  id: "current-user",
  name: "Current User",
  handle: "currentuser",
  avatar: "/placeholder.svg?height=40&width=40",
}

// Sample post data
const samplePost: Post = {
  id: "post-1",
  user: {
    id: "user-1",
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
  commentsList: [
    {
      id: "comment-1",
      user: {
        id: "user-2",
        name: "Jane Smith",
        handle: "janesmith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "This looks amazing! Great job on the design. #inspired",
      date: new Date("2023-06-05T13:15:00"),
      likes: 5,
    },
    {
      id: "comment-2",
      user: {
        id: "user-3",
        name: "Tech Enthusiast",
        handle: "techlover",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "I love the user interface! What technologies did you use to build it @johndoe?",
      date: new Date("2023-06-05T14:22:00"),
      likes: 3,
    },
    {
      id: "comment-3",
      user: {
        id: "user-4",
        name: "Web Developer",
        handle: "webdev",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "The responsive design is on point. Would love to know more about your approach to mobile-first design.",
      date: new Date("2023-06-05T15:45:00"),
      likes: 7,
    },
    {
      id: "comment-4",
      user: {
        id: "user-5",
        name: "Design Guru",
        handle: "designguru",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Those animations are smooth! Did you use any specific library for that? #UXdesign",
      date: new Date("2023-06-05T16:30:00"),
      likes: 4,
    },
    {
      id: "comment-5",
      user: {
        id: "user-6",
        name: "Startup Founder",
        handle: "startupfounder",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "This is exactly what I've been looking for! Would you be interested in collaborating on a project @johndoe?",
      date: new Date("2023-06-05T17:10:00"),
      likes: 6,
    },
  ],
}

// Function to format date to day of week
const formatDate = (date: Date): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
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
          <Link href={`/user/${word.substring(1)}`} className="text-blue-500 hover:underline">
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

// Comment component
const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="py-4 border-b">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <Link href={`/user/${comment.user.handle}`} className="font-semibold hover:underline">
              {comment.user.name}
            </Link>
            <Link href={`/user/${comment.user.handle}`} className="text-gray-500 ml-2 hover:underline">
              @{comment.user.handle}
            </Link>
            <span className="text-gray-500 mx-2">·</span>
            <span className="text-gray-500">{formatDate(comment.date)}</span>
          </div>

          <div className="mt-1 text-gray-800">{formatText(comment.content)}</div>

          <div className="flex mt-2 text-gray-500">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{comment.likes}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Comment form component
const CommentForm = ({ onSubmit }: { onSubmit: (content: string) => void }) => {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content)
      setContent("")
    }
  }

  return (
    <div className="flex items-start space-x-3 py-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] mb-2"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!content.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>
      </div>
    </div>
  )
}

// Main post page component
export default function PostPage() {
  const [post, setPost] = useState<Post>(samplePost)

  // Function to add a new comment
  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: `comment-${post.commentsList.length + 1}`,
      user: currentUser,
      content,
      date: new Date(),
      likes: 0,
    }

    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments + 1,
      commentsList: [newComment, ...prevPost.commentsList],
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4">
          {/* Main post */}
          <div className="mb-4">
            <div className="flex items-start space-x-3">
              <Link href={`/user/${post.user.handle}`}>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="flex flex-col">
                  <Link href={`/user/${post.user.handle}`} className="font-semibold hover:underline">
                    {post.user.name}
                  </Link>
                  <Link href={`/user/${post.user.handle}`} className="text-gray-500 hover:underline">
                    @{post.user.handle}
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-3 text-xl">{formatText(post.content)}</div>

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

            <div className="mt-3 text-gray-500">
              <span>{formatDate(post.date)}</span>
            </div>

            <div className="flex justify-between mt-3 py-3 border-y">
              <div className="flex items-center">
                <span className="font-semibold">{post.comments}</span>
                <span className="text-gray-500 ml-1">Comments</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{post.retweets}</span>
                <span className="text-gray-500 ml-1">Reposts</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{post.likes}</span>
                <span className="text-gray-500 ml-1">Likes</span>
              </div>
            </div>

            <div className="flex justify-around py-2 border-b">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <MessageCircle className="h-5 w-5" />
                <span>Comment</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Repeat2 className="h-5 w-5" />
                <span>Repost</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Heart className="h-5 w-5" />
                <span>Like</span>
              </Button>
            </div>
          </div>

          {/* Comment form */}
          <CommentForm onSubmit={handleAddComment} />

          <Separator className="my-2" />

          {/* Comments section */}
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Comments</h2>
            {post.commentsList.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

