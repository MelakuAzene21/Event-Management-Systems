import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        pendingBooking: null, // Store booking details before payment
        currentBooking: null, // Store the latest booking
        bookings: [], // Store all user bookings
    },
    reducers: {
        setPendingBooking: (state, action) => {
            state.pendingBooking = action.payload; // Store booking details temporarily
        },
        clearPendingBooking: (state) => {
            state.pendingBooking = null; // Clear after payment
        },
        setCurrentBooking: (state, action) => {
            state.currentBooking = action.payload;
        },
        setUserBookings: (state, action) => {
            state.bookings = action.payload;
        },
    },
});

export const { setCurrentBooking, setUserBookings ,clearPendingBooking,setPendingBooking} = bookingSlice.actions;
export default bookingSlice.reducer;
