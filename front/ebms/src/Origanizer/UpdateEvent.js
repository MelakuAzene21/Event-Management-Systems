import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function UpdateEventPage() {
    const [event, setEvent] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/events/${id}`)
            .then((response) => {
                const event = response.data;
                setEvent(event);
                setTitle(event.title);
                setDescription(event.description);
                setEventDate(event.eventDate);
                setEventTime(event.eventTime);
                setTicketPrice(event.ticketPrice);
            })
            .catch((error) => {
                console.error("Error fetching event:", error);
            });
    }, [id]);

    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedEvent = {
            title,
            description,
            eventDate,
            eventTime,
            ticketPrice
        };

        axios.put(`http://localhost:5000/api/events/update/${id}`, updatedEvent,{withCredentials:true})
            .then(() => {
                navigate('/myEvent'); // Redirect to "My Events" page after successful update
            })
            .catch((error) => {
                console.error("Error updating event:", error);
            });
    };

    if (!event) return <p>Loading...</p>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Event</h1>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <label>Event Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Event Title"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />

                    <label>Event Description</label>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Event Description"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        rows="4"
                    />

                    <label className="flex flex-col">
                        Category:
                        <select
                            name="category"
                            className="rounded mt-2 pl-5 px-4 py-2 ring-sky-700 ring-2 border-none"

                        >
                            <option value="">Select Category</option>
                            <option value="music">music</option>
                            <option value="graduation">graduation</option>
                            <option value="education">Education</option>
                            <option value="business">Business</option>
                            <option value="entertainment">Entertainment</option>
                            {/* Add more options as needed */}
                        </select>
                    </label>
                    Date
                    <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    Time
                    <input
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    Price
                    <input
                        type="number"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        placeholder="Ticket Price"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Update Event
                    </button>
                </form>
            </div>
        </div>
    );
}
