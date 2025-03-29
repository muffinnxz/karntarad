"use client";;
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Function to format text with @ and # highlighting
// const formatText = (id: string, text: string) => {
//   // Split the text by spaces to process each word
//   const words = text.split(" ");

//   return words.map((word, index) => {
//     if (word.startsWith("@")) {
//       // Handle mentions
//       return (
//         <span key={index}>
//           <Link href={`/game/${id}/profile/${word.substring(1)}`} className="text-blue-500 hover:underline">
//             {word}
//           </Link>{" "}
//         </span>
//       );
//     } else if (word.startsWith("#")) {
//       // Handle hashtags
//       return (
//         <span key={index}>
//           <Link href={`/hashtag/${word.substring(1)}`} className="text-blue-500 hover:underline">
//             {word}
//           </Link>{" "}
//         </span>
//       );
//     } else {
//       // Regular text
//       return <span key={index}>{word} </span>;
//     }
//   });
// };

// const formatDay = (day: number) => {
//   switch (day) {
//     case 0:
//       return "day 0 - Monday";
//     case 1:
//       return "day 1 - Tuesday";
//     case 2:
//       return "day 2 - Wednesday";
//     case 3:
//       return "day 3 - Thursday";
//     case 4:
//       return "day 4 - Friday";
//     case 5:
//       return "day 5 - Saturday";
//     case 6:
//       return "day 6 - Sunday";
//     default:
//       return `day ${day} - Invalid day`;
//   }
// };

// Post component
// const PostItem = ({ post }: { post: Post }) => {
//   return (
//     <Card className="mb-4 p-4 border-b hover:bg-gray-50 transition-colors">
//       <div className="flex items-start space-x-3">
//         <Avatar className="h-10 w-10">
//           <AvatarImage src={post.creator?.image} alt={post.creator?.name} />
//           <AvatarFallback>{post.creator?.name.charAt(0)}</AvatarFallback>
//         </Avatar>
//         <div className="flex-1">
//           <div className="flex items-center">
//             <span className="font-semibold">{post.creator?.name}</span>
//             <span className="text-gray-500 ml-2">@{post.creator?.username}</span>
//             <span className="text-gray-500 mx-2">·</span>
//             <span className="text-gray-500">{formatDay(post.day)}</span>
//           </div>

//           <div className="mt-1 text-gray-800">{formatText(post.gameId, post.text)}</div>

//           {post.image && (
//             <div className="mt-3 rounded-xl overflow-hidden">
//               <Image
//                 src={post.image || "/placeholder.svg"}
//                 alt="Post image"
//                 width={500}
//                 height={300}
//                 className="w-full object-cover rounded-xl"
//               />
//             </div>
//           )}

//           <div className="flex mt-3 text-gray-500">
//             <Button variant="ghost" size="sm" className="flex items-center space-x-1">
//               <Heart className="h-4 w-4" />
//               <span>{post.numLikes}</span>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// Main component
export default function CharacterProfilePage({ params }: { params: { id: string; "profile-id": string } }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Unknown";
  // const image = searchParams.get("image") || "/placeholder.svg";
  const BANNER_IMAGES = "/banner/character-banner-temp.png";

  return (
    <div className="max-w-full">
      {/* Header with back button */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center">
        <Link href={`/game/${params.id}`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">{name}</h1>
      </div>

      {/* Banner and profile info */}
      <div className="relative max-w-2xl mx-auto">
        <div className="h-48 bg-gray-200">
          <Image
            src={BANNER_IMAGES}
            alt="Profile banner"
            width={1200}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex justify-between">
            <div className="relative -mt-16">
              {/* <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage src={image} alt={characterData.name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar> */}
            </div>
          </div>

          {/* <div className="mt-3">
            <h2 className="text-xl font-bold">{characterData.name}</h2>
            <p className="text-gray-500">@{characterData.username}</p>
          </div>

          <p className="mt-3">{characterData.description}</p> */}
        </div>
      </div>
      <div className="p-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Post</h2>
        </div>

        <div>
          {/* {postData.map((post) => (
            <PostItem key={post.id} post={post} />
          ))} */}
        </div>
      </div>
    </div>
  );
}
