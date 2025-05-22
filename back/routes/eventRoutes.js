// const express = require('express');
// const { createEvent, getEvents, eventDetails,
//     getMyEvent, UpdateEvent, deleteEvent,
//     getMostNearUpcomingEvent, userLike,
//     getEventAttendeeCount,
//     approveOrRejectEvent,
//     getTopCities,
//     getEventsByCity} = require('../controllers/eventController');
// const verifyToken = require('../middlewares/verifyToken');
// const checkRole = require('../middlewares/checkRole');
// const router = express.Router();
// const upload=require('../utils/multer')


// router.post('/creatEvent', verifyToken,  upload, createEvent);
// router.get('/getEvent', getEvents);
// router.get('/nearUpcoming', getMostNearUpcomingEvent);
// router.get('/top-cities', getTopCities);
// router.get('/by-city/:city', getEventsByCity);
// router.put("/:eventId/status", approveOrRejectEvent);
// router.get('/myEvent', verifyToken, checkRole('organizer'), getMyEvent);
// router.get('/:id', eventDetails);
// router.put('/update/:id', verifyToken, checkRole('organizer'), UpdateEvent);
// router.delete('/delete/:id', verifyToken, checkRole('organizer','admin'), deleteEvent);
// router.post('/userLike/:eventId', verifyToken, userLike);
// router.get('/:eventId/attendeeCount', getEventAttendeeCount);

// module.exports = router;




const express = require('express');
const { createEvent, getEvents, eventDetails, getMyEvent, UpdateEvent, deleteEvent,
    getMostNearUpcomingEvent, userLike, getEventAttendeeCount, approveOrRejectEvent,
    getTopCities, getEventsByCity, 
    getDashboardData,
    getEventsAdmin,
    getAnalyticsData} = require('../controllers/eventController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const router = express.Router();
const upload = require('../utils/multer');

// Static routes first
router.get('/getEvent', getEvents);
router.get('/AllEventAdmin', getEventsAdmin);
router.get('/analytics', verifyToken, getAnalyticsData);

router.get('/nearUpcoming', getMostNearUpcomingEvent);
router.get('/myEvent', verifyToken, checkRole('organizer'), getMyEvent);
router.get('/top-cities', getTopCities); // Moved up
router.get('/by-city/:city', getEventsByCity); // Moved up, but still after static routes
router.get('/dashboard', verifyToken, getDashboardData)
 
// Dynamic routes after static routes
router.post('/creatEvent', verifyToken, upload, createEvent);
router.put("/:eventId/status", approveOrRejectEvent);
router.get('/:id', eventDetails); // Now this won't intercept /top-cities
router.put('/update/:id', verifyToken, checkRole('organizer'), UpdateEvent);
router.delete('/delete/:id', verifyToken, checkRole('organizer', 'admin'), deleteEvent);
router.post('/userLike/:eventId', verifyToken, userLike);
router.get('/:eventId/attendeeCount', getEventAttendeeCount);
module.exports = router;