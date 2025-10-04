import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-gray-900 items-center justify-center p-4">
      <div className="grid grid-cols-1 min-h-[500px] md:grid-cols-2 w-full max-w-5xl bg-gray-900 border border-gray-800 rounded-4xl shadow-lg overflow-hidden text-gray-100">
        {/* Left side (Image) */}
        <div className="relative hidden md:flex items-center justify-center p-2">
          <div className="w-full h-full rounded-4xl overflow-hidden relative bg-black">
            <img
              src="https://images.unsplash.com/photo-1622675363315-1f3b209d2ca1?q=80&w=1200"
              alt="Futuristic VR"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="text-white font-bold text-2xl">🦋</span>
            </div>
          </div>
        </div>

        <>{children}</>
      </div>
    </div>
  );
}
