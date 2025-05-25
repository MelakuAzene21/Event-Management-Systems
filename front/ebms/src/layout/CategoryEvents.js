import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaArrowRight, FaCalendar, FaClock, FaTag, FaRegFrown } from 'react-icons/fa';
import ExploreCategories from './ExploreCategories';

const CategoryEvents = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? 'https://event-management-systems-gj91.onrender.com'
            : 'http://localhost:5000';


    // Fallback carousel images
    const carouselImages = category?.carouselImages?.length > 0
        ? category.carouselImages
        : [
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1721133073235-e4b5facb27fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBldmVudHxlbnwwfHwwfHx8MA%3D%3D',
        ];

    useEffect(() => {
        const fetchCategoryAndEvents = async () => {
            try {
                const categoryResponse = await axios.get(`${baseUrl}/api/categories/${id}`);
                setCategory(categoryResponse.data);
                const eventsResponse = await axios.get(`${baseUrl}/api/categories/events?category=${id}`);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                    <p className="mt-4 text-lg font-medium text-gray-600">Loading exciting events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        <div className="min-h-screen bg-gray-50">
            {/* Hero Carousel Section */}
            <section className="relative">
                <Carousel
                    showThumbs={false}
                    autoPlay
                    infiniteLoop
                    interval={4000}
                    showStatus={false}
                    showArrows
                    showIndicators
                    className="w-full h-[400px] md:h-[600px]"
                >
                    {carouselImages.map((image, index) => (
                        <div key={index} className="h-[400px] md:h-[600px]">
                            <img
                                src={image}
                                alt={`Carousel ${index}`}
                                className="w-full h-full object-cover brightness-75"
                            />
                        </div>
                    ))}
                </Carousel>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent text-white py-8 md:py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-5xl font-extrabold capitalize tracking-tight">
                            {category?.name || 'Category'} Events
                        </h1>
                        {category?.description && (
                            <p className="mt-3 text-sm md:text-lg max-w-3xl mx-auto opacity-90">
                                {category.description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Events Grid Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
                    Discover {category?.name} Events
                </h2>
                {events.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
                        <FaRegFrown className="mx-auto text-6xl text-gray-400 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                            No Events Available
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            We're sorry, but there are currently no events scheduled for the {category?.name} category.
                            Check back soon for exciting new events, or explore other categories to find something that sparks your interest!
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
                        >
                            Explore Other Categories
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <Link to={`/events/${event._id}`}>
                                    <div className="relative">
                                        <img
                                            src={event.images[0] || 'https://via.placeholder.com/300'}
                                            alt={event.title}
                                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {event.isFree && (
                                            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <div className="mt-4 space-y-3">
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
                                        className="mt-5 inline-flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm font-medium"
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