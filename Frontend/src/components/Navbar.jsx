import { Link } from "react-router-dom";
import { Palette, LogOut, Handshake } from "lucide-react";
import { useAuthStore } from "../store/authStores";
import { getSocket } from "../socket";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const socket = getSocket();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user) {
      socket.emit("registerUser", user.id);
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "helper":
        return "badge-primary";
      case "user":
        return "badge-secondary";
      case "admin":
        return "badge-accent";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-lg border-b border-base-300 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 backdrop-blur-sm bg-base-100/95">
      <div className="flex-1">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
        >
          <Handshake className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <span className="hidden sm:inline">HelperHub</span>
          <span className="sm:hidden">HH</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Switcher */}
        <Link to="/theme">
          <button className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-primary/10 hover:text-primary transition-all duration-200">
            <Palette className="w-5 h-5" />
          </button>
        </Link>

        {user && (
          <div className="dropdown dropdown-end">
            <label 
              tabIndex={0} 
              className="btn btn-ghost gap-2 px-2 sm:px-4 hover:bg-base-200 transition-all duration-200"
            >
              {/* Avatar with Initial */}
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8 h-8 sm:w-10 sm:h-10 ring ring-primary ring-offset-base-100 ring-offset-2">
                  <span className="text-sm sm:text-base font-semibold">
                    {getInitials(user.name)}
                  </span>
                </div>
              </div>

              {/* User Info - Hidden on mobile */}
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className={`badge ${getRoleBadgeColor(user.role)} badge-sm`}>
                  {user.role}
                </span>
              </div>
            </label>

            <ul 
              tabIndex={0} 
              className="dropdown-content menu bg-base-100 rounded-box w-64 shadow-xl border border-base-300 mt-3 p-2"
            >
              {/* User Info in Dropdown - Visible on mobile */}
              <li className="menu-title px-4 py-2 md:hidden">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-12 h-12">
                      <span className="text-lg font-bold">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">{user.name}</p>
                    <span className={`badge ${getRoleBadgeColor(user.role)} badge-sm mt-1`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </li>
              
              <div className="divider my-1 md:hidden"></div>

              {/* Logout Option */}
              <li>
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="gap-3 py-3 text-error hover:bg-error/10 transition-colors duration-200"
                >
                  {isLoggingOut ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span className="font-medium">Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </>
                  )}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;