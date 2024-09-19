package main

import (
	"os"

	"github.com/flugika/Logify/controller"
	"github.com/flugika/Logify/entity"
	"github.com/flugika/Logify/middlewares"
	"github.com/gin-gonic/gin"
)

const PORT = "8080"

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func main() {
	// Delete database file before BUILD and RUN
	os.Remove("./Logify.db")

	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	router := r.Group("/")
	{
		router.Use(middlewares.Authorizes())
		{
			// user Routes
			router.POST("/user", controller.CreateUser)
			router.GET("/user/:id", controller.GetUser)
			router.GET("/users", controller.ListUsers)
			router.DELETE("/user/:id", controller.DeleteUser)
			router.PATCH("/users", controller.UpdateUser)

			// follower Routes
			router.POST("/follow", controller.FollowUser)
			router.GET("/followers", controller.ListFollowerByUID)
			router.DELETE("/unfollow", controller.UnfollowUser)

			// log Routes
			router.POST("/log", controller.CreateLog)
			router.GET("/log/:id", controller.GetLog)
			router.GET("/mostLike/:id", controller.GetMostLikeLog)
			router.GET("/mostSave/:id", controller.GetMostSaveLog)
			router.GET("/logs", controller.ListLogs)
			router.GET("/logs/:id", controller.ListLogsByID)
			router.DELETE("/log/:id", controller.DeleteLog)
			router.PATCH("/logs", controller.UpdateLog)

			// Mood Routes
			router.GET("/mood/:id", controller.GetMood)
			router.GET("/moods", controller.ListMoods)

			// Music Routes
			router.POST("/music", controller.CreateMusic)
			router.GET("/music/:id", controller.GetMusic)
			router.GET("/musics", controller.ListMusics)
			router.DELETE("/music/:id", controller.DeleteMusic)

			// Category Routes
			router.GET("/category/:id", controller.GetCategory)
			router.GET("/categories", controller.ListCategories)

			// Like Routes
			router.POST("/like", controller.CreateLike)
			router.GET("/like/:lid", controller.ListLikesByLogID)
			router.GET("/likes", controller.ListLikes)
			router.DELETE("/like", controller.DeleteLike)

			// Save Routes
			router.POST("/save", controller.CreateSave)
			router.GET("/save/:lid", controller.ListSavesByLogID)
			router.GET("/saves", controller.ListSaves)
			router.DELETE("/save", controller.DeleteSave)
		}
	}
	// login User Route
	r.POST("/login", controller.Login)

	r.POST("/signup", controller.CreateUser)

	// Run the server go run main.go
	r.Run("localhost: " + PORT)
}
