package repositoris

import (
	"backend/config"
	"backend/models"
)

func CreateCustomer(customer models.Customer) (models.Customer, error) {
	if customer.Membership == "" && customer.MembershipInput != "" {
		customer.Membership = customer.MembershipInput
	}
	if customer.Membership == "" {
		customer.Membership = "BRONZE"
	}

	query := `
	INSERT INTO customers (
		name,
		phone,
		email,
		membership,
		total_purchases,
		loyalty_points
	)
	VALUES ($1,$2,$3,$4,$5,$6)
	RETURNING id, name, phone, email, membership, total_purchases, loyalty_points, created_at
	`

	row := config.DB.QueryRow(
		query,
		customer.Name,
		customer.Phone,
		customer.Email,
		customer.Membership,
		customer.TotalPurchases,
		customer.LoyaltyPoints,
	)

	var result models.Customer
	err := row.Scan(
		&result.ID,
		&result.Name,
		&result.Phone,
		&result.Email,
		&result.Membership,
		&result.TotalPurchases,
		&result.LoyaltyPoints,
		&result.CreatedAt,
	)
	if err != nil {
		return models.Customer{}, err
	}

	return result, nil
}

func GetCustomers() ([]models.Customer, error) {
	rows, err := config.DB.Query(`
		SELECT id, name, phone, email, COALESCE(membership, 'BRONZE'), total_purchases, loyalty_points, created_at
		FROM customers
		ORDER BY id DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var customers []models.Customer

	for rows.Next() {
		var customer models.Customer
		err := rows.Scan(
			&customer.ID,
			&customer.Name,
			&customer.Phone,
			&customer.Email,
			&customer.Membership,
			&customer.TotalPurchases,
			&customer.LoyaltyPoints,
			&customer.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		customers = append(customers, customer)
	}

	return customers, nil
}

func UpdateCustomer(id uint, customer models.Customer) error {
	if customer.Membership == "" && customer.MembershipInput != "" {
		customer.Membership = customer.MembershipInput
	}
	if customer.Membership == "" {
		customer.Membership = "BRONZE"
	}

	_, err := config.DB.Exec(`
		UPDATE customers
		SET name = $1, phone = $2, email = $3, membership = $4
		WHERE id = $5
	`, customer.Name, customer.Phone, customer.Email, customer.Membership, id)
	return err
}