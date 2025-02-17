import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        currentBooking: null, // Store the latest booking
        bookings: [], // Store all user bookings
    },
    reducers: {
        setCurrentBooking: (state, action) => {
            state.currentBooking = action.payload;
        },
        setUserBookings: (state, action) => {
            state.bookings = action.payload;
        },
    },
});

export const { setCurrentBooking, setUserBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
