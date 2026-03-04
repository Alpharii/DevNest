package users

import (
	"devNest/internal/modules/users/usersController"
	"devNest/internal/middleware"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func UserRouter(router fiber.Router, db *gorm.DB) {
	routes := router.Group("/users", middleware.Protected())
	
	routes.Get("/me", func(c *fiber.Ctx) error {
		return usersController.GetMe(c, db)
	})
	
	routes.Get("/:id", func(c *fiber.Ctx) error {
		return usersController.GetUserProfileById(c, db)
	})

	routes.Post("/me/profile", func(c *fiber.Ctx) error {
    	return usersController.CreateMyProfile(c, db)
	})

	routes.Put("/me/profile", func(c *fiber.Ctx) error {
    	return usersController.EditMyProfile(c, db)
	})
}