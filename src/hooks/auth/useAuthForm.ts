import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { LoginMutation, RegisterMutation } from "@/gql/graphql";
import { LOGIN_USER } from "@/graphql/mutations/auth/LoginUser";
import { REGISTER_USER } from "@/graphql/mutations/auth/Register";
import { Login, SignUp } from "@/validator/Auth.validator";
import { useUserStore } from "@/store/userStore";
import { getCookie } from "@/app/test";

interface FormState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  terms: boolean;
}

interface ErrorState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  terms: string;
}

const initialState: FormState = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  terms: false,
};

const initialErrorState: ErrorState = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  terms: "",
};

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ErrorState>(initialErrorState);

  const navigate = useRouter();
  const { setUser } = useUserStore();

  const [registerUser, { loading: registerLoading }] =
    useMutation<RegisterMutation>(REGISTER_USER);
  const [loginUser, { loading: loginLoading }] =
    useMutation<LoginMutation>(LOGIN_USER);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const mapUserForStore = useCallback(
    (user: any) => ({
      id: user.id,
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      email: user.email ?? "",
      avatarUrl: user.avatarUrl ?? undefined,
      lastSeenAt: user.lastSeenAt ? new Date(user.lastSeenAt) : undefined,
      bio: user.bio ?? undefined,
      verified: user.verified ?? false,
      isPrivate: user.isPrivate ?? false,
      createdAt: user.createdAt ?? new Date().toISOString(),
      updatedAt: user.updatedAt ?? new Date().toISOString(),
    }),
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors(initialErrorState);

      try {
        if (!isLogin) {
          const registerData = SignUp.parse(formData);

          await registerUser({
            variables: {
              firstname: registerData.firstname,
              lastname: registerData.lastname,
              email: registerData.email,
              password: registerData.password,
            },
            onCompleted: (data) => {
              if (data?.register?.user) {
                setUser(mapUserForStore(data.register.user));
                navigate.push("/auth/verify");
                toast.success("Registration successful!");
              }
            },
          }).catch((err) => {
            console.log(err.graphQLErrors, "ERROR");
            toast.error(err.message || "Registration failed");
          });
        } else {
          const loginData = Login.parse(formData);

          await loginUser({
            variables: {
              email: loginData.email,
              password: loginData.password,
            },
            onCompleted: (data) => {
              if (data?.login?.user) {
                setUser(mapUserForStore(data.login.user));
                toast.success("Login successful!");
                navigate.push("/");
                getCookie();
              }
            },
          }).catch((err) => {
            console.log(err.graphQLErrors, "ERROR");
            toast.error(err.message || "Login failed");
          });
        }
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors: Partial<ErrorState> = {};
          err.issues.forEach((issue) => {
            const field = issue.path[0] as keyof ErrorState | undefined;
            if (field) {
              fieldErrors[field] = issue.message;
            }
          });
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }
      }
    },
    [formData, isLogin, loginUser, registerUser, setUser, navigate, mapUserForStore],
  );

  const loading = useMemo(() => (isLogin ? loginLoading : registerLoading), [isLogin, loginLoading, registerLoading]);

  return {
    isLogin,
    setIsLogin,
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit,
    loading,
  };
};
