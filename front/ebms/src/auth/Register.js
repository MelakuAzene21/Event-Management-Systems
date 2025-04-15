// import React, { useState } from 'react';
// import { useSignupMutation } from '../features/api/authApi';
// import { useNavigate, Link } from 'react-router-dom';
// import '../index.css';
// import Title from '../layout/Title';
// import { toast } from 'react-toastify';
// import { FaTicketAlt, FaBuilding, FaPlus, FaTrash, FaUsers } from 'react-icons/fa';
// import signupImage from '../assets/signupImage.svg';

    // const Signup = () => {
    // const [signup, { isLoading }] = useSignupMutation();
    // const navigate = useNavigate();

    // const [selectedRole, setSelectedRole] = useState('Attendee');
    // const [step, setStep] = useState(1); // Tracks current step for multi-step forms
    // const [formData, setFormData] = useState({
    //     name: '',
    //     email: '',
    //     password: '',
    //     serviceProvided: '',
    //     price: '',
    //     description: '',
    //     availability: '',
    //     location: '',
    //     portfolio: [],
    //     avatar: null,
    //     docs: [],
    //     phoneNumber: '',
    //     organizationName: '',
    //     website: '',
    //     socialLinks: [],
    //     about: '',
    //     experience: '',
    // });
    // const [errors, setErrors] = useState({});
    // const [serverError, setServerError] = useState('');

    // const handleChange = (e) => {
    //     const { name, value, type, files } = e.target;
    //     setErrors({ ...errors, [name]: null });
    //     if (type === 'file') {
    //         if (name === 'avatar') {
    //             setFormData({ ...formData, avatar: files[0] });
    //         } else if (name === 'docs') {
    //             setFormData({ ...formData, docs: Array.from(files) });
    //         }
    //     } else if (name === 'socialLinks') {
    //         setFormData({ ...formData, socialLinks: value.split(',').map((item) => item.trim()).filter(Boolean) });
    //     } else {
    //         setFormData({ ...formData, [name]: value });
    //     }
    // };

    // const handlePortfolioChange = (index, field, value) => {
    //     const updatedPortfolio = [...formData.portfolio];
    //     updatedPortfolio[index] = { ...updatedPortfolio[index], [field]: value };
    //     setFormData({ ...formData, portfolio: updatedPortfolio });
    //     setErrors({ ...errors, [`portfolio_${index}`]: null, [`portfolio_image_${index}`]: null });
    // };

    // const addPortfolioItem = () => {
    //     setFormData({
    //         ...formData,
    //         portfolio: [...formData.portfolio, { title: '', image: '', description: '' }],
    //     });
    // };

    // const removePortfolioItem = (index) => {
    //     setFormData({
    //         ...formData,
    //         portfolio: formData.portfolio.filter((_, i) => i !== index),
    //     });
    //     setErrors({ ...errors, [`portfolio_${index}`]: null, [`portfolio_image_${index}`]: null });
    // };

    // const isValidUrl = (url) => {
    //     try {
    //         new URL(url);
    //         return true;
    //     } catch {
    //         return false;
    //     }
    // };

    // const validateStep = () => {
    //     const newErrors = {};

    //     if (selectedRole === 'Attendee' || step === 1) {
    //         if (!formData.name || formData.name.trim() === '') {
    //             newErrors.name = 'Name is required.';
    //         }
    //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //         if (!formData.email || !emailRegex.test(formData.email.trim())) {
    //             newErrors.email = 'Please enter a valid email address.';
    //         }
    //         if (!formData.password || formData.password.length < 6) {
    //             newErrors.password = 'Password must be at least 6 characters long.';
    //         }
    //     }

    //     if (selectedRole === 'Vendor' && step === 2) {
    //         if (!formData.serviceProvided || formData.serviceProvided.trim() === '') {
    //             newErrors.serviceProvided = 'Please select a service.';
    //         }
    //         if (!formData.location || formData.location.trim() === '') {
    //             newErrors.location = 'Location is required.';
    //         }
    //     }

    //     if (selectedRole === 'Vendor' && step === 3) {
    //         formData.portfolio.forEach((item, index) => {
    //             if (item.title && (!item.image || !item.description)) {
    //                 newErrors[`portfolio_${index}`] =
    //                     'All fields (title, image, description) are required if title is provided.';
    //             }
    //             if (item.image && !isValidUrl(item.image)) {
    //                 newErrors[`portfolio_image_${index}`] = 'Please enter a valid image URL.';
    //             }
    //         });
    //         if (formData.avatar && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(formData.avatar.type)) {
    //             newErrors.avatar = 'Avatar must be a valid image (JPG, PNG, WEBP, AVIF).';
    //         }
    //         if (formData.docs.length > 0) {
    //             formData.docs.forEach((doc, index) => {
    //                 if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(doc.type)) {
    //                     newErrors[`doc_${index}`] = `Document ${index + 1} must be a valid image or PDF.`;
    //                 }
    //             });
    //         }
    //     }

    //     if (selectedRole === 'Organizer' && step === 2) {
    //         if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
    //             newErrors.phoneNumber = 'Phone number is required.';
    //         }
    //         if (!formData.organizationName || formData.organizationName.trim() === '') {
    //             newErrors.organizationName = 'Organization name is required.';
    //         }
    //         if (!formData.location || formData.location.trim() === '') {
    //             newErrors.location = 'Location is required.';
    //         }
    //         if (!formData.about || formData.about.trim() === '') {
    //             newErrors.about = 'About section is required.';
    //         }
    //     }

    //     if (selectedRole === 'Organizer' && step === 3) {
    //         if (formData.docs.length === 0) {
    //             newErrors.docs = 'At least one legal document is required.';
    //         } else {
    //             formData.docs.forEach((doc, index) => {
    //                 if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(doc.type)) {
    //                     newErrors[`doc_${index}`] = `Document ${index + 1} must be a valid image or PDF.`;
    //                 }
    //             });
    //         }
    //         if (formData.website && !isValidUrl(formData.website)) {
    //             newErrors.website = 'Please enter a valid URL.';
    //         }
    //         if (formData.avatar && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(formData.avatar.type)) {
    //             newErrors.avatar = 'Avatar must be a valid image (JPG, PNG, WEBP, AVIF).';
    //         }
    //     }

    //     return newErrors;
    // };

    // const validateFullForm = () => {
    //     const newErrors = {};
    //     if (!formData.name || formData.name.trim() === '') {
    //         newErrors.name = 'Name is required.';
    //     }
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!formData.email || !emailRegex.test(formData.email.trim())) {
    //         newErrors.email = 'Please enter a valid email address.';
    //     }
    //     if (!formData.password || formData.password.length < 6) {
    //         newErrors.password = 'Password must be at least 6 characters long.';
    //     }

    //     if (selectedRole === 'Vendor') {
    //         if (!formData.serviceProvided || formData.serviceProvided.trim() === '') {
    //             newErrors.serviceProvided = 'Please select a service.';
    //         }
    //         if (!formData.location || formData.location.trim() === '') {
    //             newErrors.location = 'Location is required.';
    //         }
    //         formData.portfolio.forEach((item, index) => {
    //             if (item.title && (!item.image || !item.description)) {
    //                 newErrors[`portfolio_${index}`] =
    //                     'All fields (title, image, description) are required if title is provided.';
    //             }
    //             if (item.image && !isValidUrl(item.image)) {
    //                 newErrors[`portfolio_image_${index}`] = 'Please enter a valid image URL.';
    //             }
    //         });
    //         if (formData.avatar && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(formData.avatar.type)) {
    //             newErrors.avatar = 'Avatar must be a valid image (JPG, PNG, WEBP, AVIF).';
    //         }
    //         if (formData.docs.length > 0) {
    //             formData.docs.forEach((doc, index) => {
    //                 if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(doc.type)) {
    //                     newErrors[`doc_${index}`] = `Document ${index + 1} must be a valid image or PDF.`;
    //                 }
    //             });
    //         }
    //     }

    //     if (selectedRole === 'Organizer') {
    //         if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
    //             newErrors.phoneNumber = 'Phone number is required.';
    //         }
    //         if (!formData.organizationName || formData.organizationName.trim() === '') {
    //             newErrors.organizationName = 'Organization name is required.';
    //         }
    //         if (!formData.location || formData.location.trim() === '') {
    //             newErrors.location = 'Location is required.';
    //         }
    //         if (!formData.about || formData.about.trim() === '') {
    //             newErrors.about = 'About section is required.';
    //         }
    //         if (formData.docs.length === 0) {
    //             newErrors.docs = 'At least one legal document is required.';
    //         } else {
    //             formData.docs.forEach((doc, index) => {
    //                 if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(doc.type)) {
    //                     newErrors[`doc_${index}`] = `Document ${index + 1} must be a valid image or PDF.`;
    //                 }
    //             });
    //         }
    //         if (formData.website && !isValidUrl(formData.website)) {
    //             newErrors.website = 'Please enter a valid URL.';
    //         }
    //         if (formData.avatar && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(formData.avatar.type)) {
    //             newErrors.avatar = 'Avatar must be a valid image (JPG, PNG, WEBP, AVIF).';
    //         }
    //     }

    //     return newErrors;
    // };

    // const handleNext = (e) => {
    //     e.preventDefault(); // Explicitly prevent form submission
    //     console.log(`Navigating to step ${step + 1} for ${selectedRole}`); // Debug log
    //     const validationErrors = validateStep();
    //     if (Object.keys(validationErrors).length > 0) {
    //         setErrors(validationErrors);
    //         console.log('Validation errors:', validationErrors); // Debug log
    //         return;
    //     }
    //     setErrors({});
    //     setStep(step + 1);
    // };

    // const handleBack = () => {
    //     console.log(`Navigating back to step ${step - 1}`); // Debug log
    //     setErrors({});
    //     setStep(step - 1);
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setServerError('');
    //     console.log('Submitting form for', selectedRole); // Debug log

    //     const validationErrors = validateFullForm();
    //     if (Object.keys(validationErrors).length > 0) {
    //         setErrors(validationErrors);
    //         console.log('Full form validation errors:', validationErrors); // Debug log
    //         return;
    //     }

    //     try {
    //         const formDataToSend = new FormData();
    //         formDataToSend.append('name', formData.name.trim());
    //         formDataToSend.append('email', formData.email.trim());
    //         formDataToSend.append('password', formData.password);
    //         formDataToSend.append('role', selectedRole === 'Attendee' ? 'user' : selectedRole.toLowerCase());

    //         if (selectedRole === 'Vendor') {
    //             formDataToSend.append('serviceProvided', formData.serviceProvided || '');
    //             formDataToSend.append('price', formData.price || '');
    //             formDataToSend.append('description', formData.description || '');
    //             formDataToSend.append('availability', formData.availability || '');
    //             formDataToSend.append('location', formData.location || '');
    //             if (formData.portfolio.length > 0) {
    //                 formDataToSend.append('portfolio', JSON.stringify(formData.portfolio));
    //             }
    //             if (formData.avatar) {
    //                 formDataToSend.append('avatar', formData.avatar);
    //             }
    //             if (formData.docs.length > 0) {
    //                 formData.docs.forEach((doc) => formDataToSend.append('docs', doc));
    //             }
    //         }

    //         if (selectedRole === 'Organizer') {
    //             formDataToSend.append('phoneNumber', formData.phoneNumber || '');
    //             formDataToSend.append('organizationName', formData.organizationName || '');
    //             formDataToSend.append('location', formData.location || '');
    //             formDataToSend.append('website', formData.website || '');
    //             formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
    //             formDataToSend.append('about', formData.about || '');
    //             formDataToSend.append('experience', formData.experience || '');
    //             if (formData.avatar) {
    //                 formDataToSend.append('avatar', formData.avatar);
    //             }
    //             if (formData.docs.length > 0) {
    //                 formData.docs.forEach((doc) => formDataToSend.append('docs', doc));
    //             }
    //         }

    //         console.log('Sending payload to API'); // Debug log
    //         await signup(formDataToSend).unwrap();
    //         toast.success('Registered Successfully! Please verify your email.');
    //         navigate('/login');
    //     } catch (error) {
    //         console.error('Signup error:', error);
    //         setServerError(error.data?.message || 'Signup failed. Please try again later.');
    //     }
    // };

    // const roles = [
    //     { name: 'Attendee', icon: <FaTicketAlt />, desc: 'Discover & join events' },
    //     { name: 'Vendor', icon: <FaBuilding />, desc: 'Offer services to organizers' },
    //     { name: 'Organizer', icon: <FaUsers />, desc: 'Create and manage events' },
    // ];

//     const getStepTitle = () => {
//         if (selectedRole === 'Attendee') return 'Basic Information';
//         if (selectedRole === 'Vendor') {
//             return ['Basic Information', 'Service Details', 'Media & Documents'][step - 1];
//         }
//         if (selectedRole === 'Organizer') {
//             return ['Basic Information', 'Organization Details', 'Additional Info & Documents'][step - 1];
//         }
//         return '';
//     };

//     const renderProgressBar = () => {
//         if (selectedRole === 'Attendee') return null;
//         const totalSteps = 3;
//         return (
//             <div className="flex justify-between mb-6">
//                 {Array.from({ length: totalSteps }, (_, i) => (
//                     <div key={i} className="flex-1 flex flex-col items-center">
//                         <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step > i + 1 ? 'bg-blue-600 text-white' : step === i + 1 ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-600'
//                                 }`}
//                         >
//                             {step > i + 1 ? '✓' : i + 1}
//                         </div>
//                         <span className="text-xs mt-1 text-gray-600">
//                             {selectedRole === 'Vendor' ? ['Basic Info', 'Service', 'Media'][i] : ['Basic Info', 'Organization', 'Documents'][i]}
//                         </span>
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
//             <Title title={'Register Page'} />
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
//                 <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200 p-8">
//                     <img
//                         src={signupImage}
//                         alt="Signup Illustration"
//                         className="max-w-full h-auto transform hover:scale-105 transition-transform duration-300"
//                     />
//                 </div>
//                 <div className="p-6 sm:p-10 flex flex-col justify-center">
//                     <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-3 text-gray-800">Create Your Account</h1>
//                     <p className="text-center text-gray-600 mb-8">Choose your role to join our event platform</p>
//                     <div className="flex justify-center mb-8 space-x-4">
//                         {roles.map((role) => (
//                             <button
//                                 key={role.name}
//                                 onClick={() => {
//                                     console.log(`Switching to role: ${role.name}`); // Debug log
//                                     setSelectedRole(role.name);
//                                     setStep(1);
//                                     setErrors({});
//                                     setServerError('');
//                                     setFormData({
//                                         name: '',
//                                         email: '',
//                                         password: '',
//                                         serviceProvided: '',
//                                         price: '',
//                                         description: '',
//                                         availability: '',
//                                         location: '',
//                                         portfolio: [],
//                                         avatar: null,
//                                         docs: [],
//                                         phoneNumber: '',
//                                         organizationName: '',
//                                         website: '',
//                                         socialLinks: [],
//                                         about: '',
//                                         experience: '',
//                                     });
//                                 }}
//                                 className={`px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 ${selectedRole === role.name ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                     }`}
//                             >
//                                 <span className="text-xl">{role.icon}</span>
//                                 <span>{role.name}</span>
//                             </button>
//                         ))}
//                     </div>
//                     <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
//                         {serverError && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">{serverError}</p>}
//                         {renderProgressBar()}
//                         <h2 className="text-xl font-semibold text-gray-800">{getStepTitle()}</h2>
//                         {(selectedRole === 'Attendee' || step === 1) && (
//                             <div className="space-y-4">
//                                 <div>
//                                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Full Name <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="name"
//                                         name="name"
//                                         value={formData.name}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         placeholder="Enter your full name"
//                                         required
//                                     />
//                                     {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Email Address <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         placeholder="Enter your email"
//                                         required
//                                     />
//                                     {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Password <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="password"
//                                         id="password"
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         placeholder="Enter your password"
//                                         required
//                                     />
//                                     {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//                                 </div>
//                             </div>
//                         )}
//                         {selectedRole === 'Vendor' && step === 2 && (
//                             <div className="space-y-4">
//                                 <div>
//                                     <label htmlFor="serviceProvided" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Service Provided <span className="text-red-500">*</span>
//                                     </label>
//                                     <select
//                                         id="serviceProvided"
//                                         name="serviceProvided"
//                                         value={formData.serviceProvided}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.serviceProvided ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         required
//                                     >
//                                         <option value="">Select a service</option>
//                                         <option value="photographer">Photographer</option>
//                                         <option value="caterer">Caterer</option>
//                                         <option value="dj">DJ</option>
//                                         <option value="decorator">Decorator</option>
//                                     </select>
//                                     {errors.serviceProvided && <p className="text-red-500 text-xs mt-1">{errors.serviceProvided}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Service Description
//                                     </label>
//                                     <textarea
//                                         id="description"
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleChange}
//                                         className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 border-gray-300"
//                                         placeholder="Describe your services (optional)"
//                                         rows="4"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Price
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="price"
//                                         name="price"
//                                         value={formData.price}
//                                         onChange={handleChange}
//                                         className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 border-gray-300"
//                                         placeholder="e.g., 50 birr per hour"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Availability
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="availability"
//                                         name="availability"
//                                         value={formData.availability}
//                                         onChange={handleChange}
//                                         className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 border-gray-300"
//                                         placeholder="e.g., As needed"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Location <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="location"
//                                         name="location"
//                                         value={formData.location}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.location ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         placeholder="e.g., Addis Ababa"
//                                         required
//                                     />
//                                     {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
//                                 </div>
//                             </div>
//                         )}
//                         {selectedRole === 'Vendor' && step === 3 && (
//                             <div className="space-y-4">
//                                 <div>
//                                     <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Profile Picture
//                                     </label>
//                                     <input
//                                         type="file"
//                                         id="avatar"
//                                         name="avatar"
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm transition-colors duration-200 ${errors.avatar ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         accept=".jpg,.jpeg,.png,.webp,.avif"
//                                     />
//                                     {errors.avatar && <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="docs" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Documents
//                                     </label>
//                                     <input
//                                         type="file"
//                                         id="docs"
//                                         name="docs"
//                                         multiple
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm transition-colors duration-200 ${errors.doc_0 ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         accept=".jpg,.jpeg,.png,.pdf"
//                                     />
//                                     {errors.doc_0 && <p className="text-red-500 text-xs mt-1">{errors.doc_0}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
//                                     {formData.portfolio.map((item, index) => (
//                                         <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
//                                             <div>
//                                                 <label
//                                                     htmlFor={`portfolio_title_${index}`}
//                                                     className="block text-sm font-medium text-gray-600 mb-1"
//                                                 >
//                                                     Project Title
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     id={`portfolio_title_${index}`}
//                                                     value={item.title}
//                                                     onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
//                                                     className={`w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors[`portfolio_${index}`] ? 'border-red-500' : 'border-gray-300'
//                                                         }`}
//                                                     placeholder="e.g., Wedding Shoot"
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <label
//                                                     htmlFor={`portfolio_image_${index}`}
//                                                     className="block text-sm font-medium text-gray-600 mb-1"
//                                                 >
//                                                     Image URL
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     id={`portfolio_image_${index}`}
//                                                     value={item.image}
//                                                     onChange={(e) => handlePortfolioChange(index, 'image', e.target.value)}
//                                                     className={`w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors[`portfolio_image_${index}`] || errors[`portfolio_${index}`]
//                                                             ? 'border-red-500'
//                                                             : 'border-gray-300'
//                                                         }`}
//                                                     placeholder="e.g., https://example.com/image.jpg"
//                                                 />
//                                                 {errors[`portfolio_image_${index}`] && (
//                                                     <p className="text-red-500 text-xs mt-1">{errors[`portfolio_image_${index}`]}</p>
//                                                 )}
//                                             </div>
//                                             <div>
//                                                 <label
//                                                     htmlFor={`portfolio_description_${index}`}
//                                                     className="block text-sm font-medium text-gray-600 mb-1"
//                                                 >
//                                                     Description
//                                                 </label>
//                                                 <textarea
//                                                     id={`portfolio_description_${index}`}
//                                                     value={item.description}
//                                                     onChange={(e) => handlePortfolioChange(index, 'description', e.target.value)}
//                                                     className={`w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors[`portfolio_${index}`] ? 'border-red-500' : 'border-gray-300'
//                                                         }`}
//                                                     placeholder="Describe this project"
//                                                     rows="3"
//                                                 />
//                                             </div>
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removePortfolioItem(index)}
//                                                 className="flex items-center text-red-500 hover:text-red-700 text-sm font-medium"
//                                             >
//                                                 <FaTrash className="mr-1" /> Remove
//                                             </button>
//                                             {errors[`portfolio_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`portfolio_${index}`]}</p>}
//                                         </div>
//                                     ))}
//                                     <button
//                                         type="button"
//                                         onClick={addPortfolioItem}
//                                         className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
//                                     >
//                                         <FaPlus className="mr-2" /> Add Portfolio Item
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         {selectedRole === 'Organizer' && step === 2 && (
//                             <div className="space-y-4">
//                                 <div>
//                                     <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Phone Number <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="phoneNumber"
//                                         name="phoneNumber"
//                                         value={formData.phoneNumber}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         placeholder="e.g., +251912345678"
//                                         required
//                                     />
//                                     {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Organization Name <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="organizationName"
//                                         name="organizationName"
//                                         value={formData.organizationName}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.organizationName ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         placeholder="e.g., EventMasters Inc."
//                                         required
//                                     />
//                                     {errors.organizationName && <p className="text-red-500 text-xs mt-1">{errors.organizationName}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Location <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="location"
//                                         name="location"
//                                         value={formData.location}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.location ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         placeholder="e.g., Addis Ababa"
//                                         required
//                                     />
//                                     {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
//                                         About <span className="text-red-500">*</span>
//                                     </label>
//                                     <textarea
//                                         id="about"
//                                         name="about"
//                                         value={formData.about}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.about ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         placeholder="Tell us about your organization"
//                                         rows="4"
//                                         required
//                                     />
//                                     {errors.about && <p className="text-red-500 text-xs mt-1">{errors.about}</p>}
//                                 </div>
//                             </div>
//                         )}
//                         {selectedRole === 'Organizer' && step === 3 && (
//                             <div className="space-y-4">
//                                 <div>
//                                     <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Website (Optional)
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="website"
//                                         name="website"
//                                         value={formData.website}
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.website ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         placeholder="e.g., https://yourwebsite.com"
//                                     />
//                                     {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Social Links (Optional, comma-separated)
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="socialLinks"
//                                         name="socialLinks"
//                                         value={formData.socialLinks.join(', ')}
//                                         onChange={handleChange}
//                                         className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 border-gray-300"
//                                         placeholder="e.g., https://linkedin.com/..., https://facebook.com/..."
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Experience (Optional)
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="experience"
//                                         name="experience"
//                                         value={formData.experience}
//                                         onChange={handleChange}
//                                         className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 border-gray-300"
//                                         placeholder="e.g., 5 years or 50 events"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Organization Logo (Optional)
//                                     </label>
//                                     <input
//                                         type="file"
//                                         id="avatar"
//                                         name="avatar"
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm transition-colors duration-200 ${errors.avatar ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         accept=".jpg,.jpeg,.png,.webp,.avif"
//                                     />
//                                     {errors.avatar && <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="docs" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Legal Documents <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="file"
//                                         id="docs"
//                                         name="docs"
//                                         multiple
//                                         onChange={handleChange}
//                                         className={`w-full p-3 border rounded-lg shadow-sm transition-colors duration-200 ${errors.docs || errors.doc_0 ? 'border-red-500' : 'border-gray-300'
//                                             }`}
//                                         accept=".jpg,.jpeg,.png,.pdf"
//                                         required
//                                     />
//                                     {errors.docs && <p className="text-red-500 text-xs mt-1">{errors.docs}</p>}
//                                     {errors.doc_0 && <p className="text-red-500 text-xs mt-1">{errors.doc_0}</p>}
//                                 </div>
//                             </div>
//                         )}
//                         <div className="flex space-x-4">
//                             {step > 1 && (
//                                 <button
//                                     type="button"
//                                     onClick={handleBack}
//                                     className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-300 transition-all duration-200 shadow-md"
//                                 >
//                                     Back
//                                 </button>
//                             )}
//                             {selectedRole === 'Attendee' || (selectedRole === 'Vendor' && step === 3) || (selectedRole === 'Organizer' && step === 3) ? (
//                                 <button
//                                     type="submit"
//                                     className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-blue-700 transition-all duration-200 shadow-md disabled:bg-blue-400"
//                                     disabled={isLoading}
//                                 >
//                                     {isLoading ? (
//                                         <span className="flex items-center">
//                                             <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                                                 <path
//                                                     className="opacity-75"
//                                                     fill="currentColor"
//                                                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                                 />
//                                             </svg>
//                                             Registering...
//                                         </span>
//                                     ) : (
//                                         'Create Account'
//                                     )}
//                                 </button>
//                             ) : (
//                                 <button
//                                     type="button"
//                                     onClick={handleNext}
//                                     className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-blue-700 transition-all duration-200 shadow-md"
//                                 >
//                                     Next
//                                 </button>
//                             )}
//                         </div>
//                     </form>
//                     <p className="text-center mt-6 text-gray-600">
//                         Already have an account?{' '}
//                         <Link to="/login" className="text-blue-600 hover:underline font-medium">
//                             Log In
//                         </Link>
//                     </p>
//                 </div>
//             </div>
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
import { FaTicketAlt, FaBuilding, FaPlus, FaTrash, FaUsers, FaFilePdf,  FaUpload } from 'react-icons/fa';
import signupImage from '../assets/signupImage.svg';

const Signup = () => {
    const [signup, { isLoading }] = useSignupMutation();
    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState('Attendee');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        serviceProvided: '',
        price: '',
        description: '',
        availability: '',
        location: '',
        portfolio: [],
        avatar: null,
        docs: [],
        phoneNumber: '',
        organizationName: '',
        website: '',
        socialLinks: [],
        about: '',
        experience: '',
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [previewImages, setPreviewImages] = useState([]); // For avatar/logo preview
    const [previewDocs, setPreviewDocs] = useState([]); // For document previews

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setErrors({ ...errors, [name]: null });
        if (type === 'file') {
            handleFileChange(e, name);
        } else if (name === 'socialLinks') {
            setFormData({ ...formData, socialLinks: value.split(',').map((item) => item.trim()).filter(Boolean) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
        const validDocTypes = ['application/pdf', ...validImageTypes];

        if (type === 'avatar') {
            const file = files[0];
            if (file && validImageTypes.includes(file.type)) {
                setFormData({ ...formData, avatar: file });
                setPreviewImages([{ url: URL.createObjectURL(file), name: file.name, type: 'image' }]);
            } else {
                setErrors({ ...errors, avatar: 'Please upload a valid image (JPG, PNG, WEBP, AVIF).' });
            }
        } else if (type === 'docs') {
            const validDocs = files.filter((file) => validDocTypes.includes(file.type));
            if (validDocs.length !== files.length) {
                setErrors({ ...errors, docs: 'Only images or PDFs are allowed.' });
            } else {
                setFormData({ ...formData, docs: validDocs });
                setPreviewDocs(
                    validDocs.map((file) => ({
                        url: file.type.includes('image') ? URL.createObjectURL(file) : null,
                        name: file.name,
                        type: file.type.includes('image') ? 'image' : 'pdf',
                    }))
                );
            }
        }
    };

    const removeFile = (index, type) => {
        if (type === 'avatar') {
            setFormData({ ...formData, avatar: null });
            setPreviewImages([]);
        } else if (type === 'docs') {
            const updatedDocs = formData.docs.filter((_, i) => i !== index);
            const updatedPreviews = previewDocs.filter((_, i) => i !== index);
            setFormData({ ...formData, docs: updatedDocs });
            setPreviewDocs(updatedPreviews);
        }
    };

    const handlePortfolioChange = (index, field, value) => {
        const updatedPortfolio = [...formData.portfolio];
        updatedPortfolio[index] = { ...updatedPortfolio[index], [field]: value };
        setFormData({ ...formData, portfolio: updatedPortfolio });
        setErrors({ ...errors, [`portfolio_${index}`]: null, [`portfolio_image_${index}`]: null });
    };

    const addPortfolioItem = () => {
        setFormData({
            ...formData,
            portfolio: [...formData.portfolio, { title: '', image: '', description: '' }],
        });
    };

    const removePortfolioItem = (index) => {
        setFormData({
            ...formData,
            portfolio: formData.portfolio.filter((_, i) => i !== index),
        });
        setErrors({ ...errors, [`portfolio_${index}`]: null, [`portfolio_image_${index}`]: null });
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateStep = () => {
        const newErrors = {};

        if (selectedRole === 'Attendee' || step === 1) {
            if (!formData.name || formData.name.trim() === '') {
                newErrors.name = 'Name is required.';
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email || !emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Please enter a valid email address.';
            }
            if (!formData.password || formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters long.';
            }
        }

        if (selectedRole === 'Vendor' && step === 2) {
            if (!formData.serviceProvided || formData.serviceProvided.trim() === '') {
                newErrors.serviceProvided = 'Please select a service.';
            }
            if (!formData.location || formData.location.trim() === '') {
                newErrors.location = 'Location is required.';
            }
        }

        if (selectedRole === 'Vendor' && step === 3) {
            formData.portfolio.forEach((item, index) => {
                if (item.title && (!item.image || !item.description)) {
                    newErrors[`portfolio_${index}`] =
                        'All fields (title, image, description) are required if title is provided.';
                }
                if (item.image && !isValidUrl(item.image)) {
                    newErrors[`portfolio_image_${index}`] = 'Please enter a valid image URL.';
                }
            });
        }

        if (selectedRole === 'Vendor' && step === 4) {
            if (formData.avatar && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(formData.avatar.type)) {
                newErrors.avatar = 'Avatar must be a valid image (JPG, PNG, WEBP, AVIF).';
            }
            if (formData.docs.length > 0) {
                formData.docs.forEach((doc, index) => {
                    if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(doc.type)) {
                        newErrors[`doc_${index}`] = `Document ${index + 1} must be a valid image or PDF.`;
                    }
                });
            }
        }

        if (selectedRole === 'Organizer' && step === 2) {
            if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
                newErrors.phoneNumber = 'Phone number is required.';
            }
            if (!formData.organizationName || formData.organizationName.trim() === '') {
                newErrors.organizationName = 'Organization name is required.';
            }
            if (!formData.location || formData.location.trim() === '') {
                newErrors.location = 'Location is required.';
            }
            if (!formData.about || formData.about.trim() === '') {
                newErrors.about = 'About section is required.';
            }
        }

        if (selectedRole === 'Organizer' && step === 3) {
            if (formData.website && !isValidUrl(formData.website)) {
                newErrors.website = 'Please enter a valid URL.';
            }
        }

        if (selectedRole === 'Organizer' && step === 4) {
            if (formData.docs.length === 0) {
                newErrors.docs = 'At least one legal document is required.';
            } else {
                formData.docs.forEach((doc, index) => {
                    if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(doc.type)) {
                        newErrors[`doc_${index}`] = `Document ${index + 1} must be a valid image or PDF.`;
                    }
                });
            }
            if (formData.avatar && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(formData.avatar.type)) {
                newErrors.avatar = 'Avatar must be a valid image (JPG, PNG, WEBP, AVIF).';
            }
        }

        return newErrors;
    };

    const validateFullForm = () => {
        const newErrors = {};
        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Name is required.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        if (selectedRole === 'Vendor') {
            if (!formData.serviceProvided || formData.serviceProvided.trim() === '') {
                newErrors.serviceProvided = 'Please select a service.';
            }
            if (!formData.location || formData.location.trim() === '') {
                newErrors.location = 'Location is required.';
            }
            formData.portfolio.forEach((item, index) => {
                if (item.title && (!item.image || !item.description)) {
                    newErrors[`portfolio_${index}`] =
                        'All fields (title, image, description) are required if title is provided.';
                }
                if (item.image && !isValidUrl(item.image)) {
                    newErrors[`portfolio_image_${index}`] = 'Please enter a valid image URL.';
                }
            });
            if (formData.avatar && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(formData.avatar.type)) {
                newErrors.avatar = 'Avatar must be a valid image (JPG, PNG, WEBP, AVIF).';
            }
            if (formData.docs.length > 0) {
                formData.docs.forEach((doc, index) => {
                    if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(doc.type)) {
                        newErrors[`doc_${index}`] = `Document ${index + 1} must be a valid image or PDF.`;
                    }
                });
            }
        }

        if (selectedRole === 'Organizer') {
            if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
                newErrors.phoneNumber = 'Phone number is required.';
            }
            if (!formData.organizationName || formData.organizationName.trim() === '') {
                newErrors.organizationName = 'Organization name is required.';
            }
            if (!formData.location || formData.location.trim() === '') {
                newErrors.location = 'Location is required.';
            }
            if (!formData.about || formData.about.trim() === '') {
                newErrors.about = 'About section is required.';
            }
            if (formData.docs.length === 0) {
                newErrors.docs = 'At least one legal document is required.';
            } else {
                formData.docs.forEach((doc, index) => {
                    if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(doc.type)) {
                        newErrors[`doc_${index}`] = `Document ${index + 1} must be a valid image or PDF.`;
                    }
                });
            }
            if (formData.website && !isValidUrl(formData.website)) {
                newErrors.website = 'Please enter a valid URL.';
            }
            if (formData.avatar && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(formData.avatar.type)) {
                newErrors.avatar = 'Avatar must be a valid image (JPG, PNG, WEBP, AVIF).';
            }
        }

        return newErrors;
    };

    const handleNext = (e) => {
        e.preventDefault();
        const validationErrors = validateStep();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setStep(step + 1);
    };

    const handleBack = () => {
        setErrors({});
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        const validationErrors = validateFullForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name.trim());
            formDataToSend.append('email', formData.email.trim());
            formDataToSend.append('password', formData.password);
            formDataToSend.append('role', selectedRole === 'Attendee' ? 'user' : selectedRole.toLowerCase());

            if (selectedRole === 'Vendor') {
                formDataToSend.append('serviceProvided', formData.serviceProvided || '');
                formDataToSend.append('price', formData.price || '');
                formDataToSend.append('description', formData.description || '');
                formDataToSend.append('availability', formData.availability || '');
                formDataToSend.append('location', formData.location || '');
                if (formData.portfolio.length > 0) {
                    formDataToSend.append('portfolio', JSON.stringify(formData.portfolio));
                }
                if (formData.avatar) {
                    formDataToSend.append('avatar', formData.avatar);
                }
                if (formData.docs.length > 0) {
                    formData.docs.forEach((doc) => formDataToSend.append('docs', doc));
                }
            }

            if (selectedRole === 'Organizer') {
                formDataToSend.append('phoneNumber', formData.phoneNumber || '');
                formDataToSend.append('organizationName', formData.organizationName || '');
                formDataToSend.append('location', formData.location || '');
                formDataToSend.append('website', formData.website || '');
                formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
                formDataToSend.append('about', formData.about || '');
                formDataToSend.append('experience', formData.experience || '');
                if (formData.avatar) {
                    formDataToSend.append('avatar', formData.avatar);
                }
                if (formData.docs.length > 0) {
                    formData.docs.forEach((doc) => formDataToSend.append('docs', doc));
                }
            }

             await signup(formDataToSend).unwrap();
            toast.success('Registered Successfully! Please verify your email.');
            navigate('/login');
        } catch (error) {
            setServerError(error.data?.message || 'Signup failed. Please try again later.');
        }
    };

    const roles = [
        { name: 'Attendee', icon: <FaTicketAlt />, desc: 'Discover & join events' },
        { name: 'Vendor', icon: <FaBuilding />, desc: 'Offer services to organizers' },
        { name: 'Organizer', icon: <FaUsers />, desc: 'Create and manage events' },
    ];

    const renderProgressBar = () => {
        if (selectedRole === 'Attendee') return null;
        const totalSteps = 4;
        return (
            <div className="flex justify-between mb-6">
                {Array.from({ length: totalSteps }, (_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step > i + 1 ? 'bg-indigo-600 text-white' : step === i + 1 ? 'bg-indigo-400 text-white' : 'bg-gray-200 text-gray-600'
                                }`}
                        >
                            {step > i + 1 ? '✓' : i + 1}
                        </div>
                        <span className="text-xs mt-1 text-gray-600">
                            {selectedRole === 'Vendor'
                                ? ['Basic Info', 'Service', 'Portfolio', 'Media']
                                : ['Basic Info', 'Organization', 'Details', 'Documents'][i]}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const getStepTitle = () => {
        if (selectedRole === 'Attendee') return 'Basic Information';
        if (selectedRole === 'Vendor') {
            return ['Basic Information', 'Service Details', 'Portfolio', 'Media & Documents'][step - 1];
        }
        if (selectedRole === 'Organizer') {
            return ['Basic Information', 'Organization Details', 'Additional Info', 'Documents'][step - 1];
        }
        return '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
            <Title title={'Register Page'} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-100 to-gray-200 p-8">
                    <img
                        src={signupImage}
                        alt="Signup Illustration"
                        className="max-w-full h-auto transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-6 sm:p-10 flex flex-col justify-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-3 text-gray-800">Create Your Account</h1>
                    <p className="text-center text-gray-600 mb-8">Choose your role to join our event platform</p>
                    <div className="flex justify-center mb-8 space-x-4">
                        {roles.map((role) => (
                            <button
                                key={role.name}
                                onClick={() => {
                                    setSelectedRole(role.name);
                                    setStep(1);
                                    setErrors({});
                                    setServerError('');
                                    setFormData({
                                        name: '',
                                        email: '',
                                        password: '',
                                        serviceProvided: '',
                                        price: '',
                                        description: '',
                                        availability: '',
                                        location: '',
                                        portfolio: [],
                                        avatar: null,
                                        docs: [],
                                        phoneNumber: '',
                                        organizationName: '',
                                        website: '',
                                        socialLinks: [],
                                        about: '',
                                        experience: '',
                                    });
                                    setPreviewImages([]);
                                    setPreviewDocs([]);
                                }}
                                className={`px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 ${selectedRole === role.name ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="text-xl">{role.icon}</span>
                                <span>{role.name}</span>
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                        {serverError && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">{serverError}</p>}
                        {renderProgressBar()}
                        <h2 className="text-xl font-semibold text-gray-800">{getStepTitle()}</h2>

                        {(selectedRole === 'Attendee' || step === 1) && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your email"
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                            </div>
                        )}

                        {selectedRole === 'Vendor' && step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="serviceProvided" className="block text-sm font-medium text-gray-700 mb-1">
                                        Service Provided <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="serviceProvided"
                                        name="serviceProvided"
                                        value={formData.serviceProvided}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.serviceProvided ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    >
                                        <option value="">Select a service</option>
                                        <option value="photographer">Photographer</option>
                                        <option value="caterer">Caterer</option>
                                        <option value="dj">DJ</option>
                                        <option value="decorator">Decorator</option>
                                    </select>
                                    {errors.serviceProvided && <p className="text-red-500 text-xs mt-1">{errors.serviceProvided}</p>}
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Service Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 border-gray-300"
                                        placeholder="Describe your services (optional)"
                                        rows="4"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Price
                                    </label>
                                    <input
                                        type="text"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 border-gray-300"
                                        placeholder="e.g., 50 birr per hour"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                                        Availability
                                    </label>
                                    <input
                                        type="text"
                                        id="availability"
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 border-gray-300"
                                        placeholder="e.g., As needed"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.location ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Addis Ababa"
                                        required
                                    />
                                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>
                            </div>
                        )}

                        {selectedRole === 'Vendor' && step === 3 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                                    {formData.portfolio.map((item, index) => (
                                        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                                            <div>
                                                <label
                                                    htmlFor={`portfolio_title_${index}`}
                                                    className="block text-sm font-medium text-gray-600 mb-1"
                                                >
                                                    Project Title
                                                </label>
                                                <input
                                                    type="text"
                                                    id={`portfolio_title_${index}`}
                                                    value={item.title}
                                                    onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
                                                    className={`w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors[`portfolio_${index}`] ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="e.g., Wedding Shoot"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor={`portfolio_image_${index}`}
                                                    className="block text-sm font-medium text-gray-600 mb-1"
                                                >
                                                    Image URL
                                                </label>
                                                <input
                                                    type="text"
                                                    id={`portfolio_image_${index}`}
                                                    value={item.image}
                                                    onChange={(e) => handlePortfolioChange(index, 'image', e.target.value)}
                                                    className={`w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors[`portfolio_image_${index}`] || errors[`portfolio_${index}`]
                                                            ? 'border-red-500'
                                                            : 'border-gray-300'
                                                        }`}
                                                    placeholder="e.g., https://example.com/image.jpg"
                                                />
                                                {errors[`portfolio_image_${index}`] && (
                                                    <p className="text-red-500 text-xs mt-1">{errors[`portfolio_image_${index}`]}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor={`portfolio_description_${index}`}
                                                    className="block text-sm font-medium text-gray-600 mb-1"
                                                >
                                                    Description
                                                </label>
                                                <textarea
                                                    id={`portfolio_description_${index}`}
                                                    value={item.description}
                                                    onChange={(e) => handlePortfolioChange(index, 'description', e.target.value)}
                                                    className={`w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors[`portfolio_${index}`] ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Describe this project"
                                                    rows="3"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removePortfolioItem(index)}
                                                className="flex items-center text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                <FaTrash className="mr-1" /> Remove
                                            </button>
                                            {errors[`portfolio_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`portfolio_${index}`]}</p>}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addPortfolioItem}
                                        className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-200"
                                    >
                                        <FaPlus className="mr-2" /> Add Portfolio Item
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedRole === 'Vendor' && step === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Picture
                                    </label>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-700">Upload your profile picture</span>
                                        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                                            <FaUpload className="mr-2" /> Upload Image
                                            <input
                                                type="file"
                                                id="avatar"
                                                name="avatar"
                                                onChange={handleChange}
                                                className="hidden"
                                                accept=".jpg,.jpeg,.png,.webp,.avif"
                                            />
                                        </label>
                                    </div>
                                    {previewImages.length === 0 ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                                            <p className="text-sm text-gray-500">No image uploaded. Upload an image to preview it here.</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={previewImages[0].url}
                                                alt="Avatar Preview"
                                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(0, 'avatar')}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    )}
                                    {errors.avatar && <p className="text-red-500 text-xs mt-2">{errors.avatar}</p>}
                                </div>
                                <div>
                                    <label htmlFor="docs" className="block text-sm font-medium text-gray-700 mb-2">
                                        Documents
                                    </label>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-700">Upload your documents</span>
                                        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                                            <FaUpload className="mr-2" /> Upload Documents
                                            <input
                                                type="file"
                                                id="docs"
                                                name="docs"
                                                multiple
                                                onChange={handleChange}
                                                className="hidden"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                            />
                                        </label>
                                    </div>
                                    {previewDocs.length === 0 ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                                            <p className="text-sm text-gray-500">No documents uploaded. Upload documents to preview them here.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {previewDocs.map((doc, index) => (
                                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    {doc.type === 'image' ? (
                                                        <img src={doc.url} alt={doc.name} className="w-16 h-16 object-cover rounded-md" />
                                                    ) : (
                                                        <FaFilePdf className="text-red-500 text-3xl" />
                                                    )}
                                                    <span className="text-sm text-gray-600 truncate flex-1">{doc.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index, 'docs')}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.docs && <p className="text-red-500 text-xs mt-2">{errors.docs}</p>}
                                </div>
                            </div>
                        )}

                        {selectedRole === 'Organizer' && step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., +251912345678"
                                        required
                                    />
                                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                                </div>
                                <div>
                                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Organization Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="organizationName"
                                        name="organizationName"
                                        value={formData.organizationName}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.organizationName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., EventMasters Inc."
                                        required
                                    />
                                    {errors.organizationName && <p className="text-red-500 text-xs mt-1">{errors.organizationName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.location ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Addis Ababa"
                                        required
                                    />
                                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>
                                <div>
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                                        About <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="about"
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.about ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Tell us about your organization"
                                        rows="4"
                                        required
                                    />
                                    {errors.about && <p className="text-red-500 text-xs mt-1">{errors.about}</p>}
                                </div>
                            </div>
                        )}

                        {selectedRole === 'Organizer' && step === 3 && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                        Website (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.website ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., https://yourwebsite.com"
                                    />
                                    {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                                </div>
                                <div>
                                    <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700 mb-1">
                                        Social Links (Optional, comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        id="socialLinks"
                                        name="socialLinks"
                                        value={formData.socialLinks.join(', ')}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 border-gray-300"
                                        placeholder="e.g., https://linkedin.com/..., https://facebook.com/..."
                                    />
                                </div>
                                <div>
                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                                        Experience (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 border-gray-300"
                                        placeholder="e.g., 5 years or 50 events"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedRole === 'Organizer' && step === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                                        Organization Logo (Optional)
                                    </label>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-700">Upload your organization logo</span>
                                        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                                            <FaUpload className="mr-2" /> Upload Logo
                                            <input
                                                type="file"
                                                id="avatar"
                                                name="avatar"
                                                onChange={handleChange}
                                                className="hidden"
                                                accept=".jpg,.jpeg,.png,.webp,.avif"
                                            />
                                        </label>
                                    </div>
                                    {previewImages.length === 0 ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                                            <p className="text-sm text-gray-500">No logo uploaded. Upload a logo to preview it here.</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={previewImages[0].url}
                                                alt="Logo Preview"
                                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(0, 'avatar')}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    )}
                                    {errors.avatar && <p className="text-red-500 text-xs mt-2">{errors.avatar}</p>}
                                </div>
                                <div>
                                    <label htmlFor="docs" className="block text-sm font-medium text-gray-700 mb-2">
                                        Legal Documents <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-700">Upload your legal documents</span>
                                        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                                            <FaUpload className="mr-2" /> Upload Documents
                                            <input
                                                type="file"
                                                id="docs"
                                                name="docs"
                                                multiple
                                                onChange={handleChange}
                                                className="hidden"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                            />
                                        </label>
                                    </div>
                                    {previewDocs.length === 0 ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                                            <p className="text-sm text-gray-500">No documents uploaded. Upload documents to preview them here.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {previewDocs.map((doc, index) => (
                                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    {doc.type === 'image' ? (
                                                        <img src={doc.url} alt={doc.name} className="w-16 h-16 object-cover rounded-md" />
                                                    ) : (
                                                        <FaFilePdf className="text-red-500 text-3xl" />
                                                    )}
                                                    <span className="text-sm text-gray-600 truncate flex-1">{doc.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index, 'docs')}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.docs && <p className="text-red-500 text-xs mt-2">{errors.docs}</p>}
                                </div>
                            </div>
                        )}

                        <div className="flex space-x-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-300 transition-all duration-200 shadow-md"
                                >
                                    Back
                                </button>
                            )}
                            {selectedRole === 'Attendee' || (selectedRole === 'Vendor' && step === 4) || (selectedRole === 'Organizer' && step === 4) ? (
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 shadow-md disabled:bg-indigo-400"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Registering...
                                        </span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 shadow-md"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </form>
                    <p className="text-center mt-6 text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;