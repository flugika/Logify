package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/flugika/Logify/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /log
func CreateLog(c *gin.Context) {
	var log entity.Log
	var user entity.User
	var category entity.Category
	var music entity.Music
	var mood entity.Mood

	if err := c.ShouldBindJSON(&log); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate log struct
	isValid, err := govalidator.ValidateStruct(log)
	if !isValid {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", log.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// ค้นหา category ด้วย id
	if tx := entity.DB().Where("id = ?", log.CategoryID).First(&category); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
		return
	}

	// ค้นหา music ด้วย id
	if tx := entity.DB().Where("id = ?", log.MusicID).First(&music); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "music not found"})
		return
	}

	// ค้นหา mood ด้วย id
	if tx := entity.DB().Where("id = ?", log.MoodID).First(&mood); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mood not found"})
		return
	}

	// สร้าง Log
	cl := entity.Log{
		Title:    log.Title,
		Cover:    log.Cover,
		Article:  log.Article,
		User:     user,
		Category: category,
		Music:    music,
		Mood:     mood,
	}

	// บันทึก
	if err := entity.DB().Create(&cl).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต LikesCount
	if err := entity.UpdateLikesCount(entity.DB(), cl.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": cl})
}

// GET /log/:id
func GetLog(c *gin.Context) {
	var log entity.Log
	id := c.Param("id")

	if tx := entity.DB().Preload("User").Preload("Category").Preload("Music").Preload("Mood").Preload("Like").Preload("Save").Where("id = ?", id).Where("logs.deleted_at IS NULL").First(&log); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "log not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": log})
}

// GET /mostLike/:id
func GetMostLikeLog(c *gin.Context) {
	id := c.Param("id")

	var log entity.Log
	if tx := entity.DB().
		Preload("User").
		Preload("Category").
		Preload("Music").
		Preload("Mood").
		Where("user_id = ?", id).
		Where("logs.deleted_at IS NULL").
		Order("likes_count DESC").
		First(&log); tx.Error != nil {
		if tx.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No logs found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": tx.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": log})
}

// GET /mostSave/:id
func GetMostSaveLog(c *gin.Context) {
	id := c.Param("id")

	var log entity.Log
	if tx := entity.DB().
		Preload("User").
		Preload("Category").
		Preload("Music").
		Preload("Mood").
		Where("user_id = ?", id).
		Where("logs.deleted_at IS NULL").
		Order("saves_count DESC").
		First(&log); tx.Error != nil {
		if tx.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No logs found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": tx.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": log})
}

// GET /logs
func ListLogs(c *gin.Context) {
	// Retrieve query parameters
	userID := c.Query("user_id")
	keyword := c.Query("keyword")
	moodID := c.Query("mood_id")
	categoryID := c.Query("category_id")
	liked := c.Query("liked")
	saved := c.Query("saved")

	var logs []entity.Log
	query := entity.DB().Preload("User").Preload("Category").Preload("Music").Preload("Mood").Preload("Like").Preload("Save")

	// Build query based on parameters
	if userID != "" {
		if liked == "true" {
			query = query.Joins("LEFT JOIN likes ON likes.log_id = logs.id").
				Where("likes.user_id = ? AND likes.id IS NOT NULL AND likes.deleted_at IS NULL", userID).
				Where("logs.deleted_at IS NULL")
		} else if saved == "true" {
			query = query.Joins("LEFT JOIN saves ON saves.log_id = logs.id").
				Where("saves.user_id = ? AND saves.id IS NOT NULL AND saves.deleted_at IS NULL", userID).
				Where("logs.deleted_at IS NULL")
		} else {
			query = query.Where("logs.user_id = ?", userID).
				Where("logs.deleted_at IS NULL")
		}
	}

	if keyword != "" {
		query = query.Where("logs.title LIKE ? OR logs.article LIKE ?", "%"+keyword+"%", "%"+keyword+"%").
			Where("logs.deleted_at IS NULL")
	}

	if moodID != "" {
		query = query.Where("logs.mood_id = ?", moodID).
			Where("logs.deleted_at IS NULL")
	}

	if categoryID != "" {
		query = query.Where("logs.category_id = ?", categoryID).
			Where("logs.deleted_at IS NULL")
	}

	// Execute the query
	if tx := query.Find(&logs); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No logs found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": logs})
}

func ListLogsByID(c *gin.Context) {
	id := c.Param("id")

	var logs []entity.Log
	if tx := entity.DB().
		Preload("User").
		Preload("Category").
		Preload("Music").
		Preload("Mood").
		Where("user_id = ?", id).
		Where("logs.deleted_at IS NULL").
		Find(&logs); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No logs found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": logs})
}

// DELETE /log/:id
func DeleteLog(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM logs WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "log not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /log
func UpdateLog(c *gin.Context) {
	var log entity.Log
	var user entity.User
	var category entity.Category
	var music entity.Music
	var mood entity.Mood

	if err := c.ShouldBindJSON(&log); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := govalidator.ValidateStruct(log); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user by id
	if tx := entity.DB().Where("id = ?", log.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// Find category by id
	if tx := entity.DB().Where("id = ?", log.CategoryID).First(&category); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
		return
	}

	// Find music by id
	if tx := entity.DB().Where("id = ?", log.MusicID).First(&music); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "music not found"})
		return
	}

	// Find mood by id
	if tx := entity.DB().Where("id = ?", log.MoodID).First(&mood); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mood not found"})
		return
	}

	// Update Log
	ul := entity.Log{
		Title:    log.Title,
		Cover:    log.Cover,
		Article:  log.Article,
		User:     user,
		Category: category,
		Music:    music,
		Mood:     mood,
	}

	// Save changes
	if err := entity.DB().Model(&entity.Log{}).Where("id = ?", log.ID).Updates(ul).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต LikesCount
	if err := entity.UpdateLikesCount(entity.DB(), log.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ul})
}
