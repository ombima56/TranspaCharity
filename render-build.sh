#!/usr/bin/env bash
# Build script for Render deployment

# Exit on error
set -e

# Build the backend
cd backend
go build -o transpacharity-api ./cmd/api

# Build the frontend
cd ..
npm install
npm run build