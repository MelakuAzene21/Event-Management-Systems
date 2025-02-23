import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/reviews" }),
    tagTypes: ["Reviews"],
    endpoints: (builder) => ({
        getReviews: builder.query({
            query: (eventId) => `/${eventId}`,
            providesTags: ["Reviews"],
        }),
        createReview: builder.mutation({
            query: (reviewData) => ({
                url: "/",
                method: "POST",
                body: reviewData,
            }),
            invalidatesTags: ["Reviews"],
        }),
        updateReview: builder.mutation({
            query: ({ reviewId, updatedReview }) => ({
                url: `/${reviewId}`,
                method: "PUT",
                body: updatedReview,
            }),
            invalidatesTags: ["Reviews"],
        }),
        deleteReview: builder.mutation({
            query: (reviewId) => ({
                url: `/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Reviews"],
        }),
    }),
});

export const {
    useGetReviewsQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
} = reviewApi;
