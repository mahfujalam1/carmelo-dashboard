import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const termAndPolicy = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // addProduct: builder.mutation({
    //   query: (formdata) => {
    //     console.log("product data from apis file=>", formdata);
    //     return {
    //       url: "/products",
    //       method: "POST",
    //       body: formdata,
    //     };
    //   },
    //   invalidatesTags: [tagTypes.products],
    // }),

    getPolicy: builder.query({
      query: () => ({
        url: `/policies/policy`,
        method: "GET",
      }),
      providesTags: [tagTypes.policy],
    }),

    getTerms: builder.query({
      query: () => ({
        url: `/policies/terms`,
        method: "GET",
      }),
      providesTags: [tagTypes.terms],
    }),

    updatePolicy: builder.mutation({
      query: (content) => {
        console.log("formData from api =>", content);
        return {
          url: `/policies`,
          method: "PATCH",
          body: content,
        };
      },
      invalidatesTags: [tagTypes.terms, tagTypes.policy],
    }),
  }),
});

export const { useGetPolicyQuery, useGetTermsQuery, useUpdatePolicyMutation } =
  termAndPolicy;
