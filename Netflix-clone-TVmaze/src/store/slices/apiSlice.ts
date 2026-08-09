import { API_ENDPOINT_URL } from "src/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tvmazeApi = createApi({
  reducerPath: "tvmazeApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT_URL }),
  endpoints: () => ({}),
});
