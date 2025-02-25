import React from "react";
import { Link } from "react-router-dom";
import { useGetMyEventsQuery} from "../features/api/myEventApi";

export default function OriganizerTicketPage() {
    const { data, isLoading, error } = useGetMyEventsQuery();
    const myEvents = Array.isArray(data) ? data : [];

    return (
        <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5">
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
                            {myEvents.map((event) => (
                                <EventRow key={event._id} event={event} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ✅ Updated EventRow with Embedded Ticket Table
const EventRow = ({ event }) => {
    return (
        <>
            <tr className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium">{event.title}</td>
                <td className="py-3 px-4 text-center font-semibold text-green-600">
                    {event.ticketTypes
                        ? event.ticketTypes.reduce((total, type) => total + (type.available || 0), 0)
                        : "N/A"}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-red-600">
                    {event.ticketTypes
                        ? event.ticketTypes.reduce((total, type) => total + (type.booked || 0), 0)
                        : "N/A"}
                </td>
                <td className="py-3 px-4">
                    {event.ticketTypes && event.ticketTypes.length > 0 ? (
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
                        <p className="text-gray-500">No tickets available</p>
                    )}
                </td>
            </tr>
        </>
    );
};
