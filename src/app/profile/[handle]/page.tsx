import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Repeat2, Calendar, MapPin, LinkIcon, ArrowLeft } from "lucide-react"

// Define TypeScript interfaces
interface User {
  name: string
  handle: string
  avatar: string
  banner: string
  bio: string
  location: string
  website: string
  joinDate: Date
  following: number
  followers: number
}

interface Bot {
  id: string
  name: string
  description: string
  purpose: string
  capabilities: string[]
  creationDate: Date
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

// Sample user data
const userData: User = {
  name: "BotCreator",
  handle: "botcreator",
  avatar: "/placeholder.svg?height=120&width=120",
  banner: "/placeholder.svg?height=300&width=1200",
  bio: "Building AI bots for various use cases. Passionate about automation and AI.",
  location: "San Francisco, CA",
  website: "botcreator.dev",
  joinDate: new Date("2020-01-15"),
  following: 245,
  followers: 1892,
}

// Sample bot data
const botData: Bot[] = [
  {
    id: "weather-bot",
    name: "WeatherBot",
    description: "Provides real-time weather updates and forecasts",
    purpose: "To help users get weather information without leaving the platform",
    capabilities: [
      "Real-time weather updates",
      "5-day forecasts",
      "Weather alerts",
      "Location-based weather information",
    ],
    creationDate: new Date("2021-03-10"),
  },
  {
    id: "news-bot",
    name: "NewsBot",
    description: "Delivers personalized news updates",
    purpose: "To keep users informed about topics they care about",
    capabilities: [
      "Personalized news feed",
      "Breaking news alerts",
      "Topic-based filtering",
      "Source credibility rating",
    ],
    creationDate: new Date("2021-06-22"),
  },
  {
    id: "reminder-bot",
    name: "ReminderBot",
    description: "Helps users set and manage reminders",
    purpose: "To improve productivity and time management",
    capabilities: [
      "Set reminders with natural language",
      "Recurring reminders",
      "Priority-based notifications",
      "Integration with calendar apps",
    ],
    creationDate: new Date("2022-01-05"),
  },
]

// Sample engagement history (mentions)
const engagementHistory: Post[] = [
  {
    id: 1,
    user: {
      name: "Tech Enthusiast",
      handle: "techlover",
      avatar: "/placeholder.svg?height=40&width=40",
      banner: "",
      bio: "",
      location: "",
      website: "",
      joinDate: new Date(),
      following: 0,
      followers: 0,
    },
    date: new Date("2023-06-05T12:30:00"),
    content: "Just tried @botcreator's WeatherBot and it's amazing! The forecast was spot on. #AI #bots",
    image: null,
    likes: 42,
    comments: 7,
    retweets: 12,
  },
  {
    id: 2,
    user: {
      name: "News Junkie",
      handle: "newsjunkie",
      avatar: "/placeholder.svg?height=40&width=40",
      banner: "",
      bio: "",
      location: "",
      website: "",
      joinDate: new Date(),
      following: 0,
      followers: 0,
    },
    date: new Date("2023-06-04T09:15:00"),
    content: "Hey @botcreator, your NewsBot has completely changed how I consume news. Any plans to add more sources?",
    image: null,
    likes: 18,
    comments: 3,
    retweets: 2,
  },
  {
    id: 3,
    user: {
      name: "Productivity Guru",
      handle: "productivityguru",
      avatar: "/placeholder.svg?height=40&width=40",
      banner: "",
      bio: "",
      location: "",
      website: "",
      joinDate: new Date(),
      following: 0,
      followers: 0,
    },
    date: new Date("2023-06-03T16:45:00"),
    content:
      "The ReminderBot by @botcreator has helped me stay on top of my tasks. Highly recommend it for anyone struggling with time management! #productivity",
    image: "/placeholder.svg?height=300&width=500",
    likes: 128,
    comments: 32,
    retweets: 64,
  },
  {
    id: 4,
    user: {
      name: "AI Researcher",
      handle: "airesearcher",
      avatar: "/placeholder.svg?height=40&width=40",
      banner: "",
      bio: "",
      location: "",
      website: "",
      joinDate: new Date(),
      following: 0,
      followers: 0,
    },
    date: new Date("2023-06-02T11:20:00"),
    content:
      "Interesting approach to conversational AI by @botcreator. Would love to discuss your methodology sometime. #AI #MachineLearning",
    image: null,
    likes: 76,
    comments: 24,
    retweets: 8,
  },
]

// Function to format date to day of week
const formatDate = (date: Date): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[date.getDay()]
}

