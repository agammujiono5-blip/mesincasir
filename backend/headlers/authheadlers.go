package headlers

import (
	"backend/services"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {

	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"message": "invalid request",
		})
		return
	}

	user, err := services.Login(
		req.Username,
		req.Password,
	)

	if err != nil {
		c.JSON(401, gin.H{
			"message": "username atau password salah",
		})
		return
	}

	token, err := services.GenerateToken(
		user.ID,
		user.Username,
		user.Role,
		user.EmployeeID,
		user.EmployeeName,
	)

	if err != nil {
		c.JSON(500, gin.H{
			"message": "gagal generate token: " + err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "login success",
		"token":   token,
		"user": gin.H{
			"username":      user.Username,
			"employee_id":   user.EmployeeID,
			"employee_name": user.EmployeeName,
			"role":          user.Role,
		},
	})
}