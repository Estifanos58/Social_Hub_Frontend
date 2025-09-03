"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import InputField from "../shared/InputField";

interface SignUpFormProps {
  formData: any;
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function SignUpForm({
  formData,
  errors,
  handleChange,
  setFormData,
  handleSubmit,
  loading,
}: SignUpFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          name="firstname"
          label="First Name"
          placeholder="John"
          value={formData.firstname}
          onChange={handleChange}
          error={errors.firstname}
        />

        <InputField
          name="lastname"
          label="Last Name"
          placeholder="Doe"
          value={formData.lastname}
          onChange={handleChange}
          error={errors.lastname}
        />
      </div>

      <InputField
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <InputField
        name="password"
        label="Password"
        type="password"
        placeholder="********"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      {/* Terms */}
      <div className="flex items-center space-x-2">
        <Checkbox
          name="terms"
          id="terms"
          checked={formData.terms}
          onCheckedChange={(checked: boolean) =>
            setFormData((prev: any) => ({
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
      {errors.terms && (
        <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 text-white"
        disabled={loading}
      >
        {loading ? "Processing..." : "Create Account"}
      </Button>
    </form>
  );
}
