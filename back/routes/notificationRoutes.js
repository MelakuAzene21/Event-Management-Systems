const express = require("express");
const router = express.Router();
const { getUserNotifications, markNotificationAsRead } = require("../controllers/notificationController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/:userId", getUserNotifications);
router.put("/:notificationId/read",  markNotificationAsRead);

module.exports = router;
