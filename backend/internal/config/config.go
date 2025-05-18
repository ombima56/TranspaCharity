package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

// Config holds all configuration for the application
type Config struct {
	Database DatabaseConfig
	Server   ServerConfig
	JWT      JWTConfig
}

// DatabaseConfig holds all database related configuration
type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	Schema   string
	SSLMode  string
}

// ServerConfig holds all server related configuration
type ServerConfig struct {
	Port            int
	Environment     string
	AllowedOrigins  []string
}

// JWTConfig holds all JWT related configuration
type JWTConfig struct {
	Secret          string
	ExpirationHours int
}

// Load loads the configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists
	// Note: We're not calling godotenv.Load() here anymore since we're doing it in main.go
	
	// Database config with secure defaults
	dbHost := getEnv("DB_HOST", "localhost")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "") // Empty default for security
	dbName := getEnv("DB_NAME", "transpacharity")
	dbSchema := getEnv("DB_SCHEMA", "transpacharity")
	dbSSLMode := getEnv("DB_SSL_MODE", "require") // Default to require SSL in production
	
	// Check if we're in production and enforce secure settings
	isProduction := getEnv("ENVIRONMENT", "development") == "production"
	if isProduction && dbPassword == "" {
		return nil, fmt.Errorf("DB_PASSWORD must be set in production environment")
	}
	
	// In production, default to SSL mode 'require' unless explicitly set
	if isProduction && getEnv("DB_SSL_MODE", "") == "" {
		dbSSLMode = "require"
	}
	
	log.Printf("Database config: Host=%s, User=%s, DBName=%s, Schema=%s, SSL=%s", 
		dbHost, dbUser, dbName, dbSchema, dbSSLMode)
	
	dbPort, err := strconv.Atoi(getEnv("DB_PORT", "5432"))
	if err != nil {
		return nil, fmt.Errorf("invalid DB_PORT: %w", err)
	}

	// Server config
	apiPort, err := strconv.Atoi(getEnv("API_PORT", "8080"))
	if err != nil {
		return nil, fmt.Errorf("invalid API_PORT: %w", err)
	}

	// JWT config
	jwtExpiration, err := strconv.Atoi(getEnv("JWT_EXPIRATION_HOURS", "24"))
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_EXPIRATION_HOURS: %w", err)
	}

	return &Config{
		Database: DatabaseConfig{
			Host:     dbHost,
			Port:     dbPort,
			User:     dbUser,
			Password: dbPassword,
			DBName:   dbName,
			Schema:   dbSchema,
			SSLMode:  dbSSLMode,
		},
		Server: ServerConfig{
			Port:            apiPort,
			Environment:     getEnv("ENVIRONMENT", "development"),
			AllowedOrigins:  strings.Split(getEnv("CORS_ALLOWED_ORIGINS", "https://transpacharity.onrender.com,http://localhost:5173"), ","),
		},
		JWT: JWTConfig{
			Secret:          getEnv("JWT_SECRET", "default_secret_key"),
			ExpirationHours: jwtExpiration,
		},
	}, nil
}

// DSN returns the PostgreSQL connection string
func (c *DatabaseConfig) DSN() string {
	// Check if a full DATABASE_URL is provided (common in hosting platforms)
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL != "" {
		return databaseURL
	}
	
	// Otherwise build the connection string from individual parameters
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode)
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
