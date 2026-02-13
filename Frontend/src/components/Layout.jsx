import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../store/authStores";
import { Menu, X } from "lucide-react";

const Layout = ({ children }) => {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="relative">
        {user && (
          <>
            {/* Mobile Menu Toggle Button */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="btn btn-circle btn-primary fixed bottom-6 right-6 z-50 shadow-lg lg:hidden"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}

            {/* Overlay for mobile */}
            {isMobile && isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
                onClick={closeSidebar}
              />
            )}

            {/* Sidebar */}
            <div
              className={`
                fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-transform duration-300 ease-in-out
                ${isMobile ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
                lg:translate-x-0
              `}
            >
              <Sidebar onNavigate={closeSidebar} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div
          className={`
            transition-all duration-300 ease-in-out
            ${user ? "lg:ml-64 xl:ml-80" : ""}
            px-4 sm:px-6 lg:px-10 py-4 sm:py-6
            min-h-[calc(100vh-4rem)]
          `}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;