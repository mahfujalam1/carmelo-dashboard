import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => ({
        url: "/chats/rooms",
        method: "GET",
      }),
      providesTags: [tagTypes.chat],
    }),

    getMessages: builder.query({
      query: (roomId) => ({
        url: `/chats/messages/${roomId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.chat],
    }),

    sendFile: builder.mutation({
      query: (data) => ({
        url: `/chats`,
        method: "POST",
        body: data,
      }),
      providesTags: [tagTypes.chat],
    }),
  }),
});

export const { useGetChatsQuery, useGetMessagesQuery, useSendFileMutation } = chatApi;
