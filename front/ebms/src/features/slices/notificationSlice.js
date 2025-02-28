
// import { createSlice } from "@reduxjs/toolkit";

// const notificationSlice = createSlice({
//     name: "notifications",
//     initialState: {
//         notifications: [],
//     },
//     reducers: {
        
//         addNotification: (state, action) => {
//             const exists = state.notifications.some(notif => notif._id === action.payload._id);
//             if (!exists) {
//                 state.notifications.push(action.payload);
//             }
//         },
//         markNotificationAsRead: (state, action) => {
//             state.notifications = state.notifications.map(notif =>
//                 notif._id === action.payload ? { ...notif, isRead: true } : notif
//             );
//         },
//     },
// });

// export const { addNotification, markNotificationAsRead } = notificationSlice.actions;
// export default notificationSlice.reducer;




import { createSlice } from "@reduxjs/toolkit";

// Load notifications from local storage
const loadFromLocalStorage = () => {
    try {
        const storedNotifications = localStorage.getItem("notifications");
        return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
        console.error("Error loading notifications from local storage:", error);
        return [];
    }
};

// Save notifications to local storage
const saveToLocalStorage = (notifications) => {
    try {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    } catch (error) {
        console.error("Error saving notifications to local storage:", error);
    }
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: loadFromLocalStorage(), // Load from local storage on startup
    },
    reducers: {
        addNotification: (state, action) => {
            const exists = state.notifications.some(notif => notif._id === action.payload._id);
            if (!exists) {
                state.notifications.push(action.payload);
                saveToLocalStorage(state.notifications); // Persist to local storage
            }
        },
        markNotificationAsRead: (state, action) => {
            state.notifications = state.notifications.map(notif =>
                notif._id === action.payload ? { ...notif, isRead: true } : notif
            );
            saveToLocalStorage(state.notifications); // Persist to local storage
        },
    },
});

export const { addNotification, markNotificationAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;




