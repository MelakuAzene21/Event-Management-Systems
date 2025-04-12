import {  useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Title from "../layout/Title";
import { toast } from "react-toastify";
import { useGetUserTicketsQuery,useDeleteTicketMutation } from "../features/api/ticketApi";
const UserTickets = () => {
    const qrCodeRefs = useRef({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
   
    const { data: tickets = [], isLoading } = useGetUserTicketsQuery();
    const [deleteTicket] = useDeleteTicketMutation();
    const downloadQRCode = (ticketNumber) => {
        const canvas = qrCodeRefs.current[ticketNumber];
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `ticket_${ticketNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const confirmDelete = (ticketId) => {
        setTicketToDelete(ticketId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!ticketToDelete) return;

        try {
            await deleteTicket(ticketToDelete).unwrap();
            toast.success("Ticket deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete ticket. Please try again later.");
            console.error("Delete Error:", error);
        } finally {
            setShowDeleteModal(false);
            setTicketToDelete(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <Title title={"Ticket Page"} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white shadow-lg rounded-lg p-8 max-w-6xl w-full"
            >
                <h1 className="text-3xl font-bold text-black mb-6">My Tickets</h1>
                {isLoading ? (
                    <p className="text-center text-gray-500 text-lg">Loading tickets...</p>
                ) :  tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                        {/* Placeholder Image */}
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-24 h-24 text-gray-400 mb-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </motion.svg>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">No Tickets Booked Yet!</h2>
                        <p className="text-gray-600 max-w-md mb-6">
                            It seems your ticket collection is empty. Don’t miss out—discover exciting events and secure your spot now!
                        </p>
                        <Link to="/">
                            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">
                                Explore Events
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <motion.div
                                key={ticket._id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-start border border-gray-200"
                            >
                                <h2 className="text-xl font-semibold text-black mb-4">{ticket.event?.title}</h2>
                                <p className="text-gray-600">
                                    <span className="font-bold">Date:</span>{" "}
                                    {new Date(ticket.event?.eventDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-bold">Seat:</span>{" "}
                                    {ticket.booking?.ticketType === "VIP"
                                        ? "VIP Access"
                                        : ticket.booking?.seat || "General Admission"}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-bold">Price:</span>{" "}
                                    {ticket.booking?.totalAmount.toFixed(2)} ETB
                                </p>
                                <p className="text-gray-600 mb-4">
                                    <span className="font-bold">Ticket Holder:</span>{" "}
                                    {ticket.user?.name || "N/A"}
                                </p>
                                <QRCodeCanvas
                                    value={ticket.qrCode}
                                    size={150}
                                    className="mb-4"
                                    ref={(el) => (qrCodeRefs.current[ticket.ticketNumber] = el)}
                                />
                                <p className="text-gray-600 mb-4 italic">
                                    <span className="font-bold">Ticket ID:</span> {ticket.ticketNumber}
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => confirmDelete(ticket._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center"
                                        onClick={() => downloadQRCode(ticket.ticketNumber)}
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 16v-8m0 0l-4 4m4-4l4 4"
                                            />
                                        </svg>
                                        Download
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg transform transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
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
                                Are you sure you want to delete this ticket? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTickets;