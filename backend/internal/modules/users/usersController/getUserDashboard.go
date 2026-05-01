package usersController

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

//get token
//get user from token
//get projects from user
//

func GetUserDashboard(c *fiber.Ctx, db *gorm.DB) error {


	return c.JSON(fiber.Map{"message": "user dashboard"})
}