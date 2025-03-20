// import axios from "axios";
// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom";
// import { BsArrowRightShort } from "react-icons/bs";
// import { BiLike } from "react-icons/bi";
// import BookmarkButton from "../UserPage/BookMarkEvent";
// import ShareEventModal from "../UserPage/ShareEvent";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import SkeletonLoader from "../layout/SkeletonLoader";
// import EventCarousel from "../layout/Carousel";
// import Title from '../layout/Title';
// import { Helmet } from "react-helmet-async";
// import LandingDescription from "../layout/LandingDescription";
// export default function IndexPage() {
//     const [events, setEvents] = useState([]);
//    const [loading, setLoading] = useState(true); // Add loading state
//     const user = useSelector((state) => state.auth.user);
//     const navigate = useNavigate()
//     const [selectedCategory, setSelectedCategory] = useState("All"); // New state for selected category
//     const [timeFilter, setTimeFilter] = useState("Upcoming"); // New state for time filter

//     //! Fetch events from the server ---------------------------------------------------------------
//     useEffect(() => {
//         axios
//             .get("http://localhost:5000/api/events/getEvent")
//             .then((response) => {
//                 setEvents(response.data);
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 console.error("Error fetching events:", error);
//                 setLoading(false);
//             });
//     }, []);


//     const handleLike = (eventId) => {
//         if (!user || !user._id) {  // Check if user is not logged in
//             navigate('/login'); // Redirect to login if not logged in
//             return;
//         }

//         const userId = user._id; // Get user ID from the context
//         console.log(' loggned User ID', userId);

//         axios
//             .post(`http://localhost:5000/api/events/userLike/${eventId}`, { userId }, { withCredentials: true })  // Pass userId in the body of the request
//             .then((response) => {
//                 setEvents((prevEvents) =>
//                     prevEvents.map((event) =>
//                         event._id === eventId
//                             ? { ...event, likes: response.data.likes }  // Update likes with the response from the backend
//                             : event
//                     )
//                 );
//             })
//             .catch((error) => {
//                 console.error("Error liking/unliking event", error);
//             });
//     };

//     const currentDate = new Date();

//     // Apply category and time filters
//     const filteredEvents = events.filter((event) => {
//         const eventDate = new Date(event.eventDate);
//         const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
//         const matchesTime =
//             (timeFilter === "Upcoming" && eventDate > currentDate) ||
//             (timeFilter === "Past" && eventDate < currentDate) ||
//             (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
//         return matchesCategory && matchesTime;
//     });

//     // Filter for online and free events that match the selected category and time filter
//     const onlineFreeEvents = events.filter(event => {
//         const eventDate = new Date(event.eventDate);
//         const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
//         const matchesTime =
//             (timeFilter === "Upcoming" && eventDate > currentDate) ||
//             (timeFilter === "Past" && eventDate < currentDate) ||
//             (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
//         return event.location?.name === "online" && event.ticketPrice === 0 && matchesCategory && matchesTime;
//     });

//     // Filter for online events that match the selected category and time filter
//     const onlineEvents = events.filter(event => {
//         const eventDate = new Date(event.eventDate);
//         const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
//         const matchesTime =
//             (timeFilter === "Upcoming" && eventDate > currentDate) ||
//             (timeFilter === "Past" && eventDate < currentDate) ||
//             (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
//         return event.location?.name === "online" && matchesCategory && matchesTime;
//     });

//     // Filter for free events that match the selected category and time filter
//     const FreeEvents = events.filter(event => {
//         const eventDate = new Date(event.eventDate);
//         const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
//         const matchesTime =
//             (timeFilter === "Upcoming" && eventDate > currentDate) ||
//             (timeFilter === "Past" && eventDate < currentDate) ||
//             (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
//         return event.ticketPrice === 0 && matchesCategory && matchesTime;
//     });


//     const categories = ["All", "music", "comedy", 'education', "workshop", "sport"];
//     const timeFilters = ["Upcoming", "Past", "Today"];

//     return (
//         <>
//             <LandingDescription />
            
//             <EventCarousel />

            

//             {/* Filters */}
//             <div className="mx-10 mt-5 z-50">
//                 <div className="flex flex-wrap gap-4">
//                                 <Title title={"Home Page"} />
                    
