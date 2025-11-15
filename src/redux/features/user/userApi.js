import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

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
      query: ({ page, limit }) => ({
        url: `/users?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags:[tagTypes.users]
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),
    udpateMyProfile: builder.mutation({
      query: (data) => {
        console.log("from apis", data);
        return {
          url: "/users",
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.users],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/password",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.users],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:[tagTypes.users]
    }),
    usersGrowth: builder.query({
      query: (year) => ({
        url: `/users/growth?year=${year}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllAdminQuery,
  useGetAllUsersQuery,
  useUsersGrowthQuery,
  useDeleteUserMutation,
  useUdpateMyProfileMutation,
  useChangePasswordMutation,
} = userApi;
