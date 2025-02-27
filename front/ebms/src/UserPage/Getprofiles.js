// import React, { useState ,useEffect} from 'react';
// import { useGetCurrentUserQuery, useUpdateProfileMutation } from '../features/api/authApi';
// import { AiOutlineEdit } from 'react-icons/ai';
// import axios from 'axios';
// const UserProfile = () => {
//     const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();
//     const [updateProfile] = useUpdateProfileMutation(); // Mutation for updating the profile
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedData, setEditedData] = useState({ name: '', email: '' });
//     const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null); // Preview for the avatar
//     const [selectedFile, setSelectedFile] = useState(null); // Selected file for the avatar

//     // Handle input changes in edit mode
//     const handleInputChange = (e) => {
//         setEditedData({ ...editedData, [e.target.name]: e.target.value });
//     };

//     // Handle file input change for avatar
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             setAvatarPreview(URL.createObjectURL(file)); // Generate a preview URL
//         }
//     };
//     useEffect(() => {
//         if (user?.avatar) {
//             setAvatarPreview(user.avatar); // Ensure the full URL is set
//         }
//     }, [user]);
//     // Handle save functionality (with avatar upload)
//     const handleSave = async () => {
//         try {
//             let avatarUrl = user.avatar; // Default to the existing avatar
//             // If a new file is selected, upload it
//             if (selectedFile) {
//                 const formData = new FormData();
//                 formData.append('avatar', selectedFile);
//                 formData.append('userId', user._id);

//                 const { data } = await axios.post('http://localhost:5000/api/auth/upload-avatar', formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                     withCredentials: true, // Ensures cookies are sent with the request

//                 });

//                 avatarUrl = data.avatarUrl; // Update with the new avatar URL from the backend
//             }

//             // Update the user's profile
//             await updateProfile({
//                 userId: user._id,
//                 updatedData: { ...editedData, avatar: avatarUrl },
//             }).unwrap();

//             console.log('Profile updated successfully');
//             setIsEditing(false);
//         } catch (err) {
//             console.error('Error updating profile:', err);
//         }
//     };

//     if (isLoading) return <div>Loading...</div>;
//     if (isError) return <div className="text-red-500">Error: {error?.data?.message || 'Failed to fetch profile.'}</div>;

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-2xl font-bold text-gray-700 ">User Profile</h2>
//                     <AiOutlineEdit
//                         className="text-gray-500 cursor-pointer hover:text-gray-700"
//                         size={24}
//                         onClick={() => {
//                             setIsEditing(true);
//                             setEditedData({ name: user.name, email: user.email });
//                         }}
//                     />
//                 </div>
//                 <div className="space-y-4">
//                     {/* User Avatar */}
//                     <div className="flex flex-col items-center">
//                         {avatarPreview ? (
//                             <img
//                                 src={avatarPreview}
//                                 alt="User Avatar"
//                                 onError={() => setAvatarPreview(null)}
//                                 className="w-36 h-36 rounded-full mb-2"
//                             />
//                         ) : (
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="w-24 h-24 bg-gray-200 text-gray-500 rounded-full mb-2"
//                                 fill="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path d="M12 12c2.75 0 5-2.25 5-5s-2.25-5-5-5-5 2.25-5 5 2.25 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
//                             </svg>
//                         )}

                                          
                    
                       
//                         {isEditing && (
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 className="text-sm text-gray-500"
//                             />
//                         )}
//                     </div>

//                     {/* User Details */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600">Name</label>
//                         {isEditing ? (
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={editedData.name}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
//                             />
//                         ) : (
//                             <p className="text-gray-800">{user.name}</p>
//                         )}
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600">Email</label>
//                         {isEditing ? (
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={editedData.email}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
//                             />
//                         ) : (
//                             <p className="text-gray-800">{user.email}</p>
//                         )}
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600">Role</label>
//                         <p className="text-gray-800">{user.role}</p>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-600">Joined At</label>
//                         <p className="text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-600">Status</label>
//                         <p className="text-gray-800">{user.status}</p>
//                     </div>

//                     {/* Save & Cancel Buttons */}
//                     {isEditing && (
//                         <div className="flex justify-end space-x-4">
//                             <button
//                                 onClick={() => setIsEditing(false)}
//                                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleSave}
//                                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserProfile;



import React, { useState, useEffect } from "react";
import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../features/api/authApi";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from '../layout/Spinner'
const UserProfile = () => {
    const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();
    const [updateProfile] = useUpdateProfileMutation(); // Mutation for updating the profile

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ name: "", email: "" });
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (user?.avatar) {
            setAvatarPreview(user.avatar);
        }
    }, [user]);

    const handleInputChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            setLoading(!loading);
            let avatarUrl = user.avatar;

            if (selectedFile) {
                const formData = new FormData();
                formData.append("avatar", selectedFile);
                formData.append("userId", user._id);

                const { data } = await axios.post("http://localhost:5000/api/auth/upload-avatar", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });

                avatarUrl = data.avatarUrl;
            }

            await updateProfile({
                userId: user._id,
                updatedData: { ...editedData, avatar: avatarUrl },
            }).unwrap();
            toast.success('Your Profile Updated Successfully');
            setIsEditing(false);
            setLoading(false)
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Error Updating Profile")
            setLoading(false);
        }
    };

    if (isLoading) return <div className="text-center text-lg text-gray-500">Loading profile...</div>;
    if (isError) return <div className="text-red-500 text-center">Error: {error?.data?.message || "Failed to fetch profile."}</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md backdrop-blur-lg bg-opacity-80 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
                    <AiOutlineEdit
                        className="text-gray-600 cursor-pointer hover:text-gray-800 transition-all"
                        size={24}
                        onClick={() => {
                            setIsEditing(true);
                            setEditedData({ name: user.name, email: user.email });
                        }}
                    />
                </div>

                {/* User Avatar */}
                <div className="flex flex-col items-center">
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="User Avatar"
                            onError={() => setAvatarPreview(null)}
                            className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg transition-all hover:scale-105"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl">
                            ?
                        </div>
                    )}
                    {isEditing && (
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2 text-sm text-gray-500" />
                    )}
                </div>

                {/* User Details */}
                <div className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={editedData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all"
                            />
                        ) : (
                            <p className="text-gray-800 text-lg">{user.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={editedData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all"
                            />
                        ) : (
                            <p className="text-gray-800 text-lg">{user.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Role</label>
                        <p className="text-gray-800">{user.role}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Joined At</label>
                        <p className="text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Status</label>
                        <p className="text-gray-800">{user.status}</p>
                    </div>
                </div>

                {/* Save & Cancel Buttons */}
                {isEditing && (
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"

                        >
                         {loading?<Spinner/>:'Save'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