//                     <div className="flex gap-2">
//                         {categories.map((category) => (
//                             <button
//                                 key={category}
//                                 onClick={() => setSelectedCategory(category)}
//                                 className={`px-4 py-2 rounded-lg shadow-lg transition-all ${selectedCategory === category
//                                         ? "bg-blue-600 text-white"
//                                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                                     }`}
//                             >
//                                 {category}
//                             </button>
//                         ))}
//                     </div>

//                     <div className="flex gap-2">
//                         {timeFilters.map((filter) => (
//                             <button
//                                 key={filter}
//                                 onClick={() => setTimeFilter(filter)}
//                                 className={`px-4 py-2 rounded-lg shadow-lg transition-all ${timeFilter === filter
//                                         ? "bg-green-600 text-white"
//                                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                                     }`}
//                             >
//                                 {filter}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>



//             <div className="mt-1 flex flex-col">
//                 {/* <div className="hidden sm:block" >
//                     <div href="#" className="flex item-center inset-0">
//                         <img src="/assets/events23.jpg" alt="" className="w-full h-[300px]" />
//                     </div>
//                 </div> */}

//                 {/* Loading Skeleton */}
//                 {loading ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                         {[...Array(8)].map((_, i) => (
//                             <SkeletonLoader key={i} />
//                         ))}
//                     </div>
//                 ) : (


//                     <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5 ">

//                         {/*-------------------------- Checking whether there is a event or not-------------------  */}
//                         {filteredEvents.length > 0 && filteredEvents.map((event) => {
//                             // const eventDate = new Date(event.eventDate);
//                             // const currentDate = new Date();

//                             //! Check the event date is passed or not ---------------------------------------------------------------------------------------
//                             // if (eventDate > currentDate || eventDate.toDateString() === currentDate.toDateString()) {
//                             return (
//                                 <div className="bg-white rounded-xl relative " key={event._id}>
//                                     <div className="relative rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] object-fill aspect-16:9  mb-7">
//                                         {event.images && (
                         
                                            
//                                             <Link to={`/events/${event._id}`}>
//                                                 <img
//                                                     src={`http://localhost:5000${event.images[0]}`}
//                                                     alt={event.title}
//                                                     width="300"
//                                                     height="200"
//                                                     className="w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
//                                                 />
//                                             </Link>
//                                         )}

//                                         {/* to share event details */}


//                                         <Helmet>
//                                             <title>{event.title} | Event</title>
//                                             <meta name="description" content={event.description} />

//                                             {/* Open Graph (Facebook, LinkedIn) */}
//                                             <meta property="og:title" content={event.title} />
//                                             <meta property="og:description" content={event.description} />
//                                             <meta property="og:image" content={`http://localhost:5000${event.images[0]}`} />
//                                             <meta property="og:url" content={window.location.href} />
//                                             <meta property="og:type" content="website" />

//                                             {/* Twitter Card */}
//                                             <meta name="twitter:card" content="summary_large_image" />
//                                             <meta name="twitter:title" content={event.title} />
//                                             <meta name="twitter:description" content={event.description} />
//                                             <meta name="twitter:image" content={`http://localhost:5000${event.images[0]}`} />
//                                         </Helmet>
//                                         {/* Parent div containing Bookmark, Share, and Like button in a row */}
//                                         <div className="absolute flex items-center justify-between w-full px-4 -bottom-10">

//                                             {/* Bookmark Button - aligned left */}
//                                             <BookmarkButton
//                                                 eventId={event._id}
//                                                 isBookmarkedInitial={event.isBookmarked}
//                                             />

//                                             {/* Share Event Icon - centered */}
//                                             <ShareEventModal event={event} />

//                                             {/* Like Button - aligned right */}
//                                             <button onClick={() => handleLike(event._id)}>
//                                                 <BiLike className="w-auto h-12 lg:h-10 sm:h-12 md:h-10 bg-white p-2 rounded-full shadow-md transition-all hover:text-primary" />
//                                             </button>

//                                         </div>
//                                     </div>






//                                     <div className="m-2 grid gap-2">
//                                         <div className="flex justify-between items-center">
//                                             <h1 className="font-bold text-lg mt-2">
//                                                 {event.title ? event.title.toUpperCase() : "No Title"}
//                                             </h1>
//                                             <div className="flex gap-2 items-center mr-4 text-red-600"> <BiLike /> {event.likes}</div>
//                                         </div>


