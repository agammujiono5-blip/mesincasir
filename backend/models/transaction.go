package models

import "time"

type Transaction struct {
	ID              uint              `gorm:"primaryKey;autoIncrement" json:"id"`
	TransactionCode string            `gorm:"column:transaction_code;type:varchar(100);uniqueIndex;not null" json:"transaction_code"`
	InvoiceNumber   string            `gorm:"column:invoice_number;type:varchar(100);uniqueIndex;not null" json:"invoice_number"`
	CustomerID      *uint             `gorm:"column:customer_id" json:"customer_id"`
	Customer        *Customer         `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
	CustomerName    string            `gorm:"column:customer_name;type:varchar(100)" json:"customer_name"`
	EmployeeID      string            `gorm:"column:employee_id;type:varchar(100)" json:"employee_id"`
	EmployeeName    string            `gorm:"column:employee_name;type:varchar(100)" json:"employee_name"`
	CashierID       string            `gorm:"column:cashier_id;type:varchar(100)" json:"cashier_id"`
	Subtotal        int64             `gorm:"type:bigint;not null" json:"subtotal"`
	Tax             int64             `gorm:"type:bigint;not null" json:"tax"`
	Discount        int64             `gorm:"type:bigint;not null" json:"discount"`
	GrandTotal      int64             `gorm:"type:bigint;not null" json:"grand_total"`
	TotalAmount     int64             `gorm:"column:total_amount;type:bigint" json:"total_amount"`
	PaymentMethod   string            `gorm:"type:varchar(50);not null" json:"payment_method"`
	Status          string            `gorm:"type:varchar(50);not null;default:'PAID'" json:"status"`
	CreatedAt       time.Time         `gorm:"type:timestamp;default:now()" json:"created_at"`
	UpdatedAt       time.Time         `gorm:"type:timestamp;default:now()" json:"updated_at"`
	Items           []TransactionItem `gorm:"foreignKey:TransactionID" json:"items,omitempty"`
}

type RecentTransactionResponse struct {
	TransactionCode string `json:"transaction_code"`
	Customer        string `json:"customer"`
	Cashier         string `json:"cashier"`
	GrandTotal      int64  `json:"grand_total"`
	Status          string `json:"status"`
	CreatedAt       string `json:"created_at"`
}
