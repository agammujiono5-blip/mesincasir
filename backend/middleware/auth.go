package middleware

import (
	"fmt"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		fmt.Println("====================================")
		fmt.Println("METHOD :", c.Request.Method)
		fmt.Println("PATH   :", c.Request.URL.Path)
		fmt.Println("AUTH   :", authHeader)
		fmt.Println("====================================")

		if authHeader == "" {
			fmt.Println("ERROR : Authorization header kosong")

			c.JSON(401, gin.H{
				"message": "token required",
			})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(
			authHeader,
			"Bearer ",
		)

		fmt.Println("TOKEN :", tokenString)

		token, err := jwt.Parse(
			tokenString,
			func(token *jwt.Token) (interface{}, error) {

				fmt.Println("JWT SECRET :", os.Getenv("JWT_SECRET"))

				return []byte(os.Getenv("JWT_SECRET")), nil
			},
		)

		if err != nil {
			fmt.Println("JWT ERROR :", err)
		}

		if token == nil {
			fmt.Println("TOKEN NIL")
		}

		if token != nil {
			fmt.Println("TOKEN VALID :", token.Valid)
		}

		if err != nil || !token.Valid {

			fmt.Println("ERROR : INVALID TOKEN")

			c.JSON(401, gin.H{
				"message": "invalid token",
			})

			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("userId", claims["id"])
			c.Set("username", claims["username"])
			c.Set("role", claims["role"])
			c.Set("employeeId", claims["employee_id"])
			c.Set("employeeName", claims["employee_name"])
		}

		fmt.Println("AUTH SUCCESS")
		c.Next()
	}
}