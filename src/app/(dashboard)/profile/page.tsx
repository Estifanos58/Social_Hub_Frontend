"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Heart, MessageCircle, Edit, Lock, Globe, Grid3X3, Bookmark, UserCheck } from "lucide-react"

// Mock user data - replace with real data from your backend
const mockUser = {
  avatarUrl: "/professional-headshot.png",
  firstname: "Estifanos",
  lastname: "Kebede",
  username: "estifanos.kebede",
  bio: "Student",
  email: "estifanos.kebede@example.com",
  isprivate: false,
  followers: 49,
  following: 8,
  posts: [
    {
      id: 1,
      imageUrl: "/sunset-landscape.jpg",
      likes: 124,
      comments: 18,
    },
    {
      id: 2,
      imageUrl: "/coffee-latte-art.jpg",
      likes: 89,
      comments: 12,
    },
    {
      id: 3,
      imageUrl: "/mountain-hiking.png",
      likes: 156,
      comments: 23,
    },
    {
      id: 4,
      imageUrl: "/city-street-photography.jpg",
      likes: 203,
      comments: 31,
    },
    {
      id: 5,
      imageUrl: "/vibrant-pasta-dish.png",
      likes: 78,
      comments: 9,
    },
    {
      id: 6,
      imageUrl: "/beach-sunset.png",
      likes: 267,
      comments: 45,
    },
  ],
}

export default function ProfilePage() {
  const [isPrivate, setIsPrivate] = useState(mockUser.isprivate)
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-black flex-1 overflow-y-scroll text-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header Section */}
        <div className="flex items-start gap-8 mb-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="w-32 h-32 md:w-40 md:h-40">
              <AvatarImage
                src={mockUser.avatarUrl || "/placeholder.svg"}
                alt={`${mockUser.firstname} ${mockUser.lastname}`}
              />
              <AvatarFallback className="text-2xl font-bold bg-gray-800 text-white">
                {mockUser.firstname[0]}
                {mockUser.lastname[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            {/* Username and buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-xl font-light">{mockUser.username}</h1>
              <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600">
                <Edit className="w-4 h-4 mr-2" />
                Edit profile
              </Button>
              <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600">
                View archive
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <span className="font-semibold">{mockUser.posts.length}</span>
                <span className="text-gray-400 ml-1">posts</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{mockUser.followers}</span>
                <span className="text-gray-400 ml-1">followers</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{mockUser.following}</span>
                <span className="text-gray-400 ml-1">following</span>
              </div>
            </div>

            {/* Name and Bio */}
            <div className="space-y-1">
              <h2 className="font-semibold">
                {mockUser.firstname} {mockUser.lastname}
              </h2>
              <p className="text-gray-300">{mockUser.bio}</p>
            </div>

            {/* Privacy Toggle - smaller and inline */}
            <div className="flex items-center gap-2">
              {isPrivate ? <Lock className="w-3 h-3 text-gray-400" /> : <Globe className="w-3 h-3 text-gray-400" />}
              <span className="text-sm text-gray-400">{isPrivate ? "Private Account" : "Public Account"}</span>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                className="data-[state=checked]:bg-blue-600 scale-75"
              />
            </div>
          </div>
        </div>

        {/* Story Highlights Placeholder */}
        <div className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">+</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">New</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-gray-800 mb-4">
          <div className="flex justify-center gap-16 pt-4">
            <button className="flex items-center gap-2 text-white border-t border-white -mt-4 pt-4">
              <Grid3X3 className="w-3 h-3" />
              <span className="text-xs font-semibold tracking-wide">POSTS</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400">
              <Bookmark className="w-3 h-3" />
              <span className="text-xs font-semibold tracking-wide">SAVED</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400">
              <UserCheck className="w-3 h-3" />
              <span className="text-xs font-semibold tracking-wide">TAGGED</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1">
          {mockUser.posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square group cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay */}
              {hoveredPost === post.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-6 transition-opacity duration-300">
                  <div className="flex items-center text-white font-semibold">
                    <Heart className="w-5 h-5 mr-2 fill-white" />
                    {post.likes}
                  </div>
                  <div className="flex items-center text-white font-semibold">
                    <MessageCircle className="w-5 h-5 mr-2 fill-white" />
                    {post.comments}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mockUser.posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
