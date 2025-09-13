'use client'

import { useState, useEffect } from "react";
import { BiHomeAlt2 } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdTrendingUp } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
// import { Link } from "lucide-react";

export const LeftSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const Links = [
    { icon: <BiHomeAlt2 />, label: "Home", href: "/" },
    { icon: <IoMdNotificationsOutline />, label: "Notifications" },
    { icon: <AiOutlineMessage />, label: "Messages" },
    { icon: <IoMdTrendingUp />, label: "Trending" },
    { image: "/noAvatar.png", label: "Profile" , href: "/profile" },
  ];

  // Handle resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarItem = ({
    icon,
    label,
    collapsed,
    image,
    link,
  }: {
    icon: any;
    label: string;
    collapsed: boolean;
    image?: string;
    link?: string;  
  }) => (
    <Link href={link || "#"}>
    <div
      onClick={() => setIsCollapsed(!isCollapsed)}
      className="flex items-center space-x-3 hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition"
    >
      {image ? (
        <Image src={image} width={32} height={32} alt={label} />
      ) : (
        <span className="text-2xl">{icon}</span>
      )}
      {!collapsed && <span className="text-lg font-medium">{label}</span>}
    </div>
    </Link>
  );

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
      </div>
    </div>
  );
};
