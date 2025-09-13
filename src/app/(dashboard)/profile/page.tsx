"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Heart,
  MessageCircle,
  Edit,
  Lock,
  Globe,
  Grid3X3,
  Bookmark,
  UserCheck,
} from "lucide-react"
import { useQuery } from "@apollo/client/react"
import { GET_USER_PROFILE } from "@/graphql/queries/user/getUserProfile"
import { useUserStore } from "@/store/userStore"
import { GetUserProfileQuery } from "@/gql/graphql"
import Link from "next/link"

export default function ProfilePage() {
  const { user: currentUser } = useUserStore()
  const { data, loading, error } = useQuery<GetUserProfileQuery>(
    GET_USER_PROFILE,
    {
      variables: { userId: currentUser?.id },
      fetchPolicy: "cache-and-network",
    }
  )

  const profile = data?.GetUser
  const account = profile?.user

  const [hoveredPost, setHoveredPost] = useState<string | null>(null)
  const [isPrivate, setIsPrivate] = useState<boolean>(
    account?.isPrivate ?? false
  )

  // 🔄 Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="animate-pulse text-gray-400">Loading profile...</p>
      </div>
    )
  }

  // ❌ Error
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
        <p>Failed to load profile: {error.message}</p>
      </div>
    )
  }

  // 📝 No user
  if (!profile || !account) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        <p>No user profile found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex-1 overflow-y-scroll text-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-start gap-8 mb-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="w-32 h-32 md:w-40 md:h-40">
              <AvatarImage
                src={account.avatarUrl || "/placeholder.svg"}
                alt={`${account.firstname} ${account.lastname}`}
              />
              <AvatarFallback className="text-2xl font-bold bg-gray-800 text-white">
                {account.firstname?.[0]}
                {account.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-xl font-light">{account.email}</h1>
              <Link href={"/profile/edit"}>
              <Button
                variant="secondary"
                className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit profile
              </Button>
              </Link>
              
              <Button
                variant="secondary"
                className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
              >
                View archive
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <span className="font-semibold">{profile.posts?.length}</span>
                <span className="text-gray-400 ml-1">posts</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{profile.followers}</span>
                <span className="text-gray-400 ml-1">followers</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{profile.following}</span>
                <span className="text-gray-400 ml-1">following</span>
              </div>
            </div>

            {/* Name + Bio */}
            <div className="space-y-1">
              <h2 className="font-semibold">
                {account.firstname} {account.lastname}
              </h2>
              <p className="text-gray-300">{account.bio}</p>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center gap-2">
              {isPrivate ? (
                <Lock className="w-3 h-3 text-gray-400" />
              ) : (
                <Globe className="w-3 h-3 text-gray-400" />
              )}
              <span className="text-sm text-gray-400">
                {isPrivate ? "Private Account" : "Public Account"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-800 mb-4">
          <div className="flex justify-center gap-16 pt-4">
            <button className="flex items-center gap-2 text-white border-t border-white -mt-4 pt-4">
              <Grid3X3 className="w-3 h-3" />
              <span className="text-xs font-semibold tracking-wide">POSTS</span>
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-3 gap-1">
          {profile.posts?.map((post: any) => (
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

        {/* Empty */}
        {profile.posts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
