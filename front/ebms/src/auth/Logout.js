import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../features/slices/authSlice';
import { RxExit, RxPerson } from 'react-icons/rx';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { useState } from 'react';

import socket,{ stopPing} from '../lib/socket'; // ✅ Import your socket instance
import { toast } from 'react-toastify';
import { useLogoutMutation } from '../features/api/authApi';
import { FaUsers } from "react-icons/fa";
export default function Logout() {
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const notifications = useSelector((state) => state.notifications.notifications);
    const [logouting] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logouting().unwrap(); 
            dispatch(logoutAction());
            toast.success('Logged out successfully');
            socket.disconnect();
            stopPing();
            navigate('/login');
        } catch (err) {
            console.error('Failed to log out:', err);
        }
    };

    return (
        <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-md  flex justify-between items-center px-4 sm:px-6 py-3">
            {/* Logo or Brand (optional) */}
            <div className="text-lg font-bold text-gray-800">EventPro</div>

            {/* Right Side: Notifications + User Menu */}
            {user && (
                <div className="flex items-center gap-4 sm:gap-6">
                    <div >
                        <Link to='/vendors'>
                        <FaUsers/>
                        </Link>
                    </div>
                    
                    
                    {/* Notifications */}
                    <div className="relative">
                        <Link to="/show-not" className="text-gray-700 hover:text-black">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11.5a6.5 6.5 0 10-13 0v2.657c0 .597-.237 1.167-.656 1.586L3 17h5m7 0a3.001 3.001 0 01-6 0m6 0H9"
                                />
                            </svg>
                        </Link>
                        {notifications.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative flex items-center gap-2">
                        <RxPerson className="w-6 h-6 text-gray-700 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                        <BsFillCaretDownFill
                            className="w-4 h-4 text-gray-700 cursor-pointer md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        />

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute top-10 right-0 w-48 bg-white shadow-lg rounded-lg py-2 z-20">
                                <Link
                                    to="/useraccount"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <RxExit className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}