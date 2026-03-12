package projectController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func EditProject (c *fiber.Ctx, db *gorm.DB) error {
	projectId := c.Params("id")
	userId := c.Locals("user_id")
	
	if(userId == nil){
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	var payload struct {
		Title       *string `json:"title"`
		Description *string `json:"description"`
		Visibility  *uint   `json:"visibility"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid payload"})
	}

	var project entity.Project

	if err := db.First(&project, projectId).Error; err != nil{
		return c.Status(404).JSON(fiber.Map{"error": "project not found"})
	}

	if project.OwnerID != userId {
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	if payload.Title != nil {
		project.Title = *payload.Title
	}

	if payload.Description != nil {
		project.Description = *payload.Description
	}

	if payload.Visibility != nil {
		project.Visibility = payload.Visibility
	}

	if err := db.Save(&project).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "internal server error"})
	}

	return c.Status(201).JSON(project)
}