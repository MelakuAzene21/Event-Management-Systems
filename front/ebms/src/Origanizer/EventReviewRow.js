import { Link } from "react-router-dom";
import { useGetEventReviewsQuery } from "../features/api/myEventApi";

const EventReviewRow = ({ event }) => {
    const {
        data: reviews = [],
        isLoading: reviewsLoading,
    } = useGetEventReviewsQuery(event._id);

    const totalReviewers = reviews.length;
    const avgRating =
        totalReviewers > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewers).toFixed(1)
            : 0;

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-4 text-gray-700 font-semibold">{event.title}</td>
            <td className="px-6 py-4 text-gray-700">
                {reviewsLoading ? "Loading..." : totalReviewers}
            </td>
            <td className="px-6 py-4 text-gray-700">
                {reviewsLoading ? "..." : `${avgRating} ⭐`}
            </td>
            <td className="px-6 py-4">
                <Link
                    to={`/reviews/${event._id}`}
                    className="text-blue-500 font-semibold hover:underline"
                >
                    View Comments
                </Link>
            </td>
        </tr>
    );
};

export default EventReviewRow;
