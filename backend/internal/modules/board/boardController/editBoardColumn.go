package boardController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func EditBoardColumn(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	boardId := c.Params("id")
	if(userId == nil){
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	var user entity.User
	userID := userId.(uint)
	if err  := db.Where("id = ?", userID).Preload("Profile").First(&user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not found"})
	}

	var boardColumn entity.BoardColumn
	if err := db.First(&boardColumn).Where("id = ?", boardId).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "board column not found"})
	}

	var payload struct {
		Name	*string	`json:"name"`
	}

	if err := c.BodyParser(&payload).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid payload"})
	}

	if payload.Name != nil {
		boardColumn.Name = *payload.Name
	}

	if err := db.Save(&boardColumn).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "failed to edit board"})
	}
	
	return c.Status(200).JSON(boardColumn)
}