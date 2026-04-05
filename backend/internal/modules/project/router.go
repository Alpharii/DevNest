package project

import (
	"devNest/internal/middleware"
	"devNest/internal/modules/project/projectController"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func ProjectRouter(router fiber.Router, db *gorm.DB){
	routes := router.Group("project", middleware.Protected())

	routes.Get("/", func (c *fiber.Ctx) error {
		return projectController.FindAllProjects(c, db)	
	})

	routes.Get("/:id", func (c *fiber.Ctx) error {
		return projectController.FindDetailProject(c, db)	
	})

	routes.Post("/", func (c *fiber.Ctx) error {
		return projectController.CreateProject(c, db)
	})

	routes.Patch("/:id", func (c *fiber.Ctx) error {
		return projectController.EditProject(c, db)
	})

	routes.Post("/:id/join", func (c *fiber.Ctx) error  {
		return projectController.JoinProject(c, db)
	})

	routes.Post("/:id/invite", func (c *fiber.Ctx) error  {
		return projectController.InviteMember(c, db)
	})
}