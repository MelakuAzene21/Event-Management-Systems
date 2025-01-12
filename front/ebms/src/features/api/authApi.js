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
            invalidatesTags: ['User'], // Invalidate user data
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

        // Get Current User Profile
        getCurrentUser: builder.query({
            query: () => '/auth/profile', // Profile endpoint
            providesTags: ['User'],
        }),

        // Logout Endpoint
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'], // Clear user data
        }),

        updateProfile: builder.mutation({
            query: ({ userId, updatedData }) => ({
                url: `/auth/updateProfile/${userId}`, // Match backend endpoint
                method: 'PUT',
                body: updatedData, // Pass updated data
            }),
            invalidatesTags: ['User'], // Invalidate cache for user
        }),

    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useUpdateProfileMutation,
} = authApi;
