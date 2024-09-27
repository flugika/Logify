package unit_test

import (
	"testing"

	"github.com/asaskevich/govalidator"
	"github.com/flugika/Logify/entity"
	. "github.com/onsi/gomega"
)

func TestFollowerValidate(t *testing.T) {
	g := NewGomegaWithT(t) // start testing

	t.Run("check follower completely", func(t *testing.T) {
		ID1 := uint(1)
		ID2 := uint(2)

		// Create pointers to ID1 and ID2
		userID := &ID2
		followerID := &ID1

		cf := entity.Follower{
			UserID:     userID,
			FollowerID: followerID,
		}

		ok, err := govalidator.ValidateStruct(cf)

		// Check ok is true
		g.Expect(ok).To(BeTrue())

		// Check err is nil
		g.Expect(err).To(BeNil())
	})

	t.Run("check follower cannot be the same as user", func(t *testing.T) {
		ID := uint(1)

		userID := &ID
		followerID := &ID // Same user ID for testing

		cf := entity.Follower{
			UserID:     userID,
			FollowerID: followerID,
		}

		// Call the custom validation method
		err := cf.Validate()

		// Check err is not nil (invalid follower)
		g.Expect(err).ToNot(BeNil())

		// Check err message
		g.Expect(err.Error()).To(Equal("UserID and FollowerID cannot be the same"))
	})
}
