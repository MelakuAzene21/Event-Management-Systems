import { setUserOnline, setUserOffline, setOnlineUsers } from "../features/slices/chatSlice";
import React, { useState, useEffect } from 'react';
import { useLoginMutation } from '../features/api/authApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/slices/authSlice';
import { Link } from 'react-router-dom';
import Title from '../layout/Title';
import { FaGoogle } from 'react-icons/fa';
import { toast } from "react-toastify";
import login_illustration from '../assets/login_illustration.svg'; // Adjust the path as necessary
import { fetchUserChats } from '../features/slices/chatSlice'; // adjust path if needed
import socket, { startPing } from '../lib/socket'; // ✅ Import your socket instance

const Login = () => {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? 'https://event-management-systems-gj91.onrender.com'
            : 'http://localhost:5000';
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const googleLogin = () => {
        window.open(`${baseUrl}/api/auth/google`, "_self");
      };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(formData).unwrap();
            dispatch(setUser(userData.user));
            dispatch(fetchUserChats());
            console.log('Login user data:', userData.user);
            console.log('User role:', userData.user.role);

            // Check user status
            if (userData.user.status === 'blocked') {
                toast.error("You are blocked and cannot log in. Please contact support.", {
                    position: "top-right",
                    autoClose: 2000,
                });
                return;}

            // ✅ Connect the socket after login for active users
            if (userData.user.role === 'organizer' || userData.user.role === 'vendor') {
                socket.auth = { token: userData.user.token }; // Set token before connecting
                socket.connect();

                socket.on("connect", () => {
                    console.log("✅ Socket connected after login");
                    startPing(); // 🔁 Start pinging the server
                });
            }

            // Proceed with role-based navigation for active users
            if (userData.user.role === 'organizer') {
                navigate('/organizer-dashboard', { replace: true });
                toast.success("Login Successfully");
            } else if (userData.user.role === 'user') {
                navigate('/', { replace: true });
                toast.success("Login Successfully");
            } else if (userData.user.role === 'vendor') {
                navigate('/vendor-dashboard', { replace: true });
                toast.success("Login Successfully");
            } else {
                setErrorMessage('Unknown role. Please contact support.');
            }
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Login failed: Invalid email or password.');
            toast.error('Login error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <Title title={"Login Page"} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Left Side - Illustration */}
                <div className="hidden md:flex items-center justify-center bg-gray-100 p-8">
                    <img
                        src={login_illustration}
                        alt="Event Illustration"
                        className="max-w-full h-auto"
                    />
                </div>

                {/* Right Side - Login Form */}
                <div className="p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        Welcome Back
                    </h2>
                    {errorMessage && (
                        <p className="text-red-500 text-center mb-6 bg-red-50 p-3 rounded-md text-sm font-medium">
                            {errorMessage}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-700"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-700"
                                placeholder="Password"
                                required
                            />
                        </div>

                        {/* Login Button with Spinner */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 font-medium flex items-center justify-center shadow-sm"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Google Login Button */}
                        <button
                            onClick={googleLogin}
                            className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 font-medium flex items-center justify-center shadow-sm"
                        >
                            <FaGoogle className="text-lg mr-2 text-red-500" />
                            Sign in with Google
                        </button>
                    </form>

                    {/* Links */}
                    <div className="text-center mt-6 space-y-3">
                        <p className="text-gray-600 text-sm">
                            Don’t have an account?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline font-medium">
                                Sign Up
                            </Link>
                        </p>
                        <p className="text-sm">
                            <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
                                Forgot Password?
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;