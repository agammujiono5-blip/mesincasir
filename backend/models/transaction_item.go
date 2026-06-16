package models

import "time"

type TransactionItem struct {
	ID            uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	TransactionID uint      `gorm:"column:transaction_id;not null" json:"transaction_id"`
	ProductID     uint      `gorm:"column:product_id" json:"product_id"`
	Product       *Product  `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	ProductName   string    `gorm:"type:varchar(255);not null" json:"product_name"`
	Qty           int       `gorm:"type:integer;not null" json:"qty"`
	Price         int64     `gorm:"type:bigint;not null" json:"price"`
	Subtotal      int64     `gorm:"type:bigint;not null" json:"subtotal"`
	CreatedAt     time.Time `gorm:"type:timestamp;default:now()" json:"created_at"`
}
