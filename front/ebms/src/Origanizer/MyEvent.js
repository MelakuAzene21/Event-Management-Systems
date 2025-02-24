// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { MdEdit, MdDelete } from "react-icons/md";

// export default function MyEventsPage() {
//     const [myEvents, setMyEvents] = useState([]);
//     const [loading, setLoading] = useState(true); // Added loading state

//     useEffect(() => {
//         setLoading(true); // Start loading
//         axios.get('http://localhost:5000/api/events/myEvent', { withCredentials: true })
//             .then((response) => {
//                 setMyEvents(Array.isArray(response.data) ? response.data : []);
//             })
//             .catch((error) => {
//                 console.error("Error fetching my events:", error);
//                 setMyEvents([]); // Ensure it remains an array
//             })
//             .finally(() => {
//                 setLoading(false); // Stop loading after API call
//             });
//     }, []);


//     const handleDelete = (eventId) => {
//         if (window.confirm("Are you sure you want to delete this event?")) {
//             axios.delete(`http://localhost:5000/event/${eventId}`, { withCredentials: true })
//                 .then(() => {
//                     setMyEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
//                 })
//                 .catch((error) => {
//                     console.error("Error deleting event:", error);
//                 });
//         }
//     };

//     return (
//         <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5">

//             <div className="flex justify-end mb-4">
//                 <Link to="/create-event">
//                     <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
//                         Create New Event
//                     </button>
//                 </Link>
//             </div>

//             {/* Show loading state */}
//             {loading ? (
//                 <p className="text-gray-500 text-center text-lg">Loading events...</p>
//             ) : myEvents.length === 0 ? (
//                 <p className="text-gray-500 text-center text-lg">You haven't created any events yet.</p>
//             ) : (
//                         <div className="overflow-x-auto shadow-lg rounded-lg">
//                             <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Total Event : { myEvents.length}</h1>

//                     <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                         <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
//                             <tr>
//                                 <th className="py-3 px-4 text-left border-b">Event Name</th>
//                                 <th className="py-3 px-4 text-left border-b">Date</th>
//                                 <th className="py-3 px-4 text-left border-b">Location</th>
//                                 <th className="py-3 px-4 text-center border-b">Registered Attendees</th>
//                                 <th className="py-3 px-4 text-center border-b">Tickets Available</th>
//                                 <th className="py-3 px-4 text-center border-b">Tickets Booked</th>
//                                 <th className="py-3 px-4 text-center border-b">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {myEvents.map((event) => (
//                                 <tr key={event._id} className="border-b hover:bg-gray-50 transition">
//                                     <td className="py-3 px-4">{event.title}</td>
//                                     <td className="py-3 px-4">{new Date(event.eventDate).toLocaleDateString()}</td>
//                                     <td className="py-3 px-4">{event.location || "N/A"}</td>
//                                     <td className="py-3 px-4 text-center">{event.registeredAttendees || 0}</td>
//                                     <td className="py-3 px-4 text-center">
//                                         {event.ticketTypes ? event.ticketTypes.reduce((total, type) => total + (type.available || 0), 0) : "N/A"}
//                                     </td>

//                                     <td className="py-3 px-4 text-center">
//                                         {event.ticketTypes ? event.ticketTypes.reduce((total, type) => total + (type.booked || 0), 0) : "N/A"}
//                                     </td>
//                                     <td className="py-3 px-4 flex justify-center space-x-4">
//                                         <Link to={`/updateEvent/${event._id}`}>
//                                             <button className="text-yellow-500 hover:text-yellow-600 text-xl">
//                                                 <MdEdit />
//                                             </button>
//                                         </Link>
//                                         <button
//                                             onClick={() => handleDelete(event._id)}
//                                             className="text-red-500 hover:text-red-600 text-xl"
//                                         >
//                                             <MdDelete />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }




import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdEdit, MdDelete } from "react-icons/md";

export default function MyEventsPage() {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendeeCounts, setAttendeeCounts] = useState({}); // Store attendee count for each event

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/api/events/myEvent', { withCredentials: true })
            .then((response) => {
                const events = Array.isArray(response.data) ? response.data : [];
                setMyEvents(events);

                // Fetch attendee count for each event
                events.forEach(event => {
                    axios.get(`http://localhost:5000/api/events/${event._id}/attendeeCount`)
                        .then((response) => {
                            setAttendeeCounts(prevCounts => ({
                                ...prevCounts,
                                [event._id]: response.data.attendeeCount
                            }));
                        })
                        .catch((error) => {
                            console.error(`Error fetching attendee count for event ${event._id}:`, error);
                        });
                });
            })
            .catch((error) => {
                console.error("Error fetching my events:", error);
                setMyEvents([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleDelete = (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            axios.delete(`http://localhost:5000/event/${eventId}`, { withCredentials: true })
                .then(() => {
                    setMyEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
                    setAttendeeCounts(prevCounts => {
                        const updatedCounts = { ...prevCounts };
                        delete updatedCounts[eventId];
                        return updatedCounts;
                    });
                })
                .catch((error) => {
                    console.error("Error deleting event:", error);
                });
        }
    };

    return (
        <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5">
            <div className="flex justify-end mb-4">
                <Link to="/create-event">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                        Create New Event
                    </button>
                </Link>
            </div>

            {loading ? (
                <p className="text-gray-500 text-center text-lg">Loading events...</p>
            ) : myEvents.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">You haven't created any events yet.</p>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        Total Events: {myEvents.length}
                    </h1>

                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4 text-left border-b">Event Name</th>
                                <th className="py-3 px-4 text-left border-b">Date</th>
                                <th className="py-3 px-4 text-left border-b">Location</th>
                                <th className="py-3 px-4 text-center border-b">Registered Attendees</th>
                                <th className="py-3 px-4 text-center border-b">Tickets Available</th>
                                <th className="py-3 px-4 text-center border-b">Tickets Booked</th>
                                <th className="py-3 px-4 text-center border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myEvents.map((event) => (
                                <tr key={event._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 px-4">{event.title}</td>
                                    <td className="py-3 px-4">{new Date(event.eventDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{event.location || "N/A"}</td>
                                    <td className="py-3 px-4 text-center">
                                        {attendeeCounts[event._id] !== undefined ? attendeeCounts[event._id] : "Loading..."}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {event.ticketTypes ? event.ticketTypes.reduce((total, type) => total + (type.available || 0), 0) : "N/A"}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {event.ticketTypes ? event.ticketTypes.reduce((total, type) => total + (type.booked || 0), 0) : "N/A"}
                                    </td>
                                    <td className="py-3 px-4 flex justify-center space-x-4">
                                        <Link to={`/updateEvent/${event._id}`}>
                                            <button className="text-yellow-500 hover:text-yellow-600 text-xl">
                                                <MdEdit />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="text-red-500 hover:text-red-600 text-xl"
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
