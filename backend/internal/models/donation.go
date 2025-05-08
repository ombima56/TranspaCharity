package models

import (
	"time"
)

// DonationStatus represents the status of a donation
type DonationStatus string

const (
	DonationStatusPending   DonationStatus = "pending"
	DonationStatusCompleted DonationStatus = "completed"
	DonationStatusFailed    DonationStatus = "failed"
)

// Donation represents a donation to a cause
type Donation struct {
	ID            int            `json:"id"`
	UserID        *int           `json:"user_id,omitempty"` // Nullable for anonymous donations
	CauseID       int            `json:"cause_id"`
	Amount        float64        `json:"amount"`
	IsAnonymous   bool           `json:"is_anonymous"`
	Status        DonationStatus `json:"status"`
	TransactionID string         `json:"transaction_id,omitempty"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`

	// Denormalized fields for convenience
	UserName  string `json:"user_name,omitempty"`
	CauseTitle string `json:"cause,omitempty"`
}

// DonationInput represents the data needed to create a donation
type DonationInput struct {
	UserID      *int    `json:"user_id"`
	CauseID     int     `json:"cause_id" validate:"required"`
	Amount      float64 `json:"amount" validate:"required,gt=0"`
	IsAnonymous bool    `json:"is_anonymous"`
}
