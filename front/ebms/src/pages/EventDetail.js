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
// import { useCreateBookingMutation } from "../features/api/bookingApi";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { setPendingBooking } from "../features/slices/bookingSlice";
import ReviewComponent from "../components/Reviews";
export default function EventPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null); // Track selected ticket
    const [ticketCounts, setTicketCounts] = useState({}); // Track ticket counts
    const [message, setMessage] = useState("");//show  booking status
    const navigate = useNavigate();

    // const [createBooking,{isLoading}]=useCreateBookingMutation();
    const transactionRef = uuidv4();

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    //! Fetching the event data from server by ID ------------------------------------------
    useEffect(() => {
        if (!id) {
            console.log('there is no event id');
            
            return;
        }
        axios.get(`http://localhost:5000/api/events/${id}`).then(response => {
          

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
        setTicketCounts((prev) => ({
            ...prev,
            [ticket.name]: prev[ticket.name] || 1, // Default to 1 if not set
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

        if (!selectedTicket) {
            alert("Please select a ticket type.");
            return;
        }

        // try {
        //     const response = await axios.post(
        //         "http://localhost:5000/api/bookings/create-booking",
        //         {   user: user._id,
        //             event: event._id,
        //             ticketType: selectedTicket.name,
        //             ticketCount: ticketCounts[selectedTicket.name] || 1,
        //             totalAmount:ticketCounts[selectedTicket.name] * selectedTicket.price,
        //         },
        //         {
        //            withCredentials: true
        //         }
        //     );
        //     setMessage(response.data.message);
        //     console.log("Bookin in respones now to test paylod", response.data);
        // } catch (error) {
        //     setMessage(error.response?.data?.message || "Booking failed");
        // }

        const bookingData = {
            user: user._id,
            event: event._id,
            ticketType: selectedTicket.name,
            ticketCount: ticketCounts[selectedTicket.name] || 1,
            totalAmount: ticketCounts[selectedTicket.name] * selectedTicket.price,
            paymentId: transactionRef,
        };

        dispatch(setPendingBooking(bookingData)); // Store booking info temporarily
        navigate(`/${id}/booking-summary`);

        // try {
        //     const response = await createBooking(bookingData).unwrap();
        //     dispatch(setCurrentBooking(response.booking)); // Store booking in Redux
        //     navigate(`/${id}/booking-summary`);

        // } catch (error) {
        //     console.error("Booking error:", error);
        //     alert("Booking failed");
        // }
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
                                     {event.images.map((imgUrl, index) => (
                                         <img
                                             key={index}
                                             src={`http://localhost:5000${imgUrl}`} // Ensure your backend serves images correctly
                                            // src= {event.image[0]}
                                            alt={`${event.title}`}
                                             className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
                                         />
                                    ))}
                                </div>
            </div>

            <div className="flex justify-between mt-8 mx-2">
                <h1 className="text-3xl md:text-5xl font-extrabold">{event.title.toUpperCase()}</h1>
               
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
            
            <ReviewComponent eventId={event?._id } attendeeId={ user?._id} />
            {/* Ticket Selection */}
            <div className="mt-10 p-8 bg-white shadow-md rounded-lg mx-4 max-w-xl border-4 border-gray-300">
                <h2 className="text-2xl font-bold mb-6">Choose a Ticket</h2>
                {message && <p className="text-green-600">{message}</p>}
                <div className="space-y-4">
                    {event.ticketTypes.map((ticket, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer hover:scale-105 transition-transform ${selectedTicket?.name === ticket.name ? "border-blue-500 bg-blue-50" : "border-gray-300"
                                }`}
                            onClick={() => handleTicketSelection(ticket)}
                        >
                            <div className="flex flex-col">
                                <span className="text-lg font-medium">{ticket.name}</span>
                                <span className="text-sm text-gray-600">{ticket.available ??ticket.limit} left</span>
                                <span className="text-sm text-gray-600">
                                {ticket.price === 0 ? <span className="text-blue-500 font-bold italic">Free</span> : `${ticket.price} ETB`}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="px-2 py-1 bg-gray-300 rounded"
                                    onClick={(e) => { e.stopPropagation(); handleDecrease(ticket); }}>
                                    -
                                </button>
                                <span className="px-3 py-1 border">{ticketCounts[ticket.name] || 1}</span>
                                <button
                                    className="px-2 py-1 bg-gray-300 rounded"
                                    onClick={(e) => { e.stopPropagation(); handleIncrease(ticket); }}>
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleBooking} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                    Confirm Booking
                </button>
            </div>

            {/* Share with friends */}
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

