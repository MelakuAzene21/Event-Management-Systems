// import { Link } from "react-router-dom";
// import { BsArrowRightShort } from "react-icons/bs";
// import {  BiLike } from "react-icons/bi";
// import { FaHeart } from "react-icons/fa";
// import {  MdLocationPin } from "react-icons/md";
// import { Users, Calendar } from "lucide-react";
// import BookmarkButton from "../UserPage/BookMarkEvent";
// import ShareEventModal from "../UserPage/ShareEvent";

// function EventCard({ event, user, handleLike }) {
//     const totalBooked = event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.booked, 0) || 0;
//     const categoryName = event.category?.name
//         ? event.category.name.charAt(0).toUpperCase() + event.category.name.slice(1)
//         : 'Uncategorized';
//     return (
//         <div className="bg-white w-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
//             <Link to={`/events/${event._id}`}>
//                 <div className="relative">
//                     <img
//                         src={event.images[0]}
//                         alt={event.title}
//                         className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
//                     />
//                     <div className="absolute top-2 left-2 px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm font-semibold backdrop-blur-md bg-black/50 shadow-md ring-1 ring-white/10">
//                         {categoryName}
//                     </div>


//                     {event.isFree && (
//                         <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
//                             {/* FREE Badge */}
//                             <div className="px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm font-semibold bg-gradient-to-r from-pink-500 to-red-500 shadow-md ring-1 ring-white/10">
//                                 <FaHeart className="w-4 h-4" />
//                                 Free
//                             </div>

//                             {/* Category Badge */}
//                             <div className="px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm font-semibold backdrop-blur-md bg-black/50 shadow-md ring-1 ring-white/10">
//                                 <span className="capitalize">{event.category?.name}</span>
//                             </div>
//                         </div>
//                     )}

//                 </div>
//             </Link>

//             <div className="p-4 flex flex-col flex-grow">
//                 <Link to={`/events/${event._id}`}>
//                     <h3 className="text-lg font-bold text-gray-800 truncate">{event.title.toUpperCase()}</h3>
//                 </Link>

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
//                     {event.isFree ? (
//                         <div className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 border border-green-200 px-3 py-1 rounded-md shadow-sm">
//                             <FaHeart className="w-4 h-4 text-green-500" />
//                             Free Event
//                         </div>
//                     ) : (
//                         <div className="inline-flex items-center gap-2 text-gray-700 font-medium text-sm bg-gray-100 border border-gray-200 px-3 py-1 rounded-md shadow-sm">
//                             <Users className="w-4 h-4 text-gray-600" />
//                             {totalBooked} Tickets Booked
//                         </div>
//                     )}

//                 </div>
//                 <div className="flex justify-between items-center mb-4">
//                     <button
//                         aria-label="Like event"
//                         onClick={() => handleLike(event._id)}
//                         className="flex items-center gap-1 text-blue-500 hover:text-red-600 transition-colors"
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
//                         View Details
//                         <BsArrowRightShort className="w-5 h-5" />
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     );
// }

// export default EventCard;




// src/components/EventCard.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRightShort } from 'react-icons/bs';
import { BiLike } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';
import { Users, Calendar } from 'lucide-react';
import BookmarkButton from '../UserPage/BookMarkEvent';
import ShareEventModal from '../UserPage/ShareEvent';
import { debounce } from 'lodash'; // Import lodash for debouncing

// Utility function to format category name
const formatCategoryName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Uncategorized';

// Utility function to format date
const formatEventDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }) +
    ' at ' +
    new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });

// CSS classes as constants for maintainability
const cardClasses = {
    container: 'bg-white w-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col',
    imageWrapper: 'relative',
    image: 'w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105',
    badge: 'absolute top-2 left-2 px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm font-semibold backdrop-blur-md bg-black/50 shadow-md ring-1 ring-white/10',
    freeBadge: 'px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm font-semibold bg-gradient-to-r from-pink-500 to-red-500 shadow-md ring-1 ring-white/10',
    content: 'p-4 flex flex-col flex-grow',
    title: 'text-lg font-bold text-gray-800 truncate',
    info: 'text-sm text-gray-600 flex items-center gap-1',
    ticketInfo: 'inline-flex items-center gap-2 text-gray-700 font-medium text-sm bg-gray-100 border border-gray-200 px-3 py-1 rounded-md shadow-sm',
    freeTicketInfo: 'inline-flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 border border-green-200 px-3 py-1 rounded-md shadow-sm',
    button: 'w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2',
    actions: 'flex justify-between items-center mb-4',
    likeButton: 'flex items-center gap-1 text-blue-500 hover:text-red-600 transition-colors',
};

const EventCard = React.memo(({ event, user, handleLike }) => {
    // Memoize expensive calculations
    const totalBooked = useMemo(
        () => event?.ticketTypes?.reduce((sum, ticket) => sum + ticket.booked, 0) || 0,
        [event?.ticketTypes]
    );

    const formattedDate = useMemo(() => formatEventDate(event.eventDate), [event.eventDate]);
    const categoryName = useMemo(() => formatCategoryName(event.category?.name), [event.category?.name]);

    // Debounce handleLike to prevent rapid API calls
    const debouncedHandleLike = useMemo(
        () => debounce((eventId) => handleLike(eventId), 300),
        [handleLike]
    );

    return (
        <Link to={`/events/${event._id}`} className="group">
            <div className={cardClasses.container}>
                <div className={cardClasses.imageWrapper}>
                    <img
                        src={event.images[0]}
                        alt={event.title}
                        className={cardClasses.image}
                        loading="lazy" // Lazy load images
                    />
                    <div className={cardClasses.badge}>{categoryName}</div>
                    {event.isFree && (
                        <div className={cardClasses.freeBadge}>
                            <FaHeart className="w-4 h-4" />
                            Free
                        </div>
                    )}
                </div>
                <div className={cardClasses.content}>
                    <h3 className={cardClasses.title}>{event.title.toUpperCase()}</h3>
                    <div className="mt-2 space-y-1">
                        <p className={cardClasses.info}>
                            <Calendar className="w-6 h-6 text-gray-700" />
                            {formattedDate}
                        </p>
                        <p className={cardClasses.info}>
                            <MdLocationPin className="w-6 h-6 text-blue-600" />
                            {event.location?.name?.split(', ')[0]}
                        </p>
                        {event.isFree ? (
                            <div className={cardClasses.freeTicketInfo}>
                                <FaHeart className="w-4 h-4 text-green-500" />
                                Free Event
                            </div>
                        ) : (
                            <div className={cardClasses.ticketInfo}>
                                <Users className="w-4 h-4 text-gray-600" />
                                {totalBooked} Tickets Booked
                            </div>
                        )}
                    </div>
                    <div className={cardClasses.actions}>
                        <button
                            aria-label={`Like event ${event.title}`}
                            onClick={(e) => {
                                e.preventDefault(); // Prevent Link navigation
                                debouncedHandleLike(event._id);
                            }}
                            className={cardClasses.likeButton}
                        >
                            <BiLike className="w-5 h-5" /> {event.likes}
                        </button>
                        <div className="flex items-center gap-4">
                            <BookmarkButton eventId={event._id} isBookmarkedInitial={event.isBookmarked} />
                            <ShareEventModal event={event} />
                        </div>
                    </div>
                    <button className={cardClasses.button}>
                        View Details
                        <BsArrowRightShort className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Link>
    );
});

EventCard.displayName = 'EventCard'; // For React DevTools

export default EventCard;