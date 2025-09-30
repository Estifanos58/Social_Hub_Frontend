"use client"

import type React from "react"

import Link from "next/link"
import { useGeneralStore } from "@/store/generalStore"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  collapsed: boolean
  image?: string
  link?: string
  onClick?: () => void
}

export const SidebarItem = ({ icon, label, collapsed, image, link, onClick }: SidebarItemProps) => {
  const { setIsCollapsed } = useGeneralStore()

  const handleClick = () => {
    // setIsCollapsed(false)
    if (onClick) onClick()
  }

  const content = (
    <div
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      <span className="text-2xl text-gray-300 group-hover:text-white">{icon}</span>
      {!collapsed && <span className="text-gray-300 group-hover:text-white font-medium">{label}</span>}
    </div>
  )

  if (link) {
    return <Link href={link}>{content}</Link>
  }

  return content
}
