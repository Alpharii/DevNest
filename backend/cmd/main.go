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

	// Routes
	routes.InitRoutes(app)

	port := config.GetEnv("PORT")

	fmt.Println("Server Running in http://localhost:" + port)
	app.Listen(":" + port)
}