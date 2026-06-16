package models

import "time"

type Customer struct {
	ID                uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	Name              string     `gorm:"type:varchar(100);not null" json:"name"`
	Phone             string     `gorm:"type:varchar(20)" json:"phone"`
	Email             string     `gorm:"type:varchar(255)" json:"email"`
	Membership        string     `gorm:"type:varchar(50);default:'BRONZE'" json:"level"` // mapped to level
	MembershipInput   string     `gorm:"-" json:"membership,omitempty"`                  // mapped to membership, ignored by GORM
	TotalPurchases    int64      `gorm:"type:bigint;default:0" json:"purchases"`         // mapped to purchases
	LoyaltyPoints     int        `gorm:"type:integer;default:0" json:"points"`           // mapped to points
	LastTransactionAt *time.Time `gorm:"type:timestamp" json:"last_transaction_at"`
	CreatedAt         time.Time  `gorm:"type:timestamp;default:now()" json:"since"`      // mapped to since
	UpdatedAt         time.Time  `gorm:"type:timestamp;default:now()" json:"updated_at"`
}