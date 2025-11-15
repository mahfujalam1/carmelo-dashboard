import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/signin",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    
    getMyProfile: builder.query({
      query: (data) => ({
        url: "/auth/me",
        method: "GET",
        body: data,
      }),
      providesTags:[tagTypes.users]
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMyProfileQuery,
} = authApi;
