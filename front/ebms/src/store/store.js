// import { configureStore } from '@reduxjs/toolkit';
// import { authApi } from '../features/api/authApi';
// import { eventApi } from '../features/api/eventApi';
// import {bookingApi} from '../features/api/bookingApi';
// import authReducer from '../features/slices/authSlice';
// import eventReducer from '../features/slices/eventSlice';
// import bookingReducer from '../features/slices/bookingSlice';

// export const store = configureStore({
//     reducer: {
//         auth: authReducer, // Authentication state
//         event: eventReducer, // Event state
//         booking: bookingReducer, // Add booking slice
//         [authApi.reducerPath]: authApi.reducer, // Auth API
//         [eventApi.reducerPath]: eventApi.reducer, // Event API
//         [bookingApi.reducerPath]: bookingApi.reducer, // Booking API
      
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware()
//             .concat(authApi.middleware)
//             .concat(eventApi.middleware) // Include middleware for APIs
//             .concat(bookingApi.middleware) // Add booking middleware
// });
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/api/authApi';
import { eventApi } from '../features/api/eventApi';
import { reportApi } from '../features/api/reportApi';
import { bookingApi } from '../features/api/bookingApi';
import authReducer from '../features/slices/authSlice';
import eventReducer from '../features/slices/eventSlice';
import bookingReducer from '../features/slices/bookingSlice';
import reviewReducer from '../features/slices/reviewSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default: localStorage for web
import { reviewApi } from '../features/api/reviewApi';
import { eventsApi } from '../features/api/myEventApi';
import { notificationsApi } from '../features/api/notificationsApi';
import notificationReducer, { setNotifications } from "../features/slices/notificationSlice";
import { socketMiddleware } from "../features/middleware/socketMiddleware";
import { ticketApi } from '../features/api/ticketApi';
import chatReducer from '../features/slices/chatSlice';

// Persist config for booking slice
const bookingPersistConfig = {
    key: 'booking',
    storage,
};

// Wrap booking reducer with persistReducer
const persistedBookingReducer = persistReducer(bookingPersistConfig, bookingReducer);

export const store = configureStore({
    reducer: {
        auth: authReducer,
        event: eventReducer,
        booking: persistedBookingReducer, // Persisted booking
        review: reviewReducer,
        notifications: notificationReducer,
        chats: chatReducer, // No persistence for chats
        [authApi.reducerPath]: authApi.reducer,
        [eventApi.reducerPath]: eventApi.reducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [reportApi.reducerPath]: reportApi.reducer,
        [eventsApi.reducerPath]: eventsApi.reducer,
        [ticketApi.reducerPath]: ticketApi.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
            .concat(authApi.middleware)
            .concat(eventApi.middleware)
            .concat(bookingApi.middleware)
            .concat(reviewApi.middleware)
            .concat(reportApi.middleware)
            .concat(eventsApi.middleware)
            .concat(ticketApi.middleware)
            .concat(notificationsApi.middleware)
            .concat(socketMiddleware)
});

// Fetch notifications when user logs in
store.dispatch(notificationsApi.endpoints.getUnreadNotifications.initiate())
    .then(({ data }) => {
        if (data) {
            store.dispatch(setNotifications(data));
        }
    });

// Create persistor for your store
export const persistor = persistStore(store);
