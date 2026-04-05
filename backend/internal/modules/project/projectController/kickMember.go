package projectController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

//flow
//ambil userid dari token & validate apakah owner dll
//ambil payload & validate
//setelah mendapat project id dan payload,user_id delete project member

func KickMember(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	userID, ok := userId.(uint)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"err": "session invalid"})
	}

	projectId := c.Params("id")
	if err := db.Where("id = ?", projectId).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "project not found"})
	}

	var payload struct {
		UserId	uint	`json:"user_id"`
	}

	if err := c.BodyParser(&payload); err != nil {
		c.Status(400).JSON(fiber.Map{"err": "payload invalid"})
	}

	var count int64
	if err := db.Model(&entity.ProjectMember{}).
		Where("project_id = ? AND user_id = ?", projectId, userID).
		Count(&count).Error; err != nil {
			c.Status(404).JSON(fiber.Map{"err": "project member not found"})
		}

	if count == 0 {
		return c.Status(400).JSON(fiber.Map{"err": "user is not a project member"})
	}

	var procjetMember entity.ProjectMember
	if err := db.Where("project_id = ? & user_id = ?", projectId, userID).First(&procjetMember).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "project member not found"})
	}

	if err := db.Delete(&procjetMember).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"err": "internal server error"})
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data": procjetMember,
	})
}