// import React, { useState } from 'react';
// import { useLoginMutation } from '../features/api/authApi';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//     const [login] = useLoginMutation();
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({ email: '', password: '' });
//     const [error, setError] = useState('');

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await login(formData).unwrap();
//             navigate('/dashboard');
//         } catch (err) {
//             setError('Login failed. Invalid credentials.');
//         }
//     };

//     return (
//         <div className="login-container">
//             <form onSubmit={handleSubmit}>
//                 <h2>Login</h2>
//                 {error && <p className="error">{error}</p>}
//                 <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//                 <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// };

// export default Login;




import React, { useState } from 'react';
import { useLoginMutation } from '../features/api/authApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/slices/authSlice';
import { Link } from 'react-router-dom';
import Title from '../layout/Title';
import { FaGoogle } from 'react-icons/fa';
import { toast } from "react-toastify";

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
            console.log('Login user data:', userData.user);

            // Debugging the role-based navigation
            console.log('User role:', userData.user.role);

            // Navigate based on the user's role
            if (userData.user.role === 'organizer') {
                navigate('/organizer-dashboard', { replace: true });
                toast.success("Login Successfully")
            } else if (userData.user.role === 'user') {
                navigate('/', { replace: true });
                toast.success("Login Successfully")

            } else {
                setErrorMessage('Unknown role. Please contact support.');
            }

            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Login failed: Invalid email or password.');
            toast.error('Login error')
        }
    };


    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-green-500">
            <Title title={"Login Page"} />
            <form className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mb-4 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mb-6 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Password"
                    required
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button
                    onClick={googleLogin}
                    className="flex items-center justify-center w-full py-3 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                >
                    <FaGoogle className="text-xl mr-2" /> {/* Google Icon */}
                    Login with Google
                </button>

                <div className="text-center mt-4">
                    <p>Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign Up</Link></p>
                    <p className="mt-2"><Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
