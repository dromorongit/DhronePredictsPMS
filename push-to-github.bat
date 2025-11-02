@echo off
echo 🚀 DhronePredicts Management System - GitHub Push Script
echo ============================================================

REM Check if git is initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
)

echo Adding all files to Git...
git add .

echo Making initial commit...
git commit -m "Initial commit: DhronePredicts Management System"

echo Setting main branch...
git branch -M main

REM Check if remote already exists
git remote get-url origin >nul 2>&1
if %errorlevel% == 0 (
    echo Remote origin already exists. Updating...
    git remote set-url origin https://github.com/YOUR_USERNAME/dhronepredicts-management.git
) else (
    echo Adding remote origin...
    git remote add origin https://github.com/YOUR_USERNAME/dhronepredicts-management.git
)

echo.
echo ⚠️  IMPORTANT: Replace YOUR_USERNAME with your actual GitHub username
echo    Update this line in the script: https://github.com/YOUR_USERNAME/dhronepredicts-management.git
echo.
echo Next steps:
echo 1. Update the remote URL with your GitHub username
echo 2. Push to GitHub: git push -u origin main
echo.
echo Ready to push to GitHub! 🎉
pause