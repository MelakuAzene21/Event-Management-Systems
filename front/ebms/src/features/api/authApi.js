import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://event-management-systems-gj91.onrender.com/api'
      : 'http://localhost:5000/api',
  credentials: 'include', // Include cookies in requests
});

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    tagTypes: ['User','Followers'], // Tag for invalidation
    endpoints: (builder) => ({
        // Signup Endpoint
       signup: builder.mutation({
          query: ({ formData, verifiedToken }) => ({
            url: '/auth/register',
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${verifiedToken}`,
            },
       }),        
          invalidatesTags: ['User'], // Invalidate user data
     }),

     //Send OTP (initiate registration)
        InitiateRegister: builder.mutation({
            query: (emailOnly) => ({
            url: '/auth/register/initiate',
            method: 'POST',
            body: emailOnly,
           }),
        }),
     //Verify OTP and complete registration
        VerifyOtpAndRegister: builder.mutation({
           query: (formData) => ({
             url: '/auth/register/verify-otp',
             method: 'POST',
             body: formData, // This should be FormData with fields: name, password, otp, etc.
           }),
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
            skip: (state) => !state.auth.user,  // Skip if no user exists in the state

        }),

        // Logout Endpoint
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'], // Clear user data
        }),
        
      uploadProfilePhoto: builder.mutation({
          query: ({ userId, file }) => {
           const formData = new FormData();
           formData.append("photo", file);

        return {
            url: `/uploads/upload-avatar/${userId}`, // Your backend API endpoint
            method: "PUT",
            body: formData,
            formData: true,
        };
         },
          invalidatesTags: ["User"], // Ensure UI updates after upload
         }),

        updateProfile: builder.mutation({
            query: ({ userId, updatedData }) => ({
                url: `/auth/updateProfile/${userId}`, // Match backend endpoint
                method: 'PUT',
                body: updatedData, // Pass updated data
            }),
            invalidatesTags: ['User'], // Invalidate cache for user
        }),

        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),

        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: `/auth/reset-password/${token}`,
                method: 'PUT',
                body: { password },
            }),
        }),
        getOrganizerFollowers: builder.query({
            query: (organizerId) => `/auth/organizers/${organizerId}/followers`,
            providesTags: (result, error, arg) => [{ type: "Followers", id: arg }],
        }),

        getOrganizer: builder.query({
            query: (id) => `/auth/organizer/${id}`,
        }),
        getOrganizers: builder.query({
            query: () => '/auth/organizers',
            providesTags: ['Organizers'],
        }),
        followOrganizer: builder.mutation({
            query: ({ userId, organizerId }) => ({
                url: `/auth/organizers/follow`,
                method: "POST",
                body: { userId, organizerId },
            }),
            invalidatesTags: (result, error, { organizerId }) => [
                { type: "Followers", id: organizerId },
            ],
        }),

    }),
});


export const {
    useSignupMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useUploadProfilePhotoMutation,
    useUpdateProfileMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useFollowOrganizerMutation,
    useGetOrganizerFollowersQuery,
    useGetOrganizerQuery,
    useGetOrganizersQuery,
    useInitiateRegisterMutation,
    useVerifyOtpAndRegisterMutation,
} = authApi;
