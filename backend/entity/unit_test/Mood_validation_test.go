package unit_test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	"github.com/flugika/Logify/entity"
	. "github.com/onsi/gomega"
)

func TestMoodValidate(t *testing.T) {
	g := NewGomegaWithT(t) // start testing

	t.Run("check mood completely", func(t *testing.T) {
		cm := entity.Mood{
			Name: "test",
		}

		ok, err := govalidator.ValidateStruct(cm)

		// Check ok is true
		g.Expect(ok).To(BeTrue())

		// Check err is nil
		g.Expect(err).To(BeNil())
	})

	t.Run("check valid 'Name'", func(t *testing.T) {
		cm := entity.Mood{
			Name: "",
		}

		ok, err := govalidator.ValidateStruct(cm)
		// ok = nil
		// err = true

		// เช็ค ok ไม่เป็นจริง (เพราะเกิด error ที่ Name)
		g.Expect(ok).NotTo(BeTrue())

		// เช็ค err ไม่เป็นเท็จ (เพราะเกิด error ที่ Name)
		g.Expect(err).ToNot(BeNil())

		// เช็ค err message เป็น Mood name cannot be blank (เพราะเกิด error ที่ Name)
		g.Expect(err.Error()).To(Equal("Mood name cannot be blank"))
	})

}
