@echo off
echo ===================================
echo TodoList Database Setup
echo ===================================
echo.

echo Checking if MySQL is available...
mysql --version
if errorlevel 1 (
    echo.
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your system PATH
    echo You can download MySQL from: https://dev.mysql.com/downloads/
    echo.
    pause
    exit /b 1
)

echo.
set /p MYSQL_USER=Enter MySQL username (default: root):
if "%MYSQL_USER%"=="" set MYSQL_USER=root

set /p MYSQL_PASS=Enter MySQL password (press Enter if none):

set /p CREATE_DB=Create database 'todolist'? (Y/n):
if /i "%CREATE_DB%"=="n" goto :skip_create

echo.
echo Creating database and tables...
if "%MYSQL_PASS%"=="" (
    mysql -u %MYSQL_USER% -e "SOURCE backend/init-database.sql"
) else (
    mysql -u %MYSQL_USER% -p%MYSQL_PASS% -e "SOURCE backend/init-database.sql"
)

if errorlevel 1 (
    echo.
    echo ERROR: Failed to create database
    echo Please check your MySQL credentials and try again
    pause
    exit /b 1
)

echo.
echo ✅ Database setup completed successfully!
echo.
echo You can now start the application:
echo 1. Open terminal 1: cd backend ^&^& npm run dev
echo 2. Open terminal 2: cd frontend ^&^& npm run dev

echo.
echo Default demo user:
echo Username: demo
echo Password: password123

:skip_create
echo.
echo Database setup skipped. Please create the database manually.
echo Use the SQL script: backend/init-database.sql

echo.
pause