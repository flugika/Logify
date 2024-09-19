package controller

import (
	"net/http"

	"github.com/flugika/Logify/entity"
	"github.com/gin-gonic/gin"
)

// GET /category/:id
func GetCategory(c *gin.Context) {
	var category entity.Category
	id := c.Param("id")

	if tx := entity.DB().Preload("Log").Where("id = ?", id).First(&category); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": category})
}

// GET /categories
func ListCategories(c *gin.Context) {
	var categories []entity.Category
	if err := entity.DB().Preload("Log").Raw("SELECT * FROM categories").Find(&categories).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": categories})
}
