package models

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Username     string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"username"`
	PasswordHash string    `gorm:"type:varchar(255);not null" json:"password_hash"`
	Role         string    `gorm:"type:varchar(50);not null;default:'CASHIER'" json:"role"`
	EmployeeID   string    `gorm:"type:varchar(100)" json:"employee_id"`
	CreatedAt    time.Time `gorm:"type:timestamp;default:now()" json:"created_at"`
}
