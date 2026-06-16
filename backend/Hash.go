package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func generateHashes() {
	users := []struct {
		username string
		password string
		role     string
	}{
		{"admin", "admin123", "Administrator"},
		{"kasir1", "kasir123", "Head Cashier"},
		{"kasir2", "kasir456", "Cashier"},
		{"manager", "mgr2024", "Store Manager"},
	}

	for _, u := range users {
		hash, _ := bcrypt.GenerateFromPassword([]byte(u.password), bcrypt.DefaultCost)
		fmt.Printf("INSERT INTO users (username, password_hash, role) VALUES ('%s', '%s', '%s');\n", u.username, string(hash), u.role)
	}
}
