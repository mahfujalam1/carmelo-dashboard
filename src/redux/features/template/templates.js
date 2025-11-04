import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const templates = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTemplates: builder.query({
      query: () => ({
        url: `/templates`,
        method: "GET",
      }),
      invalidatesTags:[tagTypes.templates]
    }),
  }),
});

export const { useGetAllTemplatesQuery } = templates;
