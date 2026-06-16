package repositoris

import (
	"backend/config"
	"backend/models"
	"fmt"
	"time"
)

func CreateEmployee(employee models.Employee) error {
	_, err := config.DB.Exec(`
		INSERT INTO employees
		(employee_id, name, role, shift, status, total_sales, transactions)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`,
		employee.EmployeeID,
		employee.Name,
		employee.Role,
		employee.Shift,
		employee.Status,
		employee.TotalSales,
		employee.Transactions,
	)
	return err
}

func GetEmployees() ([]models.Employee, error) {
	rows, err := config.DB.Query(`
		SELECT
			e.id,
			e.employee_id,
			e.name,
			e.role,
			e.shift,
			e.status,
			COALESCE(SUM(t.total_amount), 0) AS total_sales,
			COUNT(t.id) AS total_transactions,
			COUNT(DISTINCT t.customer_id) AS customers_served
		FROM employees e
		LEFT JOIN transactions t ON e.employee_id = t.employee_id
		GROUP BY e.id, e.employee_id, e.name, e.role, e.shift, e.status
		ORDER BY e.id DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var employees []models.Employee
	for rows.Next() {
		var employee models.Employee
		err := rows.Scan(
			&employee.ID,
			&employee.EmployeeID,
			&employee.Name,
			&employee.Role,
			&employee.Shift,
			&employee.Status,
			&employee.TotalSales,
			&employee.Transactions,
			&employee.CustomersServed,
		)
		if err != nil {
			return nil, err
		}
		employees = append(employees, employee)
	}
	return employees, nil
}

type TopCashierResponse struct {
	EmployeeID string `json:"employee_id"`
	Name       string `json:"name"`
	TotalSales int64  `json:"total_sales"`
}

func GetTopCashier() (*TopCashierResponse, error) {
	var top TopCashierResponse
	now := time.Now()
	// Start of current month in local time/location
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	// Try to query current month top cashier
	err := config.GormDB.Table("employees e").
		Select("e.employee_id, e.name, COALESCE(SUM(t.total_amount), 0) as total_sales").
		Joins("JOIN transactions t ON e.employee_id = t.employee_id").
		Where("t.created_at >= ?", monthStart).
		Group("e.employee_id, e.name").
		Order("total_sales DESC").
		Limit(1).
		Scan(&top).Error

	// If no transactions in current month, fallback to overall top cashier
	if err != nil || top.EmployeeID == "" {
		err = config.GormDB.Table("employees e").
			Select("e.employee_id, e.name, COALESCE(SUM(t.total_amount), 0) as total_sales").
			Joins("JOIN transactions t ON e.employee_id = t.employee_id").
			Group("e.employee_id, e.name").
			Order("total_sales DESC").
			Limit(1).
			Scan(&top).Error
	}

	// If still no transaction at all, fallback to the employee with overall highest sales or first employee
	if err != nil || top.EmployeeID == "" {
		var emp models.Employee
		if err := config.GormDB.Order("total_sales DESC, id ASC").Limit(1).Find(&emp).Error; err == nil && emp.EmployeeID != "" {
			top.EmployeeID = emp.EmployeeID
			top.Name = emp.Name
			top.TotalSales = emp.TotalSales
		} else {
			return nil, fmt.Errorf("no cashier found")
		}
	}

	return &top, nil
}