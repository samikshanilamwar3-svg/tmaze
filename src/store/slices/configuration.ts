import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINT_URL } from "src/constant";

export const extendedApi = createApi({
  reducerPath: "tvmazeConfigurationApi",
  baseQuery: async () => ({ data: { images: { base_url: "" } } }),
  endpoints: (build) => ({
    getConfiguration: build.query<any, undefined>({
      queryFn: async () => ({ data: { images: { base_url: "" } } }),
    }),
  }),
});

export const { useGetConfigurationQuery } = extendedApi;
