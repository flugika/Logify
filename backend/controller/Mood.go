package controller

import (
	"net/http"

	"github.com/flugika/Logify/entity"
	"github.com/gin-gonic/gin"
)

// GET /mood/:id
func GetMood(c *gin.Context) {
	var mood entity.Mood
	id := c.Param("id")

	if tx := entity.DB().Preload("Log").Preload("Music").Where("id = ?", id).First(&mood); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mood not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": mood})
}

// GET /moods
func ListMoods(c *gin.Context) {
	var moods []entity.Mood
	if err := entity.DB().Preload("Log").Preload("Music").Raw("SELECT * FROM moods").Find(&moods).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": moods})
}
