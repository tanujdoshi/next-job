package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error while hashing the password ==>", err)
		return err.Error()
	}
	return string(hashedPassword)
}

func VerifyHashPassword(password string, plainTextPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(password), []byte(plainTextPassword))
	return err
}
