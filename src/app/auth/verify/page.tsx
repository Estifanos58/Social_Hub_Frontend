"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client/react";
import InputField from "@/components/shared/InputField";
import { VERIFY_EMAIL } from "@/graphql/mutations/VerifyEmail";
import { VerifyEmailMutation } from "@/gql/graphql";

const initialState = {
  code: "",
};

const initialErrorState = {
  code: "",
};

export default function VerifyPage() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrorState);

  const [verifyEmail, { loading }] = useMutation<VerifyEmailMutation>(
    VERIFY_EMAIL
  );

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(initialErrorState);

    if (!formData.code.trim()) {
      setErrors({ code: "Verification code is required" });
      return;
    }

    try {
      await verifyEmail({
        variables: { code: formData.code },
        onCompleted: (data:any) => {
          if (data?.verifyEmail.success) {
            toast.success("✅ Email verified successfully!");
          } else {
            toast.error("Verification failed. Try again.");
          }
        },
      }).catch((err) => {
        console.log(err.graphQLErrors, "GRAPHQL ERROR");
        toast.error(err.message || "Verification failed");
      });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center p-8 md:p-12">
      <h2 className="text-3xl font-semibold mb-2">Verify Your Email</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter the 6-digit code we sent to your email address.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          name="code"
          label="Verification Code"
          placeholder="Enter 6-digit code"
          value={formData.code}
          onChange={handleChange}
          error={errors.code}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Didn’t get a code?{" "}
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => toast.info("📩 Resend code feature coming soon")}
        >
          Resend
        </button>
      </div>
    </div>
  );
}
