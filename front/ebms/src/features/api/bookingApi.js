import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
    reducerPath: "bookingApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api", credentials: "include" }),
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: "/bookings/create-booking",
                method: "POST",
                body: bookingData,
                    }),
        }),
        getUserBookings: builder.query({
            query: (userId) => `/bookings/user/${userId}`,
        }),


        getBookmarkedEvents: builder.query({
            query: () => `/bookmarks/bookmarkedEvents`,
            providesTags: ['Bookmarks'],
        }),

        //toggle bookmark events
        toggleBookmark: builder.mutation({
            query: (eventId) => ({
                url: `/bookmarks/event/${eventId}/toggle`,
                method: "POST",
            }),
            invalidatesTags: ['Bookmarks'], // optional if you're refetching bookmarks
        }),


        unbookmarkEvent: builder.mutation({
            query: (eventId) => ({
                url: `/bookmarks/event/${eventId}/unbookmark`,
                method: "DELETE",
            }),
            invalidatesTags: ['Bookmarks'],
        }),

        getAttendeeBookings: builder.query({
            query: () => "/bookings/attendee",
            providesTags: ['Bookings'],
        }),

        deleteBooking: builder.mutation({
            query: (bookingId) => ({
                url: `/bookings/${bookingId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Bookings'],
        }),
        initializePayment: builder.mutation({
            query: (paymentData) => ({
                url: 'payment/initialize',
                method: 'POST',
                body: paymentData,
            }),
        }),
        verifyTransaction: builder.query({
            query: (txRef) => `/payment/verify-transaction/${txRef}`,
        }),
        getBookingById: builder.query({
            query: (bookingId) => `/bookings/booking/${bookingId}`,
        }),

        getAllBookings: builder.query({
            query: () => ({
                url: "/bookings",
                method: "GET",
            }),
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useGetUserBookingsQuery,
    useToggleBookmarkMutation,
    useGetBookmarkedEventsQuery,
    useUnbookmarkEventMutation,
    useGetAttendeeBookingsQuery,
    useDeleteBookingMutation,
    useVerifyTransactionQuery,
    useGetBookingByIdQuery,
    useGetAllBookingsQuery,
    useInitializePaymentMutation,
} = bookingApi;
