import { LeftSideBar } from "@/components/custom/LeftSideBar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
     <div className="flex h-screen bg-gray-900 text-white">
          {/* Left Sidebar */}
          <LeftSideBar />
          {children}
    </div>
    )
}