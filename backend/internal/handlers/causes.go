package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ombima56/transpacharity/internal/models"
	"github.com/ombima56/transpacharity/internal/repository"
)

// CauseHandler handles cause-related requests
type CauseHandler struct {
	causeRepo *repository.CauseRepository
}

// NewCauseHandler creates a new CauseHandler
func NewCauseHandler(causeRepo *repository.CauseRepository) *CauseHandler {
	return &CauseHandler{
		causeRepo: causeRepo,
	}
}

// GetAll gets all causes
func (h *CauseHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Get all causes
	causes, err := h.causeRepo.GetAll(r.Context())
	if err != nil {
		http.Error(w, "Error getting causes: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the causes
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(causes)
}

// GetFeatured gets featured causes
func (h *CauseHandler) GetFeatured(w http.ResponseWriter, r *http.Request) {
	// Get featured causes
	causes, err := h.causeRepo.GetFeatured(r.Context())
	if err != nil {
		http.Error(w, "Error getting featured causes: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the causes
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(causes)
}

// GetByID gets a cause by ID
func (h *CauseHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	// Get the cause ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid cause ID", http.StatusBadRequest)
		return
	}

	// Get the cause
	cause, err := h.causeRepo.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Error getting cause: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if cause == nil {
		http.Error(w, "Cause not found", http.StatusNotFound)
		return
	}

	// Return the cause
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cause)
}

// Create creates a new cause
func (h *CauseHandler) Create(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var input models.CauseInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Create the cause
	cause, err := h.causeRepo.Create(r.Context(), input)
	if err != nil {
		http.Error(w, "Error creating cause: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the cause
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(cause)
}

// Update updates a cause
func (h *CauseHandler) Update(w http.ResponseWriter, r *http.Request) {
	// Get the cause ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid cause ID", http.StatusBadRequest)
		return
	}

	// Parse the request body
	var input models.CauseInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Update the cause
	cause, err := h.causeRepo.Update(r.Context(), id, input)
	if err != nil {
		http.Error(w, "Error updating cause: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if cause == nil {
		http.Error(w, "Cause not found", http.StatusNotFound)
		return
	}

	// Return the updated cause
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cause)
}

// Delete deletes a cause
func (h *CauseHandler) Delete(w http.ResponseWriter, r *http.Request) {
	// Get the cause ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid cause ID", http.StatusBadRequest)
		return
	}

	// Delete the cause
	err = h.causeRepo.Delete(r.Context(), id)
	if err != nil {
		http.Error(w, "Error deleting cause: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return success
	w.WriteHeader(http.StatusNoContent)
}
