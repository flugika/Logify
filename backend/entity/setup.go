package entity

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	// PostgreSQL driver
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

// Function to create a user in the database
func createUser(db *gorm.DB, username string, firstname string, lastname string, email string, password string, telephone string, gender string, province string, role string, followerCount int, followingCount int) {
	user := User{
		Username:       username,
		Firstname:      firstname,
		Lastname:       lastname,
		Email:          email,
		Password:       password,
		Telephone:      telephone,
		Gender:         gender,
		Province:       province,
		Role:           role,
		FollowerCount:  followerCount,
		FollowingCount: followingCount,
	}
	db.Model(&User{}).Create(&user)
}

// Function to create mock follower data in the database
func createFollower(db *gorm.DB, userID, followerID uint) {
	// Create a new Follower record
	follower := Follower{
		UserID:     &userID,
		FollowerID: &followerID,
	}

	// Insert the new Follower record into the database
	db.Model(&Follower{}).Create(&follower)
}

// Function to create an category in the database
func createCategory(db *gorm.DB, name string) {
	category := Category{
		Name: name,
	}
	db.Model(&Category{}).Create(&category)
}

// Function to create an log in the database
func createLog(db *gorm.DB, title string, cover string, article string, likesCount int, savesCount int, userID uint, category uint, musicID uint, moodID uint) {
	log := Log{
		Title:      title,
		Cover:      cover,
		Article:    article,
		LikesCount: likesCount,
		SavesCount: savesCount,
		UserID:     &userID,
		CategoryID: &category,
		MusicID:    &musicID,
		MoodID:     &moodID,
	}
	db.Model(&Log{}).Create(&log)
}

// Function to create an mood in the database
func createMood(db *gorm.DB, name string) {
	mood := Mood{
		Name: name,
	}
	db.Model(&Mood{}).Create(&mood)
}

// Function to create an music in the database
func createMusic(db *gorm.DB, name string, artist string, url string, chorusTime int, moodID uint, userID uint) {
	music := Music{
		Name:       name,
		Artist:     artist,
		URL:        url,
		ChorusTime: chorusTime,
		MoodID:     &moodID,
		UserID:     &userID,
	}
	db.Model(&Music{}).Create(&music)
}

// Function to create an like in the database
func createLike(db *gorm.DB, logID uint, userID uint) {
	like := Like{
		LogID:  &logID,
		UserID: &userID,
	}
	db.Model(&Like{}).Create(&like)
}

