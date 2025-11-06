import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const templates = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTemplate: builder.mutation({
      query: (data) => ({
        url: "/templates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.templates],
    }),
    // ✅ Get all templates
    getAllTemplates: builder.query({
      query: () => ({
        url: `/templates`,
        method: "GET",
      }),
      providesTags: [tagTypes.templates],
    }),

    // ✅ Delete template
    deleteTemplate: builder.mutation({
      query: (id) => {
        console.log(id)
        return {
          url: `/templates?id=${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [tagTypes.templates],
    }),
  }),
});

export const {
  useGetAllTemplatesQuery,
  useDeleteTemplateMutation,
  useAddTemplateMutation,
} = templates;
