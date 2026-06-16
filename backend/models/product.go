package models

import "time"

type Product struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	SKU       string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"sku"`
	Name      string    `gorm:"type:varchar(255);not null" json:"name"`
	Category  string    `gorm:"type:varchar(100);not null" json:"category"`
	Stock     int       `gorm:"type:integer;not null" json:"stock"`
	BuyPrice  int64     `gorm:"type:bigint;not null" json:"buyPrice"`
	SellPrice int64     `gorm:"type:bigint;not null" json:"sellPrice"`
	Image     string    `gorm:"type:varchar(50)" json:"image"`
	CreatedAt time.Time `gorm:"type:timestamp;default:now()" json:"created_at"`
	UpdatedAt time.Time `gorm:"type:timestamp;default:now()" json:"updated_at"`
}
