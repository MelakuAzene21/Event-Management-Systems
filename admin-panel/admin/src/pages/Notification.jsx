/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(
  process.env.NODE_ENV === "production"
    ? "https://event-management-systems-gj91.onrender.com"
    : "http://localhost:5000"
);

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("event-approval-request", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("event-approval-request");
    };
  }, []);

  return (
    <div>
      <h2>Admin Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notifications.map((notif, index) => (
          <div key={index}>
            <p>{notif.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
