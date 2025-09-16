import { LeftSideBar } from "@/components/custom/sidebars/LeftSideBar";


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
     <div className="flex h-screen bg-background text-white">
          {/* Left Sidebar */}
          <LeftSideBar />
          {children}
    </div>
    )
}