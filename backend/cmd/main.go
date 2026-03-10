package main

import (
	"devNest/config"
	"devNest/internal/entity"
	"devNest/internal/routes"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func main() {
	config.LoadEnv()

	app := fiber.New()
	
	// DB
	config.ConnectDB()

	// Auto migrate
	config.DB.AutoMigrate(&entity.User{})
	config.DB.AutoMigrate(&entity.Profile{})
	config.DB.AutoMigrate(&entity.Project{})
	config.DB.AutoMigrate(&entity.ProjectMember{})

	// Routes
	routes.InitRoutes(app, config.DB)

	port := config.GetEnv("PORT")

	fmt.Println("Server Running in http://localhost:" + port)
	app.Listen(":" + port)
}