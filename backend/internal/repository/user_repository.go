package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/ombima56/transpacharity/internal/config"
	"github.com/ombima56/transpacharity/internal/models"
	"golang.org/x/crypto/bcrypt"
)

// UserRepository handles database operations for users
type UserRepository struct {
	db     *sql.DB
	schema string
}

// NewUserRepository creates a new UserRepository
func NewUserRepository(db *sql.DB, cfg *config.DatabaseConfig) *UserRepository {
	return &UserRepository{db: db, schema: cfg.Schema}
}

// Create creates a new user
func (r *UserRepository) Create(ctx context.Context, input models.UserInput) (models.User, error) {
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.User{}, err
	}
	
	query := fmt.Sprintf(`
		INSERT INTO %s.users (name, email, password_hash, role)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, email, role, created_at, updated_at
	`, r.schema)
	
	var user models.User
	err = r.db.QueryRowContext(
		ctx, 
		query, 
		input.Name, input.Email, string(hashedPassword), input.Role,
	).Scan(
		&user.ID, &user.Name, &user.Email, &user.Role, 
		&user.CreatedAt, &user.UpdatedAt,
	)
	
	return user, err
}

// GetByID gets a user by ID
func (r *UserRepository) GetByID(ctx context.Context, id int) (*models.User, error) {
	query := fmt.Sprintf(`
		SELECT id, name, email, password_hash, role, created_at, updated_at
		FROM %s.users
		WHERE id = $1
	`, r.schema)
	
	var user models.User
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID, &user.Name, &user.Email, &user.PasswordHash,
		&user.Role, &user.CreatedAt, &user.UpdatedAt,
	)
	
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	
	return &user, nil
}

// GetByEmail gets a user by email
func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	query := fmt.Sprintf(`
		SELECT id, name, email, password_hash, role, created_at, updated_at
		FROM %s.users
		WHERE email = $1
	`, r.schema)
	
	var user models.User
	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID, &user.Name, &user.Email, &user.PasswordHash, 
		&user.Role, &user.CreatedAt, &user.UpdatedAt,
	)
	
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	
	return &user, nil
}

// Update updates a user
func (r *UserRepository) Update(ctx context.Context, id int, input models.UserInput) (*models.User, error) {
	// Get the current user to preserve existing data
	currentUser, err := r.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if currentUser == nil {
		return nil, nil
	}

	// Prepare update query with only the fields that need to be updated
	query := fmt.Sprintf(`
		UPDATE %s.users
		SET name = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
		RETURNING id, name, email, role, created_at, updated_at
	`, r.schema)
	
	var user models.User
	err = r.db.QueryRowContext(
		ctx, 
		query, 
		input.Name, id,
	).Scan(
		&user.ID, &user.Name, &user.Email, &user.Role, 
		&user.CreatedAt, &user.UpdatedAt,
	)
	
	if err != nil {
		return nil, err
	}
	
	return &user, nil
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
