"use client";

import { useEffect } from "react";
import { BiHomeAlt2 } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdTrendingUp } from "react-icons/io";
import { RiUserFollowLine } from "react-icons/ri";
import Link from "next/link";
import { useGeneralStore } from "@/store/generalStore";
import { IoPersonCircle} from "react-icons/io5";
import { SidebarItem } from "../SidebarItem";
import CreatePost from "../post/CreatePost";
import SearchPopUp from "./popUps/SearchPopUp";
import FollowersPopUp from "./popUps/FollowersPopUp";
import NotificationsPopUp from "./popUps/NotificationsPopUp";
import { useQuery } from "@apollo/client/react";
import { GET_UNREAD_NOTIFICATIONS_COUNT } from "@/graphql/queries/notification/getUnreadNotificationsCount";
import MessagePopUp from "./popUps/MessagePopUp";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export const LeftSideBar = () => {
  // Unread notifications count (poll every 20s)
  const { data: unreadData } = useQuery<{ unreadNotificationsCount: number }>(GET_UNREAD_NOTIFICATIONS_COUNT, {
    pollInterval: 20000,
  });
  const router = useRouter();
  const unreadCount = unreadData?.unreadNotificationsCount ?? 0;
  const {
    isCollapsed,
    setIsCollapsed,
    isMobile,
    setMobile,
    showPopup,
    setShowPopup,
    selectedPopUp,
    setSelectedPopUp
  } = useGeneralStore();

  const { user: currentUser } = useUserStore();

  const Links = [
    { icon: <BiHomeAlt2 />, label: "Home", href: "/" },
    { 
      icon: (
        <span className="relative">
          <IoMdNotificationsOutline />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-bold border-2 border-gray-900">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </span>
      ),
      label: "Notifications",
      onClick: () => {
        setShowPopup(true);
        setIsCollapsed(true);
        setSelectedPopUp("notifications");
      }
     },
    { 
      icon: <AiOutlineMessage />,
      label: "Messages" ,
      href: '/message',
      onClick: () => {
        setShowPopup(true);
        setIsCollapsed(true);
        setSelectedPopUp("message")
      }
      },
    // { icon: <IoMdTrendingUp />, label: "Trending" },
    {
      icon: <RiUserFollowLine />,
      label: "Connections",
      onClick: () => {
        setShowPopup(true);
        setIsCollapsed(true);
        setSelectedPopUp("connections");  
      },
    },
    { icon: <IoPersonCircle />, label: "Profile", href: `/profile/${currentUser?.id}` },
  ];

  const handleMobileNavClick = (link: (typeof Links)[number]) => {
    if (link.onClick) {
      link.onClick();
      return;
    }

    if (link.href) {
      router.push(link.href);
    }
  };

  const renderMobileButton = (link: (typeof Links)[number]) => (
    <button
      type="button"
      key={link.label}
      onClick={() => handleMobileNavClick(link)}
      className="flex flex-col items-center text-gray-300 hover:text-amber-400"
      aria-label={link.label}
    >
      <span className="text-2xl">{link.icon}</span>
    </button>
  );

  // Handle resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 700) {
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
    const midIndex = Math.ceil(Links.length / 2);
    const firstLinks = Links.slice(0, midIndex);
    const secondLinks = Links.slice(midIndex);

    return (
      <>
        {showPopup && (
          <div className="fixed inset-0 z-[60] bg-gray-950/95 backdrop-blur-sm flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {(selectedPopUp === "search") && <SearchPopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed} />}
              {(selectedPopUp === "connections") && <FollowersPopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed} />}
              {(selectedPopUp === "notifications") && <NotificationsPopUp setIsCollapsed={setIsCollapsed} setShowPopup={setShowPopup} />}
              {(selectedPopUp === "message") && <MessagePopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed} />}
            </div>
          </div>
        )}
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex items-center gap-6 px-4 py-2 z-50">
          <div className="flex flex-1 justify-evenly">
            {firstLinks.map(renderMobileButton)}
          </div>
          <div className="flex-shrink-0">
            <CreatePost />
          </div>
          <div className="flex flex-1 justify-evenly">
            {secondLinks.map(renderMobileButton)}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
  <div className="bg-gray-900 text-gray-100 border-r border-gray-800 transition-all duration-300 flex flex-col position-fixed h-screen top-0">
        {/* Logo */}
        <div className="flex">
          <div>
            <div className="flex items-center mt-4 justify-center px-4 cursor-pointer mb-6">
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
                  link={link.href}
                  onClick={link.onClick}
                />
              ))}
              <CreatePost />
            </div>
          </div>

          {showPopup && (
            <div className="popup-sidebar w-80 h-screen bg-gray-900 text-gray-100 border-r border-gray-800 z-50 shadow-2xl">
              {(selectedPopUp === "search") && <SearchPopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed}/>}
              {(selectedPopUp === "connections") && <FollowersPopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed}/>}
              {(selectedPopUp === "notifications") && <NotificationsPopUp setIsCollapsed={setIsCollapsed} setShowPopup={setShowPopup}/>}
              {(selectedPopUp === "message") && <MessagePopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed}/>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
