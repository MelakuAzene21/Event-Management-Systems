
import { useState } from "react";

const BookmarkButton = ({ eventId, isBookmarkedInitial, onBookmark }) => {
    const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);

    const handleClick = async () => {
        try {
            // Call the `onBookmark` prop and pass the event ID and current state
            if (onBookmark) {
                await onBookmark(eventId, isBookmarked);
            }
            // Toggle the local bookmark state
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error("Error handling bookmark action:", error);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 
                ${isBookmarked ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'} 
                hover:bg-yellow-400 focus:outline-none`}
        >
            <span className="text-2xl">{isBookmarked ? '★' : '☆'}</span>
            <span className="ml-2 text-sm font-semibold">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        </button>
    );
};

export default BookmarkButton;
