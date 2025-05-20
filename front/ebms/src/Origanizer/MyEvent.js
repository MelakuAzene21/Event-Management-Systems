import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import {
    useGetMyEventsQuery,
    useDeleteEventMutation,
    useGetAttendeeCountQuery,
} from "../features/api/myEventApi";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-toastify";
import Title from "../layout/Title";
import { FaSearch } from "react-icons/fa";

export default function MyEventsPage() {
    const { data, isLoading, error } = useGetMyEventsQuery();
    const [deleteEvent] = useDeleteEventMutation();
    const myEvents = Array.isArray(data) ? data : [];

    const [isOpen, setIsOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 10;

    const openDeleteModal = (eventId) => {
        setEventToDelete(eventId);
        setIsOpen(true);
    };

    const handleDelete = async () => {
        if (eventToDelete) {
            try {
                await deleteEvent(eventToDelete).unwrap();
                toast.success("Event Deleted Successfully");
            } catch (err) {
                console.error("Error deleting event:", err);
                toast.error("Error deleting Event");
            } finally {
                setIsOpen(false);
                setEventToDelete(null);
            }
        }
    };

    // Filter and search logic
    const filteredEvents = useMemo(() => {
        let filtered = myEvents;

        // Search by title or location
        if (searchTerm) {
            filtered = filtered.filter(
                (event) =>
                    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.location?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((event) => event.status === statusFilter);
        }

        // Filter by date
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        if (dateFilter === "today") {
            filtered = filtered.filter(
                (event) => new Date(event.eventDate) >= startOfDay
            );
        } else if (dateFilter === "week") {
            filtered = filtered.filter(
                (event) => new Date(event.eventDate) >= startOfWeek
            );
        } else if (dateFilter === "month") {
            filtered = filtered.filter(
                (event) => new Date(event.eventDate) >= startOfMonth
            );
        }

        return filtered;
    }, [myEvents, searchTerm, statusFilter, dateFilter]);

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
            <Title title="My Event Page" />

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
                                placeholder="Search by event name or location..."
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
                                        <th className="py-3 px-4 text-left border-b">Date</th>
                                        <th className="py-3 px-4 text-left border-b">Location</th>
                                        <th className="py-3 px-4 text-center border-b">Status</th>
                                        <th className="py-3 px-4 text-center border-b">Registered Attendees</th>
                                        <th className="py-3 px-4 text-center border-b">Tickets Available</th>
                                        <th className="py-3 px-4 text-center border-b">Tickets Booked</th>
                                        <th className="py-3 px-4 text-center border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedEvents.map((event) => (
                                        <EventRow key={event._id} event={event} openDeleteModal={openDeleteModal} />
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

            {/* Delete Confirmation Modal */}
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-md" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <Dialog.Title className="text-xl font-bold text-gray-800">
                        Confirm Deletion
                    </Dialog.Title>
                    <Dialog.Description className="text-gray-600 mt-2">
                        Are you sure you want to delete this event? This action cannot be undone.
                    </Dialog.Description>
                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
}

// Event row component
const EventRow = ({ event, openDeleteModal }) => {
    const { data: attendeeData } = useGetAttendeeCountQuery(event._id);

    return (
        <tr className="border-b hover:bg-gray-50 transition">
            <td className="py-3 px-4">{event.title}</td>
            <td className="py-3 px-4">{new Date(event.eventDate).toLocaleDateString()}</td>
            <td className="py-3 px-4">{event.location?.name?.split(', ')[0] || "N/A"}</td>
            <td
                className={`py-3 px-4 text-center ${event.status === "approved"
                        ? "text-green-500"
                        : event.status === "rejected"
                            ? "text-red-500"
                            : "text-gray-500"
                    }`}
            >
                {event.status}
            </td>
            <td className="py-3 px-4 text-center">
                {attendeeData ? attendeeData.attendeeCount : "Loading..."}
            </td>
            <td className="py-3 px-4 text-center">
                {event.ticketTypes
                    ? event.ticketTypes.reduce((total, type) => total + (type.available || 0), 0)
                    : "N/A"}
            </td>
            <td className="py-3 px-4 text-center">
                {event.ticketTypes
                    ? event.ticketTypes.reduce((total, type) => total + (type.booked || 0), 0)
                    : "N/A"}
            </td>
            <td className="py-3 px-4 flex justify-center space-x-4">
                <Link to={`/updateEvent/${event._id}`}>
                    <button className="text-yellow-500 hover:text-yellow-600 text-xl">
                        <MdEdit />
                    </button>
                </Link>
                <button
                    onClick={() => openDeleteModal(event._id)}
                    className="text-red-500 hover:text-red-600 text-xl"
                >
                    <MdDelete />
                </button>
            </td>
        </tr>
    );
};