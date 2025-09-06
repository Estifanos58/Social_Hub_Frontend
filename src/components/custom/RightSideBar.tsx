import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function RightSideBar() {
  const RightSideFooterLinks = [
    { label: "About" },
    { label: "Help" },
    { label: "Press" },
    { label: "API" },
    { label: "Jobs" },
    { label: "Privacy" },
    { label: "Terms" },
  ]

  const users = [
    {
      name: "tsidu_fe",
      avatar: "/demo-user.jpg" // <-- place demo-user.jpg inside public folder
    },
    {
      name: "maynibxo",
      avatar: "/demo-user.jpg" // <-- place demo-user.jpg inside public folder
    },
    {
      name: "robelliyew",
      avatar: "/demo-user.jpg" // <-- place demo-user.jpg inside public folder
    },
    {
      name: "getachew2114",
      avatar: "/demo-user.jpg" // <-- place demo-user.jpg inside public folder
    },
    {
      name: "mikreselasie",
      avatar: "/demo-user.jpg" // <-- place demo-user.jpg inside public folder
    },

  ]
  const year = new Date().getFullYear();
  return (
    <div className="hidden md:flex w-[350px] border-l border-gray-800 bg-gray-900 flex-col justify-between p-4">
      {/* Suggested Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-300 font-semibold text-xl">
            Suggested for you
          </h2>
          <button className="text-xs text-gray-400 hover:underline">
            See All
          </button>
        </div>

        <div className="space-y-3">
          {
            users.map((user) => (
              <SidebarContact key={user.name} user={user} />
            ))
          }
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-[11px] text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
         {
          RightSideFooterLinks.map((link) => (
            <button key={link.label} className="hover:underline">{link.label}</button>
          ))
         }
        </div>
        <p className="text-gray-600">© {year} SocialHub By Estifanos Kebede</p>
      </div>
    </div>
  );
}

const SidebarContact = ({ user }: { user: { name: string, avatar: string } }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-700 rounded-full">
        <Image src={"/noAvatar.png"} alt="user" width="100" height={100}  />
      </div>
      <p className="text-base text-white font-medium">{user.name}</p>
    </div>
    <Button
      size="sm"
      className="bg-transparent hover:bg-gray-800 text-blue-400 text-xs px-3 py-1 rounded-md"
    >
      Follow
    </Button>
  </div>
);

export default RightSideBar;
