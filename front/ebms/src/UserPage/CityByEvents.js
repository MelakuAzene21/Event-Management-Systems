import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight, FaCalendar, FaClock, FaTag, FaRegFrown } from 'react-icons/fa';
import ExploreCategories from '../layout/ExploreCategories';

const CityEvents = () => {
    const { city } = useParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventsByCity = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/by-city/${city}`);
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching events by city:', err);
                setError('Failed to load events for this city.');
                setLoading(false);
            }
        };

        fetchEventsByCity();
    }, [city]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                    <p className="mt-4 text-lg font-medium text-gray-600">Loading events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                    <Link
                        to="/"
                        className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header Section with Background Image */}
            <section
                className="relative h-80 md:h-96 flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
                }}
            >
                <div className="absolute inset-0 bg-black/50" /> {/* Gradient Overlay */}
                <div className="relative text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white capitalize tracking-tight animate-fade-in">
                        Events in {city}
                    </h1>
                    <p className="mt-3 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto animate-fade-in-delayed">
                        Discover exciting events happening in {city}!
                    </p>
                </div>
            </section>

            {/* Events Grid Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                    All Events in {city}
                </h2>
                {events.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
                        <FaRegFrown className="mx-auto text-6xl text-gray-400 mb-4 animate-bounce" />
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                            No Events Available
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            We're sorry, but there are currently no events scheduled in {city}.
                            Check back soon for exciting new events, or explore other cities!
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
                        >
                            Explore Other Destinations
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                            >
                                <Link to={`/events/${event._id}`}>
                                    <div className="relative">
                                        <img
                                            src={event.images[0] || 'https://via.placeholder.com/300'}
                                            alt={event.title}
                                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {event.isFree && (
                                            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1 mb-3">
                                        {event.title}
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="flex items-center text-gray-600 text-sm">
                                            <FaCalendar className="mr-2 text-blue-500" />
                                            {new Date(event.eventDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                        <p className="flex items-center text-gray-600 text-sm">
                                            <FaClock className="mr-2 text-blue-500" />
                                            {event.eventTime || 'TBD'}
                                        </p>
                                        <p className="flex items-center text-gray-600 text-sm">
                                            <FaTag className="mr-2 text-blue-500" />
                                            {event.isFree ? 'Free' : `$${event.ticketTypes[0]?.price || 'TBD'}`}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="mt-5 inline-flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                                    >
                                        View Details
                                        <FaArrowRight className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <ExploreCategories />
        </div>
    );
};

export default CityEvents;