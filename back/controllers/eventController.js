// const Event = require('../models/Event');
// const User = require('../models/User')
// const { cloudinary } = require('../utils/cloudinaryConfig');

// // Event creation handler with multiple image uploads
// exports.createEvent = async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             category,
//             eventDate,
//             eventTime,
//             location,
//             organizedBy,
//             ticketPrice,
//             Quantity,
//             tickets
//         } = req.body;

//         // Ensure tickets are provided
//         if (!tickets || tickets.length === 0) {
//             return res.status(400).json({ message: 'At least one ticket type is required' });
//         }

//         // Ensure at least one image is uploaded
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ message: 'At least one event image is required' });
//         }

//         // Ensure no more than 5 images are uploaded
//         if (req.files.length > 5) {
//             return res.status(400).json({ message: 'You can upload up to 5 images only' });
//         }

//         // Save image paths
//         const images = req.files.map(file => `/uploads/events/${file.filename}`);
       
       
//         // Cloudinary image URLs
//         // const images = req.files.map(file => file.path);
        
//         const ticketDetails = JSON.parse(tickets);

//         const newEvent = new Event({
//             title,
//             description,
//             category,
//             eventDate,
//             eventTime,
//             location,
//             organizedBy,
//             organizer: req.user._id, // Use the logged-in user ID as the organizer
//             ticketPrice: Number(ticketPrice),
//             Quantity: Number(Quantity),
//             image: images ,// Save array of image paths
//           tickets: ticketDetails, // Array of ticket details

//         });

//         const savedEvent = await newEvent.save();
//         res.status(201).json(savedEvent);
//     } catch (error) {
//         console.error('Error creating event:', error);
//         res.status(500).json({ message: 'Error creating event', error: error.message });
//     }
// };

const Event = require('../models/Event');
const mongoose = require("mongoose");
const User = require('../models/User');
const { cloudinary } = require('../utils/cloudinaryConfig');
const Booking = require('../models/Booking');
const Bookmark = require('../models/Bookmark')
const Notification = require("../models/Notification");
const io = require("../config/socket"); // Import WebSocket instance
const { getIO } = require("../config/socket");
const sendEmail =require("../helpers/Send-Email")
const Category = require('../models/Category');
const axios = require("axios");
const Ticket = require('../models/Ticket');


