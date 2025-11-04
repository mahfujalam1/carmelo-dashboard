import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tagTypes";

export const baseApi = createApi({
  reducerPath: "CarmeloApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.20.44:3333/api/v1",
    // baseUrl: "http://192.168.10.169:8080/api/v1",
    prepareHeaders: (headers) => {
      // Retrieve the token from your store or local storage
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
