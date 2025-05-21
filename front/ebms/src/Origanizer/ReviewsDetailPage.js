import { useParams, Link } from "react-router-dom";
import Title from "../layout/Title";
import { useGetEventDetailsQuery } from "../features/api/eventApi";
import { useGetReviewsQuery } from "../features/api/reviewApi";

const ReviewsDetailPage = () => {
    const { eventId } = useParams();

    const {
        data: event,
        isLoading: eventLoading,
        isError: eventError,
    } = useGetEventDetailsQuery(eventId);

    const {
        data: reviews = [],
        isLoading: reviewsLoading,
        isError: reviewsError,
    } = useGetReviewsQuery(eventId);

    const getInitials = (name) =>
        name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

    const isLoading = eventLoading || reviewsLoading;
    const isError = eventError || reviewsError;

    // Aggregate feedback
    const aggregateFeedback = () => {
        const positive = { "Speaker Quality": 0, "Event Organization": 0, "Networking Opportunities": 0, "Content Relevance": 0, "Venue": 0 };
        const improvement = { "Wi-Fi Connectivity": 0, "Food Options": 0, "Session Length": 0, "Registration Process": 0, "Parking Availability": 0 };

        reviews.forEach(review => {
            if (review.comment) {
                if (review.comment.toLowerCase().includes("speaker")) positive["Speaker Quality"]++;
                if (review.comment.toLowerCase().includes("organization")) positive["Event Organization"]++;
                if (review.comment.toLowerCase().includes("networking")) positive["Networking Opportunities"]++;
                if (review.comment.toLowerCase().includes("content")) positive["Content Relevance"]++;
                if (review.comment.toLowerCase().includes("venue")) positive["Venue"]++;
                if (review.comment.toLowerCase().includes("wi-fi")) improvement["Wi-Fi Connectivity"]++;
                if (review.comment.toLowerCase().includes("food")) improvement["Food Options"]++;
                if (review.comment.toLowerCase().includes("session")) improvement["Session Length"]++;
                if (review.comment.toLowerCase().includes("registration")) improvement["Registration Process"]++;
                if (review.comment.toLowerCase().includes("parking")) improvement["Parking Availability"]++;
            }
        });

        return { positive, improvement };
    };

    const { positive, improvement } = aggregateFeedback();
    const topPositive = Object.entries(positive).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topImprovement = Object.entries(improvement).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Title title="Reviews Detail Page" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Feedback Management</h1>
                <p className="text-gray-600 mb-6">Collect and analyze attendee feedback for your events.</p>

                <div className="flex justify-start mb-4">
                    <Link to="/organizer-dashboard" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        ← Back to Events
                    </Link>
                </div>

                {isLoading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : isError ? (
                    <p className="text-center text-red-500">{isError || "Failed to load reviews."}</p>
                ) : reviews.length === 0 ? (
                    <p className="text-center text-gray-500">No reviews yet for this event.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-xl font-bold mb-2">Top Positive Feedback</h3>
                                <p className="text-gray-600 mb-2">Most mentioned positive aspects</p>
                                {topPositive.map(([key, value]) => (
                                    <div key={key} className="flex items-center mb-2">
                                        <span className="text-green-500 mr-2">✔</span>
                                        <span>{key}</span>
                                        <span className="ml-auto text-gray-500">{value} mentions</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-xl font-bold mb-2">Areas for Improvement</h3>
                                <p className="text-gray-600 mb-2">Most mentioned improvement areas</p>
                                {topImprovement.map(([key, value]) => (
                                    <div key={key} className="flex items-center mb-2">
                                        <span className="text-red-500 mr-2">✘</span>
                                        <span>{key}</span>
                                        <span className="ml-auto text-gray-500">{value} mentions</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-white p-5 rounded-lg shadow-md flex items-start space-x-4">
                                    {review.attendeeId?.avatar ? (
                                        <img src={review.attendeeId.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-semibold">
                                            {getInitials(review.attendeeId?.name)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-700">{review.attendeeId?.name || "Anonymous"}</h3>
                                        <p className="text-sm text-gray-500">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                                        <div className="mt-2 flex">
                                            {[...Array(5)].map((_, index) => (
                                                <span key={index} className={`text-xl ${index < review.rating ? "text-yellow-500" : "text-gray-300"}`}>★</span>
                                            ))}
                                        </div>
                                        <p className="mt-2 text-gray-700">{review.comment || "No comment provided."}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewsDetailPage;