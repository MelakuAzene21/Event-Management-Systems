const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
   {
        user : { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true }, // Reference to the user booking the event
        event: { type: mongoose.Schema.Types.ObjectId,
         ref: 'Event', 
         required: true }, // Reference to the event being booked
        ticketType: { type: String,
         required: true }, // e.g., "VIP", "Regular", "Student"
        ticketCount: { type: Number, 
        required: true }, // Number of tickets
       totalAmount: { type: Number,
        required: true }, // Total amount of the tickets
       paymentId: { type: String, required: true }, // Payment ID from the payment gateway
       status: { type: String, default:'booked'}, // Booking status, e.g., "Pending", "Confirmed", "Cancelled"

}

)
module.exports = mongoose.model('Booking', BookingSchema);