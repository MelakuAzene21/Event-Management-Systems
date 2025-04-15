import React, { useState } from "react";
import { useGetReviewsQuery, useUpdateReviewMutation, useDeleteReviewMutation } from "../features/api/reviewApi";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedReview, clearSelectedReview } from "../features/slices/reviewSlice";
import Rating from "react-rating-stars-component";
import Modal from "react-modal";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Edit and Trash icons
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const ShowEditDeleteReview = ({ eventId, attendeeId }) => {
    const dispatch = useDispatch();
    const selectedReview = useSelector((state) => state.review.selectedReview);

    const { data: reviews, isLoading, error } = useGetReviewsQuery(eventId);
    const [updateReview] = useUpdateReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false); // For managing modal visibility
    const [confirmDelete, setConfirmDelete] = useState(null);

    const getInitials = (name) => {
        return name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";
    };

    // Handle Submit Review (Update only)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedReview) {
            await updateReview({
                reviewId: selectedReview._id,
                updatedReview: { rating, comment },
            });
            dispatch(clearSelectedReview());
            toast.success("Review Updated Successfully");
        }
        setRating(0);
        setComment("");
        setModalIsOpen(false); // Close modal after submission
    };

    // Handle Edit Review
    const handleEdit = (review) => {
        dispatch(setSelectedReview(review));
        setRating(review.rating);
        setComment(review.comment);
        setModalIsOpen(true); // Open modal for editing
    };

    // Handle Delete Review
    const handleDelete = async () => {
        if (confirmDelete) {
            await deleteReview(confirmDelete);
            toast.success("Review Deleted Successfully");
            setConfirmDelete(null); // Reset confirmation
        }
    };

    return (
        <div className="container mx-auto p-4 border-2 border-gray-200 rounded-lg mt-4">
            {/* Review Form Modal (for editing only) */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="modal bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20"
                overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-semibold mb-4">Edit Review</h2>
                <form onSubmit={handleSubmit} className="mb-6 bg-white shadow-md p-4 rounded-lg">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Rating:</label>
                        <Rating value={rating} onChange={setRating} size={30} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Comment:</label>
                        <textarea
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Update Review
                    </button>
                    <button
                        type="button"
                        className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        onClick={() => {
                            dispatch(clearSelectedReview());
                            setRating(0);
                            setComment("");
                            setModalIsOpen(false);
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </Modal>

            {/* Display Reviews */}
            {isLoading ? (
                <p>Loading reviews...</p>
            ) : error ? (
                <p className="text-red-500">{error.message}</p>
            ) : reviews?.length === 0 ? (
                <p className="text-xl">No reviews yet</p>
            ) : (
                <div className="space-y-4 p-4 rounded-lg bg-gray-100">
                    {reviews?.map((review) => (
                        <div key={review._id} className="bg-white shadow-md p-4 rounded-lg flex justify-between">
                            <div className="flex items-center">
                                {/* Avatar */}
                                {review.attendeeId?.avatar ? (
                                    <img src={review.attendeeId.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-semibold">
                                        {getInitials(review.attendeeId?.name)}
                                    </div>
                                )}
                                <div className="ml-4">
                                    <p className="font-semibold">{review.attendeeId?.name || "Anonymous"}</p>
                                    <Rating value={review.rating} edit={false} size={20} />
                                    <p>{review.comment}</p>
                                </div>
                            </div>

                            {/* Review Date */}
                            <span className="text-gray-500 text-sm">
                                {new Date(review.createdAt).toISOString().split("T")[0]}
                            </span>

                            {review.attendeeId?._id === attendeeId && (
                                <div className="flex space-x-2">
                                    <button
                                        className="text-yellow-500 hover:text-yellow-700"
                                        onClick={() => handleEdit(review)}
                                    >
                                        <FiEdit size={18} />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => setConfirmDelete(review._id)}
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <Modal
                    isOpen={true}
                    onRequestClose={() => setConfirmDelete(null)}
                    className="modal bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20"
                    overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
                >
                    <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this review?</h2>
                    <div className="flex justify-end">
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-2"
                            onClick={() => setConfirmDelete(null)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ShowEditDeleteReview;