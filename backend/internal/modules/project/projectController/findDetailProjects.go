package projectController

import (
	"devNest/internal/entity"
	projectservices "devNest/internal/modules/project/projectServices"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func FindDetailProject(c *fiber.Ctx, db *gorm.DB) error {
	projectId := c.Params("id")

	userId := c.Locals("user_id")
	if userId == nil {
		return c.Status(401).JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	userID := userId.(uint)
	var project entity.Project

	err := db.
		Preload("Owner.Profile").
		Preload("Members.User.Profile").
		First(&project, projectId).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(404).JSON(fiber.Map{
				"error": "project not found",
			})
		}

		return c.Status(500).JSON(fiber.Map{
			"error": "database error",
		})
	}

	response := projectservices.MapDetailProjectDTO(project, userID)

	return c.Status(200).JSON(response)
}