package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/ombima56/transpacharity/internal/config"
	"github.com/ombima56/transpacharity/internal/models"
)

// DonationRepository handles database operations for donations
type DonationRepository struct {
	db     *sql.DB
	schema string
}

// NewDonationRepository creates a new DonationRepository
func NewDonationRepository(db *sql.DB, cfg *config.DatabaseConfig) *DonationRepository {
	return &DonationRepository{db: db, schema: cfg.Schema}
}

// Create creates a new donation
func (r *DonationRepository) Create(ctx context.Context, input models.DonationInput) (models.Donation, error) {
	query := fmt.Sprintf(`
		INSERT INTO %s.donations (
			user_id, cause_id, amount, is_anonymous, status
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, user_id, cause_id, amount, is_anonymous, 
			status, transaction_id, created_at, updated_at
	`, r.schema)
	
	var donation models.Donation
	var transactionID sql.NullString
	
	err := r.db.QueryRowContext(
		ctx, 
		query, 
		input.UserID, input.CauseID, input.Amount, input.IsAnonymous, models.DonationStatusPending,
	).Scan(
		&donation.ID, &donation.UserID, &donation.CauseID, 
		&donation.Amount, &donation.IsAnonymous, &donation.Status, 
		&transactionID, &donation.CreatedAt, &donation.UpdatedAt,
	)
	
	if transactionID.Valid {
		donation.TransactionID = transactionID.String
	}
	
	// Update the raised amount for the cause
	if err == nil {
		updateQuery := fmt.Sprintf(`
			UPDATE %s.causes
			SET raised_amount = raised_amount + $1
			WHERE id = $2
		`, r.schema)
		_, err = r.db.ExecContext(ctx, updateQuery, input.Amount, input.CauseID)
	}
	
	return donation, err
}

// GetAll gets all donations
func (r *DonationRepository) GetAll(ctx context.Context) ([]models.Donation, error) {
	query := fmt.Sprintf(`
		SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
			d.status, d.transaction_id, d.created_at, d.updated_at,
			u.name as user_name, c.title as cause_title
		FROM %s.donations d
		LEFT JOIN %s.users u ON d.user_id = u.id
		LEFT JOIN %s.causes c ON d.cause_id = c.id
		ORDER BY d.created_at DESC
	`, r.schema, r.schema, r.schema)
	
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var donations []models.Donation
	for rows.Next() {
		var d models.Donation
		var userName, causeTitle, transactionID sql.NullString
		
		if err := rows.Scan(
			&d.ID, &d.UserID, &d.CauseID, &d.Amount, &d.IsAnonymous,
			&d.Status, &transactionID, &d.CreatedAt, &d.UpdatedAt,
			&userName, &causeTitle,
		); err != nil {
			return nil, err
		}
		
		if transactionID.Valid {
			d.TransactionID = transactionID.String
		}
		
		if userName.Valid {
			d.UserName = userName.String
		}
		
		if causeTitle.Valid {
			d.CauseTitle = causeTitle.String
		}
		
		donations = append(donations, d)
	}
	
	return donations, nil
}

// GetByID gets a donation by ID
func (r *DonationRepository) GetByID(ctx context.Context, id int) (*models.Donation, error) {
	query := fmt.Sprintf(`
		SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
			d.status, d.transaction_id, d.created_at, d.updated_at,
			u.name as user_name, c.title as cause_title
		FROM %s.donations d
		LEFT JOIN %s.users u ON d.user_id = u.id
		LEFT JOIN %s.causes c ON d.cause_id = c.id
		WHERE d.id = $1
	`, r.schema, r.schema, r.schema)

	var donation models.Donation
	var userID sql.NullInt64
	var transactionID, userName, causeTitle sql.NullString

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&donation.ID, &userID, &donation.CauseID, &donation.Amount,
		&donation.IsAnonymous, &donation.Status, &transactionID,
		&donation.CreatedAt, &donation.UpdatedAt, &userName, &causeTitle,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
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

	if causeTitle.Valid {
		donation.CauseTitle = causeTitle.String
	}

	return &donation, nil
}

