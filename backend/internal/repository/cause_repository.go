package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/ombima56/transpacharity/internal/config"
	"github.com/ombima56/transpacharity/internal/models"
)

// CauseRepository handles database operations for causes
type CauseRepository struct {
	db     *sql.DB
	schema string
}

// NewCauseRepository creates a new CauseRepository
func NewCauseRepository(db *sql.DB, cfg *config.DatabaseConfig) *CauseRepository {
	return &CauseRepository{db: db, schema: cfg.Schema}
}

// Create creates a new cause
func (r *CauseRepository) Create(ctx context.Context, input models.CauseInput) (*models.Cause, error) {
	query := fmt.Sprintf(`
		INSERT INTO %s.causes (
			title, organization, description, image_url, 
			goal_amount, category_id, featured
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, title, organization, description, image_url, 
			raised_amount, goal_amount, category_id, featured, 
			created_at, updated_at
	`, r.schema)
	
	var cause models.Cause
	err := r.db.QueryRowContext(
		ctx, 
		query, 
		input.Title, input.Organization, input.Description, 
		input.ImageURL, input.GoalAmount, input.CategoryID, input.Featured,
	).Scan(
		&cause.ID, &cause.Title, &cause.Organization, 
		&cause.Description, &cause.ImageURL, &cause.RaisedAmount, 
		&cause.GoalAmount, &cause.CategoryID, &cause.Featured, 
		&cause.CreatedAt, &cause.UpdatedAt,
	)
	
	if err != nil {
		return nil, err
	}
	
	return &cause, nil
}

// GetAll gets all causes
func (r *CauseRepository) GetAll(ctx context.Context) ([]*models.Cause, error) {
	query := fmt.Sprintf(`
		SELECT c.id, c.title, c.organization, c.description, c.image_url, 
			c.raised_amount, c.goal_amount, c.category_id, c.featured, 
			c.created_at, c.updated_at,
			cat.name as category_name
		FROM %s.causes c
		LEFT JOIN %s.categories cat ON c.category_id = cat.id
		ORDER BY c.created_at DESC
	`, r.schema, r.schema)

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var causes []*models.Cause
	for rows.Next() {
		var cause models.Cause
		var categoryName sql.NullString
		err := rows.Scan(
			&cause.ID, &cause.Title, &cause.Organization, &cause.Description, &cause.ImageURL,
			&cause.RaisedAmount, &cause.GoalAmount, &cause.CategoryID, &cause.Featured,
			&cause.CreatedAt, &cause.UpdatedAt,
			&categoryName,
		)
		if err != nil {
			return nil, err
		}
		
		if categoryName.Valid {
			cause.Category = categoryName.String
			cause.CategoryName = categoryName.String
		}
		
		causes = append(causes, &cause)
	}

	return causes, nil
}

// GetFeatured gets featured causes
func (r *CauseRepository) GetFeatured(ctx context.Context) ([]*models.Cause, error) {
	query := fmt.Sprintf(`
		SELECT c.id, c.title, c.organization, c.description, c.image_url, 
			c.raised_amount, c.goal_amount, c.category_id, c.featured, 
			c.created_at, c.updated_at,
			cat.name as category_name
		FROM %s.causes c
		LEFT JOIN %s.categories cat ON c.category_id = cat.id
		WHERE c.featured = 1
		ORDER BY c.created_at DESC
		LIMIT 3
	`, r.schema, r.schema)

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var causes []*models.Cause
	for rows.Next() {
		var cause models.Cause
		var categoryName sql.NullString
		err := rows.Scan(
			&cause.ID, &cause.Title, &cause.Organization, &cause.Description, &cause.ImageURL,
			&cause.RaisedAmount, &cause.GoalAmount, &cause.CategoryID, &cause.Featured,
			&cause.CreatedAt, &cause.UpdatedAt,
			&categoryName,
		)
		if err != nil {
			return nil, err
		}
		
		if categoryName.Valid {
			cause.Category = categoryName.String
		}
		
		causes = append(causes, &cause)
	}

	// If we have fewer than 3 featured causes, add some non-featured ones to make up the difference
	if len(causes) < 3 {
		additionalQuery := fmt.Sprintf(`
			SELECT c.id, c.title, c.organization, c.description, c.image_url, 
				c.raised_amount, c.goal_amount, c.category_id, c.featured, 
				c.created_at, c.updated_at,
				cat.name as category_name
			FROM %s.causes c
			LEFT JOIN %s.categories cat ON c.category_id = cat.id
			WHERE c.featured = 0
			ORDER BY c.created_at DESC
			LIMIT %d
		`, r.schema, r.schema, 3-len(causes))
		
		additionalRows, err := r.db.QueryContext(ctx, additionalQuery)
		if err != nil {
			return nil, err
		}
		defer additionalRows.Close()
		
		for additionalRows.Next() {
			var cause models.Cause
			var categoryName sql.NullString
			err := additionalRows.Scan(
				&cause.ID, &cause.Title, &cause.Organization, &cause.Description, &cause.ImageURL,
				&cause.RaisedAmount, &cause.GoalAmount, &cause.CategoryID, &cause.Featured,
				&cause.CreatedAt, &cause.UpdatedAt,
				&categoryName,
			)
			if err != nil {
				return nil, err
			}
			
			if categoryName.Valid {
				cause.Category = categoryName.String
			}
			
			// Mark as featured for display purposes
			cause.Featured = 1
			causes = append(causes, &cause)
		}
	}

	return causes, nil
}

// GetByID gets a cause by ID
func (r *CauseRepository) GetByID(ctx context.Context, id int) (*models.Cause, error) {
	query := fmt.Sprintf(`
		SELECT id, title, organization, description, image_url, 
			raised_amount, goal_amount, category_id, featured, 
			created_at, updated_at
		FROM %s.causes
		WHERE id = $1
	`, r.schema)

	var cause models.Cause
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&cause.ID, &cause.Title, &cause.Organization, 
		&cause.Description, &cause.ImageURL, &cause.RaisedAmount, 
		&cause.GoalAmount, &cause.CategoryID, &cause.Featured, 
		&cause.CreatedAt, &cause.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &cause, nil
}

// Update updates a cause
func (r *CauseRepository) Update(ctx context.Context, id int, input models.CauseInput) (*models.Cause, error) {
	query := fmt.Sprintf(`
		UPDATE %s.causes
		SET title = $1, organization = $2, description = $3, image_url = $4,
			goal_amount = $5, category_id = $6, featured = $7, updated_at = CURRENT_TIMESTAMP
		WHERE id = $8
	`, r.schema)

	result, err := r.db.ExecContext(
		ctx, query,
		input.Title, input.Organization, input.Description, input.ImageURL,
		input.GoalAmount, input.CategoryID, input.Featured, id,
	)
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

	// Get the updated cause
	return r.GetByID(ctx, id)
}

// Delete deletes a cause
func (r *CauseRepository) Delete(ctx context.Context, id int) error {
	query := `
	DELETE FROM causes
	WHERE id = ?
	`

	_, err := r.db.ExecContext(ctx, query, id)
	return err
}

// UpdateRaisedAmount updates the raised amount for a cause
func (r *CauseRepository) UpdateRaisedAmount(ctx context.Context, id int, amount float64) error {
	query := `
	UPDATE causes
	SET raised_amount = raised_amount + ?, updated_at = datetime('now')
	WHERE id = ?
	`

	_, err := r.db.ExecContext(ctx, query, amount, id)
	return err
}
