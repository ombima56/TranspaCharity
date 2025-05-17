# TranspaCharity Deployment Guide

This guide explains how to deploy the TranspaCharity application with a hosted database.

## Database Setup

### Option 1: Using a Database Provider (Recommended)

1. Create a PostgreSQL database with a provider like:
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)
   - [Render](https://render.com)
   - [ElephantSQL](https://www.elephantsql.com)
   - [AWS RDS](https://aws.amazon.com/rds/postgresql/)
   - [DigitalOcean Managed Databases](https://www.digitalocean.com/products/managed-databases)

2. Get your database connection details:
   - Host
   - Port
   - Username
   - Password
   - Database name

3. Run the database setup script:
   - Connect to your database using a tool like psql, pgAdmin, or your provider's SQL editor
   - Run the SQL commands from `backend/scripts/db_setup.sql`

### Option 2: Self-Hosted PostgreSQL

1. Install PostgreSQL on your server
2. Secure your PostgreSQL installation
3. Create a database and user for TranspaCharity
4. Run the database setup script

## Environment Configuration

1. Create a `.env` file in the project root (based on `.env.example`)
2. Update the database connection details:
   ```
   DB_HOST=your-db-host.example.com
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_secure_password
   DB_NAME=transpacharity
   DB_SCHEMA=transpacharity
   DB_SSL_MODE=require
   ```

   Or use a connection string:
   ```
   DATABASE_URL=postgres://username:password@host:port/database?sslmode=require
   ```

3. Set the environment to production:
   ```
   ENVIRONMENT=production
   ```

4. Update other settings as needed

## Backend Deployment

### Option 1: Deploy to a Platform

1. Deploy to a platform like:
   - [Render](https://render.com)
   - [Railway](https://railway.app)
   - [Fly.io](https://fly.io)
   - [Heroku](https://heroku.com)

2. Set the environment variables in your platform's dashboard

### Option 2: Deploy to a VPS

1. Set up a VPS with Ubuntu/Debian
2. Install Go 1.21 or higher
3. Clone the repository
4. Build the application:
   ```bash
   cd backend
   go build -o transpacharity-api ./cmd/api
   ```
5. Set up a systemd service to run the application
6. Configure Nginx as a reverse proxy

## Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to:
   - [Netlify](https://netlify.com)
   - [Vercel](https://vercel.com)
   - [GitHub Pages](https://pages.github.com)
   - Or your own web server

3. Set the environment variables for the frontend:
   ```
   VITE_API_URL=https://your-api-domain.com/api
   ```

## Database Maintenance

- Set up regular backups of your database
- Monitor database performance
- Consider setting up read replicas for high traffic