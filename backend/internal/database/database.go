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

// DB wraps the sql.DB connection
type DB struct {
	DB     *sql.DB
	config *config.DatabaseConfig
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
	
	return &DB{DB: db, config: cfg}, nil
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
	// Create schema if it doesn't exist
	if err := db.createSchema(); err != nil {
		return err
	}

	// Create tables if they don't exist
	if err := db.createTables(); err != nil {
		return err
	}

	// Add transaction_hash column if it doesn't exist
	if err := db.addTransactionHashColumn(); err != nil {
		return err
	}

	return nil
}

// createSchema creates the application schema if it doesn't exist
func (db *DB) createSchema() error {
	// Get the schema name from the config
	schemaName := db.config.Schema
	
	// Create the schema
	schemaSQL := fmt.Sprintf("CREATE SCHEMA IF NOT EXISTS %s", schemaName)
	
	if _, err := db.DB.Exec(schemaSQL); err != nil {
		return fmt.Errorf("error creating %s schema: %w", schemaName, err)
	}
	
	log.Printf("Schema '%s' created successfully", schemaName)
	return nil
}

// createTables creates the necessary tables if they don't exist
func (db *DB) createTables() error {
	// Get the schema name from the config
	schema := db.config.Schema
	
	// PostgreSQL tables with SERIAL for auto-increment
	usersTable := fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s.users (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			role TEXT NOT NULL DEFAULT 'user',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`, schema)
	
	categoriesTable := fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s.categories (
			id SERIAL PRIMARY KEY,
			name TEXT UNIQUE NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`, schema)
	
	causesTable := fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s.causes (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			organization TEXT NOT NULL,
			description TEXT NOT NULL,
			image_url TEXT NOT NULL,
			raised_amount REAL DEFAULT 0.0,
			goal_amount REAL NOT NULL,
			category_id INTEGER REFERENCES %s.categories(id),
			featured INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`, schema, schema)
	
	donationsTable := fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS %s.donations (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES %s.users(id),
			cause_id INTEGER NOT NULL REFERENCES %s.causes(id),
			amount REAL NOT NULL,
			is_anonymous BOOLEAN DEFAULT FALSE,
			status TEXT NOT NULL DEFAULT 'pending',
			transaction_id TEXT,
			transaction_hash TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`, schema, schema, schema)

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

	log.Printf("Database tables created successfully in '%s' schema", schema)
	return nil
}

// addTransactionHashColumn adds the transaction_hash column to the donations table if it doesn't exist
func (db *DB) addTransactionHashColumn() error {
	// Check if the column exists
	var exists bool
	err := db.DB.QueryRow(`
		SELECT EXISTS (
			SELECT 1 
			FROM information_schema.columns 
			WHERE table_schema = $1 
			AND table_name = 'donations' 
			AND column_name = 'transaction_hash'
		)
	`, db.config.Schema).Scan(&exists)

	if err != nil {
		return fmt.Errorf("error checking if transaction_hash column exists: %w", err)
	}

	// If the column doesn't exist, add it
	if !exists {
		_, err = db.DB.Exec(fmt.Sprintf(`
			ALTER TABLE %s.donations 
			ADD COLUMN transaction_hash TEXT
		`, db.config.Schema))

		if err != nil {
			return fmt.Errorf("error adding transaction_hash column: %w", err)
		}

		log.Println("Added transaction_hash column to donations table")
	}

	return nil
}
