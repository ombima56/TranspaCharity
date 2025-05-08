package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ombima56/transpacharity/internal/middleware"
	"github.com/ombima56/transpacharity/internal/models"
	"github.com/ombima56/transpacharity/internal/repository"
)

// DonationHandler handles donation-related requests
type DonationHandler struct {
	donationRepo *repository.DonationRepository
}

// NewDonationHandler creates a new DonationHandler
func NewDonationHandler(donationRepo *repository.DonationRepository) *DonationHandler {
	return &DonationHandler{
		donationRepo: donationRepo,
	}
}

// Create creates a new donation
func (h *DonationHandler) Create(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var input models.DonationInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// If the user is authenticated, get the user ID from the context
	userID, err := middleware.GetUserIDFromContext(r.Context())
	if err == nil && input.UserID == nil {
		// Only set the user ID if it's not already set in the input
		input.UserID = &userID
	}

	// Create the donation
	donation, err := h.donationRepo.Create(r.Context(), input)
	if err != nil {
		http.Error(w, "Error creating donation: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the donation
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(donation)
}

// GetAll gets all donations
func (h *DonationHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Get all donations
	donations, err := h.donationRepo.GetAll(r.Context())
	if err != nil {
		http.Error(w, "Error getting donations: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the donations
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(donations)
}

// GetByID gets a donation by ID
func (h *DonationHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	// Get the donation ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid donation ID", http.StatusBadRequest)
		return
	}

	// Get the donation
	donation, err := h.donationRepo.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Error getting donation: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if donation == nil {
		http.Error(w, "Donation not found", http.StatusNotFound)
		return
	}

	// Return the donation
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(donation)
}

// GetByCauseID gets donations for a cause
func (h *DonationHandler) GetByCauseID(w http.ResponseWriter, r *http.Request) {
	// Get the cause ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid cause ID", http.StatusBadRequest)
		return
	}

	// Get the donations
	donations, err := h.donationRepo.GetByCauseID(r.Context(), id)
	if err != nil {
		http.Error(w, "Error getting donations: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the donations
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(donations)
}

// GetByUserID gets donations for a user
func (h *DonationHandler) GetByUserID(w http.ResponseWriter, r *http.Request) {
	// Get the user ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Get the donations
	donations, err := h.donationRepo.GetByUserID(r.Context(), id)
	if err != nil {
		http.Error(w, "Error getting donations: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the donations
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(donations)
}

// GetMyDonations gets donations for the current user
func (h *DonationHandler) GetMyDonations(w http.ResponseWriter, r *http.Request) {
	// Get the user ID from the context
	userID, err := middleware.GetUserIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get the donations
	donations, err := h.donationRepo.GetByUserID(r.Context(), userID)
	if err != nil {
		http.Error(w, "Error getting donations: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the donations
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(donations)
}

// GetRecentDonations gets recent donations
func (h *DonationHandler) GetRecentDonations(w http.ResponseWriter, r *http.Request) {
	// Get the limit from the query string
	limitStr := r.URL.Query().Get("limit")
	limit := 5 // Default limit
	if limitStr != "" {
		var err error
		limit, err = strconv.Atoi(limitStr)
		if err != nil || limit < 1 {
			limit = 5
		}
	}

	// Get the recent donations
	donations, err := h.donationRepo.GetRecentDonations(r.Context(), limit)
	if err != nil {
		http.Error(w, "Error getting recent donations: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the donations
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(donations)
}
