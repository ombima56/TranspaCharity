package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"github.com/ombima56/transpacharity/internal/config"
)

// DB represents the database connection
type DB struct {
	DB *sql.DB
}

// New creates a new database connection
func New(cfg *config.DatabaseConfig) (*DB, error) {
	// Create a connection to SQLite
	dbPath := cfg.SQLitePath
	if !strings.HasPrefix(dbPath, "/") {
		// If not an absolute path, use the absolute path from the root directory
		dbPath = "/home/ombimahillary/TranspaCharity/transpacharity.db"
	}

	log.Printf("Using database file: %s", dbPath)
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, fmt.Errorf("unable to open database: %w", err)
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

	log.Println("Connected to SQLite database successfully")
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
	// Create users table
	_, err := db.DB.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return fmt.Errorf("error creating users table: %w", err)
	}

	// Create categories table
	_, err = db.DB.Exec(`
		CREATE TABLE IF NOT EXISTS categories (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return fmt.Errorf("error creating categories table: %w", err)
	}

	// Create causes table
	_, err = db.DB.Exec(`
		CREATE TABLE IF NOT EXISTS causes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			organization TEXT NOT NULL,
			description TEXT NOT NULL,
			image_url TEXT NOT NULL,
			raised_amount REAL DEFAULT 0.0,
			goal_amount REAL NOT NULL,
			category_id INTEGER,
			featured INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (category_id) REFERENCES categories(id)
		)
	`)
	if err != nil {
		return fmt.Errorf("error creating causes table: %w", err)
	}

	// Create donations table
	_, err = db.DB.Exec(`
		CREATE TABLE IF NOT EXISTS donations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER,
			cause_id INTEGER NOT NULL,
			amount REAL NOT NULL,
			is_anonymous INTEGER DEFAULT 0,
			status TEXT NOT NULL DEFAULT 'pending',
			transaction_id TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id),
			FOREIGN KEY (cause_id) REFERENCES causes(id)
		)
	`)
	if err != nil {
		return fmt.Errorf("error creating donations table: %w", err)
	}

	log.Println("Database tables created successfully")
	return nil
}
