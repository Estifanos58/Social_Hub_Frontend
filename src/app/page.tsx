// import Image from "next/image";
// import AuthPage from "./auth/page";
// import Link from "next/link";

// export default function Home() {
//   return (
//    <Link href="/auth" className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
//    Auth
//    </Link>
//   );
// }
'use client'
import { LeftSideBar } from "@/components/custom/LeftSideBar";
import MainPage from "@/components/custom/MainPage";
import RightSideBar from "@/components/custom/RightSideBar";
import React, { useState } from "react";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar */}
      <LeftSideBar />
      {/* Main Content */}
      <MainPage />
    </div>
  );
};
export default AppLayout;

