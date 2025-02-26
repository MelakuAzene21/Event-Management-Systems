import React, { useState } from "react";
import { useCreateEventMutation } from "../features/api/eventApi";
import { toast } from "react-toastify";
const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        eventDate: "",
        eventTime: "",
        location: "",
        organizedBy: "",        
        images: [], // Holds the actual file objects
        tickets: [], // Holds the ticket information

    });

    const [imagePreviews, setImagePreviews] = useState([]); // Previews of the images
    const [newTicket, setNewTicket] = useState({ name: "", price: "" ,limit:""}); // Holds the new ticket information});

    const [createEvent] = useCreateEventMutation();

    // Handle input changes for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleTicketChange = (e) => {
        const { name, value } = e.target;
        setNewTicket({ ...newTicket, [name]: value });
    };

    const addTicket = () => {
        if (!newTicket.name || !newTicket.price|| !newTicket.limit) {
            toast.error("Please provide both ticket type and price.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            tickets: [...prev.tickets, newTicket],
        }));
        setNewTicket({ name: "", price: "" , limit: ""});
    };

    const removeTicket = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tickets: prev.tickets.filter((_, index) => index !== indexToRemove),
        }));
    };


    // Handle image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) {
            toast.error("No images selected!");
            return;
        }

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...files], // Add files to the images array
        }));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]); // Add previews
    };

    // Remove an image
    const handleRemoveImage = (indexToRemove) => {
        const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
        const updatedImages = formData.images.filter((_, index) => index !== indexToRemove);

        setImagePreviews(updatedPreviews);
        setFormData({ ...formData, images: updatedImages });
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }
        if (formData.tickets.length === 0) {
            toast.error("Please add at least one ticket type.");
            return;
        }
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === "images") {
                formData.images.forEach((image) => {
                    data.append("images", image);
                });
            } else if (key === "tickets") {
                data.append("tickets", JSON.stringify(formData.tickets));
            } 
            else {
                data.append(key, formData[key]);
            }
        });

        try {
            await createEvent(data).unwrap();
            toast.success("Event created successfully!");

            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "",
                eventDate: "",
                eventTime: "",
                location: "",
                organizedBy: "",                
                images: [],
                tickets: [],

            });
            setImagePreviews([]);
        } catch (error) {
            toast.error(error.data?.message || "Error creating event.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create an Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Event Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Event Date
                    </label>
                    <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Event Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Event Time
                    </label>
                    <input
                        type="time"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Organized By */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Organized By
                    </label>
                    <input
                        type="text"
                        name="organizedBy"
                        value={formData.organizedBy}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>



                {/* Tickets */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tickets</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="name"
                            value={newTicket.name}
                            onChange={handleTicketChange}
                            placeholder="Ticket Type (e.g., VIP)"
                            className="block w-full p-2 border rounded-md"
                        />
                        <input
                            type="number"
                            name="price"
                            value={newTicket.price}
                            onChange={handleTicketChange}
                            placeholder="Price"
                            className="block w-full p-2 border rounded-md"
                        />
                        <input
                            type="number"
                            name="limit"
                            value={newTicket.limit}
                            onChange={handleTicketChange}
                            placeholder="Quantity"
                            className="block w-full p-2 border rounded-md"
                        />
                        <button
                            type="button"
                            onClick={addTicket}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Add
                        </button>
                    </div>
                    <ul className="mt-4">
                        {formData.tickets.map((ticket, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span>{ticket.name} - ${ticket.price} - {ticket.limit} available</span>
                                <button
                                    type="button"
                                    onClick={() => removeTicket(index)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>


                

                <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleImageChange}
                        className="mt-1 block w-full"
                    />
                    {/* Display previews */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
