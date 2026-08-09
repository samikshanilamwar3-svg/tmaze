import { CustomGenre } from "src/types/Genre";

export const API_ENDPOINT_URL =
  import.meta.env.VITE_TVMAZE_API_BASE_URL || "https://api.tvmaze.com";

export const MAIN_PATH = {
  root: "",
  browse: "browse",
  genreExplore: "genre",
  watch: "watch",
};

export const ARROW_MAX_WIDTH = 60;
export const COMMON_TITLES: CustomGenre[] = [
  { name: "Popular Shows", apiString: "popular" },
  { name: "Top Rated Shows", apiString: "top_rated" },
  { name: "Recently Premiered", apiString: "recent" },
  { name: "Drama", apiString: "drama" },
  { name: "Comedy", apiString: "comedy" },
  { name: "Action", apiString: "action" },
];

export const YOUTUBE_URL = "https://www.youtube.com/watch?v=";
export const APP_BAR_HEIGHT = 70;

export const INITIAL_DETAIL_STATE = {
  id: undefined,
  mediaType: undefined,
  mediaDetail: undefined,
};
