
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Title from '../layout/Title';
import BackButton from '../layout/BackButton';
import { useGetEventDetailsQuery,useUpdateEventMutation } from '../features/api/eventApi';
export default function UpdateEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: event, isLoading, isError } = useGetEventDetailsQuery(id);
    const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        eventTime: '',
        ticketPrice: '',
    });

    // Set form values when event data is fetched
    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                eventDate: event.eventDate?.slice(0, 10) || '',
                eventTime: event.eventTime || '',
                ticketPrice: event.ticketPrice || '',
            });
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateEvent({ id, eventData: formData }).unwrap();
            toast.success('Event Updated Successfully');
            navigate('/myEvent');
        } catch (err) {
            console.error("Error updating event:", err);
            toast.error('Error Updating Event');
        }
    };

    if (isLoading) return <p className="text-center mt-10">Loading event details...</p>;
    if (isError) return <p className="text-center mt-10 text-red-500">Failed to load event.</p>;

    return (
        <>
            <BackButton />
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8">
                    <Title title="Update Event Page" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Event</h1>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <label>Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Event Title"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />

                        <label>Event Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Event Description"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            rows="4"
                        />

                        <label className="flex flex-col">
                            Category:
                            <select
                                name="category"
                                onChange={handleChange}
                                className="rounded mt-2 pl-5 px-4 py-2 ring-sky-700 ring-2 border-none"
                            >
                                <option value="">Select Category</option>
                                <option value="music">Music</option>
                                <option value="graduation">Graduation</option>
                                <option value="education">Education</option>
                                <option value="business">Business</option>
                                <option value="entertainment">Entertainment</option>
                            </select>
                        </label>

                        <label>Date</label>
                        <input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />

                        <label>Time</label>
                        <input
                            type="time"
                            name="eventTime"
                            value={formData.eventTime}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />

                        <label>Price</label>
                        <input
                            type="number"
                            name="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={handleChange}
                            placeholder="Ticket Price"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className={`w-full py-3 mt-4 font-semibold rounded-lg shadow-md transition duration-300 ${isUpdating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            {isUpdating ? 'Updating...' : 'Update Event'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
