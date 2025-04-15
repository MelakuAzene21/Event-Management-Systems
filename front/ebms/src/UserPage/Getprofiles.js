// import React, { useState, useEffect } from "react";
// import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../features/api/authApi";
// import { AiOutlineEdit } from "react-icons/ai";
// import { IoPersonOutline, IoMailOutline, IoBriefcaseOutline, IoCalendarOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Spinner from '../layout/Spinner';
// import Title from "../layout/Title";
// import BackButton from "../layout/BackButton";

// const UserProfile = () => {
//     const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();
//     const [updateProfile] = useUpdateProfileMutation();

//     const [isEditing, setIsEditing] = useState(false);
//     const [editedData, setEditedData] = useState({ name: "", email: "" });
//     const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (user?.avatar) {
//             setAvatarPreview(user.avatar);
//         }
//     }, [user]);

//     const handleInputChange = (e) => {
//         setEditedData({ ...editedData, [e.target.name]: e.target.value });
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             setAvatarPreview(URL.createObjectURL(file));
//         }
//     };

//     const handleSave = async () => {
//         try {
//             setLoading(true);
//             let avatarUrl = user.avatar;

//             if (selectedFile) {
//                 const formData = new FormData();
//                 formData.append("avatar", selectedFile);
//                 formData.append("userId", user._id);

//                 const { data } = await axios.post("http://localhost:5000/api/auth/upload-avatar", formData, {
//                     headers: { "Content-Type": "multipart/form-data" },
//                     withCredentials: true,
//                 });

//                 avatarUrl = data.avatarUrl;
//             }

//             await updateProfile({
//                 userId: user._id,
//                 updatedData: { ...editedData, avatar: avatarUrl },
//             }).unwrap();
//             toast.success('Your Profile Updated Successfully');
//             setIsEditing(false);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error updating profile:", err);
//             toast.error("Error Updating Profile");
//             setLoading(false);
//         }
//     };

//     if (isLoading) return <div className="text-center text-lg text-gray-500 py-12">Loading profile...</div>;
//     if (isError) return <div className="text-red-500 text-center py-12">Error: {error?.data?.message || "Failed to fetch profile."}</div>;

//     return (
//         <>
//             <BackButton />
//             <div className="max-w-4xl mx-auto px-4 py-8">
//                 <Title title="Profile Page" />
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
//                     <button
//                         onClick={() => {
//                             setIsEditing(true);
//                             setEditedData({ name: user.name, email: user.email });
//                         }}
//                         className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
//                     >
//                         <AiOutlineEdit size={18} />
//                         Edit Profile
//                     </button>
//                 </div>

//                 <div className="bg-white shadow-md rounded-xl p-8 border border-gray-100">
//                     <p className="text-gray-500 mb-6">View and update your personal information.</p>

//                     {/* User Avatar */}
//                     <div className="flex justify-center mb-8">
//                         <div className="relative">
//                             {avatarPreview ? (
//                                 <img
//                                     src={avatarPreview}
//                                     alt="User Avatar"
//                                     onError={() => setAvatarPreview(null)}
//                                     className="w-32 h-32 rounded-full border-2 border-gray-200 shadow-sm object-cover transition-transform hover:scale-105"
//                                 />
//                             ) : (
//                                 <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
//                                     ?
//                                 </div>
//                             )}
//                             {isEditing && (
//                                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-all">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleFileChange}
//                                         className="hidden"
//                                     />
//                                     <AiOutlineEdit size={16} />
//                                 </label>
//                             )}
//                         </div>
//                     </div>

//                     {/* User Details */}
//                     <div className="space-y-6">
//                         <div className="flex items-center gap-4">
//                             <IoPersonOutline className="text-gray-500 text-xl" />
//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-600">Name</label>
//                                 {isEditing ? (
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         value={editedData.name}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                                     />
//                                 ) : (
//                                     <p className="text-gray-800 text-lg">{user.name}</p>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             <IoMailOutline className="text-gray-500 text-xl" />
//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-600">Email</label>
//                                 {isEditing ? (
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={editedData.email}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                                     />
//                                 ) : (
//                                     <p className="text-gray-800 text-lg">{user.email}</p>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             <IoBriefcaseOutline className="text-gray-500 text-xl" />
//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-600">Role</label>
//                                 <p className="text-gray-800 text-lg">{user.role}</p>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             <IoCalendarOutline className="text-gray-500 text-xl" />
//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-600">Joined At</label>
//                                 <p className="text-gray-800 text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             <IoShieldCheckmarkOutline className="text-gray-500 text-xl" />
//                             <div className="flex-1">
//                                 <label className="block text-sm font-medium text-gray-600">Status</label>
//                                 <p className="text-gray-800 text-lg">{user.status}</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Save & Cancel Buttons */}
//                     {isEditing && (
//                         <div className="flex justify-end gap-4 mt-8">
//                             <button
//                                 onClick={() => setIsEditing(false)}
//                                 className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleSave}
//                                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
//                             >
//                                 {loading ? <Spinner /> : "Save"}
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default UserProfile;



