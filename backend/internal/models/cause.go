package models

import (
	"time"
)

// Cause represents a charitable cause
type Cause struct {
	ID           int       `json:"id"`
	Title        string    `json:"title"`
	Organization string    `json:"organization"`
	Description  string    `json:"description"`
	ImageURL     string    `json:"image_url"`
	RaisedAmount float64   `json:"raised_amount"`
	GoalAmount   float64   `json:"goal_amount"`
	CategoryID   int       `json:"category_id"`
	CategoryName string    `json:"category"`
	Featured     bool      `json:"featured"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// CauseInput represents the data needed to create or update a cause
type CauseInput struct {
	Title        string  `json:"title" validate:"required,min=5,max=200"`
	Organization string  `json:"organization" validate:"required,min=2,max=200"`
	Description  string  `json:"description" validate:"required"`
	ImageURL     string  `json:"image_url" validate:"required,url"`
	GoalAmount   float64 `json:"goal_amount" validate:"required,gt=0"`
	CategoryID   int     `json:"category_id" validate:"required"`
	Featured     bool    `json:"featured"`
}
