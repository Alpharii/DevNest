package auth

import (
	"devNest/internal/modules/auth/authController"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func AuthRouter(router fiber.Router, db *gorm.DB) {
	auth := router.Group("/auth")

	auth.Post("/login", func(c *fiber.Ctx) error {
		return authController.Login(c, db)
	})
	auth.Post("/register", func(c *fiber.Ctx) error {
		return authController.Register(c, db)
	})
}