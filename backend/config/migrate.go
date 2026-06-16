package config

import (
	"backend/models"
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func RunMigration() error {
	// Use GORM's AutoMigrate to create/align all schemas
	err := GormDB.AutoMigrate(
		&models.User{},
		&models.Customer{},
		&models.Product{},
		&models.Transaction{},
		&models.TransactionItem{},
		&models.Employee{},
	)
	if err != nil {
		return fmt.Errorf("failed to auto migrate tables: %w", err)
	}

	// Seed products if catalog is empty
	var productCount int64
	GormDB.Model(&models.Product{}).Count(&productCount)
	if productCount == 0 {
		initialProducts := []models.Product{
			{SKU: "SKU-001", Name: "Dell Latitude 430 Laptop", Category: "Computers", Stock: 15, BuyPrice: 3800000, SellPrice: 4500000, Image: "💻"},
			{SKU: "SKU-002", Name: "InkJet Printer HP 820C", Category: "Printers", Stock: 8, BuyPrice: 650000, SellPrice: 850000, Image: "🖨"},
			{SKU: "SKU-003", Name: "USB Mouse Logitech M100", Category: "Accessories", Stock: 42, BuyPrice: 85000, SellPrice: 125000, Image: "🖱"},
			{SKU: "SKU-004", Name: "17\" CRT Monitor Philips", Category: "Monitors", Stock: 6, BuyPrice: 950000, SellPrice: 1200000, Image: "🖥"},
			{SKU: "SKU-005", Name: "Keyboard PS/2 102-Key", Category: "Accessories", Stock: 55, BuyPrice: 45000, SellPrice: 75000, Image: "⌨"},
			{SKU: "SKU-006", Name: "Floppy Disk 3.5\" 10-Pack", Category: "Storage", Stock: 3, BuyPrice: 22000, SellPrice: 35000, Image: "💾"},
			{SKU: "SKU-007", Name: "Toner Cartridge Black HP", Category: "Consumables", Stock: 18, BuyPrice: 250000, SellPrice: 320000, Image: "🖨"},
			{SKU: "SKU-008", Name: "A4 Paper 70gsm Ream", Category: "Stationery", Stock: 120, BuyPrice: 18000, SellPrice: 28000, Image: "📄"},
			{SKU: "SKU-009", Name: "56K Fax/Modem Internal", Category: "Networking", Stock: 4, BuyPrice: 180000, SellPrice: 250000, Image: "📞"},
			{SKU: "SKU-010", Name: "CD-R 650MB 52x (10-Pack)", Category: "Storage", Stock: 67, BuyPrice: 28000, SellPrice: 45000, Image: "💿"},
		}
		if err := GormDB.Create(&initialProducts).Error; err != nil {
			fmt.Println("⚠️ Failed to seed products:", err)
		} else {
			fmt.Println("🌱 Initial products seeded successfully")
		}
	}

	// Seed users if users table is empty
	var userCount int64
	GormDB.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		passwords := map[string]string{
			"admin":   "admin123",
			"kasir1":  "kasir123",
			"kasir2":  "kasir456",
			"manager": "mgr2024",
		}
		employeeMap := map[string]string{
			"kasir1":  "EMP-001",
			"kasir2":  "EMP-002",
			"manager": "EMP-003",
			"admin":   "EMP-003", // admin is also mapped or empty, let's map it to Store Manager
		}
		var initialUsers []models.User
		for username, plainPassword := range passwords {
			hashed, _ := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
			role := "CASHIER"
			if username == "admin" {
				role = "ADMIN"
			} else if username == "manager" {
				role = "MANAGER"
			}
			initialUsers = append(initialUsers, models.User{
				Username:     username,
				PasswordHash: string(hashed),
				Role:         role,
				EmployeeID:   employeeMap[username],
			})
		}
		if err := GormDB.Create(&initialUsers).Error; err != nil {
			fmt.Println("⚠️ Failed to seed users:", err)
		} else {
			fmt.Println("🌱 Initial users seeded successfully")
		}
	} else {
		// If users table is already seeded, update employee_id association if empty
		GormDB.Model(&models.User{}).Where("username = ? AND (employee_id IS NULL OR employee_id = '')", "kasir1").Update("employee_id", "EMP-001")
		GormDB.Model(&models.User{}).Where("username = ? AND (employee_id IS NULL OR employee_id = '')", "kasir2").Update("employee_id", "EMP-002")
		GormDB.Model(&models.User{}).Where("username = ? AND (employee_id IS NULL OR employee_id = '')", "manager").Update("employee_id", "EMP-003")
		GormDB.Model(&models.User{}).Where("username = ? AND (employee_id IS NULL OR employee_id = '')", "admin").Update("employee_id", "EMP-003")
	}

	// Seed employees if employees table is empty
	var employeeCount int64
	GormDB.Model(&models.Employee{}).Count(&employeeCount)
	if employeeCount == 0 {
		initialEmployees := []models.Employee{
			{EmployeeID: "EMP-001", Name: "Agus Wirawan", Role: "Head Cashier", Shift: "Morning", Status: "ON DUTY"},
			{EmployeeID: "EMP-002", Name: "Rina Safitri", Role: "Cashier", Shift: "Evening", Status: "ON DUTY"},
			{EmployeeID: "EMP-003", Name: "Yunita Sari", Role: "Store Manager", Shift: "General", Status: "ON DUTY"},
		}
		if err := GormDB.Create(&initialEmployees).Error; err != nil {
			fmt.Println("⚠️ Failed to seed employees:", err)
		} else {
			fmt.Println("🌱 Initial employees seeded successfully")
		}
	}

	fmt.Println("✅ All tables migrated and seeded successfully via GORM")
	return nil
}