import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MyEventsPage() {
    const [myEvents, setMyEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/events/myEvent',{withCredentials:true})
            .then((response) => {
                setMyEvents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching my events:", error);
                // navigate('/login');
            });
    }, []);

    const handleDelete = (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            axios.delete(`http://localhost:5000/event/${eventId}`,{ withCredentials: true })
                .then(() => {
                    setMyEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
                })
                .catch((error) => {
                    console.error("Error deleting event:", error);
                });
        }
    };

    return (
        <div className=" flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5 flex-grow">
            <div className=" mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">My Events</h1>

                <div className="flex justify-end ">
                    <Link to="/create-event">
                        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
                            Create New Event
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myEvents.length === 0 ? (
                        <p className="text-gray-500 text-center col-span-full">You haven't created any events yet.</p>
                    ) : (
                        myEvents.map((event) => (
                            <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <img
                                    // src={`http://localhost:5000${event.image[0]}`}
                                    src={event.image[0]}
                                    alt={event.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                                    <p className="text-gray-600 mt-2 truncate">{event.description}</p>
                                    <p className="text-sm text-gray-500 mt-2">Date: {event.eventDate}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <Link to={`/updateEvent/${event._id}`}>
                                            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
