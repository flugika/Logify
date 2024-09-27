package entity

import (
	"errors"
	"gorm.io/gorm"
)

// Validate checks if the Follower instance is valid
func (f Follower) Validate() error {
	if f.UserID == nil || f.FollowerID == nil {
		return errors.New("UserID and FollowerID cannot be blank")
	}
	if *f.UserID == *f.FollowerID {
		return errors.New("UserID and FollowerID cannot be the same")
	}
	return nil
}

func IsUniqueUser(username, email string, userID uint) (bool, string) {
	var existingUser User // No need for entity. since it's in the same package

	// Check for existing username (excluding the current user)
	if err := DB().Where("username = ? AND id != ?", username, userID).First(&existingUser).Error; err == nil {
		return false, "Username already exists. Please choose another username."
	}

	// Check for existing email (excluding the current user)
	if err := DB().Where("email = ? AND id != ?", email, userID).First(&existingUser).Error; err == nil {
		return false, "Email already exists. Please choose another email."
	}

	return true, ""
}

func IsUniqueMusic(name string, musicID uint) (bool, string) {
	var existingMusic Music // No need for entity. since it's in the same package

	// Check for existing music (excluding the current music)
	if err := DB().Where("name = ? AND id != ?", name, musicID).First(&existingMusic).Error; err == nil {
		return false, "Music already exists. Cannot added!"
	}

	return true, ""
}

// UpdateLikesCount คำนวณจำนวนไลค์ของ Log ที่ระบุและอัพเดต LikesCount
func UpdateLikesCount(db *gorm.DB, logID uint) error {
	var count int64

	// คำนวณจำนวนไลค์
	if err := db.Model(&Like{}).Where("log_id = ?", logID).Count(&count).Error; err != nil {
		return err
	}

	// อัพเดต LikesCount
	return db.Model(&Log{}).Where("id = ?", logID).Update("likes_count", count).Error
}

// UpdateSavesCount คำนวณจำนวนเซฟของ Log ที่ระบุและอัพเดต SavesCount
func UpdateSavesCount(db *gorm.DB, logID uint) error {
	var count int64

	// คำนวณจำนวนเซฟ
	if err := db.Model(&Save{}).Where("log_id = ?", logID).Count(&count).Error; err != nil {
		return err
	}

	// อัพเดต SavesCount
	return db.Model(&Log{}).Where("id = ?", logID).Update("saves_count", count).Error
}

// UpdateFollowerCount อัพเดตจำนวนผู้ติดตาม (follower) ของผู้ใช้ที่ระบุ
func UpdateFollowerCount(db *gorm.DB, userID uint) error {
	var count int64

	// นับจำนวนผู้ติดตาม (follower)
	if err := db.Model(&Follower{}).Where("user_id = ?", userID).Count(&count).Error; err != nil {
		return err
	}

	// อัพเดต FollowerCount
	return db.Model(&User{}).Where("id = ?", userID).Update("follower_count", count).Error
}

// UpdateFollowingCount อัพเดตจำนวนผู้ที่เราติดตาม (following) ของผู้ใช้ที่ระบุ
func UpdateFollowingCount(db *gorm.DB, userID uint) error {
	var count int64

	// นับจำนวนผู้ที่เราติดตาม (following)
	if err := db.Model(&Follower{}).Where("follower_id = ?", userID).Count(&count).Error; err != nil {
		return err
	}

	// อัพเดต FollowingCount
	return db.Model(&User{}).Where("id = ?", userID).Update("following_count", count).Error
}
