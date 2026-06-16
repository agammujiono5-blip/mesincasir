package routes

import (
	"backend/headlers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {

	r.POST("/api/login", headlers.Login)

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())

	{
		api.POST("/customer", headlers.CreateCustomer)
		api.GET("/customer", headlers.GetCustomers)
		api.POST("/customer/:id", headlers.UpdateCustomer)
	}

	api.POST("/employee", headlers.CreateEmployee)
	api.GET("/employee", headlers.GetEmployees)
	api.GET("/employee/top-cashier", headlers.GetTopCashier)
	api.GET("/dashboard", headlers.GetDashboard)
	api.GET("/products", headlers.GetProducts)

	// Sales and Reports routes
	api.POST("/sales/checkout", headlers.Checkout)
	api.GET("/transactions/recent", headlers.GetRecentTransactions)
	api.GET("/reports/sales", headlers.GetSalesReport)
}