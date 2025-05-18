import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaArrowRight, FaCalendar, FaClock, FaTag } from 'react-icons/fa';
import ExploreCategories from './ExploreCategories';

const CategoryEvents = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use category-specific images if available, else fallback to placeholders
    const carouselImages = category?.carouselImages?.length > 0
        ? category.carouselImages
        : [
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1573155993874-d5d49e7b4c99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        ];

    useEffect(() => {
        const fetchCategoryAndEvents = async () => {
            try {
                const categoryResponse = await axios.get(`http://localhost:5000/api/categories/${id}`);
                setCategory(categoryResponse.data);
                const eventsResponse = await axios.get(`http://localhost:5000/api/categories/events?category=${id}`);
                setEvents(eventsResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Frontend error:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to load category or events.');
                setLoading(false);
            }
        };

        fetchCategoryAndEvents();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
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
                        className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Carousel Section */}
            <section className="relative">
                <Carousel
                    showThumbs={false}
                    autoPlay
                    infiniteLoop
                    interval={4000}
                    showStatus={false}
                    showArrows
                    showIndicators
                    className="w-full h-[500px] md:h-[600px]"
                >
                    {carouselImages.map((image, index) => (
                        <div key={index} className="h-[500px] md:h-[600px]">
                            <img
                                src={image}
                                alt={`Carousel ${index}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </Carousel>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white py-6 md:py-8">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-center capitalize tracking-tight">
                        {category?.name || 'Category'} Events
                    </h1>
                    {category?.description && (
                        <p className="text-center mt-2 text-sm md:text-base max-w-2xl mx-auto">
                            {category.description}
                        </p>
                    )}
                </div>
            </section>

            {/* Events Grid Section */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                    Explore {category?.name} Events
                </h2>
                {events.length === 0 ? (
                    <div className="text-center">
                        <p className="text-lg text-gray-600 mb-4">No events found for this category.</p>
                        <Link
                            to="/"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                        >
                            Discover Other Categories
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <Link to={`/events/${event._id}`}>
                                    <div className="relative">
                                        <img
                                            src={event.images[0] || 'https://via.placeholder.com/300'}
                                            alt={event.title}
                                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {event.isFree && (
                                            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <div className="mt-3 space-y-2">
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
                                        className="mt-4 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
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

            {/* Explore Other Categories Section */}
            <ExploreCategories />
        </div>
    );
};

export default CategoryEvents;

