
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { BsArrowRightShort } from "react-icons/bs";
// import { BiLike } from "react-icons/bi";
// import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
// import BookmarkButton from "../UserPage/BookMarkEvent";
// import ShareEventModal from "../UserPage/ShareEvent";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import SkeletonLoader from "../layout/SkeletonLoader";
// import EventCarousel from "../layout/Carousel";
// import Title from "../layout/Title";
// import { MdEventBusy, MdLocationPin } from "react-icons/md";

// import CategoryTags from "../layout/CategoryTag";
// import { Users, Calendar } from "lucide-react";

// // New EventCard Component
// function EventCard({ event, user, handleLike }) {
//     const totalBooked = event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.booked, 0) || 0;
//     return (
//         <div className="bg-white w-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
//             <Link to={`/events/${event._id}`}>
//                 <div className="relative">
//                     <img
//                         src={`http://localhost:5000${event.images[0]}`}
//                         alt={event.title}
//                         className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
//                     />
//                     {event.ticketPrice === 0 && (
//                         <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
//                             <FaHeart className="w-3 h-3" /> Free
//                         </div>
//                     )}
                   
//                 </div>
//             </Link>

//             {/* Content Section */}
//             <div className="p-4 flex flex-col flex-grow">
//                 {/* Event Title */}
//                 <Link to={`/events/${event._id}`}>
//                     <h3 className="text-lg font-bold text-gray-800 truncate">{event.title.toUpperCase()}</h3>
//                 </Link>

//                 {/* Event Details */}
//                 <div className="mt-2 space-y-1">
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                         <Calendar className="w-6 h-6 text-gray-700" />
//                         {new Date(event.eventDate).toLocaleDateString("en-US", {
//                             weekday: "long",
//                             month: "long",
//                             day: "numeric",
//                             year: "numeric",
//                         })}{" "}
//                         at {new Date(event.eventDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                         <MdLocationPin className="w-6 h-6 text-blue-600" />
//                         {event.location?.name?.split(", ")[0]}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                         <Users className="w-4 h-4 text-gray-600" />
//                         <p className=" ">{ totalBooked} Tickets Booked</p>
//                     </p>
//                 </div>
//                 <div className="flex justify-between items-center mb-4">
//                     <button
//                         aria-label="Like event"
//                         onClick={() => handleLike(event._id)}
//                         className="flex items-center gap-1 text-blue-500 hover:blue-red-600 transition-colors"
//                     >
//                         <BiLike className="w-5 h-5" /> {event.likes}
//                     </button>
//                     <div className="flex items-center gap-4">
//                         <BookmarkButton eventId={event._id} isBookmarkedInitial={event.isBookmarked} />
//                         <ShareEventModal event={event} />
//                     </div>
//                 </div>

//                 <Link to={`/events/${event._id}`} className="block">
//                     <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
//                         {event.ticketPrice === 0 ? "Get Ticket" : "Buy Ticket"}
//                         <BsArrowRightShort className="w-5 h-5" />
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     );
// }

// // New NoEventsFound Component
// function NoEventsFound() {
//     return (
//         <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
//             <MdEventBusy className="w-16 h-16 text-gray-400 mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Available</h3>
//             <p className="text-gray-500 text-center max-w-md">
//                 It looks like there are no events matching your current filters. Try adjusting your category or time preferences to discover more exciting events!
//             </p>
//             <button
//                 onClick={() => {
//                     setSelectedCategories([]);
//                     setTimeFilter("Upcoming");
//                     setCurrentPage(1);
//                 }}
//                 className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
//             >
//                 Reset Filters
//                 <BsArrowRightShort className="w-5 h-5" />
//             </button>
//         </div>
//     );
// }
// export default function IndexPage() {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const user = useSelector((state) => state.auth.user);
//     const navigate = useNavigate();
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [timeFilter, setTimeFilter] = useState("Upcoming");
//     const [currentPage, setCurrentPage] = useState(1);
//     const eventsPerPage = 6;

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
//                 className={`p-2 rounded-full ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"} transition-colors duration-200`}
//             >
//                 <FaChevronLeft className="w-5 h-5" />
//             </button>
//         );

//         for (let i = startPage; i <= endPage; i++) {
//             buttons.push(
//                 <button
//                     key={i}
//                     onClick={() => handlePageChange(i)}
//                     className={`px-4 py-2  text-sm font-medium transition-all duration-200 ${currentPage === i ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
//                     className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentPage === totalPages ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
//                 className={`p-2 rounded-full ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"} transition-colors duration-200`}
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
//         setCurrentPage(1);
//     };

//     return (
//         <>
//             <EventCarousel />
//             <div className="container mx-auto px-4">
//                 <CategoryTags
//                     categories={categories}
//                     selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : ""}
//                     onCategorySelect={toggleCategory}
//                 />
//             </div>

//             <div className="flex gap-6 mx-4 md:mx-10 mt-5  ">
//                 <div className=" hidden md:block w-full md:w-1/4  bg-white shadow-lg p-6 rounded-lg h-fit border-gray-400 border-2">
//                     <Title title="Filters" />
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
//                     <h2 className="font-semibold text-lg mb-2 text-gray-800">Time</h2>
//                     <div className="flex flex-col gap-2">
//                         {timeFilters.map((filter) => (
//                             <button
//                                 key={filter}
//                                 onClick={() => setTimeFilter(filter)}
//                                 className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 ${timeFilter === filter ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
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

//                 <div className="w-full md:w-3/4">
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
//                                         <EventCard
//                                             key={event._id}
//                                             event={event}
//                                             user={user}
//                                             handleLike={handleLike}
//                                         />
//                                     ))
//                                 ) : (
//                                     <NoEventsFound/>
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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../layout/SkeletonLoader";
import EventCarousel from "../layout/Carousel";
import Title from "../layout/Title";
import CategoryTags from "../layout/CategoryTag";
import EventCard from "../components/EventCard"; // Import EventCard
import NoEventsFound from "../components/NoEventsFound"; // Import NoEventsFound
import { ArrowLeft, ArrowRight } from "lucide-react";

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

        // Previous Button
        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } flex items-center gap-1 shadow-md`}
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
            </button>
        );

        // Page Numbers
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md ${currentPage === i
                            ? "bg-blue-500 text-white border-2 border-blue-500"
                            : "bg-gray-400 text-white border-2 border-blue-500 hover:bg-blue-600"
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Ellipsis and Last Page
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
                            ? "bg-blue-500 text-white border-2 border-blue-500"
                            : "bg-black text-white border-2 border-blue-500 hover:bg-blue-600"
                        }`}
                >
                    {totalPages}
                </button>
            );
        }

        // Next Button
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } flex items-center gap-1 shadow-md`}
            >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
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

    const resetFilters = () => {
        setSelectedCategories([]);
        setTimeFilter("Upcoming");
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

            <div className="flex gap-6 mx-4 md:mx-10 mt-5">
                <div className="hidden md:block w-full md:w-1/4 bg-white shadow-lg p-6 rounded-lg h-fit border-gray-400 border-2">
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
                        onClick={resetFilters}
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
                                    <NoEventsFound resetFilters={resetFilters} />
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