package headlers

import (
	"backend/repositoris"

	"github.com/gin-gonic/gin"
)

func GetDashboard(c *gin.Context) {

	data, err := repositoris.GetDashboardStats()

	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, data)
}