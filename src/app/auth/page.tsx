"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import LoginForm from "@/components/custom/LoginForm";
import SignUpForm from "@/components/custom/SignUpForm";
import GoogleOAuth from "@/components/shared/GoogleOAuth";
import GitHubOAuth from "@/components/shared/GitHubOAuth";
import { useAuthForm } from "@/hooks/auth/useAuthForm";

const errorMessages: Record<string, { title: string; message: string }> = {
  access_denied: {
    title: "Access denied",
    message: "You denied access to your account. If this was accidental, try signing in again.",
  },
  no_code: {
    title: "No code received",
    message: "The OAuth provider did not return an authorization code. Please try again.",
  },
  token_exchange_failed: {
    title: "Sign-in failed",
    message: "We couldn't complete sign-in with the OAuth provider. Try again or use email/password.",
  },
  default: {
    title: "Authentication issue",
    message: "An error occurred during authentication. Try again or contact support.",
  },
};

export default function AuthPage() {
  const {
    isLogin,
    setIsLogin,
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit,
    loading,
  } = useAuthForm();

    const search = useSearchParams();
  const router = useRouter();

  const oauthError = search.get("oauthError");

  const { title, message } = useMemo(() => {
    if (!oauthError) return { title: "Welcome", message: "Sign in to continue." };
    return errorMessages[oauthError] ?? errorMessages.default;
  }, [oauthError]);

  useEffect(() => {
    // If there is no oauthError we don't need to do anything; keep user on the auth page
  }, [oauthError]);

  // return (
  //   <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e6eef8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
  //     <div style={{ width: 720, maxWidth: "100%", background: "#0f1724", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: 28, boxShadow: "0 8px 40px rgba(2,6,23,0.6)" }}>
  //       <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
  //         <div style={{ width: 56, height: 56, borderRadius: 10, background: "linear-gradient(135deg,#6ee7b7,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#04202a", fontWeight: 700, fontSize: 20 }}>
  //           SH
  //         </div>
  //         <div>
  //           <h1 style={{ margin: 0, fontSize: 20 }}>{title}</h1>
  //           <p style={{ margin: 0, color: "#9fb0c8" }}>{message}</p>
  //         </div>
  //       </div>

  //       <div style={{ marginTop: 26, display: "flex", gap: 12, alignItems: "center" }}>
  //         <Link href="/auth" style={{ textDecoration: "none" }}>
  //           <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "#cfe7ff", padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}>
  //             Back to sign in
  //           </button>
  //         </Link>

  //         <button
  //           onClick={() => router.push('/')}
  //           style={{ background: "#1f6feb", border: "none", color: "white", padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}
  //         >
  //           Go home
  //         </button>

  //         <div style={{ marginLeft: 'auto', color: '#7aa7d9' }}>
  //           {oauthError && <small>Error code: {oauthError}</small>}
  //         </div>
  //       </div>

  //       <div style={{ marginTop: 20, color: '#94a6bf', fontSize: 13 }}>
  //         <p style={{ margin: 0 }}>If the problem persists, try clearing your provider sessions or contact support.</p>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex flex-col justify-center bg-gray-900 p-8 md:p-12 text-gray-100">
      <h2 className="text-3xl font-semibold mb-2 text-white">
        {isLogin ? "Login to Your Account" : "Create an Account"}
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="text-blue-400 hover:underline"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="text-blue-400 hover:underline"
            >
              Log in
            </button>
          </>
        )}
      </p>

      {/* Render Login or SignUp */}
      {isLogin ? (
        <LoginForm
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      ) : (
        <SignUpForm
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}

      {/* Divider */}
      <div className="mt-6 flex items-center gap-2">
        <div className="flex-grow border-t border-gray-300" />
        <span className="text-sm text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      {/* Social Logins */}
      <div className="mt-4 flex gap-3  space-y-3 w-full">
        <GoogleOAuth />
        <GitHubOAuth/>
      </div>
    </div>
  );
}
