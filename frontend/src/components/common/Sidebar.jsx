import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

// Navigation items — add new pages here as the app grows
const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Patients", path: "/patients", icon: Users },
  { label: "Doctors", path: "/doctors", icon: Stethoscope },
  { label: "Appointments", path: "/appointments", icon: Calendar },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-56 bg-[#0F172A] flex flex-col h-full flex-shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center">
            <Activity size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-base tracking-tight">
            VYDHYA
          </span>
        </div>
        <p className="text-secondary text-xs ml-9">connects you</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest px-2 mb-3">
          Main Menu
        </p>
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "bg-secondary/20 text-white border-l-2 border-secondary"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <div className="pt-4">
          <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest px-2 mb-3">
            System
          </p>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "bg-secondary/20 text-white border-l-2 border-secondary"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Settings size={16} />
            Settings
          </NavLink>
        </div>
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-medium truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-white/40 text-[10px] truncate">
              {user?.email || "admin@vydhya.com"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-150"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
