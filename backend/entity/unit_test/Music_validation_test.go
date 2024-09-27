package unit_test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	"github.com/flugika/Logify/entity"
	. "github.com/onsi/gomega"
)

func TestMusicValidate(t *testing.T) {
	g := NewGomegaWithT(t) // start testing

	t.Run("check music completely", func(t *testing.T) {
		ID := uint(1)
		IDPtr := &ID

		cm := entity.Music{
			Name:       "Afterthought",
			Artist:     "Joji feat. BENEE",
			URL:        "https://youtu.be/ujriV3vkC9w",
			ChorusTime: 47,
			MoodID:     IDPtr,
			UserID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cm)

		// Print the validation result
		if !ok {
			t.Errorf("Expected validation to succeed, but got error: %v", err)
		}

		// Check ok is true
		g.Expect(ok).To(BeTrue())

		// Check err is nil
		g.Expect(err).To(BeNil())
	})

	t.Run("check valid 'Name'", func(t *testing.T) {
		ID := uint(1)
		IDPtr := &ID

		cm := entity.Music{
			Name:       "",
			Artist:     "Joji feat. BENEE",
			URL:        "https://youtu.be/ujriV3vkC9w",
			ChorusTime: 47,
			MoodID:     IDPtr,
			UserID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cm)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Name)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Name)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Music name cannot be blank (เพราะเกิด error ที่ Name)
		g.Expect(err.Error()).To(Equal("Music name cannot be blank"))
	})

	t.Run("check valid 'Artist'", func(t *testing.T) {
		ID := uint(1)
		IDPtr := &ID

		cm := entity.Music{
			Name:       "Afterthought",
			Artist:     "",
			URL:        "https://youtu.be/ujriV3vkC9w",
			ChorusTime: 47,
			MoodID:     IDPtr,
			UserID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cm)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Artist)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Artist)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Artist name cannot be blank (เพราะเกิด error ที่ Artist)
		g.Expect(err.Error()).To(Equal("Artist name cannot be blank"))
	})

	t.Run("check valid 'URL'", func(t *testing.T) {
		ID := uint(1)
		IDPtr := &ID

		cm := entity.Music{
			Name:       "Afterthought",
			Artist:     "Joji feat. BENEE",
			URL:        "",
			ChorusTime: 47,
			MoodID:     IDPtr,
			UserID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cm)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ URL)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ URL)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น URL cannot be blank (เพราะเกิด error ที่ URL)
		g.Expect(err.Error()).To(Equal("URL cannot be blank"))
	})

	t.Run("check format 'URL'", func(t *testing.T) {
		ID := uint(1)
		IDPtr := &ID

		cm := entity.Music{
			Name:       "Afterthought",
			Artist:     "Joji feat. BENEE",
			URL:        "youtu.be/ujriV3vkC9w",
			ChorusTime: 47,
			MoodID:     IDPtr,
			UserID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cm)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ URL)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ URL)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Invalid URL format (เพราะเกิด error ที่ URL)
		g.Expect(err.Error()).To(Equal("Invalid URL format"))
	})

	t.Run("check valid 'ChorusTime'", func(t *testing.T) {
		ID := uint(1)
		IDPtr := &ID

		cm := entity.Music{
			Name:       "Afterthought",
			Artist:     "Joji feat. BENEE",
			URL:        "https://youtu.be/ujriV3vkC9w",
			ChorusTime: 0,
			MoodID:     IDPtr,
			UserID:     IDPtr,
		}

		ok, err := govalidator.ValidateStruct(cm)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ ChorusTime)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ ChorusTime)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Chorus time is required (เพราะเกิด error ที่ ChorusTime)
		g.Expect(err.Error()).To(Equal("Chorus time is required"))
	})

}
