package projectController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateProject(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	if userId == nil {
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	userID := userId.(uint)
	
	// request body
	var payload struct {
		Title       	string  `json:"title"`
		Description     string  `json:"description"`
		Visibility     	uint   	`json:"visibility"`
	}

	if err := c.BodyParser(&payload); err != nil{
		return c.Status(400).JSON(fiber.Map{"error": "invalid payload"})
	}

	project := entity.Project{
		Title:       payload.Title,
		Description: payload.Description,
		OwnerID:     userID,
	}

	v := payload.Visibility
	project.Visibility = &v

	if err := db.Create(&project).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(project)
}