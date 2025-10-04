"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  togglePassword?: boolean; // 👈 optional parameter
}

export default function InputField({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  togglePassword = false,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType =
    isPasswordField && togglePassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={name} className="text-gray-200">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`rounded-4xl h-10 p-3 ${isPasswordField && togglePassword ? "pr-10" : ""} bg-gray-800 border border-gray-700 text-gray-100 placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:ring-2 focus-visible:border-blue-500 focus-visible:ring-offset-0`}
        />
        {isPasswordField && togglePassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
