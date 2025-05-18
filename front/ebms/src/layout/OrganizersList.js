import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { setFollowedOrganizers } from '../features/slices/authSlice';
import { useGetOrganizersQuery, useGetOrganizerFollowersQuery, useFollowOrganizerMutation } from '../features/api/authApi';

// Helper to get initials from name
const getInitials = (name) => {
    const nameArray = name.split(' ');
    return nameArray.map((word) => word.charAt(0).toUpperCase()).join('');
};

// Custom hook to fetch followers for an organizer
const useOrganizerFollowers = (organizerId) => {
    console.log('Fetching followers for organizerId:', organizerId); // Debug log
    const { data: followersData, isLoading, isError, error } = useGetOrganizerFollowersQuery(organizerId, {
        skip: !organizerId || organizerId === 'undefined', // Skip if no valid organizerId
    });
    const followers = Array.isArray(followersData?.followers) ? followersData.followers : [];
    const followersCount = followers.length;
    return { followers, followersCount, isLoading, isError, error };
};

// Child component for rendering each organizer card
const OrganizerCard = ({ organizer, user, handleFollowOrganizer }) => {
    const { followers, followersCount, isLoading: followersLoading } = useOrganizerFollowers(organizer._id);
    const isFollowing = user?._id && followers.includes(user._id);

    if (followersLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center">
                <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            </div>
        );
    }

    return (
        <div
            className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
            <Link to={`/organizers/${organizer._id}`} className="block">
                <div className="flex items-center space-x-4">
                    {organizer.avatar ? (
                        <img
                            src={organizer.avatar}
                            alt={organizer.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 transition-transform duration-300 hover:scale-110"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl font-bold text-gray-700">
                            {getInitials(organizer.name)}
                        </div>
                    )}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                            {organizer.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {organizer.organizationName || 'Organizing events since 2010'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
                        </p>
                    </div>
                </div>
            </Link>
            <div className="mt-4">
                {!isFollowing ? (
                    <button
                        onClick={() => handleFollowOrganizer(organizer._id, organizer.name, followers)}
                        className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
                    >
                        Follow
                    </button>
                ) : (
                    <span className="flex items-center text-green-600 font-semibold">
                        <FaCheckCircle className="mr-2" /> Following
                    </span>
                )}
            </div>
        </div>
    );
};

const OrganizersList = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [itemsPerPage] = useState(8); // Number of organizers per page
    const [currentPage, setCurrentPage] = useState(1); // Track the current page

    // Fetch all organizers using RTK Query
    const { data: organizers = [], isLoading, isError, error } = useGetOrganizersQuery();

    // Debug organizers data
    console.log('Organizers data:', organizers);

    // Calculate displayed organizers
    const displayedOrganizers = organizers.slice(0, currentPage * itemsPerPage);
    const totalPages = Math.ceil(organizers.length / itemsPerPage);
    const canViewMore = currentPage < totalPages;
    const canViewLess = currentPage > 1;

    // Follow organizer mutation
    const [followOrganizer] = useFollowOrganizerMutation();

    const handleFollowOrganizer = async (organizerId, organizerName, followers) => {
        if (!user) {
            toast.info('Please log in to follow organizers.');
            return;
        }

        const isFollowing = user?._id && followers.includes(user._id);
        if (isFollowing) {
            toast.info(`You are already following ${organizerName}`);
            return;
        }

        if (!organizerId || organizerId === 'undefined') {
            toast.error('Invalid organizer ID');
            return;
        }

        try {
            const response = await followOrganizer({ userId: user._id, organizerId }).unwrap();
            dispatch(setFollowedOrganizers(response));
            toast.success(`You're now following ${organizerName}!`);
        } catch (err) {
            console.error('Error following organizer:', err);
            toast.error('Failed to follow organizer');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-100 flex items-center justify-center py-16">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-blue-600 text-5xl" />
                    <p className="mt-4 text-lg font-medium text-gray-600">Loading organizers...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-100 flex items-center justify-center py-16">
                <div className="text-center">
                    <p className="text-lg font-medium text-red-500">Failed to load organizers: {error?.message || 'Unknown error'}</p>
                </div>
            </div>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10 text-center">
                    Discover All Organizers
                    <div className="mt-3 h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
                </h2>
                {organizers.length === 0 ? (
                    <p className="text-center text-lg text-gray-600">No organizers available.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayedOrganizers.map((organizer) => (
                                <OrganizerCard
                                    key={organizer._id}
                                    organizer={organizer}
                                    user={user}
                                    handleFollowOrganizer={handleFollowOrganizer}
                                />
                            ))}
                        </div>
                        <div className="text-center mt-10 flex justify-center space-x-6">
                            {canViewLess && (
                                <button
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                    className="inline-flex items-center bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors text-sm font-medium shadow-md"
                                >
                                    View Less
                                </button>
                            )}
                            {canViewMore && (
                                <button
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                    className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
                                >
                                    View More
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default OrganizersList;