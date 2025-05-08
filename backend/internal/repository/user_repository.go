package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/ombima56/transpacharity/internal/models"
)

// UserRepository handles database operations for users
type UserRepository struct {
	db *sql.DB
}

// NewUserRepository creates a new UserRepository
func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create creates a new user
func (r *UserRepository) Create(ctx context.Context, input models.UserInput) (*models.User, error) {
	// Hash the password
	passwordHash, err := models.HashPassword(input.Password)
	if err != nil {
	return nil, err
	}

	// Insert the user
	query := `
	INSERT INTO users (name, email, password_hash, created_at, updated_at)
	VALUES (?, ?, ?, datetime('now'), datetime('now'))
	`

	result, err := r.db.ExecContext(ctx, query, input.Name, input.Email, passwordHash)
	if err != nil {
	return nil, err
	}

	// Get the ID of the inserted user
	id, err := result.LastInsertId()
	if err != nil {
	return nil, err
	}

	// Get the created user
	return r.GetByID(ctx, int(id))
}

// GetByID gets a user by ID
func (r *UserRepository) GetByID(ctx context.Context, id int) (*models.User, error) {
	query := `
	SELECT id, name, email, password_hash, created_at, updated_at
	FROM users
	WHERE id = ?
	`

	var user models.User
	var createdAt, updatedAt string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
	&user.ID,
	&user.Name,
	&user.Email,
	&user.PasswordHash,
	&createdAt,
	&updatedAt,
	)
	if err != nil {
	if errors.Is(err, sql.ErrNoRows) {
	return nil, nil // User not found
	}
	return nil, err
	}

	// Parse timestamps
	user.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
	user.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt)

	return &user, nil
}

// GetByEmail gets a user by email
func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `
	SELECT id, name, email, password_hash, created_at, updated_at
	FROM users
	WHERE email = ?
	`

	var user models.User
	var createdAt, updatedAt string

	err := r.db.QueryRowContext(ctx, query, email).Scan(
	&user.ID,
	&user.Name,
	&user.Email,
	&user.PasswordHash,
	&createdAt,
	&updatedAt,
	)
	if err != nil {
	if errors.Is(err, sql.ErrNoRows) {
	return nil, nil // User not found
	}
	return nil, err
	}

	// Parse timestamps
	user.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
	user.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt)

	return &user, nil
}

// Update updates a user
func (r *UserRepository) Update(ctx context.Context, id int, input models.UserInput) (*models.User, error) {
	// Start a transaction
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
	return nil, err
	}
	defer tx.Rollback()

	// Get the current user
	query := `
	SELECT password_hash
	FROM users
	WHERE id = ?
	`
	var passwordHash string
	err = tx.QueryRowContext(ctx, query, id).Scan(&passwordHash)
	if err != nil {
	if errors.Is(err, sql.ErrNoRows) {
	return nil, nil // User not found
	}
	return nil, err
	}

	// If password is provided, hash it
	if input.Password != "" {
	passwordHash, err = models.HashPassword(input.Password)
	if err != nil {
	return nil, err
	}
	}

	// Update the user
	query = `
	UPDATE users
	SET name = ?, email = ?, password_hash = ?, updated_at = datetime('now')
	WHERE id = ?
	`

	_, err = tx.ExecContext(ctx, query, input.Name, input.Email, passwordHash, id)
	if err != nil {
	return nil, err
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
	return nil, err
	}

	// Get the updated user
	return r.GetByID(ctx, id)
}

// Delete deletes a user
func (r *UserRepository) Delete(ctx context.Context, id int) error {
	query := `
	DELETE FROM users
	WHERE id = ?
	`

	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