//                                         <div className="flex text-sm flex-nowrap justify-between text-primarydark font-bold mr-4">
//                                             <div>{event.eventDate.split("T")[0]}, {new Date(`1970-01-01T${event.eventTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
//                                         </div>

//                                         <div className="text-xs flex flex-col flex-wrap truncate-text">
//                                             {event.description?.length > 100
//                                                 ? `${event.description.slice(0, 100)}...`
//                                                 : event.description}
//                                         </div>
//                                         <div className="flex justify-between items-center my-2 mr-4">
//                                             <div className="text-sm text-primarydark ">Organized By: <br /><span className="font-bold">{event.organizedBy}</span></div>
//                                             <div className="text-sm text-primarydark">
//                                                 Created By: <br />
//                                                 <span className="font-semibold">
//                                                     {event.organizer && event.organizer.name ? event.organizer.name.toUpperCase() : "Unknown Creator"}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <Link to={`/events/${event._id}`} className="flex justify-center">
//                <button
//                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg transition duration-200 hover:bg-blue-700"
// >               {event.ticketPrice === 0 ? 'Get Ticket' : 'Buy Ticket'}< BsArrowRightShort className="w-6 h-6" /></button>
//                                         </Link>

//                                     </div>
//                                 </div>
//                             )

//                         }
//                         )}
//                     </div>
//                 )}
//             </div>
 

//             {/* Free Online Events Section */}
//             {onlineFreeEvents.length > 0 && (
//                 <div className="mx-10 my-10">
//                     <h2 className="text-2xl font-bold mb-5">Free Online Events</h2>
//                     <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
//                         {onlineFreeEvents.map((event) => (
//                             <div className="bg-white rounded-xl" key={event._id}>
//                                 <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] object-fill aspect-16:9">
//                                     {event.image && (
//                                         <img
//                                             src={`http://localhost:5000${event.image[0]}`}                                            alt={event.title}
//                                         //    src={event.image[0]} alt={event.title}
//                                             width="300"
//                                             height="200"
//                                             className="hover:scale-105 transition-transform duration-300 ease-in-out"
//                                         />
//                                     )}
//                                 </div>
//                                 <div className="m-2">
//                                     <h1 className="font-bold text-lg mt-2">{event.title}</h1>
//                                     <div className="text-sm text-primarydark font-bold mr-4">{event.eventDate.split("T")[0]}, {event.eventTime}</div>
//                                     <div className="text-xs flex flex-col flex-wrap truncate-text">
//                                         {event.description?.length > 100
//                                             ? `${event.description.slice(0, 100)}...`
//                                             : event.description}
//                                     </div>
//                                     <Link to={`/events/${event._id}`} className="flex justify-center mt-4">
//                                         <button className="primary flex items-center gap-2">View Details< BsArrowRightShort className="w-6 h-6" /></button>
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}








//             {/* Free Online Events Section */}
//             {onlineEvents.length > 0 && (
//                 <div className="mx-10 my-10">
//                     <h2 className="text-2xl font-bold mb-5"> Online Events</h2>
//                     <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
//                         {onlineEvents.map((event) => (
//                             <div className="bg-white rounded-xl" key={event._id}>
//                                 <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] object-fill aspect-16:9">
//                                     {event.image && (
//                                         <img
//                                             src={`http://localhost:5000${event.image[0]}`}                                            alt={event.title}
//                                         //    src={event.image[0]}
//                                         //    alt={event.title}
//                                             width="300"
//                                             height="200"
//                                             className="hover:scale-105 transition-transform duration-300 ease-in-out"
//                                         />
//                                     )}
//                                 </div>
//                                 <div className="m-2">
//                                     <h1 className="font-bold text-lg mt-2">{event.title}</h1>
//                                     <div className="text-sm text-primarydark font-bold mr-4">{event.eventDate.split("T")[0]}, {event.eventTime}</div>
//                                     <div className="text-xs flex flex-col flex-wrap truncate-text">
//                                         {event.description?.length > 100
//                                             ? `${event.description.slice(0, 100)}...`
//                                             : event.description}
//                                     </div>
//                                     <Link to={`/events/${event._id}`} className="flex justify-center mt-4">
//                                         <button className="primary flex items-center gap-2">View Details< BsArrowRightShort className="w-6 h-6" /></button>
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}






