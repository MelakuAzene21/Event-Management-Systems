import React, { useState, useEffect } from "react";
import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../features/api/authApi";
import { AiOutlineEdit } from "react-icons/ai";
import { IoPersonOutline, IoMailOutline, IoBriefcaseOutline, IoCalendarOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from '../layout/Spinner';
import Title from "../layout/Title";
import BackButton from "../layout/BackButton";

const UserProfile = () => {
    const { data: user, isLoading, isError, error } = useGetCurrentUserQuery();
    const [updateProfile] = useUpdateProfileMutation();

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
            setLoading(true);
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
            setLoading(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Error Updating Profile");
            setLoading(false);
        }
    };

    if (isLoading) return <div className="text-center text-lg text-gray-500 py-12">Loading profile...</div>;
    if (isError) return <div className="text-red-500 text-center py-12">Error: {error?.data?.message || "Failed to fetch profile."}</div>;

    return (
        <>
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Title title="Profile Page" />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            setEditedData({ name: user.name, email: user.email });
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                    >
                        <AiOutlineEdit size={18} />
                        Edit Profile
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-xl p-8 border border-gray-100">
                    <p className="text-gray-500 mb-6">View and update your personal information.</p>

                    {/* User Avatar */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="User Avatar"
                                    onError={() => setAvatarPreview(null)}
                                    className="w-32 h-32 rounded-full border-2 border-gray-200 shadow-sm object-cover transition-transform hover:scale-105"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
                                    ?
                                </div>
                            )}
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-all">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <AiOutlineEdit size={16} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <IoPersonOutline className="text-gray-500 text-xl" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600">Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                ) : (
                                    <p className="text-gray-800 text-lg">{user.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <IoMailOutline className="text-gray-500 text-xl" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={editedData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                ) : (
                                    <p className="text-gray-800 text-lg">{user.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <IoBriefcaseOutline className="text-gray-500 text-xl" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600">Role</label>
                                <p className="text-gray-800 text-lg">{user.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <IoCalendarOutline className="text-gray-500 text-xl" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600">Joined At</label>
                                <p className="text-gray-800 text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <IoShieldCheckmarkOutline className="text-gray-500 text-xl" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600">Status</label>
                                <p className="text-gray-800 text-lg">{user.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Save & Cancel Buttons */}
                    {isEditing && (
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                {loading ? <Spinner /> : "Save"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserProfile;