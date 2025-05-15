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

// Donation represents a donation
type Donation struct {
	ID                int            `json:"id"`
	UserID            *int           `json:"user_id"`
	CauseID           int            `json:"cause_id"`
	Amount            float64        `json:"amount"`
	IsAnonymous       bool           `json:"is_anonymous"`
	Status            DonationStatus `json:"status"`
	TransactionID     string         `json:"transaction_id,omitempty"`
	TransactionHash   string         `json:"transaction_hash,omitempty"`
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
	CauseTitle        string         `json:"cause_title,omitempty"`
	CauseOrganization string         `json:"cause_organization,omitempty"`
	UserName          string         `json:"user_name,omitempty"`
	Date              string         `json:"date,omitempty"` // Formatted date for display
}

// DonationInput represents the data needed to create a donation
type DonationInput struct {
	UserID      *int    `json:"user_id"`
	CauseID     int     `json:"cause_id" validate:"required"`
	Amount      float64 `json:"amount" validate:"required,gt=0"`
	IsAnonymous bool    `json:"is_anonymous"`
}
