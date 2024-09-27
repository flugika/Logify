package unit_test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	"github.com/flugika/Logify/entity"
	. "github.com/onsi/gomega"
)

func TestLikeValidate(t *testing.T) {
	g := NewGomegaWithT(t) // start testing

	t.Run("check like completely", func(t *testing.T) {
		ID1 := uint(1)
		ID2 := uint(2)

		// Create pointers to ID1 and ID2
		logID := &ID1
		userID := &ID2

		cl := entity.Like{
			LogID:  logID,
			UserID: userID,
		}

		ok, err := govalidator.ValidateStruct(cl)

		// Check ok is true
		g.Expect(ok).To(BeTrue())

		// Check err is nil
		g.Expect(err).To(BeNil())
	})

	t.Run("check like own log", func(t *testing.T) {
		ID := uint(1)

		userID := &ID

		cl := entity.Like{
			LogID:  userID,
			UserID: userID,
		}

		ok, err := govalidator.ValidateStruct(cl)

		// Check ok is true
		g.Expect(ok).To(BeTrue())

		// Check err is nil
		g.Expect(err).To(BeNil())
	})
}
