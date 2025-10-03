import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { EmailSchema, ResetPasswordSchema } from "@/validator/Auth.validator";
import { SEND_RESET_CODE } from "@/graphql/mutations/auth/Sendresetcode";
import { RESET_PASSWORD } from "@/graphql/mutations/auth/Resetpassword";
import { useUserStore } from "@/store/userStore";
import { ResetPasswordMutation, SendResetCodeMutation } from "@/gql/graphql";

interface ResetFormData {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

interface UseResetPasswordReturn {
  step: "email" | "reset";
  setStep: React.Dispatch<React.SetStateAction<"email" | "reset">>;
  formData: ResetFormData;
  setFormData: React.Dispatch<React.SetStateAction<ResetFormData>>;
  errors: Record<string, string>;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEmailSubmit: (event: FormEvent) => Promise<void>;
  handleResetSubmit: (event: FormEvent) => Promise<void>;
  sending: boolean;
  resetting: boolean;
}

const initialFormData: ResetFormData = {
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
};

export const useResetPassword = (): UseResetPasswordReturn => {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [formData, setFormData] = useState<ResetFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { setUser } = useUserStore();
  const router = useRouter();

  const [sendResetCode, { loading: sending }] = useMutation<SendResetCodeMutation>(SEND_RESET_CODE);
  const [resetPassword, { loading: resetting }] = useMutation<ResetPasswordMutation>(RESET_PASSWORD);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleEmailSubmit = useCallback(
  async (event: FormEvent) => {
      event.preventDefault();
      setErrors({});

      const result = EmailSchema.safeParse({ email: formData.email });
      if (!result.success) {
        setErrors({ email: result.error.issues[0]?.message ?? "Invalid email" });
        return;
      }

      try {
        await sendResetCode({
          variables: { email: formData.email },
          onCompleted: (data) => {
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
    },
    [formData.email, sendResetCode],
  );

  const handleResetSubmit = useCallback(
  async (event: FormEvent) => {
      event.preventDefault();
      setErrors({});

      const result = ResetPasswordSchema.safeParse({
        code: formData.code,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0];
          if (field) {
            fieldErrors[field as string] = issue.message;
          }
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
          onCompleted: (data) => {
            const user = data?.resetPassword?.user;
            if (user) {
              const mappedUser = {
                id: user.id,
                firstname: user.firstname,
                lastname: "",
                email: user.email,
                avatarUrl: user.avatarUrl ?? undefined,
                lastSeenAt: undefined,
                bio: user.bio ?? undefined,
                verified: false,
                isPrivate: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              setUser(mappedUser);
              toast.success("✅ Password reset successfully!");
              router.push("/");
            } else {
              toast.error("Password reset failed. Try again.");
            }
          },
        });
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      }
    },
    [formData.code, formData.confirmPassword, formData.password, resetPassword, router, setUser],
  );

  return {
    step,
    setStep,
    formData,
    setFormData,
    errors,
    handleChange,
    handleEmailSubmit,
    handleResetSubmit,
    sending,
    resetting,
  };
};
