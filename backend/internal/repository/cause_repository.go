package repository

import (
"context"
"database/sql"
"errors"
"time"

"github.com/ombima56/transpacharity/internal/models"
)

// CauseRepository handles database operations for causes
type CauseRepository struct {
db *sql.DB
}

// NewCauseRepository creates a new CauseRepository
func NewCauseRepository(db *sql.DB) *CauseRepository {
return &CauseRepository{db: db}
}

// Create creates a new cause
func (r *CauseRepository) Create(ctx context.Context, input models.CauseInput) (*models.Cause, error) {
query := `
INSERT INTO causes (
title, organization, description, image_url, 
goal_amount, category_id, featured, created_at, updated_at
)
VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`

result, err := r.db.ExecContext(
ctx, query,
input.Title, input.Organization, input.Description, input.ImageURL,
input.GoalAmount, input.CategoryID, input.Featured,
)
if err != nil {
return nil, err
}

// Get the ID of the inserted cause
id, err := result.LastInsertId()
if err != nil {
return nil, err
}

// Get the created cause
return r.GetByID(ctx, int(id))
}

// GetAll gets all causes
func (r *CauseRepository) GetAll(ctx context.Context) ([]*models.Cause, error) {
query := `
SELECT c.id, c.title, c.organization, c.description, c.image_url, 
c.raised_amount, c.goal_amount, c.category_id, c.featured, c.created_at, c.updated_at,
cat.name as category_name
FROM causes c
LEFT JOIN categories cat ON c.category_id = cat.id
ORDER BY c.created_at DESC
`

rows, err := r.db.QueryContext(ctx, query)
if err != nil {
return nil, err
}
defer rows.Close()

var causes []*models.Cause
for rows.Next() {
var cause models.Cause
var categoryName sql.NullString
var createdAt, updatedAt string

err := rows.Scan(
&cause.ID, &cause.Title, &cause.Organization, &cause.Description, &cause.ImageURL,
&cause.RaisedAmount, &cause.GoalAmount, &cause.CategoryID, &cause.Featured,
&createdAt, &updatedAt, &categoryName,
)
if err != nil {
return nil, err
}

if categoryName.Valid {
cause.CategoryName = categoryName.String
} else {
cause.CategoryName = "Unknown"
}

// Parse timestamps
cause.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
cause.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt)

causes = append(causes, &cause)
}

if err := rows.Err(); err != nil {
return nil, err
}

return causes, nil
}

// GetFeatured gets featured causes
func (r *CauseRepository) GetFeatured(ctx context.Context) ([]*models.Cause, error) {
query := `
SELECT c.id, c.title, c.organization, c.description, c.image_url, 
c.raised_amount, c.goal_amount, c.category_id, c.featured, c.created_at, c.updated_at,
cat.name as category_name
FROM causes c
LEFT JOIN categories cat ON c.category_id = cat.id
WHERE c.featured = 1
ORDER BY c.created_at DESC
`

rows, err := r.db.QueryContext(ctx, query)
if err != nil {
return nil, err
}
defer rows.Close()

var causes []*models.Cause
for rows.Next() {
var cause models.Cause
var categoryName sql.NullString
var createdAt, updatedAt string

err := rows.Scan(
&cause.ID, &cause.Title, &cause.Organization, &cause.Description, &cause.ImageURL,
&cause.RaisedAmount, &cause.GoalAmount, &cause.CategoryID, &cause.Featured,
&createdAt, &updatedAt, &categoryName,
)
if err != nil {
return nil, err
}

if categoryName.Valid {
cause.CategoryName = categoryName.String
} else {
cause.CategoryName = "Unknown"
}

// Parse timestamps
cause.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
cause.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt)

causes = append(causes, &cause)
}

if err := rows.Err(); err != nil {
return nil, err
}

return causes, nil
}

// GetByID gets a cause by ID
func (r *CauseRepository) GetByID(ctx context.Context, id int) (*models.Cause, error) {
query := `
SELECT c.id, c.title, c.organization, c.description, c.image_url, 
c.raised_amount, c.goal_amount, c.category_id, c.featured, c.created_at, c.updated_at,
cat.name as category_name
FROM causes c
LEFT JOIN categories cat ON c.category_id = cat.id
WHERE c.id = ?
`

var cause models.Cause
var categoryName sql.NullString
var createdAt, updatedAt string

err := r.db.QueryRowContext(ctx, query, id).Scan(
&cause.ID, &cause.Title, &cause.Organization, &cause.Description, &cause.ImageURL,
&cause.RaisedAmount, &cause.GoalAmount, &cause.CategoryID, &cause.Featured,
&createdAt, &updatedAt, &categoryName,
)
if err != nil {
if errors.Is(err, sql.ErrNoRows) {
return nil, nil // Cause not found
}
return nil, err
}

if categoryName.Valid {
cause.CategoryName = categoryName.String
} else {
cause.CategoryName = "Unknown"
}

// Parse timestamps
cause.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
cause.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt)

return &cause, nil
}

// Update updates a cause
func (r *CauseRepository) Update(ctx context.Context, id int, input models.CauseInput) (*models.Cause, error) {
query := `
UPDATE causes
SET title = ?, organization = ?, description = ?, image_url = ?,
goal_amount = ?, category_id = ?, featured = ?, updated_at = datetime('now')
WHERE id = ?
`

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
return nil, nil // Cause not found
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
