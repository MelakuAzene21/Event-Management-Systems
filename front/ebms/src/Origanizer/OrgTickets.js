import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetMyEventsQuery } from "../features/api/myEventApi";
import Title from "../layout/Title";
import { FaSearch } from "react-icons/fa";

export default function OriganizerTicketPage() {
    const { data, isLoading, error } = useGetMyEventsQuery();
    const myEvents = Array.isArray(data) ? data : [];

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [ticketFilter, setTicketFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 10;

    // Filter and search logic
    const filteredEvents = useMemo(() => {
        let filtered = myEvents;

        // Search by title
        if (searchTerm) {
            filtered = filtered.filter((event) =>
                event.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((event) => event.status === statusFilter);
        }

        // Filter by ticket type (free or paid)
        if (ticketFilter === "free") {
            filtered = filtered.filter((event) => event.isFree === true);
        } else if (ticketFilter === "paid") {
            filtered = filtered.filter((event) => event.isFree === false && event.ticketTypes?.length > 0);
        }

        return filtered;
    }, [myEvents, searchTerm, statusFilter, ticketFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col p-4">
            <Title title="Ticket Details Page" />

            {isLoading ? (
                <p className="text-gray-500 text-center text-lg">Loading events...</p>
            ) : error ? (
                <p className="text-red-500 text-center text-lg">Error loading events.</p>
            ) : myEvents.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">
                    You haven't created any events yet.
                </p>
            ) : (
                <div className="space-y-6">
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search by event name..."
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
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* Ticket Type Filter */}
                        <select
                            value={ticketFilter}
                            onChange={(e) => setTicketFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        >
                            <option value="all">All Tickets</option>
                            <option value="free">Free Events</option>
                            <option value="paid">Paid Events</option>
                        </select>
                    </div>

                    {/* Events Table */}
                    {filteredEvents.length === 0 ? (
                        <p className="text-gray-500 text-center text-lg">
                            No events match your search or filter criteria.
                        </p>
                    ) : (
                        <div className="overflow-x-auto shadow-lg rounded-lg">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                                    <tr>
                                        <th className="py-3 px-4 text-left border-b">Event Name</th>
                                        <th className="py-3 px-4 text-center border-b">Total Tickets Available</th>
                                        <th className="py-3 px-4 text-center border-b">Total Tickets Booked</th>
                                        <th className="py-3 px-4 text-center border-b">Ticket Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedEvents.map((event) => (
                                        <EventRow key={event._id} event={event} />
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
}

// EventRow with Embedded Ticket Table and Free Event Handling
const EventRow = ({ event }) => {
    return (
        <>
            <tr className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium">{event.title}</td>
                <td className="py-3 px-4 text-center">
                    {event.isFree ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full">
                            Free
                        </span>
                    ) : (
                        <span className="font-semibold text-green-600">
                            {event.ticketTypes
                                ? event.ticketTypes.reduce((total, type) => total + (type.available || 0), 0)
                                : "N/A"}
                        </span>
                    )}
                </td>
                <td className="py-3 px-4 text-center">
                    {event.isFree ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full">
                            Free
                        </span>
                    ) : (
                        <span className="font-semibold text-red-600">
                            {event.ticketTypes
                                ? event.ticketTypes.reduce((total, type) => total + (type.booked || 0), 0)
                                : "N/A"}
                        </span>
                    )}
                </td>
                <td className="py-3 px-4">
                    {event.isFree ? (
                        <p className="text-gray-500 text-center">This is a free event</p>
                    ) : event.ticketTypes && event.ticketTypes.length > 0 ? (
                        <table className="w-full bg-gray-50 border border-gray-300 rounded-lg">
                            <thead className="bg-gray-200 text-gray-700 text-xs uppercase">
                                <tr>
                                    <th className="py-2 px-3 border-b">Type</th>
                                    <th className="py-2 px-3 border-b">Available</th>
                                    <th className="py-2 px-3 border-b">Booked</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.ticketTypes.map((type) => (
                                    <tr key={type._id} className="text-center border-b">
                                        <td className="py-2 px-3">{type.name}</td>
                                        <td className="py-2 px-3 text-green-500 font-medium">{type.available}</td>
                                        <td className="py-2 px-3 text-red-500 font-medium">{type.booked}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center">No tickets available</p>
                    )}
                </td>
            </tr>
        </>
    );
};