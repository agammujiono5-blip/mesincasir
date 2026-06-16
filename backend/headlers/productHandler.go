package headlers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetProducts handles retrieving all products from the database using GORM
func GetProducts(c *gin.Context) {
	var products []models.Product
	if err := config.GormDB.Order("id ASC").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "gagal mengambil produk: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, products)
}
