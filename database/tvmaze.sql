-- TVmaze cache database schema.
-- The React application currently reads live metadata from TVmaze.
-- This schema is provided for a future PostgreSQL/MySQL sync service.

CREATE TABLE IF NOT EXISTS shows (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    language VARCHAR(100),
    status VARCHAR(100),
    premiered DATE,
    official_site TEXT,
    url TEXT,
    summary TEXT,
    image_medium TEXT,
    image_original TEXT,
    rating_average DECIMAL(4,2),
    runtime INTEGER,
    network_name VARCHAR(255),
    country_name VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS show_genres (
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (show_id, genre_id)
);

CREATE TABLE IF NOT EXISTS episodes (
    id INTEGER PRIMARY KEY,
    show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
    season INTEGER NOT NULL,
    episode_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    airdate DATE,
    airtime VARCHAR(20),
    runtime INTEGER,
    url TEXT,
    image_medium TEXT,
    image_original TEXT,
    summary TEXT
);

CREATE INDEX IF NOT EXISTS idx_shows_name ON shows(name);
CREATE INDEX IF NOT EXISTS idx_episodes_show_id ON episodes(show_id);
