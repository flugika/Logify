package controller

import (
	"net/http"

	"github.com/flugika/Logify/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /save
func CreateSave(c *gin.Context) {
	var save entity.Save

	if err := c.ShouldBindJSON(&save); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&save).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต SavesCount ของ Log ที่เกี่ยวข้อง
	if err := entity.UpdateSavesCount(entity.DB(), *save.LogID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": save})
}

// GET /save/:lid
func ListSavesByLogID(c *gin.Context) {
	var saves []entity.Save
	lid := c.Param("lid")

	if tx := entity.DB().Preload("Log").Preload("User").Where("log_id = ?", lid).Find(&saves).Where("saves.deleted_at IS NULL"); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "saves not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": saves})
}

// GET /saves
func ListSaves(c *gin.Context) {
	var saves []entity.Save
	if err := entity.DB().Preload("Log").Preload("User").Raw("SELECT * FROM saves").Find(&saves).Where("saves.deleted_at IS NULL").Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": saves})
}

// DELETE /save
func DeleteSave(c *gin.Context) {
	logID := c.Query("log_id")
	userID := c.Query("user_id")

	if userID == "" || logID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing user_id or log_id"})
		return
	}

	var save entity.Save
	query := entity.DB().Preload("Log").Preload("User")

	// Find the save to delete
	query = query.Where("user_id = ? AND log_id = ?", userID, logID)
	tx := query.First(&save) // Use `First` to ensure `save` is populated

	if tx.Error != nil {
		if tx.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No save found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": tx.Error.Error()})
		}
		return
	}

	// Delete the save
	if tx = query.Delete(&save); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No save found"})
		return
	}

	// Ensure `save.LogID` is not nil before updating saves count
	if save.LogID == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid log ID"})
		return
	}

	// Update SavesCount of the related log
	if err := entity.UpdateSavesCount(entity.DB(), *save.LogID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "save removed successfully"})
}
