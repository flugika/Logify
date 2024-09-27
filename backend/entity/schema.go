package entity

import (
	"regexp"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

func init() {
	govalidator.SetFieldsRequiredByDefault(true)
}

// -------------------------------------------<< User >>------------------------------------

type User struct {
	gorm.Model     `valid:"-"`
	Username       string `gorm:"uniqueIndex" valid:"required~Username cannot be blank,matches(^[a-zA-Z0-9._]+$)~Username can only contain letters dots and underscores"`
	Firstname      string `valid:"required~Firstname cannot be blank"`
	Lastname       string `valid:"required~Lastname cannot be blank"`
	Email          string `gorm:"uniqueIndex" valid:"email~Invalid email format,required~Email cannot be blank"`
	Password       string `valid:"required~Password cannot be blank,minstringlength(8)~Password must be at least 8 characters"`
	Telephone      string `valid:"required~Telephone cannot be blank,minstringlength(9)~Telephone must be at least 9 digits"`
	Gender         string `valid:"required~Please select a gender"`
	Province       string `valid:"required~Please select your province"`
	Role           string `valid:"required~Role cannot be blank"`
	FollowerCount  int    `valid:"-"`
	FollowingCount int    `valid:"-"`

	Log   []Log   `gorm:"foreignKey:UserID" valid:"-"`
	Like  []Like  `gorm:"foreignKey:UserID" valid:"-"`
	Save  []Log   `gorm:"foreignKey:UserID" valid:"-"`
	Music []Music `gorm:"foreignKey:UserID" valid:"-"`

	Followers []Follower `gorm:"foreignKey:UserID" valid:"-"`
	Following []Follower `gorm:"foreignKey:FollowerID" valid:"-"`
}

// -------------------------------------------<< Follower >>------------------------------------

type Follower struct {
	gorm.Model `valid:"-"`
	UserID     *uint `valid:"required~UserID cannot be blank"`
	FollowerID *uint `valid:"required~FollowerID cannot be blank"`
	User       User  `gorm:"foreignKey:UserID" valid:"-"`
	Follower   User  `gorm:"foreignKey:FollowerID" valid:"-"`
}

// -------------------------------------------<< Log >>------------------------------------

type Category struct {
	gorm.Model `valid:"-"`
	Name       string `valid:"required~Category name cannot be blank"`
	Log        []Log  `gorm:"foreignKey:CategoryID" valid:"-"`
}

type Log struct {
	gorm.Model `valid:"-"`
	Title      string `valid:"required~Title cannot be blank"`
	Cover      string `valid:"required~Cover cannot be blank"`
	Article    string `valid:"minstringlength(10)~Article must be at least 10 characters,url~Cannot add url in article,telephone~Cannot add telephone number in article"`
	LikesCount int    `valid:"-"`
	SavesCount int    `valid:"-"`

	UserID *uint `valid:"required~UserID cannot be blank"`
	User   User  `valid:"-"`

	CategoryID *uint    `valid:"required~CategoryID cannot be blank"`
	Category   Category `valid:"-"`

	MusicID *uint `valid:"required~MusicID cannot be blank"`
	Music   Music `valid:"-"`

	MoodID *uint `valid:"required~MoodID cannot be blank"`
	Mood   Mood  `valid:"-"`

	Like []Like `gorm:"foreignKey:LogID" valid:"-"`
	Save []Save `gorm:"foreignKey:LogID" valid:"-"`
}

// -------------------------------------------<< Mood >>------------------------------------

type Mood struct {
	gorm.Model `valid:"-"`
	Name       string `valid:"required~Mood name cannot be blank"`

	Music []Music `gorm:"foreignKey:MoodID" valid:"-"`
	Log   []Log   `gorm:"foreignKey:MoodID" valid:"-"`
}

// -------------------------------------------<< Music >>------------------------------------

type Music struct {
	gorm.Model `valid:"-"`
	Name       string `valid:"required~Music name cannot be blank"`
	Artist     string `valid:"required~Artist name cannot be blank"`
	URL        string `valid:"required~URL cannot be blank,YTurl~Invalid URL format"`
	ChorusTime int    `valid:"required~Chorus time is required"`

	MoodID *uint `valid:"required~MoodID cannot be blank"`
	Mood   Mood  `valid:"-"`

	UserID *uint `valid:"required~UserID cannot be blank"`
	User   User  `valid:"-"`

	Log []Log `gorm:"foreignKey:MusicID" valid:"-"`
}

// -------------------------------------------<< Like >>------------------------------------

type Like struct {
	gorm.Model `valid:"-"`

	LogID *uint `valid:"required~LogID cannot be blank"`
	Log   Log   `valid:"-"`

	UserID *uint `valid:"required~UserID cannot be blank"`
	User   User  `valid:"-"`
}

// -------------------------------------------<< Save >>------------------------------------

type Save struct {
	gorm.Model `valid:"-"`

	LogID *uint `valid:"required~LogID cannot be blank"`
	Log   Log   `valid:"-"`

	UserID *uint `valid:"required~UserID cannot be blank"`
	User   User  `valid:"-"`
}

// -------------------------------------------<< Validator >>------------------------------------

func init() {
	// Custom valid tag สำหรับ URL
	govalidator.TagMap["url"] = govalidator.Validator(func(str string) bool {
		urlRegex := regexp.MustCompile(`^(https?://[^\s]+|www\.[^\s]+)$`)
		return !urlRegex.MatchString(str)
	})

	govalidator.TagMap["YTurl"] = govalidator.Validator(func(str string) bool {
		YTurlRegex := regexp.MustCompile(`^(https?://[^\s]+|www\.[^\s]+)$`)
		return YTurlRegex.MatchString(str)
	})

	// Custom valid tag สำหรับ Telephone
	govalidator.TagMap["telephone"] = govalidator.Validator(func(str string) bool {
		phoneRegex := regexp.MustCompile(`^\d{10}$|^\d{3}-\d{3}-\d{4}$`)
		return !phoneRegex.MatchString(str)
	})
}
