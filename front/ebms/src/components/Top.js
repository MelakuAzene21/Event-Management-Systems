import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaBell,
  FaSignOutAlt,
  FaCaretDown,
  FaBars,
  FaCommentDots,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import { logout as logoutAction } from '../features/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../features/api/authApi';
import socket, { stopPing } from '../lib/socket'; // ✅ Import your socket instance


const Top = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(null);
  const dropdownRef = useRef(null);
  const currentUser = useSelector(state => state.auth.user);

  const [logouting] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logouting().unwrap();
      // dispatch(logoutAction());
      stopPing();
      socket.disconnect();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 fixed sm:p-4 z-10 ">
        <div className="max-w-7xl flex items-center justify-between px-4">
          <div className="flex items-center">
              EBMS
          </div>


          <div className="flex items-center gap-6 sm:gap-10">
            <ul className="flex gap-4 sm:gap-8 items-center">
              <li>
                <Link
                  to="/vendor-dashboard"
                  className="flex flex-col items-center text-gray-600 hover:text-black p-1 sm:p-2"
                >
                  <div className="relative">
                    <FaHome className="text-lg sm:text-xl md:text-2xl" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] md:text-[12px] text-gray-500 mt-1">
                    Home
                  </span>
                </Link>
              </li>
              

              {/* ✅ Messaging Icon */}
              <li>
                <Link
                  to="/vendor-dashboard/messages"
                  className="flex flex-col items-center text-gray-600 hover:text-black p-1 sm:p-2"
                >
                  <div className="relative">
                    <FaCommentDots className="text-lg sm:text-xl md:text-2xl" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] md:text-[12px] text-gray-500 mt-1">
                    Messaging
                  </span>
                </Link>
              </li>
              </ul>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                aria-label="Toggle profile dropdown"
                aria-expanded={isDropdownOpen}
                className="flex items-center gap-1 sm:gap-2 p-2 hover:bg-gray-100 rounded-lg z-50"
              >
                <img
                  src={currentUser?.avatar}
                  alt="Profile"
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border"
                />
                <FaCaretDown className="text-gray-600 text-xs sm:text-sm" />
              </button>

              {isDropdownOpen && (
                   <div className="absolute right-0 mt-2 w-60 sm:w-72 bg-white shadow-sm rounded-lg p-3 border border-gray-300 z-50">
                  <div className="p-3 sm:p-4 text-center">
                    <img
                      src={currentUser?.avatar}
                      alt="Profile"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto"
                    />
                    <p className="font-bold text-sm sm:text-lg mt-2">
                      {currentUser?.name}                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                       {currentUser?.service}  
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/vendor-dashboard/profile")}
                    className="block text-center border border-blue-600 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 w-full transition-all duration-200"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 flex items-center gap-2 font-medium mt-3"
                  >
                    <FaSignOutAlt className="text-sm sm:text-base" /> logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isSidebarOpen && <Sidebar closeSidebar={() => setSidebarOpen(false)} />}
    </>
  );
};

export default Top;