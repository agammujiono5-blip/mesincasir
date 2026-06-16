package headlers

import (
	"backend/models"
	"backend/repositoris"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CheckoutRequestItem struct {
	ProductID uint `json:"product_id" binding:"required"`
	Qty       int  `json:"qty" binding:"required,gt=0"`
}

type CheckoutRequest struct {
	CustomerID    *uint                 `json:"customer_id"`
	PaymentMethod string                `json:"payment_method" binding:"required"`
	Items         []CheckoutRequestItem `json:"items" binding:"required,dive"`
}

// Checkout handler processes a checkout request
func Checkout(c *gin.Context) {
	var req CheckoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "request body tidak valid: " + err.Error(),
		})
		return
	}

	if len(req.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "items tidak boleh kosong",
		})
		return
	}

	// Map to models.TransactionItem
	var items []models.TransactionItem
	for _, item := range req.Items {
		items = append(items, models.TransactionItem{
			ProductID: item.ProductID,
			Qty:       item.Qty,
		})
	}

	// Process Checkout
	employeeID := c.GetString("employeeId")
	employeeName := c.GetString("employeeName")
	transaction, err := repositoris.Checkout(req.CustomerID, items, req.PaymentMethod, employeeID, employeeName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "checkout berhasil",
		"data":    transaction,
	})
}

// GetRecentTransactions handler returns the 10 most recent transactions
func GetRecentTransactions(c *gin.Context) {
	transactions, err := repositoris.GetRecentTransactions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "gagal mengambil transaksi terbaru: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, transactions)
}

// GetSalesReport handler returns total sales, transaction counts, and avg orders
func GetSalesReport(c *gin.Context) {
	report, err := repositoris.GetSalesReport()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "gagal membuat laporan penjualan: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, report)
}

// UpdateCustomer handler updates customer details
func UpdateCustomer(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "ID customer tidak valid",
		})
		return
	}

	var customer models.Customer
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "request body tidak valid",
		})
		return
	}

	err = repositoris.UpdateCustomer(uint(id), customer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "gagal memperbarui customer: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "customer berhasil diperbarui",
	})
}
