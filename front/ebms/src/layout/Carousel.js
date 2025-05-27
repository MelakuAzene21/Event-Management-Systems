
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import SkeletonLoader from './SkeletonLoader';
import { WifiOff } from 'lucide-react';

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://event-management-systems-gj91.onrender.com'
      : 'http://localhost:5000';
  const fetchLatestEvents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/events/nearUpcoming?limit=3`);
      setEvents(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Network Error: Unable to load events. Please check your connection and try again.');
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  }, [events.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  useEffect(() => {
    fetchLatestEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const interval = setInterval(nextSlide, 10000);
      return () => clearInterval(interval);
    }
  }, [events, nextSlide]);

  // Error State with Improved UI/UX
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
        <WifiOff className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Something Went Wrong</h2>
        <p className="text-gray-600 text-center max-w-md mb-4">{error}</p>
        <button
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          onClick={fetchLatestEvents}
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading State
  if (events.length === 0 && !error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </div>
    );
  }

  // Success State (Carousel)
  return (
    <div className="relative w-full overflow-hidden h-96">
      <div className="relative flex transition-transform duration-700 ease-in-out">
        <div className="carousel-item w-full flex flex-col items-center justify-center h-full">
          <img
            className="object-cover h-96 w-full rounded-lg shadow-xl"
            src={events[currentIndex]?.images[0]}
            alt={events[currentIndex]?.title || 'Event'}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-6 rounded-lg text-center">
            <h1 className="text-4xl font-extrabold text-yellow-400 italic drop-shadow-lg">
              Discover & Experience Unforgettable Events!
            </h1>
            <p className="text-lg text-white mt-2 drop-shadow-lg max-w-2xl">
              Find and book tickets for concerts, conferences, festivals, and exclusive events near you.
            </p>
            <h2 className="text-white italic text-3xl font-bold mt-4 drop-shadow-lg">
              {events[currentIndex]?.title}
            </h2>
            <p className="text-white text-lg mt-2">
              <strong>📍 Location:</strong>{' '}
              {events[currentIndex]?.location?.name?.split(',')[1] || 'Location not available'}
            </p>
            <button
              className="mt-4 px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-lg text-lg transition duration-300 hover:bg-yellow-600"
              onClick={() => (window.location.href = `/events/${events[currentIndex]?._id}`)}
            >
              🎟 Book Your Spot
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-black p-3 rounded-full shadow-md hover:bg-gray-300 transition"
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-black p-3 rounded-full shadow-md hover:bg-gray-300 transition"
        onClick={nextSlide}
      >
        ❯
      </button>
    </div>
  );
};

export default EventCarousel;
