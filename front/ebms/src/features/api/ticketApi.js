import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ticketApi = createApi({
    reducerPath: 'ticketApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api', // adjust if needed
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
