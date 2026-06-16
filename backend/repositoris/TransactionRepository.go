package repositoris

import (
	"backend/config"
	"backend/models"
	"errors"
	"fmt"
	"math"
	"time"

	"gorm.io/gorm"
)

// Checkout processes a sales transaction using GORM database transactions
func Checkout(reqCustomerID *uint, reqItems []models.TransactionItem, paymentMethod string, employeeID string, employeeName string) (*models.Transaction, error) {
	var transaction models.Transaction

	// Run all operations inside a database transaction block
	err := config.GormDB.Transaction(func(tx *gorm.DB) error {
		var customer models.Customer
		var customerExists bool = false

		// 1. Validate customer if provided
		if reqCustomerID != nil && *reqCustomerID > 0 {
			if err := tx.First(&customer, *reqCustomerID).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return errors.New("customer tidak ditemukan")
				}
				return err
			}
			customerExists = true
		}

		var itemsToSave []models.TransactionItem
		var subtotal int64 = 0

		// 2. Validate stock, deduct it, and prepare transaction items
		for _, reqItem := range reqItems {
			var product models.Product
			// Select and lock row FOR UPDATE to prevent race conditions
			if err := tx.Set("gorm:query_option", "FOR UPDATE").First(&product, reqItem.ProductID).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return fmt.Errorf("produk ID %d tidak ditemukan", reqItem.ProductID)
				}
				return err
			}

			// Validasi stok (Rule 3)
			if product.Stock < reqItem.Qty {
				return fmt.Errorf("Stok %s tidak mencukupi", product.Name)
			}

			// Calculate item subtotal
			itemSubtotal := product.SellPrice * int64(reqItem.Qty)
			subtotal += itemSubtotal

			// Deduct stock automatically (Rule 2)
			product.Stock -= reqItem.Qty
			if err := tx.Save(&product).Error; err != nil {
				return err
			}

			itemsToSave = append(itemsToSave, models.TransactionItem{
				ProductID:   reqItem.ProductID,
				ProductName: product.Name,
				Qty:         reqItem.Qty,
				Price:       product.SellPrice,
				Subtotal:    itemSubtotal,
			})
		}

		// 3. Apply discount based on membership (Rule 6)
		var discountPercent int = 0
		if customerExists {
			switch customer.Membership {
			case "PLATINUM":
				discountPercent = 10
			case "GOLD":
				discountPercent = 7
			case "SILVER":
				discountPercent = 5
			case "BRONZE":
				discountPercent = 2
			default:
				discountPercent = 0
			}
		}

		discountAmount := (subtotal * int64(discountPercent)) / 100
		taxableAmount := subtotal - discountAmount
		taxAmount := (taxableAmount * 10) / 100
		grandTotal := taxableAmount + taxAmount

		// 4. Generate transaction invoice number
		today := time.Now().Format("20060102")
		var lastTx models.Transaction
		var seq int = 1
		pattern := fmt.Sprintf("TXN-%s-%%", today)
		if err := tx.Where("invoice_number LIKE ?", pattern).Order("invoice_number DESC").Limit(1).First(&lastTx).Error; err == nil {
			lastCode := lastTx.InvoiceNumber
			if len(lastCode) >= 4 {
				fmt.Sscanf(lastCode[len(lastCode)-4:], "%d", &seq)
				seq++
			}
		}
		invoiceNum := fmt.Sprintf("TXN-%s-%04d", today, seq)

		var custName string = "Walk-in Customer"
		if customerExists {
			custName = customer.Name
		}

		// 5. Insert transaction record (Rule 1)
		transaction = models.Transaction{
			TransactionCode: invoiceNum,
			InvoiceNumber:   invoiceNum,
			CustomerID:      reqCustomerID,
			CustomerName:    custName,
			EmployeeID:      employeeID,
			EmployeeName:    employeeName,
			CashierID:       employeeID,
			Subtotal:        subtotal,
			Tax:             taxAmount,
			Discount:        discountAmount,
			GrandTotal:      grandTotal,
			TotalAmount:     grandTotal,
			PaymentMethod:   paymentMethod,
			Status:          "PAID",
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		}

		if err := tx.Create(&transaction).Error; err != nil {
			return err
		}

		// 6. Insert transaction items (Rule 1)
		for i := range itemsToSave {
			itemsToSave[i].TransactionID = transaction.ID
			if err := tx.Create(&itemsToSave[i]).Error; err != nil {
				return err
			}
		}

		// 7. Update customer loyalty, purchases, and membership (Rule 5 & 6)
		if customerExists {
			customer.TotalPurchases += grandTotal
			
			// Membership logic based on cumulative total purchases
			if customer.TotalPurchases >= 10000000 {
				customer.Membership = "PLATINUM"
			} else if customer.TotalPurchases >= 5000000 {
				customer.Membership = "GOLD"
			} else if customer.TotalPurchases >= 1000000 {
				customer.Membership = "SILVER"
			} else {
				customer.Membership = "BRONZE"
			}

			// Loyalty points: +1 pt per Rp 10.000 spent
			pointsEarned := int(math.Floor(float64(grandTotal) / 10000.0))
			customer.LoyaltyPoints += pointsEarned

			nowTime := time.Now()
			customer.LastTransactionAt = &nowTime

			if err := tx.Save(&customer).Error; err != nil {
				return err
			}
		}

		// 8. Log employee transaction stats
		if employeeID != "" {
			var emp models.Employee
			if err := tx.Where("employee_id = ?", employeeID).First(&emp).Error; err == nil {
				emp.TotalSales += grandTotal
				emp.Transactions += 1
				if err := tx.Save(&emp).Error; err != nil {
					// We log but don't fail transaction if employee stats fail
					fmt.Println("⚠️ Failed to update employee stats:", err)
				}
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Preload customer and items for response presentation
	if transaction.CustomerID != nil {
		config.GormDB.First(&transaction.Customer, *transaction.CustomerID)
	}
	config.GormDB.Where("transaction_id = ?", transaction.ID).Find(&transaction.Items)

	return &transaction, nil
}

// GetRecentTransactions retrieves 10 most recent transactions using GORM (Rule 7)
func GetRecentTransactions() ([]models.RecentTransactionResponse, error) {
	var txs []models.Transaction
	err := config.GormDB.
		Preload("Customer").
		Order("created_at DESC, id DESC").
		Limit(10).
		Find(&txs).Error

	if err != nil {
		return nil, err
	}

	var response []models.RecentTransactionResponse
	for _, t := range txs {
		custName := t.CustomerName
		if custName == "" {
			custName = "Walk-in Customer"
			if t.Customer != nil {
				custName = t.Customer.Name
			}
		}

		cashierName := t.EmployeeName
		if cashierName == "" {
			cashierName = t.CashierID
		}
		if cashierName == "" {
			cashierName = "System"
		}

		response = append(response, models.RecentTransactionResponse{
			TransactionCode: t.InvoiceNumber,
			Customer:        custName,
			Cashier:         cashierName,
			GrandTotal:      t.GrandTotal,
			Status:          t.Status,
			CreatedAt:       t.CreatedAt.Format("2006-01-02"),
		})
	}
	return response, nil
}

// GetSalesReport calculates total sales, transactions count, and average order value via GORM
func GetSalesReport() (map[string]interface{}, error) {
	var summary struct {
		TotalSales        int64 `gorm:"column:total_sales"`
		TotalTransactions int   `gorm:"column:total_transactions"`
		AvgOrder          int64 `gorm:"column:avg_order"`
	}

	err := config.GormDB.Model(&models.Transaction{}).
		Select("COALESCE(SUM(grand_total), 0) as total_sales, COUNT(*) as total_transactions, COALESCE(ROUND(AVG(grand_total)), 0) as avg_order").
		Scan(&summary).Error

	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"total_sales":        summary.TotalSales,
		"total_transactions": summary.TotalTransactions,
		"average_order":      summary.AvgOrder,
	}, nil
}
