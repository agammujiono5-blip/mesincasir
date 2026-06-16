package headlers

import (
	"backend/models"
	"backend/repositoris"

	"github.com/gin-gonic/gin"
)

func CreateCustomer(c *gin.Context) {
	var customer models.Customer

	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(400, gin.H{
			"message": "invalid request",
		})
		return
	}

	result, err := repositoris.CreateCustomer(customer)
	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		return
	}

	// ✅ Return customer lengkap termasuk ID
	c.JSON(201, result)
}

func GetCustomers(c *gin.Context) {
	customers, err := repositoris.GetCustomers()
	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, customers)
}