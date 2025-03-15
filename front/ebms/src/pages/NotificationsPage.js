import { useSelector,useDispatch } from "react-redux";
import { Bell } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns"; // Use parseISO for correct parsing
import Title from "../layout/Title";
import BackButton from "../layout/BackButton";
import { useMarkAllAsReadMutation } from "../features/api/notificationsApi";
import { useEffect } from "react";
import { setNotifications } from "../features/slices/notificationSlice";
const NotificationsPage = () => {
    const notifications = useSelector((state) => state.notifications.notifications);
    const dispatch = useDispatch();

    const [markAllAsRead] = useMarkAllAsReadMutation();

    useEffect(() => {
        markAllAsRead();  // Mark notifications as read once
    }, [markAllAsRead]);

    useEffect(() => {
        // Prevent unnecessary updates by checking if notifications are already updated
        if (notifications.some(n => !n.isRead)) {
            dispatch(setNotifications(notifications.map(n => ({ ...n, isRead: true }))));
        }
    }, [notifications, dispatch]);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
           <BackButton/>
            <div className="flex items-center gap-3 mb-6">
                <Bell className="text-blue-600" size={28} />
                <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
            </div>
            <Title title={"Notification page"}/>
            <div className="bg-white shadow-md rounded-lg p-4">
                {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center">No new notifications</p>
                ) : (
                    <ul className="space-y-3">
                        {notifications.map((notif) => {
                            // Ensure createdAt is parsed correctly
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
                                <li key={notif._id} className={`flex justify-between items-center p-4 rounded-lg transition-all ${notif.isRead ? "bg-gray-50" : "bg-blue-50"}`}>
                                    <div>
                                        <span className="text-gray-700">{notif.message}</span>
                                        <p className="text-xs text-gray-500">{timeAgo}</p>
                                    </div>
                                   
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
