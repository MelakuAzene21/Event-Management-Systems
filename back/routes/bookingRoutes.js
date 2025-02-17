
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

router.post("/create-booking", verifyToken, async (req, res) => {
    try {
        req.body.user = req.user._id;

        // Create a booking
        const booking = await Booking.create(req.body);

        // Find the event
        const event = await Event.findById(req.body.event);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Iterate through the ticket types and ensure the 'booked' and 'available' properties are set/updated
           let updatedTicketsTypes = event.ticketTypes.map(ticketType => {
           

            if (ticketType.name === req.body.ticketType) {

                // If 'booked' doesn't exist, initialize it
                ticketType.booked = (ticketType.booked ?? 0) + Number(req.body.ticketCount);

                // If 'available' doesn't exist, initialize it as ticket limit - booked count
                ticketType.available = (ticketType.available ?? ticketType.limit) - Number(req.body.ticketCount);
           

            }
            return ticketType;
        });

        // Save the updated event
        event.ticketTypes = updatedTicketsTypes;
        const updatedEvent = await event.save();  // Save the event with updated ticketTypes
        console.log("Event saved after update:", updatedEvent); // Debugging the saved event


        return res.status(201).json({ message: "Booking Successfully Created", booking });

    } catch (error) {
        console.error('Error occurred: ', error); // Debugging error message
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
