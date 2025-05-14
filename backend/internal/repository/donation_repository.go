package repository

import (
"context"
"database/sql"
"errors"
"time"

"github.com/ombima56/transpacharity/internal/models"
)

// DonationRepository handles database operations for donations
type DonationRepository struct {
db *sql.DB
}

// NewDonationRepository creates a new DonationRepository
func NewDonationRepository(db *sql.DB) *DonationRepository {
return &DonationRepository{db: db}
}

// Create creates a new donation
func (r *DonationRepository) Create(ctx context.Context, input models.DonationInput) (*models.Donation, error) {
    // Validate the cause ID
    if input.CauseID <= 0 {
        return nil, errors.New("invalid cause ID")
    }

    // Validate the amount
    if input.Amount <= 0 {
        return nil, errors.New("donation amount must be greater than 0")
    }

    // Start a transaction
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil {
        return nil, err
    }
    defer tx.Rollback()

    // Check if the cause exists
    var causeExists bool
    causeCheckQuery := `SELECT EXISTS(SELECT 1 FROM causes WHERE id = ?)`
    err = tx.QueryRowContext(ctx, causeCheckQuery, input.CauseID).Scan(&causeExists)
    if err != nil {
        return nil, err
    }
    if !causeExists {
        return nil, errors.New("cause not found")
    }

    // Insert the donation
    query := `
    INSERT INTO donations (user_id, cause_id, amount, is_anonymous, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `

    var userID interface{}
    if input.UserID != nil {
        userID = *input.UserID
    } else {
        userID = nil
    }

    result, err := tx.ExecContext(
        ctx, query,
        userID, input.CauseID, input.Amount, input.IsAnonymous, string(models.DonationStatusCompleted),
    )
    if err != nil {
        return nil, err
    }

    // Get the ID of the inserted donation
    donationID, err := result.LastInsertId()
    if err != nil {
        return nil, err
    }

    // Update the cause's raised amount
    updateQuery := `
    UPDATE causes
    SET raised_amount = raised_amount + ?, updated_at = datetime('now')
    WHERE id = ?
    `
    _, err = tx.ExecContext(ctx, updateQuery, input.Amount, input.CauseID)
    if err != nil {
        return nil, err
    }

    // Commit the transaction
    if err := tx.Commit(); err != nil {
        return nil, err
    }

    // Get the created donation
    donation, err := r.GetByID(ctx, int(donationID))
    if err != nil {
        return nil, err
    }

    return donation, nil
}

// GetAll gets all donations
func (r *DonationRepository) GetAll(ctx context.Context) ([]*models.Donation, error) {
query := `
SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
d.status, d.transaction_id, d.created_at, d.updated_at,
u.name as user_name, c.title as cause_title
FROM donations d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN causes c ON d.cause_id = c.id
ORDER BY d.created_at DESC
`

rows, err := r.db.QueryContext(ctx, query)
if err != nil {
return nil, err
}
defer rows.Close()

var donations []*models.Donation
for rows.Next() {
var donation models.Donation
var userID sql.NullInt64
var transactionID, userName, createdAt, updatedAt sql.NullString

err := rows.Scan(
&donation.ID, &userID, &donation.CauseID, &donation.Amount,
&donation.IsAnonymous, &donation.Status, &transactionID,
&createdAt, &updatedAt, &userName, &donation.CauseTitle,
)
if err != nil {
return nil, err
}

if userID.Valid {
id := int(userID.Int64)
donation.UserID = &id
}

if transactionID.Valid {
donation.TransactionID = transactionID.String
}

if userName.Valid {
donation.UserName = userName.String
}

// Parse timestamps
donation.CreatedAt, _ = time.Parse(time.RFC3339, createdAt.String)
donation.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt.String)

donations = append(donations, &donation)
}

if err := rows.Err(); err != nil {
return nil, err
}

return donations, nil
}

// GetByID gets a donation by ID
func (r *DonationRepository) GetByID(ctx context.Context, id int) (*models.Donation, error) {
query := `
SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
d.status, d.transaction_id, d.created_at, d.updated_at,
u.name as user_name, c.title as cause_title
FROM donations d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN causes c ON d.cause_id = c.id
WHERE d.id = ?
`

var donation models.Donation
var userID sql.NullInt64
var transactionID, userName, createdAt, updatedAt sql.NullString

err := r.db.QueryRowContext(ctx, query, id).Scan(
&donation.ID, &userID, &donation.CauseID, &donation.Amount,
&donation.IsAnonymous, &donation.Status, &transactionID,
&createdAt, &updatedAt, &userName, &donation.CauseTitle,
)
if err != nil {
if errors.Is(err, sql.ErrNoRows) {
return nil, nil // Donation not found
}
return nil, err
}

if userID.Valid {
id := int(userID.Int64)
donation.UserID = &id
}

if transactionID.Valid {
donation.TransactionID = transactionID.String
}

if userName.Valid {
donation.UserName = userName.String
}

// Parse timestamps
donation.CreatedAt, _ = time.Parse(time.RFC3339, createdAt.String)
donation.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt.String)

