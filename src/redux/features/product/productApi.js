import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (formdata) => {
        console.log("product data from apis file=>", formdata);
        return {
          url: "/products",
          method: "POST",
          body: formdata,
        };
      },
      invalidatesTags: [tagTypes.products],
    }),

    getAllProducts: builder.query({
      query: (page, limit) => ({
        url: `/products/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [tagTypes.products],
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.products],
    }),

    updateProduct: builder.mutation({
      query: ({ id, formdata }) => {
        console.log("formData from api =>", formdata); // This is just for debugging; remove it in production.
        return {
          url: `/products/${id}`,
          method: "PATCH",
          body: formdata, // Ensure that formdata is passed correctly as FormData
        };
      },
      invalidatesTags: [tagTypes.products],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.products],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} = productApi;