// import React, { useState, useEffect } from "react";
// import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../features/api/authApi";
// import { AiOutlineEdit } from "react-icons/ai";
// import {
//     IoPersonOutline,
//     IoMailOutline,
//     IoBriefcaseOutline,
//     IoCalendarOutline,
//     IoShieldCheckmarkOutline,
// } from "react-icons/io5";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Spinner from "../layout/Spinner";
// import Title from "../layout/Title";
// import BackButton from "../layout/BackButton";

// const UserProfile = () => {
//     const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();
//     const [updateProfile] = useUpdateProfileMutation();

//     const [isEditing, setIsEditing] = useState(false);
//     const [editedData, setEditedData] = useState({ name: "", email: "" });
//     const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (user) {
//             setEditedData({ name: user.name, email: user.email });
//             setAvatarPreview(user.avatar || null);
//         }
//     }, [user]);

//     const handleInputChange = (e) => {
//         setEditedData({ ...editedData, [e.target.name]: e.target.value });
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             setAvatarPreview(URL.createObjectURL(file));
//         }
//     };

//     const handleSave = async () => {
//         try {
//             setLoading(true);
//             let avatarUrl = user.avatar;

//             if (selectedFile) {
//                 const formData = new FormData();
//                 formData.append("avatar", selectedFile);
//                 formData.append("userId", user._id);

//                 const { data } = await axios.post("http://localhost:5000/api/auth/upload-avatar", formData, {
//                     headers: { "Content-Type": "multipart/form-data" },
//                     withCredentials: true,
//                 });

//                 avatarUrl = data.avatarUrl;
//             }

//             await updateProfile({
//                 userId: user._id,
//                 updatedData: { ...editedData, avatar: avatarUrl },
//             }).unwrap();
//             toast.success("Your Profile Updated Successfully");
//             setIsEditing(false);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error updating profile:", err);
//             toast.error("Error Updating Profile");
//             setLoading(false);
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-gray-50">
//                 <div className="flex flex-col items-center gap-4">
//                     <Spinner />
//                     <p className="text-gray-600 text-lg animate-pulse">Loading your profile...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (isError) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-gray-50">
//                 <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-red-100">
//                     <p className="text-red-600 text-lg font-semibold">Error</p>
//                     <p className="text-gray-600 mt-2">{error?.data?.message || "Failed to fetch profile."}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-3xl mx-auto">
//                 {/* Back Button */}
//                 <div className="mb-6">
//                     <BackButton />
//                 </div>

//                 {/* Title */}
//                 <Title title="My Profile" className="text-4xl font-bold text-gray-800 mb-8 text-center" />

//                 {/* Profile Card */}
//                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
//                     {/* Header Section */}
//                     <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex justify-between items-center">
//                         <h2 className="text-2xl font-semibold text-white">Your Profile</h2>
//                         {!isEditing && (
//                             <button
//                                 onClick={() => setIsEditing(true)}
//                                 className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
//                             >
//                                 <AiOutlineEdit size={20} />
//                                 <span className="font-medium">Edit Profile</span>
//                             </button>
//                         )}
//                     </div>

//                     {/* Content Section */}
//                     <div className="p-8">
//                         {/* Avatar */}
//                         <div className="flex justify-center mb-8 relative">
//                             <div className="relative group">
//                                 {avatarPreview ? (
//                                     <img
//                                         src={avatarPreview}
//                                         alt="User Avatar"
//                                         onError={() => setAvatarPreview(null)}
//                                         className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
//                                     />
//                                 ) : (
//                                     <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-semibold shadow-lg">
//                                         {user?.name?.[0]?.toUpperCase() || "?"}
//                                     </div>
//                                 )}
//                                 {isEditing && (
//                                     <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-3 cursor-pointer hover:bg-blue-700 transition-all duration-300 shadow-md">
//                                         <input
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={handleFileChange}
//                                             className="hidden"
//                                         />
//                                         <AiOutlineEdit size={18} />
//                                     </label>
//                                 )}
//                             </div>
//                         </div>

