import { baseApi } from "../../baseApi/baseApi";

const categories = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categories;