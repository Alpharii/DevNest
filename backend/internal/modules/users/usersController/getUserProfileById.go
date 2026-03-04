package usersController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetUserProfileById(c *fiber.Ctx, db *gorm.DB) error {
	userId :=  c.Params("id")

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