// Function to format date for profile (Month Year)
const formatProfileDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
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

// Post component
const PostItem = ({ post }: { post: Post }) => {
  return (
    <Card className="mb-4 p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold">{post.user.name}</span>
            <span className="text-gray-500 ml-2">@{post.user.handle}</span>
            <span className="text-gray-500 mx-2">·</span>
            <span className="text-gray-500">{formatDate(post.date)}</span>
          </div>

          <div className="mt-1 text-gray-800">{formatText(post.content)}</div>

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
  )
}

// Bot Card component
const BotCard = ({ bot }: { bot: Bot }) => {
  return (
    <Card className="mb-4 p-4">
      <h3 className="text-lg font-bold">{bot.name}</h3>
      <p className="text-gray-600 mt-1">{bot.description}</p>

      <div className="mt-3">
        <h4 className="font-semibold">Purpose:</h4>
        <p className="text-gray-700">{bot.purpose}</p>
      </div>

      <div className="mt-3">
        <h4 className="font-semibold">Capabilities:</h4>
        <ul className="list-disc pl-5 mt-1">
          {bot.capabilities.map((capability, index) => (
            <li key={index} className="text-gray-700">
              {capability}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 text-gray-500 text-sm">Created: {formatProfileDate(bot.creationDate)}</div>
    </Card>
  )
}

// Main component
export default function UserProfile() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      {/* Banner and profile info */}
      <div className="relative">
        <div className="h-48 bg-gray-200">
          <Image
            src={userData.banner || "/placeholder.svg"}
            alt="Profile banner"
            width={1200}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex justify-between">
            <div className="relative -mt-16">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <Button className="mt-2">Follow</Button>
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-bold">{userData.name}</h2>
            <p className="text-gray-500">@{userData.handle}</p>
          </div>

          <p className="mt-3">{userData.bio}</p>

          <div className="flex flex-wrap gap-y-2 mt-3 text-gray-500">
            {userData.location && (
              <div className="flex items-center mr-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{userData.location}</span>
              </div>
            )}
            {userData.website && (
              <div className="flex items-center mr-4">
                <LinkIcon className="h-4 w-4 mr-1" />
                <a
                  href={`https://${userData.website}`}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userData.website}
                </a>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Joined {formatProfileDate(userData.joinDate)}</span>
            </div>
          </div>

          <div className="flex mt-3">
            <div className="mr-4">
              <span className="font-bold">{userData.following}</span>
              <span className="text-gray-500 ml-1">Following</span>
            </div>
            <div>
              <span className="font-bold">{userData.followers}</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="bots" className="mt-4">
        <TabsList className="w-full border-b rounded-none">
          <TabsTrigger value="bots" className="flex-1">
            Bots
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex-1">
            Engagement
          </TabsTrigger>
        </TabsList>

        {/* Bots Tab Content */}
        <TabsContent value="bots" className="p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">My Bots</h2>
            <p className="text-gray-600">
              I create AI-powered bots that help users with various tasks, from getting weather updates to managing
              reminders. Each bot is designed to be conversational, helpful, and easy to use.
            </p>
          </div>

          <div className="mt-6">
            {botData.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        </TabsContent>

        {/* Engagement Tab Content */}
        <TabsContent value="engagement" className="p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Engagement History</h2>
            <p className="text-gray-600">Posts where my bots have been mentioned and user feedback.</p>
          </div>

          <ScrollArea className="h-[calc(100vh-400px)]">
            <div>
              {engagementHistory.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

