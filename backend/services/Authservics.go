package services

import (
	"backend/repositoris"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func Login(username string, password string) (*repositoris.User, error) {

	user, err := repositoris.GetUserByUsername(username)

	if err != nil {
		fmt.Println("User tidak ditemukan:", err)
		return nil, err
	}

	fmt.Println("===== LOGIN DEBUG =====")
	fmt.Println("Username Input :", username)
	fmt.Println("Username DB    :", user.Username)
	fmt.Println("Hash DB        :", user.PasswordHash)

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(password),
	)

	fmt.Println("Compare Error  :", err)
	fmt.Println("=======================")

	if err != nil {
		return nil, err
	}

	return user, nil
}