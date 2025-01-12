const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // Reference to the Event
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
        ticketNumber: { type: String, required: true, unique: true }, // Unique ticket number
        price: { type: Number, required: true }, // Ticket price (can be pulled from Event model)
        purchaseDate: { type: Date, default: Date.now }, // Date of purchase
        isUsed: { type: Boolean, default: false }, // Whether the ticket has been used (e.g., checked-in at the event)
        paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Payment status
        seatNumber: { type: String }, // Optional, if events have seat assignments
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Ticket', ticketSchema);
