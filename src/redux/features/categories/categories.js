import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const categories = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: [tagTypes.categories],
    }),
    createCategory: builder.mutation({
      query: (data) => {
        return {
          url: "/categories",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.categories],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/categories/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.categories],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => {
        return {
          url: `/categories`,
          method: "DELETE",
          body: categoryId,
        };
      },
      invalidatesTags: [tagTypes.categories],
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = categories;
