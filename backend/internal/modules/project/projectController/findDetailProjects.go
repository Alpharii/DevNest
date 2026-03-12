package projectController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func FindDetailProject(c *fiber.Ctx, db *gorm.DB) error {
	projectId := c.Params("id")
	var project entity.Project

	if err := db.
		Preload("Members").
		Preload("Owner").
		Preload("Owner.Profile").
		Where("id = ?", projectId).
		First(&project).Error; err != nil {
		return c.Status(fiber.StatusNotFound).
			JSON(fiber.Map{"error": "user not found"})
	}

	return c.Status(200).JSON(project)
}