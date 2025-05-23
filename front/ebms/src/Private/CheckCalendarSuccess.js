import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCheckCalendarEventQuery } from '../features/api/bookingApi';
import { FaCheckCircle, FaMapMarkerAlt, FaFileAlt, FaClock, FaEnvelope } from 'react-icons/fa';

const CheckCalendarSuccess = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookingId = queryParams.get('bookingId');

    const { data, error, isLoading } = useCheckCalendarEventQuery(bookingId, {
        skip: !bookingId,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl font-semibold text-gray-700">Loading...</div>
            </div>
        );
    }

    if (error || !data?.success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Add Event</h2>
                    <p className="text-gray-700 mb-4">
                        {data?.message || error?.data?.message || 'An error occurred while checking the event.'}
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    const { event, booking } = data;

    // Format dates to match the image (e.g., "Jul 25, 2025, 1:42 AM")
    const formatDateTime = (dateTime, timeZone) => {
        return new Date(dateTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: timeZone,
        });
    };

    return (
        <div className="flex  pt-4 items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-lg shadow-xl w-full transform transition-all duration-300 animate-fadeIn">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center items-center mb-2">
                        <FaCheckCircle className="text-green-500 text-4xl mr-2" />
                        <h2 className="text-2xl font-bold text-green-500">Success!</h2>
                    </div>
                    <p className="text-lg text-gray-800">
                        Event Successfully Added to Google Calendar
                    </p>
                </div>

                {/* Event Details */}
                <div className="mb-6">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-t-lg flex items-center">
                        <span className="text-lg font-semibold">🎵 Event Details</span>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-b-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                            {event.summary || 'Untitled Event'}
                            <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                {event.status || 'confirmed'}
                            </span>
                        </h3>
                        <div className="space-y-2 text-gray-700">
                            <p className="flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-purple-600" />
                                <span>{event.location || 'Location TBD'}</span>
                            </p>
                            <p className="flex items-center">
                                <FaFileAlt className="mr-2 text-purple-600" />
                                <span>{event.description || 'No description'}</span>
                            </p>
                            <p className="flex items-center">
                                <FaClock className="mr-2 text-purple-600" />
                                <span>
                                    <strong>Start:</strong> {formatDateTime(event.start.dateTime, event.start.timeZone)}
                                    <br />
                                    <strong>End:</strong> {formatDateTime(event.end.dateTime, event.end.timeZone)}
                                </span>
                            </p>
                            <p className="flex items-center">
                                <FaEnvelope className="mr-2 text-purple-600" />
                                <span>
                                    {event.attendees?.map((a) => a.email).join(', ') || 'None'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Booking Details */}
                <div className="mb-6">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-t-lg flex items-center">
                        <span className="text-lg font-semibold">📋 Booking Details</span>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-b-lg grid grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p><strong>Event :{booking.eventTitle || 'N/A'}</strong></p>
                            
                        </div>
                        <div>
                            <p><strong>Ticket Type:{booking.ticketType || 'N/A'}</strong></p>
                        </div>
                        <div>
                            <p><strong>Ticket Count:{booking.ticketCount || '0'}</strong></p>
                        </div>
                        <div>
                            <p><strong>User Email:{booking.userEmail || 'N/A'}</strong></p>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-4">
                    <a
                        href="https://calendar.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                    >
                        View in Google Calendar
                    </a>
                    <a
                        href="/"
                        className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CheckCalendarSuccess;