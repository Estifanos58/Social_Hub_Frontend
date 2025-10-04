"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/shared/InputField";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

export default function ForgotPasswordPage() {
  const {
    step,
    formData,
    errors,
    handleChange,
    handleEmailSubmit,
    handleResetSubmit,
    sending,
    resetting,
  } = useResetPassword();

  return (
    <div className="flex flex-col justify-center bg-gray-900 p-8 md:p-12 text-gray-100">
      {step === "email" ? (
        <>
          <h2 className="text-3xl font-semibold mb-2 text-white">Forgot Password</h2>
          <p className="text-sm text-gray-400 mb-6">
            Enter your email address and we’ll send you a 6-digit code.
          </p>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <InputField
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Button type="submit" className="w-full rounded-4xl p-3 h-10" disabled={sending}>
              {sending ? "Sending..." : "Send Code"}
            </Button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-semibold mb-2 text-white">Reset Password</h2>
          <p className="text-sm text-gray-400 mb-6">
            Enter the 6-digit code sent to <b>{formData.email}</b> and set your
            new password.
          </p>
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <InputField
              name="code"
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={formData.code}
              onChange={handleChange}
              error={errors.code}
            />
            <InputField
              name="password"
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
            <Button type="submit" className="w-full" disabled={resetting}>
              {resetting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
