// import { useEffect, useState } from "react";
// import axios from "axios";
// import Title from "../layout/Title";

// const BookingsTable = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 const response = await axios.get("http://localhost:5000/api/bookings", {
//                    withCredentials: true,
//                 });
//                 setBookings(response.data);
//             } catch (error) {
//                 console.error("Error fetching bookings:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookings();
//     }, []);

//     return (
//         <div className="container mx-auto p-6 min-h-[50vh]">
//             <h2 className="text-center text-2xl font-bold mb-4">Total Bookings : { bookings.length}</h2>
//            <Title title={"Booking Details"}/>
//             {loading ? (
//                 <p className="text-center text-gray-500">Loading bookings...</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border rounded-lg shadow-md">
//                         <thead>
//                             <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
//                                 <th className="p-3">Event</th>
//                                 <th className="p-3">User</th>
//                                 <th className="p-3">Event Date & Time</th>
//                                 <th className="p-3">Ticket Type</th>
//                                 <th className="p-3">Ticket Count</th>
//                                 <th className="p-3">Total Amount</th>
//                                 <th className="p-3">Booked On</th>
//                                 <th className="p-3">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {bookings.map((booking) => (
//                                 <tr key={booking._id} className="border-b hover:bg-gray-50">
//                                     <td className="p-3">{booking.event.title}</td>
//                                     <td className="p-3">{booking.user.name}</td>
//                                     <td className="p-3">{booking.event?.eventDate ? new Date(booking.event.eventDate).toLocaleString() : "N/A"}</td>
//                                     <td className="p-3">{booking.ticketType}</td>
//                                     <td className="p-3 text-center">{booking.ticketCount}</td>
//                                     <td className="p-3 text-center">{booking.totalAmount}  ETB</td>
//                                     <td className="p-3">{new Date(booking.createdAt).toLocaleString()}</td>
//                                     <td
//                                         className={`p-3 font-semibold ${booking.status === "booked"
//                                                 ? "text-green-600"
//                                                 : booking.status === "canceled"
//                                                     ? "text-red-600"
//                                                     : "text-yellow-600"
//                                             }`}
//                                     >
//                                         {booking.status.toUpperCase()}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BookingsTable;

import React, { useState, useMemo } from "react";
import Title from "../layout/Title";
import { useGetAllBookingsQuery } from "../features/api/bookingApi";
import { FaSearch } from "react-icons/fa";

const BookingsTable = () => {
    const { data: bookings = [], isLoading, isError, error } = useGetAllBookingsQuery();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 10;

    // Filter and search logic
    const filteredBookings = useMemo(() => {
        let filtered = bookings;

        // Search by event title or user name
        if (searchTerm) {
            filtered = filtered.filter(
                (booking) =>
                    booking.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((booking) => booking.status === statusFilter);
        }

        // Filter by event date
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        if (dateFilter === "today") {
            filtered = filtered.filter(
                (booking) => booking.event?.eventDate && new Date(booking.event.eventDate) >= startOfDay
            );
        } else if (dateFilter === "week") {
            filtered = filtered.filter(
                (booking) => booking.event?.eventDate && new Date(booking.event.eventDate) >= startOfWeek
            );
        } else if (dateFilter === "month") {
            filtered = filtered.filter(
                (booking) => booking.event?.eventDate && new Date(booking.event.eventDate) >= startOfMonth
            );
        }

        return filtered;
    }, [bookings, searchTerm, statusFilter, dateFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * bookingsPerPage,
        currentPage * bookingsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container p-4 min-h-[50vh]">
            <Title title="Booking Details" />

            {isLoading ? (
                <p className="text-center text-gray-500 text-lg">Loading bookings...</p>
            ) : isError ? (
                <p className="text-center text-red-500 text-lg">
                    Error: {error?.data?.message || "Something went wrong"}
                </p>
            ) : bookings.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    No bookings found.
                </p>
            ) : (
                <div className="space-y-6">
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search by event title or user name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        >
                            <option value="all">All Status</option>
                            <option value="booked">Booked</option>
                            <option value="canceled">Canceled</option>
                            <option value="pending">Pending</option>
                        </select>

                        {/* Date Filter */}
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>

                    {/* Bookings Table */}
                    {filteredBookings.length === 0 ? (
                        <p className="text-center text-gray-500 text-lg">
                            No bookings match your search or filter criteria.
                        </p>
                    ) : (
                        <div className="overflow-x-auto shadow-lg rounded-lg">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
                                        <th className="p-3">Event</th>
                                        <th className="p-3">User</th>
                                        <th className="p-3">Event Date & Time</th>
                                        <th className="p-3">Ticket Type</th>
                                        <th className="p-3 text-center">Ticket Count</th>
                                        <th className="p-3 text-center">Total Amount</th>
                                        <th className="p-3">Booked On</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedBookings.map((booking) => (
                                        <tr key={booking._id} className="border-b hover:bg-gray-50">
                                            <td className="p-3">{booking.event?.title || "N/A"}</td>
                                            <td className="p-3">{booking.user?.name || "N/A"}</td>
                                            <td className="p-3">
                                                {booking.event?.eventDate
                                                    ? new Date(booking.event.eventDate).toLocaleString()
                                                    : "N/A"}
                                            </td>
                                            <td className="p-3">{booking.ticketType || "N/A"}</td>
                                            <td className="p-3 text-center">{booking.ticketCount || "N/A"}</td>
                                            <td className="p-3 text-center">
                                                {booking.totalAmount ? `${booking.totalAmount} ETB` : "N/A"}
                                            </td>
                                            <td className="p-3">
                                                {booking.createdAt
                                                    ? new Date(booking.createdAt).toLocaleString()
                                                    : "N/A"}
                                            </td>
                                            <td
                                                className={`p-3 font-semibold ${booking.status === "booked"
                                                        ? "text-green-600"
                                                        : booking.status === "canceled"
                                                            ? "text-red-600"
                                                            : "text-yellow-600"
                                                    }`}
                                            >
                                                {booking.status ? booking.status.toUpperCase() : "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-md ${currentPage === page
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingsTable;
