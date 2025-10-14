import { useCallback, useMemo, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

import { VERIFY_EMAIL } from "@/graphql/mutations/auth/VerifyEmail";
import { VerifyEmailMutation } from "@/gql/graphql";

interface UseVerifyEmailFormReturn {
  codes: string[];
  handleChange: (value: string, index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  handlePaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  loading: boolean;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

export const useVerifyEmailForm = (): UseVerifyEmailFormReturn => {
  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter()
  const codesLength = codes.length;

  const [verifyEmail, { loading }] = useMutation<VerifyEmailMutation>(VERIFY_EMAIL);

  const handleChange = useCallback((value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value.slice(-1);
      setCodes(newCodes);

      if (value && index < newCodes.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }, [codes]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [codes]);

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      const newCodes = pasteData.split("");
      setCodes((prev) => prev.map((_, i) => newCodes[i] || ""));
      inputRefs.current[Math.min(pasteData.length, codesLength - 1)]?.focus();
    }
  }, [codesLength]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    const code = codes.join("");

    if (code.length !== 4) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    try {
      await verifyEmail({
        variables: {
          token: code,
        },
        onCompleted: (data) => {
          if (data?.verifyEmail) {
            toast.success("Email verified successfully!");
            router.push('/')
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
  }, [codes, verifyEmail, router]);

  return {
    codes,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    loading,
    inputRefs,
  };
};