//             {/* Free Online Events Section */}
//             {FreeEvents.length > 0 && (
//                 <div className="mx-10 my-10">
//                     <h2 className="text-2xl font-bold mb-5">Free  Events</h2>
//                     <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
//                         {FreeEvents.map((event) => (
//                             <div className="bg-white rounded-xl" key={event._id}>
//                                 <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] object-fill aspect-16:9">
//                                     {event.image && (
//                                         <img
//                                             src={`http://localhost:5000${event.image[0]}`}                                            alt={event.title}
//                                             // src={event.image[0]}
//                                             // alt={event.title}
//                                             width="300"
//                                             height="200"
//                                             className="hover:scale-105 transition-transform duration-300 ease-in-out"
                                            
//                                         />
//                                     )}
//                                 </div>
//                                 <div className="m-2">
//                                     <h1 className="font-bold text-lg mt-2">{event.title}</h1>
//                                     <div className="text-sm text-primarydark font-bold mr-4">{event.eventDate.split("T")[0]}, {event.eventTime}</div>
//                                     <div className="text-xs flex flex-col flex-wrap truncate-text">
//                                         {event.description?.length > 100
//                                             ? `${event.description.slice(0, 100)}...`
//                                             : event.description}
//                                     </div>
//                                     <Link to={`/events/${event._id}`} className="flex justify-center mt-4">
//                                         <button className="primary flex items-center gap-2">View Details< BsArrowRightShort className="w-6 h-6" /></button>
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </>

//     )
// }





// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { BsArrowRightShort } from "react-icons/bs";
// import { BiLike } from "react-icons/bi";
// import BookmarkButton from "../UserPage/BookMarkEvent";
// import ShareEventModal from "../UserPage/ShareEvent";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import SkeletonLoader from "../layout/SkeletonLoader";
// import EventCarousel from "../layout/Carousel";
// import Title from '../layout/Title';
// import { Helmet } from "react-helmet-async";
// import LandingDescription from "../layout/LandingDescription";

// export default function IndexPage() {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const user = useSelector((state) => state.auth.user);
//     const navigate = useNavigate();
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [timeFilter, setTimeFilter] = useState("Upcoming");

//     useEffect(() => {
//         axios.get("http://localhost:5000/api/events/getEvent")
//             .then((response) => {
//                 setEvents(response.data);
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 console.error("Error fetching events:", error);
//                 setLoading(false);
//             });
//     }, []);

//     const handleLike = (eventId) => {
//         if (!user || !user._id) {
//             navigate('/login');
//             return;
//         }
//         axios.post(`http://localhost:5000/api/events/userLike/${eventId}`, { userId: user._id }, { withCredentials: true })
//             .then((response) => {
//                 setEvents((prevEvents) =>
//                     prevEvents.map((event) =>
//                         event._id === eventId ? { ...event, likes: response.data.likes } : event
//                     )
//                 );
//             })
//             .catch((error) => {
//                 console.error("Error liking/unliking event", error);
//             });
//     };

//     const currentDate = new Date();

//     const filteredEvents = events.filter((event) => {
//         const eventDate = new Date(event.eventDate);
//         const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
//         const matchesTime =
//             (timeFilter === "Upcoming" && eventDate > currentDate) ||
//             (timeFilter === "Past" && eventDate < currentDate) ||
//             (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
//         return matchesCategory && matchesTime;
//     });

//     const categories = ["music", "comedy", "education", "workshop", "sport"];
//     const timeFilters = ["Upcoming", "Past", "Today"];

//     const toggleCategory = (category) => {
//         setSelectedCategories((prev) =>
//             prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
//         );
//     };

//     return (
//         <>
//             <LandingDescription />
//             <EventCarousel />

//             <div className="flex gap-6 mx-10 mt-5">
//                 {/* Sidebar Filter */}
//                 <div className="w-1/4 bg-white shadow-lg p-4 rounded-lg">
//                     <Title title={"Filters"} />

//                     {/* Category Filter */}
//                     <h2 className="font-semibold text-lg mb-2">Category</h2>
//                     <div className="flex flex-col gap-2">
//                         {categories.map((category) => (
//                             <label key={category} className="flex items-center gap-2">
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedCategories.includes(category)}
//                                     onChange={() => toggleCategory(category)}
//                                     className="w-4 h-4"
//                                 />
//                                 {category.charAt(0).toUpperCase() + category.slice(1)}
//                             </label>
//                         ))}
//                     </div>

