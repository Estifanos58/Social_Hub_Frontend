'use clinet';

import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import React from "react";
import { CiSearch, CiCirclePlus } from "react-icons/ci";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";

function TopBar() {
  const { user } = useUserStore()
  const TopLinks = [
    { icon: <CiSearch size={20} />, label: "Search" },
    { icon: <CiCirclePlus size={20} />, label: "New Post" },
    { icon: <IoChatbubbleOutline size={20} />, label: "Messages" },
    { icon: <IoNotificationsOutline size={20} />, label: "Notifications" },
  ];

  return (
    <div className="border-b w-full border-gray-700 flex justify-between items-center px-6 py-4 bg-gray-900">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-white">HomePage</h1>

      {/* Action Icons */}
      <div className="flex gap-6 space-x-3">
        <div className="flex items-center bg-gray-800 px-3 py-2 rounded-4xl space-x-2">
          {TopLinks.map((link, index) => (
            <button
              key={index}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-700 transition"
              title={link.label}
            >
              {link.icon}
            </button>
          ))}
        </div>

        {/* Demo User */}
        <div className="flex items-center bg-gray-800 rounded-full px-3 py-1 space-x-2 cursor-pointer hover:bg-gray-700 transition">
          <Image
            src={`${user?.avatarUrl ? user.avatarUrl : '/noAvatar.png'}`} // <-- place demo-user.jpg inside public folder
            alt="User Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-white">{user?.firstname}</span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
