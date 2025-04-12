
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import Title from '../layout/Title';
// import Spinner from '../layout/Spinner'
// import { toast } from 'react-toastify';
// const ForgotPassword = () => {
//     const [email, setEmail] = useState('');
//     const [message, setMessage] = useState('');
//     const [loading, setLoading] = useState(false)
//     const BASE_URL =
//         process.env.NODE_ENV === 'production'
//             ? 'https://e-market-fnu1.onrender.com'
//             : process.env.REACT_APP_API_URL || 'http://localhost:5000';
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
//             setMessage(response.data.message);
//             toast.success("Reset Email Link Successfully Sent  ")
//             setLoading(false);
//         } catch (error) {
//             console.error("error generated duri g forgot password" ,error)
//             setMessage('Error: Unable to send reset email.');
//             toast.error('Unable to send reset email')
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-green-500">
//             <Title title={"Forgot Password"} />
//             <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//                 <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Forgot Password</h2>
//                 {message && <p className="text-blue-500  text-lg italic text-center mb-4">{message}</p>}
//                 <input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="mb-4 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
//                     required
//                 />
//                 <button
//                     type="submit"
//                     className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
//                     onClick={() => setLoading(!loading)}
//                 >
//                      {loading ? <Spinner /> : 'Get Reset Link'}
  
//                 </button>
//                 <div className="text-center mt-4">
//                     <p>Remembered your password? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default ForgotPassword;


import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../features/api/authApi';
import { Link } from 'react-router-dom';
import Title from '../layout/Title';
import { toast } from 'react-toastify';
import forgotpass from '../assets/forgotpass.svg'; // Adjust path as necessary

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await forgotPassword(email).unwrap();
            setMessage(response.message);
            toast.success("Reset Link Sent Successfully!");
        } catch (error) {
            console.error("Error during forgot password:", error);
            setMessage('Unable to send reset email. Please try again.');
            toast.error('Failed to send reset email.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <Title title={"Forgot Password"} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Left Side - Illustration */}
                <div className="hidden md:flex items-center justify-center bg-gray-100 p-8">
                    <img
                        src={forgotpass}
                        alt="Forgot Password Illustration"
                        className="max-w-full h-auto"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        Forgot Password
                    </h2>
                    <p className="text-center text-gray-500 mb-8">
                        Enter your email to receive a password reset link.
                    </p>

                    {/* Success/Error Message */}
                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-md text-center text-sm font-medium ${message.includes('Error') || message.includes('Unable')
                                    ? 'bg-red-50 text-red-600'
                                    : 'bg-green-50 text-green-600'
                                }`}
                        >
                            {message.includes('Error') || message.includes('Unable') ? (
                                message
                            ) : (
                                <span>
                                    🎉 <span className="font-semibold">Success!</span> A reset link has been sent to{' '}
                                    <span className="italic">{email}</span>. Check your inbox!
                                </span>
                            )}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-700"
                                required
                            />
                        </div>

                        {/* Submit Button with Spinner */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 font-medium flex items-center justify-center shadow-sm disabled:bg-blue-400"
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
                                    <span>Sending...</span>
                                </div>
                            ) : (
                                'Get Reset Link'
                            )}
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600 text-sm">
                            Remembered your password?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;