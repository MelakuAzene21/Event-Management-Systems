import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const eventsApi = createApi({
    reducerPath: "eventsApi",
    baseQuery: fetchBaseQuery({
        baseUrl:
            process.env.NODE_ENV === "production"
                ? "https://event-management-systems-gj91.onrender.com/api"
                : "http://localhost:5000/api",
        credentials: "include", // To send cookies for authentication
    }),
    tagTypes: ["Events"],
    endpoints: (builder) => ({
        getMyEvents: builder.query({
            query: () => "/events/myEvent",
            providesTags: ["Events"],
        }),
        getEventReviews: builder.query({
            query: (eventId) => `/reviews/${eventId}`,
            providesTags: (result, error, id) => [{ type: "Reviews", id }],
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
    useGetEventReviewsQuery,
} = eventsApi;
