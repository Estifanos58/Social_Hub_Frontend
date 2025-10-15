"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export default function SocialCallbackPage() {
  const router = useRouter();
  const { setAccessToken, setUser } = useUserStore();

  useEffect(() => {
    // Read tokens from URL
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken) {
      setAccessToken(accessToken);
    }
    if (refreshToken) {
      window.localStorage.setItem("refreshToken", refreshToken);
    }

    // Clean URL without tokens
    const cleaned = new URL(window.location.href);
    cleaned.searchParams.delete("accessToken");
    cleaned.searchParams.delete("refreshToken");
    window.history.replaceState({}, document.title, cleaned.pathname + cleaned.search + cleaned.hash);

    // Optionally: trigger a fetch of current user using your client/global apollo
    // For now, redirect to home
    router.replace("/");
  }, [router, setAccessToken, setUser]);

  return null;
}
