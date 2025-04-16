// import { useState, useRef } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import Title from "../layout/Title";
// import { toast } from "react-toastify";
// import { useGetUserTicketsQuery, useDeleteTicketMutation } from "../features/api/ticketApi";
// import ReviewComponent from "../components/Reviews"
// import Modal from "react-modal";

// Modal.setAppElement("#root");

// const UserTickets = () => {
//     const qrCodeRefs = useRef({});
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [ticketToDelete, setTicketToDelete] = useState(null);
//     const [showReviewModal, setShowReviewModal] = useState(false); // State for review modal
//     const [selectedEventId, setSelectedEventId] = useState(null); // State for selected event
//     const [selectedAttendeeId, setSelectedAttendeeId] = useState(null); // State for attendee

//     const { data: tickets = [], isLoading } = useGetUserTicketsQuery();
//     const [deleteTicket] = useDeleteTicketMutation();

//     const downloadQRCode = (ticketNumber) => {
//         const canvas = qrCodeRefs.current[ticketNumber];
//         if (!canvas) return;

//         const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//         const downloadLink = document.createElement("a");
//         downloadLink.href = pngUrl;
//         downloadLink.download = `ticket_${ticketNumber}.png`;
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
//     };

//     const confirmDelete = (ticketId) => {
//         setTicketToDelete(ticketId);
//         setShowDeleteModal(true);
//     };

//     const handleDelete = async () => {
//         if (!ticketToDelete) return;

//         try {
//             await deleteTicket(ticketToDelete).unwrap();
//             toast.success("Ticket deleted successfully!");
//         } catch (error) {
//             toast.error("Failed to delete ticket. Please try again later.");
//             console.error("Delete Error:", error);
//         } finally {
//             setShowDeleteModal(false);
//             setTicketToDelete(null);
//         }
//     };

//     const openReviewModal = (eventId, attendeeId) => {
//         setSelectedEventId(eventId);
//         setSelectedAttendeeId(attendeeId);
//         setShowReviewModal(true);
//     };

//     const isEventPast = (eventDate) => {
//         return new Date(eventDate) < new Date();
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//             <Title title={"Ticket Page"} />
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//                 className="bg-white shadow-lg rounded-lg p-8 max-w-6xl w-full"
//             >
//                 <h1 className="text-3xl font-bold text-black mb-6">My Tickets</h1>
//                 {isLoading ? (
//                     <p className="text-center text-gray-500 text-lg">Loading tickets...</p>
//                 ) : tickets.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center text-center py-12">
//                         <motion.svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="w-24 h-24 text-gray-400 mb-6"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                             />
//                         </motion.svg>
//                         <h2 className="text-2xl font-bold text-gray-800 mb-3">No Tickets Booked Yet!</h2>
//                         <p className="text-gray-600 max-w-md mb-6">
//                             It seems your ticket collection is empty. Don’t miss out—discover exciting events and secure your spot now!
//                         </p>
//                         <Link to="/">
//                             <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">
//                                 Explore Events
//                             </button>
//                         </Link>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {tickets.map((ticket) => (
//                             <motion.div
//                                 key={ticket._id}
//                                 initial={{ opacity: 0, x: 50 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.6, delay: 0.2 }}
//                                 className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-start border border-gray-200"
//                             >
//                                 <h2 className="text-xl font-semibold text-black mb-4">{ticket.event?.title}</h2>
//                                 <p className="text-gray-600">
//                                     <span className="font-bold">Date:</span>{" "}
//                                     {new Date(ticket.event?.eventDate).toLocaleDateString()}
//                                 </p>
//                                 <p className="text-gray-600">
//                                     <span className="font-bold">Seat:</span>{" "}
//                                     {ticket.booking?.ticketType === "VIP"
//                                         ? "VIP Access"
//                                         : ticket.booking?.seat || "General Admission"}
//                                 </p>
//                                 <p className="text-gray-600">
//                                     <span className="font-bold">Price:</span>{" "}
//                                     {ticket.booking?.totalAmount.toFixed(2)} ETB
//                                 </p>
//                                 <p className="text-gray-600 mb-4">
//                                     <span className="font-bold">Ticket Holder:</span>{" "}
//                                     {ticket.user?.name || "N/A"}
//                                 </p>
//                                 <QRCodeCanvas
//                                     value={ticket.qrCode}
//                                     size={150}
//                                     className="mb-4"
//                                     ref={(el) => (qrCodeRefs.current[ticket.ticketNumber] = el)}
//                                 />
//                                 <p className="text-gray-600 mb-4 italic">
//                                     <span className="font-bold">Ticket ID:</span> {ticket.ticketNumber}
//                                 </p>
//                                 <div className="flex space-x-4">
//                                     <button
//                                         onClick={() => confirmDelete(ticket._id)}
//                                         className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//                                     >
//                                         Delete
//                                     </button>
//                                     <button
//                                         className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center"
//                                         onClick={() => downloadQRCode(ticket.ticketNumber)}
//                                     >
//                                         <svg
//                                             className="w-5 h-5 mr-2"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth="2"
//                                                 d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 16v-8m0 0l-4 4m4-4l4 4"
//                                             />
//                                         </svg>
//                                         Download
//                                     </button>
//                                     {isEventPast(ticket.event?.eventDate) && (
//                                         <button
//                                             onClick={() => openReviewModal(ticket.event?._id, ticket.user?._id)}
//                                             className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                                         >
//                                             Review
//                                         </button>
//                                     )}
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 )}
//             </motion.div>

