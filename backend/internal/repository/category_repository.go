package repository

import (
"context"
"database/sql"
"errors"
"fmt"
"time"

"github.com/ombima56/transpacharity/internal/config"
"github.com/ombima56/transpacharity/internal/models"
)

// CategoryRepository handles database operations for categories
type CategoryRepository struct {
	db     *sql.DB
	schema string
}

// NewCategoryRepository creates a new CategoryRepository
func NewCategoryRepository(db *sql.DB, cfg *config.DatabaseConfig) *CategoryRepository {
	return &CategoryRepository{db: db, schema: cfg.Schema}
}

// Create creates a new category
func (r *CategoryRepository) Create(ctx context.Context, input models.CategoryInput) (models.Category, error) {
	query := fmt.Sprintf(`
		INSERT INTO %s.categories (name, description)
		VALUES ($1, $2)
		RETURNING id, name, description, created_at, updated_at
	`, r.schema)

	var category models.Category
	err := r.db.QueryRowContext(ctx, query, input.Name, input.Description).
		Scan(&category.ID, &category.Name, &category.Description, &category.CreatedAt, &category.UpdatedAt)

	return category, err
}

// GetAll retrieves all categories
func (r *CategoryRepository) GetAll(ctx context.Context) ([]models.Category, error) {
	query := fmt.Sprintf(`
		SELECT id, name, description, created_at, updated_at 
		FROM %s.categories 
		ORDER BY name
	`, r.schema)

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var c models.Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		categories = append(categories, c)
	}

	return categories, nil
}

// GetByID gets a category by ID
func (r *CategoryRepository) GetByID(ctx context.Context, id int) (*models.Category, error) {
	query := `
SELECT id, name, description, created_at, updated_at
FROM categories
WHERE id = ?
`

	var category models.Category
	var createdAt, updatedAt string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
	&category.ID,
	&category.Name,
	&category.Description,
	&createdAt,
	&updatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	// Parse timestamps
	category.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
	category.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt)

	return &category, nil
}

// Update updates a category
func (r *CategoryRepository) Update(ctx context.Context, id int, input models.CategoryInput) (*models.Category, error) {
	query := `
UPDATE categories
SET name = ?, description = ?, updated_at = datetime('now')
WHERE id = ?
`

	result, err := r.db.ExecContext(ctx, query, input.Name, input.Description, id)
	if err != nil {
		return nil, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, err
	}

	if rowsAffected == 0 {
		return nil, nil
	}

	// Get the updated category
	return r.GetByID(ctx, id)
}

// Delete deletes a category
func (r *CategoryRepository) Delete(ctx context.Context, id int) error {
	query := `
DELETE FROM categories
WHERE id = ?
`

	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
