"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useVerifyEmailForm } from "@/hooks/auth/useVerifyEmailForm";
import { toast } from "sonner";

export default function VerifyPage() {
  const {
    codes,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    loading,
    inputRefs,
  } = useVerifyEmailForm();

  return (
    <div className="flex flex-col justify-center bg-gray-900 p-8 md:p-12 text-gray-100">
      <h2 className="text-4xl font-semibold mb-2 text-white">Verification Code</h2>
      <p className="text-sm text-gray-400 mb-6">
        We sent you a verification code to your email.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {codes.map((code, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={code}
              placeholder="0"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-24 h-12 text-center text-xl border border-gray-700 rounded-4xl bg-gray-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <Button type="submit" className="w-full rounded-4xl p-3 h-10" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-gray-400 text-center">
        Didn’t get a code?{" "}
        <button
          type="button"
          className="text-blue-400 hover:underline"
          onClick={() => toast.info("📩 Resend code feature coming soon")}
        >
          Resend
        </button>
      </div>
    </div>
  );
}
