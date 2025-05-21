import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api', // Base URL for event-related API
    credentials: 'include', // Include cookies for authentication
});

export const eventApi = createApi({
    reducerPath: 'eventApi',
    baseQuery,
    tagTypes: ['Event'], // Tag for cache invalidation
    endpoints: (builder) => ({
        // Fetch all events
        // getAllEvents: builder.query({
        //     query: () => '/getEvent',
        //     providesTags: ['Event'],
        // }),

        // Fetch all events, optionally with location parameters
        getAllEvents: builder.query({
            query: ({ latitude, longitude } = {}) => ({
                url: '/events/getEvent',
                params: latitude && longitude ? { latitude, longitude } : undefined,
            }),
            providesTags: ['Event'],
        }),
        // Fetch details of a single event
        getEventDetails: builder.query({
            query: (id) => `/events/${id}`,
            providesTags: ['Event'],
        }),
        // Fetch events created by the current organizer
        getMyEvents: builder.query({
            query: () => '/events/myEvent',
            providesTags: ['Event'],
        }),
        // Create a new event
        createEvent: builder.mutation({
            query: (eventData) => ({
                url: '/events/creatEvent',
                method: 'POST',
                body: eventData,
            }),
            invalidatesTags: ['Event'],
        }),
        // Update an existing event
        updateEvent: builder.mutation({
            query: ({ id, eventData }) => ({
                url: `/events/update/${id}`,
                method: 'PUT',
                body: eventData,
            }),
            invalidatesTags: ['Event'],
        }),
       //user like the events
        likeEvent: builder.mutation({
            query: ({ eventId, userId }) => ({
                url: `/events/userLike/${eventId}`,
                method: 'POST',
                body: { userId },
            }),
            invalidatesTags: ['Event'],
        }),
        // Delete an event
        deleteEvent: builder.mutation({
            query: (id) => ({
                url: `/events/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Event'],
        }),
        getCategories: builder.query({
            query: () => '/categories',
        }),
        getDashboardData: builder.query({
            query: () => '/events/dashboard',
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
    useLikeEventMutation,
    useGetCategoriesQuery,
    useGetDashboardDataQuery,
} = eventApi;
