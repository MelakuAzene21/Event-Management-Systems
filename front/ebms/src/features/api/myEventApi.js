import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const eventsApi = createApi({
    reducerPath: "eventsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api",
        credentials: "include", // To send cookies for authentication
    }),
    tagTypes: ["Events"],
    endpoints: (builder) => ({
        getMyEvents: builder.query({
            query: () => "/events/myEvent",
            providesTags: ["Events"],
        }),
        getAttendeeCount: builder.query({
            query: (eventId) => `/events/${eventId}/attendeeCount`,
        }),
        deleteEvent: builder.mutation({
            query: (eventId) => ({
                url: `/events/delete/${eventId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Events"],
        }),
    }),
});

export const {
    useGetMyEventsQuery,
    useGetAttendeeCountQuery,
    useDeleteEventMutation,
} = eventsApi;
