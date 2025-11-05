import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatus: builder.query({
      query: () => ({
        url: "/payments/total-earning",
        method: "GET",
      }),
    }),
    getNewOrder: builder.query({
      query: () => ({
        url: "/orders/pending",
        method: "GET",
      }),
      invalidatesTags: [tagTypes.orders],
    }),
    getIncomeRatio: builder.query({
      query: (year) => ({
        url: `/admin/getIncomeRatio?year=${year}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardStatusQuery, useGetIncomeRatioQuery, useGetNewOrderQuery } = dashboardApi;
