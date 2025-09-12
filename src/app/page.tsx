import { LeftSideBar } from "@/components/custom/LeftSideBar";
import MainPage from "@/components/custom/MainPage";

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar */}
      <LeftSideBar />
      {/* Main Content */}
      <MainPage />
    </div>
  );
};
export default AppLayout;

