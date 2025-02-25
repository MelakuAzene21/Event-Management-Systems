const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const verifyToken = require("../middlewares/verifyToken");

// Get event reports for the organizer
router.get("/", verifyToken, async (req, res) => {
    try {
        const { eventId, startDate, endDate } = req.query;
        const organizerId = req.user._id; // Assuming organizer ID comes from authentication middleware

        let eventFilter = { organizer: organizerId };
        if (eventId) {
            eventFilter._id = eventId;
        }

        // Fetch events created by the organizer
        const events = await Event.find(eventFilter);
        if (events.length === 0) {
            return res.status(200).json({ message: "No events found for this organizer." });
        }

        const eventIds = events.map(event => event._id);

        // Booking filter based on selected dates
        let bookingFilter = { event: { $in: eventIds } };
        if (startDate && endDate) {
            bookingFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        // Fetch all bookings related to the organizer's events
        const bookings = await Booking.find(bookingFilter);

        const totalBookings = bookings.length;
        const totalPending = bookings.filter(booking => booking.status === "pending").length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.status === "booked" ? booking.totalAmount : 0), 0);
        const totalTicketsSold = bookings.reduce((acc, booking) => acc + (booking.status === "booked" ? booking.ticketCount : 0), 0);

        res.status(200).json({
            totalBookings,
            totalPending,
            totalRevenue,
            totalTicketsSold,
        });

    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Failed to generate reports" });
    }
});

module.exports = router;
