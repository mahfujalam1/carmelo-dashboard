import { baseApi } from "../../baseApi/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatus: builder.query({
      query: () => ({
        url: "/payments/total-earning",
        method: "GET",
      }),
    }),
    getIncomeRatio: builder.query({
      query: (year) => ({
        url: `/admin/getIncomeRatio?year=${year}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardStatusQuery, useGetIncomeRatioQuery } = dashboardApi;
