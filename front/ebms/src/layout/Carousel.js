import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import SkeletonLoader from './SkeletonLoader';

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchLatestEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events/nearUpcoming?limit=3');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
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

  if (error) {
    return <p className="text-red-600 text-center text-lg">Error loading events: {error}</p>;
  }

  if (events.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden h-96 py-5">
      <div className="relative flex transition-transform duration-700 ease-in-out">
        <div className="carousel-item w-full flex flex-col items-center justify-center h-full">
          <img
            className="object-cover h-96 w-full rounded-lg shadow-xl"
            src={`http://localhost:5000${events[currentIndex]?.images[0]}`}
            alt={events[currentIndex]?.title || 'Event'}
          />
          {/* Overlay with Title & Description */}
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
              <strong>📍 Location:</strong> {events[currentIndex]?.location?.name || 'Location not available'}
            </p>
            <button
              className="mt-4 px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-lg text-lg transition duration-300 hover:bg-yellow-600"
              onClick={() => window.location.href = `/events/${events[currentIndex]?._id}`}
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
