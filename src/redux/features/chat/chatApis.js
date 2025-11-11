import { baseApi } from "../../baseApi/baseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => ({
        url: "/chats/rooms",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetChatsQuery } = chatApi;
