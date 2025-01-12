import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/events', // Base URL for event-related API
    credentials: 'include', // Include cookies for authentication
});

export const eventApi = createApi({
    reducerPath: 'eventApi',
    baseQuery,
    tagTypes: ['Event'], // Tag for cache invalidation
    endpoints: (builder) => ({
        // Fetch all events
        getAllEvents: builder.query({
            query: () => '/getEvent',
            providesTags: ['Event'],
        }),
        // Fetch details of a single event
        getEventDetails: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['Event'],
        }),
        // Fetch events created by the current organizer
        getMyEvents: builder.query({
            query: () => '/myEvent',
            providesTags: ['Event'],
        }),
        // Create a new event
        createEvent: builder.mutation({
            query: (eventData) => ({
                url: '/creatEvent',
                method: 'POST',
                body: eventData,
            }),
            invalidatesTags: ['Event'],
        }),
        // Update an existing event
        updateEvent: builder.mutation({
            query: ({ id, eventData }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: eventData,
            }),
            invalidatesTags: ['Event'],
        }),
        // Delete an event
        deleteEvent: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Event'],
        }),
    }),
});

export const {
    useGetAllEventsQuery,
    useGetEventDetailsQuery,
    useGetMyEventsQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
} = eventApi;
