import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedReview: null, // Store selected review for editing
    error: null, // Store error messages
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
};

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        setSelectedReview: (state, action) => {
            state.selectedReview = action.payload;
        },
        clearSelectedReview: (state) => {
            state.selectedReview = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setSelectedReview, clearSelectedReview, setError, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
