package unit_test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	"github.com/flugika/Logify/entity"
	. "github.com/onsi/gomega"
)

func TestUserValidate(t *testing.T) {
	g := NewGomegaWithT(t) // start testing

	t.Run("check user completely", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)

		// Check ok is true
		g.Expect(ok).To(BeTrue())

		// Check err is nil
		g.Expect(err).To(BeNil())
	})

	t.Run("check valid 'Username'", func(t *testing.T) {
		cu := entity.User{
			Username:       "",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Username)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Username)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Username cannot be blank (เพราะเกิด error ที่ Username)
		g.Expect(err.Error()).To(Equal("Username cannot be blank"))
	})

	t.Run("check match 'Username'", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan:::",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Username)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Username)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Username can only contain letters dots and underscores (เพราะเกิด error ที่ Username)
		g.Expect(err.Error()).To(Equal("Username can only contain letters dots and underscores"))
	})

	t.Run("check valid 'Firstname'", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Firstname)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Firstname)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Firstname cannot be blank (เพราะเกิด error ที่ Firstname)
		g.Expect(err.Error()).To(Equal("Firstname cannot be blank"))
	})

	t.Run("check valid 'Lastname'", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Lastname)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Lastname)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Lastname cannot be blank (เพราะเกิด error ที่ Lastname)
		g.Expect(err.Error()).To(Equal("Lastname cannot be blank"))
	})

	t.Run("check valid 'Email'", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Email)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Email)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Email cannot be blank (เพราะเกิด error ที่ Email)
		g.Expect(err.Error()).To(Equal("Email cannot be blank"))
	})

	t.Run("check format 'Email' (no @)", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "testEmail.com",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Email)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Email)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Invalid email format (เพราะเกิด error ที่ Email)
		g.Expect(err.Error()).To(Equal("Invalid email format"))
	})

	t.Run("check format 'Email' (no .)", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "test@mail",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Email)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Email)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Invalid email format (เพราะเกิด error ที่ Email)
		g.Expect(err.Error()).To(Equal("Invalid email format"))
	})

	t.Run("check valid 'Password'", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Password)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Password)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Password cannot be blank (เพราะเกิด error ที่ Password)
		g.Expect(err.Error()).To(Equal("Password cannot be blank"))
	})

	t.Run("check Password lenght", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "111",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Password)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Password)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Password must be at least 8 characters (เพราะเกิด error ที่ Password)
		g.Expect(err.Error()).To(Equal("Password must be at least 8 characters"))
	})

	t.Run("check valid 'Telephone'", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Telephone)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Telephone)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Telephone cannot be blank (เพราะเกิด error ที่ Telephone)
		g.Expect(err.Error()).To(Equal("Telephone cannot be blank"))
	})

	t.Run("check Telephone lenght", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "111",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Telephone)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Telephone)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Telephone must be at least 8 digits (เพราะเกิด error ที่ Telephone)
		g.Expect(err.Error()).To(Equal("Telephone must be at least 9 digits"))
	})

	t.Run("check valid 'Gender'", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "",
			Province:       "พะเยา",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Gender)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Gender)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Please select a gender (เพราะเกิด error ที่ Gender)
		g.Expect(err.Error()).To(Equal("Please select a gender"))
	})

	t.Run("check valid 'Province'", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "",
			Role:           "User",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Province)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Province)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Please select your province (เพราะเกิด error ที่ Province)
		g.Expect(err.Error()).To(Equal("Please select your province"))
	})

	t.Run("check valid 'Role'", func(t *testing.T) {
		cu := entity.User{
			Username:       "fukusan",
			Firstname:      "ชูเกียรติ",
			Lastname:       "ก๋าอินตา",
			Email:          "ppoqqgu00@gmail.com",
			Password:       "12345678",
			Telephone:      "0918214855",
			Gender:         "Male",
			Province:       "พะเยา",
			Role:           "",
			FollowerCount:  2,
			FollowingCount: 2,
		}

		ok, err := govalidator.ValidateStruct(cu)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Role)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Role)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Role cannot be blank (เพราะเกิด error ที่ Role)
		g.Expect(err.Error()).To(Equal("Role cannot be blank"))
	})
}
