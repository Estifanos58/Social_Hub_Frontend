import { MessageContainer } from "@/components/custom/message/MessageContainer";
import { LeftSideBar } from "@/components/custom/sidebars/LeftSideBar";
import Modal from "@/components/shared/Modal";


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
          <Modal/>
    </div>
    )
}