// Helper function to fetch coordinates from Nominatim
async function getCoordinates(location) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        location
    )}&format=json&limit=5&addressdetails=1`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'EventBookingApp/1.0 (your-email@example.com)' // Required by Nominatim
            }
        });

        if (response.data.length === 0) {
            console.log(`No results found for location: ${location}`);
            return null;
        }

        // Take the first location result
        const { lat, lon, display_name } = response.data[0];
        return {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)], // [longitude, latitude]
            name: display_name
        };
    } catch (error) {
        console.error(`Error fetching coordinates for ${location}:`, error.message);
        return null;
    }
}

// // Event creation handler with multiple image uploads
// exports.createEvent = async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             category,
//             eventDate,
//             eventTime,
//             location,
//             tickets // Expecting an array of { name, price, limit }
//         } = req.body;

//         // Get coordinates using Nominatim
//         console.log("Location name of event:", location);
//         const coordinates = await getCoordinates(location);
//         console.log("Coordinates for location:", coordinates);
//         if (!coordinates) {
//             return res.status(400).json({ message: "Invalid location or no results found" });
//         }

//         // Ensure tickets are provided
//         if (!tickets || tickets.length === 0) {
//             return res.status(400).json({ message: 'At least one ticket type is required' });
//         }

//         // Ensure at least one image is uploaded
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ message: 'At least one event image is required' });
//         }

//         // Ensure no more than 5 images are uploaded
//         if (req.files.length > 5) {
//             return res.status(400).json({ message: 'You can upload up to 5 images only' });
//         }

//         // Process images from Cloudinary
//         const images = req.files.map(file => file.path); // file.path gives the Cloudinary URL

//         // Ensure tickets are parsed correctly (handle both JSON and array cases)
//         const parsedTickets = typeof tickets === "string" ? JSON.parse(tickets) : tickets;

//         // Validate ticket details and ensure name exists
//         const formattedTickets = parsedTickets.map(ticket => ({
//             name: ticket.name?.trim(),
//             price: Number(ticket.price),
//             limit: Number(ticket.limit),
//         }));

//         // Check for missing ticket names
//         if (formattedTickets.some(ticket => !ticket.name)) {
//             return res.status(400).json({ message: "Each ticket type must have a name" });
//         }

//         // Create new event
//         const newEvent = new Event({
//             title,
//             description,
//             category,
//             eventDate,
//             eventTime,
//             location: coordinates, // Save as GeoJSON Point
//             organizer: req.user._id,
//             ticketTypes: formattedTickets,
//             images,
//         });

//         // Save to DB
//         const savedEvent = await newEvent.save();
//         const io = getIO();
//         const message = `🔔 New event "${newEvent.title}" created by ${req.user.name}, awaiting approval.`;

//         // Fetch all admins
//         const admins = await User.find({ role: "admin" });

//         for (const admin of admins) {
//             const newNotification = new Notification({
//                 userId: admin._id,
//                 eventId: newEvent._id,
//                 message,
//             });
//             await newNotification.save();

//             console.log(`📩 Sending notification to admin ${admin._id}`);
//             // Emit real-time notification if admin is online
//             if (io.sockets.adapter.rooms.get(admin._id.toString())) {
//                 io.to(admin._id.toString()).emit("event-approval-request", {
//                     _id: newNotification._id,
//                     message: newNotification.message,
//                     eventId: newNotification.eventId,
//                     isRead: newNotification.isRead,
//                 });
//             }
//         }

//         res.status(201).json(savedEvent);
//     } catch (error) {
//         console.error('Error creating event:', error.message, error.stack);
//         res.status(500).json({ message: 'Error creating event', error: error.message });
//     }
// };


exports.createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            eventDate,
            eventTime,
            location,
            tickets, // Expecting an array of { name, price, limit } or undefined for free events
            isFree, // Extract isFree from request body
        } = req.body;

        console.log('event date', eventDate);
        // Validate category ID
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        // Convert isFree to boolean (handles string "true"/"false" from FormData)
        const isFreeEvent = isFree === "true" || isFree === true;

        // // Get coordinates using Nominatim
        // console.log("Location name of event:", location);
        // const coordinates = await getCoordinates(location);
        // console.log("Coordinates for location:", coordinates);
        // if (!coordinates) {
        //     return res.status(400).json({ message: "Invalid location or no results found" });
        // }

        const parsedLocation = JSON.parse(location); // Parse JSON string

        // Ensure at least one image is uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one event image is required' });
        }

        // Ensure no more than 5 images are uploaded
        if (req.files.length > 5) {
            return res.status(400).json({ message: 'You can upload up to 5 images only' });
        }

        // Process images from Cloudinary
        const images = req.files.map(file => file.path); // file.path gives the Cloudinary URL

        let formattedTickets = [];
        if (!isFreeEvent) {
            // Ensure tickets are provided for non-free events
            if (!tickets || (Array.isArray(tickets) && tickets.length === 0)) {
                return res.status(400).json({ message: 'At least one ticket type is required for non-free events' });
            }

            // Ensure tickets are parsed correctly (handle both JSON string and array cases)
            const parsedTickets = typeof tickets === "string" ? JSON.parse(tickets) : tickets;

            // Validate ticket details and ensure name exists
            formattedTickets = parsedTickets.map(ticket => ({
                name: ticket.name?.trim(),
                price: Number(ticket.price),
                limit: Number(ticket.limit),
            }));

            // Check for missing ticket names
            if (formattedTickets.some(ticket => !ticket.name)) {
                return res.status(400).json({ message: "Each ticket type must have a name" });
            }
        }

        // Create new event
        const newEvent = new Event({
            title,
            description,
            category,
            eventDate,
            eventTime,
            location: parsedLocation, 
            organizer: req.user._id,
            ticketTypes: isFreeEvent ? [] : formattedTickets, // Empty array for free events
            images,
            isFree: isFreeEvent, // Set isFree based on request
        });

        // Save to DB
        const savedEvent = await newEvent.save();
        const io = getIO();
        const message = `🔔 New event "${newEvent.title}" created by ${req.user.name}, awaiting approval.`;

        // Fetch all admins
        const admins = await User.find({ role: "admin" });

        for (const admin of admins) {
            const newNotification = new Notification({
                userId: admin._id,
                eventId: newEvent._id,
                message,
            });
            await newNotification.save();

            console.log(`📩 Sending notification to admin ${admin._id}`);
            // Emit real-time notification if admin is online
            if (io.sockets.adapter.rooms.get(admin._id.toString())) {
                io.to(admin._id.toString()).emit("event-approval-request", {
                    _id: newNotification._id,
                    message: newNotification.message,
                    eventId: newNotification.eventId,
                    isRead: newNotification.isRead,
                });
            }
        }

        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event:', error.message, error.stack);
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

exports.getEventsAdmin = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'avatar name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};


// // Fetch events near a location
// exports.getEvents = async (req, res) => {
//     try {
//         // Extract query parameters and user ID
//         let { latitude, longitude } = req.query;
//         const userId = req.user?._id; // Optional: from authentication middleware

//         // Log incoming parameters
//         console.log('Query parameters:', { latitude, longitude, userId });

//         // Initialize userLocation
//         let userLocation = null;
//         let useGeoNear = true;

//         // Try to get user location from query parameters
//         if (latitude && longitude) {
//             latitude = parseFloat(latitude);
//             longitude = parseFloat(longitude);
//             userLocation = [longitude, latitude]; // MongoDB expects [longitude, latitude]

//             // Validate coordinates
//             if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
//                 console.log('Invalid query coordinates, will fetch all events');
//                 userLocation = null;
//                 useGeoNear = false;
//             } else {
//                 console.log('Valid query coordinates:', userLocation);
//             }
//         }

//         // If no valid query coordinates, try user profile if authenticated
//         if (!userLocation && userId) {
//             const user = await User.findById(userId).select('location');
//             if (user && user.location?.coordinates && user.location.coordinates.length === 2 && user.location.coordinates[0] !== 0 && user.location.coordinates[1] !== 0) {
//                 userLocation = user.location.coordinates;
//                 console.log('Using user location from profile:', userLocation);
//             } else {
//                 console.log('User location invalid or missing, will fetch all events');
//                 useGeoNear = false;
//             }
//         }

//         // If no valid location, fetch all approved events without geo sorting
//         let events;
//         if (!userLocation || !useGeoNear) {
//             console.log('Fetching all approved events without location sorting');
//             events = await Event.aggregate([
//                 {
//                     $match: {
//                         status: "approved",
//                         "location.coordinates": { $exists: true, $ne: [] }
//                     }
//                 },
//                 {
//                     $lookup: {
//                         from: "users",
//                         localField: "organizer",
//                         foreignField: "_id",
//                         as: "organizer"
//                     }
//                 },
//                 {
//                     $unwind: {
//                         path: "$organizer",
//                         preserveNullAndEmptyArrays: true
//                     }
//                 },
//                 {
//                     $project: {
//                         title: 1,
//                         description: 1,
//                         category: 1,
//                         eventDate: 1,
//                         eventTime: 1,
//                         location: 1,
//                         organizer: {
//                             _id: "$organizer._id",
//                             avatar: "$organizer.avatar",
//                             name: "$organizer.name",
//                             email: "$organizer.email"
//                         },
//                         ticketTypes: 1,
//                         images: 1,
//                         status: 1,
//                         isFree:1,
//                         likes: 1,
//                         usersLiked: 1,
//                         bookmarkedBy: 1,
//                         createdAt: 1,
//                         updatedAt: 1
//                     }
//                 },
//                 {
//                     $sort: { eventDate: 1 } // Sort by event date as fallback
//                 }
//             ]).catch((err) => {
//                 throw new Error(`MongoDB query error: ${err.message}`);
//             });
//         } else {
//             // Use $geoNear to fetch approved events sorted by distance
//             console.log('Executing MongoDB query with userLocation:', userLocation);
//             events = await Event.aggregate([
//                 {
//                     $geoNear: {
//                         near: {
//                             type: "Point",
//                             coordinates: userLocation
//                         },
//                         distanceField: "distance", // Add distance field (in meters)
//                         spherical: true,
//                         query: {
//                             status: "approved",
//                             "location.coordinates": { $exists: true, $ne: [] }
//                         }
//                     }
//                 },
//                 {
//                     $lookup: {
//                         from: "users",
//                         localField: "organizer",
//                         foreignField: "_id",
//                         as: "organizer"
//                     }
//                 },
//                 {
//                     $unwind: {
//                         path: "$organizer",
//                         preserveNullAndEmptyArrays: true
//                     }
//                 },
//                 {
//                     $project: {
//                         title: 1,
//                         description: 1,
//                         category: 1,
//                         eventDate: 1,
//                         eventTime: 1,
//                         location: 1,
//                         organizer: {
//                             _id: "$organizer._id",
//                             avatar: "$organizer.avatar",
//                             name: "$organizer.name",
//                             email: "$organizer.email"
//                         },
//                         ticketTypes: 1,
//                         images: 1,
//                         status: 1,
//                         isFree: 1,
//                         likes: 1,
//                         usersLiked: 1,
//                         bookmarkedBy: 1,
//                         createdAt: 1,
//                         updatedAt: 1,
//                         distance: 1 // Include distance in response
//                     }
//                 }
//             ]).catch((err) => {
//                 throw new Error(`MongoDB query error: ${err.message}`);
//             });
//         }

//         // Log the number of events found
//         console.log(`Found ${events.length} events`);

//         // Return events (empty array if none found)
//         res.status(200).json(events || []);
//     } catch (error) {
//         console.error('Error in getEvents:', error.message, error.stack);
//         res.status(500).json({ message: 'Error fetching events', error: error.message });
//     }
// };



exports.getEvents = async (req, res) => {
    try {
        // Extract query parameters and user ID
        let { latitude, longitude } = req.query;
        const userId = req.user?._id; // Optional: from authentication middleware

        // Log incoming parameters
        console.log('Query parameters:', { latitude, longitude, userId });

        // Initialize userLocation
        let userLocation = null;
        let useGeoNear = true;

        // Try to get user location from query parameters
        if (latitude && longitude) {
            latitude = parseFloat(latitude);
            longitude = parseFloat(longitude);
            userLocation = [longitude, latitude]; // MongoDB expects [longitude, latitude]

            // Validate coordinates
            if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                console.log('Invalid query coordinates, will fetch all events');
                userLocation = null;
                useGeoNear = false;
            } else {
                console.log('Valid query coordinates:', userLocation);
            }
        }

        // If no valid query coordinates, try user profile if authenticated
        if (!userLocation && userId) {
            const user = await User.findById(userId).select('location');
            if (user && user.location?.coordinates && user.location.coordinates.length === 2 && user.location.coordinates[0] !== 0 && user.location.coordinates[1] !== 0) {
                userLocation = user.location.coordinates;
                console.log('Using user location from profile:', userLocation);
            } else {
                console.log('User location invalid or missing, will fetch all events');
                useGeoNear = false;
            }
        }

        // If no valid location, fetch all approved events without geo sorting
        let events;
        if (!userLocation || !useGeoNear) {
            console.log('Fetching all approved events without location sorting');
            events = await Event.aggregate([
                {
                    $match: {
                        status: "approved",
                        "location.coordinates": { $exists: true, $ne: [] }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "organizer",
                        foreignField: "_id",
                        as: "organizer"
                    }
                },
                {
                    $unwind: {
                        path: "$organizer",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        category: {
                            _id: "$category._id",
                            name: "$category.name"
                        },
                        eventDate: 1,
                        eventTime: 1,
                        location: 1,
                        organizer: {
                            _id: "$organizer._id",
                            avatar: "$organizer.avatar",
                            name: "$organizer.name",
                            email: "$organizer.email"
                        },
                        ticketTypes: 1,
                        images: 1,
                        status: 1,
                        isFree: 1,
                        likes: 1,
                        usersLiked: 1,
                        bookmarkedBy: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                {
                    $sort: { eventDate: 1 } // Sort by event date as fallback
                }
            ]).catch((err) => {
                throw new Error(`MongoDB query error: ${err.message}`);
            });
        } else {
            // Use $geoNear to fetch approved events sorted by distance
            console.log('Executing MongoDB query with userLocation:', userLocation);
            events = await Event.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: userLocation
                        },
                        distanceField: "distance", // Add distance field (in meters)
                        spherical: true,
                        query: {
                            status: "approved",
                            "location.coordinates": { $exists: true, $ne: [] }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "organizer",
                        foreignField: "_id",
                        as: "organizer"
                    }
                },
                {
                    $unwind: {
                        path: "$organizer",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        category: {
                            _id: "$category._id",
                            name: "$category.name"
                        },
                        eventDate: 1,
                        eventTime: 1,
                        location: 1,
                        organizer: {
                            _id: "$organizer._id",
                            avatar: "$organizer.avatar",
                            name: "$organizer.name",
                            email: "$organizer.email"
                        },
                        ticketTypes: 1,
                        images: 1,
                        status: 1,
                        isFree: 1,
                        likes: 1,
                        usersLiked: 1,
                        bookmarkedBy: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        distance: 1 // Include distance in response
                    }
                }
            ]).catch((err) => {
                throw new Error(`MongoDB query error: ${err.message}`);
            });
        }

        // Log the number of events found
        console.log(`Found ${events.length} events`);

        // Return events (empty array if none found)
        res.status(200).json(events || []);
    } catch (error) {
        console.error('Error in getEvents:', error.message, error.stack);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
}; 
exports.eventDetails = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }

        const event = await Event.findById(id).populate("organizer", "name email avatar about organizationName" ).populate("category", "name");
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        let isBookmarked = false;
        // If the user is logged in, check if they have bookmarked the event
        if (req.user) {
            const existingBookmark = await Bookmark.findOne({
                userId: req.user._id,
                eventId: id,
            });
            isBookmarked = !existingBookmark; // true if bookmark exists, false otherwise
        }

        res.status(200).json({ ...event.toObject(), isBookmarked });
    } catch (error) {
        console.error("🚨 Error:", error);
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

// exports.UpdateEvent = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const event = await Event.findOne({ _id: id, organizer: req.user._id });
//         if (!event) {
//             return res.status(404).json({ error: "Event not found" });
//         }

//         // Update fields
//         Object.assign(event, req.body);
//         await event.save();

//         res.status(200).json(event);
//     } catch (error) {
//         console.error("Error updating event:", error);
//         res.status(500).json({ error: "Failed to update event" });
//     }
// }



exports.UpdateEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findOne({ _id: id, organizer: req.user._id });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Fetch attendees who booked the event
        const attendees = await Booking.find({ event: id, status: "booked" })
            .populate("user", "email name"); // Get user email & name

        // Update event details
        Object.assign(event, req.body);
        await event.save();

        // Send real-time notifications to attendees
        const io = getIO();
        const message = `📢 The event "${event.title}" has been updated!`;

        for (const attendee of attendees) {
            const newNotification = new Notification({
                userId: attendee.user._id,
                message,
                eventId: id,
            });
            await newNotification.save();

            console.log(`📩 Sending notification to user ${attendee.user._id}`);

            // Emit real-time notification
            io.to(attendee.user._id.toString()).emit("event-update", {
                _id: newNotification._id,
                message: newNotification.message,
                eventId: newNotification.eventId,
                isRead: newNotification.isRead,
            });

            // Send Email Notification 📧
            const emailSubject = `🔔 Update: Event "${event.title}" has been modified!`;
            const emailTemplate = "eventUpdate"; // Template name for event update emails
            const emailReplacements = {
                userName: attendee.user.name,
                eventTitle: event.title,
                eventDate: event.eventDate,
                eventLocation: event.location,
                eventDescription: event.description,
            };

            sendEmail(attendee.user.email, emailSubject, emailTemplate, emailReplacements);
        }

        res.status(200).json({ message: "Event updated successfully!" });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Failed to update event" });
    }
};

exports.approveOrRejectEvent = async (req, res) => {
    try {
        const { status } = req.body; // "approved" or "rejected"
        const event = await Event.findById(req.params.eventId).populate("organizer");

        if (!event) return res.status(404).json({ message: "Event not found" });

        event.status = status;
        await event.save();

        const io = getIO();
        const message = `🔔 Your event "${event.title}" has been ${status}.`;

        const newNotification = new Notification({
            userId: event.organizer._id,
            eventId: event._id,
            message,
        });
        await newNotification.save();

        console.log(`📩 Sending notification to organizer ${event.organizer._id}`);
        io.to(event.organizer._id.toString()).emit("event-update", {
            _id: newNotification._id,
            message: newNotification.message,
            eventId: newNotification.eventId,
            isRead: newNotification.isRead,
        });

        // sendEmail(event.organizer.email, `🔔 Event "${event.title}" ${status}`, "eventStatus", {
        //     eventTitle: event.title,
        //     status: status,
        // });

        res.json({ message: `Event ${status} successfully!`, event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

       
        // Allow admin to delete any event or the organizer to delete their own event
        if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
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
 

exports.userLike = async function (req, res) {
    try {
        const eventId = req.params.eventId;
        const userId = req.body.userId;

        console.log("User ID:", userId);
        console.log("Event ID:", eventId);

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Ensure usersLiked is an array and filter out null/undefined values
        event.usersLiked = (event.usersLiked || []).filter((id) => id != null);

        // Check if user has already liked
        const userHasLiked = event.usersLiked.some((id) => id.toString() === userId.toString());

        if (userHasLiked) {
            // Unlike event
            event.likes = Math.max(0, event.likes - 1);
            event.usersLiked = event.usersLiked.filter((id) => id.toString() !== userId.toString());
        } else {
            // Like event
            event.likes += 1;
            event.usersLiked.push(userId);
        }

        const updatedEvent = await event.save();

        res.json({
            likes: updatedEvent.likes,
            usersLiked: updatedEvent.usersLiked,
        });

    } catch (error) {
        console.error("Error liking/unliking the event:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports. getEventAttendeeCount = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Count the number of bookings where status is 'booked' for the specific event
        const attendeeCount = await Booking.countDocuments({ event: eventId, status: 'booked' });

        res.status(200).json({ attendeeCount });
    } catch (error) {
        console.error('Error fetching attendee count:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.getTopCities = async (req, res) => {
    try {
        // Aggregate events by city (location.name), count them, and sort by count
        const topCities = await Event.aggregate([
            { $match: { 'location.name': { $ne: null } } }, // Exclude events with no city name
            { $group: { _id: '$location.name', eventCount: { $sum: 1 } } },
            { $sort: { eventCount: -1 } }, // Sort by event count in descending order
        ]);

        // Map cities with placeholder images (you can replace these with real images)
        const citiesWithImages = topCities.map((city, index) => ({
            name: city._id,
            eventCount: city.eventCount,
            image: [
                'https://images.unsplash.com/photo-1496442226666-8d4d0e62f116?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // New York
                'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // San Francisco
                'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Chicago
                'https://images.unsplash.com/photo-1594819046782-0a5e9c9f7c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Nashville
            ][index % 5] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
        }));

        res.status(200).json(citiesWithImages);
    } catch (error) {
        console.error('Error fetching top cities:', error);
        res.status(500).json({ message: 'Failed to fetch top cities.' });
    }
};

exports.getEventsByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const events = await Event.find({ 'location.name': city })
            .populate('category')
            .populate('organizer')
            .exec();

        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events by city:', error);
        res.status(500).json({ message: 'Failed to fetch events for this city.' });
    }
};




// Helper to get the start of the current month
const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
};

// Helper to get revenue per month for the organizer
const getRevenuePerMonth = async (organizerId, year) => {
    const revenueByMonth = Array(12).fill(0);
    const bookings = await Booking.find({
        event: { $in: await Event.find({ organizer: organizerId }).distinct('_id') },
        status: 'booked',
        createdAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) },
    });

    bookings.forEach((booking) => {
        const month = booking.createdAt.getMonth();
        revenueByMonth[month] += booking.totalAmount;
    });

    return revenueByMonth;
};

// Helper to get ticket sales over time
const getTicketSalesOverTime = async (organizerId, startDate, endDate) => {
    const bookings = await Booking.find({
        event: { $in: await Event.find({ organizer: organizerId }).distinct('_id') },
        createdAt: { $gte: startDate, $lte: endDate },
    });

    const salesByDate = {};
    bookings.forEach((booking) => {
        const date = booking.createdAt.toISOString().split('T')[0];
        salesByDate[date] = (salesByDate[date] || 0) + booking.ticketCount;
    });

    return Object.entries(salesByDate).map(([date, count]) => ({ date, count }));
};

// Main dashboard controller
exports.getDashboardData = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: 'Organizer ID is required' });
        }
        const organizerId = req.user._id;

        // Total Events
        const totalEvents = await Event.countDocuments({ organizer: organizerId });
        const lastMonthEvents = await Event.countDocuments({
            organizer: organizerId,
            createdAt: { $gte: getStartOfMonth() },
        });

        // Ticket Sales
        const bookings = await Booking.find({
            event: { $in: await Event.find({ organizer: organizerId }).distinct('_id') },
            status: 'booked',
        });
        const totalTicketSales = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
        const lastMonthSales = bookings
            .filter((booking) => booking.createdAt >= getStartOfMonth())
            .reduce((sum, booking) => sum + booking.totalAmount, 0);
        const ticketSalesChange = lastMonthSales > 0 ? ((totalTicketSales - lastMonthSales) / lastMonthSales) * 100 : 0;

        // Total Attendees (Sum of booked tickets across all events)
        const events = await Event.find({ organizer: organizerId });
        let totalAttendees = 0;
        let lastMonthAttendees = 0;

        events.forEach((event) => {
            const bookedTickets = event.ticketTypes.reduce((sum, ticket) => sum + ticket.booked, 0);
            totalAttendees += bookedTickets;

            // Check if the event's date is within the last month for lastMonthAttendees
            if (event.eventDate >= getStartOfMonth()) {
                lastMonthAttendees += bookedTickets;
            }
        });

        // Upcoming Events (next 30 days)
        const upcomingEvents = await Event.find({
            organizer: organizerId,
            eventDate: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        }).populate('ticketTypes');

        // Recent Events (last 30 days)
        const recentEvents = await Event.find({
            organizer: organizerId,
            eventDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), $lte: new Date() },
        }).populate('ticketTypes');

        // Revenue Overview (by month for the current year)
        const revenueByMonth = await getRevenuePerMonth(organizerId, new Date().getFullYear());

        // Ticket Sales Over Time (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const ticketSalesOverTime = await getTicketSalesOverTime(organizerId, sixMonthsAgo, new Date());

        res.status(200).json({
            totalEvents,
            eventsChange: totalEvents - lastMonthEvents,
            totalTicketSales,
            ticketSalesChange: ticketSalesChange.toFixed(2),
            totalAttendees,
            attendeesChange: totalAttendees - lastMonthAttendees,
            upcomingEvents,
            recentEvents,
            revenueByMonth,
            ticketSalesOverTime,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get analytics data for attendees, vendors, and events by month
exports.getAnalyticsData = async (req, res) => {
    try {
        // Aggregate attendees (users with role 'user') by month
        const attendeeData = await User.aggregate([
            { $match: { role: 'user' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            {
                $project: {
                    month: '$_id.month',
                    year: '$_id.year',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Aggregate vendors (users with role 'vendor') by month
        const vendorData = await User.aggregate([
            { $match: { role: 'vendor' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            {
                $project: {
                    month: '$_id.month',
                    year: '$_id.year',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Aggregate events by month
        const eventData = await Event.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            {
                $project: {
                    month: '$_id.month',
                    year: '$_id.year',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                attendees: attendeeData,
                vendors: vendorData,
                events: eventData
            }
        });
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching analytics data'
        });
    }
};