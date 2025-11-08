import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNews: builder.mutation({
      query: (formdata) => {
        return {
          url: "/news",
          method: "POST",
          body: formdata,
        };
      },
      invalidatesTags: [tagTypes.news],
    }),
    getAllNews: builder.query({
      query: () => ({
        url: "/news",
        method: "GET",
      }),
      providesTags: [tagTypes.news],
    }),
    getSingleNews: builder.query({
      query: (id) => ({
        url: `/news/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.news],
    }),
    updateNews: builder.mutation({
      query: ({ id, formData }) => {
        console.log("============", formData);
        return {
          url: `/news/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: [tagTypes.news],
    }),
    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.news],
    }),
  }),
});

export const {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useGetAllNewsQuery,
  useGetSingleNewsQuery,
  useUpdateNewsMutation,
} = newsApi;
