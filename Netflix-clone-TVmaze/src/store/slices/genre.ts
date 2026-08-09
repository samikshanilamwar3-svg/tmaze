import { Genre } from "src/types/Genre";
import { tvmazeApi } from "./apiSlice";

const genreId = (name: string) =>
  name.toLowerCase().trim().split(/\s+/).join("-").split("").reduce((a, c) => ((a * 31 + c.charCodeAt(0)) >>> 0), 7);

const extendedApi = tvmazeApi.injectEndpoints({
  endpoints: (build) => ({
    getGenres: build.query<Genre[], string>({
      query: () => "/shows?page=0",
      transformResponse: (shows: any[]) => {
        const names = new Set<string>();
        shows.forEach((show) => (show.genres || []).forEach((g: string) => names.add(g)));
        return Array.from(names).sort().map((name) => ({ id: genreId(name), name }));
      },
    }),
  }),
});

export const { useGetGenresQuery, endpoints: genreSliceEndpoints } = extendedApi;
