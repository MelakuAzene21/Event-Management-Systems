// import React, { useState } from 'react';
// import { useSignupMutation } from '../features/api/authApi';
// import { useNavigate, Link } from 'react-router-dom';
// import '../index.css';
// import Title from '../layout/Title';
// import { toast } from 'react-toastify';

// const Signup = () => {
//     const [signup] = useSignupMutation();
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//     });

//     const [errors, setErrors] = useState({}); // State for validation errors
//     const [serverError, setServerError] = useState(''); // State for server error message

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.name.trim()) {
//             newErrors.name = 'Name is required.';
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email address.';
//         }

//         if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters long.';
//         }

//         return newErrors;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setServerError(''); // Clear previous server error
//         const validationErrors = validateForm();
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }

//         try {
//             await signup(formData).unwrap();
//             toast.success("Registereed Successfully")
//             navigate('/login');
//         } catch (error) {
//             if (error.data && error.data.message === 'User already exists') {
//                 setServerError('An account with this email already exists. Please try logging in.');
//             } else {
//                 setServerError('Signup failed. Please try again later.');
//             }
//         }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-green-500">
//             <Title title={"Register Page"} />
//             <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
//                 <h2 className="text-2xl font-bold mb-4">Signup</h2>

//                 {/* Display server error */}
//                 {serverError && <p className="text-red-500 mb-4">{serverError}</p>}

//                 {/* Display validation errors */}
//                 {errors.name && <p className="text-red-500 mb-2">{errors.name}</p>}
//                 <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className={`mb-2 p-2 w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
//                     placeholder="Name"
//                     required
//                 />

//                 {errors.email && <p className="text-red-500 mb-2">{errors.email}</p>}
//                 <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`mb-2 p-2 w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
//                     placeholder="Email"
//                     required
//                 />

//                 {errors.password && <p className="text-red-500 mb-2">{errors.password}</p>}
//                 <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`mb-4 p-2 w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
//                     placeholder="Password"
//                     required
//                 />

//                 <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//                     Signup
//                 </button>

//                 <p className="font-bold mt-4">
//                     Already have an account?
//                     <Link to="/login" className="text-blue-500 font-serif"> Login</Link>
//                 </p>
//             </form>
//         </div>
//     );
// };

// export default Signup;



import React, { useState } from 'react';
import { useSignupMutation } from '../features/api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';
import Title from '../layout/Title';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import signupImage from '../assets/signupImage.svg'; // Adjust path as necessary

