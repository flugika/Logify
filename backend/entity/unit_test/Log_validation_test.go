package unit_test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	"github.com/flugika/Logify/entity"
	. "github.com/onsi/gomega"
)

func TestLogValidate(t *testing.T) {
	g := NewGomegaWithT(t) // start testing

	t.Run("check log completely", func(t *testing.T) {
		ID := uint(1) // Sample ID
		IDPtr := &ID  // Pointer to ID

		cl := entity.Log{
			Title:      "title",
			Cover:      "cover",
			Article:    "test article",
			LikesCount: 3,
			SavesCount: 2,
			UserID:     IDPtr,
			CategoryID: IDPtr,
			MusicID:    IDPtr,
			MoodID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cl)

		// Print the validation result
		if !ok {
			t.Errorf("Expected validation to succeed, but got error: %v", err)
		}

		// Check ok is true
		g.Expect(ok).To(BeTrue())

		// Check err is nil
		g.Expect(err).To(BeNil())
	})

	t.Run("check valid 'Title'", func(t *testing.T) {
		ID := uint(1) // Sample ID
		IDPtr := &ID  // Pointer to ID

		cl := entity.Log{
			Title:      "",
			Cover:      "cover",
			Article:    "test article",
			LikesCount: 3,
			SavesCount: 2,
			UserID:     IDPtr,
			CategoryID: IDPtr,
			MusicID:    IDPtr,
			MoodID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cl)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Title)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Title)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Title cannot be blank (เพราะเกิด error ที่ Title)
		g.Expect(err.Error()).To(Equal("Title cannot be blank"))
	})

	t.Run("check valid 'Cover'", func(t *testing.T) {
		ID := uint(1) // Sample ID
		IDPtr := &ID  // Pointer to ID

		cl := entity.Log{
			Title:      "title",
			Cover:      "",
			Article:    "test article",
			LikesCount: 3,
			SavesCount: 2,
			UserID:     IDPtr,
			CategoryID: IDPtr,
			MusicID:    IDPtr,
			MoodID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cl)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Cover)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Cover)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Cover cannot be blank (เพราะเกิด error ที่ Cover)
		g.Expect(err.Error()).To(Equal("Cover cannot be blank"))
	})

	t.Run("check min 10 characters 'Article'", func(t *testing.T) {
		ID := uint(1) // Sample ID
		IDPtr := &ID  // Pointer to ID

		cl := entity.Log{
			Title:      "title",
			Cover:      "cover",
			Article:    "article",
			LikesCount: 3,
			SavesCount: 2,
			UserID:     IDPtr,
			CategoryID: IDPtr,
			MusicID:    IDPtr,
			MoodID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cl)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Article)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Article)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Article must be at least 10 characters (เพราะเกิด error ที่ Article)
		g.Expect(err.Error()).To(Equal("Article must be at least 10 characters"))
	})

	t.Run("check format url 'Article'", func(t *testing.T) {
		ID := uint(1) // Sample ID
		IDPtr := &ID  // Pointer to ID

		cl := entity.Log{
			Title:      "title",
			Cover:      "cover",
			Article:    "https://www.google.co.th/",
			LikesCount: 3,
			SavesCount: 2,
			UserID:     IDPtr,
			CategoryID: IDPtr,
			MusicID:    IDPtr,
			MoodID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cl)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Article)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Article)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Cannot add url in article (เพราะเกิด error ที่ Article)
		g.Expect(err.Error()).To(Equal("Cannot add url in article"))
	})

	t.Run("check format telephone 'Article'", func(t *testing.T) {
		ID := uint(1) // Sample ID
		IDPtr := &ID  // Pointer to ID

		cl := entity.Log{
			Title:      "title",
			Cover:      "cover",
			Article:    "0123456789",
			LikesCount: 3,
			SavesCount: 2,
			UserID:     IDPtr,
			CategoryID: IDPtr,
			MusicID:    IDPtr,
			MoodID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cl)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Article)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Article)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Cannot add telephone number in article (เพราะเกิด error ที่ Article)
		g.Expect(err.Error()).To(Equal("Cannot add telephone number in article"))
	})
}
