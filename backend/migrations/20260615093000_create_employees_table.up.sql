CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    shift VARCHAR(50),
    status VARCHAR(50),
    total_sales BIGINT DEFAULT 0,
    transactions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);