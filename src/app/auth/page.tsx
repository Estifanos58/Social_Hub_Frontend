"use client";
import React from "react";
import LoginForm from "@/components/custom/LoginForm";
import SignUpForm from "@/components/custom/SignUpForm";
import GoogleOAuth from "@/components/shared/GoogleOAuth";
import GitHubOAuth from "@/components/shared/GitHubOAuth";
import { useAuthForm } from "@/hooks/auth/useAuthForm";

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

  return (
    <div className="flex flex-col justify-center p-8 md:p-12">
      <h2 className="text-3xl font-semibold mb-2">
        {isLogin ? "Login to Your Account" : "Create an Account"}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="text-blue-600 hover:underline"
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
              className="text-blue-600 hover:underline"
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
