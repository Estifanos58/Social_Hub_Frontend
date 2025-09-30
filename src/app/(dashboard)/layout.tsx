import { MessageContainer } from "@/components/custom/MessageContainer";
import { LeftSideBar } from "@/components/custom/sidebars/LeftSideBar";
import Modal from "@/components/shared/Modal";


export default async function  DashboardLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ search: string }>;
}>) {

    const isSearchActive = (await params).search;
    
    return (
     <div className="flex h-screen bg-background text-white">
          {/* Left Sidebar */}
          <LeftSideBar />
          {children}
          <Modal/>
    </div>
    )
}