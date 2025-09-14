"use client";

import { useState, useEffect } from "react";
import { BiHomeAlt2 } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdTrendingUp } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import CreatePost from "./CreatePost";
import { useGeneralStore } from "@/store/generalStore";
import { SidebarItem } from "./SidebarItem";

export const LeftSideBar = () => {
  const { isCollapsed, setIsCollapsed, isMobile, setMobile } =
    useGeneralStore();

  const Links = [
    { icon: <BiHomeAlt2 />, label: "Home", href: "/" },
    { icon: <IoMdNotificationsOutline />, label: "Notifications" },
    { icon: <AiOutlineMessage />, label: "Messages" },
    { icon: <IoMdTrendingUp />, label: "Trending" },
    { image: "/noAvatar.png", label: "Profile", href: "/profile" },
  ];

  // Handle resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setMobile(true);
        setIsCollapsed(true); // optional: mobile is always collapsed
      } else if (window.innerWidth <= 1024) {
        setIsCollapsed(true);
        setMobile(false);
      } else {
        setIsCollapsed(false);
        setMobile(false);
      }
    };

    // Run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around items-center py-2 z-50">
        {Links.map((link) => (
          <Link href={link.href || "#"} key={link.label}>
            <div className="flex flex-col items-center text-gray-300 hover:text-amber-400">
              {link.image ? (
                <Image
                  src={link.image}
                  width={24}
                  height={24}
                  alt={link.label}
                  className="rounded-full"
                />
              ) : (
                <span className="text-2xl">{link.icon}</span>
              )}
              <span className="text-xs mt-1">{link.label}</span>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${
        isCollapsed ? "w-20 pt-6" : "w-60 pt-6"
      } bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col position-fixed h-screen top-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-4 cursor-pointer mb-6">
        {!isCollapsed ? (
          <h1 className="text-2xl font-story font-extrabold text-white tracking-wide">
            Social<span className="text-amber-400">Hub</span>
          </h1>
        ) : (
          <h1 className="text-xl font-extrabold text-amber-400">S</h1>
        )}
      </div>

      <div className="border-b border-gray-700 mb-6"></div>

      {/* Sidebar Links */}
      <div className="flex flex-col space-y-3 px-3">
        {Links.map((link) => (
          <SidebarItem
            key={link.label}
            icon={link.icon}
            label={link.label}
            collapsed={isCollapsed}
            image={link.image}
            link={link.href}
          />
        ))}
        <CreatePost />
      </div>
    </div>
  );
};
