import React from "react";
import { AuthShowcase } from "@/components/custom/AuthShowcase";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-gray-900 items-center justify-center p-4">
      <div className="grid grid-cols-1 min-h-[500px] md:grid-cols-2 w-full max-w-5xl bg-gray-900 border border-gray-500 rounded-4xl shadow-lg overflow-hidden text-gray-100">
        {/* Left side (Image) */}
        <div className="relative hidden md:flex items-center justify-center p-2">
          <div className="relative h-full w-full overflow-hidden rounded-4xl bg-slate-950">
            <AuthShowcase />
            <div className="pointer-events-none absolute top-4 left-4 text-2xl font-bold text-white">
              🦋
            </div>
          </div>
        </div>

        <>{children}</>
      </div>
    </div>
  );
}
