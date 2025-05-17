package repository

import (
    "database/sql"
    
    "github.com/ombima56/transpacharity/internal/config"
)

// Repository holds all repositories
type Repository struct {
    User     *UserRepository
    Category *CategoryRepository
    Cause    *CauseRepository
    Donation *DonationRepository
}

// New creates a new repository
func New(db *sql.DB, cfg *config.DatabaseConfig) *Repository {
    return &Repository{
        User:     NewUserRepository(db, cfg),
        Category: NewCategoryRepository(db, cfg),
        Cause:    NewCauseRepository(db, cfg),
        Donation: NewDonationRepository(db, cfg),
    }
}