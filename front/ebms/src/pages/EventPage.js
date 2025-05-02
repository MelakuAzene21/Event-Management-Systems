
// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import SkeletonLoader from '../layout/SkeletonLoader';
// import EventCarousel from '../layout/Carousel';
// import Title from '../layout/Title';
// import CategoryTags from '../layout/CategoryTag';
// import EventCard from '../components/EventCard';
// import NoEventsFound from '../components/NoEventsFound';
// import { ArrowLeft, ArrowRight } from 'lucide-react';
// import { useGetAllEventsQuery,useLikeEventMutation } from '../features/api/eventApi';
// export default function IndexPage() {
   
//     const user = useSelector((state) => state.auth.user);
//     const navigate = useNavigate();
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [timeFilter, setTimeFilter] = useState('Upcoming');
//     const [currentPage, setCurrentPage] = useState(1);
//     const eventsPerPage = 6;

//     const { data: events = [], isLoading: loading } = useGetAllEventsQuery();
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
//             selectedCategories.length === 0 || selectedCategories.includes(event.category.toLowerCase());
//         const matchesTime =
//             (timeFilter === 'Upcoming' && eventDate > currentDate) ||
//             (timeFilter === 'Past' && eventDate < currentDate) ||
//             (timeFilter === 'Today' && eventDate.toDateString() === currentDate.toDateString());
//         return matchesCategory && matchesTime;
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
//                 className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === 1
//                         ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                     } flex items-center gap-1 shadow-md`}
//             >
//                 <ArrowLeft className="w-4 h-4" />
//                 <span>Previous</span>
//             </button>
//         );

//         for (let i = startPage; i <= endPage; i++) {
//             buttons.push(
//                 <button
//                     key={i}
//                     onClick={() => handlePageChange(i)}
//                     className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === i
//                             ? 'bg-blue-500 text-white border-2 border-blue-500'
//                             : 'bg-gray-400 text-white border-2 border-blue-500 hover:bg-blue-600'
//                         }`}
//                 >
//                     {i}
//                 </button>
//             );
//         }

//         if (endPage < totalPages) {
//             if (endPage < totalPages - 1) {
//                 buttons.push(
//                     <span key="ellipsis-end" className="px-2 text-gray-700">
//                         ...
//                     </span>
//                 );
//             }
//             buttons.push(
//                 <button
//                     key={totalPages}
//                     onClick={() => handlePageChange(totalPages)}
//                     className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === totalPages
//                             ? 'bg-blue-500 text-white border-2 border-blue-500'
//                             : 'bg-black text-white border-2 border-blue-500 hover:bg-blue-600'
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
//                 className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === totalPages
//                         ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                     } flex items-center gap-1 shadow-md`}
//             >
//                 <span>Next</span>
//                 <ArrowRight className="w-4 h-4" />
//             </button>
//         );

//         return buttons;
//     };

//     const categories = [
//         'music',
//         'nightlife',
//         'performing & visual arts',
//         'holidays',
//         'dating',
//         'hobbies',
//         'business',
//         'food & drink',
//     ];
//     const timeFilters = ['Upcoming', 'Past', 'Today'];

//     const toggleCategory = (category) => {
//         setSelectedCategories((prev) =>
//             prev.includes(category.toLowerCase())
//                 ? prev.filter((c) => c !== category.toLowerCase())
//                 : [...prev, category.toLowerCase()]
//         );
//         setCurrentPage(1);
//     };

//     const resetFilters = () => {
//         setSelectedCategories([]);
//         setTimeFilter('Upcoming');
//         setCurrentPage(1);
//     };

//     return (
//         <>
//             <EventCarousel />
//             <div className="container mx-auto px-4">
//                 <CategoryTags
//                     categories={categories}
//                     selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : ''}
//                     onCategorySelect={toggleCategory}
//                 />
//             </div>

//             <div className="flex gap-6 mx-4 md:mx-10 mt-5">
//                 {/* Filter Sidebar */}
//                 <div className="hidden md:block w-full md:w-1/5 bg-white shadow-lg p-5 rounded-xl h-fit border-gray-300 border">
//                     <Title title="Filters" />

