package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ombima56/transpacharity/internal/models"
	"github.com/ombima56/transpacharity/internal/repository"
)

// CategoryHandler handles category-related requests
type CategoryHandler struct {
	categoryRepo *repository.CategoryRepository
}

// NewCategoryHandler creates a new CategoryHandler
func NewCategoryHandler(categoryRepo *repository.CategoryRepository) *CategoryHandler {
	return &CategoryHandler{
		categoryRepo: categoryRepo,
	}
}

// GetAll gets all categories
func (h *CategoryHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Get all categories
	categories, err := h.categoryRepo.GetAll(r.Context())
	if err != nil {
		http.Error(w, "Error getting categories: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the categories
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

// GetByID gets a category by ID
func (h *CategoryHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	// Get the category ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid category ID", http.StatusBadRequest)
		return
	}

	// Get the category
	category, err := h.categoryRepo.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Error getting category: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if category == nil {
		http.Error(w, "Category not found", http.StatusNotFound)
		return
	}

	// Return the category
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(category)
}

// Create creates a new category
func (h *CategoryHandler) Create(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var input models.CategoryInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Create the category
	category, err := h.categoryRepo.Create(r.Context(), input)
	if err != nil {
		http.Error(w, "Error creating category: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the category
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(category)
}

// Update updates a category
func (h *CategoryHandler) Update(w http.ResponseWriter, r *http.Request) {
	// Get the category ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid category ID", http.StatusBadRequest)
		return
	}

	// Parse the request body
	var input models.CategoryInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Update the category
	category, err := h.categoryRepo.Update(r.Context(), id, input)
	if err != nil {
		http.Error(w, "Error updating category: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if category == nil {
		http.Error(w, "Category not found", http.StatusNotFound)
		return
	}

	// Return the updated category
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(category)
}

// Delete deletes a category
func (h *CategoryHandler) Delete(w http.ResponseWriter, r *http.Request) {
	// Get the category ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid category ID", http.StatusBadRequest)
		return
	}

	// Delete the category
	err = h.categoryRepo.Delete(r.Context(), id)
	if err != nil {
		http.Error(w, "Error deleting category: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return success
	w.WriteHeader(http.StatusNoContent)
}
