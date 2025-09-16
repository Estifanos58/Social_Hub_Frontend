"use client"

import { useState, useEffect, useRef } from "react"

interface User {
  id: number
  username: string
  displayName: string
  avatar: string
  isFollowing?: boolean
}

interface FollowersPopUpProps {
  setShowPopup: (value: boolean) => void
  setIsCollapsed: (value: boolean) => void
}

function FollowersPopUp({ setShowPopup, setIsCollapsed }: FollowersPopUpProps) {
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers")
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Mock data generator
  const generateMockUsers = (start: number, count: number, type: "followers" | "following"): User[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: start + i,
      username: `user${start + i}`,
      displayName: `User ${start + i}`,
      avatar: `/placeholder.svg?height=40&width=40&query=user+avatar+${start + i}`,
      isFollowing: type === "followers" ? Math.random() > 0.5 : true,
    }))
  }

  // Load initial data
  useEffect(() => {
    const initialFollowers = generateMockUsers(1, 10, "followers")
    const initialFollowing = generateMockUsers(1, 10, "following")
    setFollowers(initialFollowers)
    setFollowing(initialFollowing)
  }, [])

  // Load more data
  const loadMore = () => {
    if (loading || !hasMore) return

    setLoading(true)

    setTimeout(() => {
      const currentList = activeTab === "followers" ? followers : following
      const newUsers = generateMockUsers(currentList.length + 1, 10, activeTab)

      if (activeTab === "followers") {
        setFollowers((prev) => [...prev, ...newUsers])
      } else {
        setFollowing((prev) => [...prev, ...newUsers])
      }

      // Stop loading more after 50 users for demo
      if (currentList.length >= 40) {
        setHasMore(false)
      }

      setLoading(false)
    }, 1000)
  }

  // Handle scroll
  const handleScroll = () => {
    if (!scrollRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMore()
    }
  }

  const currentList = activeTab === "followers" ? followers : following

  const handleFollow = (userId: number) => {
    if (activeTab === "followers") {
      setFollowers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)),
      )
    }
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Connections</h2>
        <button
          onClick={() => {
            setShowPopup(false)
            setIsCollapsed(false)
          }}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
            activeTab === "followers" ? "text-white border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
          }`}
        >
          Followers
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
            activeTab === "following" ? "text-white border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
          }`}
        >
          Following
        </button>
      </div>

      {/* Users List */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto space-y-3">
        {currentList.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium">{user.displayName}</p>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>
            </div>

            {activeTab === "followers" && (
              <button
                onClick={() => handleFollow(user.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  user.isFollowing
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </button>
            )}

            {activeTab === "following" && (
              <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                Following
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          </div>
        )}

        {!hasMore && currentList.length > 0 && (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">No more users to load</p>
          </div>
        )}

        {currentList.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {activeTab === "followers" ? "No followers yet." : "Not following anyone yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowersPopUp
