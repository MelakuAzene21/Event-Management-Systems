// import { useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { MdLocationPin } from "react-icons/md";
// import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";
// import BookmarkButton from "../UserPage/BookMarkEvent";
// import SkeletonLoader from "../layout/SkeletonLoader";
// import { useSelector, useDispatch } from "react-redux";
// import { v4 as uuidv4 } from "uuid";
// import { setPendingBooking } from "../features/slices/bookingSlice";
// import Title from "../layout/Title";
// import EventMap from "../components/EventMap";
// import { Carousel } from "react-responsive-carousel";
// import { Calendar, Clock, Users } from "lucide-react";
// import { FaExclamationTriangle } from "react-icons/fa";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import OrganizerFollowCard from "../Origanizer/OrganizerInfo";
// import { useGetEventDetailsQuery,useGetAllEventsQuery } from "../features/api/eventApi";
// import ShowEditDeleteReview from "../components/ShowEditDeleteReview";

// export default function EventPage() {
//     const { id } = useParams();
//     const [selectedTicket, setSelectedTicket] = useState(null);
//     const [ticketCounts, setTicketCounts] = useState({});
//     const navigate = useNavigate();
//     const transactionRef = uuidv4();
//     const dispatch = useDispatch();
//     const user = useSelector((state) => state.auth.user);

//     // Fetch event details using RTK Query
//     const {
//         data: event,
//         isLoading: eventLoading,
//         error: eventError,
//     } = useGetEventDetailsQuery(id);

//     // Fetch all events for related events
//     const {
//         data: allEvents,
//         isLoading: allEventsLoading,
//     } = useGetAllEventsQuery();

//     // Filter related events based on category or location
//     const relatedEvents = allEvents
//         ?.filter(
//             (e) =>
//                 e._id !== id && // Exclude the current event
//                 (e.category === event?.category || e.location?.name === event?.location?.name) // Match by category or location
//         )
//         .slice(0, 5) || []; // Limit to 5 related events

//     const totalTickets = event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.limit, 0) || 0;
//     const totalBooked = event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.booked, 0) || 0;
//     const totalAvailable = event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.available, 0) || 0;

//     // Share functionalities
//     const handleCopyLink = () => {
//         const linkToShare = window.location.href;
//         navigator.clipboard.writeText(linkToShare).then(() => {
//             alert("Link copied to clipboard!");
//         });
//     };

//     const handleWhatsAppShare = () => {
//         const linkToShare = window.location.href;
//         const whatsappMessage = encodeURIComponent(`${linkToShare}`);
//         window.open(`whatsapp://send?text=${whatsappMessage}`);
//     };

//     const handleFacebookShare = () => {
//         const linkToShare = window.location.href;
//         const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`;
//         window.open(facebookShareUrl);
//     };

//     // Ticket selection handlers
//     const handleTicketSelection = (ticket) => {
//         setSelectedTicket(ticket);
//         setTicketCounts((prev) => ({
//             ...prev,
//             [ticket.name]: prev[ticket.name] || 1,
//         }));
//     };

//     const handleIncrease = (ticket) => {
//         setTicketCounts((prev) => ({
//             ...prev,
//             [ticket.name]: Math.min((prev[ticket.name] || 1) + 1, ticket.available),
//         }));
//     };

//     const handleDecrease = (ticket) => {
//         setTicketCounts((prev) => ({
//             ...prev,
//             [ticket.name]: Math.max((prev[ticket.name] || 1) - 1, 1),
//         }));
//     };

//     const handleBooking = async () => {
//         if (!user) {
//             navigate("/login");
//             return;
//         }

//         if (!selectedTicket) {
//             alert("Please select a ticket type.");
//             return;
//         }

//         const bookingData = {
//             user: user._id,
//             event: event._id,
//             ticketType: selectedTicket.name,
//             ticketCount: ticketCounts[selectedTicket.name] || 1,
//             totalAmount: ticketCounts[selectedTicket.name] * selectedTicket.price,
//             paymentId: transactionRef,
//         };

//         dispatch(setPendingBooking(bookingData));
//         navigate(`/${id}/booking-summary`);
//     };

//     // Loading state
//     if (eventLoading || allEventsLoading) {
//         return (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//                 {[...Array(8)].map((_, i) => (
//                     <SkeletonLoader key={i} />
//                 ))}
//             </div>
//         );
//     }

//     // Error state or no event found
//     if (eventError || !event) {
//         return (
//             <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
//                 <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md">
//                     <FaExclamationTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
//                     <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
//                     <p className="text-gray-600 mb-6">
//                         The event you're looking for might have been removed or doesn't exist. Let's find you something else to explore!
//                     </p>
//                     <Link to="/">
//                         <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
//                             Explore Other Events
//                         </button>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
//             <Title title="Event Details Page" />

//             {/* Image Carousel */}
//             <div className="mb-8 relative">
//                 {event.images && event.images.length > 0 ? (
//                     <>
//                         <Carousel
//                             showThumbs={false}
//                             showStatus={true}
//                             infiniteLoop
//                             autoPlay
//                             interval={3000}
//                             className="rounded-lg shadow-lg"
//                         >
//                             {event.images.map((imgUrl, index) => (
//                                 <div key={index}>
//                                     <img
//                                         src={imgUrl}
//                                         alt={`${event.title} ${index + 1}`}
//                                         className="w-full h-64 md:h-96 object-cover rounded-lg"
//                                     />
//                                 </div>
//                             ))}
//                         </Carousel>
//                         <BookmarkButton
//                             eventId={event._id}
//                             isBookmarkedInitial={event.isBookmarked}
//                             className="absolute bottom-4 right-4"
//                         />
//                     </>
//                 ) : (
//                     <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center rounded-lg relative">
//                         <p className="text-gray-500">No images available</p>
//                         <BookmarkButton
//                             eventId={event._id}
//                             isBookmarkedInitial={event.isBookmarked}
//                             className="absolute bottom-4 right-4"
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* Event Title */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//                 <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-800">
//                     {event.title.toUpperCase()}
//                 </h1>
//             </div>

//             {/* Date/Time/Attendees Cards and Ticket Selection Side by Side */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                 {/* Cards (Left) */}
//                 <div className="lg:col-span-2 space-y-4">
//                     <div className="border rounded-lg p-4 shadow-sm flex items-center gap-3 bg-white">
//                         <Calendar className="w-6 h-6 text-gray-700" />
//                         <div>
//                             <h3 className="text-sm font-semibold text-gray-800">Date</h3>
//                             <p className="text-gray-600 text-sm">
//                                 {new Date(event.eventDate).toLocaleDateString("en-US", {
//                                     weekday: "long",
//                                     month: "long",
//                                     day: "numeric",
//                                     year: "numeric",
//                                 })}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="border rounded-lg p-4 shadow-sm flex items-center gap-3 bg-white">
//                         <Clock className="w-6 h-6 text-gray-700" />
//                         <div>
//                             <h3 className="text-sm font-semibold text-gray-800">Time</h3>
//                             <p className="text-gray-600 text-sm">
//                                 {new Date(`1970-01-01T${event.eventTime}`).toLocaleTimeString([], {
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                     hour12: true,
//                                 })}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="border rounded-lg p-4 shadow-sm flex items-center gap-3 bg-white">
//                         <Users className="w-6 h-6 text-gray-700" />
//                         <div>
//                             <h3 className="text-sm font-semibold text-gray-800">Tickets</h3>
//                             <p className="text-gray-600 text-sm">{totalBooked} / {totalTickets} (Left: {totalAvailable})</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Ticket Selection (Right, Sticky, Reduced Size) */}
//                 <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 sticky top-4 h-fit">
//                     <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">Select Tickets</h2>
//                     <div className="space-y-2">
//                         {event.ticketTypes.map((ticket, index) => (
//                             <div
//                                 key={index}
//                                 onClick={() => handleTicketSelection(ticket)}
//                                 className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 ${selectedTicket?.name === ticket.name ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
//                                     }`}
//                             >
//                                 <div className="flex justify-between items-center">
//                                     <div>
//                                         <p className="text-sm font-medium text-gray-800">{ticket.name}</p>
//                                         <p className="text-xs text-gray-600">{ticket.available ?? ticket.limit} left</p>
//                                         <p className="text-xs text-gray-700">{ticket.price === 0 ? "Free" : `${ticket.price} ETB`}</p>
//                                     </div>
//                                     <div className="flex items-center space-x-1">
//                                         <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleDecrease(ticket);
//                                             }}
//                                             className="px-1 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-xs"
//                                         >
//                                             -
//                                         </button>
//                                         <span className="px-2 text-xs">{ticketCounts[ticket.name] || 1}</span>
//                                         <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleIncrease(ticket);
//                                             }}
//                                             className="px-1 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-xs"
//                                         >
//                                             +
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                     <button
//                         onClick={handleBooking}
//                         className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
//                     >
//                         Book Now
//                     </button>
//                 </div>
//             </div>

