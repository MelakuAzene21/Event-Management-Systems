import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToggleBookmarkMutation } from "../features/api/bookingApi";
const BookmarkButton = ({ eventId, isBookmarkedInitial }) => {
    const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const [toggleBookmark, { isLoading }] = useToggleBookmarkMutation();

    const handleClick = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            const res = await toggleBookmark(eventId).unwrap();
            setIsBookmarked((prev) => !prev); // toggle UI immediately
            toast.success(res.message);
        } catch (err) {
            console.error("Bookmark error:", err);
            toast.error("Failed to update bookmark");
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 text-2xl rounded-full transition duration-300 focus:outline-none 
                ${isBookmarked ? "text-yellow-500" : "text-gray-500"} 
                hover:text-yellow-400`}
            disabled={isLoading}         >
            {isBookmarked ? "★" : "☆"}
        </button>
    );
};

export default BookmarkButton;
