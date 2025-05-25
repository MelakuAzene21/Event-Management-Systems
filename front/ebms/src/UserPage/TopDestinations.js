import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TopDestinations = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? 'https://event-management-systems-gj91.onrender.com'
            : 'http://localhost:5000';
    // Fetch top cities
    useEffect(() => {
        const fetchTopCities = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/events/top-cities`);
                setCities(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Axios Error Details:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.message || 'Failed to load top destinations. Please try again later.');
                setLoading(false);
            }
        };

        fetchTopCities();
    }, []);

    // Scroll functions for navigation arrows
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-lg font-medium text-gray-600">Loading top destinations...</p>
            </div>
        );
    }

   

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 text-center">
                    Top Destinations for Events
                </h2>
                <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-center">
                    Looking for exciting events near you? Discover what’s happening in the most popular cities!
                </p>

                {/* Scrollable Container with Navigation Arrows */}
                <div className="relative">
                    {/* Left Arrow */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
                        aria-label="Scroll Left"
                    >
                        <FaChevronLeft className="text-gray-600 text-xl" />
                    </button>

                    {/* Scrollable Cities */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {cities.map((city) => (
                            <Link
                                key={city.name}
                                to={`/city-events/${city.name}`}
                                className="group flex-shrink-0 w-64 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                <div className="relative h-48">
                                    <img
                                        src={city.image}
                                        alt={city.name}
                                        className="w-full h-full object-cover brightness-75"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">
                                                {city.name.split(",")[1]}
                                            </h3>
                                            <p className="text-sm text-gray-200">
                                                {city.eventCount} Event{city.eventCount !== 1 ? 's' : ''} Available
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Explore Now
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
                        aria-label="Scroll Right"
                    >
                        <FaChevronRight className="text-gray-600 text-xl" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TopDestinations;