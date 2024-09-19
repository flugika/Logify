package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/flugika/Logify/entity"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// POST /user
func CreateUser(c *gin.Context) {
	var user entity.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := govalidator.ValidateStruct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

	// สร้าง User
	cu := entity.User{
		Username:       user.Username,
		Firstname:      user.Firstname,
		Lastname:       user.Lastname,
		Email:          user.Email,
		Password:       string(password),
		Telephone:      user.Telephone,
		Gender:         user.Gender,
		Province:       user.Province,
		Role:           user.Role,
		FollowerCount:  user.FollowerCount,
		FollowingCount: user.FollowingCount,
	}

	// บันทึก
	if err := entity.DB().Create(&cu).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต FollowerCount
	if err := entity.UpdateFollowerCount(entity.DB(), cu.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต FollowingCount
	if err := entity.UpdateFollowingCount(entity.DB(), cu.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": cu})
}

// GET /user/:id
func GetUser(c *gin.Context) {
	var user entity.User
	id := c.Param("id")

	if tx := entity.DB().Preload("Music").Where("id = ?", id).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// GET /users
func ListUsers(c *gin.Context) {
	var users []entity.User
	if err := entity.DB().Preload("Music").Raw("SELECT * FROM users").Find(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": users})
}

// DELETE /user/:id
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM users WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /user
func UpdateUser(c *gin.Context) {
	var user entity.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := govalidator.ValidateStruct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

	// อัพเดท User
	uu := entity.User{
		Username:       user.Username,
		Firstname:      user.Firstname,
		Lastname:       user.Lastname,
		Email:          user.Email,
		Password:       string(password),
		Telephone:      user.Telephone,
		Gender:         user.Gender,
		Province:       user.Province,
		Role:           user.Role,
		FollowerCount:  user.FollowerCount,
		FollowingCount: user.FollowingCount,
	}

	// บันทึก
	if err := entity.DB().Where("id = ?", user.ID).Updates(&uu).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต FollowerCount
	if err := entity.UpdateFollowerCount(entity.DB(), uu.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต FollowingCount
	if err := entity.UpdateFollowingCount(entity.DB(), uu.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": uu})

}
