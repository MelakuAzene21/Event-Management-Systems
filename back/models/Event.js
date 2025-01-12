
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        category: { type: String },
        // date: { type: Date, required: true },
        eventDate: { type: Date,required:true }, // If 'date' is the same as 'eventDate', you can remove one of them
        eventTime: { type: String,required:true },
        location: { type: String ,required:true},
        organizedBy: { type: String }, // Could represent the organization name or similar
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user organizing the event
        // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Similar to organizer
        attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users attending the event
        Participants: { type: Number }, // Total number of participants
        Count: { type: Number }, // Count of something, needs clarification
        Income: { type: Number }, // Event-related income
        ticketPrice: { type: Number }, // Price per ticket
        Quantity: { type: Number }, // Number of tickets or items available
        image: { type: [String], required: true }, // URL or path to an event image
        likes: { type: Number, default: 0 }, // Number of likes
        usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the event
        bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who bookmarked the event
        Comment: [{ type: String }], // Comments on the event
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model('Event', eventSchema);
