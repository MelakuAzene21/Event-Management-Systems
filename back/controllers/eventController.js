const Event = require('../models/Event');
const User = require('../models/User')
// Event creation handler with multiple image uploads
exports.createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            eventDate,
            eventTime,
            location,
            organizedBy,
            ticketPrice,
            Quantity,
            tickets
        } = req.body;

        // Ensure tickets are provided
        if (!tickets || tickets.length === 0) {
            return res.status(400).json({ message: 'At least one ticket type is required' });
        }

        // Ensure at least one image is uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one event image is required' });
        }

        // Ensure no more than 5 images are uploaded
        if (req.files.length > 5) {
            return res.status(400).json({ message: 'You can upload up to 5 images only' });
        }

        // Save image paths
        const images = req.files.map(file => `/uploads/events/${file.filename}`);
        const ticketDetails = JSON.parse(tickets);

        const newEvent = new Event({
            title,
            description,
            category,
            eventDate,
            eventTime,
            location,
            organizedBy,
            organizer: req.user._id, // Use the logged-in user ID as the organizer
            ticketPrice: Number(ticketPrice),
            Quantity: Number(Quantity),
            image: images ,// Save array of image paths
          tickets: ticketDetails, // Array of ticket details

        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};
exports.getMostNearUpcomingEvent = async (req, res) => {
    try {
        const now = new Date();
        const limit = parseInt(req.query.limit) || 5; // Default limit to 15 if not provided

        const upcomingEvents = await Event.find({ eventDate: { $gte: now } })
            .sort({ eventDate: 1 }) // Sort by nearest date
            .limit(limit); // Use the dynamic limit

        res.json(upcomingEvents);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming events' });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

exports.eventDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findOne({ _id: id }); // Filter by event ID and owner
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch event" });
    }
};

exports.getMyEvent = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id });
        if (events.length === 0) {
            return res.status(200).json({ message: "You have not created any events yet." });
        }

        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching user's events:", error);
        res.status(500).json({ error: "Failed to fetch Organizer's events" });
    }
};

exports.UpdateEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findOne({ _id: id, organizer: req.user._id });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Update fields
        Object.assign(event, req.body);
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Failed to update event" });
    }
}


exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Allow admin to delete any event or the organizer to delete their own event
        if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to delete this event" });
        }

        // Use deleteOne to remove the event
        await Event.deleteOne({ _id: event._id });

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
};
 

// exports.UserLike = async (req, res) => {

//     // app.post("/event/:eventId", (req, res) => {
//     const eventId = req.params.eventId;
//     const userId = req.body.userId;  // Assume userId is passed from the frontend (either through cookies or authentication)

//     Event.findById(eventId)
//         .then((event) => {
//             if (!event) {
//                 return res.status(404).json({ message: "Event not found" });
//             }

//             // Check if the user has already liked this event
//             const userHasLiked = event.usersLiked.includes(userId);

//             if (userHasLiked) {
//                 // If the user has already liked, remove their like (unlike)
//                 event.likes -= 1;
//                 event.usersLiked = event.usersLiked.filter((id) => id.toString() !== userId.toString());
//             } else {
//                 // If the user hasn't liked, add their like
//                 event.likes += 1;
//                 event.usersLiked.push(userId);
//             }

//             return event.save();
//         })
//         .then((updatedEvent) => {
//             res.json(updatedEvent);
//         })
//         .catch((error) => {
//             console.error("Error liking/unliking the event:", error);
//             res.status(500).json({ message: "Server error" });
//         });
//     // });


// }




exports.AddToBookMark = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id; // Assuming `verifyToken` middleware attaches the user object to req

        await Event.findByIdAndUpdate(eventId, {
            $addToSet: { bookmarkedBy: userId }
        });
        res.json({ success: true, message: 'Event bookmarked successfully' });
    } catch (error) {
        console.error("Error bookmarking event:", error);
        res.status(500).json({ success: false, message: 'Error bookmarking event' });
    }
};




exports.RemoveBookMark = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        await Event.findByIdAndUpdate(eventId, {
            $pull: { bookmarkedBy: userId }
        });
        res.json({ success: true, message: 'Event unbookmarked successfully' });
    } catch (error) {
        console.error("Error unbookmarking event:", error);
        res.status(500).json({ success: false, message: 'Error unbookmarking event' });
    }
};



exports.GetBookMarkEvents = async (req, res) => {
    try {
        const events = await Event.find({ bookmarkedBy: req.user._id }).populate("owner", "name");
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching bookmarked events:", error);
        res.status(500).json({ error: "Failed to fetch bookmarked events" });
    }
};