//                     {/* Time Filter */}
//                     <h2 className="font-semibold text-lg mt-4 mb-2">Time</h2>
//                     <div className="flex flex-col gap-2">
//                         {timeFilters.map((filter) => (
//                             <button
//                                 key={filter}
//                                 onClick={() => setTimeFilter(filter)}
//                                 className={`px-4 py-2 rounded-lg shadow-md ${timeFilter === filter
//                                     ? "bg-green-600 text-white"
//                                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                                     }`}
//                             >
//                                 {filter}
//                             </button>
//                         ))}
//                     </div>

//                     <button
//                         onClick={() => {
//                             setSelectedCategories([]);
//                             setTimeFilter("Upcoming");
//                         }}
//                         className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md w-full"
//                     >
//                         Clear Filters
//                     </button>
//                 </div>

//                 {/* Events List */}
//                 <div className="w-3/4">
//                     {loading ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                             {[...Array(8)].map((_, i) => <SkeletonLoader key={i} />)}
//                         </div>
//                     ) : (
//                         <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//                             {filteredEvents.length > 0 ? filteredEvents.map((event) => (
//                                 <div className="bg-white rounded-xl shadow-lg p-4 relative" key={event._id}>
//                                     <Link to={`/events/${event._id}`}>
//                                         <img
//                                             src={`http://localhost:5000${event.images[0]}`}
//                                             alt={event.title}
//                                             className="w-full h-48 object-cover rounded-md"
//                                         />
//                                     </Link>

//                                     <div className="mt-4">
//                                         <h1 className="font-bold text-lg">{event.title.toUpperCase()}</h1>
//                                         <p className="text-sm text-gray-600">{event.eventDate.split("T")[0]}</p>
//                                         <p className="text-xs text-gray-500 truncate">{event.description}</p>

//                                         <div className="flex justify-between items-center mt-3">
//                                             <button onClick={() => handleLike(event._id)} className="flex items-center gap-1 text-red-500">
//                                                 <BiLike className="w-5 h-5" /> {event.likes}
//                                             </button>
//                                             <BookmarkButton eventId={event._id} isBookmarkedInitial={event.isBookmarked} />
//                                             <ShareEventModal event={event} />
//                                         </div>

//                                         <Link to={`/events/${event._id}`} className="block mt-3">
//                                             <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                                                 {event.ticketPrice === 0 ? 'Get Ticket' : 'Buy Ticket'} <BsArrowRightShort className="w-6 h-6 inline" />
//                                             </button>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             )) : <p>No events found.</p>}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }




// // pages/IndexPage.jsx
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { BsArrowRightShort } from "react-icons/bs";
// import { BiLike } from "react-icons/bi";
// import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa"; // Added FaHeart for badge
// import BookmarkButton from "../UserPage/BookMarkEvent";
// import ShareEventModal from "../UserPage/ShareEvent";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import SkeletonLoader from "../layout/SkeletonLoader";
// import EventCarousel from "../layout/Carousel";
// import Title from "../layout/Title";
// // import { Helmet } from "react-helmet-async";
// // import LandingDescription from "../layout/LandingDescription";
// import CategoryTags from "../layout/CategoryTag";

// export default function IndexPage() {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const user = useSelector((state) => state.auth.user);
//     const navigate = useNavigate();
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [timeFilter, setTimeFilter] = useState("Upcoming");
//     const [currentPage, setCurrentPage] = useState(1);
//     const eventsPerPage = 8;

//     useEffect(() => {
//         axios
//             .get("http://localhost:5000/api/events/getEvent")
//             .then((response) => {
//                 setEvents(response.data);
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 console.error("Error fetching events:", error);
//                 setLoading(false);
//             });
//     }, []);

//     const handleLike = (eventId) => {
//         if (!user || !user._id) {
//             navigate("/login");
//             return;
//         }
//         axios
//             .post(
//                 `http://localhost:5000/api/events/userLike/${eventId}`,
//                 { userId: user._id },
//                 { withCredentials: true }
//             )
//             .then((response) => {
//                 setEvents((prevEvents) =>
//                     prevEvents.map((event) =>
//                         event._id === eventId ? { ...event, likes: response.data.likes } : event
//                     )
//                 );
//             })
//             .catch((error) => {
//                 console.error("Error liking/unliking event", error);
//             });
//     };

