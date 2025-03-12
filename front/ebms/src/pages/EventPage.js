

import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import BookmarkButton from "../UserPage/BookMarkEvent";
import ShareEventModal from "../UserPage/ShareEvent";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../layout/SkeletonLoader";
import EventCarousel from "../layout/Carousel";
import Title from '../layout/Title';
import { Helmet } from "react-helmet-async";
export default function IndexPage() {
    const [events, setEvents] = useState([]);
    // const { data: events, isLoading, isError } = useGetAllEventsQuery();

    // const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true); // Add loading state
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate()
    const [selectedCategory, setSelectedCategory] = useState("All"); // New state for selected category
    const [timeFilter, setTimeFilter] = useState("Upcoming"); // New state for time filter

    //! Fetch events from the server ---------------------------------------------------------------
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
        if (!user || !user._id) {  // Check if user is not logged in
            navigate('/login'); // Redirect to login if not logged in
            return;
        }

        const userId = user._id; // Get user ID from the context
        console.log(' loggned User ID', userId);

        axios
            .post(`http://localhost:5000/api/events/userLike/${eventId}`, { userId }, { withCredentials: true })  // Pass userId in the body of the request
            .then((response) => {
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event._id === eventId
                            ? { ...event, likes: response.data.likes }  // Update likes with the response from the backend
                            : event
                    )
                );
            })
            .catch((error) => {
                console.error("Error liking/unliking event", error);
            });
    };




    const currentDate = new Date();

    // Apply category and time filters
    const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.eventDate);
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesTime =
            (timeFilter === "Upcoming" && eventDate > currentDate) ||
            (timeFilter === "Past" && eventDate < currentDate) ||
            (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
        return matchesCategory && matchesTime;
    });

    // Filter for online and free events that match the selected category and time filter
    const onlineFreeEvents = events.filter(event => {
        const eventDate = new Date(event.eventDate);
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesTime =
            (timeFilter === "Upcoming" && eventDate > currentDate) ||
            (timeFilter === "Past" && eventDate < currentDate) ||
            (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
        return event.location?.name === "online" && event.ticketPrice === 0 && matchesCategory && matchesTime;
    });

    // Filter for online events that match the selected category and time filter
    const onlineEvents = events.filter(event => {
        const eventDate = new Date(event.eventDate);
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesTime =
            (timeFilter === "Upcoming" && eventDate > currentDate) ||
            (timeFilter === "Past" && eventDate < currentDate) ||
            (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
        return event.location?.name === "online" && matchesCategory && matchesTime;
    });

    // Filter for free events that match the selected category and time filter
    const FreeEvents = events.filter(event => {
        const eventDate = new Date(event.eventDate);
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesTime =
            (timeFilter === "Upcoming" && eventDate > currentDate) ||
            (timeFilter === "Past" && eventDate < currentDate) ||
            (timeFilter === "Today" && eventDate.toDateString() === currentDate.toDateString());
        return event.ticketPrice === 0 && matchesCategory && matchesTime;
    });



    // const handleCategoryChange = (e) => {
    //     setSelectedCategory(e.target.value);
    // };



    // const handleTimeFilterChange = (e) => {
    //     setTimeFilter(e.target.value);
    // };


    const categories = ["All", "music", "comedy", 'education', "workshop", "sport"];
    const timeFilters = ["Upcoming", "Past", "Today"];

    return (
        <>
            <EventCarousel  />

            

            {/* Filters */}
            <div className="mx-10 mt-5 z-50">
                <div className="flex flex-wrap gap-4">
                                <Title title={"Home Page"} />
                    
                    <div className="flex gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg shadow-lg transition-all ${selectedCategory === category
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {timeFilters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-4 py-2 rounded-lg shadow-lg transition-all ${timeFilter === filter
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>



            <div className="mt-1 flex flex-col">
                {/* <div className="hidden sm:block" >
                    <div href="#" className="flex item-center inset-0">
                        <img src="/assets/events23.jpg" alt="" className="w-full h-[300px]" />
                    </div>
                </div> */}

                {/* Loading Skeleton */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonLoader key={i} />
                        ))}
                    </div>
                ) : (


                    <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5 ">

                        {/*-------------------------- Checking whether there is a event or not-------------------  */}
                        {filteredEvents.length > 0 && filteredEvents.map((event) => {
                            // const eventDate = new Date(event.eventDate);
                            // const currentDate = new Date();

                            //! Check the event date is passed or not --------------------------------------------------------------------------------------- 
                            // if (eventDate > currentDate || eventDate.toDateString() === currentDate.toDateString()) {
                            return (
                                <div className="bg-white rounded-xl relative " key={event._id}>
                                    <div className="relative rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] object-fill aspect-16:9  mb-7">
                                        {event.images && (
                         
                                            
                                            <Link to={`/events/${event._id}`}>
                                                <img
                                                    src={`http://localhost:5000${event.images[0]}`}
                                                    alt={event.title}
                                                    width="300"
                                                    height="200"
                                                    className="w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
                                                />
                                            </Link>
                                        )}

                                        {/* to share event details */}


                                        <Helmet>
                                            <title>{event.title} | Event</title>
                                            <meta name="description" content={event.description} />

                                            {/* Open Graph (Facebook, LinkedIn) */}
                                            <meta property="og:title" content={event.title} />
                                            <meta property="og:description" content={event.description} />
                                            <meta property="og:image" content={`http://localhost:5000${event.images[0]}`} />
                                            <meta property="og:url" content={window.location.href} />
                                            <meta property="og:type" content="website" />

                                            {/* Twitter Card */}
                                            <meta name="twitter:card" content="summary_large_image" />
                                            <meta name="twitter:title" content={event.title} />
                                            <meta name="twitter:description" content={event.description} />
                                            <meta name="twitter:image" content={`http://localhost:5000${event.images[0]}`} />
                                        </Helmet>
                                        {/* Parent div containing Bookmark, Share, and Like button in a row */}
                                        <div className="absolute flex items-center justify-between w-full px-4 -bottom-10">

                                            {/* Bookmark Button - aligned left */}
                                            <BookmarkButton
                                                eventId={event._id}
                                                isBookmarkedInitial={event.isBookmarked}
                                            />

                                            {/* Share Event Icon - centered */}
                                            <ShareEventModal event={event} />

                                            {/* Like Button - aligned right */}
                                            <button onClick={() => handleLike(event._id)}>
                                                <BiLike className="w-auto h-12 lg:h-10 sm:h-12 md:h-10 bg-white p-2 rounded-full shadow-md transition-all hover:text-primary" />
                                            </button>

                                        </div>
                                    </div>






                                    <div className="m-2 grid gap-2">
                                        <div className="flex justify-between items-center">
                                            <h1 className="font-bold text-lg mt-2">
                                                {event.title ? event.title.toUpperCase() : "No Title"}
                                            </h1>
                                            <div className="flex gap-2 items-center mr-4 text-red-600"> <BiLike /> {event.likes}</div>
                                        </div>


                                        <div className="flex text-sm flex-nowrap justify-between text-primarydark font-bold mr-4">
                                            <div>{event.eventDate.split("T")[0]}, {event.eventTime}</div>
                                        </div>

                                        <div className="text-xs flex flex-col flex-wrap truncate-text">
                                            {event.description?.length > 100
                                                ? `${event.description.slice(0, 100)}...`
                                                : event.description}
                                        </div>
                                        <div className="flex justify-between items-center my-2 mr-4">
                                            <div className="text-sm text-primarydark ">Organized By: <br /><span className="font-bold">{event.organizedBy}</span></div>
                                            <div className="text-sm text-primarydark">
                                                Created By: <br />
                                                <span className="font-semibold">
                                                    {event.organizer && event.organizer.name ? event.organizer.name.toUpperCase() : "Unknown Creator"}
                                                </span>
                                            </div>
                                        </div>
                                        <Link to={`/events/${event._id}`} className="flex justify-center">
               <button 
                 className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg transition duration-200 hover:bg-blue-700"
>               {event.ticketPrice === 0 ? 'Get Ticket' : 'Buy Ticket'}< BsArrowRightShort className="w-6 h-6" /></button>
                                        </Link>

                                    </div>
                                </div>
                            )

                        }
                        )}
                    </div>
                )}
            </div>
 

            {/* Free Online Events Section */}
            {onlineFreeEvents.length > 0 && (
                <div className="mx-10 my-10">
                    <h2 className="text-2xl font-bold mb-5">Free Online Events</h2>
                    <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
                        {onlineFreeEvents.map((event) => (
                            <div className="bg-white rounded-xl" key={event._id}>
                                <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] object-fill aspect-16:9">
                                    {event.image && (
                                        <img
                                            src={`http://localhost:5000${event.image[0]}`}                                            alt={event.title}
                                        //    src={event.image[0]} alt={event.title}
                                            width="300"
                                            height="200"
                                            className="hover:scale-105 transition-transform duration-300 ease-in-out"
                                        />
                                    )}
                                </div>
                                <div className="m-2">
                                    <h1 className="font-bold text-lg mt-2">{event.title}</h1>
                                    <div className="text-sm text-primarydark font-bold mr-4">{event.eventDate.split("T")[0]}, {event.eventTime}</div>
                                    <div className="text-xs flex flex-col flex-wrap truncate-text">
                                        {event.description?.length > 100
                                            ? `${event.description.slice(0, 100)}...`
                                            : event.description}
                                    </div>
                                    <Link to={`/events/${event._id}`} className="flex justify-center mt-4">
                                        <button className="primary flex items-center gap-2">View Details< BsArrowRightShort className="w-6 h-6" /></button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}








            {/* Free Online Events Section */}
            {onlineEvents.length > 0 && (
                <div className="mx-10 my-10">
                    <h2 className="text-2xl font-bold mb-5"> Online Events</h2>
                    <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
                        {onlineEvents.map((event) => (
                            <div className="bg-white rounded-xl" key={event._id}>
                                <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] object-fill aspect-16:9">
                                    {event.image && (
                                        <img
                                            src={`http://localhost:5000${event.image[0]}`}                                            alt={event.title}
                                        //    src={event.image[0]} 
                                        //    alt={event.title}
                                            width="300"
                                            height="200"
                                            className="hover:scale-105 transition-transform duration-300 ease-in-out"
                                        />
                                    )}
                                </div>
                                <div className="m-2">
                                    <h1 className="font-bold text-lg mt-2">{event.title}</h1>
                                    <div className="text-sm text-primarydark font-bold mr-4">{event.eventDate.split("T")[0]}, {event.eventTime}</div>
                                    <div className="text-xs flex flex-col flex-wrap truncate-text">
                                        {event.description?.length > 100
                                            ? `${event.description.slice(0, 100)}...`
                                            : event.description}
                                    </div>
                                    <Link to={`/events/${event._id}`} className="flex justify-center mt-4">
                                        <button className="primary flex items-center gap-2">View Details< BsArrowRightShort className="w-6 h-6" /></button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}






            {/* Free Online Events Section */}
            {FreeEvents.length > 0 && (
                <div className="mx-10 my-10">
                    <h2 className="text-2xl font-bold mb-5">Free  Events</h2>
                    <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
                        {FreeEvents.map((event) => (
                            <div className="bg-white rounded-xl" key={event._id}>
                                <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] object-fill aspect-16:9">
                                    {event.image && (
                                        <img
                                            src={`http://localhost:5000${event.image[0]}`}                                            alt={event.title}
                                            // src={event.image[0]}
                                            // alt={event.title}
                                            width="300"
                                            height="200"
                                            className="hover:scale-105 transition-transform duration-300 ease-in-out"
                                            
                                        />
                                    )}
                                </div>
                                <div className="m-2">
                                    <h1 className="font-bold text-lg mt-2">{event.title}</h1>
                                    <div className="text-sm text-primarydark font-bold mr-4">{event.eventDate.split("T")[0]}, {event.eventTime}</div>
                                    <div className="text-xs flex flex-col flex-wrap truncate-text">
                                        {event.description?.length > 100
                                            ? `${event.description.slice(0, 100)}...`
                                            : event.description}
                                    </div>
                                    <Link to={`/events/${event._id}`} className="flex justify-center mt-4">
                                        <button className="primary flex items-center gap-2">View Details< BsArrowRightShort className="w-6 h-6" /></button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>

    )
}





