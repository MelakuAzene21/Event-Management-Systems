// import { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import SkeletonLoader from '../layout/SkeletonLoader';
// import EventCarousel from '../layout/Carousel';
// import CategoryTags from '../layout/CategoryTag';
// import EventCard from '../components/EventCard';
// import NoEventsFound from '../components/NoEventsFound';
// import { ArrowLeft, ArrowRight, MapPin, Calendar, X } from 'lucide-react';
// import { useGetAllEventsQuery, useLikeEventMutation, useGetCategoriesQuery } from '../features/api/eventApi';
// import TopDestinations from '../UserPage/TopDestinations';
// import FAQ from '../components/FAQ';

// export default function IndexPage() {
//     const user = useSelector((state) => state.auth.user);
//     const navigate = useNavigate();
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [timeFilter, setTimeFilter] = useState('Upcoming');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [location, setLocation] = useState(null);
//     const [locationError, setLocationError] = useState(null);
//     const [locationInput, setLocationInput] = useState('');
//     const [suggestions, setSuggestions] = useState([]);
//     const [placeholderText, setPlaceholderText] = useState('Fetching location...');
//     const [selectedFilter, setSelectedFilter] = useState('ALL');
//     const [fromDate, setFromDate] = useState('');
//     const [toDate, setToDate] = useState('');
//     const eventsPerPage = 6;
//     const suggestionsRef = useRef(null);

//     const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
//     const { data: events = [], isLoading: eventsLoading } = useGetAllEventsQuery(
//         { latitude: location?.latitude, longitude: location?.longitude },
//         { skip: !placeholderText }
//     );

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setLocation({ latitude, longitude });
//                     setPlaceholderText(`Current Location (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)})`);
//                 },
//                 (err) => {
//                     setLocationError('Unable to get location. Showing all events.');
//                     setPlaceholderText('All Locations');
//                 }
//             );
//         } else {
//             setLocationError('Geolocation is not supported by this browser.');
//             setPlaceholderText('All Locations');
//         }
//     }, []);

//     const eventLocations = [...new Set(
//         events
//             .filter(event => event.location?.coordinates && event.location.coordinates.length === 2 && event.location.name)
//             .map(event => ({
//                 name: event.location.name,
//                 latitude: event.location.coordinates[1],
//                 longitude: event.location.coordinates[0]
//             }))
//     )];

//     const handleLocationInput = (value) => {
//         setLocationInput(value);
//         if (!value.trim()) {
//             setSuggestions([]);
//             return;
//         }
//         const filteredSuggestions = eventLocations.filter((loc) =>
//             loc.name.toLowerCase().includes(value.toLowerCase())
//         );
//         setSuggestions(filteredSuggestions);
//     };

//     const handleSuggestionSelect = (suggestion) => {
//         setLocationInput(suggestion.name);
//         setLocation({ latitude: suggestion.latitude, longitude: suggestion.longitude });
//         setSuggestions([]);
//     };

//     const handleInputFocus = () => {
//         setLocationInput('');
//         setSuggestions(eventLocations);
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
//                 setSuggestions([]);
//                 if (!locationInput) setLocationInput('');
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [locationInput]);

//     const [likeEvent] = useLikeEventMutation();

//     const handleLike = async (eventId) => {
//         if (!user || !user._id) {
//             navigate('/login');
//             return;
//         }
//         try {
//             await likeEvent({ eventId, userId: user._id });
//         } catch (error) {
//             console.error('Error liking/unliking event', error);
//         }
//     };

//     const currentDate = new Date();

//     const filteredEvents = events.filter((event) => {
//         const eventDate = new Date(event.eventDate);
//         const matchesCategory =
//             selectedCategories.length === 0 ||
//             (event.category && selectedCategories.includes(event.category._id.toString()));

//         const matchesDateFilter =
//             (!fromDate || eventDate >= new Date(fromDate)) &&
//             (!toDate || eventDate <= new Date(toDate));

