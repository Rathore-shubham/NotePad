import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import img from "../assets/profile.webp";

const Navbar = () => {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const [user, setUser] = useState(null);
  const defaultAvatar = img;

  useEffect(() => {
    if (user?.profileImage) {
      console.log("Profile Image:", user.profileImage);
    } else {
      console.log("No profile image found, using default.");
    }
  }, [user]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 shadow-lg ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 dark:bg-blue-400 rounded-lg">
              <FileText className="w-5 h-5 text-white dark:text-black" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">NotePad</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Write, organize, create
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="px-3 py-1 border border-gray-400 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>

            <img
              src={
                user?.profileImage && user.profileImage.startsWith("http")
                  ? user.profileImage
                  : defaultAvatar
              }
              alt="User"
              className="w-9 h-9 rounded-full object-cover border border-gray-600 transition"
            />

            <button
              onClick={handleLogout}
              className={`flex items-center h-9 px-3 rounded-md text-sm font-medium  transition-colors${theme === 'dark' ? 'text-white' : ''}`}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
