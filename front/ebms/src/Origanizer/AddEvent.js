import React, { useState } from "react";
import { useCreateEventMutation } from "../features/api/eventApi";
import toast from "react-hot-toast";

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        eventDate: "",
        eventTime: "",
        location: "",
        organizedBy: "",
        ticketPrice: "",
        Quantity: "",
        images: [], // Holds the actual file objects
    });

    const [imagePreviews, setImagePreviews] = useState([]); // Previews of the images
    const [createEvent] = useCreateEventMutation();

    // Handle input changes for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === "images") {
                formData.images.forEach((image) => {
                    data.append("images", image);
                });
            } else {
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
                ticketPrice: "",
                Quantity: "",
                images: [],
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

                {/* Ticket Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Ticket Price
                    </label>
                    <input
                        type="number"
                        name="ticketPrice"
                        value={formData.ticketPrice}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Quantity
                    </label>
                    <input
                        type="number"
                        name="Quantity"
                        value={formData.Quantity}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
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
