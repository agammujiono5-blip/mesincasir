package models

type Dashboard struct {
	TodaySales       int64 `json:"today_sales"`
	TotalTransactions int  `json:"total_transactions"`
	ActiveProducts    int  `json:"active_products"`
	LowStock          int  `json:"low_stock"`
	TotalCustomers    int  `json:"total_customers"`
	AvgOrderValue     int64 `json:"avg_order_value"`
	EmployeesOnDuty   int  `json:"employees_on_duty"`
	MonthlyRevenue    int64 `json:"monthly_revenue"`
}