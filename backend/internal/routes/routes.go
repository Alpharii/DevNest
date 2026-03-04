package routes

import (
	"devNest/internal/modules/auth"
	"devNest/internal/modules/users"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/gorm"
)

func InitRoutes(app *fiber.App, db *gorm.DB) {
	// frontendUrl := os.Getenv("FRONTEND_URL")
	
	app.Use(cors.New(cors.Config{
		// AllowOrigins:     frontendUrl,
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		// AllowCredentials: true,
	}))
	
	router := app.Group("/api")
	
	router.Get("/", func (c*fiber.Ctx) error {
		return c.JSON("hi from backend")
	})

	auth.AuthRouter(router, db)
	users.UserRouter(router, db)
}
