package entity

import (
	"gorm.io/gorm"
)

// -------------------------------------------<< User >>------------------------------------

type User struct {
	gorm.Model
	Username       string
	Firstname      string
	Lastname       string
	Email          string
	Password       string
	Telephone      string
	Gender         string
	Province       string
	Role           string
	FollowerCount  int
	FollowingCount int

	Log   []Log   `gorm:"foreignKey:UserID"`
	Like  []Like  `gorm:"foreignKey:UserID"`
	Save  []Log   `gorm:"foreignKey:UserID"`
	Music []Music `gorm:"foreignKey:UserID"`

	Followers []Follower `gorm:"foreignKey:UserID"`
	Following []Follower `gorm:"foreignKey:FollowerID"`
}

type Follower struct {
	gorm.Model
	UserID     *uint
	FollowerID *uint
	User       User `gorm:"foreignKey:UserID"`
	Follower   User `gorm:"foreignKey:FollowerID"`
}

// -------------------------------------------<< Log >>------------------------------------

type Category struct {
	gorm.Model
	Name string
	Log  []Log `gorm:"foreignKey:CategoryID"`
}

type Log struct {
	gorm.Model
	Title      string
	Cover      string
	Article    string
	LikesCount int
	SavesCount int

	UserID *uint
	User   User

	CategoryID *uint
	Category   Category

	MusicID *uint
	Music   Music

	MoodID *uint
	Mood   Mood

	Like []Like `gorm:"foreignKey:LogID"`
	Save []Save `gorm:"foreignKey:LogID"`
}

// -------------------------------------------<< Other >>------------------------------------

type Mood struct {
	gorm.Model
	Name string

	Music []Music `gorm:"foreignKey:MoodID"`
	Log   []Log   `gorm:"foreignKey:MoodID"`
}

type Music struct {
	gorm.Model
	Name       string
	Artist     string
	URL        string
	ChorusTime int // second

	MoodID *uint
	Mood   Mood

	UserID *uint
	User   User

	Log []Log `gorm:"foreignKey:MusicID"`
}

type Like struct {
	gorm.Model

	LogID *uint
	Log   Log

	UserID *uint
	User   User
}

type Save struct {
	gorm.Model

	LogID *uint
	Log   Log

	UserID *uint
	User   User
}
