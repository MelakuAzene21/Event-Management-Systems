
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const QRCode = require('qrcode');
// Create a booking
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

 // Generate QR code
        // const qrData = `${booking._id}-${req.user._id}-${req.body.event}`;
        // const qrCode = await QRCode.toDataURL(qrData);

        // // Update booking with QR code
        // booking.qrCode = qrCode;


        const qrData = `${booking._id}-${req.user._id}-${req.body.event}`;  // Store only raw data
        booking.qrCode = qrData;
        await booking.save();

        return res.status(201).json({ message: "Booking Successfully Created", booking });

    } catch (error) {
        console.error('Error occurred: ', error); // Debugging error message
        return res.status(500).json({ message: error.message });
    }
});



// Fetch booking and QR code
router.get("/booking/:id", verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




// Fetch all bookings
router.get("/bookings", verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//delete booking
router.delete("/booking/:id", verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        await booking.remove();
        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//update booking
router.put("/booking/:id", verifyToken, async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Booking updated successfully", booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
