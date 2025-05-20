
// import React, { useState } from "react";
// import { useCreateEventMutation } from "../features/api/eventApi";
// import { toast } from "react-toastify";
// import Title from "../layout/Title";
// import EventLocationInput from "../components/EventLocationInput";
// import BackButton from "../layout/BackButton";

// const CreateEvent = () => {
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         category: "",
//         eventDate: "",
//         eventTime: "",
//         location: "",
//         images: [],
//         tickets: [],
//     });

//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [newTicket, setNewTicket] = useState({ name: "", price: "", limit: "" });
//     const [isLoading, setIsLoading] = useState(false); // State for loader

//     const [createEvent] = useCreateEventMutation();

//     // Handle input changes for text fields
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleLocationSelect = (location) => {
//         setFormData({ ...formData, location });
//     };

//     const handleTicketChange = (e) => {
//         const { name, value } = e.target;
//         setNewTicket({ ...newTicket, [name]: value });
//     };

//     const addTicket = () => {
//         if (!newTicket.name || !newTicket.price || !newTicket.limit) {
//             toast.error("Please provide ticket name, price, and quantity.");
//             return;
//         }

//         setFormData((prev) => ({
//             ...prev,
//             tickets: [...prev.tickets, newTicket],
//         }));
//         setNewTicket({ name: "", price: "", limit: "" });
//     };

//     const removeTicket = (indexToRemove) => {
//         setFormData((prev) => ({
//             ...prev,
//             tickets: prev.tickets.filter((_, index) => index !== indexToRemove),
//         }));
//     };

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);

//         if (files.length === 0) {
//             toast.error("No images selected!");
//             return;
//         }

//         const newPreviews = files.map((file) => URL.createObjectURL(file));
//         setFormData((prevData) => ({
//             ...prevData,
//             images: [...prevData.images, ...files],
//         }));
//         setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
//     };

//     const handleRemoveImage = (indexToRemove) => {
//         const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
//         const updatedImages = formData.images.filter((_, index) => index !== indexToRemove);

//         setImagePreviews(updatedPreviews);
//         setFormData({ ...formData, images: updatedImages });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true); // Show loader

//         if (formData.images.length === 0) {
//             toast.error("Please upload at least one image.");
//             setIsLoading(false);
//             return;
//         }
//         if (formData.tickets.length === 0) {
//             toast.error("Please add at least one ticket type.");
//             setIsLoading(false);
//             return;
//         }

//         const data = new FormData();
//         Object.keys(formData).forEach((key) => {
//             if (key === "images") {
//                 formData.images.forEach((image) => {
//                     data.append("images", image);
//                 });
//             } else if (key === "tickets") {
//                 data.append("tickets", JSON.stringify(formData.tickets));
//             } else {
//                 data.append(key, formData[key]);
//             }
//         });

//         try {
//             await createEvent(data).unwrap();
//             toast.success("Event created successfully!");
//             setFormData({
//                 title: "",
//                 description: "",
//                 category: "",
//                 eventDate: "",
//                 eventTime: "",
//                 location: "",
//                 images: [],
//                 tickets: [],
//             });
//             setImagePreviews([]);
//         } catch (error) {
//             toast.error(error.data?.message || "Error creating event.");
//         } finally {
//             setIsLoading(false); // Hide loader
//         }
//     };

//     return (
//         <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-50">
//             <BackButton />
//             <Title title="Create event" />
//             <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Event</h2>
//             <p className="text-gray-500 mb-6">Fill in the details below to create your event</p>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Event Title */}
//                 <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
//                     <input
//                         type="text"
//                         name="title"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                         placeholder="Enter event title"
//                         required
//                         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 {/* Description */}
//                 <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                     <textarea
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         placeholder="Describe your event"
//                         required
//                         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         rows="4"
//                     />
//                 </div>

//                 {/* Category */}
//                 <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                     <select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
//                     >
//                         <option value="">Select a category</option>
//                         <option value="music">Music</option>
//                         <option value="graduation">Graduation</option>
//                         <option value="education">Educational</option>
//                         <option value="workshop">Workshop</option>
//                         <option value="entertainment">Entertainment</option>
//                     </select>
//                 </div>

//                 {/* Event Date and Time */}
//                 <div className="bg-white p-4 rounded-lg shadow-sm flex space-x-4">
//                     <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
//                         <div className="relative">
//                             <input
//                                 type="date"
//                                 name="eventDate"
//                                 value={formData.eventDate}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>
//                     <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
//                         <div className="relative">
//                             <input
//                                 type="time"
//                                 name="eventTime"
//                                 value={formData.eventTime}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Location */}
//                 <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//                     <EventLocationInput onSelect={handleLocationSelect} />
//                 </div>

