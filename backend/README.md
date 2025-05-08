# TranspaCharity Backend

This is the backend API for the TranspaCharity application, built with Go.

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 14 or higher

## Setup

1. Clone the repository
2. Navigate to the backend directory
3. Copy `.env.example` to `.env` and update the values as needed
4. Run the following commands:

```bash
# Install dependencies
go mod tidy

# Run database migrations and start the server
go run cmd/api/main.go
```

## Database Seeding

To seed the database with initial data, run:

```bash
go run cmd/seed/main.go
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### Users

- `GET /api/users/me` - Get current user (requires authentication)
- `PUT /api/users/me` - Update current user (requires authentication)
- `GET /api/users/{id}` - Get user by ID (requires authentication)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create a new category (requires authentication)
- `PUT /api/categories/{id}` - Update a category (requires authentication)
- `DELETE /api/categories/{id}` - Delete a category (requires authentication)

### Causes

- `GET /api/causes` - Get all causes
- `GET /api/causes/featured` - Get featured causes
- `GET /api/causes/{id}` - Get cause by ID
- `POST /api/causes` - Create a new cause (requires authentication)
- `PUT /api/causes/{id}` - Update a cause (requires authentication)
- `DELETE /api/causes/{id}` - Delete a cause (requires authentication)

### Donations

- `POST /api/donations` - Create a new donation
- `GET /api/donations` - Get all donations (requires authentication)
- `GET /api/donations/{id}` - Get donation by ID (requires authentication)
- `GET /api/donations/recent` - Get recent donations
- `GET /api/causes/{id}/donations` - Get donations for a cause
- `GET /api/users/{id}/donations` - Get donations for a user (requires authentication)
- `GET /api/users/me/donations` - Get donations for the current user (requires authentication)

## Project Structure

```
backend/
├── cmd/
│   ├── api/
│   │   └── main.go         # Main application entry point
│   └── seed/
│       └── main.go         # Database seeding script
├── internal/
│   ├── config/
│   │   └── config.go       # Configuration loading
│   ├── database/
│   │   └── database.go     # Database connection and migrations
│   ├── handlers/
│   │   ├── causes.go       # Cause API handlers
│   │   ├── categories.go   # Category API handlers
│   │   ├── donations.go    # Donation API handlers
│   │   └── users.go        # User API handlers
│   ├── middleware/
│   │   ├── auth.go         # Authentication middleware
│   │   └── cors.go         # CORS middleware
│   ├── models/
│   │   ├── cause.go        # Cause model
│   │   ├── category.go     # Category model
│   │   ├── donation.go     # Donation model
│   │   └── user.go         # User model
│   └── repository/
│       ├── cause_repository.go     # Cause database operations
│       ├── category_repository.go  # Category database operations
│       ├── donation_repository.go  # Donation database operations
│       └── user_repository.go      # User database operations
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── go.mod                  # Go module file
└── go.sum                  # Go module checksums
```
