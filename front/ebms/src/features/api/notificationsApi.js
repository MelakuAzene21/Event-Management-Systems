import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationsApi = createApi({
    reducerPath: "notificationsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api",
        credentials: 'include', // Include cookies in requests
    }),
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        getUnreadNotifications: builder.query({
            query: () => "/notifications/unread-notifications",
            providesTags: ["Notifications"],
        }),
        markAllAsRead: builder.mutation({
            query: () => ({
                url: "/notifications/mark-as-read",
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const { useGetUnreadNotificationsQuery, useMarkAllAsReadMutation } = notificationsApi;
