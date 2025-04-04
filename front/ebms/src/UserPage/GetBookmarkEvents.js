import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Title from "../layout/Title";
import { toast } from "react-toastify";
import { IoBookmark, IoLocationOutline, IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import SkeletonLoader from "../layout/SkeletonLoader";

const BookmarkedEvents = () => {
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showUnbookmarkModal, setShowUnbookmarkModal] = useState(false);
    const [eventToUnbookmark, setEventToUnbookmark] = useState(null);

    useEffect(() => {
        const fetchBookmarkedEvents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/bookmarks/bookmarkedEvents", {
                    withCredentials: true,
                });
                console.log("API Response:", response.data); // Debug the API response
                // If the response indicates no bookmarks (e.g., empty array or specific message), handle it gracefully
                if (!response.data || response.data.length === 0 || response.data.success === false) {
                    setBookmarkedEvents([]);
                    setFilteredEvents([]);
                } else {
                    setBookmarkedEvents(response.data);
                    setFilteredEvents(response.data);
                }
            } catch (error) {
                console.error("Error fetching bookmarked events", error.response ? error.response.data : error.message);
                // Only set an error if it's a genuine failure (e.g., network issue), not just "no bookmarks"
               
                setBookmarkedEvents([]);
                setFilteredEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarkedEvents();
    }, []);

    // Filter events based on search query and category
    useEffect(() => {
        let filtered = bookmarkedEvents;

        if (searchQuery) {
            filtered = filtered.filter((event) => {
                const title = event?.title || "";
                const locationName = event?.location?.name || "";
                return (
                    title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    locationName.toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter((event) => (event?.category || "") === selectedCategory);
        }

        setFilteredEvents(filtered);
    }, [searchQuery, selectedCategory, bookmarkedEvents]);

    const handleUnbookmark = async () => {
        if (!eventToUnbookmark) return;

        try {
            await axios.delete(`http://localhost:5000/api/bookmarks/event/${eventToUnbookmark}/unbookmark`, {
                withCredentials: true,
            });
            setBookmarkedEvents((prev) => prev.filter((event) => event._id !== eventToUnbookmark));
            toast.success("Event removed from bookmarks!");
        } catch (error) {
            console.error("Error unbookmarking event:", error);
            toast.error("Failed to remove event from bookmarks.");
        } finally {
            setShowUnbookmarkModal(false);
            setEventToUnbookmark(null);
        }
    };

    const confirmUnbookmark = (eventId) => {
        setEventToUnbookmark(eventId);
        setShowUnbookmarkModal(true);
    };

    const categories = ["All", ...new Set(bookmarkedEvents.map((event) => event?.category || ""))];

    if (loading) return <div className="text-center text-gray-600 py-12"><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div> </div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <IoBookmark className="text-2xl text-gray-800" />
                <h2 className="text-2xl font-semibold text-gray-800">
                    Bookmarked Events
                    <span className="ml-2 text-gray-500 text-sm">
                        {bookmarkedEvents.length} {bookmarkedEvents.length === 1 ? "Event" : "Events"}
                    </span>
                </h2>
            </div>

            <Title title="Bookmarked Events" />

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search events by title or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category} {category === "All" ? "Categories" : ""}
                        </option>
                    ))}
                </select>
            </div>

            {/* Events Grid or No Events Message */}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                        >
                            <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                                {event?.images?.[0] ? (
                                    <img
                                        src={`http://localhost:5000${event.images[0]}`}
                                        alt={event.title || "Event"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        className="w-12 h-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                )}
                                <span className="absolute top-2 left-2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                    {event?.category || "Uncategorized"}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{event?.title || "Untitled Event"}</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <IoCalendarOutline />
                                        <span>
                                            {event?.eventDate
                                                ? new Date(event.eventDate).toLocaleDateString()
                                                : "Date TBD"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IoTimeOutline />
                                        <span>
                                            {event?.eventDate
                                                ? new Date(event.eventDate).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "Time TBD"}{" "}
                                            -{" "}
                                            {event?.eventDate
                                                ? new Date(
                                                    new Date(event.eventDate).getTime() + 9 * 60 * 60 * 1000
                                                ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                                : "Time TBD"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IoLocationOutline />
                                        <span>{event?.location?.name?.split(',')[1] || "Location TBD"}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-center hover:bg-gray-200 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        onClick={() => confirmUnbookmark(event._id)}
                                        className="flex items-center justify-center gap-1 px-4 py-2 bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Unbookmark
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 text-lg py-12">
                    {searchQuery || selectedCategory !== "All" ? (
                        "No events match your search or filter."
                    ) : (
                        <>
                            You have no bookmarked events. <br />
                            <Link to="/events" className="text-blue-500 hover:underline">
                                Go bookmark an event
                            </Link>{" "}
                            for future use if you’d like!
                        </>
                    )}
                </div>
            )}

            {/* Unbookmark Confirmation Modal */}
            {showUnbookmarkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg transform transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Confirm Unbookmark</h3>
                            <button
                                onClick={() => setShowUnbookmarkModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Are you sure you want to remove this event from your bookmarks? You can always bookmark it again later.
                            </p>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowUnbookmarkModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnbookmark}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Unbookmark
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookmarkedEvents;