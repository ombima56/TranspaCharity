package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"runtime"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"github.com/ombima56/transpacharity/internal/config"
	"github.com/ombima56/transpacharity/internal/database"
	"github.com/ombima56/transpacharity/internal/handlers"
	customMiddleware "github.com/ombima56/transpacharity/internal/middleware"
	"github.com/ombima56/transpacharity/internal/repository"
)

func main() {
	// Load .env file from the project root
	_, filename, _, _ := runtime.Caller(0)
	projectRoot := filepath.Join(filepath.Dir(filename), "../..")
	envPath := filepath.Join(projectRoot, ".env")
	
	err := godotenv.Load(envPath)
	if err != nil {
		log.Printf("Warning: Could not load .env file from %s: %v", envPath, err)
		log.Println("This is expected in production environments where environment variables are set differently")
	} else {
		log.Printf("Loaded environment from %s", envPath)
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Error loading configuration: %v", err)
	}

	// Connect to the database
	db, err := database.New(&cfg.Database)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer db.Close()

	// Run database migrations
	if err := db.RunMigrations(); err != nil {
		log.Fatalf("Error running migrations: %v", err)
	}
	
	// Set up HTTP server with graceful shutdown
	router := setupRouter(db, cfg)
	
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Server.Port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
	
	// Start server in a goroutine
	go func() {
		log.Printf("Starting server on port %d in %s mode", cfg.Server.Port, cfg.Server.Environment)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error starting server: %v", err)
		}
	}()
	
	// Set up graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	
	log.Println("Shutting down server...")
	
	// Create a deadline for shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	
	// Attempt graceful shutdown
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	
	log.Println("Server exited properly")
}

// setupRouter extracts the router setup to a separate function
func setupRouter(db *database.DB, cfg *config.Config) *chi.Mux {
	// Create repositories
	userRepo := repository.NewUserRepository(db.DB, &cfg.Database)
	categoryRepo := repository.NewCategoryRepository(db.DB, &cfg.Database)
	causeRepo := repository.NewCauseRepository(db.DB, &cfg.Database)
	donationRepo := repository.NewDonationRepository(db.DB, &cfg.Database)

	// Create handlers
	userHandler := handlers.NewUserHandler(userRepo, &cfg.JWT)
	categoryHandler := handlers.NewCategoryHandler(categoryRepo)
	causeHandler := handlers.NewCauseHandler(causeRepo)
	donationHandler := handlers.NewDonationHandler(donationRepo)

	// Create router
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(30 * time.Second))
	r.Use(customMiddleware.CorsMiddleware(&cfg.Server))

	// Routes
	r.Route("/api", func(r chi.Router) {
		// Public routes
		r.Group(func(r chi.Router) {
			// User routes
			r.Post("/users/register", userHandler.Register)
			r.Post("/users/login", userHandler.Login)

			// Category routes
			r.Get("/categories", categoryHandler.GetAll)
			r.Get("/categories/{id}", categoryHandler.GetByID)

			// Cause routes
			r.Get("/causes", causeHandler.GetAll)
			r.Get("/causes/featured", causeHandler.GetFeatured)
			r.Get("/causes/{id}", causeHandler.GetByID)

			// Donation routes
			r.Post("/donations", donationHandler.Create)
			r.Get("/donations/recent", donationHandler.GetRecentDonations)
			r.Get("/causes/{id}/donations", donationHandler.GetByCauseID)
			r.Get("/donations", donationHandler.GetAll) // Add this line to make donations accessible without auth
			
			// Add a debug route to test if the router is working
			r.Get("/test", func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("API is working"))
			})
		})

		// Protected routes
		r.Group(func(r chi.Router) {
			r.Use(customMiddleware.AuthMiddleware(&cfg.JWT))

			// User routes
			r.Get("/users/me", userHandler.GetMe)
			r.Put("/users/me", userHandler.UpdateMe)
			r.Get("/users/{id}", userHandler.GetUserByID)

			// Donation routes - move these to public if needed
			r.Get("/donations/{id}", donationHandler.GetByID)
			r.Get("/users/{id}/donations", donationHandler.GetByUserID)
			r.Get("/users/me/donations", donationHandler.GetMyDonations)

			// Admin routes (these would typically have additional authorization)
			r.Post("/categories", categoryHandler.Create)
			r.Put("/categories/{id}", categoryHandler.Update)
			r.Delete("/categories/{id}", categoryHandler.Delete)

			r.Post("/causes", causeHandler.Create)
			r.Put("/causes/{id}", causeHandler.Update)
			r.Delete("/causes/{id}", causeHandler.Delete)
		})
	})

	return r
}
