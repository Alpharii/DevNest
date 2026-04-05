package projectController

import (
	"devNest/internal/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

//flow:
//ambil user id dari token & validasi user
//jika user tidak ada di projectnya maka err
//delete ke project member
//

func LeaveProjects(c *fiber.Ctx, db *gorm.DB) error {
	userId := c.Locals("user_id")
	projectId := c.Params("id")

	userID, ok := userId.(uint)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"err": "session invalid"})
	}

	var count int64
	if err := db.Model(&entity.ProjectMember{}).
		Where("project_id = ? AND user_id = ?", projectId, userID).
		Count(&count).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"err": "internal server error"})
		} 
	
	if (count == 0){
		return c.Status(400).JSON(fiber.Map{"err": "user already leaved"})
	}

	var projectMember entity.ProjectMember
	if err := db.Where("project_id = ? AND user_id = ?", projectId, userID).First(&projectMember).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "member not found"})
	}

	if err := db.Delete(&projectMember).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"err": "internal server error"})
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "succes",
		"data": projectMember,
	})
}