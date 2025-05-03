const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category        eventDate: { type: Date, required: true }, // If 'date' is the same as 'eventDate', you can remove one of them
        eventTime: { type: String, required: true },
        eventDate: { type: Date, required: true }, // Date of the event
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true }, // [longitude, latitude]
            name: { type: String, required: false } // e.g., "Addis Ababa"
        },
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user organizing the event
        user: { // Ensure this field exists
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        isFree: { type: Boolean, default: false }, // New field to indicate if event is free

        ticketTypes: [
            {
                name: { type: String, required: true }, // e.g., "VIP", "Regular", "Student"
                price: { type: Number, required: true }, // price of the ticket
                limit: { type: Number, required: true, min: 0 },// Number of tickets available
                booked: { type: Number, default: 0 }, // Number of tickets booked
                available: { type: Number, default: function () { return this.limit; } } // Number of tickets available
            }
        ],
        images: { type: [String], required: true }, // URL or path to an event image
        likes: { type: Number, default: 0 }, // Number of likes
        usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the event
        bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who bookmarked the event
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model('Event', eventSchema)