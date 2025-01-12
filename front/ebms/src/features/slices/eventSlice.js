import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
    name: 'event',
    initialState: {
        events: [],
        selectedEvent: null,
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        setEvents(state, action) {
            state.events = action.payload;
        },
        setSelectedEvent(state, action) {
            state.selectedEvent = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Optionally handle additional states if needed
    },
});

export const { setEvents, setSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;
