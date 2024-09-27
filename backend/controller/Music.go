package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/flugika/Logify/entity"
	"github.com/gin-gonic/gin"
)

// POST /music
func CreateMusic(c *gin.Context) {
	var music entity.Music
	var user entity.User
	var mood entity.Mood

	if err := c.ShouldBindJSON(&music); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := govalidator.ValidateStruct(music); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", music.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// ค้นหา mood ด้วย id
	if tx := entity.DB().Where("id = ?", music.MoodID).First(&mood); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mood not found"})
		return
	}

	// Check for uniqueness of music
	if unique, errMsg := entity.IsUniqueMusic(music.Name, 0); !unique {
		c.JSON(http.StatusBadRequest, gin.H{"error": errMsg})
		return
	}

	// สร้าง music
	cm := entity.Music{
		Name:       music.Name,
		Artist:     music.Artist,
		URL:        music.URL,
		ChorusTime: music.ChorusTime,
		User:       user,
		Mood:       mood,
	}

	// บันทึก
	if err := entity.DB().Create(&cm).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": cm})
}

// GET /music/:id
func GetMusic(c *gin.Context) {
	var music entity.Music
	id := c.Param("id")

	if tx := entity.DB().Preload("Log").Preload("Mood").Where("id = ?", id).First(&music); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "music not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": music})
}

// GET /musics
// func ListMusics(c *gin.Context) {
// 	var music []entity.Music
// 	if err := entity.DB().Preload("Log").Preload("Mood").Raw("SELECT * FROM musics").Find(&music).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": music})
// }

// GET /musics/:
func ListMusics(c *gin.Context) {
	// Retrieve query parameters
	artist := c.Query("artist")
	name := c.Query("name")
	mood_id := c.Query("mood_id")

	var musics []entity.Music
	query := entity.DB().Preload("Log").Preload("Mood").Preload("User")

	if name != "" {
		query = query.Where("name LIKE ?", "%"+name+"%")
	}

	if artist != "" {
		query = query.Where("artist LIKE ?", "%"+artist+"%")
	}

	if mood_id != "" {
		query = query.Where("mood_id LIKE ?", mood_id)
	}

	// Execute the query
	if tx := query.Find(&musics); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No musics found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": musics})
}

// DELETE /music/:id
func DeleteMusic(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM musics WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "music not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /music
func UpdateMusic(c *gin.Context) {
	var music entity.Music
	var user entity.User
	var mood entity.Mood

	if err := c.ShouldBindJSON(&music); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := govalidator.ValidateStruct(music); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user by id
	if tx := entity.DB().Where("id = ?", music.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// Find mood by id
	if tx := entity.DB().Where("id = ?", music.MoodID).First(&mood); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mood not found"})
		return
	}

	// Update Music
	um := entity.Music{
		Name:       music.Name,
		Artist:     music.Artist,
		URL:        music.URL,
		ChorusTime: music.ChorusTime,
		User:       user,
		Mood:       mood,
	}

	// Save changes
	if err := entity.DB().Model(&entity.Music{}).Where("id = ?", music.ID).Updates(um).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": um})
}
