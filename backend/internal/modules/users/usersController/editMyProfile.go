package usersController

import (
	"devNest/internal/entity"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func EditMyProfile(c*fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	if(userId == nil){
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	var user entity.User
	userID := userId.(uint)
	if err  := db.Where("id = ?", userID).Preload("Profile").First(&user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not found"})
	}
	
	var body struct {
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

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	skillsJSON, _ := json.Marshal(body.Skills)
	input := entity.Profile{
		UserID:          userID,
		Bio:             body.Bio,
		AvatarURL:       body.AvatarURL,
		Location:        body.Location,
		Website:         body.Website,
		GithubURL:       body.GithubURL,
		LinkedinURL:     body.LinkedinURL,
		TwitterURL:      body.TwitterURL,
		ExperienceLevel: body.ExperienceLevel,
		Availability:    body.Availability,
		Skills:          skillsJSON,
	}

	var profile entity.Profile
	if err := db.First(&profile, user.Profile.ID).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "profile not found"})
	}

	if err := db.Model(&profile).Updates(input).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "internal server error"})
	}

	return nil
}