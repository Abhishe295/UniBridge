import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStores";
import {
  LayoutDashboard,
  List,
  Wrench,
  DollarSign,
  Users,
  ClipboardList,
  MessageSquare,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ onNavigate }) => {
  const { user } = useAuthStore();
  if (!user) return null;

  const linkClass =
    "flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 group";

  const activeClass = "bg-primary text-primary-content hover:bg-primary hover:text-primary-content shadow-md";

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "helper":
        return "from-primary to-primary/70";
      case "user":
        return "from-secondary to-secondary/70";
      case "admin":
        return "from-accent to-accent/70";
      default:
        return "from-neutral to-neutral/70";
    }
  };

  return (
    <div className="w-64 xl:w-80 h-full bg-base-100 border-r border-base-300 shadow-xl overflow-y-auto">
      <div className="p-4 sm:p-6 space-y-6">
        {/* HEADER */}
        <div className={`bg-gradient-to-r ${getRoleColor(user.role)} rounded-xl p-4 shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-base-100 text-primary rounded-full w-12 h-12">
                <span className="text-xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
            <div>
              <div className="text-base-100 font-bold text-lg capitalize">
                {user.role} Panel
              </div>
              <div className="text-base-100/80 text-sm">
                Welcome back!
              </div>
            </div>
          </div>
        </div>

        {/* ===== USER NAV ===== */}
        {user.role === "user" && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-base-content/50 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>

            <NavLink
              to="/user"
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/user/categories"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <Wrench size={20} />
                <span className="font-medium">Categories</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/user/booking-history"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <List size={20} />
                <span className="font-medium">Booking History</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/user/support"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} />
                <span className="font-medium">Support</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          </div>
        )}

        {/* ===== HELPER NAV ===== */}
        {user.role === "helper" && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-base-content/50 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>

            <NavLink
              to="/helper"
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/helper/history"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={20} />
                <span className="font-medium">Job History</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/helper/earnings"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <DollarSign size={20} />
                <span className="font-medium">Earnings</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/helper/support"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} />
                <span className="font-medium">Support</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          </div>
        )}

        {/* ===== ADMIN NAV ===== */}
        {user.role === "admin" && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-base-content/50 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>

            <NavLink
              to="/admin"
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/admin/users"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <Users size={20} />
                <span className="font-medium">Users</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/admin/helpers"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <Wrench size={20} />
                <span className="font-medium">Helpers</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/admin/bookings"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={20} />
                <span className="font-medium">Bookings</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>

            <NavLink
              to="/admin/support"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} />
                <span className="font-medium">Support</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;