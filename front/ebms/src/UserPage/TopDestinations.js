// import React, { useEffect, useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// const TopDestinations = () => {
//     const [cities, setCities] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const scrollRef = useRef(null);
//     const baseUrl =
//         process.env.NODE_ENV === 'production'
//             ? 'https://event-management-systems-gj91.onrender.com'
//             : 'http://localhost:5000';
//     // Fetch top cities
//     useEffect(() => {
//         const fetchTopCities = async () => {
//             try {
//                 const response = await axios.get(`${baseUrl}/api/events/top-cities`);
//                 setCities(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Axios Error Details:', err.response ? err.response.data : err.message);
//                 setError(err.response?.data?.message || 'Failed to load top destinations. Please try again later.');
//                 setLoading(false);
//             }
//         };

//         fetchTopCities();
//     }, []);

//     // Scroll functions for navigation arrows
//     const scrollLeft = () => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//         }
//     };

//     const scrollRight = () => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//         }
//     };

//     if (loading) {
//         return (
//             <div className="py-16 text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
//                 <p className="mt-4 text-lg font-medium text-gray-600">Loading top destinations...</p>
//             </div>
//         );
//     }

   

//     return (
//         <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
//             <div className="container mx-auto px-4">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 text-center">
//                     Top Destinations for Events
//                 </h2>
//                 <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-center">
//                     Looking for exciting events near you? Discover what’s happening in the most popular cities!
//                 </p>

//                 {/* Scrollable Container with Navigation Arrows */}
//                 <div className="relative">
//                     {/* Left Arrow */}
//                     <button
//                         onClick={scrollLeft}
//                         className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
//                         aria-label="Scroll Left"
//                     >
//                         <FaChevronLeft className="text-gray-600 text-xl" />
//                     </button>

//                     {/* Scrollable Cities */}
//                     <div
//                         ref={scrollRef}
//                         className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
//                         style={{ scrollSnapType: 'x mandatory' }}
//                     >
//                         {cities.map((city) => (
//                             <Link
//                                 key={city.name}
//                                 to={`/city-events/${city.name}`}
//                                 className="group flex-shrink-0 w-64 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
//                                 style={{ scrollSnapAlign: 'start' }}
//                             >
//                                 <div className="relative h-48">
//                                     <img
//                                         src={city.image}
//                                         alt={city.name}
//                                         className="w-full h-full object-cover brightness-75"
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
//                                         <div>
//                                             <h3 className="text-xl font-semibold text-white">
//                                                 {city.name.split(",")[1]}
//                                             </h3>
//                                             <p className="text-sm text-gray-200">
//                                                 {city.eventCount} Event{city.eventCount !== 1 ? 's' : ''} Available
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                         Explore Now
//                                     </div>
//                                 </div>
//                             </Link>
//                         ))}
//                     </div>

//                     {/* Right Arrow */}
//                     <button
//                         onClick={scrollRight}
//                         className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
//                         aria-label="Scroll Right"
//                     >
//                         <FaChevronRight className="text-gray-600 text-xl" />
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default TopDestinations;











// src/components/TopDestinations.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useGetTopCitiesQuery } from '../features/api/eventApi'; // Assuming RTK Query

// Utility function to format city name
const formatCityName = (name) => {
    const parts = name.split(',');
    return parts[1]?.trim() || parts[0] || 'Unknown City';
};

// Styles for maintainability
const styles = {
    section: 'py-10 sm:py-16 bg-gradient-to-b from-gray-50 to-gray-100',
    container: 'container mx-auto px-4 sm:px-6 lg:px-8',
    heading: 'text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 text-center',
    subheading: 'text-gray-600 mb-8 sm:mb-10 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base text-center',
    scrollContainer: 'relative',
    arrowButton: 'absolute top-1/2 transform -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10 disabled:opacity-50 disabled:cursor-not-allowed',
    scrollArea: 'flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory',
    card: 'group flex-shrink-0 w-[70vw] sm:w-56 md:w-64 lg:w-72 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 snap-start',
    imageWrapper: 'relative h-40 sm:h-48',
    image: 'w-full h-full object-cover brightness-75',
    overlay: 'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 sm:p-4',
    cityName: 'text-lg sm:text-xl font-semibold text-white',
    eventCount: 'text-xs sm:text-sm text-gray-200',
    exploreBadge: 'absolute top-3 sm:top-4 right-3 sm:right-4 bg-blue-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300',
};

// Component
const TopDestinations = React.memo(() => {
    const { data: cities = [], isLoading } = useGetTopCitiesQuery();
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Update scroll button states
    const updateScrollState = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    // Scroll handling
    const scrollByCard = (direction) => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.querySelector('a')?.offsetWidth || 300;
            scrollRef.current.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', updateScrollState);
            updateScrollState(); // Initial check
            return () => scrollElement.removeEventListener('scroll', updateScrollState);
        }
    }, [cities]);

    // Memoize formatted cities
    const formattedCities = useMemo(
        () =>
            cities.map((city) => ({
                ...city,
                formattedName: formatCityName(city.name),
            })),
        [cities]
    );

    if (isLoading) {
        return (
            <div className="py-10 sm:py-16 text-center">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-base sm:text-lg font-medium text-gray-600">Loading top destinations...</p>
            </div>
        );
    }

    return (
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.heading}>Top Destinations for Events</h2>
                    <p className={styles.subheading}>
                        Looking for exciting events near you? Discover what’s happening in the most popular cities!
                    </p>
                    <div className={styles.scrollContainer}>
                        <button
                            onClick={() => scrollByCard(-1)}
                            className={`${styles.arrowButton} left-0 sm:-left-4 md:-left-6`}
                            aria-label="Scroll left to view more destinations"
                            disabled={!canScrollLeft}
                        >
                            <FaChevronLeft className="text-gray-600 text-base sm:text-xl" />
                        </button>
                        <div ref={scrollRef} className={styles.scrollArea}>
                            {formattedCities.map((city) => (
                                <Link
                                    key={city.name}
                                    to={`/city-events/${city.name}`}
                                    className={styles.card}
                                    aria-label={`Explore events in ${city.formattedName}`}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={city.image}
                                            alt={city.formattedName}
                                            className={styles.image}
                                            loading="lazy"
                                        />
                                        <div className={styles.overlay}>
                                            <div>
                                                <h3 className={styles.cityName}>{city.formattedName}</h3>
                                                <p className={styles.eventCount}>
                                                    {city.eventCount} Event{city.eventCount !== 1 ? 's' : ''} Available
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.exploreBadge}>Explore Now</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button
                            onClick={() => scrollByCard(1)}
                            className={`${styles.arrowButton} right-0 sm:-right-4 md:-right-6`}
                            aria-label="Scroll right to view more destinations"
                            disabled={!canScrollRight}
                        >
                            <FaChevronRight className="text-gray-600 text-base sm:text-xl" />
                        </button>
                    </div>
                </div>
            </section>
    );
});

TopDestinations.displayName = 'TopDestinations';

export default TopDestinations;