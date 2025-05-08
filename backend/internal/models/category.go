package models

import "time"

// Category represents a category for causes
type Category struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CategoryInput represents the data needed to create or update a category
type CategoryInput struct {
	Name        string `json:"name" validate:"required,min=2,max=100"`
	Description string `json:"description"`
}
