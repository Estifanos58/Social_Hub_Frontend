import React from "react";
import { FcGoogle } from "react-icons/fc";

function getGoogleOAuthUrl() {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const redirect_uri = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`;
  console.log("Redirect URI:", redirect_uri);
  
  const options = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    redirect_uri: redirect_uri,
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
    <div>
      <a
        href={getGoogleOAuthUrl()}
        className="bg-secondary p-2 rounded-md shadow-md flex items-center justify-center"
      >
        <FcGoogle size={30} />
      </a>
    </div>
  );
}

export default GoogleOAuth;
