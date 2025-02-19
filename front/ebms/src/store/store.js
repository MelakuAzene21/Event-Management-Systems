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
import { bookingApi } from '../features/api/bookingApi';
import authReducer from '../features/slices/authSlice';
import eventReducer from '../features/slices/eventSlice';
import bookingReducer from '../features/slices/bookingSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default: localStorage for web

//  Create persist configs for the slices you want to persist
const bookingPersistConfig = {
    key: 'booking',
    storage,
};

// Wrap the bookingReducer with persistReducer
const persistedBookingReducer = persistReducer(bookingPersistConfig, bookingReducer);

export const store = configureStore({
    reducer: {
        auth: authReducer,               // Authentication state
        event: eventReducer,             // Event state
        booking: persistedBookingReducer, // Persisted booking state
        [authApi.reducerPath]: authApi.reducer, // Auth API
        [eventApi.reducerPath]: eventApi.reducer, // Event API
        [bookingApi.reducerPath]: bookingApi.reducer, // Booking API
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable warning for non-serializable data
        })
            .concat(authApi.middleware)
            .concat(eventApi.middleware)
            .concat(bookingApi.middleware),
});

// Create persistor for your store
export const persistor = persistStore(store);
