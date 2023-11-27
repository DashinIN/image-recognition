import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const baseQuery = fetchBaseQuery({ baseUrl: 'https://digit-recognition-api.onrender.com' });

const baseQuery = fetchBaseQuery({ baseUrl: 'http://localhost:5000' });

export const imageLoadApi = createApi({
  baseQuery,
  endpoints: (builder) => ({
    imageLoad: builder.mutation({
      query: (formData) => ({
        url: '/classify',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useImageLoadMutation } = imageLoadApi;