// Function to create an save in the database
func createSave(db *gorm.DB, logID uint, userID uint) {
	save := Save{
		LogID:  &logID,
		UserID: &userID,
	}
	db.Model(&Save{}).Create(&save)
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("Logify.db"), &gorm.Config{})

	if err != nil {
		panic("Failed to connect database!")
	}

	// Migrate the schema

	database.AutoMigrate(
		&Category{},
		&Mood{},
		&Log{},
		&User{},
		&Music{},
		&Like{},
		&Save{},
		&Follower{},
	)

	db = database

	ID1 := uint(1)
	IDPtr1 := &ID1
	ID2 := uint(2)
	IDPtr2 := &ID2
	ID3 := uint(3)
	IDPtr3 := &ID3
	ID4 := uint(4)
	IDPtr4 := &ID4
	ID6 := uint(6)
	IDPtr6 := &ID6

	// Create Categories
	categories := []string{
		"บทความสั้น", "ระบาย", "เรื่องย่อ", "แรงบันดาลใจ", "ความรู้",
	}

	for _, category := range categories {
		createCategory(db, category)
	}

	// Create Moods
	moods := []string{
		"อกหัก", "หมดไฟ", "เสียใจ", "สับสน", "กังวล",
		"คลั่งรัก", "ใฝ่รู้", "มีความสุข", "ตื่นเต้น", "ภูมิใจ",
		"สงบ", "ไม่รู้สึก",
	}

	for _, mood := range moods {
		createMood(db, mood)
	}

	// Create Musics
	music1 := Music{
		Name:       "I Love You So",
		Artist:     "The Walters",
		URL:        "https://youtu.be/NwFVSclD_uc",
		ChorusTime: 51,
		MoodID:     IDPtr1,
		UserID:     IDPtr1,
	}
	db.Model(&Music{}).Create(&music1)

	music2 := Music{
		Name:       "เเด่เธอเเม่เนื้อหอมผู้ครอบครองโลกทั้งใบเเละใจของผม",
		Artist:     "ชีวรินท์ feat. ห้องคุณตา",
		ChorusTime: 74,
		URL:        "https://youtu.be/YWgIw7nSv5g",
		MoodID:     IDPtr6,
		UserID:     IDPtr2,
	}
	db.Model(&Music{}).Create(&music2)

	password1, _ := bcrypt.GenerateFromPassword([]byte("111"), 14)
	user1 := User{
		Username:       "fukusan",
		Firstname:      "ชูเกียรติ",
		Lastname:       "ก๋าอินตา",
		Email:          "ppoqqgu00@gmail.com",
		Password:       string(password1),
		Telephone:      "0918214855",
		Role:           "User",
		Gender:         "Male",
		Province:       "พะเยา",
		FollowerCount:  2,
		FollowingCount: 2,
	}
	db.Model(&User{}).Create(&user1)

	user2 := User{
		Username:       "chukitanaqovxoja",
		Firstname:      "ชูเกียรติ",
		Lastname:       "ก๋าอินตา",
		Email:          "kaintachookiat@gmail.com",
		Password:       string(password1),
		Telephone:      "0123456789",
		Role:           "User",
		Gender:         "Male",
		Province:       "กรุงเทพมหานคร",
		FollowerCount:  1,
		FollowingCount: 1,
	}
	db.Model(&User{}).Create(&user2)

	user3 := User{
		Username:       "takumi",
		Firstname:      "ทาคูมิ",
		Lastname:       "ซากุรา",
		Email:          "takumi@example.com",
		Password:       string(password1),
		Telephone:      "0945678901",
		Role:           "User",
		Gender:         "Female",
		Province:       "นครราชสีมา",
		FollowerCount:  1,
		FollowingCount: 0,
	}
	db.Model(&User{}).Create(&user3)

	admin1 := User{
		Username:       "yoshida",
		Firstname:      "ทาคาชิ",
		Lastname:       "โยชิดะ",
		Email:          "yoshida@example.com",
		Password:       string(password1),
		Telephone:      "0123456789",
		Role:           "Admin",
		Gender:         "Male",
		Province:       "น่าน",
		FollowerCount:  0,
		FollowingCount: 1,
	}
	db.Model(&User{}).Create(&admin1)

	admin2 := User{
		Username:       "sakura",
		Firstname:      "ซากุระ",
		Lastname:       "ฮานาเบะ",
		Email:          "sakura@example.com",
		Password:       string(password1),
		Telephone:      "0123456789",
		Role:           "Admin",
		Gender:         "Female",
		Province:       "เชียงราย",
		FollowerCount:  0,
		FollowingCount: 0,
	}
	db.Model(&User{}).Create(&admin2)

	// Create followers relationships
	followers := []Follower{
		{UserID: &user2.ID, FollowerID: &user1.ID},  // user1 follows user2
		{UserID: &user3.ID, FollowerID: &user1.ID},  // user1 follows user3
		{UserID: &user1.ID, FollowerID: &user2.ID},  // user2 follows user1
		{UserID: &user1.ID, FollowerID: &admin1.ID}, // user4 follows user1
	}

	for _, follower := range followers {
		db.Model(&Follower{}).Create(&follower)
	}

	// Create Logs
	log1 := Log{
		Title:      "แด่เธอแม่เนื้อหอมผู้ครอบครองโลกทั้งใบและใจของผม",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "โอ้เจ้าดวงความรักแสนงามความฤทัยโอ้เจ้ายอดดวงใจพี่ตามจะใฝ่ฝัน\nมีเจ้าความรักนี้งดงามดั่งแสงตะวัน\nความงดงามวันนั้นผลัดงามดังสายธารา\n\nโอ้เจ้ายอดดวงใจ แม้โดนใครทำร้ายมา\nโอ้แม่แก้วดวงตาโชคชะตาได้ชี้นำ\nมาได้พบยอดชาย ใจละลายที่เธอทำ\nมีหญิงงามคนนั้น คนเดียว คนเดิมในดวงใจ\nวอนสายธารากว้างใหญ่..\n\nพัดดวงฤทัยของเธอมาให้ฉัน\nจะรักเธอ..ทั้งคืนวัน\nแม้ตัวฉันต้องจากไป\n\nใบหน้าช่างดูอ่อนหวาน\nยิ้มเธอช่างดูสดใส\nเห็นทีอยากจะจากโลกไป\nเพราะใจฉัน..มันละลาย\n\nโอ้แม่ยอดกานดา มีแววตาช่างสดใส\nอยากจะฝากดวงใจ..ดวงนี้ให้กับจันทร์\nโอ้แม่ยอดเนื้อหอมโปรดวิงวอนให้มองจันทร์\nมอบดวงใจของฉัน ให้แม่ยอดกานดา\n\nโอ้เจ้ายอดดวงใจ แม้โดนใครทำร้ายมา\nโอ้แม่แก้วดวงตาโชคชะตาได้ชี้นำ\nมาได้พบยอดชาย ใจละลายที่เธอทำ\nมีหญิงงามคนนั้น คนเดียว คนเดิมในดวงใจ\n\nวอนสายธารากว้างใหญ่..\nพัดดวงฤทัยของเธอมาให้ฉัน\nจะรักเธอ..ทั้งคืนวัน\nแม้ตัวฉันต้องจากไป\nใบหน้าช่างดูอ่อนหวาน\nยิ้มเธอช่างดูสดใส\nเห็นทีอยากจะจากโลกไป\nเพราะใจฉัน..มันละลาย\n\nวอนสายธารากว้างใหญ่..\nพัดดวงฤทัยของเธอมาให้ฉัน\nจะรักเธอ..ทั้งคืนวัน\nแม้ตัวฉันต้องจากไป\n\nใบหน้าช่างดูอ่อนหวาน\nยิ้มเธอช่างดูสดใส\nเห็นทีอยากจะจากโลกไป\nเพราะใจฉัน..มันละลาย",
		LikesCount: 2,
		SavesCount: 2,
		UserID:     IDPtr1,
		CategoryID: IDPtr1,
		MusicID:    IDPtr2,
		MoodID:     IDPtr6,
	}
	db.Model(&Log{}).Create(&log1)

	log2 := Log{
		Title:      "หมอกเทา2",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 1,
		SavesCount: 1,
		UserID:     IDPtr2,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log2)

	log3 := Log{
		Title:      "หมอกเทา3",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr2,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log3)

	log4 := Log{
		Title:      "หมอกเทา4",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr3,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log4)

	log5 := Log{
		Title:      "หมอกเทา5",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr3,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log5)

	log6 := Log{
		Title:      "หมอกเทา6",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr4,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log6)

	log7 := Log{
		Title:      "หมอกเทา7",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr4,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log7)

	log8 := Log{
		Title:      "หมอกเทา8",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr4,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log8)

	log9 := Log{
		Title:      "หมอกเทา9",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr4,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log9)

	log10 := Log{
		Title:      "หมอกเทา10",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr4,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log10)

	log11 := Log{
		Title:      "หมอกเทา11",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr4,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log11)

	log12 := Log{
		Title:      "หมอกเทา12",
		Cover:      "https://img.pikbest.com/ai/illus_our/20230426/837299dbdc8aca46cd756e29fc9d859f.jpg!w700wp",
		Article:    "test test test",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr4,
		CategoryID: IDPtr2,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log12)

	// Create Likes
	like1 := Like{
		LogID:  IDPtr1,
		UserID: IDPtr1,
	}
	db.Model(&Like{}).Create(&like1)

	like2 := Like{
		LogID:  IDPtr1,
		UserID: IDPtr2,
	}
	db.Model(&Like{}).Create(&like2)

	like3 := Like{
		LogID:  IDPtr2,
		UserID: IDPtr2,
	}
	db.Model(&Like{}).Create(&like3)

	// Create Saves
	save1 := Save{
		LogID:  IDPtr1,
		UserID: IDPtr1,
	}
	db.Model(&Save{}).Create(&save1)

	save2 := Save{
		LogID:  IDPtr1,
		UserID: IDPtr2,
	}
	db.Model(&Save{}).Create(&save2)

	save3 := Save{
		LogID:  IDPtr2,
		UserID: IDPtr2,
	}
	db.Model(&Save{}).Create(&save3)
}
