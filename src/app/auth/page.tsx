"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { REGISTER_USER } from "@/graphql/mutations/auth/Register";
import { LOGIN_USER } from "@/graphql/mutations/auth/LoginUser";
import { SignUp, Login } from "@/validator/Auth.validator";
import { z } from "zod";
import { LoginMutation, RegisterMutation } from "@/gql/graphql";
import { useUserStore } from "@/store/userStore";
import LoginForm from "@/components/custom/LoginForm";
import SignUpForm from "@/components/custom/SignUpForm";
import GoogleOAuth from "@/components/shared/GoogleOAuth";
import { useRouter } from "next/navigation";
import GitHubOAuth from "@/components/shared/GitHubOAuth";
import { toast } from "sonner";

const initialState = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  terms: false,
};

const initialErrorState = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  terms: "",
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrorState);
  const navigate = useRouter();
  const { setUser } = useUserStore();

  const [registerUser, { loading: registerLoading }] =
    useMutation<RegisterMutation>(REGISTER_USER);
  const [loginUser, { loading: loginLoading }] =
    useMutation<LoginMutation>(LOGIN_USER);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form on submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(initialErrorState);

    try {
      let validatedData;

      if (!isLogin) {
        validatedData = SignUp.parse(formData);

        await registerUser({
          variables: {
            firstname: validatedData.firstname,
            lastname: validatedData.lastname,
            email: validatedData.email,
            password: validatedData.password,
          },
          onCompleted: (data: any) => {
            if (data?.register.user) {
              setUser(data.register.user);
              navigate.push("/auth/verify");
              toast.success("Registration successful!");
            }
          },
        }).catch((err) => {
          console.log(err.graphQLErrors, "ERROR");
          toast.error(err.message || "Registration failed");
        });
      } else {
        validatedData = Login.parse(formData);

        await loginUser({
          variables: {
            email: validatedData.email,
            password: validatedData.password,
          },
          onCompleted: (data: any) => {
            if (data?.login.user) {
              setUser(data.login.user);
              toast.success("Login successful!");
              navigate.push("/");
            }
          },
        }).catch((err) => {
          console.log(err.graphQLErrors, "ERROR");
          toast.error(err.message || "Login failed");
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = {};
        err.issues.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0]] = e.message;
          }
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    }
  };

  const loading = isLogin ? loginLoading : registerLoading;

  return (
    <div className="flex flex-col justify-center p-8 md:p-12">
      <h2 className="text-3xl font-semibold mb-2">
        {isLogin ? "Login to Your Account" : "Create an Account"}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="text-blue-600 hover:underline"
            >
              Log in
            </button>
          </>
        )}
      </p>

      {/* Render Login or SignUp */}
      {isLogin ? (
        <LoginForm
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      ) : (
        <SignUpForm
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}

      {/* Divider */}
      <div className="mt-6 flex items-center gap-2">
        <div className="flex-grow border-t border-gray-300" />
        <span className="text-sm text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      {/* Social Logins */}
      <div className="mt-4 flex gap-3  space-y-3 w-full">
        <GoogleOAuth />
        <GitHubOAuth/>
      </div>
    </div>
  );
}
