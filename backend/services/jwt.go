package services

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(
	id string,
	username string,
	role string,
	employeeID string,
	employeeName string,
) (string, error) {

	secret := os.Getenv("JWT_SECRET")

	claims := jwt.MapClaims{
		"id":            id,
		"username":      username,
		"role":          role,
		"employee_id":   employeeID,
		"employee_name": employeeName,
		"exp":           time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)

	return token.SignedString([]byte(secret))
}