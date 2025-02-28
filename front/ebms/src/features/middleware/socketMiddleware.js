import { io } from "socket.io-client";
import { addNotification } from "../slices/notificationSlice";

const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"], // Ensure compatibility
    withCredentials: true,  // Allow credentials
});

// Join the user room when they log in
export const setupSocket = (userId) => {
    if (userId) {
        socket.emit("join", userId);
        console.log(`User ${userId} joined socket`);
    }
};

// Middleware to listen for events
export const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    socket.on("event-update", (notification) => {
        console.log("🔔 New notification received:", notification); // Debugging
        store.dispatch(addNotification(notification)); // Add notification to Redux
    });

    return result;
};

export default socket;