//                 {/* Event Images */}
//                 <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="flex justify-between items-center mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Event Images</label>
//                         <label className="flex items-center space-x-2 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg">
//                             <svg
//                                 className="w-5 h-5"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
//                                 />
//                             </svg>
//                             <span>Upload Images</span>
//                             <input
//                                 type="file"
//                                 name="images"
//                                 multiple
//                                 onChange={handleImageChange}
//                                 className="hidden"
//                             />
//                         </label>
//                     </div>
//                     {imagePreviews.length === 0 ? (
//                         <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-lg">
//                             <svg
//                                 className="w-12 h-12 mx-auto text-gray-400"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
//                                 />
//                             </svg>
//                             <p className="text-gray-500 mt-2">No images uploaded. Upload images to preview them here</p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-3 gap-4">
//                             {imagePreviews.map((preview, index) => (
//                                 <div key={index} className="relative">
//                                     <img
//                                         src={preview}
//                                         alt="Preview"
//                                         className="w-full h-24 object-cover rounded-lg"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemoveImage(index)}
//                                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
//                                     >
//                                         X
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Ticket Information */}
//                 <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="flex justify-between items-center mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Ticket Information</label>
//                         <button
//                             type="button"
//                             onClick={addTicket}
//                             className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg"
//                         >
//                             <svg
//                                 className="w-5 h-5"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M12 4v16m8-8H4"
//                                 />
//                             </svg>
//                             <span>Add Ticket Type</span>
//                         </button>
//                     </div>
//                     {formData.tickets.length === 0 ? (
//                         <p className="text-gray-500">No tickets added yet.</p>
//                     ) : (
//                         formData.tickets.map((ticket, index) => (
//                             <div key={index} className="flex justify-between items-center mb-4">
//                                 <span>{ticket.name} - ${ticket.price} - {ticket.limit} available</span>
//                                 <button
//                                     type="button"
//                                     onClick={() => removeTicket(index)}
//                                     className="text-red-500"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         ))
//                     )}
//                     <div className="grid grid-cols-3 gap-4">
//                         <input
//                             type="text"
//                             name="name"
//                             value={newTicket.name}
//                             onChange={handleTicketChange}
//                             placeholder="e.g., General Admission"
//                             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <input
//                             type="number"
//                             name="price"
//                             value={newTicket.price}
//                             onChange={handleTicketChange}
//                             placeholder="$0.00"
//                             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <input
//                             type="number"
//                             name="limit"
//                             value={newTicket.limit}
//                             onChange={handleTicketChange}
//                             placeholder="100"
//                             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>

//                 {/* Submit Button with Loader */}
//                 <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
//                         }`}
//                 >
//                     {isLoading ? (
//                         <>
//                             <svg
//                                 className="animate-spin h-5 w-5 mr-3 text-white"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <circle
//                                     className="opacity-25"
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                     stroke="currentColor"
//                                     strokeWidth="4"
//                                 />
//                                 <path
//                                     className="opacity-75"
//                                     fill="currentColor"
//                                     d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
//                                 />
//                             </svg>
//                             Creating...
//                         </>
//                     ) : (
//                         "Create Event"
//                     )}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default CreateEvent;

