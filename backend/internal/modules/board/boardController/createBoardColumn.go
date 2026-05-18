package boardController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateBoardColumn(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	if(userId == nil){
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	var user entity.User
	userID := userId.(uint)
	if err  := db.Where("id = ?", userID).Preload("Profile").First(&user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not found"})
	}
	
	var payload struct {
		Name      	string	`json:"name"`
		ProjectID 	uint	`json:"project_id"`
	}

	if err := c.BodyParser(&payload).Error; err != nil{
		return c.Status(400).JSON(fiber.Map{"error": "invalid"})
	}

	boardColumn := entity.BoardColumn{
		Name: payload.Name,
		ProjectID: payload.ProjectID,
	}

	if err := db.Create(&boardColumn).Error; err != nil{
		return c.Status(400).JSON(fiber.Map{"error": "failed to create column"})
	}

	return c.Status(201).JSON(boardColumn)
}