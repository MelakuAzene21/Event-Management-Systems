import axios from "axios";
import { BsArrowRightShort } from "react-icons/bs";
import {  useEffect, useState } from "react";
import { Link, useParams ,useNavigate} from "react-router-dom"
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";
import BookmarkButton from "../UserPage/BookMarkEvent";
import SkeletonLoader from "../layout/SkeletonLoader";
import { useSelector } from "react-redux";
export default function EventPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null); // Track selected ticket

    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    //! Fetching the event data from server by ID ------------------------------------------
    useEffect(() => {
        if (!id) {
            console.log('there is no event id');
            
            return;
        }
        axios.get(`http://localhost:5000/api/events/${id}`).then(response => {
            console.log('responses from api',response.data); // Debug the data

            setEvent(response.data)
            setLoading(false)
        }).catch((error) => {
            console.error("Error fetching events:", error);
            setLoading(false)
        });
    }, [id])

    //! Copy Functionalities -----------------------------------------------
    const handleCopyLink = () => {
        const linkToShare = window.location.href;
        navigator.clipboard.writeText(linkToShare).then(() => {
            alert('Link copied to clipboard!');
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

    const handleTicketSelection = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCheckout = () => {
        if (!selectedTicket) {
            alert("Please select a ticket type.");
            return;
        }
        // Redirect to checkout page with the selected ticket
        navigate(`/checkout`, { state: { ticket: selectedTicket, event } });
    };

    // Show a loading skeleton while fetching event data
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <SkeletonLoader key={i} />
                ))}
            </div>
        );
    }

    // Handle case where event data isn't loaded
    if (!event) {
        return <div>No event found.</div>;
    }


    const handleBookmark = async (eventId, isBookmarked) => {
        if (!user) {
            // Redirect to login if the user is not logged in
            navigate("/login");
            return;
        }

        // Perform bookmark/unbookmark action
        try {
            if (isBookmarked) {
                await axios.post(
                    `http://localhost:5000/api/events/event/${eventId}/unbookmark`,
                    null,
                    { withCredentials: true }
                );
            } else {
                await axios.post(
                    `http://localhost:5000/api/events/event/${eventId}/bookmark`,
                    null,
                    { withCredentials: true }
                );
            }
        } catch (error) {
            console.error("Error handling bookmark:", error);
        }
    };


    return (
        <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5 flex-grow">
            <div >
                <div className="grid grid-cols-3 gap-4">
                                     {event.image.map((imgUrl, index) => (
                                         <img
                                             key={index}
                                            //  src={`http://localhost:5000${imgUrl}`} // Ensure your backend serves images correctly
                                            src= {event.image[0]}
                                            alt={`${event.title}`}
                                             className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
                                         />
                                    ))}
                                </div>
            </div>

            <div className="flex justify-between mt-8 mx-2">
                <h1 className="text-3xl md:text-5xl font-extrabold">{event.title.toUpperCase()}</h1>
                <Link to={'/event/' + event._id + '/ordersummary'}>
                    <button className="primary flex items-center gap-2">{event.ticketPrice === 0 ? 'Get Ticket' : 'Buy Ticket'}< BsArrowRightShort className="w-6 h-6" /></button>
                </Link>
                {/* <BookmarkButton
                    eventId={event._id}
                    isBookmarkedInitial={event.bookmarkedBy.includes(user._id)} // Adjust according to user's bookmarks
                /> */}

                <BookmarkButton
                    eventId={event._id}
                    isBookmarkedInitial={event.bookmarkedBy.includes(user?._id)} // Adjust according to user's bookmarks
                    onBookmark={handleBookmark}

               />
            </div>
            <div className="mx-2">
                <h2 className="text-md md:text-xl font-bold mt-3 text-primarydark">{event.ticketPrice === 0 ? 'Free' : 'ETB. ' + event.ticketPrice}</h2>
            </div>
            <div className="mx-2 mt-5 text-md md:text-lg ">
                {event.description}
            </div>
            <div className="mx-2 mt-5 text-md md:text-xl font-bold text-primarydark">
                Organized By {event.organizedBy}

            </div>
            <div className="mx-2 mt-5">
                <h1 className="text-md md:text-xl font-extrabold">When and Where </h1>
                <div className="sm:mx-5 lg:mx-32 mt-6 flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <AiFillCalendar className="w-auto h-5 text-primarydark " />
                        <div className="flex flex-col gap-1">

                            <h1 className="text-md md:text-lg font-extrabold">Date and Time</h1>
                            <div className="text-sm md:text-lg">
                                Date: {event.eventDate.split("T")[0]} <br />Time: {event.eventTime}
                            </div>
                        </div>

                    </div>
                    <div className="">
                        <div className="flex items-center gap-4">
                            <MdLocationPin className="w-auto h-5 text-primarydark " />
                            <div className="flex flex-col gap-1">

                                <h1 className="text-md md:text-lg font-extrabold">Location</h1>
                                <div className="text-sm md:text-lg">
                                    {event.location}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
            
            {/* Ticket selection */}
            <div className="mt-10 flex justify-start ">
                <div className="p-8 bg-white shadow-md rounded-lg mx-4 max-w-xl border-solid border-4 border-gray-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Choose  Ticket Type
                    </h2>
                    <div className="space-y-4">
                        {event.tickets &&
                            event.tickets.map((ticket, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${selectedTicket?.type === ticket.type
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300"
                                        }`}
                                    onClick={() => handleTicketSelection(ticket)}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            id={`ticket-${index}`}
                                            name="ticket"
                                            value={ticket.type}
                                            onChange={() => handleTicketSelection(ticket)}
                                            checked={selectedTicket?.type === ticket.type}
                                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label
                                            htmlFor={`ticket-${index}`}
                                            className="text-lg font-medium text-gray-700"
                                        >
                                            {ticket.type}
                                        </label>
                                    </div>
                                    <span className="text-lg font-semibold text-gray-800">
                                        {ticket.price === 0 ? "Free" : `ETB ${ticket.price}`}
                                    </span>
                                </div>
                            ))}
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>



            <div className="mx-2 mt-5 text-md md:text-xl font-extrabold">
                Share with friends
                <div className="mt-10 flex gap-5 mx-10 md:mx-32 ">
                    <button onClick={handleCopyLink}>
                        <FaCopy className="w-auto h-6" />
                    </button>

                    <button onClick={handleWhatsAppShare}>
                        <FaWhatsappSquare className="w-auto h-6" />
                    </button>

                    <button onClick={handleFacebookShare}>
                        <FaFacebook className="w-auto h-6" />
                    </button>


                </div>
            </div>
        </div>
    )
}

