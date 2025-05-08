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
		{
			Title:        "Emergency Disaster Relief",
			Organization: "Global Relief Network",
			Description:  "Provide emergency aid to communities affected by natural disasters. Your contribution helps deliver food, shelter, and medical assistance.",
			ImageURL:     "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
			GoalAmount:   200000,
			CategoryID:   categoryMap["Disaster Relief"],
			Featured:     false,
		},
		{
			Title:        "Homeless Shelter Support",
			Organization: "Safe Haven",
			Description:  "Help maintain and expand homeless shelters in urban areas. Donations provide meals, beds, and essential services for those in need.",
			ImageURL:     "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
			GoalAmount:   15000,
			CategoryID:   categoryMap["Homelessness"],
			Featured:     false,
		},
		{
			Title:        "Wildlife Conservation",
			Organization: "EarthGuard",
			Description:  "Support efforts to protect endangered species and their habitats. Funds contribute to conservation programs and anti-poaching initiatives.",
			ImageURL:     "https://images.unsplash.com/photo-1719214486028-57c0b8d755b7",
			GoalAmount:   75000,
			CategoryID:   categoryMap["Wildlife"],
			Featured:     false,
		},
		{
			Title:        "Food Bank Expansion",
			Organization: "Community Harvest",
			Description:  "Help expand local food banks to serve more families facing food insecurity. Your donation helps purchase food and improve distribution.",
			ImageURL:     "https://images.unsplash.com/photo-1638695684179-3a61a707e6ea",
			GoalAmount:   25000,
			CategoryID:   categoryMap["Food Security"],
			Featured:     false,
		},
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
		},
		{
			Name:     "Sarah Johnson",
			Email:    "sarah@example.com",
			Password: "password123",
		},
		{
			Name:     "Michael Chen",
			Email:    "michael@example.com",
			Password: "password123",
		},
		{
			Name:     "Emma Williams",
			Email:    "emma@example.com",
			Password: "password123",
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

	// Seed donations
	log.Println("Seeding donations...")

	// Create temporary variables for user IDs
	sarahID := userMap["sarah@example.com"]
	michaelID := userMap["michael@example.com"]
	emmaID := userMap["emma@example.com"]

	donations := []models.DonationInput{
		{
			UserID:      &sarahID,
			CauseID:     causeMap["Clean Water for Rural Communities"],
			Amount:      100,
			IsAnonymous: false,
		},
		{
			UserID:      nil, // Anonymous
			CauseID:     causeMap["Education for Underserved Children"],
			Amount:      50,
			IsAnonymous: true,
		},
		{
			UserID:      &michaelID,
			CauseID:     causeMap["Wildlife Conservation"],
			Amount:      75,
			IsAnonymous: false,
		},
		{
			UserID:      nil, // Anonymous
			CauseID:     causeMap["Food Bank Expansion"],
			Amount:      25,
			IsAnonymous: true,
		},
		{
			UserID:      &emmaID,
			CauseID:     causeMap["Emergency Disaster Relief"],
			Amount:      200,
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

	log.Println("Seeding completed successfully!")
}
