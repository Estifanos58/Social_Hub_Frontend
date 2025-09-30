"use client";

import React from "react";

interface MessageContainerProps {
  message?: string;
}

export function MessageContainer({
  message = "Select a chat to start messaging.",
}: MessageContainerProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-900 text-gray-300">
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-white">Messages</p>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}