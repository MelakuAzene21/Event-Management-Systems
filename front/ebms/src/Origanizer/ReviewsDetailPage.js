import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ReviewsDetailPage = () => {
    const { eventId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [eventTitle, setEventTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = "http://localhost:5000"; // Change this to your backend URL

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Fetch event details
                const eventRes = await axios.get(`${BASE_URL}/api/events/${eventId}`);
                setEventTitle(eventRes.data.title);

                // Fetch reviews
                const reviewsRes = await axios.get(`${BASE_URL}/api/reviews/${eventId}`);
                setReviews(reviewsRes.data);
            } catch (err) {
                setError("Failed to load reviews.");
                console.error("Error fetching reviews:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [eventId]);


    const getInitials = (name) => {
        return name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">📢 Reviews for  <span className="text-green-600 underline italic">{eventTitle}</span> Event</h1>

                <div className="flex justify-start mb-4">
                    <Link to="/organizer-dashboard" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        ← Back to Events
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : reviews.length === 0 ? (
                    <p className="text-center text-gray-500">No reviews yet for this event.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-white p-5 rounded-lg shadow-md flex items-start space-x-4">
                                {/* Avatar */}
                                {review.attendeeId?.avatar ? (
                                    <img src={review.attendeeId.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-semibold">
                                        {getInitials(review.attendeeId?.name)}
                                    </div>
                                )}

                                {/* Review Content */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        {review.attendeeId?.name || "Anonymous"}
                                    </h3>
                                    <p className="text-sm text-gray-500">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>

                                    {/* Rating Stars */}
                                    <div className="mt-2 flex">
                                        {[...Array(5)].map((_, index) => (
                                            <span key={index} className={`text-xl ${index < review.rating ? "text-yellow-500" : "text-gray-300"}`}>
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    {/* Review Comment */}
                                    <p className="mt-2 text-gray-700">{review.comment || "No comment provided."}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsDetailPage;
