package projectController

import (
	"devNest/internal/entity"
	projectservices "devNest/internal/modules/project/projectServices"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func FindAllProjects(c *fiber.Ctx, db *gorm.DB) error {
	var projects []entity.Project
	var total int64

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	if page < 1 {
		page = 1
	}

	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	// filters
	search := strings.TrimSpace(c.Query("search"))
	visibility := c.Query("visibility")

	query := db.Model(&entity.Project{})

	// filter visibility
	if visibility != "" {
		visibilityInt, err := strconv.Atoi(visibility)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "visibility must be number",
			})
		}

		query = query.Where("visibility = ?", visibilityInt)
	}

	// filter search
	if search != "" {
		query = query.Where(
			"LOWER(title) LIKE ? OR LOWER(description) LIKE ?",
			"%"+strings.ToLower(search)+"%",
			"%"+strings.ToLower(search)+"%",
		)
	}

	// count total after filters
	if err := query.Count(&total).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed count projects",
		})
	}

	// get data
	if err := query.
		Preload("Owner").
		Preload("Owner.Profile").
		Preload("Members").
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&projects).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed get projects",
		})
	}

	response := projectservices.MapFindAllProjectsDTO(
		projects,
		page,
		limit,
		total,
	)

	return c.Status(200).JSON(response)
}