const Notification = require("../models/Notification");

const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId ,isRead:false}).sort({ createdAt: -1 });
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


// Get unread notifications for an admin
const adminNotification= async(req, res) => {
    try {
        const { userId } = req.params;

        // Fetch only unread notifications
        const unreadNotifications = await Notification.find({
            userId,
            isRead: false,
        }).sort({ createdAt: -1 });

        res.json(unreadNotifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

const markNotificationAsReadAdmin= async (req, res) => {
    try {
        const { adminId } = req.body;
        const { notificationId } = req.body;  // Get notification ID from the request body


        // Update only the specific notification based on its ID
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { $set: { isRead: true } }
            
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        console.log(`Notification with ID ${notificationId} marked as read.`);

        res.status(200).json({
            message: "Notification marked as read.",
            notification: updatedNotification, // Return the updated notification
        });
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}


module.exports = { getUserNotifications,markNotificationAsRead,adminNotification,markNotificationAsReadAdmin };
