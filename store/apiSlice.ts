import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getShops: builder.query({
      query: (minRating: number = 0) => `/shops?minRating=${minRating}`,
    }),
    
    getProducts: builder.query({
      query: (params) => {
        let url = `/products?shopId=${params.shopId}`;
        if (params.category && params.category.length > 0) {
          url += `&category=${params.category.join(',')}`;
        }
        return url;
      },
    }),

    getRecommend: builder.mutation({
      query: (params) => ({
        url: '/ai/recommend',
        method: 'POST',
        body: params,
      }),
    }),
    getProductById: builder.query({
      query: (id: string) => `/products/${id}`,
    }),
  }),
});

export const { useGetShopsQuery, useGetProductsQuery, useGetRecommendMutation, useGetProductByIdQuery, useLazyGetProductByIdQuery } = apiSlice;
