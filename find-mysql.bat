@echo off
echo ===================================
echo 查找MySQL安装位置
echo ===================================
echo.

set MYSQL_PATH=

REM 检查常见安装路径
if exist "C:\Program Files\MySQL" (
    echo 在 C:\Program Files\MySQL 找到MySQL
    dir "C:\Program Files\MySQL"
    echo.
    set /p MYSQL_VERSION=请输入你的MySQL版本号 (例如 8.0):
    if exist "C:\Program Files\MySQL\MySQL Server %MYSQL_VERSION%\bin\mysql.exe" (
        set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server %MYSQL_VERSION%\bin\mysql.exe"
        echo 找到mysql.exe: %MYSQL_PATH%
    )
)

if exist "C:\Program Files (x86)\MySQL" (
    echo.
    echo 在 C:\Program Files (x86)\MySQL 也找到MySQL
    dir "C:\Program Files (x86)\MySQL"
)

if "%MYSQL_PATH%"=="" (
    echo.
    echo 未找到MySQL，请手动输入路径:
    set /p MYSQL_PATH=请输入mysql.exe的完整路径:
)

if not "%MYSQL_PATH%"=="" (
    echo.
    echo 使用MySQL: %MYSQL_PATH%
    echo.

    set /p MYSQL_USER=MySQL用户名 (默认root):
    if "%MYSQL_USER%"=="" set MYSQL_USER=root

    echo.
    echo 正在测试连接...
    "%MYSQL_PATH%" -u %MYSQL_USER% -e "SELECT VERSION();" 2>nul

    if errorlevel 1 (
        echo.
        echo 连接失败，需要密码
        "%MYSQL_PATH%" -u %MYSQL_USER% -p -e "SELECT VERSION();"
        if errorlevel 1 (
            echo MySQL连接失败
            pause
            exit /b 1
        )
    )

    echo.
    echo ✅ MySQL连接成功！
    echo.
    echo 现在创建todolist数据库...

    echo CREATE DATABASE IF NOT EXISTS todolist; | "%MYSQL_PATH%" -u %MYSQL_USER% -p
    echo USE todolist; | "%MYSQL_PATH%" -u %MYSQL_USER% -p

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
    echo     FOREIGN KEY (user_id^) REFERENCES users(id^) ON DELETE CASCADE
    echo ^);
    ) | "%MYSQL_PATH%" -u %MYSQL_USER% -p todolist

    echo.
    echo ✅ 数据库创建完成！
    echo.
    echo 请配置 backend/.env 文件:
    echo DB_HOST=localhost
    echo DB_USER=%MYSQL_USER%
    echo DB_PASSWORD=你的密码
    echo DB_NAME=todolist
    echo JWT_SECRET=你的密钥
)

echo.
pause