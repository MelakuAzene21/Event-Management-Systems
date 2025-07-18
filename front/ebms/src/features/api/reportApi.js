// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const reportApi = createApi({
//     reducerPath: 'reportApi',
//     baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api', credentials: 'include', }),
//     tagTypes: ['Report'],
//     endpoints: (builder) => ({
//         fetchReports: builder.query({
//             query: ({ eventId, startDate, endDate }) => {
//                 let query = `reports?`;
//                 if (eventId) query += `eventId=${eventId}&`;
//                 if (startDate && endDate) query += `startDate=${startDate}&endDate=${endDate}`;
//                 return query;
//             },
//             providesTags: ['Report'],
//         }),
//     }),
// });

// export const { useFetchReportsQuery } = reportApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: fetchBaseQuery({
        baseUrl:
            process.env.NODE_ENV === "production"
                ? "https://event-management-systems-gj91.onrender.com/api"
                : "http://localhost:5000/api",
        credentials: "include"
    }),
    tagTypes: ["Report"],
    endpoints: (builder) => ({
        fetchReports: builder.query({
            query: ({ eventId, startDate, endDate }) => {
                let query = `reports?`;
                if (eventId) query += `eventId=${eventId}&`;
                if (startDate && endDate) query += `startDate=${startDate}&endDate=${endDate}`;
                return query;
            },
            providesTags: ["Report"],
        }),
    }),
});

export const { useFetchReportsQuery } = reportApi;
