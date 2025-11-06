import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const orders = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET orders with dynamic query params
    getOrders: builder.query({
      query: ({  order, sortBy, page, limit }) => ({
        url: `/orders?order=${order}&sortBy=${sortBy}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [tagTypes.orders],
    }),

    // UPDATE order status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [tagTypes.orders],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = orders;