//     const currentDate = new Date();

//     const filteredEvents = events.filter((event) => {
//         const eventDate = new Date(event.eventDate);
//         const matchesCategory =
//             selectedCategories.length === 0 || selectedCategories.includes(event.category.toLowerCase());
//         const matchesTime =
//             (timeFilter === "Upcoming" && eventDate > currentDate) ||
//             (timeFilter === "Past" && eventDate < currentDate) ||
//             (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
//         return matchesCategory && matchesTime;
//     });

//     // Pagination Logic
//     const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
//     const startIndex = (currentPage - 1) * eventsPerPage;
//     const endIndex = startIndex + eventsPerPage;
//     const currentEvents = filteredEvents.slice(startIndex, endIndex);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//         window.scrollTo({ top: 0, behavior: "smooth" });
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
//                 className={`p-2 rounded-full ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"
//                     } transition-colors duration-200`}
//             >
//                 <FaChevronLeft className="w-5 h-5" />
//             </button>
//         );

//         for (let i = startPage; i <= endPage; i++) {
//             buttons.push(
//                 <button
//                     key={i}
//                     onClick={() => handlePageChange(i)}
//                     className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentPage === i
//                             ? "bg-blue-600 text-white shadow-md"
//                             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                 >
//                     {i}
//                 </button>
//             );
//         }

//         if (endPage < totalPages) {
//             if (endPage < totalPages - 1) {
//                 buttons.push(<span key="ellipsis-end" className="px-2">...</span>);
//             }
//             buttons.push(
//                 <button
//                     key={totalPages}
//                     onClick={() => handlePageChange(totalPages)}
//                     className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentPage === totalPages
//                             ? "bg-blue-600 text-white shadow-md"
//                             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
//                 className={`p-2 rounded-full ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"
//                     } transition-colors duration-200`}
//             >
//                 <FaChevronRight className="w-5 h-5" />
//             </button>
//         );

//         return buttons;
//     };

//     const categories = [
//         "music",
//         "nightlife",
//         "performing & visual arts",
//         "holidays",
//         "dating",
//         "hobbies",
//         "business",
//         "food & drink",
//     ];
//     const timeFilters = ["Upcoming", "Past", "Today"];

//     const toggleCategory = (category) => {
//         setSelectedCategories((prev) =>
//             prev.includes(category.toLowerCase())
//                 ? prev.filter((c) => c !== category.toLowerCase())
//                 : [...prev, category.toLowerCase()]
//         );
//         setCurrentPage(1); // Reset to first page when category changes
//     };

//     return (
//         <>
//             {/* <LandingDescription /> */}
//             <EventCarousel />

//             {/* Add CategoryTags Component */}
//             <div className="container mx-auto px-4">
//                 <CategoryTags
//                     categories={categories}
//                     selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : ""}
//                     onCategorySelect={toggleCategory}
//                 />
//             </div>

//             <div className="flex gap-6 mx-4 md:mx-10 mt-5">
//                 {/* Sidebar Filter */}
//                 <div className="w-full md:w-1/4 bg-white shadow-lg p-6 rounded-lg h-fit">
//                     <Title title="Filters" />

//                     {/* Category Filter */}
//                     <h2 className="font-semibold text-lg mb-2 text-gray-800">Category</h2>
//                     <div className="flex flex-col gap-2 mb-4">
//                         {categories.map((category) => (
//                             <label key={category} className="flex items-center gap-2">
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedCategories.includes(category.toLowerCase())}
//                                     onChange={() => toggleCategory(category)}
//                                     className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                 />
//                                 <span className="text-gray-700 capitalize">{category}</span>
//                             </label>
//                         ))}
//                     </div>

//                     {/* Time Filter */}
//                     <h2 className="font-semibold text-lg mb-2 text-gray-800">Time</h2>
//                     <div className="flex flex-col gap-2">
//                         {timeFilters.map((filter) => (
//                             <button
//                                 key={filter}
//                                 onClick={() => setTimeFilter(filter)}
//                                 className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 ${timeFilter === filter
//                                         ? "bg-green-600 text-white"
//                                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                                     }`}
//                             >
//                                 {filter}
//                             </button>
//                         ))}
//                     </div>

