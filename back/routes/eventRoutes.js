const express = require('express');
const Event=require('../models/Event')
const User=require('../models/User')
const { createEvent, getEvents, eventDetails, 
    getMyEvent, UpdateEvent, deleteEvent, 
    getMostNearUpcomingEvent, UserLike,
    AddToBookMark,RemoveBookMark,GetBookMarkEvents,getEventAttendeeCount} = require('../controllers/eventController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const router = express.Router();
const upload=require('../utils/multer')
router.post('/creatEvent', verifyToken,  upload.array('images', 5), createEvent);
router.get('/getEvent',  getEvents);
router.get('/nearUpcoming', getMostNearUpcomingEvent);

router.get('/myEvent', verifyToken, checkRole('organizer'), getMyEvent);
router.get('/:id', eventDetails);
router.put('/update/:id', verifyToken, checkRole('organizer'), UpdateEvent);
router.delete('/delete/:id', verifyToken, checkRole('organizer','admin'), deleteEvent);
// router.post('/userLike/:id', verifyToken,UserLike);
// router.post("/event/:id/bookmark", verifyToken, AddToBookMark);
// router.post("/event/:id/unbookmark", verifyToken, RemoveBookMark);
// router.get("/bookmarkedEvents", verifyToken, GetBookMarkEvents);


router.get('/:eventId/attendeeCount', getEventAttendeeCount);


// exports.UserLike=async(req,res)=>{
router.post("/userLike/:eventId",verifyToken, (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.body.userId; // Assume userId is passed from the frontend
    console.log("User ID:", userId);
    console.log("Event ID:", eventId);



    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    Event.findById(eventId)
        .then((event) => {
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            // Ensure usersLiked is an array and filter out any null or undefined values
            event.usersLiked = (event.usersLiked || []).filter((id) => id != null);

            // Check if the user has already liked this event
            const userHasLiked = event.usersLiked.some((id) => id.toString() === userId.toString());

            if (userHasLiked) {
                // If the user has already liked, remove their like (unlike)
                event.likes = Math.max(0, event.likes - 1); // Prevent negative likes
                event.usersLiked = event.usersLiked.filter((id) => id.toString() !== userId.toString());
            } else {
                // If the user hasn't liked, add their like
                event.likes += 1;
                event.usersLiked.push(userId);
            }
 
            return event.save();
        })
        .then((updatedEvent) => {
            res.json({
                // message: userHasLiked ? "Event unliked successfully" : "Event liked successfully",
                likes: updatedEvent.likes,
                usersLiked: updatedEvent.usersLiked,
            });
        })
        .catch((error) => {
            console.error("Error liking/unliking the event:", error);
            res.status(500).json({ message: "Server error" });
        });
});





// router.post("/event/:id/bookmark", verifyToken, async (req, res) => {
//     try {
//         const eventId = req.params.id;
//         const userId = req.user._id; // Assuming `verifyToken` middleware attaches the user object to req

//         await Event.findByIdAndUpdate(eventId, {
//             $addToSet: { bookmarkedBy: userId }
//         });
//         res.json({ success: true, message: 'Event bookmarked successfully' });
//     } catch (error) {
//         console.error("Error bookmarking event:", error);
//         res.status(500).json({ success: false, message: 'Error bookmarking event' });
//     }
// });

// router.post("/event/:id/unbookmark", verifyToken, async (req, res) => {
//     try {
//         const eventId = req.params.id;
//         const userId = req.user._id;

//         await Event.findByIdAndUpdate(eventId, {
//             $pull: { bookmarkedBy: userId }
//         });
//         res.json({ success: true, message: 'Event unbookmarked successfully' });
//     } catch (error) {
//         console.error("Error unbookmarking event:", error);
//         res.status(500).json({ success: false, message: 'Error unbookmarking event' });
//     }
// });


// router.get("/bookmarkedEvents", verifyToken, async (req, res) => {
//     try {
//         const events = await Event.find({ bookmarkedBy: req.user._id }).populate("owner", "name");
//         res.status(200).json(events);
//     } catch (error) {
//         console.error("Error fetching bookmarked events:", error);
//         res.status(500).json({ error: "Failed to fetch bookmarked events" });
//     }
// });
module.exports = router;