import React, { useState } from "react";
import { useCreateEventMutation, useGetCategoriesQuery } from "../features/api/eventApi";
import { toast } from "react-toastify";
import Title from "../layout/Title";
import EventLocationInput from "../components/EventLocationInput";

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        eventDate: "",
        eventTime: "",
        location: null,
        images: [],
        tickets: [],
        isFree: false,
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [newTicket, setNewTicket] = useState({ name: "", price: "", limit: "" });
    const [isLoading, setIsLoading] = useState(false);

    const [createEvent] = useCreateEventMutation();
    const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLocationSelect = (location) => {
        setFormData({ ...formData, location });
    };

    const handleTicketChange = (e) => {
        const { name, value } = e.target;
        setNewTicket({ ...newTicket, [name]: value });
    };

    const handleFreeToggle = (e) => {
        const isFree = e.target.checked;
        setFormData((prev) => ({
            ...prev,
            isFree,
            tickets: isFree ? [] : prev.tickets,
        }));
        setNewTicket({ name: "", price: "", limit: "" });
    };

    const addTicket = () => {
        if (!newTicket.name || !newTicket.price || !newTicket.limit) {
            toast.error("Please provide ticket name, price, and quantity.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            tickets: [...prev.tickets, newTicket],
        }));
        setNewTicket({ name: "", price: "", limit: "" });
    };

    const removeTicket = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tickets: prev.tickets.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) {
            toast.error("No images selected!");
            return;
        }

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...files],
        }));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const handleRemoveImage = (indexToRemove) => {
        const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
        const updatedImages = formData.images.filter((_, index) => index !== indexToRemove);

        setImagePreviews(updatedPreviews);
        setFormData({ ...formData, images: updatedImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.category) {
            toast.error("Please select a category.");
            setIsLoading(false);
            return;
        }
        if (formData.images.length === 0) {
            toast.error("Please upload at least one image.");
            setIsLoading(false);
            return;
        }
        if (!formData.isFree && formData.tickets.length === 0) {
            toast.error("Please add at least one ticket type for paid events.");
            setIsLoading(false);
            return;
        }
        if (!formData.location) {
            toast.error("Please select a location on the map.");
            setIsLoading(false);
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
            } else if (key === "isFree") {
                data.append("isFree", formData.isFree);
            } else if (key === "location") {
                data.append("location", JSON.stringify(formData.location));
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            await createEvent(data).unwrap();
            toast.success("Event created successfully!");
            setFormData({
                title: "",
                description: "",
                category: "",
                eventDate: "",
                eventTime: "",
                location: null,
                images: [],
                tickets: [],
                isFree: false,
            });
            setImagePreviews([]);
        } catch (error) {
            toast.error(error.data?.message || "Error creating event.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-50">
            
            <Title title="Create event" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Event</h2>
            <p className="text-gray-500 mb-6">Fill in the details below to create your event</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Title */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter event title"
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Description */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your event"
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                    />
                </div>

                {/* Category */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    {categoriesLoading ? (
                        <p className="text-gray-500">Loading categories...</p>
                    ) : categoriesError ? (
                        <p className="text-red-500">Error loading categories</p>
                    ) : categories.length === 0 ? (
                        <p className="text-gray-500">No categories available</p>
                    ) : (
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Event Date and Time */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                        <div className="relative">
                            <input
                                type="time"
                                name="eventTime"
                                value={formData.eventTime}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <EventLocationInput onSelect={handleLocationSelect} />
                </div>

                {/* Event Images */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">Event Images</label>
                        <label className="flex items-center space-x-2 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                            </svg>
                            <span>Upload Images</span>
                            <input
                                type="file"
                                name="images"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    {imagePreviews.length === 0 ? (
                        <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-lg">
                            <svg
                                className="w-12 h-12 mx-auto text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                            </svg>
                            <p className="text-gray-500 mt-2">No images uploaded. Upload images to preview them here</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Free Event Toggle */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isFree"
                            checked={formData.isFree}
                            onChange={handleFreeToggle}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">This is a free event</span>
                    </label>
                </div>

                {/* Ticket Information (Conditional) */}
                {!formData.isFree && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">Ticket Information</label>
                            <button
                                type="button"
                                onClick={addTicket}
                                className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span>Add Ticket Type</span>
                            </button>
                        </div>
                        {formData.tickets.length === 0 ? (
                            <p className="text-gray-500">No tickets added yet.</p>
                        ) : (
                            formData.tickets.map((ticket, index) => (
                                <div key={index} className="flex justify-between items-center mb-4">
                                    <span>{ticket.name} - ${ticket.price} - {ticket.limit} available</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTicket(index)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                        <div className="grid grid-cols-3 gap-4">
                            <input
                                type="text"
                                name="name"
                                value={newTicket.name}
                                onChange={handleTicketChange}
                                placeholder="e.g., General Admission"
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                name="price"
                                value={newTicket.price}
                                onChange={handleTicketChange}
                                placeholder="$0.00"
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                name="limit"
                                value={newTicket.limit}
                                onChange={handleTicketChange}
                                placeholder="100"
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Submit Button with Loader */}
                <button
                    type="submit"
                    disabled={isLoading || categoriesLoading}
                    className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center ${isLoading || categoriesLoading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                        }`}
                >
                    {isLoading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 mr-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12ier"
                                    cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                                />
                            </svg>
                            Creating...
                        </>
                    ) : (
                        "Create Event"
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;