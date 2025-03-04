// src/features/slices/userslices.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],  // Initial state for users
    loading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setUsers, setLoading, setError } = usersSlice.actions;

export const usersReducer = usersSlice.reducer;