//                     {/* Category Filter */}
//                     <div className="mb-6">
//                         <h2 className="font-semibold text-base text-gray-800 mb-3">Category</h2>
//                         <div className="flex flex-col gap-2">
//                             {categories.map((category) => (
//                                 <label key={category} className="flex items-center gap-2 cursor-pointer">
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedCategories.includes(category.toLowerCase())}
//                                         onChange={() => toggleCategory(category)}
//                                         className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
//                                     />
//                                     <span className="text-gray-700 text-sm capitalize transition-colors duration-200 hover:text-blue-600">
//                                         {category}
//                                     </span>
//                                 </label>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Time Filter */}
//                     <div className="mb-6">
//                         <h2 className="font-semibold text-base text-gray-800 mb-3">Time</h2>
//                         <div className="flex gap-2">
//                             {timeFilters.map((filter) => (
//                                 <button
//                                     key={filter}
//                                     onClick={() => setTimeFilter(filter)}
//                                     className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm ${timeFilter === filter
//                                             ? 'bg-blue-600 text-white shadow-md'
//                                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
//                                         }`}
//                                 >
//                                     {filter}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Clear Filters Button */}
//                     <button
//                         onClick={resetFilters}
//                         className="w-full py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 text-sm font-medium"
//                     >
//                         Clear Filters
//                     </button>
//                 </div>

//                 {/* Main Content */}
//                 <div className="w-full md:w-4/5">
//                     {loading ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                             {[...Array(8)].map((_, i) => (
//                                 <SkeletonLoader key={i} />
//                             ))}
//                         </div>
//                     ) : (
//                         <>
//                             <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
//                                 {currentEvents.length > 0 ? (
//                                     currentEvents.map((event) => (
//                                         <EventCard key={event._id} event={event} user={user} handleLike={handleLike} />
//                                     ))
//                                 ) : (
//                                     <NoEventsFound resetFilters={resetFilters} />
//                                 )}
//                             </div>

//                             {totalPages > 1 && (
//                                 <div className="flex justify-center mt-8 mb-4">
//                                     <div className="flex items-center gap-2">{getPaginationButtons()}</div>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }






// import { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import SkeletonLoader from '../layout/SkeletonLoader';
// import EventCarousel from '../layout/Carousel';
// import Title from '../layout/Title';
// import CategoryTags from '../layout/CategoryTag';
// import EventCard from '../components/EventCard';
// import NoEventsFound from '../components/NoEventsFound';
// import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
// import { useGetAllEventsQuery, useLikeEventMutation } from '../features/api/eventApi';

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
//     const eventsPerPage = 6;
//     const suggestionsRef = useRef(null);

//     // Get user's location on mount
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setLocation({ latitude, longitude });
//                     setPlaceholderText(`Current Location (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)})`);
//                     console.log('User location:', { latitude, longitude });
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

//     // Fetch events with location
//     const { data: events = [], isLoading: loading } = useGetAllEventsQuery(
//         {
//             latitude: location?.latitude,
//             longitude: location?.longitude,
//         },
//         { skip: !placeholderText } // Skip query until placeholder is set
//     );
//     console.log('Fetched nearby Events:', events);
//     const [likeEvent] = useLikeEventMutation();

//     // Extract unique locations from events for autocomplete
//     const eventLocations = [...new Set(
//         events
//             .filter(event => event.location?.coordinates && event.location.coordinates.length === 2)
//             .map(event => ({
//                 name: event.location.city || `Lat: ${event.location.coordinates[1]}, Lon: ${event.location.coordinates[0]}`,
//                 latitude: event.location.coordinates[1],
//                 longitude: event.location.coordinates[0]
//             }))
//     )];

//     // Handle location input and suggestions
//     const handleLocationInput = (value) => {
//         setLocationInput(value);
//         if (value === '') {
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

//     // Clear input on focus to allow typing
//     const handleInputFocus = () => {
//         setLocationInput('');
//     };

//     // Handle click outside to close suggestions
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
//                 setSuggestions([]);
//                 if (!locationInput) {
//                     setLocationInput('');
//                 }
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [locationInput]);

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
//             selectedCategories.length === 0 || selectedCategories.includes(event.category.toLowerCase());
//         const matchesTime =
//             (timeFilter === 'Upcoming' && eventDate > currentDate) ||
//             (timeFilter === 'Past' && eventDate < currentDate) ||
//             (timeFilter === 'Today' && eventDate.toDateString() === currentDate.toDateString());
//         return matchesCategory && matchesTime;
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
//                 className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === 1
//                     ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                     } flex items-center gap-1 shadow-md`}
//             >
//                 <ArrowLeft className="w-4 h-4" />
//                 <span>Previous</span>
//             </button>
//         );

