"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@apollo/client/react";
import { REGISTER_USER } from "@/graphql/mutations/Register";
import { SignUp, Login } from "@/validator/Auth.validator";
import { z } from "zod";
import { LOGIN_USER } from "@/graphql/mutations/LoginUser";
import { LoginMutation, RegisterMutation } from "@/gql/graphql";
import { useUserStore } from "@/store/userStore";
import { toast } from "react-toastify";
import GoogleOAuth from "@/components/custom/GoogleOAuth";

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
  const {user, setUser} = useUserStore()
  const [registerUser, { loading: registerLoading }] =
    useMutation<RegisterMutation>(REGISTER_USER);
  const [loginUser, { loading: loginLoading }] = useMutation<LoginMutation>(LOGIN_USER);
  console.log("API_URL", process.env.NEXT_PUBLIC_API_URL);


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
    console.log("Submitting form with data:", formData);
    setErrors(initialErrorState);

    try {
      let validatedData;

      if (!isLogin) {
        validatedData = SignUp.parse(formData);
        console.log("Validated signup data:", validatedData);
        await registerUser({
          variables: {
              firstname: validatedData.firstname,
              lastname: validatedData.lastname,
              email: validatedData.email,
              password: validatedData.password,
          },
          onCompleted: (data: any) => {
          if (data?.register.user)
            setUser(data.register.user);
            toast.success("Registration successful!");
            console.log("Registered user:", data.register.user);
        },
        }).catch((err) => {
        console.log(err.graphQLErrors, "ERROR")
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
            if (data?.login.user)
              toast.success("Login successful!");
              setUser(data.login.user);
          }
        }).catch((err) => {
          console.log(err.graphQLErrors, "ERROR")
          toast.error(err.message || "Login failed");
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = {};
        err.issues.forEach((e) => {
          if(e.path[0]) {
            fieldErrors[e.path[0]] = e.message
          }
        })
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    }
  };

  const loading  = isLogin ? loginLoading : registerLoading;

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left side (Image) */}
        <div className="relative hidden md:flex items-center justify-center bg-black">
          <img
            src="https://images.unsplash.com/photo-1622675363315-1f3b209d2ca1?q=80&w=1200"
            alt="Futuristic VR"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="text-white font-bold text-2xl">🦋</span>
          </div>
        </div>

        {/* Right side (Form) */}
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    name="firstname"
                    placeholder="John"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstname}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    name="lastname"
                    placeholder="Doe"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastname}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label>Email Address</Label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  name="terms"
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked: boolean) =>
                    setFormData((prev) => ({
                      ...prev,
                      terms: checked,
                    }))
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms & Conditions
                  </a>
                </label>
              </div>
            )}
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white"
              disabled={loading}              
            >
              { loading
                ? "Processing..."
                : isLogin
                ? "Log In"
                : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2">
            <div className="flex-grow border-t border-gray-300" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <GoogleOAuth/>
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                alt="Facebook"
                className="w-4 h-4"
              />
              Continue with Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
