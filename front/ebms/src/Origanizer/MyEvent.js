import React, { useState } from "react";
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

export default function MyEventsPage() {
    const { data, isLoading, error } = useGetMyEventsQuery();
    const [deleteEvent] = useDeleteEventMutation();
    const myEvents = Array.isArray(data) ? data : [];

    const [isOpen, setIsOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    const openDeleteModal = (eventId) => {
        setEventToDelete(eventId);
        setIsOpen(true);
    };

    const handleDelete = async () => {
        if (eventToDelete) {
            try {
                await deleteEvent(eventToDelete).unwrap();
                toast.success("Event Deleted Successfully")
            } catch (err) {
                console.error("Error deleting event:", err);
                toast.error("error deleting Event")
            } finally {
                setIsOpen(false);
            }
        }
    };

    return (
        <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5">
           <Title title={"My Event page"}/>
            <div className="flex justify-end mb-4">
                <Link to="/create-event">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                        Create New Event
                    </button>
                </Link>
            </div>

            {isLoading ? (
                <p className="text-gray-500 text-center text-lg">Loading events...</p>
            ) : error ? (
                <p className="text-red-500 text-center text-lg">Error loading events.</p>
            ) : myEvents.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">
                    You haven't created any events yet.
                </p>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        Total Events: {myEvents.length}
                    </h1>

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
                            {myEvents.map((event) => (
                                <EventRow key={event._id} event={event} openDeleteModal={openDeleteModal} />
                            ))}
                        </tbody>
                    </table>
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
            <td className={`py-3 px-4 ${event.status === 'approved' ? 'text-green-500' :
                    event.status === 'rejected' ? 'text-red-500' :
                        'text-gray-500'
                }`}>
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
