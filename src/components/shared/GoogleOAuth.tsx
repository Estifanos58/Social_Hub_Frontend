"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";

function GoogleOAuth() {
  const handleGoogleOAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleOAuth}
      className="flex w-full h-15 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-400/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
        <FcGoogle size={22} />
      </span>
      <span className="hidden sm:inline">Google</span>
      <span className="sm:hidden">Google</span>
    </button>
  );
}

export default GoogleOAuth;
