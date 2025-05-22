import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api', // Backend API base URL
    credentials: 'include', // Include cookies in requests
});

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    tagTypes: ['User'], // Tag for invalidation
    endpoints: (builder) => ({
        // Signup Endpoint
        signup: builder.mutation({
            query: (newUser) => ({
                url: '/auth/register',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: ['User'],
        }),

        // Login Endpoint
        login: builder.mutation({
            query: (userCredentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: userCredentials,
            }),
            invalidatesTags: ['User'],
        }),

        // Fetch all users (✅ FIXED POSITION)
        getUsers: builder.query({
            query: () => '/auth/getAllUser', // Your API endpoint
            providesTags: ['User'],
        }),

        updateUser: builder.mutation({
            query: ({ userId, role, status }) => ({
                url: `auth/users/${userId}`,
                method: "PUT",
                body: { role, status },
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `auth/users/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"], // Invalidate cache after deletion
        }),
        // Get Current User Profile
        getCurrentUser: builder.query({
            query: () => '/auth/profile',
            providesTags: ['User'],
        }),
        getEvents: builder.query({
            query: () => "/events/getEvent",
            providesTags: ["Event"],
        }),
        getEventsAdmin: builder.query({
            query: () => "/events/AllEventAdmin",
            providesTags: ["Event"],
        }),
        updateEventStatus: builder.mutation({
            query: ({ eventId, status }) => ({
                url: `/events/${eventId}/status`,
                method: 'PUT',
                body: { status },
            }),
            // Optional: Invalidate cache to refresh events list
            invalidatesTags: ['Events'],
          }),
        getCategories: builder.query({
            query: () => '/categories',
        }),
        getAnalyticsData: builder.query({
            query: () => '/events/analytics',
          }),
        createCategory: builder.mutation({
            query: (category) => ({
                url: '/categories',
                method: 'POST',
                body: category,
            }),
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...category }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: category,
            }),
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
        }),
        //get eevnt details
        getEventDetails: builder.query({
            query: (id) => `/events/${id}`,
        }),
       
       
        // ✅ Fetch Upcoming Events
        getUpcomingEvents: builder.query({
            query: () => "/events/nearUpcoming",
            providesTags: ["Event"],
        }),

        // ✅ Fetch All Bookings & Total Revenue
        getBookings: builder.query({
            query: () => "/bookings/all-booking",
            providesTags: ["Booking"],
        }), 

        getMonthlyRevenue: builder.query({
            query: () => "/bookings/monthly-revenue",
        }),
        // Logout Endpoint
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),

        // Update Profile
        updateProfile: builder.mutation({
            query: ({ userId, updatedData }) => ({
                url: `/auth/updateProfile/${userId}`,
                method: 'PUT',
                body: updatedData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useUpdateProfileMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdateEventStatusMutation,
    useGetEventsQuery,
    useGetEventsAdminQuery,
    useGetEventDetailsQuery,
    useGetUpcomingEventsQuery,
    useGetBookingsQuery,
    useGetMonthlyRevenueQuery,
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,    
    useGetAnalyticsDataQuery,
} = authApi;
