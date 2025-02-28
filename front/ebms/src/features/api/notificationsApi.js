import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationsApi = createApi({
    reducerPath: "notificationsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: (userId) => `/notifications/${userId}`,
            providesTags: ["Notifications"],
        }),
        markAsRead: builder.mutation({
            query: ({ notificationId }) => ({
                url: `/notifications/${notificationId}/read`,
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } = notificationsApi;
