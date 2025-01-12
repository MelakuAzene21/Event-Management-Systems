// import React, { useState } from 'react';
// import { useGetCurrentUserQuery } from '../features/api/authApi'; 
// import { AiOutlineEdit } from 'react-icons/ai';

// const UserProfile = () => {
//     const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedData, setEditedData] = useState({ name: '', email: '' });

//     // Handle input changes in edit mode
//     const handleInputChange = (e) => {
//         setEditedData({ ...editedData, [e.target.name]: e.target.value });
//     };

//     // Handle save functionality (add API call for saving changes if required)
//     const handleSave = () => {
//         // Perform save logic here (e.g., call an API to update the profile)
//         console.log('Save clicked, data to save:', editedData);
//         setIsEditing(false);
//     };

//     if (isLoading) return <div>Loading...</div>;
//     if (isError) return <div className="text-red-500">Error: {error?.data?.message || 'Failed to fetch profile.'}</div>;

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-2xl font-bold text-gray-700">User Profile</h2>
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
//                     <div className="flex justify-center">
//                         <img
//                             src={user.avatar || '/default-avatar.png'} // Replace with user.avatar if available
//                             alt="User Avatar"
//                             className="w-24 h-24 rounded-full"
//                         />
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


// import React, { useState } from 'react';
// import { useGetCurrentUserQuery, useUpdateProfileMutation } from '../features/api/authApi';
// import { AiOutlineEdit } from 'react-icons/ai';

// const UserProfile = () => {
//     const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();
//     const [updateProfile] = useUpdateProfileMutation(); // Mutation for updating the profile
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedData, setEditedData] = useState({ name: '', email: '' });

//     // Handle input changes in edit mode
//     const handleInputChange = (e) => {
//         setEditedData({ ...editedData, [e.target.name]: e.target.value });
//     };

//     // Handle save functionality
//     const handleSave = async () => {
//         try {
//             const response = await updateProfile({
//                 userId: user._id, // Pass the current user's ID
//                 updatedData: editedData, // Pass the updated data
//             }).unwrap();
//             console.log('Profile updated:', response);
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
//                     <h2 className="text-2xl text-center  font-bold text-gray-700">User Profile</h2>
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
//                     <div className="flex justify-center">
//                         {user?.avatar ? (
//                             <img
//                                 src={user.avatar}
//                                 alt="User Avatar"
//                                 className="w-24 h-24 rounded-full"
//                             />
//                         ) : (
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="w-24 h-24 bg-gray-200 text-gray-500 rounded-full"
//                                 fill="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path d="M12 12c2.75 0 5-2.25 5-5s-2.25-5-5-5-5 2.25-5 5 2.25 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
//                             </svg>
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
                        
//                             <p className="text-gray-800">{user.role}</p>
                        
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



import React, { useState ,useEffect} from 'react';
import { useGetCurrentUserQuery, useUpdateProfileMutation } from '../features/api/authApi';
import { AiOutlineEdit } from 'react-icons/ai';
import axios from 'axios';
const UserProfile = () => {
    const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();
    const [updateProfile] = useUpdateProfileMutation(); // Mutation for updating the profile
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ name: '', email: '' });
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null); // Preview for the avatar
    const [selectedFile, setSelectedFile] = useState(null); // Selected file for the avatar

    // Handle input changes in edit mode
    const handleInputChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    // Handle file input change for avatar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAvatarPreview(URL.createObjectURL(file)); // Generate a preview URL
        }
    };
    useEffect(() => {
        if (user?.avatar) {
            setAvatarPreview(user.avatar); // Ensure the full URL is set
        }
    }, [user]);
    // Handle save functionality (with avatar upload)
    const handleSave = async () => {
        try {
            let avatarUrl = user.avatar; // Default to the existing avatar
            // If a new file is selected, upload it
            if (selectedFile) {
                const formData = new FormData();
                formData.append('avatar', selectedFile);
                formData.append('userId', user._id);

                const { data } = await axios.post('http://localhost:5000/api/auth/upload-avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true, // Ensures cookies are sent with the request

                });

                avatarUrl = data.avatarUrl; // Update with the new avatar URL from the backend
            }

            // Update the user's profile
            await updateProfile({
                userId: user._id,
                updatedData: { ...editedData, avatar: avatarUrl },
            }).unwrap();

            console.log('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div className="text-red-500">Error: {error?.data?.message || 'Failed to fetch profile.'}</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-700 ">User Profile</h2>
                    <AiOutlineEdit
                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                        size={24}
                        onClick={() => {
                            setIsEditing(true);
                            setEditedData({ name: user.name, email: user.email });
                        }}
                    />
                </div>
                <div className="space-y-4">
                    {/* User Avatar */}
                    <div className="flex flex-col items-center">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="User Avatar"
                                onError={() => setAvatarPreview(null)}
                                className="w-36 h-36 rounded-full mb-2"
                            />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-24 h-24 bg-gray-200 text-gray-500 rounded-full mb-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 12c2.75 0 5-2.25 5-5s-2.25-5-5-5-5 2.25-5 5 2.25 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                            </svg>
                        )}

                                          
                    
                       
                        {isEditing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="text-sm text-gray-500"
                            />
                        )}
                    </div>

                    {/* User Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={editedData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        ) : (
                            <p className="text-gray-800">{user.name}</p>
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
                                className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        ) : (
                            <p className="text-gray-800">{user.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Role</label>
                        <p className="text-gray-800">{user.role}</p>
                    </div>

                    {/* Save & Cancel Buttons */}
                    {isEditing && (
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