//             {/* Delete Confirmation Modal */}
//             {showDeleteModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg transform transition-all">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="text-gray-400 hover:text-gray-600"
//                             >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth="2"
//                                         d="M6 18L18 6M6 6l12 12"
//                                     />
//                                 </svg>
//                             </button>
//                         </div>
//                         <div className="mb-6">
//                             <p className="text-gray-600">
//                                 Are you sure you want to delete this ticket? This action cannot be undone.
//                             </p>
//                         </div>
//                         <div className="flex justify-end gap-4">
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleDelete}
//                                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Review Modal */}
//             {showReviewModal && (
//                 <Modal
//                     isOpen={showReviewModal}
//                     onRequestClose={() => setShowReviewModal(false)}
//                     className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-20"
//                     overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
//                 >
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-xl font-semibold">Review Event</h2>
//                         <button
//                             onClick={() => setShowReviewModal(false)}
//                             className="text-gray-400 hover:text-gray-600"
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M6 18L18 6M6 6l12 12"
//                                 />
//                             </svg>
//                         </button>
//                     </div>
//                     <ReviewComponent eventId={selectedEventId} attendeeId={selectedAttendeeId} />
//                 </Modal>
//             )}
//         </div>
//     );
// };

// export default UserTickets;
import { useState, useRef, useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Title from "../layout/Title";
import { toast } from "react-toastify";
import { useGetUserTicketsQuery, useDeleteTicketMutation } from "../features/api/ticketApi";
import ReviewComponent from "../components/Reviews";
import Modal from "react-modal";

Modal.setAppElement("#root");

const UserTickets = () => {
    const qrCodeRefs = useRef({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedAttendeeId, setSelectedAttendeeId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterDate, setFilterDate] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 6;
    const { data: tickets = [], isLoading } = useGetUserTicketsQuery();
    const [deleteTicket] = useDeleteTicketMutation();

    // Extract unique ticket types dynamically
    const uniqueTicketTypes = useMemo(() => {
        const types = new Set(tickets.map((ticket) => ticket.booking?.ticketType).filter(Boolean));
        return [...types].sort(); // Sort for consistent display
    }, [tickets]);

    // Filter and search tickets
    const filteredTickets = useMemo(() => {
        return tickets.filter((ticket) => {
            const matchesSearch =
                ticket.event?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType =
                filterType === "all" || (ticket.booking?.ticketType && ticket.booking.ticketType === filterType);
            const matchesDate =
                filterDate === "all" ||
                (filterDate === "past" && new Date(ticket.event?.eventDate) < new Date()) ||
                (filterDate === "upcoming" && new Date(ticket.event?.eventDate) >= new Date());
            return matchesSearch && matchesType && matchesDate;
        });
    }, [tickets, searchTerm, filterType, filterDate]);

    // Pagination logic
    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
    const paginatedTickets = filteredTickets.slice(
        (currentPage - 1) * ticketsPerPage,
        currentPage * ticketsPerPage
    );

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
            setCurrentPage(1); // Reset to first page after deletion
        } catch (error) {
            toast.error("Failed to delete ticket. Please try again later.");
            console.error("Delete Error:", error);
        } finally {
            setShowDeleteModal(false);
            setTicketToDelete(null);
        }
    };

    const openReviewModal = (eventId, attendeeId) => {
        setSelectedEventId(eventId);
        setSelectedAttendeeId(attendeeId);
        setShowReviewModal(true);
    };

    const isEventPast = (eventDate) => {
        return new Date(eventDate) < new Date();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
            <Title title="Ticket Page" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 max-w-7xl w-full"
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Tickets</h1>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by event or ticket number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Types</option>
                        {uniqueTicketTypes.map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Dates</option>
                        <option value="past">Past Events</option>
                        <option value="upcoming">Upcoming Events</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">No Tickets Found</h2>
                        <p className="text-gray-600 max-w-md mb-6">
                            {searchTerm || filterType !== "all" || filterDate !== "all"
                                ? "No tickets match your search or filters."
                                : "You haven't booked any tickets yet. Explore events now!"}
                        </p>
                        <Link to="/">
                            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                                Explore Events
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedTickets.map((ticket) => (
                                <motion.div
                                    key={ticket._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 truncate">
                                        {ticket.event?.title}
                                    </h2>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Date:</span>{" "}
                                        {new Date(ticket.event?.eventDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Ticket Type:</span>{" "}
                                        {ticket.booking?.ticketType
                                            ? ticket.booking.ticketType.charAt(0).toUpperCase() +
                                            ticket.booking.ticketType.slice(1)
                                            : "N/A"}
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Seat:</span>{" "}
                                        {ticket.booking?.seat || "N/A"}
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Price:</span>{" "}
                                        {ticket.booking?.totalAmount.toFixed(2)} ETB
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        <span className="font-medium">Ticket Holder:</span>{" "}
                                        {ticket.user?.name || "N/A"}
                                    </p>
                                    <QRCodeCanvas
                                        value={ticket.qrCode}
                                        size={150}
                                        className="mb-4 mx-auto"
                                        ref={(el) => (qrCodeRefs.current[ticket.ticketNumber] = el)}
                                    />
                                    <p className="text-gray-500 text-sm mb-4 italic">
                                        <span className="font-medium">Ticket ID:</span> {ticket.ticketNumber}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => confirmDelete(ticket._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => downloadQRCode(ticket.ticketNumber)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
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
                                        {isEventPast(ticket.event?.eventDate) && (
                                            <button
                                                onClick={() => openReviewModal(ticket.event?._id, ticket.user?._id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                            >
                                                Review
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-4 py-2 rounded-md ${currentPage === index + 1
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
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
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this ticket? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <Modal
                    isOpen={showReviewModal}
                    onRequestClose={() => setShowReviewModal(false)}
                    className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Review Event</h2>
                        <button
                            onClick={() => setShowReviewModal(false)}
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
                    <ReviewComponent eventId={selectedEventId} attendeeId={selectedAttendeeId} />
                </Modal>
            )}
        </div>
    );
};

export default UserTickets;