package controller

import (
	"net/http"

	"github.com/flugika/Logify/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /like
func CreateLike(c *gin.Context) {
	var like entity.Like

	if err := c.ShouldBindJSON(&like); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&like).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต LikesCount ของ Log ที่เกี่ยวข้อง
	if err := entity.UpdateLikesCount(entity.DB(), *like.LogID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": like})
}

// GET /like/:lid
func ListLikesByLogID(c *gin.Context) {
	var likes []entity.Like
	lid := c.Param("lid")

	if tx := entity.DB().Preload("Log").Preload("User").Where("log_id = ?", lid).Where("likes.deleted_at IS NULL").Find(&likes); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "likes not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": likes})
}

// GET /likes
func ListLikes(c *gin.Context) {
	var likes []entity.Like
	if err := entity.DB().Preload("Log").Preload("User").Raw("SELECT * FROM likes").Find(&likes).Where("likes.deleted_at IS NULL").Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": likes})
}

// DELETE /like
func DeleteLike(c *gin.Context) {
	logID := c.Query("log_id")
	userID := c.Query("user_id")

	if userID == "" || logID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing user_id or log_id"})
		return
	}

	var like entity.Like
	query := entity.DB().Preload("Log").Preload("User")

	// Find the like to delete
	query = query.Where("user_id = ? AND log_id = ?", userID, logID)
	tx := query.First(&like) // Use `First` to ensure `like` is populated

	if tx.Error != nil {
		if tx.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No like found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": tx.Error.Error()})
		}
		return
	}

	// Delete the like
	if tx = query.Delete(&like); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No like found"})
		return
	}

	// Ensure `like.LogID` is not nil before updating likes count
	if like.LogID == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid log ID"})
		return
	}

	// Update LikesCount of the related log
	if err := entity.UpdateLikesCount(entity.DB(), *like.LogID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Like removed successfully"})
}
