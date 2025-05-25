import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ticketApi = createApi({
    reducerPath: 'ticketApi',
    baseQuery: fetchBaseQuery({
        baseUrl:
            process.env.NODE_ENV === "production"
                ? "https://event-management-systems-gj91.onrender.com/api"
                : "http://localhost:5000/api",
        credentials: 'include',
    }),
    tagTypes: ['Ticket'],
    endpoints: (builder) => ({
        getUserTickets: builder.query({
            query: () => '/tickets/user',
            providesTags: ['Ticket'],
        }),
        deleteTicket: builder.mutation({
            query: (id) => ({
                url: `/tickets/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Ticket'],
        }),
    }),
});

export const { useGetUserTicketsQuery, useDeleteTicketMutation } = ticketApi;