//                     <button
//                         onClick={() => {
//                             setSelectedCategories([]);
//                             setTimeFilter("Upcoming");
//                             setCurrentPage(1);
//                         }}
//                         className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md w-full hover:bg-red-600 transition-colors duration-200"
//                     >
//                         Clear Filters
//                     </button>
//                 </div>

//                 {/* Events List */}
//                 <div className="w-full md:w-3/4">
//                     {loading ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                             {[...Array(8)].map((_, i) => (
//                                 <SkeletonLoader key={i} />
//                             ))}
//                         </div>
//                     ) : (
//                         <>
//                             <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//                                 {currentEvents.length > 0 ? (
//                                     currentEvents.map((event) => (
//                                         <div
//                                             className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
//                                             key={event._id}
//                                         >
//                                             <Link to={`/events/${event._id}`}>
//                                                 <div className="relative">
//                                                     <img
//                                                         src={`http://localhost:5000${event.images[0]}`}
//                                                         alt={event.title}
//                                                         className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
//                                                     />
//                                                     {event.ticketPrice === 0 && (
//                                                         <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
//                                                             <FaHeart className="w-3 h-3" /> Free
//                                                         </div>
//                                                     )}
//                                                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
//                                                         <h3 className="text-white text-lg font-bold truncate">{event.title.toUpperCase()}</h3>
//                                                     </div>
//                                                 </div>
//                                             </Link>

//                                             <div className="p-4">
//                                                 <p className="text-sm text-gray-600 mb-2">{event.eventDate.split("T")[0]}</p>
//                                                 <p className="text-xs text-gray-500 truncate mb-4">{event.description}</p>

//                                                 <div className="flex justify-between items-center mb-4">
//                                                     <button
//                                                         aria-label="Like event"
//                                                         onClick={() => handleLike(event._id)}
//                                                         className="flex items-center gap-1 text-blue-500 hover:blue-red-600 transition-colors"
//                                                     >
//                                                         <BiLike className="w-5 h-5" /> {event.likes}
//                                                     </button>
//                                                     <div className="flex items-center gap-4">
//                                                         <BookmarkButton eventId={event._id} isBookmarkedInitial={event.isBookmarked} />
//                                                         <ShareEventModal event={event} />
//                                                     </div>
//                                                 </div>

//                                                 <Link to={`/events/${event._id}`} className="block">
//                                                     <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
//                                                         {event.ticketPrice === 0 ? "Get Ticket" : "Buy Ticket"}
//                                                         <BsArrowRightShort className="w-5 h-5" />
//                                                     </button>
//                                                 </Link>
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p className="col-span-full text-center text-gray-500">No events found.</p>
//                                 )}
//                             </div>

//                             {totalPages > 1 && (
//                                 <div className="flex justify-center mt-8">
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



import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import BookmarkButton from "../UserPage/BookMarkEvent";
import ShareEventModal from "../UserPage/ShareEvent";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../layout/SkeletonLoader";
import EventCarousel from "../layout/Carousel";
import Title from "../layout/Title";
import { MdLocationPin } from "react-icons/md";

import CategoryTags from "../layout/CategoryTag";
import { Users, Calendar } from "lucide-react";