//                         {/* User Details */}
//                         <div className="space-y-6">
//                             {/* Name */}
//                             <div className="flex items-center gap-4 group">
//                                 <IoPersonOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium text-gray-600">Full Name</label>
//                                     {isEditing ? (
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             value={editedData.name}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50"
//                                             placeholder="Enter your name"
//                                         />
//                                     ) : (
//                                         <p className="text-gray-800 text-lg font-medium">{user.name}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Email */}
//                             <div className="flex items-center gap-4 group">
//                                 <IoMailOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium text-gray-600">Email Address</label>
//                                     {isEditing ? (
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             value={editedData.email}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50"
//                                             placeholder="Enter your email"
//                                         />
//                                     ) : (
//                                         <p className="text-gray-800 text-lg font-medium">{user.email}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Role */}
//                             <div className="flex items-center gap-4 group">
//                                 <IoBriefcaseOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium text-gray-600">Role</label>
//                                     <p className="text-gray-800 text-lg font-medium">{user.role}</p>
//                                 </div>
//                             </div>

//                             {/* Joined At */}
//                             <div className="flex items-center gap-4 group">
//                                 <IoCalendarOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium text-gray-600">Joined At</label>
//                                     <p className="text-gray-800 text-lg font-medium">
//                                         {new Date(user.createdAt).toLocaleDateString("en-US", {
//                                             year: "numeric",
//                                             month: "long",
//                                             day: "numeric",
//                                         })}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Status */}
//                             <div className="flex items-center gap-4 group">
//                                 <IoShieldCheckmarkOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium text-gray-600">Status</label>
//                                     <p className="text-gray-800 text-lg font-medium capitalize">{user.status}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Edit Controls */}
//                         {isEditing && (
//                             <div className="flex justify-end gap-4 mt-10">
//                                 <button
//                                     onClick={() => {
//                                         setIsEditing(false);
//                                         setAvatarPreview(user.avatar);
//                                         setSelectedFile(null);
//                                     }}
//                                     className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleSave}
//                                     disabled={loading}
//                                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <Spinner />
//                                             Saving...
//                                         </>
//                                     ) : (
//                                         "Save Changes"
//                                     )}
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserProfile;









import React, { useState, useEffect } from "react";
import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../features/api/authApi";
import { AiOutlineEdit } from "react-icons/ai";
import {
    IoPersonOutline,
    IoMailOutline,
    IoBriefcaseOutline,
    IoCalendarOutline,
    IoShieldCheckmarkOutline,
    IoBusinessOutline,
    IoCallOutline,
    IoLocationOutline,
    IoLinkOutline,
    IoInformationCircleOutline,
    IoTrophyOutline,
    IoPricetagsOutline,
    } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../layout/Spinner";
import Title from "../layout/Title";
import BackButton from "../layout/BackButton";

