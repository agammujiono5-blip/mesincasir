package repositoris

import (
	"backend/config"
	"backend/models"
	"time"
)

func GetDashboardStats() (map[string]interface{}, error) {
	db := config.GormDB

	// 1. Total Customers
	var totalCustomers int64
	if err := db.Model(&models.Customer{}).Count(&totalCustomers).Error; err != nil {
		totalCustomers = 0
	}

	// 2. Active Employees (ON DUTY)
	var employeesOnDuty int64
	if err := db.Model(&models.Employee{}).Where("status = ?", "ON DUTY").Count(&employeesOnDuty).Error; err != nil {
		employeesOnDuty = 0
	}

	// 3. Active Products in Catalog
	var activeProducts int64
	if err := db.Model(&models.Product{}).Count(&activeProducts).Error; err != nil {
		activeProducts = 0
	}

	// 4. Low Stock count (Rule 8: stock <= 5)
	var lowStockCount int64
	if err := db.Model(&models.Product{}).Where("stock <= ?", 5).Count(&lowStockCount).Error; err != nil {
		lowStockCount = 0
	}

	// 5. Today's Sales
	var todaySales int64
	todayStart := time.Now().Truncate(24 * time.Hour)
	if err := db.Model(&models.Transaction{}).
		Where("created_at >= ?", todayStart).
		Select("COALESCE(SUM(grand_total), 0)").
		Row().Scan(&todaySales); err != nil {
		todaySales = 0
	}

	// 6. Total Transactions processed
	var totalTransactions int64
	if err := db.Model(&models.Transaction{}).Count(&totalTransactions).Error; err != nil {
		totalTransactions = 0
	}

	// 7. Average Order Value
	var avgOrderValue int64
	if err := db.Model(&models.Transaction{}).
		Select("COALESCE(ROUND(AVG(grand_total)), 0)").
		Row().Scan(&avgOrderValue); err != nil {
		avgOrderValue = 0
	}

	// 8. Monthly Revenue (Current Month)
	var monthlyRevenue int64
	now := time.Now()
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	if err := db.Model(&models.Transaction{}).
		Where("created_at >= ?", monthStart).
		Select("COALESCE(SUM(grand_total), 0)").
		Row().Scan(&monthlyRevenue); err != nil {
		monthlyRevenue = 0
	}

	// 9. Recent Transactions list (Rule 7: 10 transactions)
	recentTxns, err := GetRecentTransactions()
	if err != nil {
		recentTxns = []models.RecentTransactionResponse{}
	}

	// 10. Low Stock products list (Rule 8: stock <= 5)
	var lowStockProducts []models.Product
	if err := db.Where("stock <= ?", 5).Order("stock ASC").Find(&lowStockProducts).Error; err != nil {
		lowStockProducts = []models.Product{}
	}

	topCashierName := "—"
	if top, err := GetTopCashier(); err == nil && top != nil {
		topCashierName = top.Name
	}

	return map[string]interface{}{
		"today_sales":         todaySales,
		"total_transactions":  totalTransactions,
		"active_products":     activeProducts,
		"low_stock":           lowStockCount,
		"total_customers":     totalCustomers,
		"avg_order_value":     avgOrderValue,
		"employees_on_duty":   employeesOnDuty,
		"monthly_revenue":     monthlyRevenue,
		"top_cashier":         topCashierName,
		"recent_transactions": recentTxns,
		"low_stock_products":  lowStockProducts,
	}, nil
}