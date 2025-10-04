"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "../shared/InputField";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  formData: any;
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function LoginForm({
  formData,
  errors,
  handleChange,
  handleSubmit,
  loading,
}: LoginFormProps) {
  const navigate = useRouter();

  return (
    <form className="space-y-4 text-gray-100" onSubmit={handleSubmit}>
      <InputField
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <InputField
        name="password"
        label="Password"
        type="password"
        placeholder="********"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        togglePassword // 👈 enables eye toggle
      />

      {/* Forgot Password link */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate.push("/auth/resetpassword")}
          className="text-sm text-blue-400 hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full bg-black rounded-4xl p-3 h-10 hover:bg-gray-800 text-white"
        disabled={loading}
      >
        {loading ? "Processing..." : "Log In"}
      </Button>
    </form>
  );
}
