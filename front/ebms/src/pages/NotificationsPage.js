// import { useSelector, useDispatch } from "react-redux";
// import { useMarkAsReadMutation } from "../features/api/notificationsApi";
// import { markNotificationAsRead } from "../features/slices/notificationSlice";
// import { Bell, CheckCircle } from "lucide-react";

// const NotificationsPage = () => {
//     const notifications = useSelector((state) => state.notifications.notifications);
//     const dispatch = useDispatch();
//     const [markAsRead] = useMarkAsReadMutation();

//     const handleMarkAsRead = async (notificationId) => {
//         await markAsRead({ notificationId });
//         dispatch(markNotificationAsRead(notificationId));
//     };

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen mt-16">
//             <div className="flex items-center gap-3 mb-6">
//                 <Bell className="text-blue-600" size={28} />
//                 <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
//             </div>
//             <div className="bg-white shadow-md rounded-lg p-4">
//                 {notifications.length === 0 ? (
//                     <p className="text-gray-500 text-center">No new notifications</p>
//                 ) : (
//                     <ul className="space-y-3">
//                         {notifications.map((notif) => (
//                             <li key={notif._id} className={`flex justify-between items-center p-4 rounded-lg transition-all ${notif.isRead ? "bg-gray-50" : "bg-blue-50"}`}>
//                                 <span className="text-gray-700">{notif.message}</span>
//                                 {!notif.isRead && (
//                                     <button
//                                         onClick={() => handleMarkAsRead(notif._id)}
//                                         className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition">
//                                         <CheckCircle size={18} /> Mark as Read
//                                     </button>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// };
// export default NotificationsPage;



import { useSelector, useDispatch } from "react-redux";
import { markNotificationAsRead } from "../features/slices/notificationSlice";
import { Bell, CheckCircle } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns"; // Use parseISO for correct parsing

const NotificationsPage = () => {
    const notifications = useSelector((state) => state.notifications.notifications);
    const dispatch = useDispatch();

    const handleMarkAsRead = (notificationId) => {
        dispatch(markNotificationAsRead(notificationId));
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
            <div className="flex items-center gap-3 mb-6">
                <Bell className="text-blue-600" size={28} />
                <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
            </div>
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
                                    {!notif.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notif._id)}
                                            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                                            <CheckCircle size={18} /> Mark as Read
                                        </button>
                                    )}
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
