import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { Users, Calendar } from "lucide-react";
import BookmarkButton from "../UserPage/BookMarkEvent";
import ShareEventModal from "../UserPage/ShareEvent";

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

            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/events/${event._id}`}>
                    <h3 className="text-lg font-bold text-gray-800 truncate">{event.title.toUpperCase()}</h3>
                </Link>

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
                        <p>{totalBooked} Tickets Booked</p>
                    </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <button
                        aria-label="Like event"
                        onClick={() => handleLike(event._id)}
                        className="flex items-center gap-1 text-blue-500 hover:text-red-600 transition-colors"
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
                      View Details
                        <BsArrowRightShort className="w-5 h-5" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default EventCard;