import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/api/authApi';
import { eventApi } from '../features/api/eventApi';
import authReducer from '../features/slices/authSlice';
import eventReducer from '../features/slices/eventSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer, // Authentication state
        event: eventReducer, // Event state
        [authApi.reducerPath]: authApi.reducer, // Auth API
        [eventApi.reducerPath]: eventApi.reducer, // Event API
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(eventApi.middleware), // Include middleware for APIs
});
