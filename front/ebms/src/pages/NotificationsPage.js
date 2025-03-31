// import { useSelector,useDispatch } from "react-redux";
// import { Bell } from "lucide-react";
// import { formatDistanceToNow, parseISO } from "date-fns"; // Use parseISO for correct parsing
// import Title from "../layout/Title";
// import BackButton from "../layout/BackButton";
// import { useMarkAllAsReadMutation } from "../features/api/notificationsApi";
// import { useEffect } from "react";
// import { setNotifications } from "../features/slices/notificationSlice";
// const NotificationsPage = () => {
//     const notifications = useSelector((state) => state.notifications.notifications);
//     const dispatch = useDispatch();

//     const [markAllAsRead] = useMarkAllAsReadMutation();

//     useEffect(() => {
//         markAllAsRead();  // Mark notifications as read once
//     }, [markAllAsRead]);

//     useEffect(() => {
//         // Prevent unnecessary updates by checking if notifications are already updated
//         if (notifications.some(n => !n.isRead)) {
//             dispatch(setNotifications(notifications.map(n => ({ ...n, isRead: true }))));
//         }
//     }, [notifications, dispatch]);

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
//            <BackButton/>
//             <div className="flex items-center gap-3 mb-6">
//                 <Bell className="text-blue-600" size={28} />
//                 <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
//             </div>
//             <Title title={"Notification page"}/>
//             <div className="bg-white shadow-md rounded-lg p-4">
//                 {notifications.length === 0 ? (
//                     <p className="text-gray-500 text-center">No new notifications</p>
//                 ) : (
//                     <ul className="space-y-3">
//                         {notifications.map((notif) => {
//                             // Ensure createdAt is parsed correctly
//                             let timeAgo = "Just now";
//                             if (notif.createdAt) {
//                                 try {
//                                     const parsedDate = parseISO(notif.createdAt);
//                                     timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });
//                                 } catch (error) {
//                                     console.error("Invalid Date Format:", notif.createdAt);
//                                 }
//                             }

//                             return (
//                                 <li key={notif._id} className={`flex justify-between items-center p-4 rounded-lg transition-all ${notif.isRead ? "bg-gray-50" : "bg-blue-50"}`}>
//                                     <div>
//                                         <span className="text-gray-700">{notif.message}</span>
//                                         <p className="text-xs text-gray-500">{timeAgo}</p>
//                                     </div>
                                   
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default NotificationsPage;

import { useSelector, useDispatch } from "react-redux";
import { Bell, CheckCircle, Calendar, User, Ticket } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import Title from "../layout/Title";
import BackButton from "../layout/BackButton";
import { useMarkAllAsReadMutation } from "../features/api/notificationsApi";
import { useEffect, useState } from "react";
import { setNotifications } from "../features/slices/notificationSlice";
import { motion } from "framer-motion"; // For animations

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notifications.notifications);
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [activeTab, setActiveTab] = useState("All");
    const [filteredNotifications, setFilteredNotifications] = useState([]);

   
    // Filter notifications based on the active tab
    useEffect(() => {
        let filtered = notifications;

        if (activeTab === "Event Updates") {
            filtered = notifications.filter((notif) => notif.type === "event-update");
        } else if (activeTab === "New Registrations") {
            filtered = notifications.filter((notif) => notif.type === "new-registration");
        } else if (activeTab === "Bookings") {
            filtered = notifications.filter((notif) => notif.type === "booking");
        }

        setFilteredNotifications(filtered);
    }, [activeTab, notifications]);

    // Mark all notifications as read
    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead().unwrap();
            dispatch(setNotifications(notifications.map((n) => ({ ...n, isRead: true }))));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    // Count unread notifications
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <BackButton />
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
                        Notifications Center
                    </h2>
                    <p className="text-gray-500 mt-2">Stay updated with the latest event activities</p>
                </motion.div>
                <Title title="Notifications" />

                {/* Notifications Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                    {/* Header with Tabs and Mark All as Read */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <Bell className="text-blue-600" size={28} />
                            <h3 className="text-xl font-semibold text-gray-800">Your Notifications</h3>
                        </div>
                        {unreadCount > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            >
                                <CheckCircle size={18} />
                                Mark all as read
                                <span className="bg-white text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                                    {unreadCount}
                                </span>
                            </motion.button>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 px-6">
                        {["All", "Event Updates", "New Registrations", "Bookings"].map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ scale: 1.05 }}
                                className={`px-4 py-3 text-sm font-medium relative transition-colors ${activeTab === tab
                                        ? "text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                                        layoutId="underline"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Notifications List */}
                    <div className="p-6">
                        {filteredNotifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-10"
                            >
                                <Bell className="mx-auto text-gray-400" size={40} />
                                <p className="text-gray-500 mt-4 text-lg">No new notifications</p>
                                <p className="text-gray-400 text-sm">
                                    You're all caught up! Check back later for updates.
                                </p>
                            </motion.div>
                        ) : (
                            <ul className="space-y-4">
                                {filteredNotifications.map((notif) => {
                                    let timeAgo = "Just now";
                                    if (notif.createdAt) {
                                        try {
                                            const parsedDate = parseISO(notif.createdAt);
                                            timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });
                                        } catch (error) {
                                            console.error("Invalid Date Format:", notif.createdAt);
                                        }
                                    }

                                    return (
                                        <motion.li
                                            key={notif._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`relative p-5 rounded-xl transition-all shadow-sm border-l-4 ${notif.isRead
                                                    ? "bg-white border-gray-200"
                                                    : "bg-blue-50 border-blue-500"
                                                } hover:shadow-md`}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon based on notification type */}
                                                {notif.type === "event-update" && (
                                                    <Calendar className="text-blue-500 flex-shrink-0" size={24} />
                                                )}
                                                {notif.type === "new-registration" && (
                                                    <User className="text-green-500 flex-shrink-0" size={24} />
                                                )}
                                                {notif.type === "booking" && (
                                                    <Ticket className="text-purple-500 flex-shrink-0" size={24} />
                                                )}

                                                {/* Notification Content */}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {notif.type === "event-update" && "Event Update"}
                                                                {notif.type === "new-registration" && "New Registration"}
                                                                {notif.type === "booking" && "Booking Update"}
                                                            </p>
                                                            <p className="text-gray-600">{notif.message}</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">{timeAgo}</p>
                                                    </div>
                                                    {notif.link && (
                                                        <a
                                                            href={notif.link}
                                                            className="text-blue-500 text-sm hover:underline mt-2 inline-block"
                                                        >
                                                            View Details
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotificationsPage;