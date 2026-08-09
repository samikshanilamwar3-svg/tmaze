export type TVMazeImage = {
  medium: string | null;
  original: string | null;
};

export type TVMazeEpisode = {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number | null;
  image: TVMazeImage | null;
  summary: string | null;
};

export type Movie = {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  genres: { id: number; name: string }[];
  popularity: number;
  vote_count: number;
  vote_average: number;
  video: boolean;
  adult: boolean;
  language: string;
  runtime: number | null;
  homepage: string | null;
  official_site: string | null;
  image: TVMazeImage | null;
  premiered: string | null;
  status: string | null;
  network: string | null;
  country: string | null;
  type: string | null;
  episodes: TVMazeEpisode[];
};

export type MovieDetail = Movie;
export type Appended_Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
};
