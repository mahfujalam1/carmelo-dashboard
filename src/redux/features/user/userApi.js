import { baseApi } from "../../baseApi/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmin: builder.query({
      query: (args) => {
        console.log(args);
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: "/admin/all-users",
          method: "GET",
          params,
        };
      },
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: `/users`,
        method: "GET",
      }),
    }),
    usersGrowth: builder.query({
      query: (year) => ({
        url: `/users/growth?year=${year}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllAdminQuery, useGetAllUsersQuery, useUsersGrowthQuery } = userApi;
