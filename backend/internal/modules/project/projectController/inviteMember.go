package projectController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

//flow:
// Ambil user_id dari JWT/session
// Ambil user_id untuk di invite dari body
// Ambil project_id dari params

// Validasi:
// project exists
// cek apakah user yang menginvite adalah owner project
// cek apakah user yang di invite exists
// cek apakah user yang di invite sudah join

// Insert project member

func InviteMember(c *fiber.Ctx, db *gorm.DB) error {
	ownerId := c.Locals("user_id")
	projectId := c.Params("id")
	var project entity.Project

	ownerID, ok := ownerId.(uint)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"err": "invalid session"})
	}
	
	if err := db.Where("id = ?", projectId).First(&project).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "project not found"})
	}

	if(project.OwnerID != ownerID){
		return c.Status(401).JSON(fiber.Map{"err": "unauthorized"})
	}

	var payload struct{
		UserId	uint	`json:"user_id"`
		Role	string	`json:"role"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"err": "invalid payload"})
	}

	var user entity.User
	if err := db.Where("id = ?", payload.UserId).First(&user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "user not found"})
	}

	var count int64
	if err := db.Model(&entity.ProjectMember{}).
		Where("project_id = ? AND user_id = ?", projectId, payload.UserId).
		Count(&count).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"err": "internal server error"})
		}
	
	if(count > 0) {
		return c.Status(400).JSON(fiber.Map{"err": "user already joined"})
	}

	member := entity.ProjectMember {
		ProjectID: project.ID,
		UserID: user.ID,
		Role: payload.Role,
	}

	if err := db.Create(&member).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"err": "error creating project member"})
	}
	
	return c.Status(201).JSON(member)
}