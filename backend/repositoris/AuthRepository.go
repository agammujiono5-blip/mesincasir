package repositoris

import (
	"backend/config"
	"database/sql"
)

type User struct {
	ID           string
	Username     string
	PasswordHash string
	Role         string
	EmployeeID   string
	EmployeeName string
}

func GetUserByUsername(username string) (*User, error) {

	var user User

	err := config.DB.QueryRow(`
		SELECT u.id, u.username, u.password_hash, u.role, COALESCE(u.employee_id, ''), COALESCE(e.name, '')
		FROM users u
		LEFT JOIN employees e ON u.employee_id = e.employee_id
		WHERE u.username = $1`,
		username,
	).Scan(
		&user.ID,
		&user.Username,
		&user.PasswordHash,
		&user.Role,
		&user.EmployeeID,
		&user.EmployeeName,
	)

	if err != nil {

		if err == sql.ErrNoRows {
			return nil, err
		}

		return nil, err
	}

	return &user, nil
}