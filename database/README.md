# TVmaze database

The frontend uses the public TVmaze API directly:

`https://api.tvmaze.com`

`tvmaze.sql` defines a relational cache for shows, genres, and episodes. It is intentionally separate from the frontend so the project can later add a Node/Express API or scheduled synchronization job.

TVmaze does not provide a Netflix-style copyrighted video-streaming database. Episode records contain metadata and links to TVmaze pages; they do not provide downloadable movie/episode video files.