//         for (let i = startPage; i <= endPage; i++) {
//             buttons.push(
//                 <button
//                     key={i}
//                     onClick={() => handlePageChange(i)}
//                     className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === i
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
//                 buttons.push(
//                     <span key="ellipsis-end" className="px-2 text-gray-700">
//                         ...
//                     </span>
//                 );
//             }
//             buttons.push(
//                 <button
//                     key={totalPages}
//                     onClick={() => handlePageChange(totalPages)}
//                     className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === totalPages
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
//                 className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === totalPages
//                     ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                     } flex items-center gap-1 shadow-md`}
//             >
//                 <span>Next</span>
//                 <ArrowRight className="w-4 h-4" />
//             </button>
//         );

//         return buttons;
//     };

//     const categories = [
//         'music',
//         'nightlife',
//         'performing & visual arts',
//         'holidays',
//         'dating',
//         'hobbies',
//         'business',
//         'food & drink',
//     ];
//     const timeFilters = ['Upcoming', 'Past', 'Today'];

//     const toggleCategory = (category) => {
//         setSelectedCategories((prev) =>
//             prev.includes(category.toLowerCase())
//                 ? prev.filter((c) => c !== category.toLowerCase())
//                 : [...prev, category.toLowerCase()]
//         );
//         setCurrentPage(1);
//     };

//     const resetFilters = () => {
//         setSelectedCategories([]);
//         setTimeFilter('Upcoming');
//         setCurrentPage(1);
//     };

//     return (
//         <>
//             <EventCarousel />

//             <div className="container mx-auto px-4">
//                 <CategoryTags
//                     categories={categories}
//                     selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : ''}
//                     onCategorySelect={toggleCategory}
//                 />
//             </div>

//             {/* Location Filter Bar */}
//             <div className="container mx-auto px-4 py-4 ml-4 md:ml-10 mt-5   flex items-center justify-center">
//                 <div className="flex items-center gap-3">
//                     <span className="text-lg font-semibold text-gray-800">Browsing events in</span>
//                     <div className="relative w-48">
//                         <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
//                             <MapPin className="w-5 h-5 text-gray-500 mr-2" />
//                             <input
//                                 type="text"
//                                 value={locationInput}
//                                 onChange={(e) => handleLocationInput(e.target.value)}
//                                 onFocus={handleInputFocus}
//                                 className="w-full outline-none text-gray-700 text-sm"
//                                 placeholder={placeholderText}
//                             />
//                         </div>
//                         {suggestions.length > 0 && (
//                             <ul
//                                 ref={suggestionsRef}
//                                 className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto"
//                             >
//                                 {suggestions.map((suggestion, index) => (
//                                     <li
//                                         key={index}
//                                         onClick={() => handleSuggestionSelect(suggestion)}
//                                         className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
//                                     >
//                                         {suggestion.name}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <hr className="border-b border-gray-200 mx-4 md:mx-10 mb-5" />
//             <div className="flex gap-6 mx-4 md:mx-10 mt-5">
//                 {/* Filter Sidebar */}
//                 <div className="hidden md:block w-full md:w-1/5 bg-white shadow-lg p-5 rounded-xl h-fit border-gray-300 border">
//                     <Title title="Filters" />

//                     {/* Category Filter */}
//                     <div className="mb-6">
//                         <h2 className="font-semibold text-base text-gray-800 mb-3">Category</h2>
//                         <div className="flex flex-col gap-2">
//                             {categories.map((category) => (
//                                 <label key={category} className="flex items-center gap-2 cursor-pointer">
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedCategories.includes(category.toLowerCase())}
//                                         onChange={() => toggleCategory(category)}
//                                         className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
//                                     />
//                                     <span className="text-gray-700 text-sm capitalize transition-colors duration-200 hover:text-blue-600">
//                                         {category}
//                                     </span>
//                                 </label>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Time Filter */}
//                     <div className="mb-6">
//                         <h2 className="font-semibold text-base text-gray-800 mb-3">Time</h2>
//                         <div className="flex gap-2">
//                             {timeFilters.map((filter) => (
//                                 <button
//                                     key={filter}
//                                     onClick={() => setTimeFilter(filter)}
//                                     className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm ${timeFilter === filter
//                                         ? 'bg-blue-600 text-white shadow-md'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
//                                         }`}
//                                 >
//                                     {filter}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Clear Filters Button */}
//                     <button
//                         onClick={resetFilters}
//                         className="w-full py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 text-sm font-medium"
//                     >
//                         Clear Filters
//                     </button>
//                 </div>