//         let matchesFilter = true;
//         if (selectedFilter === 'Upcoming') {
//             matchesFilter = eventDate >= currentDate;
//         } else if (selectedFilter === 'Today') {
//             matchesFilter = eventDate.toDateString() === currentDate.toDateString();
//         } else if (selectedFilter === 'This week') {
//             const currentDay = currentDate.getDay();
//             const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
//             const startOfWeek = new Date(currentDate);
//             startOfWeek.setHours(0, 0, 0, 0);
//             startOfWeek.setDate(currentDate.getDate() - daysSinceMonday);
//             const endOfWeek = new Date(startOfWeek);
//             endOfWeek.setDate(startOfWeek.getDate() + 6);
//             endOfWeek.setHours(23, 59, 59, 999);
//             matchesFilter = eventDate >= startOfWeek && eventDate <= endOfWeek;
//         } else if (selectedFilter === 'Past') {
//             matchesFilter = eventDate < currentDate;
//         } else if (selectedFilter === 'Free') {
//             matchesFilter = event.isFree === true;
//         } else if (['Religious', 'Conferences', 'Seminars'].includes(selectedFilter)) {
//             const category = categories.find(cat => cat.name.toLowerCase() === selectedFilter.toLowerCase());
//             matchesFilter = event.category && event.category._id.toString() === (category?._id?.toString());
//         }

//         return matchesCategory && matchesFilter && matchesDateFilter;
//     });

//     const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
//     const startIndex = (currentPage - 1) * eventsPerPage;
//     const endIndex = startIndex + eventsPerPage;
//     const currentEvents = filteredEvents.slice(startIndex, endIndex);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const getPaginationButtons = () => {
//         const buttons = [];
//         const maxButtonsToShow = 5;
//         let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
//         let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

//         if (endPage - startPage + 1 < maxButtonsToShow) {
//             startPage = Math.max(1, endPage - maxButtonsToShow + 1);
//         }

//         buttons.push(
//             <button
//                 key="prev"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === 1
//                     ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                     } flex items-center gap-1 shadow-md`}
//             >
//                 <ArrowLeft className="w-4 h-4" /> Previous
//             </button>
//         );

//         for (let i = startPage; i <= endPage; i++) {
//             buttons.push(
//                 <button
//                     key={i}
//                     onClick={() => handlePageChange(i)}
//                     className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === i
//                         ? 'bg-blue-500 text-white border-2 border-blue-500'
//                         : 'bg-gray-400 text-white border-2 border-blue-500 hover:bg-blue-600'
//                         }`}
//                 >
//                     {i}
//                 </button>
//             );
//         }

//         if (endPage < totalPages) {
//             if (endPage < totalPages - 1) {
//                 buttons.push(<span key="ellipsis-end" className="px-2 text-gray-700">...</span>);
//             }
//             buttons.push(
//                 <button
//                     key={totalPages}
//                     onClick={() => handlePageChange(totalPages)}
//                     className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === totalPages
//                         ? 'bg-blue-500 text-white border-2 border-blue-500'
//                         : 'bg-black text-white border-2 border-blue-500 hover:bg-blue-600'
//                         }`}
//                 >
//                     {totalPages}
//                 </button>
//             );
//         }

//         buttons.push(
//             <button
//                 key="next"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === totalPages
//                     ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                     } flex items-center gap-1 shadow-md`}
//             >
//                 Next <ArrowRight className="w-4 h-4" />
//             </button>
//         );

//         return buttons;
//     };

//     const filterBarOptions = [
//         'ALL',
//         'Upcoming',
//         'Today',
//         'This week',
//         'Past',
//         'Free',
//         'Religious',
//         'Conferences',
//         'Seminars',
//     ];

//     const handleFilterSelect = (filter) => {
//         setSelectedFilter(filter);
//         if (filter === 'Free') setSelectedCategories([]);
//         setCurrentPage(1);
//     };

//     const toggleCategory = (categoryId) => {
//         setSelectedCategories((prev) =>
//             prev.includes(categoryId)
//                 ? prev.filter((c) => c !== categoryId)
//                 : [...prev, categoryId]
//         );
//         setCurrentPage(1);
//     };

//     const resetFilters = () => {
//         setSelectedCategories([]);
//         setTimeFilter('Upcoming');
//         setSelectedFilter('ALL');
//         setFromDate('');
//         setToDate('');
//         setCurrentPage(1);
//     };