const Signup = () => {
    const [signup] = useSignupMutation();
    const navigate = useNavigate();

    // State for role selection and form steps
    const [selectedRole, setSelectedRole] = useState('Attendee');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        businessName: '', // For Vendor
        pastExperience: '', // For Organizer
        category: '', // For Organizer
        services: [], // For Vendor
        portfolioLink: '', // For Vendor
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateBasicInfo = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';
        if (selectedRole !== 'Attendee' && !formData.phone.trim()) newErrors.phone = 'Phone number is required.';
        if (selectedRole === 'Vendor' && !formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
        return newErrors;
    };

    const validateRoleDetails = () => {
        const newErrors = {};
        if (selectedRole === 'Organizer') {
            if (!formData.pastExperience.trim()) newErrors.pastExperience = 'Past experience is required.';
            if (!formData.category) newErrors.category = 'Event category is required.';
        }
        if (selectedRole === 'Vendor') {
            if (formData.services.length === 0) newErrors.services = 'At least one service must be selected.';
            if (!formData.portfolioLink.trim()) newErrors.portfolioLink = 'Portfolio link is required.';
        }
        return newErrors;
    };

    const handleNextStep = () => {
        const validationErrors = validateBasicInfo();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (selectedRole === 'Attendee') {
            const validationErrors = validateBasicInfo();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        } else if (step === 2) {
            const validationErrors = validateRoleDetails();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }

        try {
            const payload = {
                ...formData,
                role: selectedRole.toLowerCase(),
                status: selectedRole === 'Attendee' ? 'active' : 'pending', // Set status for admin approval
            };
            await signup(payload).unwrap();
            toast.success(
                selectedRole === 'Attendee'
                    ? 'Registered Successfully! Please verify your email.'
                    : 'Registration submitted! Awaiting admin approval.'
            );
            navigate(selectedRole === 'Attendee' ? '/login' : '/pending-approval');
        } catch (error) {
            if (error.data && error.data.message === 'User already exists') {
                setServerError('An account with this email already exists. Please try logging in.');
            } else {
                setServerError('Signup failed. Please try again later.');
            }
        }
    };

    const roles = [
        { name: 'Attendee', icon: <FaTicketAlt />, desc: 'Discover & join events' },
        { name: 'Organizer', icon: <FaCalendarAlt />, desc: 'Create & manage events' },
        { name: 'Vendor', icon: <FaBuilding />, desc: 'Offer services to organizers' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <Title title={"Register Page"} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Left Side - Illustration */}
                <div className="hidden md:flex items-center justify-center bg-gray-100 p-8">
                    <img
                        src={signupImage}
                        alt="Signup Illustration"
                        className="max-w-full h-auto"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="p-10 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Join Our Event Platform</h1>
                    <p className="text-center text-gray-500 mb-6">Select your role to get started</p>

                    {/* Role Selection Tabs */}
                    <div className="flex justify-center mb-8">
                        {roles.map((role) => (
                            <button
                                key={role.name}
                                onClick={() => {
                                    setSelectedRole(role.name);
                                    setStep(1);
                                    setErrors({});
                                    setServerError('');
                                }}
                                className={`px-6 py-3 mx-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${selectedRole === role.name
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                <span className="text-lg">{role.icon}</span>
                                <span>{role.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Progress Indicator for Organizer/Vendor */}
                    {selectedRole !== 'Attendee' && (
                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <span className={`text-sm ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    Step 1: Basic Info
                                </span>
                                <span className={`text-sm ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    Step 2: Role Details
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: step === 1 ? '50%' : '100%' }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-4">{selectedRole} Registration</h2>
                        <p className="text-gray-500 mb-4">Enter your basic information to get started</p>

                        {serverError && <p className="text-red-500 mb-4">{serverError}</p>}

                        {/* Step 1: Basic Info */}
                        {(step === 1 || selectedRole === 'Attendee') && (
                            <>
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Full Name"
                                    required
                                />

                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Email"
                                    required
                                />

                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Password"
                                    required
                                />

                                {selectedRole !== 'Attendee' && (
                                    <>
                                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Phone Number"
                                            required
                                        />
                                        {selectedRole === 'Vendor' && (
                                            <>
                                                {errors.businessName && (
                                                    <p className="text-red-500 text-sm">{errors.businessName}</p>
                                                )}
                                                <input
                                                    type="text"
                                                    name="businessName"
                                                    value={formData.businessName}
                                                    onChange={handleChange}
                                                    className={`w-full p-3 border rounded-md ${errors.businessName ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Business Name"
                                                    required
                                                />
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {/* Step 2: Role-Specific Details */}
                        {step === 2 && selectedRole === 'Organizer' && (
                            <>
                                {errors.pastExperience && (
                                    <p className="text-red-500 text-sm">{errors.pastExperience}</p>
                                )}
                                <textarea
                                    name="pastExperience"
                                    value={formData.pastExperience}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md ${errors.pastExperience ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Past Event Experience"
                                    required
                                />

                                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    required
                                >
                                    <option value="">Select Event Category</option>
                                    <option value="Music">Music</option>
                                    <option value="Tech">Tech</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </>
                        )}

                        {step === 2 && selectedRole === 'Vendor' && (
                            <>
                                {errors.services && <p className="text-red-500 text-sm">{errors.services}</p>}
                                <div className="space-y-2">
                                    <label className="block text-gray-700">Services Offered</label>
                                    {['Catering', 'Photography', 'Equipment Rental'].map((service) => (
                                        <label key={service} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="services"
                                                value={service}
                                                checked={formData.services.includes(service)}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        services: prev.services.includes(value)
                                                            ? prev.services.filter((s) => s !== value)
                                                            : [...prev.services, value],
                                                    }));
                                                }}
                                                className="mr-2"
                                            />
                                            {service}
                                        </label>
                                    ))}
                                </div>

                                {errors.portfolioLink && (
                                    <p className="text-red-500 text-sm">{errors.portfolioLink}</p>
                                )}
                                <input
                                    type="url"
                                    name="portfolioLink"
                                    value={formData.portfolioLink}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md ${errors.portfolioLink ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Portfolio Link"
                                    required
                                />
                            </>
                        )}

                        {/* Buttons */}
                        {selectedRole === 'Attendee' ? (
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 font-medium shadow-sm"
                            >
                                Create Account
                            </button>
                        ) : step === 1 ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 font-medium shadow-sm"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 font-medium shadow-sm"
                            >
                                Submit for Approval
                            </button>
                        )}
                    </form>

                    {/* Login Link */}
                    <p className="text-center mt-6 text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;