package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/ombima56/transpacharity/internal/config"
)

// DB represents the database connection
type DB struct {
	DB *sql.DB
}

// New creates a new database connection
func New(cfg *config.DatabaseConfig) (*DB, error) {
	// Create a connection to PostgreSQL
	log.Println("Connecting to PostgreSQL database...")
	db, err := sql.Open("postgres", cfg.DSN())
	if err != nil {
		return nil, fmt.Errorf("unable to open PostgreSQL database: %w", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(time.Hour)

	// Verify the connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("unable to ping database: %w", err)
	}

	log.Println("Connected to PostgreSQL database successfully")
	
	return &DB{DB: db}, nil
}

// Close closes the database connection
func (db *DB) Close() {
	if db.DB != nil {
		db.DB.Close()
		log.Println("Database connection closed")
	}
}

// RunMigrations runs database migrations
func (db *DB) RunMigrations() error {
	// Create tables if they don't exist
	if err := db.createTables(); err != nil {
		return err
	}
	return nil
}

// createTables creates the necessary tables if they don't exist
func (db *DB) createTables() error {
	// PostgreSQL tables with SERIAL for auto-increment
	usersTable := `
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			role TEXT NOT NULL DEFAULT 'user',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`
	categoriesTable := `
		CREATE TABLE IF NOT EXISTS categories (
			id SERIAL PRIMARY KEY,
			name TEXT UNIQUE NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`
	causesTable := `
		CREATE TABLE IF NOT EXISTS causes (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			organization TEXT NOT NULL,
			description TEXT NOT NULL,
			image_url TEXT NOT NULL,
			raised_amount REAL DEFAULT 0.0,
			goal_amount REAL NOT NULL,
			category_id INTEGER REFERENCES categories(id),
			featured INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`
	donationsTable := `
		CREATE TABLE IF NOT EXISTS donations (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id),
			cause_id INTEGER NOT NULL REFERENCES causes(id),
			amount REAL NOT NULL,
			is_anonymous INTEGER DEFAULT 0,
			status TEXT NOT NULL DEFAULT 'pending',
			transaction_id TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`

	// Execute the table creation statements
	if _, err := db.DB.Exec(usersTable); err != nil {
		return fmt.Errorf("error creating users table: %w", err)
	}
	if _, err := db.DB.Exec(categoriesTable); err != nil {
		return fmt.Errorf("error creating categories table: %w", err)
	}
	if _, err := db.DB.Exec(causesTable); err != nil {
		return fmt.Errorf("error creating causes table: %w", err)
	}
	if _, err := db.DB.Exec(donationsTable); err != nil {
		return fmt.Errorf("error creating donations table: %w", err)
	}

	log.Println("Database tables created successfully")
	return nil
}
