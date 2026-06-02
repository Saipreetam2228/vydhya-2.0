import { useLocation } from "react-router-dom";
import { Sun, Moon, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

// Maps URL paths to readable page titles
const pageTitles = {
  "/": "Dashboard",
  "/patients": "Patient Management",
  "/doctors": "Doctor Management",
  "/appointments": "Appointment Management",
  "/settings": "Settings",
};

export default function Topbar() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || "VYDHYA";

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
      {/* Page title */}
      <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {pageTitle}
      </h1>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium hidden md:block">
            {user?.name || "Admin"}
          </span>
        </div>
      </div>
    </div>
  );
}