return &donation, nil
}

// GetByCauseID gets donations for a cause
func (r *DonationRepository) GetByCauseID(ctx context.Context, causeID int) ([]*models.Donation, error) {
query := `
SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
d.status, d.transaction_id, d.created_at, d.updated_at,
u.name as user_name, c.title as cause_title
FROM donations d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN causes c ON d.cause_id = c.id
WHERE d.cause_id = ?
ORDER BY d.created_at DESC
`

rows, err := r.db.QueryContext(ctx, query, causeID)
if err != nil {
return nil, err
}
defer rows.Close()

var donations []*models.Donation
for rows.Next() {
var donation models.Donation
var userID sql.NullInt64
var transactionID, userName, createdAt, updatedAt sql.NullString

err := rows.Scan(
&donation.ID, &userID, &donation.CauseID, &donation.Amount,
&donation.IsAnonymous, &donation.Status, &transactionID,
&createdAt, &updatedAt, &userName, &donation.CauseTitle,
)
if err != nil {
return nil, err
}

if userID.Valid {
id := int(userID.Int64)
donation.UserID = &id
}

if transactionID.Valid {
donation.TransactionID = transactionID.String
}

if userName.Valid {
donation.UserName = userName.String
}

// Parse timestamps
donation.CreatedAt, _ = time.Parse(time.RFC3339, createdAt.String)
donation.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt.String)

donations = append(donations, &donation)
}

if err := rows.Err(); err != nil {
return nil, err
}

return donations, nil
}

// GetByUserID gets donations for a user
func (r *DonationRepository) GetByUserID(ctx context.Context, userID int) ([]*models.Donation, error) {
query := `
SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
d.status, d.transaction_id, d.created_at, d.updated_at,
u.name as user_name, c.title as cause_title
FROM donations d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN causes c ON d.cause_id = c.id
WHERE d.user_id = ?
ORDER BY d.created_at DESC
`

rows, err := r.db.QueryContext(ctx, query, userID)
if err != nil {
return nil, err
}
defer rows.Close()

var donations []*models.Donation
for rows.Next() {
var donation models.Donation
var dbUserID sql.NullInt64
var transactionID, userName, createdAt, updatedAt sql.NullString

err := rows.Scan(
&donation.ID, &dbUserID, &donation.CauseID, &donation.Amount,
&donation.IsAnonymous, &donation.Status, &transactionID,
&createdAt, &updatedAt, &userName, &donation.CauseTitle,
)
if err != nil {
return nil, err
}

if dbUserID.Valid {
id := int(dbUserID.Int64)
donation.UserID = &id
}

if transactionID.Valid {
donation.TransactionID = transactionID.String
}

if userName.Valid {
donation.UserName = userName.String
}

// Parse timestamps
donation.CreatedAt, _ = time.Parse(time.RFC3339, createdAt.String)
donation.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt.String)

donations = append(donations, &donation)
}

if err := rows.Err(); err != nil {
return nil, err
}

return donations, nil
}

// GetRecentDonations gets recent donations
func (r *DonationRepository) GetRecentDonations(ctx context.Context, limit int) ([]*models.Donation, error) {
query := `
SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
d.status, d.transaction_id, d.created_at, d.updated_at,
u.name as user_name, c.title as cause_title
FROM donations d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN causes c ON d.cause_id = c.id
WHERE d.status = 'completed'
ORDER BY d.created_at DESC
LIMIT ?
`

rows, err := r.db.QueryContext(ctx, query, limit)
if err != nil {
return nil, err
}
defer rows.Close()

var donations []*models.Donation
for rows.Next() {
var donation models.Donation
var userID sql.NullInt64
var transactionID, userName, createdAt, updatedAt sql.NullString

err := rows.Scan(
&donation.ID, &userID, &donation.CauseID, &donation.Amount,
&donation.IsAnonymous, &donation.Status, &transactionID,
&createdAt, &updatedAt, &userName, &donation.CauseTitle,
)
if err != nil {
return nil, err
}

if userID.Valid {
id := int(userID.Int64)
donation.UserID = &id
}

if transactionID.Valid {
donation.TransactionID = transactionID.String
}

if userName.Valid && !donation.IsAnonymous {
donation.UserName = userName.String
} else {
donation.UserName = "Anonymous"
}

// Parse timestamps
donation.CreatedAt, _ = time.Parse(time.RFC3339, createdAt.String)
donation.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt.String)

donations = append(donations, &donation)
}

if err := rows.Err(); err != nil {
return nil, err
}

return donations, nil
}
