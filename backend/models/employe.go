package models

type Employee struct {
	ID              uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	EmployeeID      string `gorm:"type:varchar(100);uniqueIndex;not null" json:"employee_id"`
	Name            string `gorm:"type:varchar(100);not null" json:"name"`
	Role            string `gorm:"type:varchar(50);not null" json:"role"`
	Shift           string `gorm:"type:varchar(50);not null" json:"shift"`
	Status          string `gorm:"type:varchar(50);not null;default:'ACTIVE'" json:"status"`
	TotalSales      int64  `gorm:"type:bigint;default:0" json:"total_sales"`
	Transactions    int    `gorm:"type:integer;default:0" json:"total_transactions"`
	CustomersServed int    `gorm:"-" json:"customers_served"`
}