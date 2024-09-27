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
	ID5 := uint(5)
	IDPtr5 := &ID5
	ID6 := uint(6)
	IDPtr6 := &ID6
	ID7 := uint(7)
	IDPtr7 := &ID7
	ID8 := uint(8)
	IDPtr8 := &ID8
	ID11 := uint(11)
	IDPtr11 := &ID11

	// Create Categories
	categories := []string{
		"บทความสั้น", "ระบาย", "เรื่องย่อ", "แรงบันดาลใจ", "ความรู้", "นิยาย",
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
		Name:       "แด่เธอแม่เนื้อหอมผู้ครอบครองโลกทั้งใบและใจของผม",
		Artist:     "ชีวรินท์ feat. ห้องคุณตา",
		ChorusTime: 74,
		URL:        "https://youtu.be/YWgIw7nSv5g",
		MoodID:     IDPtr6,
		UserID:     IDPtr2,
	}
	db.Model(&Music{}).Create(&music2)

	music3 := Music{
		Name:       "Love Me Like That",
		Artist:     "Sam Kim",
		ChorusTime: 47,
		URL:        "https://youtu.be/nqDgqusxs3Y",
		MoodID:     IDPtr8,
		UserID:     IDPtr1,
	}
	db.Model(&Music{}).Create(&music3)

	music4 := Music{
		Name:       "ใครงามเลิศในปฐพี",
		Artist:     "Phumin feat. Warin",
		ChorusTime: 93,
		URL:        "https://youtu.be/8XP1jFumJSQ",
		MoodID:     IDPtr11,
		UserID:     IDPtr1,
	}
	db.Model(&Music{}).Create(&music4)

	music5 := Music{
		Name:       "ฝนตกไหม",
		Artist:     "Three Man Down",
		ChorusTime: 56,
		URL:        "https://youtu.be/m9h12tuUqGo",
		MoodID:     IDPtr5,
		UserID:     IDPtr1,
	}
	db.Model(&Music{}).Create(&music5)

	music6 := Music{
		Name:       "กาลครั้งหนึ่ง",
		Artist:     "STAMP Ft. Palmy อีฟ ปานเจริญ",
		ChorusTime: 82,
		URL:        "https://youtu.be/xbZyjScHnAw",
		MoodID:     IDPtr11,
		UserID:     IDPtr1,
	}
	db.Model(&Music{}).Create(&music6)

	music7 := Music{
		Name:       "Chocolate",
		Artist:     "PLASUI PLASUI",
		ChorusTime: 38,
		URL:        "https://youtu.be/EeH5EewCF8A",
		MoodID:     IDPtr4,
		UserID:     IDPtr1,
	}
	db.Model(&Music{}).Create(&music7)

	music8 := Music{
		Name:       "หล่นหายระหว่างทาง",
		Artist:     "Phumin",
		ChorusTime: 62,
		URL:        "https://youtu.be/LvrM4EmXVVU",
		MoodID:     IDPtr2,
		UserID:     IDPtr1,
	}
	db.Model(&Music{}).Create(&music8)

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
		Title:      "เพลิงนภา",
		Cover:      "https://t3.ftcdn.net/jpg/04/50/47/14/360_F_450471489_Yxrl3LliD2CzMtNDFvMPTvnxrSXZ08Qh.jpg",
		Article:    "@หยดน้ำฝนที่ตกลงมาอย่างไม่ขาดสาย ,@\n@เมฆครึ้มก้อนใหญ่ที่เริ่มตั้งเค้ามาแต่ไกล@\n```ผู้คนมากมายต่างวิ่งกรูกันเข้าร่ม สภาพแออัดจน$หดหู่ใจ$```\n\nแต่น่าแปลกที่ฉันกลับชอบท้องฟ้าสีหม่นกับเมฆเทาเข้มเหล่านี้มากกว่าฟ้าใสสีน้ำทะเลในยามฤดูร้อนซะอีก,\nฉันยังคงเดินเล่นเป็นเพื่อนหมู่เมฆที่กำลังก่อตัวขึ้นมาใหม่เรื่อยๆ\n\tฟังเสียงสายฝนตกกระทบลงสู่พื้น\nกลบเสียงวุ่นวายของผู้คนได้หมดสิ้น ,\nบรรยากาศพาให้หวนนึกถึงวันวาน\nไม่เป็นไรหรอก ถึงจะเจ็บปวดแต่ก็ยังคงสวยงาม\nฉันภาวนาขอพรจากสายฝน ดวงจันทร์ ลมเย็นที่พัดผ่าน ก้อนเมฆและดาว\nรวมไปถึงดวงอาทิตย์ด้วย วอนขอให้คุ้มครองเธอ อย่าให้เธอต้องเจ็บปวด\nให้เธอไปมีความสุขกับท้องฟ้าในแบบที่เธอชอบเถอะนะ\n\"\"`ทุกครั้งเมื่อสายฝนได้ไหลริน\\nเมื่อใดที่ก้อนเมฆสะอื้นร้องไห้ ,\\nฉันจะยังคิดถึงเธอเสมอ ฉันให้สัญญา`\"\"\n\n|\n**`สุดท้ายก็ขอให้ฝน ,`**\n~``โอบกอดเธอไว้ด้วยความอบอุ่นทั้งหมดที่มี :-)``~",
		LikesCount: 1,
		SavesCount: 1,
		UserID:     IDPtr1,
		CategoryID: IDPtr3,
		MusicID:    IDPtr5,
		MoodID:     IDPtr5,
	}
	db.Model(&Log{}).Create(&log1)

	log2 := Log{
		Title:      "ความสงบภายใน",
		Cover:      "https://lofficielthailand.com/wp-content/uploads/2022/02/Nevertheless.jpg",
		Article:    "ผมชอบอารมณ์เย็นชาของตัวเองหลังจากที่ดูหนังจบที่สุด\nมันทำให้ผมใจเย็นและเปิดกว้างกับโลกใบนี้มากขึ้น\nใจของมสงบและนิ่งมาก ทุกสิ่งที่อยู่รอบข้างดูน่าสนใจไปหมด\n\n**@`ผมได้ยินเสียงลมหายใจของตัวเอง`@**\n**@`นั่นทำให้ผมรู้ตัวว่า ผมยังมีชีวิตอยู่`@**",
		LikesCount: 1,
		SavesCount: 1,
		UserID:     IDPtr1,
		CategoryID: IDPtr3,
		MusicID:    IDPtr3,
		MoodID:     IDPtr2,
	}
	db.Model(&Log{}).Create(&log2)

	log3 := Log{
		Title:      "วงกลมที่บิดเบี้ยว",
		Cover:      "https://cdn.stocksnap.io/img-thumbs/960w/people-man_1ONQF7QZ34.jpg",
		Article:    "ไม่มีใครสมบูรณ์แบบทุกอย่างอยู่แล้ว\nเราทุกคนล้วนมีความพิเศษในตัวเอง\nขอเธอจงอย่าเปรียบเทียบตัวเธอเองกับคนอื่นเลย\nมันคงเหมือนกับการวาดภาพวงกลมเธออาจจะวาดวงกลมไม่กลมอาจจะบิดเบี้ยวไม่สมบูรณ์\n\"\"แต่นั่นก็เป็นตัวตนของเธอ\"\"\n`และมันก็สวยในแบบของเธอ`\nขอเธอโปรดจงอย่ามองข้ามความงดงามของตัวเองเพราะเธอเป็นเธอน่ะมันดีที่สุดแล้วเธอไม่จำเป็นต้องสวยแบบสมบูรณ์แบบแต่จงสวยในแบบที่เธอเป็นเธอนะ\nวันนี้ฉันบอกกับตัวเองหน้ากระจกยิ้มและกอดตัวเองแน่นๆหนึ่งที.... :).",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr2,
		CategoryID: IDPtr2,
		MusicID:    IDPtr4,
		MoodID:     IDPtr11,
	}
	db.Model(&Log{}).Create(&log3)

	log4 := Log{
		Title:      "แด่เธอแม่เนื้อหอมผู้เป็นโลกทั้งใบและใจของผม",
		Cover:      "https://preview.redd.it/o96asqovzgi51.jpg?width=1080&crop=smart&auto=webp&s=949997dd7022512dce7dbb1ed60d02a4032898ae",
		Article:    "@ต้องรักแค่ไหนถึงอ่อนโยนได้ขนาดนี้@@ต้องสวยแค่ไหนถึงจะโดนจีบด้วยเพลงนี้@`\"\"โอ้เจ้าดวงความรักแสนงามความฤทัย\\nโอ้เจ้ายอดดวงใจที่ตามจากใฝ่ฝัน\\nมีเจ้าความรักนี้งดงามดั่งแสงตะวัน\\nความงดงามวันนั้นผลัดงามดังสายธารา\\n\\nโอ้เจ้ายอดดวงใจแม้โดนใครทำร้ายมา\\nโอ้แม่แก้วดวงตาโชคชะตาได้ชี้นำ\\nมาได้พบยอดชายใจละลายที่เธอทำ\\nมีหญิงงามคนนั้นคนเดียวคนเดิมในดวงใจ\"\"`ผู้เป็นดังดวงดาวในห้วงจักรวาล เธอไม่ใช่เพียงแค่ใครสักคนในโลกนี้\nแต่เป็นประกายแห่งชีวิตที่ทำให้ทุกสิ่งสวยงาม\nราวกับสรรค์สร้างจากฝีมือของเหล่าทวยเทพ\nความงามของเธอไม่ใช่แค่สิ่งที่ปรากฏต่อสายตา\nแต่เป็นพลังที่หลอมรวมเข้าไปในจิตใจผม\n\nโลกทั้งใบดูเต็มไปด้วยความหมาย\nเธอคือแสงแรกของวันใหม่ที่สาดส่องผ่านท้องฟ้าสีคราม\nความร้อนแรงแห่งแสงอาทิตย์ที่แผ่ซ่านไม่เคยทำร้าย\nแต่กลับปลอบประโลมราวกับเธอสามารถควบคุมทุกอณูของเวลา\nเฝ้ามองเธออย่างไม่รู้เบื่อ แม้เวลาจะล่วงเลย\nเธอก็ยังคงงดงามในดวงตาของผมเสมอแม้เธอจะเคยผ่านเรื่องราวที่แหลกสลาย\nหรือบาดแผลที่ฝังลึกแต่เธอกลับยิ่งสง่างามขึ้น\nดั่งเพชรที่ผ่านการเจียระไนด้วยแรงกดดันจนเป็นสิ่งล้ำค่าที่ข้าไม่อาจละสายตาได้\nชะตากรรมนำพาให้เรามาพบกันสายน้ำของกาลเวลาพัดพาเรามาเจอกัน\nความเย้ายวนในแววตาของเธอสะท้อนแสงสว่างที่หลอมละลายหัวใจ\nรอยยิ้มของเธอคล้ายแสงจันทร์ในค่ำคืนที่สงบงาม\nความละมุนในแววตาและท่วงท่าของเธอทำให้รู้สึกเหมือนต้องมนตร์\nราวกับอยู่ในโลกที่มีเพียงเราสอง\nแม้ว่าโลกภายนอกจะวุ่นวายเพียงใดกลับพบความสงบได้เพียงแค่เฝ้ามองเธอ\n\n**`@แม่เนื้อหอม@`****`@ผู้ที่ไม่เพียงแค่ครอบครองโลกนี้ แต่ยังครองใจผมอย่างสมบูรณ์ไม่มีที่สิ้นสุด.@`**",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr2,
		CategoryID: IDPtr1,
		MusicID:    IDPtr2,
		MoodID:     IDPtr6,
	}
	db.Model(&Log{}).Create(&log4)

	log5 := Log{
		Title:      "หากชีวิตนี้เร็วดั่งความฝัน..",
		Cover:      "https://ata-realestate.com/wp-content/uploads/2023/07/wallpaperflare.com_wallpaper.jpg",
		Article:    "`**\"คุณเคยรอคอยอะไรสักอย่างไหม\"**`\n\nรอคอยเวลาที่จะได้ทำอะไรสักอย่าง\nรอคอยเวลาที่จะได้เดินทางไปที่ไหนสักแห่ง\nรอคอยเวลาที่จะได้พบเจอใครสักหลายๆคน\n\nในช่วงชีวิตหนึ่งของคนเรานั่นเรียกได้ว่าทั้งยาวนานและแสนสั้น\nวันคืนที่มีความสุขนั้นดำเนินไปอย่างรวดเร็วเสมอ\nเผลอแค่พริบตาเดียว วันคืนแสนสุขนั้นก็เหลือเพียงแค่ในความทรงจำ\nและทิ้งไว้้เพียงแค่วันเวลาที่แสนยาวนานสำหรับการรอคอย\nเพื่อให้ถึงวันคืนที่จะได้พบกับความสุขนั้นอีกครั้ง\n\nสำหรับทุกๆคน คงมีอาหารสักจาน ขนมสักชิ้น สิ่งของอะไรสักอย่าง\nหรือสถานที่ที่ไหนสักแห่ง\nที่เมื่อไหร่ที่ได้กิน ได้สัมผัส\nหรือได้ไปยืนนิ่งๆอยู่ตรงจุดนั้นแล้วหลับตา\nชีวิตก็จะเหมือนได้ย้อนกลับไป ณ วันที่ความทรงจำนั้นได้เกิดขึ้นและบันทึกไว้\n\n**`\"เคยไหมที่คุณไปนั่งถอนหายใจอยู่คนเดียวที่หน้าหม้อสุกี้และจานเป็ดย่าง Mk\"`**\n\nมีสักกี่ครั้งที่คุณเห็นรายชื่อบานาน่าสปริทในเล่มเมนูของไอติมสเว่นเซ่น\nแล้วคุณจะหวนคิดถึงใครสักคนที่ไม่เคยสั่งเมนูอื่นเลยนอกจากเมนูนี้\nวันคืนที่แสนลำบาก\nวันคืนที่ต้องดิ้นรน\nวันคืนที่ต้องพยายาม\nวันคืนที่ต้องร้องไห้\nวันคืนที่ล่วงผ่านไปแล้วพร้อมกับคนหลายคนในความทรงจำ\nเหลือแค่วันคืนที่ยังคงลำบาก ยังคงต้องดิ้นรน ยังคงต้องพยายามอยู่เหมือนเคย\nพร้อมกับความโดดเดี่ยวกับระยะทางที่แสนยาวไกล\nและระยะเวลาอีกยาวนานที่ยังต้องก้าวเดินและรอคอยต่อไป\n\nกลางฤดูกาลที่แสนร้อนอบอ้าวและท่ามกลางโรคระบาดที่น่าหวาดหวั่น\nคิดถึงเหลือเกินครอบครัวที่รักของฉัน ยังรอคอยอยู่ทุกลมหายใจ\nว่าเมื่อไหร่จะถึงกาลแตกดับและได้พบเจอหลายคนที่รัก\nที่ได้ล่วงหน้าจากไปก่อนเสียที\n\"\"`เธออยู่ตรงนั้นสบายดีไหม..\\nฉันอยู่ตรงนี้เป็นเหมือนเดิมคิดถึงเธอทุกวัน`\"\"\n\nหากชีวิตนี้เร็วดังความฝัน.. กาลครั้งหนึ่ง\n**`สักวันเราคงได้พบกัน`**",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr3,
		CategoryID: IDPtr3,
		MusicID:    IDPtr6,
		MoodID:     IDPtr11,
	}
	db.Model(&Log{}).Create(&log5)

	log6 := Log{
		Title:      "ปักเป้า",
		Cover:      "https://ipdefenseforum.com/wp-content/uploads/2023/08/coral.jpg",
		Article:    "`\"\"ปลาปักเป้าพองตัวได้ไม่เกิน 3 ครั้งในชีวิต\\nแต่มนุษย์กลับชอบช่วงเวลาที่ปลาปักเป้าทรมาน\"\"`\nคิดย้อนไปทุกทีก็ใจหายไปเสียทุกครั้ง\nที่ชอบใช้จ่ายความสัมพันธ์ไปกับความสุข\nโดยลืมความรู้สึกของปลาปักเป้าเสมอมา\n`@ปลาปักเป้าของเรา$ตาย$แล้ว@`\n`@ความสัมพันธ์ของเราก็จบลงแล้วเช่นกัน@`",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr3,
		CategoryID: IDPtr3,
		MusicID:    IDPtr7,
		MoodID:     IDPtr1,
	}
	db.Model(&Log{}).Create(&log6)

	log7 := Log{
		Title:      "ความบังเอิญหรือโชคชะตา",
		Cover:      "https://assets.beartai.com/uploads/2023/02/Untitled-1-3.jpg",
		Article:    "\"\"ไม่ว่าจะด้วยความบังเอิญหรือโชคชะตา\\nรู้สึกยินดีแบบบริสุทธิ์ใจที่ครั้งหนึ่งเคยได้รู้จักคุณ\\nพรรณาเรื่องราวต่างๆมากมายให้กันและกัน\\nจนมีชั่วขณะหนึ่งที่เผลอคิดไปว่าคุณจะเข้ามาเป็นส่วนหนึ่งในทุกๆวัน\\nโดยที่ไม่หล่นหายตามกาลเวลา\"\"",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr4,
		CategoryID: IDPtr3,
		MusicID:    IDPtr1,
		MoodID:     IDPtr4,
	}
	db.Model(&Log{}).Create(&log7)

	log8 := Log{
		Title:      "ทิ้งบางอย่างไว้",
		Cover:      "https://meghanharney.wordpress.com/wp-content/uploads/2012/12/hug-couple-sad.jpg?w=629",
		Article:    "ตัวตนของเรามันชัดเจนจากภาพเมื่อหลายปีก่อน\nเมื่อมองมายังปัจจุบัน เราค้นพบ\n\n\n`**@เราได้ทำตัวเองหล่นหายระหว่างทาง@**`\n\n\nทำไมตอนนี้เราถึงได้ชื่นชมคนคนนั้น\n`~**คนในอดีตที่หน้าตาเหมือนเรา**~`\nทำไมเขาใช้ชีวิตได้มีความสุขดีจัง\nทำไมเขายังยิ้มแบบมีความสุขได้ขนาดนั้น\nทำไมโลกของเขาดูสดใสกว่าใครๆ\n\nทำไม ทำไม\n\nทำไมเราตอนนี้\nถึงยิ้มกว้างแบบนั้นไม่เป็นแล้ว\n\nหรือนี่คือค่าใช้จ่ายระหว่างการเดินทาง\n\nโลกนี้ ไม่มีอะไรได้มาฟรี\nคำนี้ไม่ลวงโลกเลย\n\nการเดินทางมีค่าใช้จ่ายสูง\nจนเราเองก็คาดไม่ถึง\nสิ่งหนึ่งที่เราตัองจ่าย\n`คือ~ตัวเรา~`\nสิ่งที่เราได้รับก็คือตัวเรา\nตัวเราที่มี\nทัศนคติ ความคิด การใช้ชีวิต\nที่อาจจะเปลี่ยนไปมาก\nหรืออาจเปลี่ยนเล็กน้อย\nแต่สุดท้ายสิ่งที่เราต้องจ่าย\nก็คือการเปลี่ยนแปลง\nซึ่งไม่รู้ว่ามันคุ้มไหม\n\n`\"\"ตราบที่เรายังต้องใช้ชีวิต\\nแน่นอน\\nเราต้องจ่ายมันทั้งชีวิต\"\"`",
		LikesCount: 0,
		SavesCount: 0,
		UserID:     IDPtr4,
		CategoryID: IDPtr2,
		MusicID:    IDPtr8,
		MoodID:     IDPtr2,
	}
	db.Model(&Log{}).Create(&log8)

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
