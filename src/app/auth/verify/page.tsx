"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import { VERIFY_EMAIL } from "@/graphql/mutations/auth/VerifyEmail";
import { VerifyEmailMutation } from "@/gql/graphql";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

export default function VerifyPage() {
  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const {user} = useUserStore()

  const [verifyEmail, { loading }] = useMutation<VerifyEmailMutation>(
    VERIFY_EMAIL
  );

  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value.slice(-1); // only keep last digit
      setCodes(newCodes);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      const newCodes = pasteData.split("");
      setCodes((prev) =>
        prev.map((_, i) => newCodes[i] || "")
      );
      inputRefs.current[Math.min(pasteData.length, 3)]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codes.join("");

    if (code.length !== 4) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    try {
      await verifyEmail({
        variables: { 
          token: code 
        },
        onCompleted: (data: any) => {
          if (data?.verifyEmail) {
            toast.success("✅ Email verified successfully!");
          } else {
            toast.error("Verification failed. Try again.");
          }
        },
      }).catch((err) => {
        console.log(err.graphQLErrors, "GRAPHQL ERROR");
        toast.error(err.message || "Verification failed");
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center p-8 md:p-12">
      <h2 className="text-4xl font-semibold mb-2">Verification Code</h2>
      <p className="text-sm text-gray-500 mb-6">
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
              className="w-24 h-12 text-center text-xl border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <Button type="submit" className="w-full rounded-4xl p-3 h-10" disabled={loading}>
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
