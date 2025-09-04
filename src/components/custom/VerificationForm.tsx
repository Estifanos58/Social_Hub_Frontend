"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "../shared/InputField";

interface VerificationFormProps {
  formData: { code: string };
  errors: { code?: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  onResend?: () => void;
}

export default function VerificationForm({
  formData,
  errors,
  handleChange,
  handleSubmit,
  loading,
  onResend,
}: VerificationFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center p-8 md:p-12 w-full"
    >
      {/* Title */}
      <h2 className="text-3xl font-semibold mb-2">Verify Your Email</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter the 6-digit verification code we sent to your email.
      </p>

      {/* Code Input */}
      <div className="mb-4">
        <InputField
          name="code"
          label="Verification Code"
          type="text"
          placeholder="Enter your code"
          value={formData.code}
          onChange={handleChange}
          error={errors.code}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </Button>

      {/* Resend Option */}
      {onResend && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Didn’t receive a code?{" "}
          <button
            type="button"
            onClick={onResend}
            className="text-blue-600 hover:underline"
          >
            Resend Code
          </button>
        </p>
      )}
    </form>
  );
}
