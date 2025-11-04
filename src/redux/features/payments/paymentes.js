import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const payments = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentesGrowth: builder.query({
      query: (year) => ({
        url: `/payments/growth?year=${year}`,
        method: "GET",
      }),
      invalidatesTags: [tagTypes.payments],
    }),
  }),
});

export const { useGetPaymentesGrowthQuery } = payments;