// New EventCard Component
function EventCard({ event, user, handleLike }) {
    const totalBooked = event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.booked, 0) || 0;
    return (
        <div className="bg-white w-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
            <Link to={`/events/${event._id}`}>
                <div className="relative">
                    <img  
                        src={`http://localhost:5000${event.images[0]}`}
                        alt={event.title}
                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {event.ticketPrice === 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                            <FaHeart className="w-3 h-3" /> Free
                        </div>
                    )}
                   
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Event Title */}
                <Link to={`/events/${event._id}`}>
                    <h3 className="text-lg font-bold text-gray-800 truncate">{event.title.toUpperCase()}</h3>
                </Link>

                {/* Event Details */}
                <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-6 h-6 text-gray-700" />
                        {new Date(event.eventDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}{" "}
                        at {new Date(event.eventDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MdLocationPin className="w-6 h-6 text-blue-600" />
                        {event.location?.name?.split(", ")[0]}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-600" />
                        <p className=" ">{ totalBooked} Tickets Booked</p>
                    </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <button
                        aria-label="Like event"
                        onClick={() => handleLike(event._id)}
                        className="flex items-center gap-1 text-blue-500 hover:blue-red-600 transition-colors"
                    >
                        <BiLike className="w-5 h-5" /> {event.likes}
                    </button>
                    <div className="flex items-center gap-4">
                        <BookmarkButton eventId={event._id} isBookmarkedInitial={event.isBookmarked} />
                        <ShareEventModal event={event} />
                    </div>
                </div>

                <Link to={`/events/${event._id}`} className="block">
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                        {event.ticketPrice === 0 ? "Get Ticket" : "Buy Ticket"}
                        <BsArrowRightShort className="w-5 h-5" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default function IndexPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [timeFilter, setTimeFilter] = useState("Upcoming");
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/events/getEvent")
            .then((response) => {
                setEvents(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
                setLoading(false);
            });
    }, []);

    const handleLike = (eventId) => {
        if (!user || !user._id) {
            navigate("/login");
            return;
        }
        axios
            .post(
                `http://localhost:5000/api/events/userLike/${eventId}`,
                { userId: user._id },
                { withCredentials: true }
            )
            .then((response) => {
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event._id === eventId ? { ...event, likes: response.data.likes } : event
                    )
                );
            })
            .catch((error) => {
                console.error("Error liking/unliking event", error);
            });
    };

    const currentDate = new Date();

    const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.eventDate);
        const matchesCategory =
            selectedCategories.length === 0 || selectedCategories.includes(event.category.toLowerCase());
        const matchesTime =
            (timeFilter === "Upcoming" && eventDate > currentDate) ||
            (timeFilter === "Past" && eventDate < currentDate) ||
            (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
        return matchesCategory && matchesTime;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const currentEvents = filteredEvents.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                className={`p-2 rounded-full ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"} transition-colors duration-200`}
            >
                <FaChevronLeft className="w-5 h-5" />
            </button>
        );

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2  text-sm font-medium transition-all duration-200 ${currentPage === i ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(<span key="ellipsis-end" className="px-2">...</span>);
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentPage === totalPages ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
                className={`p-2 rounded-full ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"} transition-colors duration-200`}
            >
                <FaChevronRight className="w-5 h-5" />
            </button>
        );

        return buttons;
    };

    const categories = [
        "music",
        "nightlife",
        "performing & visual arts",
        "holidays",
        "dating",
        "hobbies",
        "business",
        "food & drink",
    ];
    const timeFilters = ["Upcoming", "Past", "Today"];

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category.toLowerCase())
                ? prev.filter((c) => c !== category.toLowerCase())
                : [...prev, category.toLowerCase()]
        );
        setCurrentPage(1);
    };

    return (
        <>
            <EventCarousel />
            <div className="container mx-auto px-4">
                <CategoryTags
                    categories={categories}
                    selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : ""}
                    onCategorySelect={toggleCategory}
                />
            </div>

            <div className="flex gap-6 mx-4 md:mx-10 mt-5  ">
                <div className="w-full md:w-1/4 bg-white shadow-lg p-6 rounded-lg h-fit border-gray-400 border-2">
                    <Title title="Filters" />
                    <h2 className="font-semibold text-lg mb-2 text-gray-800">Category</h2>
                    <div className="flex flex-col gap-2 mb-4">
                        {categories.map((category) => (
                            <label key={category} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.toLowerCase())}
                                    onChange={() => toggleCategory(category)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-gray-700 capitalize">{category}</span>
                            </label>
                        ))}
                    </div>
                    <h2 className="font-semibold text-lg mb-2 text-gray-800">Time</h2>
                    <div className="flex flex-col gap-2">
                        {timeFilters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 ${timeFilter === filter ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setSelectedCategories([]);
                            setTimeFilter("Upcoming");
                            setCurrentPage(1);
                        }}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md w-full hover:bg-red-600 transition-colors duration-200"
                    >
                        Clear Filters
                    </button>
                </div>

                <div className="w-full md:w-3/4">
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
                                        <EventCard
                                            key={event._id}
                                            event={event}
                                            user={user}
                                            handleLike={handleLike}
                                        />
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-500">No events found.</p>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
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