//                 {/* Main Content */}
//                 <div className="w-full md:w-4/5">
//                     {locationError && (
//                         <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
//                             {locationError}
//                         </div>
//                     )}
//                     {loading ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                             {[...Array(8)].map((_, i) => (
//                                 <SkeletonLoader key={i} />
//                             ))}
//                         </div>
//                     ) : (
//                         <>
//                             <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
//                                 {currentEvents.length > 0 ? (
//                                     currentEvents.map((event) => (
//                                         <EventCard key={event._id} event={event} user={user} handleLike={handleLike} />
//                                     ))
//                                 ) : (
//                                     <NoEventsFound resetFilters={resetFilters} />
//                                 )}
//                             </div>

//                             {totalPages > 1 && (
//                                 <div className="flex justify-center mt-8 mb-4">
//                                     <div className="flex items-center gap-2">{getPaginationButtons()}</div>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }


import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../layout/SkeletonLoader';
import EventCarousel from '../layout/Carousel';
import Title from '../layout/Title';
import CategoryTags from '../layout/CategoryTag';
import EventCard from '../components/EventCard';
import NoEventsFound from '../components/NoEventsFound';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { useGetAllEventsQuery, useLikeEventMutation } from '../features/api/eventApi';

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
    const [selectedFilter, setSelectedFilter] = useState('ALL'); // State for filter bar
    const eventsPerPage = 6;
    const suggestionsRef = useRef(null);

    // Get user's location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    setPlaceholderText(`Current Location (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)})`);
                    console.log('User location:', { latitude, longitude });
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

    // Fetch events with location
    const { data: events = [], isLoading: loading } = useGetAllEventsQuery(
        {
            latitude: location?.latitude,
            longitude: location?.longitude,
        },
        { skip: !placeholderText }
    );

    // Extract unique location names from events for autocomplete
    const eventLocations = [...new Set(
        events
            .filter(event => event.location?.coordinates && event.location.coordinates.length === 2 && event.location.name)
            .map(event => ({
                name: event.location.name,
                latitude: event.location.coordinates[1],
                longitude: event.location.coordinates[0]
            }))
    )];

    // Handle location input and suggestions
    const handleLocationInput = (value) => {
        setLocationInput(value);
        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = eventLocations.filter((loc) =>
            loc.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
    };

    const handleSuggestionSelect = (suggestion) => {
        setLocationInput(suggestion.name);
        setLocation({ latitude: suggestion.latitude, longitude: suggestion.longitude });
        setSuggestions([]);
    };

    // Clear input on focus to allow typing
    const handleInputFocus = () => {
        setLocationInput('');
        setSuggestions(eventLocations);
    };

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setSuggestions([]);
                if (!locationInput) {
                    setLocationInput('');
                }
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

    // Update filteredEvents to consider the selected filter from the filter bar
    const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.eventDate);
        const matchesCategory =
            selectedCategories.length === 0 || selectedCategories.includes(event.category.toLowerCase());

        // Apply filter bar logic
        let matchesFilter = true;
        if (selectedFilter === 'For you' && user) {
            matchesFilter = event.category.toLowerCase() === user.interests?.toLowerCase();
        } else if (selectedFilter === 'Today') {
            matchesFilter = eventDate.toDateString() === currentDate.toDateString();
        } else if (selectedFilter === 'This week') {
            const currentDay = currentDate.getDay();
            const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1; // Days since Monday (Sunday = 6)
            const startOfWeek = new Date(currentDate);
            startOfWeek.setHours(0, 0, 0, 0); // Start of Monday
            startOfWeek.setDate(currentDate.getDate() - daysSinceMonday);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
            endOfWeek.setHours(23, 59, 59, 999); // End of Sunday
            matchesFilter = eventDate >= startOfWeek && eventDate <= endOfWeek;
        } else if (selectedFilter === 'This month') {
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            const eventMonth = eventDate.getMonth();
            const eventYear = eventDate.getFullYear();
            matchesFilter = eventMonth === currentMonth && eventYear === currentYear;
        } else if (selectedFilter === 'Free') {
            matchesFilter = event.isFree === true;
        } else if (selectedFilter === 'Music') {
            matchesFilter = event.category.toLowerCase() === 'music';
        } else if (selectedFilter === 'Food & Drink') {
            matchesFilter = event.category.toLowerCase() === 'food & drink';
        } else if (selectedFilter === 'Charity & Causes') {
            matchesFilter = event.category.toLowerCase() === 'charity & causes';
        }

        const matchesTime =
            timeFilter === 'Upcoming' ? eventDate >= currentDate :
                timeFilter === 'Past' ? eventDate < currentDate :
                    timeFilter === 'Today' ? eventDate.toDateString() === currentDate.toDateString() :
                        true; // Default case for other time filters

        return matchesCategory && matchesTime && matchesFilter;
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
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    } flex items-center gap-1 shadow-md`}
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
            </button>
        );

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === i
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
                buttons.push(
                    <span key="ellipsis-end" className="px-2 text-gray-700">
                        ...
                    </span>
                );
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === totalPages
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
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    } flex items-center gap-1 shadow-md`}
            >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        );

        return buttons;
    };

    const categories = [
        'music',
        'nightlife',
        'performing & visual arts',
        'holidays',
        'dating',
        'hobbies',
        'business',
        'food & drink',
        'workshop',
    ];
    const timeFilters = ['Upcoming', 'Past', 'Today'];
    const filterBarOptions = [
        'ALL',
        'Today',
        'This week',
        'This month',
        'Free',
        'Music',
        'Food & Drink',
        'Charity & Causes'
    ];

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        if (filter === 'Free') {
            setSelectedCategories([]); // Reset categories for Free filter to show all free events
        }
        setCurrentPage(1);
    };

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category.toLowerCase())
                ? prev.filter((c) => c !== category.toLowerCase())
                : [...prev, category.toLowerCase()]
        );
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setTimeFilter('Upcoming');
        setSelectedFilter('ALL');
        setCurrentPage(1);
    };

    return (
        <>
            <EventCarousel />
            <div className="container mx-auto px-4">
                <CategoryTags
                    categories={categories}
                    selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : ''}
                    onCategorySelect={toggleCategory}
                />
            </div>
            {/* Location Filter Bar */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-800">Browsing events in</span>
                    <div className="relative w-48">
                        <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => handleLocationInput(e.target.value)}
                                onFocus={handleInputFocus}
                                className="w-full outline-none text-gray-700 text-sm"
                                placeholder={placeholderText}
                            />
                        </div>
                        {suggestions.length > 0 && (
                            <ul
                                ref={suggestionsRef}
                                className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto"
                            >
                                {[...new Map(
                                    suggestions.map((s) => [s.name.split(',')[0].trim(), s]) // key: first part
                                ).values()].map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionSelect(suggestion)}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
                                    >
                                        {suggestion.name.split(',')[0]}
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                </div>
            </div>

            {/* Small Filter Bar */}
            <div className="container mx-auto px-4 mb-12 overflow-x-auto flex items-center justify-center">
                <div className="flex gap-3 whitespace-nowrap bg-gradient-to-r from-blue-50 to-gray-50 p-3 rounded-xl shadow-md border border-gray-200">
                    {filterBarOptions.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterSelect(filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${selectedFilter === filter
                                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <hr className="border-b border-gray-200 mx-4 md:mx-10 mb-5" />

            <div className="flex gap-6 mx-4 md:mx-10 mt-5">
                {/* Filter Sidebar */}
                <div className="hidden md:block w-full md:w-1/5 bg-white shadow-lg p-5 rounded-xl h-fit border-gray-300 border">
                    <Title title="Filters" />

                    {/* Category Filter */}
                    <div className="mb-6">
                        <h2 className="font-semibold text-base text-gray-800 mb-3">Category</h2>
                        <div className="flex flex-col gap-2">
                            {categories.map((category) => (
                                <label key={category} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.toLowerCase())}
                                        onChange={() => toggleCategory(category)}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                                    />
                                    <span className="text-gray-700 text-sm capitalize transition-colors duration-200 hover:text-blue-600">
                                        {category}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Time Filter */}
                    <div className="mb-6">
                        <h2 className="font-semibold text-base text-gray-800 mb-3">Time</h2>
                        <div className="flex gap-2">
                            {timeFilters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setTimeFilter(filter)}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm ${timeFilter === filter
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <button
                        onClick={resetFilters}
                        className="w-full py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 text-sm font-medium"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-4/5">
                    {locationError && (
                        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                            {locationError}
                        </div>
                    )}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <SkeletonLoader key={i} />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                                {currentEvents.length > 0 ? (
                                    currentEvents.map((event) => (
                                        <EventCard key={event._id} event={event} user={user} handleLike={handleLike} />
                                    ))
                                ) : (
                                    <NoEventsFound resetFilters={resetFilters} />
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8 mb-4">
                                    <div className="flex items-center gap-2">{getPaginationButtons()}</div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}