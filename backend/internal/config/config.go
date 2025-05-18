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
	URL      string // Add URL field for DATABASE_URL
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
	// Check for DATABASE_URL first (Render provides this)
	databaseURL := os.Getenv("DATABASE_URL")
	
	var dbConfig DatabaseConfig
	
	if databaseURL != "" {
		// Parse the DATABASE_URL
		dbConfig = DatabaseConfig{
			URL:      databaseURL,
			Schema:   getEnv("DB_SCHEMA", "transpacharity"),
		}
	} else {
		// Use individual connection parameters
		dbConfig = DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnvAsInt("DB_PORT", 5432),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", ""),
			DBName:   getEnv("DB_NAME", "transpacharity"),
			Schema:   getEnv("DB_SCHEMA", "transpacharity"),
			SSLMode:  getEnv("DB_SSL_MODE", "require"),
		}
	}
	
	// Check if we're in production and enforce secure settings
	isProduction := getEnv("ENVIRONMENT", "development") == "production"
	if isProduction && dbConfig.Password == "" && databaseURL == "" {
		return nil, fmt.Errorf("DB_PASSWORD must be set in production environment")
	}
	
	// In production, default to SSL mode 'require' unless explicitly set
	if isProduction && getEnv("DB_SSL_MODE", "") == "" {
		dbConfig.SSLMode = "require"
	}
	
	log.Printf("Database config: Host=%s, User=%s, DBName=%s, Schema=%s, SSL=%s", 
		dbConfig.Host, dbConfig.User, dbConfig.DBName, dbConfig.Schema, dbConfig.SSLMode)
	
	// Server config
	apiPort := getEnvAsInt("API_PORT", 8080)
	
	// JWT config
	jwtExpiration := getEnvAsInt("JWT_EXPIRATION_HOURS", 24)

	return &Config{
		Database: dbConfig,
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
	if c.URL != "" {
		return c.URL
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

// getEnvAsInt gets an environment variable as an integer or returns a default value
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if valueStr == "" {
		return defaultValue
	}
	
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		log.Printf("Warning: Invalid integer value for %s: %s. Using default: %d", key, valueStr, defaultValue)
		return defaultValue
	}
	
	return value
}
