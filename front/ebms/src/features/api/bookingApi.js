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
    }),
});

export const { useCreateBookingMutation, useGetUserBookingsQuery } = bookingApi;
