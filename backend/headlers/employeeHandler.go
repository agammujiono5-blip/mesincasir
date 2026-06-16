package headlers

import (
	"backend/models"
	"backend/repositoris"

	"github.com/gin-gonic/gin"
)

func CreateEmployee(c *gin.Context) {

	var employee models.Employee

	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(400, gin.H{
			"message": "invalid request",
		})
		return
	}

	err := repositoris.CreateEmployee(employee)

	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(201, gin.H{
		"message": "employee berhasil ditambahkan",
	})
}

func GetEmployees(c *gin.Context) {

	employees, err := repositoris.GetEmployees()

	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, employees)
}

func GetTopCashier(c *gin.Context) {
	top, err := repositoris.GetTopCashier()
	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(200, top)
}