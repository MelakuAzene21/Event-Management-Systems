import React, { useEffect, useState } from "react";
import { useFetchReportsQuery } from "../features/api/reportApi";

const Reports = ({ events = [] }) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    const [selectedEvent, setSelectedEvent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(today);
    const [fetchParams, setFetchParams] = useState({ endDate: today });

    const { data, error, isLoading } = useFetchReportsQuery(fetchParams, { skip: !fetchParams });

    useEffect(() => {
        // Fetch all events with today's date as fallback when the component mounts
        setFetchParams({ endDate: today });
    }, []);

    useEffect(() => {
        // Automatically fetch reports when any filter changes
        setFetchParams({ eventId: selectedEvent || undefined, startDate, endDate });
    }, [selectedEvent, startDate, endDate]);

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Event Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <select
                    className="p-3 border rounded-lg bg-gray-50 focus:ring focus:ring-blue-300 w-full"
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                >
                    <option value="">All Events</option>
                    {events.map((event) => (
                        <option key={event._id} value={event._id}>{event.title}</option>
                    ))}
                </select>
                <input
                    type="date"
                    className="p-3 border rounded-lg bg-gray-50 focus:ring focus:ring-blue-300 w-full"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="p-3 border rounded-lg bg-gray-50 focus:ring focus:ring-blue-300 w-full"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            {isLoading && <p className="text-center text-gray-600">Loading reports...</p>}
            {error && <p className="text-center text-red-600">Error fetching reports</p>}

            {data && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-6">
                    {[
                        { label: "Total Bookings", value: data.totalBookings || 0 },
                        { label: "Total Pending", value: data.totalPending || 0 },
                        { label: "Total Revenue (ETB)", value: data.totalRevenue || 0 },
                        { label: "Total Tickets Sold", value: data.totalTicketsSold || 0 },
                    ].map((item, index) => (
                        <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-medium text-gray-700">{item.label}</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{item.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reports;
