package board

import (
	"devNest/internal/middleware"
	"devNest/internal/modules/board/boardController"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func BoardRouter(router fiber.Router, db *gorm.DB) {
	routes := router.Group("/board", middleware.Protected())

	routes.Post("/", func(c *fiber.Ctx) error {
		return boardController.CreateBoardColumn(c, db)
	})

	routes.Patch("/:id", func(c *fiber.Ctx) error {
		return boardController.EditBoardColumn(c, db)
	})

	routes.Delete("/:id", func(c *fiber.Ctx) error {
		return boardController.DeleteBoardColumn(c, db)
	})
}