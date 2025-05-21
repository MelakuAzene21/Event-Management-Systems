// import React, { useEffect, useState } from "react";
// import { useFetchReportsQuery } from "../features/api/reportApi";
// import {
//     BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
// } from "recharts";

// const Reports = ({ events = [] }) => {
//     const safeEvents = Array.isArray(events) ? events : [];

//     const today = new Date().toISOString().split("T")[0];
//     const [selectedEvent, setSelectedEvent] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState(today);
//     const [fetchParams, setFetchParams] = useState({ endDate: today });

//     const { data, error, isLoading } = useFetchReportsQuery(fetchParams, { skip: !fetchParams });

//     useEffect(() => {
//         setFetchParams({ endDate: today });
//     }, []);

//     useEffect(() => {
//         setFetchParams({ eventId: selectedEvent || undefined, startDate, endDate });
//     }, [selectedEvent, startDate, endDate]);

//     return (
//         <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//             <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Event Reports</h2>

//             {/* Event Filter */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//                 <select
//                     className="p-3 border rounded-lg bg-gray-50 focus:ring focus:ring-blue-300 w-full"
//                     value={selectedEvent}
//                     onChange={(e) => setSelectedEvent(e.target.value)}
//                 >
//                     <option value="">All Events</option>
//                     {safeEvents.map((event) => (
//                         <option key={event._id} value={event._id}>{event.title}</option>
//                     ))}

//                 </select>
//                 <input
//                     type="date"
//                     className="p-3 border rounded-lg bg-gray-50 focus:ring focus:ring-blue-300 w-full"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                 />
//                 <input
//                     type="date"
//                     className="p-3 border rounded-lg bg-gray-50 focus:ring focus:ring-blue-300 w-full"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                 />
//             </div>

//             {/* Loading & Error Handling */}
//             {isLoading && <p className="text-center text-gray-600">Loading reports...</p>}
//             {error && <p className="text-center text-red-600">Error fetching reports</p>}

//             {/* Summary Stats */}
//             {data && (
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
//                     {[
//                         { label: "Total Bookings", value: data.totalBookings || 0 },
//                         { label: "Total Revenue (ETB)", value: data.totalRevenue || 0 },
//                         { label: "Total Tickets Sold", value: data.totalTicketsSold || 0 },
//                     ].map((item, index) => (
//                         <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
//                             <h3 className="text-lg font-medium text-gray-700">{item.label}</h3>
//                             <p className="text-3xl font-bold text-blue-600 mt-2">{item.value}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Monthly Revenue Chart */}
//             {data?.monthlyRevenue && (
//                 <div className="mt-8">
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Revenue & Bookings</h3>
//                     <ResponsiveContainer width="100%" height={350}>
//                         <BarChart data={data.monthlyRevenue}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="month" stroke="#37474F" tick={{ fontSize: 14 }} />
//                             <YAxis stroke="#37474F" tick={{ fontSize: 14 }} />
//                             <Tooltip />
//                             <Bar dataKey="totalRevenue" fill="#3B82F6" barSize={50} />
//                             <Bar dataKey="totalBookings" fill="#4CAF50" barSize={50} />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Reports;


import React, { useEffect, useState } from "react";
import { useFetchReportsQuery } from "../features/api/reportApi";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell
} from "recharts";

const Reports = ({ events = [] }) => {
    const safeEvents = Array.isArray(events) ? events : [];

    const today = new Date().toISOString().split("T")[0];
    const [selectedEvent, setSelectedEvent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(today);
    const [fetchParams, setFetchParams] = useState({ endDate: today });

    const { data, error, isLoading } = useFetchReportsQuery(fetchParams, { skip: !fetchParams });

    useEffect(() => {
        setFetchParams({ endDate: today });
    }, []);

    useEffect(() => {
        setFetchParams({ eventId: selectedEvent || undefined, startDate, endDate });
    }, [selectedEvent, startDate, endDate]);

    const COLORS = ['#3B82F6', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'];

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Event Reports</h2>

            {/* Event Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <select
                    className="p-3 border rounded-lg bg-gray-50 focus:ring focus:ring-blue-300 w-full"
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                >
                    <option value="">All Events</option>
                    {safeEvents.map((event) => (
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

            {/* Loading & Error Handling */}
            {isLoading && <p className="text-center text-gray-600">Loading reports...</p>}
            {error && <p className="text-center text-red-600">Error fetching reports</p>}

            {/* Summary Stats */}
            {data && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                    {[
                        { label: "Total Bookings", value: data.totalBookings || 0 },
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

            {/* Charts Section */}
            {data && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Monthly Revenue & Bookings Chart */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Revenue & Bookings</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" stroke="#37474F" tick={{ fontSize: 14 }} />
                                <YAxis stroke="#37474F" tick={{ fontSize: 14 }} />
                                <Tooltip />
                                <Bar dataKey="totalRevenue" fill="#3B82F6" barSize={50} />
                                <Bar dataKey="totalBookings" fill="#4CAF50" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Event Performance Chart */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Performance</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data.eventPerformance || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#37474F" tick={{ fontSize: 14 }} />
                                <YAxis stroke="#37474F" tick={{ fontSize: 14 }} />
                                <Tooltip />
                                <Bar dataKey="attendees" fill="#9C27B0" barSize={50} name="Attendees" />
                                <Bar dataKey="revenue" fill="#4CAF50" barSize={50} name="Revenue ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Event Categories Chart */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Categories</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={data.eventCategories || []}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    labelLine={true}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // Display name and percentage
                                    dataKey="value"
                                >
                                    {data.eventCategories && data.eventCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>


                    {/* Revenue by Ticket Type Chart */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue by Ticket Type</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={data.ticketTypeRevenue || []}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    labelLine={true}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    dataKey="value"
                                >
                                    {data.ticketTypeRevenue && data.ticketTypeRevenue.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;