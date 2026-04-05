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

	var payload struct {
		UserId	uint	`json:"user_id"`
	}

	if payload.UserId == 0 {
		return c.Status(400).JSON(fiber.Map{"err": "user_id is required"})
	}

	var project entity.Project
	if err := db.Where("id = ?", projectId).First(&project).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "user not found"})
	}

	if (project.OwnerID != userID) {
		return c.Status(401).JSON(fiber.Map{"err": "unauthorized"})
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"err": "payload invalid"})
	}

	var user entity.User
	if err := db.Where("id = ?", payload.UserId).First(&user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "user not found"})
	}

	var count int64
	if err := db.Model(&entity.ProjectMember{}).
		Where("project_id = ? AND user_id = ?", projectId, user.ID).
		Count(&count).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "project member not found"})
		}

	if count == 0 {
		return c.Status(400).JSON(fiber.Map{"err": "user is not a project member"})
	}

	var projectMember entity.ProjectMember
	if err := db.Where("project_id = ? AND user_id = ?", projectId, user.ID).First(&projectMember).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "project member not found"})
	}

	if err := db.Delete(&projectMember).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"err": "internal server error"})
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data": projectMember,
	})
}