//             {/* Event Description */}
//             <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-200">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-wide uppercase text-center">
//                     About This Event
//                 </h2>
//                 <div className="text-gray-700 text-lg leading-loose space-y-4 px-8">
//                     {event.description ? (
//                         event.description.split("\n").map((paragraph, index) => (
//                             <p key={index} className="text-gray-700 indent-8 text-justify">
//                                 {paragraph}
//                             </p>
//                         ))
//                     ) : (
//                         <p className="text-gray-500 italic text-center">No description available for this event.</p>
//                     )}
//                 </div>
//             </div>

//             <OrganizerFollowCard event={event} />

//             {/* Location Section */}
//             <div className="mt-10 bg-white shadow-md rounded-lg p-6">
//                 <div className="flex items-start gap-3">
//                     <MdLocationPin className="w-6 h-6 text-blue-600" />
//                     <div className="flex-1">
//                         <h3 className="text-lg font-semibold text-gray-700">Location</h3>
//                         <p className="text-gray-600 mt-1">
//                             {event.location?.name || "San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103"}
//                         </p>
//                         {event.location?.coordinates && event.location.coordinates.length === 2 && (
//                             <div className="mt-4 relative">
//                                 <EventMap
//                                     latitude={event.location.coordinates[1]} // latitude is the second element
//                                     longitude={event.location.coordinates[0]} // longitude is the first element
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Reviews */}
//             <div className="mb-8">
//                 <ShowEditDeleteReview eventId={event?._id} attendeeId={user?._id} />
//             </div>

//             {/* Share with Friends */}
//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Share with Friends</h2>
//                 <div className="flex gap-4">
//                     <button
//                         onClick={handleCopyLink}
//                         className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
//                         title="Copy Link"
//                     >
//                         <FaCopy className="w-6 h-6 text-gray-700" />
//                     </button>
//                     <button
//                         onClick={handleWhatsAppShare}
//                         className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
//                         title="Share on WhatsApp"
//                     >
//                         <FaWhatsappSquare className="w-6 h-6 text-green-500" />
//                     </button>
//                     <button
//                         onClick={handleFacebookShare}
//                         className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
//                         title="Share on Facebook"
//                     >
//                         <FaFacebook className="w-6 h-6 text-blue-600" />
//                     </button>
//                 </div>
//             </div>

