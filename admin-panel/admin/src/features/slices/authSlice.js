//src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/apiSlices';
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoading: false,
        isError: false,
        error: null,
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload; // Set the user information
        },
        logout(state) {
            state.user = null;
            state.isLoading = false;
            state.isError = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isLoading = false;
            })
            .addMatcher(authApi.endpoints.login.matchPending, (state) => {
                state.isLoading = true;
            })
            .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            });

        // Signup
        builder
            .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isLoading = false;
            })
            .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
                state.isLoading = true;
            })
            .addMatcher(authApi.endpoints.signup.matchRejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            });

        // Get Current User
        builder
            .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addMatcher(authApi.endpoints.getCurrentUser.matchPending, (state) => {
                state.isLoading = true;
            })
            .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            });

        // Logout
        builder
            .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
                state.user = null;
                state.isLoading = false;
            })
            .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
                state.isLoading = true;
            })
            .addMatcher(authApi.endpoints.logout.matchRejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.error.message;
            });
    },
});

export const { setUser, logout } = authSlice.actions; // Export setUser action

export default authSlice.reducer;