// GetByCauseID gets donations by cause ID
func (r *DonationRepository) GetByCauseID(ctx context.Context, causeID int) ([]*models.Donation, error) {
	// First, check if transaction_hash column exists
	var hasTransactionHash bool
	err := r.db.QueryRowContext(ctx, `
		SELECT EXISTS (
			SELECT 1 
			FROM information_schema.columns 
			WHERE table_schema = $1 
			AND table_name = 'donations' 
			AND column_name = 'transaction_hash'
		)
	`, r.schema).Scan(&hasTransactionHash)
	
	if err != nil {
		return nil, err
	}
	
	var query string
	if hasTransactionHash {
		query = fmt.Sprintf(`
			SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
				d.status, d.transaction_id, d.transaction_hash, d.created_at, d.updated_at,
				c.title as cause_title, c.organization as cause_organization,
				u.name as user_name
			FROM %s.donations d
			JOIN %s.causes c ON d.cause_id = c.id
			LEFT JOIN %s.users u ON d.user_id = u.id
			WHERE d.cause_id = $1
			ORDER BY d.created_at DESC
		`, r.schema, r.schema, r.schema)
	} else {
		query = fmt.Sprintf(`
			SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
				d.status, d.transaction_id, d.created_at, d.updated_at,
				c.title as cause_title, c.organization as cause_organization,
				u.name as user_name
			FROM %s.donations d
			JOIN %s.causes c ON d.cause_id = c.id
			LEFT JOIN %s.users u ON d.user_id = u.id
			WHERE d.cause_id = $1
			ORDER BY d.created_at DESC
		`, r.schema, r.schema, r.schema)
	}

	rows, err := r.db.QueryContext(ctx, query, causeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var donations []*models.Donation
	for rows.Next() {
		var d models.Donation
		var userName sql.NullString
		
		if hasTransactionHash {
			err = rows.Scan(
				&d.ID, &d.UserID, &d.CauseID, &d.Amount, &d.IsAnonymous,
				&d.Status, &d.TransactionID, &d.TransactionHash, &d.CreatedAt, &d.UpdatedAt,
				&d.CauseTitle, &d.CauseOrganization, &userName,
			)
		} else {
			err = rows.Scan(
				&d.ID, &d.UserID, &d.CauseID, &d.Amount, &d.IsAnonymous,
				&d.Status, &d.TransactionID, &d.CreatedAt, &d.UpdatedAt,
				&d.CauseTitle, &d.CauseOrganization, &userName,
			)
		}
		
		if err != nil {
			return nil, err
		}
		
		if userName.Valid {
			d.UserName = userName.String
		} else {
			d.UserName = "Anonymous"
		}
		
		donations = append(donations, &d)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return donations, nil
}

// GetByUserID gets donations by user ID
func (r *DonationRepository) GetByUserID(ctx context.Context, userID int) ([]models.Donation, error) {
	query := fmt.Sprintf(`
		SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
			d.status, d.transaction_id, d.created_at, d.updated_at,
			c.title as cause_title, c.organization as cause_organization
		FROM %s.donations d
		JOIN %s.causes c ON d.cause_id = c.id
		WHERE d.user_id = $1
		ORDER BY d.created_at DESC
	`, r.schema, r.schema)
	
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var donations []models.Donation
	for rows.Next() {
		var d models.Donation
		var transactionID sql.NullString
		
		if err := rows.Scan(
			&d.ID, &d.UserID, &d.CauseID, &d.Amount, &d.IsAnonymous,
			&d.Status, &transactionID, &d.CreatedAt, &d.UpdatedAt,
			&d.CauseTitle, &d.CauseOrganization,
		); err != nil {
			return nil, err
		}
		
		if transactionID.Valid {
			d.TransactionID = transactionID.String
		}
		
		// Format the date for display
		d.Date = d.CreatedAt.Format("Jan 2, 2006")
		
		donations = append(donations, d)
	}
	
	return donations, nil
}

// GetMyDonations gets donations for the current user
func (r *DonationRepository) GetMyDonations(ctx context.Context, userID int) ([]models.Donation, error) {
	return r.GetByUserID(ctx, userID)
}

// GetRecent gets recent donations
func (r *DonationRepository) GetRecent(ctx context.Context, limit int) ([]*models.Donation, error) {
    // First, check if transaction_hash column exists
    var hasTransactionHash bool
    err := r.db.QueryRowContext(ctx, `
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = $1 
            AND table_name = 'donations' 
            AND column_name = 'transaction_hash'
        )
    `, r.schema).Scan(&hasTransactionHash)
    
    if err != nil {
        return nil, err
    }
    
    var query string
    if hasTransactionHash {
        query = fmt.Sprintf(`
            SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
                d.status, d.transaction_id, d.transaction_hash, d.created_at, d.updated_at,
                c.title as cause_title, c.organization as cause_organization,
                u.name as user_name
            FROM %s.donations d
            JOIN %s.causes c ON d.cause_id = c.id
            LEFT JOIN %s.users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
            LIMIT $1
        `, r.schema, r.schema, r.schema)
    } else {
        query = fmt.Sprintf(`
            SELECT d.id, d.user_id, d.cause_id, d.amount, d.is_anonymous, 
                d.status, d.transaction_id, d.created_at, d.updated_at,
                c.title as cause_title, c.organization as cause_organization,
                u.name as user_name
            FROM %s.donations d
            JOIN %s.causes c ON d.cause_id = c.id
            LEFT JOIN %s.users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
            LIMIT $1
        `, r.schema, r.schema, r.schema)
    }

    rows, err := r.db.QueryContext(ctx, query, limit)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var donations []*models.Donation
    for rows.Next() {
        var d models.Donation
        var userName, transactionID sql.NullString
        
        if hasTransactionHash {
            var transactionHash sql.NullString
            err = rows.Scan(
                &d.ID, &d.UserID, &d.CauseID, &d.Amount, &d.IsAnonymous,
                &d.Status, &transactionID, &transactionHash, &d.CreatedAt, &d.UpdatedAt,
                &d.CauseTitle, &d.CauseOrganization, &userName,
            )
            if transactionHash.Valid {
                d.TransactionHash = transactionHash.String
            }
        } else {
            err = rows.Scan(
                &d.ID, &d.UserID, &d.CauseID, &d.Amount, &d.IsAnonymous,
                &d.Status, &transactionID, &d.CreatedAt, &d.UpdatedAt,
                &d.CauseTitle, &d.CauseOrganization, &userName,
            )
        }
        
        if err != nil {
            return nil, err
        }
        
        if transactionID.Valid {
            d.TransactionID = transactionID.String
        }
        
        if userName.Valid {
            d.UserName = userName.String
        } else {
            d.UserName = "Anonymous"
        }
        
        donations = append(donations, &d)
    }

    if err = rows.Err(); err != nil {
        return nil, err
    }

    return donations, nil
}
