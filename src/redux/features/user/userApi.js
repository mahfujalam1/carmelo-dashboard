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
      query: ({page, limit}) => ({
        url: `/users?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
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

export const { useGetAllAdminQuery, useGetAllUsersQuery, useUsersGrowthQuery, useDeleteUserMutation } = userApi;
