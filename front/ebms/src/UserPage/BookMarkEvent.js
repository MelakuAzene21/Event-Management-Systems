// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";

// const BookmarkButton = ({ eventId, isBookmarkedInitial, onBookmark }) => {
//     const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);

//     // Sync local state with the latest prop value when the component re-renders
//     useEffect(() => {
//         setIsBookmarked(isBookmarkedInitial);
//     }, [isBookmarkedInitial]);

//     const handleClick = async () => {
//         try {
//             if (onBookmark) {
//                 await onBookmark(eventId, isBookmarked);
//             }
//             setIsBookmarked((prev) => !prev); // Toggle state after API call
//         } catch (error) {
//             console.error("Error handling bookmark action:", error);
//             toast.error("Error handling bookmark action");
//         }
//     };

//     return (
//         <button
//             onClick={handleClick}
//             className={`p-2 text-2xl rounded-full transition duration-300 focus:outline-none
//                 ${isBookmarked ? "text-yellow-500" : "text-gray-500"}
//                 hover:text-yellow-400`}
//         >
//             {isBookmarked ? "★" : "☆"}
//         </button>
//     );
// };

// export default BookmarkButton;


import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookmarkButton = ({ eventId, isBookmarkedInitial }) => {
    const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    // Sync with backend when `isBookmarkedInitial` changes
    useEffect(() => {
        setIsBookmarked(isBookmarkedInitial);
    }, [isBookmarkedInitial]);

    const handleClick = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
                const response = await axios.post(
                    `http://localhost:5000/api/bookmarks/event/${eventId}/toggle`,
                    null,
                    { withCredentials: true }
                );

                toast.success(response.data.message);

            } catch (error) {
                console.error("Error handling bookmark:", error);
                toast.error("Failed to update bookmark");
            }
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 text-2xl rounded-full transition duration-300 focus:outline-none 
                ${isBookmarked ? "text-yellow-500" : "text-gray-500"} 
                hover:text-yellow-400`}
        >
            {isBookmarked ? "★" : "☆"}
        </button>
    );
};

export default BookmarkButton;
