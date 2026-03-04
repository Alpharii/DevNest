package usersController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetMe(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	if userId == nil {
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	var user entity.User

	if err := db.
		Preload("Profile").
		Where("id = ?", userId).
		First(&user).Error; err != nil {

		return c.Status(fiber.StatusNotFound).
			JSON(fiber.Map{"error": "user not found"})
	}

	return c.JSON(user)
}