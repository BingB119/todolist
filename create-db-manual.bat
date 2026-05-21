@echo off
echo ===================================
echo TodoList Database Manual Setup
echo ===================================
echo.

echo 方法 1: 使用MySQL命令行
echo ------------------------
echo 1. 打开命令提示符
echo 2. 导航到MySQL的bin目录，例如:
echo    cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
echo 3. 连接到MySQL:
echo    mysql -u root -p
echo 4. 运行以下SQL命令:

echo.
echo CREATE DATABASE IF NOT EXISTS todolist;
USE todolist;

echo CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

echo CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

echo.
echo ✅ 数据库创建完成！

echo.
echo 方法 2: 使用MySQL Workbench
echo -----------------------------
echo 1. 打开MySQL Workbench
echo 2. 连接到你的MySQL服务器
echo 3. 点击 "Create a new schema"
echo 4. 输入 "todolist" 作为schema名称
echo 5. 选择新创建的todolist数据库
echo 6. 打开 backend/init-database.sql 文件
echo 7. 执行SQL脚本

echo.
echo 创建完成后，配置 backend/.env 文件:

echo DB_HOST=localhost
echo DB_USER=root
echo DB_PASSWORD=你的密码
echo DB_NAME=todolist
echo JWT_SECRET=你的密钥

echo.
pause