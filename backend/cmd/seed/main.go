package main

import (
	"context"
	"log"
	"time"

	"github.com/ombima56/transpacharity/internal/config"
	"github.com/ombima56/transpacharity/internal/database"
	"github.com/ombima56/transpacharity/internal/models"
	"github.com/ombima56/transpacharity/internal/repository"
)

func main() {
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

	// Create repositories
	userRepo := repository.NewUserRepository(db.DB)
	categoryRepo := repository.NewCategoryRepository(db.DB)
	causeRepo := repository.NewCauseRepository(db.DB)
	donationRepo := repository.NewDonationRepository(db.DB)

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Check if we already have data in the database
	existingCategories, err := categoryRepo.GetAll(ctx)
	if err != nil {
		log.Fatalf("Error checking existing categories: %v", err)
	}

	// Only seed if the database is empty
	if len(existingCategories) == 0 {
		log.Println("Database is empty. Starting seed process...")
		seedDatabase(ctx, userRepo, categoryRepo, causeRepo, donationRepo)
	} else {
		log.Println("Database already contains data. Skipping seed process.")
	}

	log.Println("Seed process completed!")
}

func seedDatabase(
	ctx context.Context,
	userRepo *repository.UserRepository,
	categoryRepo *repository.CategoryRepository,
	causeRepo *repository.CauseRepository,
	donationRepo *repository.DonationRepository,
) {
	// Seed categories
	log.Println("Seeding categories...")
	categories := []models.CategoryInput{
		{Name: "Environment", Description: "Environmental causes and conservation efforts"},
		{Name: "Education", Description: "Educational programs and initiatives"},
		{Name: "Disaster Relief", Description: "Emergency response and disaster relief efforts"},
		{Name: "Homelessness", Description: "Support for homeless individuals and families"},
		{Name: "Wildlife", Description: "Wildlife conservation and protection"},
		{Name: "Food Security", Description: "Addressing hunger and food insecurity"},
	}

	categoryMap := make(map[string]int)
	for _, category := range categories {
		c, err := categoryRepo.Create(ctx, category)
		if err != nil {
			log.Printf("Error creating category %s: %v", category.Name, err)
			continue
		}
		categoryMap[c.Name] = c.ID
		log.Printf("Created category: %s (ID: %d)", c.Name, c.ID)
	}

	// Seed causes
	log.Println("Seeding causes...")
	causes := []models.CauseInput{
		{
			Title:        "Clean Water for Rural Communities",
			Organization: "Water First Initiative",
			Description:  "Help provide clean and safe drinking water to rural communities in need. Your donation helps build wells and water filtration systems.",
			ImageURL:     "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
			GoalAmount:   50000,
			CategoryID:   categoryMap["Environment"],
			Featured:     true,
		},
		{
			Title:        "Education for Underserved Children",
			Organization: "Learn & Grow Foundation",
			Description:  "Support education programs for children in underserved communities. Funds go towards school supplies, scholarships, and teaching resources.",
			ImageURL:     "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
			GoalAmount:   30000,
			CategoryID:   categoryMap["Education"],
			Featured:     true,
		},
		// Add more causes as needed
	}

	causeMap := make(map[string]int)
	for _, cause := range causes {
		c, err := causeRepo.Create(ctx, cause)
		if err != nil {
			log.Printf("Error creating cause %s: %v", cause.Title, err)
			continue
		}
		causeMap[c.Title] = c.ID
		log.Printf("Created cause: %s (ID: %d)", c.Title, c.ID)
	}

	// Seed users
	log.Println("Seeding users...")
	users := []models.UserInput{
		{
			Name:     "Admin User",
			Email:    "admin@example.com",
			Password: "password123",
			Role:     models.RoleAdmin,
		},
		{
			Name:     "Regular User",
			Email:    "user@example.com",
			Password: "password123",
			Role:     models.RoleUser,
		},
	}

	userMap := make(map[string]int)
	for _, user := range users {
		u, err := userRepo.Create(ctx, user)
		if err != nil {
			log.Printf("Error creating user %s: %v", user.Email, err)
			continue
		}
		userMap[u.Email] = u.ID
		log.Printf("Created user: %s (ID: %d)", u.Email, u.ID)
	}

	// Seed donations (only if we have users and causes)
	if len(userMap) > 0 && len(causeMap) > 0 {
		log.Println("Seeding donations...")
		
		// Create temporary variables for user IDs
		adminID := userMap["admin@example.com"]
		regularUserID := userMap["user@example.com"]
		
		donations := []models.DonationInput{
			{
				UserID:      &adminID,
				CauseID:     causeMap["Clean Water for Rural Communities"],
				Amount:      100,
				IsAnonymous: false,
			},
			{
				UserID:      &regularUserID,
				CauseID:     causeMap["Education for Underserved Children"],
				Amount:      50,
				IsAnonymous: false,
			},
		}

		for _, donation := range donations {
			d, err := donationRepo.Create(ctx, donation)
			if err != nil {
				log.Printf("Error creating donation: %v", err)
				continue
			}
			log.Printf("Created donation: ID %d, Amount $%.2f", d.ID, d.Amount)
		}
	}
}
