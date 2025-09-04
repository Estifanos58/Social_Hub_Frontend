"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

function getGoogleOAuthUrl() {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const redirect_uri = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`;

  const options = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    redirect_uri,
    access_type: "offline",
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  return `${baseUrl}?${qs.toString()}`;
}

function GoogleOAuth() {
  return (
    <a href={getGoogleOAuthUrl()} className="w-full">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-2"
      >
        <FcGoogle size={22} />
        <span className="text-sm font-medium">Continue with Google</span>
      </Button>
    </a>
  );
}

export default GoogleOAuth;