//     return (
//         <>
//             {/* Ad Slot 1 - Above Carousel
//             <div className="container mx-auto px-4 py-2">
//                 <div className="w-full h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//                     Ad Slot 1 (300x100)
//                 </div>
//             </div> */}
//             <EventCarousel />
//             <div className="container mx-auto px-4">
//                 {categoriesLoading ? (
//                     <p className="text-gray-500 text-center">Loading categories...</p>
//                 ) : categoriesError ? (
//                     <p className="text-red-500 text-center">Error loading categories</p>
//                 ) : (
//                     <CategoryTags
//                         categories={categories.map(cat => ({
//                             id: cat._id,
//                             name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
//                             icon: cat.icon
//                         }))}
//                         selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : ''}
//                         onCategorySelect={toggleCategory}
//                     />
//                 )}
//             </div>
//             <div className="container mx-auto px-4 py-6 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl shadow-lg">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
//                     {/* Location Filter */}
//                     <div className="flex items-center gap-3 w-full md:w-auto">
//                         <span className="text-lg font-semibold text-gray-800">Browsing events in</span>
//                         <div className="relative w-full sm:w-64">
//                             <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
//                                 <MapPin className="w-5 h-5 text-blue-500 mr-2" />
//                                 <input
//                                     type="text"
//                                     value={locationInput}
//                                     onChange={(e) => handleLocationInput(e.target.value)}
//                                     onFocus={handleInputFocus}
//                                     className="w-full outline-none text-gray-700 text-sm bg-transparent"
//                                     placeholder={placeholderText}
//                                 />
//                             </div>
//                             {suggestions.length > 0 && (
//                                 <ul
//                                     ref={suggestionsRef}
//                                     className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
//                                 >
//                                     {[...new Map(
//                                         suggestions.map((s) => [s.name.split(',')[0].trim(), s])
//                                     ).values()].map((suggestion, index) => (
//                                         <li
//                                             key={index}
//                                             onClick={() => handleSuggestionSelect(suggestion)}
//                                             className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
//                                         >
//                                             {suggestion.name.split(',')[0]}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>
//                     </div>

//                     {/* Date Filter and Reset Button */}
//                     <div className="flex items-center gap-4 w-full md:w-auto">
//                         <div className="flex items-center gap-3 bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200 w-full">
//                             <div className="relative w-full sm:w-1/2">
//                                 <label className="text-xs font-medium text-gray-600">From Date</label>
//                                 <div className="flex items-center mt-1">
//                                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
//                                     <input
//                                         type="date"
//                                         value={fromDate}
//                                         onChange={(e) => setFromDate(e.target.value)}
//                                         className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white transition-all duration-300"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="relative w-full sm:w-1/2">
//                                 <label className="text-xs font-medium text-gray-600">To Date</label>
//                                 <div className="flex items-center mt-1">
//                                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
//                                     <input
//                                         type="date"
//                                         value={toDate}
//                                         onChange={(e) => setToDate(e.target.value)}
//                                         className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white transition-all duration-300"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <button
//                             onClick={resetFilters}
//                             className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
//                         >
//                             <X className="w-4 h-4" />
//                             Reset Filters
//                         </button>
//                     </div>
//                 </div>

//                 {/* Small Filter Bar */}
//                 <div className="mt-4 sm:mt-6 flex justify-center">
//                     <div className="flex gap-2 sm:gap-3 whitespace-nowrap bg-white p-2 sm:p-3 rounded-xl shadow-md border border-gray-200 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                         {filterBarOptions.map((filter) => (
//                             <button
//                                 key={filter}
//                                 onClick={() => handleFilterSelect(filter)}
//                                 className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${selectedFilter === filter
//                                     ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
//                                     : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md'
//                                     }`}
//                             >
//                                 {filter}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//             {/* Ad Slot 2 - Between Filters and Events */}
//             <div className="container mx-auto px-4 py-2 mt-4">
//                 <div className="w-full h-16 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//                     <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKRYo54Q78Y6SiRQp1oKTN-Kh8atoF2z6Ilg&s'
//                         alt='Slot 3'
//                         className='w-full h-full object-cover rounded-lg shadow-md'
//                     />
//                 </div>
//             </div>
//             <hr className="border-b border-gray-200 mx-4 md:mx-10 mb-5" />
//             <div className="flex flex-col md:flex-row gap-6 mx-4 md:mx-10 mt-5">
//                 <div className="w-full md:w-3/4">
//                     {locationError && (
//                         <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
//                             {locationError}
//                         </div>
//                     )}
//                     {eventsLoading || categoriesLoading ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//                             {[...Array(8)].map((_, i) => (
//                                 <SkeletonLoader key={i} />
//                             ))}
//                         </div>
//                     ) : (
//                         <>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
//                                 {currentEvents.length > 0 ? (
//                                     currentEvents.map((event) => (
//                                         <EventCard key={event._id} event={event} user={user} handleLike={handleLike} />
//                                     ))
//                                 ) : (
//                                     <NoEventsFound resetFilters={resetFilters} />
//                                 )}
//                             </div>
//                             {totalPages > 1 && (
//                                 <div className="flex justify-center mt-4 sm:mt-8 mb-4">
//                                     <div className="flex items-center gap-2 flex-wrap">{getPaginationButtons()}</div>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//                 {/* Ad Slot 3 - Sidebar or Right Column */}
//                 <div className="w-full md:w-1/4 mt-4 md:mt-0">
//                     <div className="w-full h-80 sm:h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//                         <img src='https://images.unsplash.com/photo-1580130857334-2f9b6d01d99d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFkdmVydGlzZW1lbnR8ZW58MHx8MHx8fDA%3D'
//                             alt="Ad Slot 3"
//                             className="w-full h-full object-cover rounded-lg shadow-md"
//                         />