//             {/* Related Events Section */}
//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Events</h2>
//                 {allEventsLoading ? (
//                     <div className="flex gap-4 overflow-x-auto pb-4">
//                         {[...Array(3)].map((_, i) => (
//                             <div key={i} className="min-w-[250px] bg-gray-200 h-64 rounded-lg animate-pulse"></div>
//                         ))}
//                     </div>
//                 ) : relatedEvents.length > 0 ? (
//                     <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                         {relatedEvents.map((relatedEvent) => (
//                             <div
//                                 key={relatedEvent._id}
//                                 className="min-w-[250px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//                             >
//                                 <Link to={`/events/${relatedEvent._id}`}>
//                                     <img
//                                         src={relatedEvent.images[0]}
//                                         alt={relatedEvent.title}
//                                         className="w-full h-40 object-cover rounded-t-lg hover:scale-105 transition-transform duration-300"
//                                     />
//                                 </Link>
//                                 <div className="p-4">
//                                     <h3 className="text-lg font-semibold text-gray-800 truncate">
//                                         {relatedEvent.title.toUpperCase()}
//                                     </h3>
//                                     <p className="text-sm text-gray-600">
//                                         {new Date(relatedEvent.eventDate).toLocaleDateString("en-US", {
//                                             day: "numeric",
//                                             month: "numeric",
//                                             year: "numeric",
//                                         })}
//                                     </p>
//                                     <p className="text-xs text-gray-500 truncate mt-1">{relatedEvent.description}</p>
//                                     <Link to={`/events/${relatedEvent._id}`} className="block mt-3">
//                                         <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
//                                             View Details
//                                         </button>
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-gray-500">No related events found.</p>
//                 )}
//             </div>
//         </div>
//     );
// }
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";
import BookmarkButton from "../UserPage/BookMarkEvent";
import SkeletonLoader from "../layout/SkeletonLoader";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setPendingBooking } from "../features/slices/bookingSlice";
import Title from "../layout/Title";
import EventMap from "../components/EventMap";
import { Carousel } from "react-responsive-carousel";
import { Calendar, Clock, Users } from "lucide-react";
import { FaExclamationTriangle } from "react-icons/fa";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import OrganizerFollowCard from "../Origanizer/OrganizerInfo";
import { useGetEventDetailsQuery, useGetAllEventsQuery } from "../features/api/eventApi";
import ShowEditDeleteReview from "../components/ShowEditDeleteReview";
import OrganizersList from "../layout/OrganizersList";
import ExploreCategories from "../layout/ExploreCategories";
export default function EventPage() {
    const { id } = useParams();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketCounts, setTicketCounts] = useState({});
    const navigate = useNavigate();
    const transactionRef = uuidv4();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    // Fetch event details using RTK Query
    const {
        data: event,
        isLoading: eventLoading,
        error: eventError,
    } = useGetEventDetailsQuery(id);

    // Fetch all events for related events
    const {
        data: allEvents,
        isLoading: allEventsLoading,
    } = useGetAllEventsQuery();

    // Filter related events based on category or location
    const relatedEvents = allEvents
        ?.filter(
            (e) =>
                e._id !== id && // Exclude the current event
                (e.category === event?.category || e.location?.name === event?.location?.name) // Match by category or location
        )
        .slice(0, 5) || []; // Limit to 5 related events

    const totalTickets = event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.limit, 0) || 0;
    const totalBooked = event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.booked, 0) || 0;
    const totalAvailable = event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.available, 0) || 0;

    // Function to check if event is not past
    const isEventNotPast = (event) => {
        if (!event?.eventDate || !event?.eventTime) return false;

        // Combine eventDate and eventTime into a single Date object
        const [hours, minutes] = event.eventTime.split(":");
        const eventDateTime = new Date(event.eventDate);
        eventDateTime.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        // Get current UTC time
        const now = new Date();

        // Return true if event is in the future
        return eventDateTime > now;
    };

    // Share functionalities
    const handleCopyLink = () => {
        const linkToShare = window.location.href;
        navigator.clipboard.writeText(linkToShare).then(() => {
            alert("Link copied to clipboard!");
        });
    };

    const handleWhatsAppShare = () => {
        const linkToShare = window.location.href;
        const whatsappMessage = encodeURIComponent(`${linkToShare}`);
        window.open(`whatsapp://send?text=${whatsappMessage}`);
    };

    const handleFacebookShare = () => {
        const linkToShare = window.location.href;
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`;
        window.open(facebookShareUrl);
    };

    // Ticket selection handlers
    const handleTicketSelection = (ticket) => {
        setSelectedTicket(ticket);
        setTicketCounts((prev) => ({
            ...prev,
            [ticket.name]: prev[ticket.name] || 1,
        }));
    };

    const handleIncrease = (ticket) => {
        setTicketCounts((prev) => ({
            ...prev,
            [ticket.name]: Math.min((prev[ticket.name] || 1) + 1, ticket.available),
        }));
    };

    const handleDecrease = (ticket) => {
        setTicketCounts((prev) => ({
            ...prev,
            [ticket.name]: Math.max((prev[ticket.name] || 1) - 1, 1),
        }));
    };

    const handleBooking = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!isEventNotPast(event)) {
            alert("This event has already occurred and cannot be booked.");
            return;
        }

        if (!event.isFree && !selectedTicket) {
            alert("Please select a ticket type.");
            return;
        }

        const bookingData = event.isFree
            ? {
                user: user._id,
                event: event._id,
                ticketType: "Free Admission",
                ticketCount: 1, // Default to 1 for free events
                totalAmount: 0,
                paymentId: transactionRef,
            }
            : {
                user: user._id,
                event: event._id,
                ticketType: selectedTicket.name,
                ticketCount: ticketCounts[selectedTicket.name] || 1,
                totalAmount: ticketCounts[selectedTicket.name] * selectedTicket.price,
                paymentId: transactionRef,
            };

        dispatch(setPendingBooking(bookingData));
        navigate(`/${id}/booking-summary`);
    };

    // Loading state
    if (eventLoading || allEventsLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {[...Array(8)].map((_, i) => (
                    <SkeletonLoader key={i} />
                ))}
            </div>
        );
    }

    // Error state or no event found
    if (eventError || !event) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
                <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md">
                    <FaExclamationTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The event you're looking for might have been removed or doesn't exist. Let's find you something else to explore!
                    </p>
                    <Link to="/">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
                            Explore Other Events
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
            <Title title="Event Details Page" />

            {/* Image Carousel */}
            <div className="mb-8 relative">
                {event.images && event.images.length > 0 ? (
                    <>
                        <Carousel
                            showThumbs={false}
                            showStatus={true}
                            infiniteLoop
                            autoPlay
                            interval={3000}
                            className="rounded-lg shadow-lg"
                        >
                            {event.images.map((imgUrl, index) => (
                                <div key={index}>
                                    <img
                                        src={imgUrl}
                                        alt={`${event.title} ${index + 1}`}
                                        className="w-full h-64 md:h-96 object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </Carousel>
                        <BookmarkButton
                            eventId={event._id}
                            isBookmarkedInitial={event.isBookmarked}
                            className="absolute bottom-4 right-4"
                        />
                    </>
                ) : (
                    <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center rounded-lg relative">
                        <p className="text-gray-500">No images available</p>
                        <BookmarkButton
                            eventId={event._id}
                            isBookmarkedInitial={event.isBookmarked}
                            className="absolute bottom-4 right-4"
                        />
                    </div>
                )}
            </div>

            {/* Event Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-800">
                    {event.title.toUpperCase()}
                </h1>
            </div>

            {/* Date/Time/Attendees Cards and Ticket Selection Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Cards (Left) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="border rounded-lg p-4 shadow-sm flex items-center gap-3 bg-white">
                        <Calendar className="w-6 h-6 text-gray-700" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800">Date</h3>
                            <p className="text-gray-600 text-sm">
                                {new Date(event.eventDate).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="border rounded-lg p-4 shadow-sm flex items-center gap-3 bg-white">
                        <Clock className="w-6 h-6 text-gray-700" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800">Time</h3>
                            <p className="text-gray-600 text-sm">
                                {new Date(`1970-01-01T${event.eventTime}`).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="border rounded-lg p-4 shadow-sm flex items-center gap-3 bg-white">
                        <Users className="w-6 h-6 text-gray-700" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800">Tickets</h3>
                            <p className="text-gray-600 text-sm">{totalBooked} / {totalTickets} (Left: {totalAvailable})</p>
                        </div>
                    </div>
                </div>

                {/* Ticket Selection or Free Event Message (Right, Sticky, Reduced Size) */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 sticky top-4 h-fit">
                    {isEventNotPast(event) ? (
                        event.isFree ? (
                            <div className="text-center">
                                <h2 className="text-lg font-bold text-green-600 mb-3">Absolutely Free Event!</h2>
                                <p className="text-sm text-gray-700 mb-4">
                                    Dive into an unforgettable experience at no cost! Join us for {event.title}, where excitement, inspiration, and community come together. Simply show up and enjoy—no registration needed!
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">Select Tickets</h2>
                                <div className="space-y-2">
                                    {event.ticketTypes.map((ticket, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleTicketSelection(ticket)}
                                            className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 ${selectedTicket?.name === ticket.name ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{ticket.name}</p>
                                                    <p className="text-xs text-gray-600">{ticket.available ?? ticket.limit} left</p>
                                                    <p className="text-xs text-gray-700">{ticket.price === 0 ? "Free" : `${ticket.price} ETB`}</p>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDecrease(ticket);
                                                        }}
                                                        className="px-1 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 text-xs">{ticketCounts[ticket.name] || 1}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleIncrease(ticket);
                                                        }}
                                                        className="px-1 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleBooking}
                                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                                >
                                    Book Now
                                </button>
                            </>
                        )
                    ) : (
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-gray-800 mb-3">Event Passed</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                This event has already occurred. Check out other upcoming events!
                            </p>
                            <Link to="/">
                                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                                    Explore Events
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Event Description */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-wide uppercase text-center">
                    About This Event
                </h2>
                <div className="text-gray-700 text-lg leading-loose space-y-4 px-8">
                    {event.description ? (
                        event.description.split("\n").map((paragraph, index) => (
                            <p key={index} className="text-gray-700 indent-8 text-justify">
                                {paragraph}
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-500 italic text-center">No description available for this event.</p>
                    )}
                </div>
            </div>

            <OrganizerFollowCard event={event} />

            {/* Location Section */}
            <div className="mt-10 bg-white shadow-md rounded-lg p-6">
                <div className="flex items-start gap-3">
                    <MdLocationPin className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-700">Location</h3>
                        <p className="text-gray-600 mt-1">
                            {event.location?.name || "San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103"}
                        </p>
                        {event.location?.coordinates && event.location.coordinates.length === 2 && (
                            <div className="mt-4 relative">
                                <EventMap
                                    latitude={event.location.coordinates[1]} // latitude is the second element
                                    longitude={event.location.coordinates[0]} // longitude is the first element
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
                <ShowEditDeleteReview eventId={event?._id} attendeeId={user?._id} />
            </div>

            {/* Share with Friends */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Share with Friends</h2>
                <div className="flex gap-4">
                    <button
                        onClick={handleCopyLink}
                        className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        title="Copy Link"
                    >
                        <FaCopy className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                        onClick={handleWhatsAppShare}
                        className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        title="Share on WhatsApp"
                    >
                        <FaWhatsappSquare className="w-6 h-6 text-green-500" />
                    </button>
                    <button
                        onClick={handleFacebookShare}
                        className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        title="Share on Facebook"
                    >
                        <FaFacebook className="w-6 h-6 text-blue-600" />
                    </button>
                </div>
            </div>
            {/* Related Events Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Events</h2>
                {allEventsLoading ? (
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="min-w-[250px] bg-gray-200 h-64 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                ) : relatedEvents.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {relatedEvents.map((relatedEvent) => (
                            <div
                                key={relatedEvent._id}
                                className="min-w-[250px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <Link to={`/events/${relatedEvent._id}`}>
                                    <img
                                        src={relatedEvent.images[0]}
                                        alt={relatedEvent.title}
                                        className="w-full h-40 object-cover rounded-t-lg hover:scale-105 transition-transform duration-300"
                                    />
                                </Link>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        {relatedEvent.title.toUpperCase()}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(relatedEvent.eventDate).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-1">{relatedEvent.description}</p>
                                    <Link to={`/events/${relatedEvent._id}`} className="block mt-3">
                                        <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No related events found.</p>
                )}
            </div>
            <OrganizersList />

            <ExploreCategories/>
        </div>
    );
}