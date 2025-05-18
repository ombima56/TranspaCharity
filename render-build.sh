#!/bin/bash
# Build script for Render

set -e

# Build the Go application
cd backend
go build -o transpacharity-api ./cmd/api

# Run database migrations
echo "Running database migrations..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f ./scripts/db_setup.sql

# Seed the database if needed
echo "Seeding the database..."
go run ./cmd/seed/main.go

echo "Build completed successfully!"
