package controller

import (
	"net/http"

	"github.com/flugika/Logify/entity"
	"github.com/gin-gonic/gin"
)

// POST /follow
func FollowUser(c *gin.Context) {
	var follower entity.Follower

	if err := c.ShouldBindJSON(&follower); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// เพิ่มการติดตาม
	if err := entity.DB().Create(&follower).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดตจำนวน follower และ following
	if err := entity.UpdateFollowerCount(entity.DB(), *follower.UserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := entity.UpdateFollowingCount(entity.DB(), *follower.FollowerID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": follower})
}

// GET /followers
func ListFollowerByUID(c *gin.Context) {
	userID := c.Query("user_id")
	followerID := c.Query("follower_id")

	var followers []entity.Follower
	query := entity.DB().Preload("User").Preload("Follower")

	// Build query based on parameters
	if userID != "" {
		query.Where("user_id = ?", userID)
	}

	if followerID != "" {
		query.Where("follower_id = ?", followerID)
	}

	query.Where("deleted_at IS NULL")

	// Execute the query
	if tx := query.Find(&followers); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No followers found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": followers})
}

// DELETE /unfollow
func UnfollowUser(c *gin.Context) {
	var follower entity.Follower
	if err := c.ShouldBindJSON(&follower); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ลบการติดตาม
	if err := entity.DB().Where("user_id = ? AND follower_id = ?", follower.UserID, follower.FollowerID).Delete(&entity.Follower{}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดตจำนวน follower และ following
	if err := entity.UpdateFollowerCount(entity.DB(), *follower.UserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := entity.UpdateFollowingCount(entity.DB(), *follower.FollowerID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "unfollowed"})
}
