const Notification = require("../models/Notification");

const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// Mark a Notification as Read
const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        // Find the notification by ID and update it
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        // Update the notification status to "read"
        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ error: "Failed to mark notification as read" });
    }
};

module.exports = { getUserNotifications,markNotificationAsRead };
