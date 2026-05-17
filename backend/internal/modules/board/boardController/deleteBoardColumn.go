package boardController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func DeleteBoardColumn(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	if(userId == nil){
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	var user entity.User
	userID := userId.(uint)
	if err  := db.Where("id = ?", userID).Preload("Profile").First(&user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not found"})
	}
	
	return nil
}