//                     </div>
//                 </div>
//             </div>
//             {/* Ad Slot 4 - Bottom of Page */}
//             <div className="container mx-auto px-4 py-2 mt-6">
//                 <div className="w-full h-16 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//                     <img src='https://plus.unsplash.com/premium_photo-1681488183639-f38511a647ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWR2ZXJ0aXNlbWVudHxlbnwwfHwwfHx8MA%3D%3D'
//                         alt='Ad Slot 4 728x90'
//                         className='w-full h-full object-cover rounded-lg shadow-md'
//                     />
//                 </div>

//                 <div>
//                     <TopDestinations/>
//                  </div>

                 
//                 <div>
//                      <FAQ />
//                  </div>
//             </div>
//         </>
//     );
// }



import { useState, useEffect, useRef, lazy, Suspense, memo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Calendar, X } from 'lucide-react';
import { useGetAllEventsQuery, useLikeEventMutation, useGetCategoriesQuery } from '../features/api/eventApi';

// Lazy-load components
const EventCarousel = lazy(() => import('../layout/Carousel'));
const CategoryTags = lazy(() => import('../layout/CategoryTag'));
const EventCard = lazy(() => import('../components/EventCard'));
const NoEventsFound = lazy(() => import('../components/NoEventsFound'));
const TopDestinations = lazy(() => import('../UserPage/TopDestinations'));
const FAQ = lazy(() => import('../components/FAQ'));

// Shimmer loader component for Suspense fallbacks
const ShimmerLoader = () => (
    <div className="animate-pulse w-full h-24 bg-gray-200 rounded-lg"></div>
);

// Enhanced SkeletonLoader with shimmer effect
const SkeletonLoader = memo(() => (
    <div className="animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
        <div className="mt-2 h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
));

