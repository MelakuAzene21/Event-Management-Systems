const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const verifyToken = require("../middlewares/verifyToken");
// Fetch all tickets for a logged-in user
router.get("/user", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the verified token
        const tickets = await Ticket.find({ user: userId }).populate("event", "title ").populate("booking", "totalAmount  ticketType").populate("user", "name");

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: "No tickets found for this user." });
        }

        res.json(tickets);
    } catch (error) {
        console.error("Error fetching user tickets:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
