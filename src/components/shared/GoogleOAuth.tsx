"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

function GoogleOAuth() {
  const handleGoogleOAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };

  return (
    <Button
      onClick={handleGoogleOAuth}
      variant="outline"
      className="flex-1 "
    >
      <FcGoogle size={22} />
    </Button>
  );
}

export default GoogleOAuth;
