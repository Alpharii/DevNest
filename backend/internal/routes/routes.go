package routes

import (
	"github.com/gofiber/fiber/v2"
)

func InitRoutes(app *fiber.App) {
	router := app.Group("/api")

		
	router.Get("/", func (c*fiber.Ctx) error {
		return c.JSON("hi from backend")
	})

	// auth := router.Group("/auth")
	// auth.Post("/register", )

}