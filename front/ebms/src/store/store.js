import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/api/authApi';
import { eventApi } from '../features/api/eventApi';
import {bookingApi} from '../features/api/bookingApi';
import authReducer from '../features/slices/authSlice';
import eventReducer from '../features/slices/eventSlice';
import bookingReducer from '../features/slices/bookingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer, // Authentication state
        event: eventReducer, // Event state
        booking: bookingReducer, // Add booking slice
        [authApi.reducerPath]: authApi.reducer, // Auth API
        [eventApi.reducerPath]: eventApi.reducer, // Event API
        [bookingApi.reducerPath]: bookingApi.reducer, // Booking API
      
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(eventApi.middleware) // Include middleware for APIs
            .concat(bookingApi.middleware) // Add booking middleware
});
