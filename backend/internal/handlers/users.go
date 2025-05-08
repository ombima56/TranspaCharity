package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ombima56/transpacharity/internal/config"
	"github.com/ombima56/transpacharity/internal/middleware"
	"github.com/ombima56/transpacharity/internal/models"
	"github.com/ombima56/transpacharity/internal/repository"
)

// UserHandler handles user-related requests
type UserHandler struct {
	userRepo *repository.UserRepository
	jwtCfg   *config.JWTConfig
}

// NewUserHandler creates a new UserHandler
func NewUserHandler(userRepo *repository.UserRepository, jwtCfg *config.JWTConfig) *UserHandler {
	return &UserHandler{
		userRepo: userRepo,
		jwtCfg:   jwtCfg,
	}
}

// Register handles user registration
func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var input models.UserInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if the email is already in use
	existingUser, err := h.userRepo.GetByEmail(r.Context(), input.Email)
	if err != nil {
		http.Error(w, "Error checking email: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if existingUser != nil {
		http.Error(w, "Email already in use", http.StatusBadRequest)
		return
	}

	// Create the user
	user, err := h.userRepo.Create(r.Context(), input)
	if err != nil {
		http.Error(w, "Error creating user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Generate a JWT token
	token, err := middleware.GenerateToken(user.ID, user.Email, h.jwtCfg)
	if err != nil {
		http.Error(w, "Error generating token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the user and token
	response := map[string]interface{}{
		"user":  user,
		"token": token,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// Login handles user login
func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var input models.UserLoginInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get the user by email
	user, err := h.userRepo.GetByEmail(r.Context(), input.Email)
	if err != nil {
		http.Error(w, "Error getting user: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if user == nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// Check the password
	if !models.CheckPassword(input.Password, user.PasswordHash) {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// Generate a JWT token
	token, err := middleware.GenerateToken(user.ID, user.Email, h.jwtCfg)
	if err != nil {
		http.Error(w, "Error generating token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the user and token
	response := map[string]interface{}{
		"user":  user,
		"token": token,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetMe gets the current user
func (h *UserHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	// Get the user ID from the context
	userID, err := middleware.GetUserIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get the user
	user, err := h.userRepo.GetByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "Error getting user: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if user == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Return the user
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// UpdateMe updates the current user
func (h *UserHandler) UpdateMe(w http.ResponseWriter, r *http.Request) {
	// Get the user ID from the context
	userID, err := middleware.GetUserIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse the request body
	var input models.UserInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Update the user
	user, err := h.userRepo.Update(r.Context(), userID, input)
	if err != nil {
		http.Error(w, "Error updating user: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if user == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Return the updated user
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// GetUserByID gets a user by ID
func (h *UserHandler) GetUserByID(w http.ResponseWriter, r *http.Request) {
	// Get the user ID from the URL
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Get the user
	user, err := h.userRepo.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Error getting user: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if user == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Return the user
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
