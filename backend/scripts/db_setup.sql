-- Database setup script for production deployment
-- Run this on your hosted database to set up the initial structure

-- Create the application schema
CREATE SCHEMA IF NOT EXISTS transpacharity;

-- Create users table
CREATE TABLE IF NOT EXISTS transpacharity.users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS transpacharity.categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create causes table
CREATE TABLE IF NOT EXISTS transpacharity.causes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    raised_amount REAL DEFAULT 0.0,
    goal_amount REAL NOT NULL,
    category_id INTEGER REFERENCES transpacharity.categories(id),
    featured INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create donations table
CREATE TABLE IF NOT EXISTS transpacharity.donations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES transpacharity.users(id),
    cause_id INTEGER NOT NULL REFERENCES transpacharity.causes(id),
    amount REAL NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending',
    transaction_id TEXT,
    transaction_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_causes_category_id ON transpacharity.causes(category_id);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON transpacharity.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_cause_id ON transpacharity.donations(cause_id);