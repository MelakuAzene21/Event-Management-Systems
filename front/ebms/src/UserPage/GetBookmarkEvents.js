import { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom"
import Title from "../layout/Title";
const BookmarkedEvents = () => {
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarkedEvents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/bookmarks/bookmarkedEvents", {
                    withCredentials: true
                });
                setBookmarkedEvents(response.data);
            } catch (error) {
                console.error("Error fetching bookmarked events", error.response ? error.response.data : error.message);
                setError("Failed to fetch bookmarked events");
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarkedEvents();
    }, []);

    const handleUnbookmark = async (eventId) => {
        try {
            await axios.delete(`http://localhost:5000/api/bookmarks/event/${eventId}/unbookmark`, { withCredentials: true });
            setBookmarkedEvents((prev) => prev.filter((event) => event._id !== eventId));
        } catch (error) {
            console.error("Error unbookmarking event:", error);
        }
    };

    if (loading) return <div className="text-center text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Your Bookmarked Events</h2>
<Title title={"Bookmarked Events"}/>
            {bookmarkedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookmarkedEvents.map((event) => (
                        <div key={event._id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out">
                            
                            <Link to={`/events/${event._id}`}><img
                                src={`http://localhost:5000${event.images[0]}`}
                                alt={event.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            /></Link>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                                <p className="text-gray-500 text-sm mb-2">{new Date(event.eventDate).toLocaleString()}</p>
                                <p className="text-gray-500 text-sm mb-4">{event.location}</p>

                                <button
                                    className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-200 ease-in-out"
                                    onClick={() => handleUnbookmark(event._id)}
                                >
                                    Remove from Bookmarks
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 text-lg">You haven't bookmarked any events yet.</div>
            )}
        </div>
    );
};

export default BookmarkedEvents;
