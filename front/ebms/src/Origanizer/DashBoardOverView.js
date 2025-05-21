import React from 'react';
import { useGetDashboardDataQuery } from '../features/api/eventApi';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardOverview = () => {
    const { data, error, isLoading } = useGetDashboardDataQuery();

    if (isLoading) return <div className="text-center py-6 text-gray-600">Loading...</div>;
    if (error) return <div className="text-center py-6 text-red-500">Error: {error.message}</div>;

    const {
        totalEvents,
        eventsChange,
        totalTicketSales,
        ticketSalesChange,
        totalAttendees,
        attendeesChange,
        upcomingEvents,
        recentEvents,
        revenueByMonth,
        ticketSalesOverTime,
    } = data;

    // Prepare data for Revenue Overview (Bar Chart) with attractive colors
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue ($)',
                data: revenueByMonth,
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue gradient
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    const revenueOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Revenue ($)', color: '#1F2937' },
                ticks: { color: '#4B5563' },
                grid: { color: '#E5E7EB' },
            },
            x: { ticks: { color: '#4B5563' }, grid: { display: false } },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#FFFFFF',
                titleColor: '#1F2937',
                bodyColor: '#4B5563',
                borderColor: '#E5E7EB',
                borderWidth: 1,
            },
        },
    };

    // Prepare data for Ticket Sales (Line Chart) with attractive colors
    const ticketSalesData = {
        labels: ticketSalesOverTime.map((item) => item.date),
        datasets: [
            {
                label: 'Tickets Sold',
                data: ticketSalesOverTime.map((item) => item.count),
                borderColor: 'rgba(34, 197, 94, 1)', // Green line
                backgroundColor: 'rgba(34, 197, 94, 0.2)', // Light green fill
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
            },
        ],
    };

    const ticketSalesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Tickets Sold', color: '#1F2937' },
                ticks: { color: '#4B5563' },
                grid: { color: '#E5E7EB' },
            },
            x: { ticks: { color: '#4B5563' }, grid: { display: false } },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#FFFFFF',
                titleColor: '#1F2937',
                bodyColor: '#4B5563',
                borderColor: '#E5E7EB',
                borderWidth: 1,
            },
        },
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-100 to-white min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Overview of your events, ticket sales, and performance metrics as of 11:32 AM EAT, May 21, 2025.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-gray-700 text-sm font-medium">Total Events</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{totalEvents}</p>
                    <p className="text-gray-500 text-sm mt-1">
                        {eventsChange >= 0 ? '+' : ''}{eventsChange} from last month
                    </p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-gray-700 text-sm font-medium">Ticket Sales</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">${totalTicketSales.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm mt-1">+{ticketSalesChange}% from last month</p>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-gray-700 text-sm font-medium">Total Attendees</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{totalAttendees}</p>
                    <p className="text-gray-500 text-sm mt-1">
                        {attendeesChange >= 0 ? '+' : ''}{attendeesChange} from last month
                    </p>
                </div>
                <div className="bg-gradient-to-r from-indigo-100 to-indigo-50 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-gray-700 text-sm font-medium">Upcoming Events</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">{upcomingEvents.length} Events</p>
                    <p className="text-gray-500 text-sm mt-1">
                        Next event in{' '}
                        {Math.ceil((new Date(upcomingEvents[0]?.eventDate) - new Date()) / (1000 * 60 * 60 * 24))}{' '}
                        days
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue Overview</h3>
                    <div className="h-64">
                        <Bar data={revenueData} options={revenueOptions} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Ticket Sales</h3>
                    <div className="h-64">
                        <Line data={ticketSalesData} options={ticketSalesOptions} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
                    <p className="text-gray-600 mb-4">Your events scheduled for the next 30 days.</p>
                    {upcomingEvents.map((event) => (
                        <div
                            key={event._id}
                            className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                                <p className="text-sm text-gray-600">
                                    {new Date(event.eventDate).toLocaleString()} - {event.eventTime}
                                </p>
                                <p className="text-sm text-gray-600">{event.location.name}</p>
                                <p className="text-sm text-gray-600">
                                    {event.ticketTypes.reduce((sum, ticket) => sum + ticket.booked, 0)} registered
                                </p>
                            </div>
                            <span className="px-4 py-1 bg-black text-white text-sm rounded-full font-medium">
                                Confirmed
                            </span>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Events</h3>
                    <p className="text-gray-600 mb-4">Your events from the past 30 days.</p>
                    {recentEvents.map((event) => (
                        <div
                            key={event._id}
                            className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                                <p className="text-sm text-gray-600">{new Date(event.eventDate).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">
                                    {event.ticketTypes.reduce((sum, ticket) => sum + ticket.booked, 0)} attendees
                                </p>
                            </div>
                            <span
                                className={`px-4 py-1 text-sm rounded-full font-medium ${event.status === 'canceled'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-green-200 text-green-800'
                                    }`}
                            >
                                {event.status === 'canceled' ? 'Canceled' : 'Completed'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;