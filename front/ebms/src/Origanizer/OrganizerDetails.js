import React from "react";
import { useParams } from "react-router-dom";
import {
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon,
    TagIcon,
    BuildingOfficeIcon,
    InformationCircleIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { useGetOrganizerQuery } from "../features/api/authApi";
import { toast } from "react-toastify";
import BackButton from "../layout/BackButton";

const OrganizerDetails = () => {
    const { id } = useParams();
    const { data: organizer, isLoading, isError, error } = useGetOrganizerQuery(id);

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <svg
                    className="animate-spin h-8 w-8 text-blue-500"
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
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                </svg>
            </div>
        );
    }

    if (isError) {
        toast.error(error?.data?.message || "Failed to load organizer details");
        return (
            <div className="mx-4 my-8 p-4 bg-red-100 text-red-700 rounded-lg">
                Error: {error?.data?.message || "Could not fetch organizer details."}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <BackButton />
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-blue-600 text-white p-6 text-center">
                    <img
                        src={organizer?.avatar}
                        alt={organizer?.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md object-cover"
                        onError={(e) => (e.target.src = "/default.jpg")}
                    />
                    <h1 className="text-3xl font-bold">
                        {organizer.organizationName || organizer.name}
                    </h1>
                    <p className="text-lg opacity-90">Event Organizer</p>
                </div>

                {/* Main Content */}
                <div className="p-6 sm:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Basic Info */}
                        <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                <InformationCircleIcon className="h-6 w-6 text-gray-500" />
                                About
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {organizer.about || "No description provided."}
                            </p>

                            <hr className="my-6 border-gray-200" />

                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                <BriefcaseIcon className="h-6 w-6 text-gray-500" />
                                Experience
                            </h2>
                            <p className="text-gray-600">
                                {organizer.experience || "Not specified."}
                            </p>
                        </div>

                        {/* Right Column: Contact & Categories */}
                        <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                                Organization Details
                            </h2>
                            <div className="mb-6">
                                {organizer.phoneNumber && (
                                    <div className="flex items-center mb-2">
                                        <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <p className="text-gray-700">{organizer.phoneNumber}</p>
                                    </div>
                                )}
                                {organizer.address && (
                                    <div className="flex items-center mb-2">
                                        <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <p className="text-gray-700">{organizer.address}</p>
                                    </div>
                                )}
                                {organizer.website && (
                                    <div className="flex items-center mb-2">
                                        <GlobeAltIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <a
                                            href={organizer.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {organizer.website}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {organizer.socialLinks?.length > 0 && (
                                <>
                                    <h2 className="text-xl font-semibold mb-4">Social Media</h2>
                                    <div className="mb-6">
                                        {organizer.socialLinks.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-blue-600 hover:underline mb-2"
                                            >
                                                {link}
                                            </a>
                                        ))}
                                    </div>
                                </>
                            )}

                            {organizer.eventCategories?.length > 0 && (
                                <>
                                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                        <TagIcon className="h-6 w-6 text-gray-500" />
                                        Event Categories
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {organizer.eventCategories.map((category, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 text-center">
                        <a
                            href={organizer.website || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-block px-6 py-2 rounded-lg text-white font-semibold mr-4 ${organizer.website
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Visit Website
                        </a>
                        <button
                            onClick={() => toast.info("Contact functionality coming soon!")}
                            className="inline-block px-6 py-2 rounded-lg text-blue-600 font-semibold border border-blue-600 hover:bg-blue-50"
                        >
                            Contact Organizer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDetails;