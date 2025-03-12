import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';

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
    return <p>Error loading events: {error}</p>;
  }

  if (events.length === 0) {
    return <p>Loading events...</p>;
  }

  return (
    <div className="relative w-full overflow-hidden h-80  py-3 ">
      <div className="flex transition-transform duration-500 ease-in-out">
        <div className="carousel-item w-full flex flex-col items-center justify-center h-full">
          <img
            className="object-cover h-80 w-full"
            src={`http://localhost:5000${events[currentIndex]?.images[0]}`}
            alt={events[currentIndex]?.title || 'Event'}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4">
            <h2 className="text-green-500 italic text-xl font-bold text-center mb-2">
              {events[currentIndex]?.title}
            </h2>
            {/* <p className="text-white text-center mb-2">
              <strong>Date:</strong> {events[currentIndex]?.date
                ? `${new Date(events[currentIndex].date).toISOString().split('T')[0]}, ${new Date(events[currentIndex].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Date not available'}
            </p> */}



            <p className="text-white text-center mb-4">
              <strong>Location:</strong> {events[currentIndex]?.location?.name || 'Location not available'}
            </p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg transition duration-200 hover:bg-blue-700"
              onClick={() => window.location.href = `/events/${events[currentIndex]?._id}`}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-black  py-6 px-2 shadow hover:bg-gray-400"
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-black  py-6 px-2 shadow hover:bg-gray-400"
        onClick={nextSlide}
      >
        ❯
      </button>
    </div>
  );
};

export default EventCarousel;
