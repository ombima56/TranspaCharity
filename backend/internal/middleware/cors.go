package middleware

import (
	"net/http"
	"os"
	"strings"
)

// CorsMiddleware adds CORS headers to responses
func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get allowed origins from environment variable
		allowedOrigins := os.Getenv("CORS_ALLOWED_ORIGINS")
		if allowedOrigins == "" {
			allowedOrigins = "*" // Default to all origins if not specified
		}

		// Check if the request origin is allowed
		origin := r.Header.Get("Origin")
		if origin != "" {
			if allowedOrigins == "*" {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			} else {
				// Check if the origin is in the list of allowed origins
				for _, allowed := range strings.Split(allowedOrigins, ",") {
					if strings.TrimSpace(allowed) == origin {
						w.Header().Set("Access-Control-Allow-Origin", origin)
						break
					}
				}
			}
		}

		// Set other CORS headers
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
