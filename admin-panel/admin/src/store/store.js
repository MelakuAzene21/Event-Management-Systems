// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/api/apislices'; // Correct import for RTK Query API
// import { usersReducer } from '../features/slices/userslices'; // Your user slice
import authReducer from '../features/slices/authSlice';

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,  // Add RTK Query reducer
        auth: authReducer, // Example slice for users (Optional if you still need custom state)
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),  // Add RTK Query middleware
});

export default store;
