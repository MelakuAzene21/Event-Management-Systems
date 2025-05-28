import React, { useState } from 'react';

const VendorProfile = () => {
    // ProfileHeader State and Logic
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [cvError, setCvError] = useState('');
    const [overviewError, setOverviewError] = useState('');
    const [photoError, setPhotoError] = useState('');

    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const toggleEditMode = () => setIsEditMode(!isEditMode);

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        return minLength && hasLetter && hasNumber;
    };

    const handleChangePassword = () => {
        setError('');
        if (!currentPassword) {
            setError('Please enter your current password.');
            return;
        }
        if (!newPassword) {
            setError('Please enter a new password.');
            return;
        }
        if (!validatePassword(newPassword)) {
            setError('New password must be at least 8 characters long and contain at least one letter and one number.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }
        console.log('Password changed successfully:', { currentPassword, newPassword });
        toggleModal();
    };

    // State for editable fields
    const [name, setName] = useState('Gerawerk Zewudu');
    const [profileImage, setProfileImage] = useState(null);
    const [services, setServices] = useState('Photographer');
    const [location, setLocation] = useState('Bahir Dar, Ethiopia'); // Non-editable
    const [availability, setAvailability] = useState('As needed');
    const [profileOverview, setProfileOverview] = useState(
        'Experienced web developer specializing in modern and scalable solutions. Passionate about creating beautiful, functional websites and applications that deliver exceptional user experiences. With expertise in both frontend and backend technologies, I bring ideas to life through clean code and innovative design.'

    );

    const [cv, setCv] = useState(null);
    const [pricing, setPricing] = useState('$45');

    // Validation for CV file size (5MB limit)
    const validateCvFile = (file) => {
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                setCvError('CV file size exceeds 5MB limit.');
                return false;
            }
            setCvError('');
            return true;
        }
        return true; // No file uploaded, no validation needed
    };

    // Validation for profile photo format (image only)
    const validateProfilePhoto = (file) => {
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validImageTypes.includes(file.type)) {
                setPhotoError('Only image formats (JPEG, PNG) are allowed.');
                return false;
            }
            setPhotoError('');
            return true;
        }
        return true; // No file uploaded, no validation needed
    };

    // Validation for profile overview word count (100 words limit)
    const validateProfileOverview = (text) => {
        const wordCount = text.trim().split(/\s+/).length;
        if (wordCount > 100) {
            setOverviewError('Profile overview cannot exceed 100 words.');
            return false;
        }
        setOverviewError('');
        return true;
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && validateProfilePhoto(file)) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const handleCvUpload = (e) => {
        const file = e.target.files[0];
        if (file && validateCvFile(file)) {
            setCv(file);
        }
    };

    const handleProfileOverviewChange = (e) => {
        const newOverview = e.target.value;
        if (validateProfileOverview(newOverview)) {
            setProfileOverview(newOverview);
        }
    };

    const handleSave = () => {
        // Validate all fields before saving
        if (cvError || overviewError || photoError) {
            return; // Prevent save if there are validation errors
        }
        console.log('Saving profile data:', { name, profileImage, services, location, availability, profileOverview, cv, pricing });
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setName('Gerawerk Zewudu');
        setProfileImage(null);
        setServices('Photographer');
        setAvailability('As needed');
        setProfileOverview(
            'Experienced web developer specializing in modern and scalable solutions. Passionate about creating beautiful, functional websites and applications that deliver exceptional user experiences. With expertise in both frontend and backend technologies, I bring ideas to life through clean code and innovative design.'
        );
        setCv(null);
        setPricing('$45');
        setCvError('');
        setOverviewError('');
        setPhotoError('');
        setIsEditMode(false);
    };

    return (
        <div className="min-h-screen bg-white-100 p-7">
            {/* Profile Header Section */}
            <div className="mb-6">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 rounded-lg shadow-md flex items-center justify-between">
                    {/* Left Section: Profile Picture, Name, Location, Rating, Status */}
                    <div className="flex items-center space-x-4">
                        {/* Profile Picture Placeholder */}
                        <div className="relative w-16 h-16">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                </div>
                            )}
                            {isEditMode && (
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                            {photoError && isEditMode && (
                                <p className="text-red-500 text-xs mt-1">{photoError}</p>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-2xl font-bold text-gray-800 bg-transparent border-2 border-teal-500 rounded focus:outline-none w-full"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                            )}
                            <div className="flex items-center space-x-2 text-gray-700">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M12 12l4.243 4.243m0 0L12 12l4.243-4.243m-8.486 8.486L12 12l-4.243 4.243z"
                                    />
                                </svg>
                                <p>{location}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {/* Star Rating (non-editable) */}
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`w-5 h-5 ${index < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-1 text-gray-700">(4.0)</span>
                                </div>
                                {/* Availability Status (non-editable) */}
                                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                    AVAILABLE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={toggleModal}
                            className="bg-white text-gray-700 font-medium px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 hover:bg-gray-100"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-4-4c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-4-4c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m8-10v2m-2-2h2m-2 0h-2m-2 0H8m2 0H6m2 0v2m-2-2v-2m2 0v2m4-2v2m-2-2h2m-2 0h-2m2 14v-2m-2 2h2m-2 0h-2m-2 0H8m2 0v-2m-2 2v2m2 0v-2m4 2v-2m-2 2h2"
                                />
                            </svg>
                            <span>Change Password</span>
                        </button>
                        <button
                            onClick={toggleEditMode}
                            className="bg-white text-gray-700 font-medium px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 hover:bg-gray-100"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                                />
                            </svg>
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Overview Section */}
            <div className="mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    {/* Main Grid: Left (1 part) and Right (2 parts) */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Left Column: Services Offered, Location, Availability (1 part) */}
                        <div className="col-span-1 grid grid-cols-1 gap-6">
                            {/* Services Offered */}
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-700">Services Offered</h3>
                                </div>
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        value={services}
                                        onChange={(e) => setServices(e.target.value)}
                                        className="w-full p-2 bg-transparent border-2 border-teal-500 rounded focus:outline-none"
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            {services}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M12 12l4.243 4.243m-8.486-8.486L12 12l-4.243 4.243m8.486-8.486L12 12l4.243-4.243"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-700">Location</h3>
                                </div>
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full p-2 bg-transparent border-2 border-teal-500 rounded focus:outline-none"
                                    />
                                ) : (
                                    <>
                                        <p className="text-gray-600">{location}</p>
                                        <p className="text-gray-500 text-sm">Available for local and remote work</p>
                                    </>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-700">Availability</h3>
                                </div>
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        value={availability}
                                        onChange={(e) => setAvailability(e.target.value)}
                                        className="w-full p-2 bg-transparent border-2 border-teal-500 rounded focus:outline-none"
                                    />
                                ) : (
                                    <>
                                        <p className="text-green-600">{availability}</p>
                                        <p className="text-gray-500 text-sm">Flexible scheduling available</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Profile Overview (3/5), Upload CV & Pricing (2/5) (2 parts) */}
                        <div className="col-span-2 flex flex-col gap-6">
                            {/* Top: Profile Overview (3/5 of the height) */}
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md h-3/5">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2-10V7a2 2 0 00-2-2H9a2 2 0 00-2 2v1h10z"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-700">Profile Overview</h3>
                                </div>
                                {isEditMode ? (
                                    <>
                                        <textarea
                                            value={profileOverview}
                                            onChange={handleProfileOverviewChange}
                                            className="w-full p-2 bg-transparent border-2 border-teal-500 rounded focus:outline-none h-full resize-none"
                                        />
                                        {overviewError && (
                                            <p className="text-red-500 text-xs mt-1">{overviewError}</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-gray-600 text-sm">{profileOverview}</p>
                                )}
                            </div>

                            {/* Bottom: Upload CV and Pricing (2/5 of the height, side by side) */}
                            <div className="h-2/5 flex gap-6">
                                {/* Upload CV (1/2 of the width) */}
                                <div className="bg-gray-50 p-4 rounded-lg shadow-md flex-1 flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-center">
                                        <svg
                                            className="w-8 h-8 text-gray-400 mx-auto mb-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                            />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-700">Upload CV</h3>
                                        {isEditMode ? (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="application/pdf,application/doc"
                                                    onChange={handleCvUpload}
                                                    className="mt-2"
                                                />
                                                <p className="text-gray-500 text-sm mt-2">Change Doc</p>
                                                {cvError && (
                                                    <p className="text-red-500 text-xs mt-1">{cvError}</p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {cv ? (
                                                    <p className="text-gray-600 text-sm">{cv.name}</p>
                                                ) : (
                                                    <>
                                                        <p className="text-gray-600 text-sm">Click to upload or drag and drop</p>
                                                        <p className="text-gray-400 text-xs">PDF, DOC up to 5MB</p>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing (1/2 of the width) */}
                                <div className="bg-gray-50 p-4 rounded-lg shadow-md flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <svg
                                            className="w-5 h-5 text-green-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9v2h1a1 1 0 110 2H8a1 1 0 01-1-1V7zm4 6a1 1 0 100-2H9a1 1 0 100 2h3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-gray-700">Pricing</h3>
                                    </div>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            value={pricing}
                                            onChange={(e) => setPricing(e.target.value)}
                                            className="w-full p-2 bg-transparent border-2 border-teal-500 rounded focus:outline-none"
                                        />
                                    ) : (
                                        <>
                                            <p className="text-3xl font-bold text-green-600">{pricing}</p>
                                            <p className="text-gray-600">per hour</p>
                                            <p className="text-gray-600">Project rate:</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isEditMode && (
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            onClick={handleCancel}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorProfile;