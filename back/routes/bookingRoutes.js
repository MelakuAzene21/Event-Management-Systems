
// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../middlewares/verifyToken');
// const Booking = require('../models/Booking');
// const Event = require('../models/Event');
// const Ticket = require('../models/Ticket');
// const sendEmail = require('../helpers/Send-Email')
// const User=require("../models/User")
// // Create a booking
// router.post("/create-booking", verifyToken, async (req, res) => {
//     try {
//         req.body.user = req.user._id;

//         // Create a booking
//         const booking = await Booking.create(req.body);

//         // Find the event
//         const event = await Event.findById(req.body.event);
//         if (!event) {
//             return res.status(404).json({ message: "Event not found" });
//         }

//         // Iterate through the ticket types and ensure the 'booked' and 'available' properties are set/updated
//            let updatedTicketsTypes = event.ticketTypes.map(ticketType => {
           

//             if (ticketType.name === req.body.ticketType) {

//                 // If 'booked' doesn't exist, initialize it
//                 ticketType.booked = (ticketType.booked ?? 0) + Number(req.body.ticketCount);

//                 // If 'available' doesn't exist, initialize it as ticket limit - booked count
//                 ticketType.available = (ticketType.available ?? ticketType.limit) - Number(req.body.ticketCount);
           

//             }
//             return ticketType;
//         });

//         // Save the updated event
//         event.ticketTypes = updatedTicketsTypes;
//          await event.save();  // Save the event with updated ticketTypes

        
        
        

        
//         const tickets = [];

//         for (let i = 0; i < booking.ticketCount; i++) {
//             // Generate a unique ticket number
//             const ticketNumber = `TCK-${Date.now()}-${i}`;

            


//             // Generate QR code
//             const qrData = `${ticketNumber}-${req.user._id}-${req.body.event}`;  // Store only raw data
//             // Create ticket entry
//             const ticket = await Ticket.create({
//                 booking: booking._id,
//                 event: booking.event,
//                 user: booking.user,
//                 ticketNumber: ticketNumber,
//                 qrCode: qrData, // Store raw Qr code in tickets
//                 isUsed: false
//             });

//             tickets.push(ticket);
//         }
       

       
//         const attendee = await User.findById(req.body.user);

//                // Send Booking Confirmation Email
//         await sendEmail(attendee.email, "Your Ticket Booking Confirmation", "ticketConfirmation", {
//             name: attendee.name,
//             eventTitle: event.title,
//             eventDate: event.eventDate.toDateString(),
//             eventTime: event.eventTime,
//             eventLocation: event.location
//         });


   
       

//         return res.status(201).json({ message: "Booking Successfully Created", booking });

//     } catch (error) {
//         console.error('Error occurred: ', error); // Debugging error message
//         return res.status(500).json({ message: error.message });
//     }
// });


const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const sendEmail = require('../helpers/Send-Email');
const User = require("../models/User");
const QRCode = require("qrcode");

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

        // Update ticket availability
        let updatedTicketsTypes = event.ticketTypes.map(ticketType => {
            if (ticketType.name === req.body.ticketType) {
                ticketType.booked = (ticketType.booked ?? 0) + Number(req.body.ticketCount);
                ticketType.available = (ticketType.available ?? ticketType.limit) - Number(req.body.ticketCount);
            }
            return ticketType;
        });

        event.ticketTypes = updatedTicketsTypes;
        await event.save();

        // Generate tickets and QR codes
        const tickets = [];
        const qrCodeAttachments = [];

        for (let i = 0; i < booking.ticketCount; i++) {
            // Generate a unique ticket number
            const ticketNumber = `TCK-${Date.now()}-${i}`;

            // Generate QR code data
            const qrData = `${ticketNumber}-${req.user._id}-${req.body.event}`;

            // Generate QR code as Data URL
            const qrCodeImage = await QRCode.toDataURL(qrData);

            // Save ticket in the database
            const ticket = await Ticket.create({
                booking: booking._id,
                event: booking.event,
                user: booking.user,
                ticketNumber: ticketNumber,
                qrCode: qrData,
                isUsed: false
            });

            tickets.push(ticket);

            // Push QR code as an attachment
            qrCodeAttachments.push({
                filename: `Ticket-${i + 1}.png`,
                content: qrCodeImage.split("base64,")[1], // Extract base64 image data
                encoding: "base64"
            });
        }

        const attendee = await User.findById(req.body.user);

        // Create ticket details for email
        const ticketDetails = tickets.map((ticket, index) => `
            <p><strong>Ticket ${index + 1}:</strong> ${ticket.ticketNumber}</p>
        `).join('');

        // Send Booking Confirmation Email
        await sendEmail(attendee.email, "Your Ticket Booking Confirmation", "ticketConfirmation", {
            name: attendee.name,
            eventTitle: event.title,
            eventDate: event.eventDate.toDateString(),
            eventTime: event.eventTime,
            eventLocation: event.location,
            ticketCount: booking.ticketCount,
            ticketDetails: ticketDetails
        }, qrCodeAttachments);

        return res.status(201).json({ message: "Booking Successfully Created", booking });

    } catch (error) {
        console.error('Error occurred: ', error);
        return res.status(500).json({ message: error.message });
    }
});


// Fetch booking and QR code from ticket
router.get("/booking/:id", verifyToken, async (req, res) => {
    try {
        const tickets = await Ticket.find({booking:req.params.id});   // Find the booking
        if(!tickets||tickets.length===0){
            return res.status(404).json({ message: "Ticket not found for this Booking" });
        }
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//fetch all booking for all admin
router.get("/all-booking", verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name") // Only fetch the 'name' field from the User model
            .populate("event", "title eventDate"); // Fetch 'title' and 'eventDate' from Event model

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//fetch booking for a specific organizer event
router.get("/", verifyToken, async (req, res) => {
    try {
        const organizerId = req.user.id; // Assuming the logged-in user is an organizer

        // Find bookings where the event's organizer matches the logged-in user's ID
        const bookings = await Booking.find()
            .populate({
                path: "event",
                match: { organizer: organizerId }, // Filter events by the organizer
                select: "title eventDate" // Only select title and eventDate
            })
            .populate("user", "name") // Fetch the user's name
            .exec();

        // Remove bookings where the event is null (i.e., does not belong to the organizer)
        const filteredBookings = bookings.filter(booking => booking.event !== null);

        res.json(filteredBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/attendee", verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("user", "name") // Only fetch the 'name' field from the User model
            .populate("event", "title eventDate"); // Fetch 'title' and 'eventDate' from Event model

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//delete booking
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await booking.deleteOne();
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
