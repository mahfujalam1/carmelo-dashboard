import { Outlet } from "react-router-dom";
import Header from "../component/Main/Header/Header";
import { useState } from "react";
import Sidebar from "../component/Main/Sidebar/Sidebar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <main className="w-full flex bg-white min-h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main Content */}
      <section className="w-full h-full sm:ml-0  lg:ml-[250px] xl:ml-[280px] py-10 px-4">
        <div className="px-4">
          <Outlet />
        </div>
      </section>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 px-10"
          onClick={toggleSidebar}
        ></div>
      )}
    </main>
  );
};
export default MainLayout;
