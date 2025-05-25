import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Title from "../layout/Title";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    BarChart, Bar
} from "recharts";

const OrganizerEventReviews = () => {
    const [events, setEvents] = useState([]);
    const [reviewsData, setReviewsData] = useState({});
    const [selectedEventId, setSelectedEventId] = useState("");
    const [ratingTrends, setRatingTrends] = useState({ labels: [], data: [] });
    const [ratingDistribution, setRatingDistribution] = useState({ labels: [], data: [] });
    const [chartLoading, setChartLoading] = useState(false);
    const [chartError, setChartError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = process.env.NODE_ENV === "production"? "https://event-management-systems-gj91.onrender.com": "http://localhost:5000"

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/events/myEvent`, { withCredentials: true });
                // Ensure response.data is an array; fallback to empty array if not
                const eventsData = Array.isArray(response.data) ? response.data : [];
                setEvents(eventsData);
                const reviewPromises = response.data.map(event =>
                    axios.get(`${BASE_URL}/api/reviews/${event._id}`)
                );
                const reviewsResponses = await Promise.all(reviewPromises);
                const reviewsMap = {};

                reviewsResponses.forEach((res, index) => {
                    const eventId = response.data[index]._id;
                    reviewsMap[eventId] = res.data;
                });

                setReviewsData(reviewsMap);
            } catch (err) {
                setError("Failed to load event reviews.");
                console.error("Error fetching events or reviews:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchChartsData = async () => {
            setChartLoading(true);
            try {
                if (selectedEventId) {
                    const trendsResponse = await axios.get(`${BASE_URL}/api/reviews/trends/${selectedEventId}`);
                    setRatingTrends(trendsResponse.data);

                    const distributionResponse = await axios.get(`${BASE_URL}/api/reviews/distribution/${selectedEventId}`);
                    setRatingDistribution(distributionResponse.data);
                } else {
                    const allReviews = Object.values(reviewsData).flat();

                    const trendsMap = {};
                    allReviews.forEach(review => {
                        if (review.createdAt && review.rating) {
                            const date = new Date(review.createdAt);
                            const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                            if (!trendsMap[yearMonth]) {
                                trendsMap[yearMonth] = { totalRating: 0, count: 0 };
                            }
                            trendsMap[yearMonth].totalRating += review.rating;
                            trendsMap[yearMonth].count += 1;
                        }
                    });

                    const labels = Object.keys(trendsMap).sort();
                    const data = labels.map(label => parseFloat((trendsMap[label].totalRating / trendsMap[label].count).toFixed(1)));

                    setRatingTrends({ labels, data });

                    const distribution = [0, 0, 0, 0, 0];
                    allReviews.forEach(review => {
                        if (review.rating >= 1 && review.rating <= 5) {
                            distribution[review.rating - 1] += 1;
                        }
                    });

                    setRatingDistribution({
                        labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
                        data: distribution
                    });
                }
            } catch (err) {
                setChartError(err.response?.data?.error || "Failed to load chart data.");
                console.error("Error fetching chart data:", err);
            } finally {
                setChartLoading(false);
            }
        };
        fetchChartsData();
    }, [selectedEventId, reviewsData]);

    const aggregateData = () => {
        let totalReviews = 0, totalRating = 0, positiveSentiment = 0;
        let relevantEvents = events;

        if (selectedEventId) {
            const reviews = reviewsData[selectedEventId] || [];
            totalReviews = reviews.length;
            totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            positiveSentiment = reviews.filter(r => r.rating >= 4).length;
            relevantEvents = events.filter(event => event._id === selectedEventId);
        } else {
            Object.values(reviewsData).forEach(reviews => {
                totalReviews += reviews.length;
                totalRating += reviews.reduce((sum, r) => sum + r.rating, 0);
                positiveSentiment += reviews.filter(r => r.rating >= 4).length;
            });
        }

        const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
        const responseRate = totalReviews > 0 && relevantEvents.length > 0 ? Math.round((totalReviews / relevantEvents.length) * 100) : 0;
        const sentiment = totalReviews > 0 ? Math.round((positiveSentiment / totalReviews) * 100) : 0;

        return { avgRating, responseRate, totalReviews, sentiment };
    };

    const { avgRating, responseRate, totalReviews, sentiment } = aggregateData();

    const trendsData = ratingTrends.labels.length > 0
        ? ratingTrends.labels.map((label, index) => ({
            month: label.split("-")[1],
            rating: ratingTrends.data[index]
        }))
        : [];

    const distributionData = ratingDistribution.labels.length > 0
        ? ratingDistribution.labels.map((label, index) => ({
            star: label,
            count: ratingDistribution.data[index]
        }))
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
            <Title title="Feedback Management" />
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-indigo-900 sm:text-4xl">
                        Feedback Management
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Analyze attendee feedback to enhance your events.
                    </p>
                </header>

                <div className="mb-8">
                    <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Event
                    </label>
                    <select
                        id="event-select"
                        className="block w-full max-w-xs px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                    >
                        <option value="">All Events</option>
                        {events.map(event => (
                            <option key={event._id} value={event._id}>{event.title}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
                        <p className="mt-2 text-3xl font-bold text-indigo-700">{avgRating} <span className="text-amber-500">★</span></p>
                        <p className="mt-1 text-sm text-gray-500">From {totalReviews} reviews</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
                        <p className="mt-2 text-3xl font-bold text-teal-700">{responseRate}%</p>
                        <p className="mt-1 text-sm text-gray-500">+5% from last event</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-sm font-medium text-gray-500">Feedback Collected</h3>
                        <p className="mt-2 text-3xl font-bold text-indigo-700">{totalReviews}</p>
                        <p className="mt-1 text-sm text-gray-500">{selectedEventId ? "For selected event" : "Across all events"}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-sm font-medium text-gray-500">Sentiment</h3>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${sentiment}%` }}
                            ></div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{sentiment}% positive</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                        <p>{error}</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center">
                        <p>No events created yet. Start by adding an event!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Rating Trends</h3>
                                <p className="text-sm text-gray-500 mb-4">Average ratings over time</p>
                                {chartLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-solid"></div>
                                    </div>
                                ) : chartError ? (
                                    <p className="text-red-500 text-sm">{chartError}</p>
                                ) : trendsData.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No rating trends available.</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={trendsData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="month"
                                                tickFormatter={(value) => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][parseInt(value) - 1]}
                                                stroke="#4b5563"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis domain={[0, 5]} stroke="#4b5563" tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="rating"
                                                stroke="#6366f1"
                                                strokeWidth={3}
                                                dot={{ r: 5, fill: "#6366f1" }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Rating Distribution</h3>
                                <p className="text-sm text-gray-500 mb-4">Breakdown of ratings by stars</p>
                                {chartLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-solid"></div>
                                    </div>
                                ) : chartError ? (
                                    <p className="text-red-500 text-sm">{chartError}</p>
                                ) : distributionData.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No rating distribution available.</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={distributionData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis type="number" stroke="#4b5563" tick={{ fontSize: 12 }} />
                                            <YAxis type="category" dataKey="star" stroke="#4b5563" tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                                            />
                                            <Bar
                                                dataKey="count"
                                                fill="#2dd4bf"
                                                barSize={40}
                                                radius={[0, 8, 8, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 bg-indigo-50">
                                <h3 className="text-lg font-semibold text-indigo-900">Event Feedback Overview</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-indigo-600 text-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Event Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Total Reviewers</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Average Rating</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {events.map((event, index) => {
                                            const reviews = reviewsData[event._id] || [];
                                            const totalReviewers = reviews.length;
                                            const avgRating = totalReviewers > 0
                                                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewers).toFixed(1)
                                                : 0;

                                            return (
                                                <tr
                                                    key={event._id}
                                                    className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50`}
                                                >
                                                    <td className="px-6 py-4 text-gray-800 font-medium">{event.title}</td>
                                                    <td className="px-6 py-4 text-gray-600">{totalReviewers}</td>
                                                    <td className="px-6 py-4 text-gray-600">{avgRating} <span className="text-amber-500">★</span></td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            to={`/reviews/${event._id}`}
                                                            className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                                                        >
                                                            View Comments
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrganizerEventReviews;