"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "../shared/InputField";

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
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
      />

      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 text-white"
        disabled={loading}
      >
        {loading ? "Processing..." : "Log In"}
      </Button>
    </form>
  );
}
