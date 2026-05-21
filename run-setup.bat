@echo off
echo ===================================
echo TodoList 数据库设置
echo ===================================
echo.
echo 这个脚本将帮助你创建数据库
echo 需要Node.js来运行
pause

cd /d "%~dp0"
node setup-mysql.js

pause