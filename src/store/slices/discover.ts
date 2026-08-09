import { tvmazeApi } from "./apiSlice";
import { MEDIA_TYPE, PaginatedMovieResult } from "src/types/Common";
import { Movie, MovieDetail, TVMazeEpisode } from "src/types/Movie";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState: Record<string, Record<string, PaginatedMovieResult>> = {};
export const initialItemState: PaginatedMovieResult = {
  page: 0, results: [], total_pages: 20, total_results: 0,
};

const discoverSlice = createSlice({
  name: "discover",
  initialState,
  reducers: {
    setNextPage: (state, action) => {
      const { mediaType, itemKey } = action.payload;
      if (state[mediaType]?.[itemKey]) state[mediaType][itemKey].page += 1;
    },
    initiateItem: (state, action) => {
      const { mediaType, itemKey } = action.payload;
      if (!state[mediaType]) state[mediaType] = {};
      if (!state[mediaType][itemKey]) state[mediaType][itemKey] = { ...initialItemState };
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      isAnyOf(
        extendedApi.endpoints.getVideosByMediaTypeAndCustomGenre.matchFulfilled,
        extendedApi.endpoints.getVideosByMediaTypeAndGenreId.matchFulfilled
      ),
      (state, action) => {
        const { page, results, total_pages, total_results, mediaType, itemKey } = action.payload;
        if (!state[mediaType]) state[mediaType] = {};
        if (!state[mediaType][itemKey]) state[mediaType][itemKey] = { ...initialItemState };
        state[mediaType][itemKey].page = page;
        const existing = new Set(state[mediaType][itemKey].results.map((v) => v.id));
        state[mediaType][itemKey].results.push(...results.filter((v: Movie) => !existing.has(v.id)));
        state[mediaType][itemKey].total_pages = total_pages;
        state[mediaType][itemKey].total_results = total_results;
      }
    );
  },
});

export const { setNextPage, initiateItem } = discoverSlice.actions;
export default discoverSlice.reducer;

const toMovie = (show: any): Movie => {
  const image = show.image || null;
  const genres = (show.genres || []).map((name: string, index: number) => ({
    id: genreId(name), name,
  }));
  const summary = (show.summary || "").replace(/<[^>]*>/g, "");
  return {
    id: show.id,
    title: show.name,
    original_title: show.name,
    original_language: show.language || "",
    overview: summary,
    release_date: show.premiered || "",
    poster_path: image?.medium || null,
    backdrop_path: image?.original || image?.medium || null,
    genre_ids: genres.map((g) => g.id),
    genres,
    popularity: Number(show.rating?.average || 0),
    vote_count: Number(show.weight || 0),
    vote_average: Number(show.rating?.average || 0),
    video: false,
    adult: false,
    language: show.language || "",
    runtime: show.runtime || show.averageRuntime || null,
    homepage: show.url || null,
    official_site: show.officialSite || null,
    image,
    premiered: show.premiered || null,
    status: show.status || null,
    network: show.network?.name || show.webChannel?.name || null,
    country: show.network?.country?.name || null,
    type: show.type || null,
    episodes: [],
  };
};

const genreId = (name: string) =>
  name.toLowerCase().trim().split(/\s+/).join("-").split("").reduce((a, c) => ((a * 31 + c.charCodeAt(0)) >>> 0), 7);

const normalizeEpisode = (e: any): TVMazeEpisode => ({
  id: e.id, url: e.url, name: e.name, season: e.season, number: e.number,
  airdate: e.airdate, airtime: e.airtime, airstamp: e.airstamp,
  runtime: e.runtime, image: e.image || null,
  summary: e.summary ? e.summary.replace(/<[^>]*>/g, "") : null,
});

const extendedApi = tvmazeApi.injectEndpoints({
  endpoints: (build) => ({
    getVideosByMediaTypeAndGenreId: build.query<PaginatedMovieResult & { mediaType: MEDIA_TYPE; itemKey: number | string },
      { mediaType: MEDIA_TYPE; genreId: number; page: number }>({
      query: ({ page }) => `/shows?page=${Math.max(page - 1, 0)}`,
      transformResponse: (response: any[], _, { mediaType, genreId, page }) => {
        const results = response.map(toMovie).filter((s) => s.genre_ids.includes(genreId));
        return { page, results, total_pages: 20, total_results: results.length, mediaType, itemKey: genreId };
      },
    }),
    getVideosByMediaTypeAndCustomGenre: build.query<PaginatedMovieResult & { mediaType: MEDIA_TYPE; itemKey: number | string },
      { mediaType: MEDIA_TYPE; apiString: string; page: number }>({
      query: ({ page }) => `/shows?page=${Math.max(page - 1, 0)}`,
      transformResponse: (response: any[], _, { mediaType, apiString, page }) => {
        let results = response.map(toMovie);
        if (["drama", "comedy", "action"].includes(apiString)) {
          results = results.filter((s) => s.genres.some((g) => g.name.toLowerCase() === apiString));
        } else if (apiString === "top_rated") {
          results.sort((a, b) => b.vote_average - a.vote_average);
        } else if (apiString === "recent") {
          results.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
        } else if (apiString === "popular") {
          results.sort((a, b) => b.popularity - a.popularity);
        }
        return { page, results, total_pages: 20, total_results: results.length, mediaType, itemKey: apiString };
      },
    }),
    getAppendedVideos: build.query<MovieDetail, { mediaType: MEDIA_TYPE; id: number }>({
      query: ({ id }) => `/shows/${id}?embed=episodes`,
      transformResponse: (show: any) => ({
        ...toMovie(show),
        episodes: (show._embedded?.episodes || []).map(normalizeEpisode),
      }),
    }),
    getSimilarVideos: build.query<PaginatedMovieResult, { mediaType: MEDIA_TYPE; id: number }>({
      query: () => `/shows?page=0`,
      transformResponse: (response: any[], _, { id }) => {
        const all = response.map(toMovie).filter((s) => s.id !== id);
        return { page: 1, total_pages: 1, total_results: all.length, results: all.slice(0, 12) };
      },
    }),
  }),
});

export const {
  useGetVideosByMediaTypeAndGenreIdQuery,
  useLazyGetVideosByMediaTypeAndGenreIdQuery,
  useGetVideosByMediaTypeAndCustomGenreQuery,
  useLazyGetVideosByMediaTypeAndCustomGenreQuery,
  useGetAppendedVideosQuery,
  useLazyGetAppendedVideosQuery,
  useGetSimilarVideosQuery,
  useLazyGetSimilarVideosQuery,
} = extendedApi;
