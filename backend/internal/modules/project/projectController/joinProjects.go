package projectController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

//flow:
// Ambil user_id dari JWT/session
// Ambil project_id dari params

// Validasi:
// project exists
// project.visibility == public (misal = 1)

// Cek apakah user sudah join
// kalau sudah → return error

// Insert project member

func JoinProject(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	projectId := c.Params("id")
	var project entity.Project

	userID, ok := userId.(uint)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"err": "invalid session"})
	}

	//validate
	if err := db.Where("id = ?", projectId).First(&project).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "project not found"})
	}

	if(*project.Visibility != 1){
		return c.Status(401).JSON(fiber.Map{"error": "unaothorized, you can't join private project"})
	}

	var count int64

	db.Model(&entity.ProjectMember{}).
		Where("project_id = ? AND user_id = ?", project.ID, userID).
		Count(&count)

	if count > 0 {
		return c.Status(400).JSON(fiber.Map{
			"error": "user already joined this project",
		})
	}

	member := entity.ProjectMember{
		ProjectID: project.ID,
		UserID: userID,
		Role: "-",
	}

	if err := db.Create(&member).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to join projects"})
	}

	return c.Status(200).JSON(project)
}