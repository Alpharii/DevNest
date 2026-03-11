package projectController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func FindAllProjects(c *fiber.Ctx, db *gorm.DB) error {
	var project []entity.Project

	if err := db.
		Preload("Owner").
		Preload("Owner.Profile").
		Find(&project).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "error"})
	}

	return c.Status(200).JSON(project)
}