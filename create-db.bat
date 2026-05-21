@echo off
echo ===================================
echo 创建TodoList数据库
echo ===================================
echo.

set MYSQL_PATH="D:\phpstudy_pro\Extensions\MySQL8.0.12\bin\mysql.exe"

if not exist %MYSQL_PATH% (
    echo ❌ 未找到MySQL可执行文件
    echo 请检查路径: %MYSQL_PATH%
    echo.
    set /p MYSQL_PATH=请手动输入mysql.exe的完整路径:
)

echo 使用MySQL: %MYSQL_PATH%
echo.

set /p MYSQL_USER=MySQL用户名 (默认root):
if "%MYSQL_USER%"=="" set MYSQL_USER=root

echo.
echo 正在测试MySQL连接...
%MYSQL_PATH% -u %MYSQL_USER% -e "SELECT VERSION();" 2>nul

if errorlevel 1 (
    echo.
    echo 需要密码，请输入:
    %MYSQL_PATH% -u %MYSQL_USER% -p -e "SELECT VERSION();"
    if errorlevel 1 (
        echo.
        echo ❌ MySQL连接失败
        pause
        exit /b 1
    )
)

echo.
echo ✅ MySQL连接成功！
echo.
echo 正在创建todolist数据库...
%MYSQL_PATH% -u %MYSQL_USER% -p -e "CREATE DATABASE IF NOT EXISTS todolist;"

if errorlevel 1 (
    echo ❌ 创建数据库失败
    pause
    exit /b 1
)

echo.
echo 正在创建数据表...

(
echo CREATE TABLE IF NOT EXISTS users (
    echo     id INT AUTO_INCREMENT PRIMARY KEY,
    echo     username VARCHAR(50) UNIQUE NOT NULL,
    echo     password VARCHAR(255) NOT NULL,
    echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    echo ^);
    echo.
    echo CREATE TABLE IF NOT EXISTS todos (
    echo     id INT AUTO_INCREMENT PRIMARY KEY,
    echo     user_id INT NOT NULL,
    echo     title VARCHAR(255) NOT NULL,
    echo     description TEXT,
    echo     completed BOOLEAN DEFAULT FALSE,
    echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    echo     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    echo     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    echo ^);
    ) | %MYSQL_PATH% -u %MYSQL_USER% -p todolist

if errorlevel 1 (
    echo ❌ 创建表失败
    pause
    exit /b 1
)

echo.
echo ✅ 数据库和表创建成功！
echo.
echo 接下来配置 backend/.env 文件:
echo 编辑 backend/.env 并设置:
echo DB_HOST=localhost
echo DB_USER=%MYSQL_USER%
echo DB_PASSWORD=你的MySQL密码
echo DB_NAME=todolist
echo JWT_SECRET=任意长字符串
echo PORT=3000
echo.
echo 然后可以启动应用了！
echo.
pause