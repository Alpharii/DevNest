package usersController

import (
	"devNest/internal/entity"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateMyProfile(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	if userId == nil {
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	userID := userId.(uint)

	// cek apakah profile sudah ada
	var existing entity.Profile
	if err := db.Where("user_id = ?", userID).First(&existing).Error; err == nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "profile already exists",
		})
	}

	// request body
	var payload struct {
		Bio             string   `json:"bio"`
		AvatarURL       string   `json:"avatar_url"`
		Location        string   `json:"location"`
		Website         string   `json:"website"`
		GithubURL       string   `json:"github_url"`
		LinkedinURL     string   `json:"linkedin_url"`
		TwitterURL      string   `json:"twitter_url"`
		ExperienceLevel string   `json:"experience_level"`
		Availability    string   `json:"availability"`
		Skills          []string `json:"skills"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid payload"})
	}

	// convert skills -> jsonb
	skillsJSON, _ := json.Marshal(payload.Skills)

	profile := entity.Profile{
		UserID:          userID,
		Bio:             payload.Bio,
		AvatarURL:       payload.AvatarURL,
		Location:        payload.Location,
		Website:         payload.Website,
		GithubURL:       payload.GithubURL,
		LinkedinURL:     payload.LinkedinURL,
		TwitterURL:      payload.TwitterURL,
		ExperienceLevel: payload.ExperienceLevel,
		Availability:    payload.Availability,
		Skills:          skillsJSON,
	}

	if err := db.Create(&profile).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(profile)
}