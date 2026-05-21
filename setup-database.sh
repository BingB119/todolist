#!/bin/bash

echo "==================================="
echo "TodoList Database Setup"
echo "==================================="
echo

# Check if MySQL is available
if ! command -v mysql &> /dev/null; then
    echo "ERROR: MySQL is not installed or not in PATH"
    echo "Please install MySQL and add it to your system PATH"
    echo "You can download MySQL from: https://dev.mysql.com/downloads/"
    exit 1
fi

echo "MySQL found: $(mysql --version)"
echo

# Get MySQL credentials
read -p "Enter MySQL username (default: root): " MYSQL_USER
MYSQL_USER=${MYSQL_USER:-root}

read -s -p "Enter MySQL password (press Enter if none): " MYSQL_PASS
echo

read -p "Create database 'todolist'? (Y/n): " CREATE_DB
if [[ $CREATE_DB =~ ^[Nn]$ ]]; then
    echo
    echo "Database setup skipped. Please create the database manually."
    echo "Use the SQL script: backend/init-database.sql"
    exit 0
fi

echo
echo "Creating database and tables..."

if [ -z "$MYSQL_PASS" ]; then
    mysql -u "$MYSQL_USER" -e "SOURCE backend/init-database.sql"
else
    mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" -e "SOURCE backend/init-database.sql"
fi

if [ $? -eq 0 ]; then
    echo
    echo "✅ Database setup completed successfully!"
    echo
    echo "You can now start the application:"
    echo "1. Terminal 1: cd backend && npm run dev"
    echo "2. Terminal 2: cd frontend && npm run dev"
    echo
    echo "Default demo user:"
    echo "Username: demo"
    echo "Password: password123"
else
    echo
    echo "❌ ERROR: Failed to create database"
    echo "Please check your MySQL credentials and try again"
    exit 1
fi