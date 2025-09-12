"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import InputField from "@/components/shared/InputField";
import { EmailSchema, ResetPasswordSchema } from "@/validator/Auth.validator";
import { SEND_RESET_CODE } from "@/graphql/mutations/auth/Sendresetcode";
import { RESET_PASSWORD } from "@/graphql/mutations/auth/Resetpassword";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";




export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const {user , setUser } = useUserStore()
  const [formData, setFormData] = useState<any>({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});

  const [sendResetCode, { loading: sending }] = useMutation(SEND_RESET_CODE);
  const [resetPassword, { loading: resetting }] = useMutation(RESET_PASSWORD);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Step 1: Submit email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = EmailSchema.safeParse({ email: formData.email });
    if (!result.success) {
        setErrors({email: result.error.issues[0].message});
      return;
    }

    try {
      await sendResetCode({
        variables: { email: formData.email },
        onCompleted: (data: any) => {
          if (data?.forgotPassword) {
            toast.success("📩 Reset code sent to your email");
            setStep("reset");
          } else {
            toast.error("Failed to send reset code. Try again.");
          }
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  // Step 2: Reset password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = ResetPasswordSchema.safeParse({
      code: formData.code,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await resetPassword({
        variables: {
          token: formData.code,
          newPassword: formData.password,
        },
        onCompleted: (data:any) => {
          if (data?.resetPassword.user) {
            setUser(data.resetPassword.user)
            toast.success("✅ Password reset successfully!");
            // redirect to login maybe
          } else {
            toast.error("Password reset failed. Try again.");
          }
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col justify-center p-8 md:p-12">
      {step === "email" ? (
        <>
          <h2 className="text-3xl font-semibold mb-2">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">
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
          <h2 className="text-3xl font-semibold mb-2">Reset Password</h2>
          <p className="text-sm text-gray-500 mb-6">
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