const UserProfile = () => {
    const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();
    const [updateProfile] = useUpdateProfileMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        name: "",
        email: "",
        organizationName: "",
        phoneNumber: "",
        address: "",
        website: "",
        socialLinks: [],
        about: "",
        experience: "",
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setEditedData({
                name: user.name || "",
                email: user.email || "",
                organizationName: user.organizationName || "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || "",
                website: user.website || "",
                socialLinks: user.socialLinks || [],
                about: user.about || "",
                experience: user.experience || "",
            });
            setAvatarPreview(user.avatar || null);
            setLogoPreview(user.logo || null);
        }
    }, [user]);

    const handleInputChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleSocialLinksChange = (index, value) => {
        const newLinks = [...editedData.socialLinks];
        newLinks[index] = value;
        setEditedData({ ...editedData, socialLinks: newLinks });
    };

    const addSocialLink = () => {
        setEditedData({ ...editedData, socialLinks: [...editedData.socialLinks, ""] });
    };

    const removeSocialLink = (index) => {
        const newLinks = editedData.socialLinks.filter((_, i) => i !== index);
        setEditedData({ ...editedData, socialLinks: newLinks });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === "avatar") {
                setSelectedAvatar(file);
                setAvatarPreview(URL.createObjectURL(file));
            } else if (type === "logo") {
                setSelectedLogo(file);
                setLogoPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            let avatarUrl = user.avatar;
            let logoUrl = user.logo;

            // Upload avatar if changed
            if (selectedAvatar) {
                const formData = new FormData();
                formData.append("avatar", selectedAvatar);
                formData.append("userId", user._id);

                const { data } = await axios.post("http://localhost:5000/api/auth/upload-avatar", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });
                avatarUrl = data.avatarUrl;
            }

            // Upload logo if changed (assuming same endpoint for simplicity)
            if (selectedLogo) {
                const formData = new FormData();
                formData.append("avatar", selectedLogo); // Reuse endpoint; adjust if separate
                formData.append("userId", user._id);

                const { data } = await axios.post("http://localhost:5000/api/auth/upload-avatar", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });
                logoUrl = data.avatarUrl;
            }

            await updateProfile({
                userId: user._id,
                updatedData: {
                    ...editedData,
                    avatar: avatarUrl,
                    logo: logoUrl,
                    socialLinks: editedData.socialLinks.filter((link) => link.trim() !== ""),
                },
            }).unwrap();
            toast.success("Your Profile Updated Successfully");
            setIsEditing(false);
            setSelectedAvatar(null);
            setSelectedLogo(null);
            setLoading(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Error Updating Profile");
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Spinner />
                    <p className="text-gray-600 text-lg animate-pulse">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-red-100">
                    <p className="text-red-600 text-lg font-semibold">Error</p>
                    <p className="text-gray-600 mt-2">{error?.data?.message || "Failed to fetch profile."}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <BackButton />
                </div>

                {/* Title */}
                <Title
                    title={user.role === "organizer" ? "Organizer Profile" : "My Profile"}
                    className="text-4xl font-bold text-gray-800 mb-8 text-center"
                />

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-white">
                            {user.role === "organizer" ? "Organizer Details" : "Your Profile"}
                        </h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
                            >
                                <AiOutlineEdit size={20} />
                                <span className="font-medium">Edit Profile</span>
                            </button>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        {/* Avatar */}
                        <div className="flex justify-center mb-8 relative">
                            <div className="relative group">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="User Avatar"
                                        onError={() => setAvatarPreview(null)}
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-semibold shadow-lg">
                                        {user?.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                )}
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-3 cursor-pointer hover:bg-blue-700 transition-all duration-300 shadow-md">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, "avatar")}
                                            className="hidden"
                                        />
                                        <AiOutlineEdit size={18} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="space-y-6">
                            {/* Name */}
                            <div className="flex items-center gap-4 group">
                                <IoPersonOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                                            placeholder="Enter your name"
                                        />
                                    ) : (
                                        <p className="text-gray-800 text-lg font-medium">{user.name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-4 group">
                                <IoMailOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600">Email Address</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editedData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                                            placeholder="Enter your email"
                                        />
                                    ) : (
                                        <p className="text-gray-800 text-lg font-medium">{user.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Role */}
                            <div className="flex items-center gap-4 group">
                                <IoBriefcaseOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600">Role</label>
                                    <p className="text-gray-800 text-lg font-medium capitalize">{user.role}</p>
                                </div>
                            </div>

                            {/* Joined At */}
                            <div className="flex items-center gap-4 group">
                                <IoCalendarOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600">Joined At</label>
                                    <p className="text-gray-800 text-lg font-medium">
                                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-4 group">
                                <IoShieldCheckmarkOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600">Status</label>
                                    <p className="text-gray-800 text-lg font-medium capitalize">{user.status}</p>
                                </div>
                            </div>
                        </div>

                        {/* Organizer Details (Conditional) */}
                        {user.role === "organizer" && (
                            <div className="mt-10 border-t border-gray-200 pt-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">Organization Details</h3>
                                <div className="space-y-6">
                                    {/* Logo */}
                                    <div className="flex justify-center mb-8 relative">
                                        <div className="relative group">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Organization Logo"
                                                    onError={() => setLogoPreview(null)}
                                                    className="w-24 h-24 rounded-lg border-2 border-gray-200 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-semibold shadow-lg">
                                                    {user?.organizationName?.[0]?.toUpperCase() || "?"}
                                                </div>
                                            )}
                                            {isEditing && (
                                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-all duration-300 shadow-md">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, "logo")}
                                                        className="hidden"
                                                    />
                                                    <AiOutlineEdit size={16} />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Organization Name */}
                                    <div className="flex items-center gap-4 group">
                                        <IoBusinessOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-600">Organization Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="organizationName"
                                                    value={editedData.organizationName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                                                    placeholder="Enter organization name"
                                                />
                                            ) : (
                                                <p className="text-gray-800 text-lg font-medium">{user.organizationName || "Not set"}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="flex items-center gap-4 group">
                                        <IoCallOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={editedData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                                                    placeholder="Enter phone number"
                                                />
                                            ) : (
                                                <p className="text-gray-800 text-lg font-medium">{user.phoneNumber || "Not set"}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-center gap-4 group">
                                        <IoLocationOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-600">Address</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={editedData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                                                    placeholder="Enter address"
                                                />
                                            ) : (
                                                <p className="text-gray-800 text-lg font-medium">{user.address || "Not set"}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Website */}
                                    <div className="flex items-center gap-4 group">
                                        <IoLinkOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-600">Website</label>
                                            {isEditing ? (
                                                <input
                                                    type="url"
                                                    name="website"
                                                    value={editedData.website}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                                                    placeholder="Enter website URL"
                                                />
                                            ) : (
                                                <p className="text-gray-800 text-lg font-medium">
                                                    {user.website ? (
                                                        <a
                                                            href={user.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {user.website}
                                                        </a>
                                                    ) : (
                                                        "Not set"
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="flex items-start gap-4 group">
                                        <IoLinkOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-600">Social Links</label>
                                            {isEditing ? (
                                                <div className="space-y-2 mt-1">
                                                    {editedData.socialLinks.map((link, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <input
                                                                type="url"
                                                                value={link}
                                                                onChange={(e) => handleSocialLinksChange(index, e.target.value)}
                                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                                                                placeholder="Enter social link"
                                                            />
                                                            <button
                                                                onClick={() => removeSocialLink(index)}
                                                                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={addSocialLink}
                                                        className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300"
                                                    >
                                                        Add Link
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mt-1">
                                                    {user.socialLinks && user.socialLinks.length > 0 ? (
                                                        <ul className="space-y-1">
                                                            {user.socialLinks.map((link, index) => (
                                                                <li key={index}>
                                                                    <a
                                                                        href={link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:underline text-lg"
                                                                    >
                                                                        {link}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-800 text-lg font-medium">Not set</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* About */}
                                    <div className="flex items-start gap-4 group">
                                        <IoInformationCircleOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-600">About</label>
                                            {isEditing ? (
                                                <textarea
                                                    name="about"
                                                    value={editedData.about}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 resize-y"
                                                    placeholder="Tell us about your organization"
                                                    rows={4}
                                                />
                                            ) : (
                                                <p className="text-gray-800 text-lg font-medium whitespace-pre-wrap">
                                                    {user.about || "Not set"}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Experience */}
                                    <div className="flex items-start gap-4 group">
                                        <IoTrophyOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-600">Experience</label>
                                            {isEditing ? (
                                                <textarea
                                                    name="experience"
                                                    value={editedData.experience}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 resize-y"
                                                    placeholder="Describe your experience"
                                                    rows={4}
                                                />
                                            ) : (
                                                <p className="text-gray-800 text-lg font-medium whitespace-pre-wrap">
                                                    {user.experience || "Not set"}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Event Categories (Non-editable) */}
                                    <div className="flex items-start gap-4 group">
                                        <IoPricetagsOutline className="text-gray-500 text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-600">Event Categories</label>
                                            {user.eventCategories && user.eventCategories.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {user.eventCategories.map((category, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                                                        >
                                                            {category}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-800 text-lg font-medium">Not set</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Controls */}
                        {isEditing && (
                            <div className="flex justify-end gap-4 mt-10">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setAvatarPreview(user.avatar);
                                        setLogoPreview(user.logo);
                                        setSelectedAvatar(null);
                                        setSelectedLogo(null);
                                        setEditedData({
                                            name: user.name || "",
                                            email: user.email || "",
                                            organizationName: user.organizationName || "",
                                            phoneNumber: user.phoneNumber || "",
                                            address: user.address || "",
                                            website: user.website || "",
                                            socialLinks: user.socialLinks || [],
                                            about: user.about || "",
                                            experience: user.experience || "",
                                        });
                                    }}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;