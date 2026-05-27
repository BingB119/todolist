@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   TodoList 项目 GitHub 初始化推送脚本
echo ========================================
echo.

:: ---- 配置区：只需修改下面这两行 ----
set GITHUB_USERNAME=BingB119
set GITHUB_REPO=todolist
:: ------------------------------------

set REMOTE_URL=https://github.com/%GITHUB_USERNAME%/%GITHUB_REPO%.git

echo [1/5] 初始化 Git 仓库...
git init

echo [2/5] 添加所有文件...
git add .

echo [3/5] 提交...
git commit -m "feat: initial commit - todolist full-stack app"

echo [4/5] 设置主分支为 main...
git branch -M main

echo [5/5] 关联远程仓库并推送...
git remote remove origin 2>nul
git remote add origin %REMOTE_URL%
git push -u origin main

echo.
echo ========================================
echo   推送完成！GitHub Actions 已自动触发
echo   查看部署进度：
echo   https://github.com/%GITHUB_USERNAME%/%GITHUB_REPO%/actions
echo ========================================
pause
