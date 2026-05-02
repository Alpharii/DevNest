package usersController

import (
	"devNest/internal/entity"
	usersservices "devNest/internal/modules/users/usersServices"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

//get token
//get user from token
//get projects from user
//

func GetUserDashboard(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")

	if userId == nil {
		return c.Status(401).JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	userID := userId.(uint)

	var user entity.User

	err := db.
		Preload("Profile").
		Preload("OwnedProjects").
		Preload("MemberProjects.Project").
		First(&user, userID).Error

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	response := usersservices.MapDashboardToDTO(user)

	return c.JSON(response)
}