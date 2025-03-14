import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"; // Importing React Icon for the arrow

const BackButton = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); // This will take the user to the previous page in history
    };

    return (
        <div className="flex items-center">
            <button
                onClick={handleBackClick}
                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-400 transition duration-200"
            >
                <IoArrowBack className="mr-2 text-xl" /> {/* Adding icon with margin */}
                <span>Back</span>
            </button>
        </div>
    );
};

export default BackButton;
