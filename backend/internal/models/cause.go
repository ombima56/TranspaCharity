package models

import (
	"time"
)

// Cause represents a cause
type Cause struct {
	ID           int       `json:"id"`
	Title        string    `json:"title"`
	Organization string    `json:"organization"`
	Description  string    `json:"description"`
	ImageURL     string    `json:"image_url"`
	RaisedAmount float64   `json:"raised_amount"`
	GoalAmount   float64   `json:"goal_amount"`
	CategoryID   int       `json:"category_id"`
	Featured     int       `json:"featured"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	CategoryName string    `json:"category_name,omitempty"`
	Category     string    `json:"category,omitempty"`
}

// CauseInput represents the data needed to create or update a cause
type CauseInput struct {
	Title        string  `json:"title" validate:"required"`
	Organization string  `json:"organization" validate:"required"`
	Description  string  `json:"description" validate:"required"`
	ImageURL     string  `json:"image_url" validate:"required"`
	GoalAmount   float64 `json:"goal_amount" validate:"required,gt=0"`
	CategoryID   int     `json:"category_id" validate:"required"`
	Featured     int     `json:"featured"` // Changed from bool to int
}
