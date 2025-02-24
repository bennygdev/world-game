-- Remove/comment create database and /c when you are dockerizing it
-- CREATE DATABASE worldgame;

-- \c worldgame;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  game_mode VARCHAR(20) NOT NULL,
  score INTEGER NOT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, game_mode)
);

CREATE TABLE user_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  game_mode VARCHAR(20) NOT NULL,
  total_games_played INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_played TIMESTAMP,
  UNIQUE (user_id, game_mode)
);