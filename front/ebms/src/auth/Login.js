// import React, { useState } from 'react';
// import { useLoginMutation } from '../features/api/authApi';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setUser } from '../features/slices/authSlice';
// import { Link } from 'react-router-dom';
// import Title from '../layout/Title';
// import { FaGoogle } from 'react-icons/fa';
// import { toast } from "react-toastify";

// const Login = () => {
//     const [login, { isLoading }] = useLoginMutation();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });

//     const [errorMessage, setErrorMessage] = useState('');



    
//         const googleLogin = () => {
//             window.open("http://localhost:5000/api/auth/google", "_self");
//         };


//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const userData = await login(formData).unwrap();
//             dispatch(setUser(userData.user));
//             console.log('Login user data:', userData.user);

//             // Debugging the role-based navigation
//             console.log('User role:', userData.user.role);

//             // Navigate based on the user's role
//             if (userData.user.role === 'organizer') {
//                 navigate('/organizer-dashboard', { replace: true });
//                 toast.success("Login Successfully")
//             } else if (userData.user.role === 'user') {
//                 navigate('/', { replace: true });
//                 toast.success("Login Successfully")

//             } else {
//                 setErrorMessage('Unknown role. Please contact support.');
//             }

//             setErrorMessage('');
//         } catch (error) {
//             setErrorMessage('Login failed: Invalid email or password.');
//             toast.error('Login error')
//         }
//     };


//     return (
//         <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-green-500">
//             <Title title={"Login Page"} />
//             <form className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" onSubmit={handleSubmit}>
//                 <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
//                 {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
//                 <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="mb-4 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
//                     placeholder="Email"
//                     required
//                 />
//                 <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="mb-6 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
//                     placeholder="Password"
//                     required
//                 />
//                 <button
//                     type="submit"
//                     className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
//                 >
//                     {isLoading ? 'Logging in...' : 'Login'}
//                 </button>
//                 <button
//                     onClick={googleLogin}
//                     className="flex items-center justify-center w-full py-3 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
//                 >
//                     <FaGoogle className="text-xl mr-2" /> {/* Google Icon */}
//                     Login with Google
//                 </button>

//                 <div className="text-center mt-4">
//                     <p>Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign Up</Link></p>
//                     <p className="mt-2"><Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link></p>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Login;
import { setUserOnline, setUserOffline, setOnlineUsers } from "../features/slices/chatSlice";
import React, { useState ,useEffect } from 'react';
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
import socket,{ startPing} from '../lib/socket'; // ✅ Import your socket instance

const Login = () => {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const googleLogin = () => {
        window.open("http://localhost:5000/api/auth/google", "_self");
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

            // ✅ Connect the socket after login
            // socket.auth = { token: userData.user.token }; // Set token before connecting
            // socket.connect();
            
            // socket.on("connect", () => {
            //   console.log("✅ Socket connected after login");
            //   startPing(); // 🔁 Start pinging the server
            // });

            if (userData.user.role === 'organizer') {
                socket.auth = { token: userData.user.token }; // Set token before connecting
                socket.connect();
                
                socket.on("connect", () => {
                  console.log("✅ Socket connected after login");
                  startPing(); // 🔁 Start pinging the server
                });
                navigate('/organizer-dashboard', { replace: true });
                toast.success("Login Successfully");
            } else if (userData.user.role === 'user') {
                navigate('/', { replace: true });
                toast.success("Login Successfully");
            } else if(userData.user.role === 'vendor') {
                socket.auth = { token: userData.user.token }; // Set token before connecting
                socket.connect();
                
                socket.on("connect", () => {
                  console.log("✅ Socket connected after login");
                  startPing(); // 🔁 Start pinging the server
                });
                navigate('/vendor-dashboard', { replace: true });
                toast.success("Login Successfully");
            } 
            else {
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