export default function IndexPage() {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [timeFilter, setTimeFilter] = useState('Upcoming');
    const [currentPage, setCurrentPage] = useState(1);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [locationInput, setLocationInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [placeholderText, setPlaceholderText] = useState('Fetching location...');
    const [selectedFilter, setSelectedFilter] = useState('ALL');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const eventsPerPage = 6;
    const suggestionsRef = useRef(null);

    const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
    const { data: events = [], isLoading: eventsLoading } = useGetAllEventsQuery(
        { latitude: location?.latitude, longitude: location?.longitude },
        { skip: !placeholderText }
    );

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    setPlaceholderText(`Current Location (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)})`);
                },
                (err) => {
                    setLocationError('Unable to get location. Showing all events.');
                    setPlaceholderText('All Locations');
                }
            );
        } else {
            setLocationError('Geolocation is not supported by this browser.');
            setPlaceholderText('All Locations');
        }
    }, []);

    const eventLocations = [...new Set(
        events
            .filter(event => event.location?.coordinates && event.location.coordinates.length === 2 && event.location.name)
            .map(event => ({
                name: event.location.name,
                latitude: event.location.coordinates[1],
                longitude: event.location.coordinates[0]
            }))
    )];

    // Debounced location input handler
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const handleLocationInput = debounce((value) => {
        setLocationInput(value);
        if (!value.trim()) {
            setSuggestions([]);
            return;
        }
        const filteredSuggestions = eventLocations.filter((loc) =>
            loc.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
    }, 300);

    const handleSuggestionSelect = (suggestion) => {
        setLocationInput(suggestion.name);
        setLocation({ latitude: suggestion.latitude, longitude: suggestion.longitude });
        setSuggestions([]);
    };

    const handleInputFocus = () => {
        setLocationInput('');
        setSuggestions(eventLocations);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setSuggestions([]);
                if (!locationInput) setLocationInput('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [locationInput]);

    const [likeEvent] = useLikeEventMutation();

    const handleLike = async (eventId) => {
        if (!user || !user._id) {
            navigate('/login');
            return;
        }
        try {
            await likeEvent({ eventId, userId: user._id });
        } catch (error) {
            console.error('Error liking/unliking event', error);
        }
    };

    const currentDate = new Date();

    const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.eventDate);
        const matchesCategory =
            selectedCategories.length === 0 ||
            (event.category && selectedCategories.includes(event.category._id.toString()));

        const matchesDateFilter =
            (!fromDate || eventDate >= new Date(fromDate)) &&
            (!toDate || eventDate <= new Date(toDate));

        let matchesFilter = true;
        if (selectedFilter === 'Upcoming') {
            matchesFilter = eventDate >= currentDate;
        } else if (selectedFilter === 'Today') {
            matchesFilter = eventDate.toDateString() === currentDate.toDateString();
        } else if (selectedFilter === 'This week') {
            const currentDay = currentDate.getDay();
            const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
            const startOfWeek = new Date(currentDate);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(currentDate.getDate() - daysSinceMonday);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            matchesFilter = eventDate >= startOfWeek && eventDate <= endOfWeek;
        } else if (selectedFilter === 'Past') {
            matchesFilter = eventDate < currentDate;
        } else if (selectedFilter === 'Free') {
            matchesFilter = event.isFree === true;
        } else if (['Religious', 'Conferences', 'Seminars'].includes(selectedFilter)) {
            const category = categories.find(cat => cat.name.toLowerCase() === selectedFilter.toLowerCase());
            matchesFilter = event.category && event.category._id.toString() === (category?._id?.toString());
        }

        return matchesCategory && matchesFilter && matchesDateFilter;
    });

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const currentEvents = filteredEvents.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPaginationButtons = () => {
        const buttons = [];
        const maxButtonsToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

        if (endPage - startPage + 1 < maxButtonsToShow) {
            startPage = Math.max(1, endPage - maxButtonsToShow + 1);
        }

        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    } flex items-center gap-1 shadow-md`}
            >
                <ArrowLeft className="w-4 h-4" /> Previous
            </button>
        );

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === i
                        ? 'bg-blue-500 text-white border-2 border-blue-500'
                        : 'bg-gray-400 text-white border-2 border-blue-500 hover:bg-blue-600'
                        }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(<span key="ellipsis-end" className="px-2 text-gray-700">...</span>);
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === totalPages
                        ? 'bg-blue-500 text-white border-2 border-blue-500'
                        : 'bg-black text-white border-2 border-blue-500 hover:bg-blue-600'
                        }`}
                >
                    {totalPages}
                </button>
            );
        }

        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    } flex items-center gap-1 shadow-md`}
            >
                Next <ArrowRight className="w-4 h-4" />
            </button>
        );

        return buttons;
    };

    const filterBarOptions = [
        'ALL',
        'Upcoming',
        'Today',
        'This week',
        'Past',
        'Free',
        'Religious',
        'Conferences',
        'Seminars',
    ];

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        if (filter === 'Free') setSelectedCategories([]);
        setCurrentPage(1);
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((c) => c !== categoryId)
                : [...prev, categoryId]
        );
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setTimeFilter('Upcoming');
        setSelectedFilter('ALL');
        setFromDate('');
        setToDate('');
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen">
            {/* Lazy-loaded EventCarousel with shimmer fallback */}
            <Suspense fallback={<ShimmerLoader />}>
                <EventCarousel />
            </Suspense>

            <div className="container mx-auto px-4">
                {categoriesLoading ? (
                    <ShimmerLoader />
                ) : categoriesError ? (
                    <p className="text-red-500 text-center">Error loading categories</p>
                ) : (
                    <Suspense fallback={<ShimmerLoader />}>
                        <CategoryTags
                            categories={categories.map(cat => ({
                                id: cat._id,
                                name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
                                icon: cat.icon
                            }))}
                            selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : ''}
                            onCategorySelect={toggleCategory}
                        />
                    </Suspense>
                )}
            </div>

            <div className="container mx-auto px-4 py-6 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                    {/* Location Filter */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-lg font-semibold text-gray-800">Browsing events in</span>
                        <div className="relative w-full sm:w-64">
                            <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                                <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                                <input
                                    type="text"
                                    value={locationInput}
                                    onChange={(e) => handleLocationInput(e.target.value)}
                                    onFocus={handleInputFocus}
                                    className="w-full outline-none text-gray-700 text-sm bg-transparent"
                                    placeholder={placeholderText}
                                />
                            </div>
                            {suggestions.length > 0 && (
                                <ul
                                    ref={suggestionsRef}
                                    className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                >
                                    {[...new Map(
                                        suggestions.map((s) => [s.name.split(',')[0].trim(), s])
                                    ).values()].map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSuggestionSelect(suggestion)}
                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                                        >
                                            {suggestion.name.split(',')[0]}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Date Filter and Reset Button */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-3 bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200 w-full">
                            <div className="relative w-full sm:w-1/2">
                                <label className="text-xs font-medium text-gray-600">From Date</label>
                                <div className="flex items-center mt-1">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white transition-all duration-300"
                                    />
                                </div>
                            </div>
                            <div className="relative w-full sm:w-1/2">
                                <label className="text-xs font-medium text-gray-600">To Date</label>
                                <div className="flex items-center mt-1">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
                        >
                            <X className="w-4 h-4" />
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Small Filter Bar */}
                <div className="mt-4 sm:mt-6 flex justify-center">
                    <div className="flex gap-2 sm:gap-3 whitespace-nowrap bg-white p-2 sm:p-3 rounded-xl shadow-md border border-gray-200 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {filterBarOptions.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleFilterSelect(filter)}
                                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${selectedFilter === filter
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lazy-loaded Ad Slot 2 with blur placeholder */}
            <div className="container mx-auto px-4 py-2 mt-4">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKRYo54Q78Y6SiRQp1oKTN-Kh8atoF2z6Ilg&s"
                    alt="Ad Slot 2"
                    className="w-full h-16 sm:h-24 object-cover rounded-lg shadow-md"
                    loading="lazy"
                    style={{ filter: 'blur(4px)' }}
                    onLoad={(e) => e.target.style.filter = 'none'}
                />
            </div>

            <hr className="border-b border-gray-200 mx-4 md:mx-10 mb-5" />

            <div className="flex flex-col md:flex-row gap-6 mx-4 md:mx-10 mt-5">
                <div className="w-full md:w-3/4">
                    {locationError && (
                        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
                            {locationError}
                        </div>
                    )}
                    {eventsLoading || categoriesLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[...Array(8)].map((_, i) => (
                                <SkeletonLoader key={i} />
                            ))}
                        </div>
                    ) : (
                        <Suspense fallback={
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <SkeletonLoader key={i} />
                                ))}
                            </div>
                        }>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                                {currentEvents.length > 0 ? (
                                    currentEvents.map((event) => (
                                        <EventCard key={event._id} event={event} user={user} handleLike={handleLike} />
                                    ))
                                ) : (
                                    <NoEventsFound resetFilters={resetFilters} />
                                )}
                            </div>
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4 sm:mt-8 mb-4">
                                    <div className="flex items-center gap-2 flex-wrap">{getPaginationButtons()}</div>
                                </div>
                            )}
                        </Suspense>
                    )}
                </div>

                {/* Lazy-loaded Ad Slot 3 with blur placeholder */}
                <div className="w-full md:w-1/4 mt-4 md:mt-0">
                    <img
                        src="https://images.unsplash.com/photo-1580130857334-2f9b6d01d99d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFkdmVydGlzZW1lbnR8ZW58MHx8MHx8fDA%3D"
                        alt="Ad Slot 3"
                        className="w-full h-80 sm:h-80 object-cover rounded-lg shadow-md"
                        loading="lazy"
                        style={{ filter: 'blur(4px)' }}
                        onLoad={(e) => e.target.style.filter = 'none'}
                    />
                </div>
            </div>

            {/* Lazy-loaded Ad Slot 4, TopDestinations, and FAQ */}
            <div className="container mx-auto px-4 py-2 mt-6">
                <img
                    src="https://plus.unsplash.com/premium_photo-1681488183639-f38511a647ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWR2ZXJ0aXNlbWVudHxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Ad Slot 4"
                    className="w-full h-16 sm:h-24 object-cover rounded-lg shadow-md"
                    loading="lazy"
                    style={{ filter: 'blur(4px)' }}
                    onLoad={(e) => e.target.style.filter = 'none'}
                />
                <Suspense fallback={<ShimmerLoader />}>
                    <TopDestinations />
                </Suspense>
                <Suspense fallback={<ShimmerLoader />}>
                    <FAQ />
                </Suspense>
            </div>
        </div>
    );
}