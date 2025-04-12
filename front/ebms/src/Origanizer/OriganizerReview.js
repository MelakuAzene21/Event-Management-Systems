// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import Title from "../layout/Title";

// const OrganizerEventReviews = () => {
//     const [events, setEvents] = useState([]);
//     const [reviewsData, setReviewsData] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const BASE_URL = "http://localhost:5000"; // Change this to your backend URL

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const response = await axios.get(`${BASE_URL}/api/events/myEvent`, { withCredentials: true });
//                 setEvents(response.data);
                
//                 // Fetch reviews for each event
//                 const reviewPromises = response.data.map(event =>
//                     axios.get(`${BASE_URL}/api/reviews/${event._id}`)
//                 );

//                 const reviewsResponses = await Promise.all(reviewPromises);
//                 const reviewsMap = {};

//                 reviewsResponses.forEach((res, index) => {
//                     const eventId = response.data[index]._id;
//                     reviewsMap[eventId] = res.data;
//                 });

//                 setReviewsData(reviewsMap);
//             } catch (err) {
//                 setError("Failed to load event reviews.");
//                 console.error("Error fetching events or reviews:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchEvents();
//     }, []);

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">📊 Event Reviews </h1>
// <Title title={"All Review  Page"}/>
//             {loading ? (
//                 <p className="text-center text-gray-500">Loading...</p>
//             ) : error ? (
//                 <p className="text-center text-red-500">{error}</p>
//             ) : events.length === 0 ? (
//                 <p className="text-center text-gray-500">You have not created any events yet.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//                         <thead className="bg-blue-500 text-white">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-sm font-medium">Event Name</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium">Total Reviewers</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium">Average Rating</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {events.map(event => {
//                                 const reviews = reviewsData[event._id] || [];
//                                 const totalReviewers = reviews.length;
//                                 const avgRating = totalReviewers > 0
//                                     ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewers).toFixed(1)
//                                     : 0;

//                                 return (
//                                     <tr key={event._id} className="border-b border-gray-200 hover:bg-gray-50">
//                                         <td className="px-6 py-4 text-gray-700 font-semibold">{event.title}</td>
//                                         <td className="px-6 py-4 text-gray-700">{totalReviewers}</td>
//                                         <td className="px-6 py-4 text-gray-700">{avgRating} ⭐</td>
//                                         <td className="px-6 py-4">
//                                             <Link to={`/reviews/${event._id}`} className="text-blue-500 font-semibold hover:underline">
//                                                 View Comments
//                                             </Link>

//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OrganizerEventReviews;


import { useGetMyEventsQuery } from "../features/api/myEventApi";
import Title from "../layout/Title";
import EventReviewRow from "./EventReviewRow"; // import the child component

const OrganizerEventReviews = () => {
    const {
        data: events = [],
        isLoading,
        isError,
    } = useGetMyEventsQuery();

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">📊 Event Reviews</h1>
            <Title title={"All Review Page"} />

            {isLoading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : isError ? (
                <p className="text-center text-red-500">Failed to load event reviews.</p>
            ) : events.length === 0 ? (
                <p className="text-center text-gray-500">You have not created any events yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium">Event Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Total Reviewers</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Average Rating</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <EventReviewRow key={event._id} event={event} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrganizerEventReviews;
